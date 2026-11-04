'use strict';
/* ---------- archive ---------- */
const KEY='dream-recorder-v1';let archive=[];
try{archive=JSON.parse(localStorage.getItem(KEY)||'[]')||[];}catch(e){archive=[];}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(archive));}catch(e){}}
function snap(){
  const o=document.createElement('canvas'),n=220;o.width=o.height=n;const c=o.getContext('2d');
  c.fillStyle='#050507';c.fillRect(0,0,n,n);
  const s=U*1.02*DPR;c.drawImage(cv,cx*DPR-s,cy*DPR-s,s*2,s*2,0,0,n,n);
  try{return o.toDataURL('image/jpeg',.72);}catch(e){return'';}
}
function save(text,emo){
  archive.unshift({id:Date.now(),text,emo,ts:Date.now(),thumb:snap()});archive=archive.slice(0,24);
  persist();renderArchive();toast('已存入梦境档案');
}
const pad2=n=>String(n).padStart(2,'0');
function renderArchive(){
  $('#archN').textContent=archive.length;
  const g=$('#grid');g.textContent='';
  if(!archive.length){const d=document.createElement('p');d.className='empty';d.textContent='还没有记录。生成一个梦，它会自动保存在这里，之后可以重新打开并拨动文字。';g.append(d);return;}
  archive.forEach(a=>{
    const w=document.createElement('div');w.className='card';
    const b=document.createElement('button');b.className='card';b.style.cssText='display:flex;flex-direction:column;gap:6px;text-align:left;width:100%';
    const d=new Date(a.ts);
    if(a.thumb){const im=document.createElement('img');im.src=a.thumb;im.alt='';b.append(im);}
    const m=document.createElement('span');m.className='meta';m.textContent=`${pad2(d.getMonth()+1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())} · ${(EMO[a.emo]||EMO.calm).zh}`;
    const t=document.createElement('span');t.className='txt';t.textContent=a.text;b.append(m,t);
    b.onclick=()=>{closeArchive();$('#inp').value=a.text;autosize();commit(a.text,'archive',a.emo);};
    const x=document.createElement('button');x.className='del';x.textContent='×';x.setAttribute('aria-label','删除这条记录');
    x.onclick=()=>{archive=archive.filter(z=>z.id!==a.id);persist();renderArchive();};
    w.append(b,x);g.append(w);});
}
function openArchive(){$('#arch').hidden=false;}
function closeArchive(){$('#arch').hidden=true;}
