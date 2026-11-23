'use strict';
/* A signed-in archive belongs to one immutable GitHub ID. Legacy local records
   remain separate until the person explicitly imports them. */
let cloudUser=null,cloudTimer=0,cloudPending=null,cloudChain=Promise.resolve();
const cloudText=(zh,en)=>LANG==='en'?en:zh;
const cloudStatus=(zh,en)=>{$('#cloudStatus').textContent=cloudText(zh,en);};
function queueCloudSync(entries){
  if(!cloudUser||new URLSearchParams(location.search).has('demo'))return;
  cloudPending={id:cloudUser.id,entries:structuredClone(entries)};
  cloudStatus('正在同步到账号…','Syncing to your account…');
  clearTimeout(cloudTimer);
  cloudTimer=setTimeout(()=>{
    const job=cloudPending;cloudPending=null;
    cloudChain=cloudChain.catch(()=>{}).then(async()=>{
      if(!job||!cloudUser||cloudUser.id!==job.id)return;
      const response=await fetch('/api/archive',{method:'PUT',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({entries:job.entries})});
      if(!response.ok)throw Error('sync failed');
      if(cloudUser&&cloudUser.id===job.id&&!cloudPending)cloudStatus('已同步到 GitHub 账号','Synced to your GitHub account');
    }).catch(()=>cloudStatus('云端同步失败；本机副本仍在，请稍后重试','Cloud sync failed; a local copy remains. Please retry later'));
  },500);
}
function validEntries(value){return Array.isArray(value)?value.filter(x=>x&&typeof x.id==='string'&&typeof x.text==='string'&&x.text.trim()).slice(0,24):[];}
function readLocal(key){try{return validEntries(JSON.parse(localStorage.getItem(key)||'[]'));}catch{return[];}}
async function initCloud(){
  if(new URLSearchParams(location.search).has('demo'))return;
  let response;try{response=await fetch('/api/me',{credentials:'same-origin'});}catch{return;}
  if(!response.ok)return;
  const me=await response.json();
  if(!me.available)return;
  $('#btnLogin').hidden=!!me.user;$('#btnLogout').hidden=!me.user;
  if(!me.user){cloudStatus('仅保存在此浏览器；登录后可跨设备找回','Saved in this browser only; sign in to sync across devices');return;}
  cloudUser=me.user;
  const cacheKey='dream-recorder-user-'+cloudUser.id;
  const cached=readLocal(cacheKey);
  archive=cached;renderArchive();
  try{
    const result=await fetch('/api/archive',{credentials:'same-origin'});
    if(!result.ok)throw Error('read failed');
    const remote=validEntries((await result.json()).entries);
    const merged=[...new Map([...remote,...cached].map(x=>[x.id,x])).values()].sort((a,b)=>b.ts-a.ts).slice(0,24);
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
  await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});
  location.reload();
};
initCloud();
