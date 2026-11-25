'use strict';
/* A signed-in archive belongs to one immutable GitHub ID. Legacy local records
   remain separate until the person explicitly imports them. */
let cloudUser=null,cloudTimer=0,cloudPending=null,cloudChain=Promise.resolve();
const cloudText=(zh,en)=>LANG==='en'?en:zh;
const cloudStatus=(zh,en)=>{$('#cloudStatus').textContent=cloudText(zh,en);};
function queueCloudSync(entries){
  if(!cloudUser)return;
  try{localStorage.setItem('dream-recorder-user-'+cloudUser.id+'-dirty','1');}catch{}
  cloudPending={id:cloudUser.id,entries:structuredClone(entries)};
  cloudStatus('正在同步到账号…','Syncing to your account…');
  clearTimeout(cloudTimer);
  cloudTimer=setTimeout(()=>{
    const job=cloudPending;cloudPending=null;
    cloudChain=cloudChain.catch(()=>{}).then(async()=>{
      if(!job||!cloudUser||cloudUser.id!==job.id)return;
      const response=await fetch('/api/archive',{method:'PUT',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({entries:job.entries})});
      if(!response.ok)throw Error('sync failed');
      if(cloudUser&&cloudUser.id===job.id&&!cloudPending){
        try{localStorage.removeItem('dream-recorder-user-'+job.id+'-dirty');}catch{}
        cloudStatus('已同步到 GitHub 账号','Synced to your GitHub account');
      }
    }).catch(()=>cloudStatus('云端同步失败；本机副本仍在，请稍后重试','Cloud sync failed; a local copy remains. Please retry later'));
  },500);
}
function validEntries(value){return Array.isArray(value)?value.filter(x=>x&&typeof x.id==='string'&&typeof x.text==='string'&&x.text.trim()).slice(0,24):[];}
function readLocal(key){try{return validEntries(JSON.parse(localStorage.getItem(key)||'[]'));}catch{return[];}}
const entry=$('#entry'),entryLogin=$('#entryLogin'),entryGuest=$('#entryGuest');
const entryQuery=new URLSearchParams(location.search);
const accountPath='/api/auth/github';
const hostedLogin=location.hostname==='sd5913.github.io'?'https://dream-recorder.final-work.workers.dev'+accountPath:'';
function showEntryStatus(key){
  const status=$('#entryStatus');
  status.dataset.i18n=key;
  status.textContent=tx(key);
}
function enterRecorder(){
  const moveFocus=entry.contains(document.activeElement);
  entry.hidden=true;
  document.body.classList.remove('entry-open');
  $('#ui').inert=false;
  cv.removeAttribute('aria-hidden');
  if(entryQuery.has('demo'))openArchive();
  if(moveFocus)(entryQuery.has('demo')?$('#archClose'):$('#btnArch')).focus();
}
async function checkAccount(){
  if(location.protocol==='file:'||hostedLogin)return null;
  try{
    const response=await fetch('/api/me',{credentials:'same-origin',signal:AbortSignal.timeout(4000)});
    return response.ok?await response.json():null;
  }catch{return null;}
}
async function loadAccountArchive(me){
  cloudUser=me.user;
  const cacheKey='dream-recorder-user-'+cloudUser.id;
  const cached=readLocal(cacheKey);
  archive=cached;renderArchive();
  try{
    const result=await fetch('/api/archive',{credentials:'same-origin',signal:AbortSignal.timeout(5000)});
    if(!result.ok)throw Error('read failed');
    const remote=validEntries((await result.json()).entries);
    const dirty=localStorage.getItem(cacheKey+'-dirty')==='1';
    const merged=dirty?[...new Map([...remote,...cached].map(x=>[x.id,x])).values()].sort((a,b)=>b.ts-a.ts).slice(0,24):remote;
    archive=merged;localStorage.setItem(cacheKey,JSON.stringify(merged));renderArchive();
    if(JSON.stringify(merged)!==JSON.stringify(remote))queueCloudSync(merged);
    else cloudStatus('已同步到 GitHub 账号','Synced to your GitHub account');
  }catch{cloudStatus('云端暂不可用；显示此账号的本机副本','Cloud unavailable; showing this account’s local copy');}
  $('#btnImport').hidden=!readLocal(KEY).length;
}
$('#btnImport').onclick=()=>{
  if(!cloudUser)return;
  archive=[...new Map([...archive,...readLocal(KEY)].map(x=>[x.id,x])).values()].sort((a,b)=>b.ts-a.ts).slice(0,24);
  persist(archive);renderArchive();$('#btnImport').hidden=true;
};
$('#btnLogout').onclick=async()=>{
  const button=$('#btnLogout');
  button.disabled=true;
  try{
    flushSave();
    const response=await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin',signal:AbortSignal.timeout(4000)});
    if(!response.ok)throw Error('sign-out failed');
    location.reload();
  }catch{button.disabled=false;toast(tx('logoutFailed'));}
};
const accountCheck=checkAccount();
const loginLink=$('#btnLogin');
if(hostedLogin){
  loginLink.href=hostedLogin;
  loginLink.hidden=false;
}
$('#entryLang').onclick=()=>setLang(LANG==='en'?'zh':'en');
entryGuest.onclick=enterRecorder;
entryLogin.onclick=async()=>{
  entryLogin.disabled=true;
  const destination=hostedLogin||((await accountCheck)?.available?accountPath:'');
  if(entry.hidden)return;
  if(destination){location.assign(destination);return;}
  showEntryStatus('loginUnavailable');
  entryLogin.disabled=false;
};
if(entryQuery.has('loginFailed')){
  showEntryStatus('loginFailed');
  const cleanUrl=new URL(location.href);
  cleanUrl.searchParams.delete('loginFailed');
  history.replaceState(history.state,'',cleanUrl);
}
addEventListener('pageshow',event=>{if(event.persisted)entryLogin.disabled=false;});
accountCheck.then(async me=>{
  if(!me?.available)return;
  if(!me.user||entry.hidden){
    loginLink.hidden=false;
    cloudStatus('仅保存在此浏览器；登录后可跨设备找回','Saved in this browser only; sign in to sync across devices');
    return;
  }
  entryLogin.disabled=entryGuest.disabled=true;
  await loadAccountArchive(me);
  $('#btnLogout').hidden=false;
  enterRecorder();
});
