'use strict';
/* ---------- archive ---------- */
const KEY='dream-recorder-v1',LEGACY_KEY='dream-recorder-demo-v1';let archive=[],legacyArchive=[],archiveExamples=[];
try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');archive=Array.isArray(a)?a.filter(a=>a&&typeof a.text==='string'&&a.text.trim()).slice(0,24):[];}catch(e){archive=[];}
try{const a=JSON.parse(localStorage.getItem(LEGACY_KEY)||'[]');legacyArchive=Array.isArray(a)?a.filter(a=>a&&typeof a.text==='string'&&a.text.trim()):[];}catch(e){}
function archiveEntries(){
  const entries=archive.slice(),ids=new Set(entries.map(a=>a.id));
  for(const a of (typeof cloudUser!=='undefined'&&cloudUser?[]:legacyArchive))if(!ids.has(a.id)){entries.push({...a,_legacy:true});ids.add(a.id);}
  const present=new Set(entries.map(a=>a.text+'\n'+a.emo));
  return entries.concat(archiveExamples.filter(a=>!present.has(a.text+'\n'+a.emo)));
}
function removeArchiveEntry(a){
  if(a._preset)return false;
  if(a._legacy){const next=legacyArchive.filter(z=>z.id!==a.id);try{localStorage.setItem(LEGACY_KEY,JSON.stringify(next));legacyArchive=next;return true;}catch(e){toast(tx('delFail'));return false;}}
  if(!persist(archive.filter(z=>z.id!==a.id))){toast(tx('delFail'));return false;}return true;
}
/* Commit to memory only after storage succeeds. Retry without thumbnails on quota pressure. */
function persist(next=archive){
  const storageKey=typeof cloudUser!=='undefined'&&cloudUser?'dream-recorder-user-'+cloudUser.id:KEY;
  try{localStorage.setItem(storageKey,JSON.stringify(next));archive=next;if(typeof queueCloudSync==='function')queueCloudSync(next);return 'saved';}catch(e){}
  const lean=next.map(a=>({...a,thumb:''}));
  try{localStorage.setItem(storageKey,JSON.stringify(lean));archive=lean;if(typeof queueCloudSync==='function')queueCloudSync(lean);return 'savedTrim';}catch(e){return null;}
}
function snap(){
  const o=document.createElement('canvas'),n=220;o.width=o.height=n;const c=o.getContext('2d');
  c.fillStyle='#050507';c.fillRect(0,0,n,n);
  const s=U*1.02*DPR;c.drawImage(cv,cx*DPR-s,cy*DPR-s,s*2,s*2,0,0,n,n);
  try{return o.toDataURL('image/jpeg',.72);}catch(e){return'';}
}
function save(text,emo){
  const shape=typeof dreamShape==='function'?dreamShape():null;
  const next=[{id:Date.now()+'-'+Math.random().toString(36).slice(2,8),text,emo,ts:Date.now(),thumb:snap(),shape},...archive].slice(0,24);
  const result=persist(next);if(!result){toast(tx('saveFail'));return false;}
  renderArchive();toast(tx(result));return true;
}
const pad2=n=>String(n).padStart(2,'0');
function renderArchive(){
  const entries=archiveEntries();$('#archN').textContent=entries.length;
  const g=$('#grid');g.textContent='';
  if(!entries.length){const d=document.createElement('p');d.className='empty';d.textContent=tx('empty');g.append(d);return;}
  entries.forEach(a=>{
    const w=document.createElement('div');w.className='card';
    const b=document.createElement('button');b.className='card';b.style.cssText='display:flex;flex-direction:column;gap:6px;text-align:left;width:100%';
    const d=new Date(a.ts);
    if(a.thumb){const im=document.createElement('img');im.src=a.thumb;im.alt='';b.append(im);}
    const m=document.createElement('span');m.className='meta';m.textContent=(a._preset?tx('samples'):`${pad2(d.getMonth()+1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`)+' · '+emoName(a.emo||'calm');
    const t=document.createElement('span');t.className='txt';t.textContent=a.text;b.append(m,t);
    b.onclick=()=>{closeArchive();$('#inp').value=a.text;autosize();commit(a.text,'archive',a.emo);};
    const x=document.createElement('button');x.className='del';x.textContent='×';x.setAttribute('aria-label',tx('del'));
    x.onclick=()=>{if(removeArchiveEntry(a))renderArchive();};
    w.append(b);if(!a._preset)w.append(x);g.append(w);});
}
function openArchive(){flushSave();$('#arch').hidden=false;setSkyView(skyView);}
function closeArchive(){$('#arch').hidden=true;stopSky();}
