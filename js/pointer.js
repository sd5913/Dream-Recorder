'use strict';
/* ---------- pointer ---------- */
const ptr={on:false,x:0,y:0,vx:0,vy:0,px:0,py:0,t:0};
function setPtr(e,on){
  const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,now=performance.now(),dt=Math.max(8,now-ptr.t)/1000;
  if(on&&ptr.on){ptr.vx=mix(ptr.vx,(x-ptr.x)/dt,.4);ptr.vy=mix(ptr.vy,(y-ptr.y)/dt,.4);}else{ptr.vx=ptr.vy=0;}
  ptr.x=x;ptr.y=y;ptr.t=now;ptr.on=on;
  if(on&&Math.hypot(ptr.vx,ptr.vy)>260)Snd.pluck(x/W,y/H);
}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);setPtr(e,true);});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||ptr.on)setPtr(e,true);});
['pointerup','pointercancel','pointerleave'].forEach(n=>cv.addEventListener(n,e=>{ptr.on=false;}));
