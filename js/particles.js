'use strict';
/* ---------- particles ---------- */
let parts=[],dying=[],T=0,E=EMO.calm,emoKey='calm',userEmo=null,cur=null,token=0,saveTimer=0,pendingSave=null;
/* one palette per dream: every colour is pulled into a band of about +/-45 degrees around the mood's hue.
   Warm things stay on the warm side of the band and cool things on the cool side, so scenes stay distinguishable but belong together. */
function harmHue(h,mood){const d=((h-mood+540)%360)-180;return mood+46*Math.tanh(d/80);}
function tint(p){
  let h=p.base[0]+p.jh,s=p.base[1],l=p.base[2]+p.jl;
  /* a colour word (white elephant) colours the things, not the sky or the ground, unless the picture is a single scene */
  const tn=p.si>=0&&cur&&cur.tone&&(p.cat==='hero'||cur.names.length===1)?cur.tone:null;
  if(tn){if(tn.h!=null)h=tn.h+p.jh;s*=tn.s;l+=tn.l;}
  else if(E.rainbow)h=h+p.ux*110+p.uy*70+T*0;
  else h=harmHue(h,E.hue);
  h=((h%360)+360)%360;s=clamp(s*E.s,0,100);l=clamp(l+E.l,14,90);
  p.css=`hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`;
}
function applyEmotion(k){
  emoKey=k;E=EMO[k];
  const u=E.ui,css=`hsl(${u[0]} ${u[1]}% ${u[2]}%)`;document.documentElement.style.setProperty('--emo',css);
  parts.forEach(tint);Snd.mood();
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.k===userEmo)));
  const e=$('#cap .emo');if(e)e.textContent=emoName(emoKey);
}
function spawn(list,instant){
  const out=list.map((q,i)=>{
    const p=Object.assign({},q);tint(p);
    const tx=cx+p.ux*U,ty=cy+p.uy*U;
    if(instant||reduce){p.x=tx;p.y=ty;p.age=9;p.delay=0;}
    else{const a=Math.random()*TAU,r=U*(1.15+Math.random()*.9);p.x=cx+Math.cos(a)*r;p.y=cy+Math.sin(a)*r*.8;
      p.vx=-Math.sin(a)*U*.9;p.vy=Math.cos(a)*U*.9;p.age=0;p.delay=(i/list.length)*1.5+Math.random()*.3;}
    p.vx=p.vx||0;p.vy=p.vy||0;p.a=p.ang+(instant?0:(Math.random()-.5)*3);p.va=0;
    return p;});
  return out;
}
function retire(){
  dying=dying.concat(parts.map(p=>{const dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy)||1,f=U*(.5+Math.random()*1.1);
    p.vx=dx/d*f+(Math.random()-.5)*U*.5;p.vy=dy/d*f+(Math.random()-.5)*U*.5;p.fade=1;return p;}));
  parts=[];
}
/* ---------- transition between two dreams ----------
   Words that exist in both pictures fly from their old place to the new one; new words grow out of the old picture; words that are gone drift away.
   This is also what makes "draw while typing" feel continuous. */
function morph(list){
  if(reduce||!parts.length)return spawn(list,reduce);
  const pool=new Map(),old=parts;
  old.forEach(p=>{if(p.age>=p.delay){const a=pool.get(p.t);a?a.push(p):pool.set(p.t,[p]);}});
  const out=list.map((q,i)=>{
    const p=Object.assign({},q);tint(p);
    const a=pool.get(q.t),o=a&&a.length?a.pop():null;
    if(o){o.used=1;p.x=o.x;p.y=o.y;p.vx=o.vx*.4;p.vy=o.vy*.4;p.a=o.a;p.va=o.va||0;p.age=.5;p.delay=0;}
    else{const s=old[(Math.random()*old.length)|0];p.x=s.x+(Math.random()-.5)*U*.2;p.y=s.y+(Math.random()-.5)*U*.2;p.vx=p.vy=0;p.a=p.ang+(Math.random()-.5)*2;p.va=0;p.age=0;p.delay=Math.random()*.5+(i/list.length)*.5;}
    return p;});
  dying=dying.concat(old.filter(p=>!p.used).map(p=>{const dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy)||1,f=U*(.2+Math.random()*.5);
    p.vx=dx/d*f;p.vy=dy/d*f;p.fade=1;return p;}));
  return out;
}
