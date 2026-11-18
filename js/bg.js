'use strict';
/* ---------- living background ----------
   A second canvas behind the words: slow star dust with parallax (pointer, or tilt on phones) and two soft glows in the colour of the mood.
   Drawn at 1x and every other frame so it costs almost nothing. With "reduce motion" it is drawn still. */
const bgc=$('#bg'),bgx=bgc?bgc.getContext('2d'):null;
const DUST=[];{const r=rng(20261115);for(let i=0;i<110;i++)DUST.push({x:r(),y:r(),z:.15+r()*.85,ph:r()*TAU,sp:.3+r()*1.2});}
const par={x:0,y:0,tx:0,ty:0};let bgTick=0,bgHue=200;
addEventListener('pointermove',e=>{par.tx=(e.clientX/innerWidth-.5);par.ty=(e.clientY/innerHeight-.5);},{passive:true});
addEventListener('deviceorientation',e=>{if(e.gamma==null)return;par.tx=clamp(e.gamma/45,-1,1)*.5;par.ty=clamp((e.beta-45)/45,-1,1)*.5;},{passive:true});
function sizeBg(){if(!bgc)return;bgc.width=Math.round(innerWidth);bgc.height=Math.round(innerHeight);drawBg(0,true);}
function drawBg(dt,force){
  if(!bgx)return;
  if(!force){if(reduce)return;if((bgTick++)&1)return;}
  const w=bgc.width,h=bgc.height;
  par.x+=(par.tx-par.x)*.06;par.y+=(par.ty-par.y)*.06;
  const target=E.rainbow?(T*14)%360:E.hue;let dh=((target-bgHue+540)%360)-180;bgHue=(bgHue+dh*.03+360)%360;
  bgx.clearRect(0,0,w,h);
  const m=Math.max(w,h);
  [[.28,.3,.62,0],[.74,.62,.55,40]].forEach(([gx,gy,gr,off],i)=>{
    const x=(gx+Math.sin(T*.05+i*2)*.08-par.x*.04)*w,y=(gy+Math.cos(T*.04+i)*.06-par.y*.04)*h,r=gr*m;
    const g=bgx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`hsla(${(bgHue+off)%360} 60% 45% / .13)`);g.addColorStop(1,'hsla(0 0% 0% / 0)');
    bgx.fillStyle=g;bgx.fillRect(0,0,w,h);});
  for(const d of DUST){
    const x=((d.x+T*.004*d.z-par.x*.05*d.z)%1+1)%1*w,y=((d.y-par.y*.05*d.z)%1+1)%1*h;
    const a=(.25+.75*(.5+.5*Math.sin(d.ph+T*d.sp)))*d.z*.55;
    bgx.fillStyle=`hsla(${bgHue} 30% 85% / ${a.toFixed(3)})`;const s=d.z>.8?1.6:1;bgx.fillRect(x,y,s,s);
  }
}
