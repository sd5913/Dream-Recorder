'use strict';
/* ---------- main loop ---------- */
let last=performance.now();
function frame(now){
  const dt=Math.min(.033,(now-last)/1000||.016);last=now;T+=dt;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${fontPx}px ${FONT}`;
  const RR=U*.3,amp=reduce?0:E.sway*U,tr=reduce?0:E.trem*U;
  for(const p of parts){
    p.age+=dt;if(p.age<p.delay)continue;
    const a=p.age-p.delay,ease=Math.min(1,a/1.5),ke=E.k*(.12+.88*ease*ease),ce=E.c*(.55+.45*ease);
    const tx=cx+p.ux*U+Math.sin(p.ph+T*E.fr+p.ux*3)*amp+(tr?(Math.random()-.5)*tr*2:0);
    const ty=cy+p.uy*U+Math.cos(p.ph*.87+T*E.fr*.85+p.uy*3)*amp+(tr?(Math.random()-.5)*tr*2:0);
    p.vx+=((tx-p.x)*ke-ce*p.vx)*dt;p.vy+=((ty-p.y)*ke-ce*p.vy)*dt;
    if(ptr.on){const dx=p.x-ptr.x,dy=p.y-ptr.y,d=Math.hypot(dx,dy);
      if(d<RR){const f=1-d/RR,f2=f*f,nx=dx/(d||1),ny=dy/(d||1);
        p.vx+=(nx*U*55+(-ny)*U*18)*f2*dt+ptr.vx*f2*.1*dt*60*.5;p.vy+=(ny*U*55+nx*U*18)*f2*dt+ptr.vy*f2*.1*dt*60*.5;p.va+=p.spin*f2*dt*30;}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    let da=p.ang+(E.rainbow?Math.sin(T*1.3+p.ph)*.18:0)-p.a;da=Math.atan2(Math.sin(da),Math.cos(da));
    p.va+=(da*38-p.va*7)*dt;p.a+=p.va*dt;
    const al=Math.min(1,a/.5);
    const c=Math.cos(p.a)*DPR,s=Math.sin(p.a)*DPR;
    ctx.setTransform(c,s,-s,c,p.x*DPR,p.y*DPR);
    ctx.globalAlpha=al;ctx.fillStyle=p.css;ctx.fillText(p.t,0,0);
  }
  if(dying.length){
    for(const p of dying){p.fade-=dt*1.15;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;p.a+=p.va*dt+dt*p.spin*.2;
      if(p.fade<=0||p.age<p.delay)continue;
      const c=Math.cos(p.a)*DPR,s=Math.sin(p.a)*DPR;ctx.setTransform(c,s,-s,c,p.x*DPR,p.y*DPR);ctx.globalAlpha=p.fade;ctx.fillStyle=p.css;ctx.fillText(p.t,0,0);}
    dying=dying.filter(p=>p.fade>0);
  }
  ctx.globalAlpha=1;ctx.setTransform(DPR,0,0,DPR,0,0);
  if(ptr.on){const g=ctx.createRadialGradient(ptr.x,ptr.y,0,ptr.x,ptr.y,16);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(ptr.x,ptr.y,16,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ptr.x,ptr.y,2.6,0,TAU);ctx.fill();}
  requestAnimationFrame(frame);
}
