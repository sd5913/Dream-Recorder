'use strict';
/* ---------- particles ---------- */
let parts=[],dying=[],T=0,E=EMO.calm,emoKey='calm',userEmo=null,cur=null,token=0,saveTimer=0;
function tint(p){
  let h=p.base[0]+p.jh,s=p.base[1],l=p.base[2]+p.jl;
  if(E.rainbow)h=h+p.ux*110+p.uy*70+T*0;
  else{const d=((E.hue-h+540)%360)-180;h=h+d*E.mix;}
  h=((h%360)+360)%360;s=clamp(s*E.s,0,100);l=clamp(l+E.l,14,90);
  p.css=`hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`;
}
function applyEmotion(k){
  emoKey=k;E=EMO[k];
  const u=E.ui,css=`hsl(${u[0]} ${u[1]}% ${u[2]}%)`;document.documentElement.style.setProperty('--emo',css);
  parts.forEach(tint);Snd.mood();
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.k===userEmo)));
  const e=$('#cap .emo');if(e)e.textContent=E.zh;
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
