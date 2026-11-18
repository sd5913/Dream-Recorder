'use strict';
/* 3D orbit camera + camera-facing volumetric nebulae, projected onto Canvas 2D.
   Rotate world-space centres; expand each nebula in the camera's right/up basis.
   Local particle depth still affects perspective, size, opacity and depth sorting. */
let skyView='sky',skyRAF=0,skyNodes=[],skySelected=-1,skyYaw=0,skyPitch=.08,skyZoom=1,skyTargetZoom=1;
let skyFocus=[0,0,0],skyTarget=[0,0,0],skyDrag=null,skyMoved=false,skyTime=0;
const skyCanvas=$('#skyc'),skyCtx=skyCanvas.getContext('2d');
let skyW=0,skyH=0,skyDpr=1,skyHits=[];
let skyLast=0,skyVelocity={x:0,y:0};
const skyStars=(()=>{const r=rng(20261118);return Array.from({length:240},()=>[(r()-.5)*55,(r()-.5)*36,(r()-.5)*40,r()]);})();
const skySprites=new Map();
function skySprite(h,s=34){
  h=Math.round(((h%360)+360)%360/8)*8;const key=h+':'+s;if(skySprites.has(key))return skySprites.get(key);
  const sprite=document.createElement('canvas');sprite.width=sprite.height=64;const c=sprite.getContext('2d');
  const g=c.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,247,255,.98)');g.addColorStop(.095,`hsla(${h} 42% 91% / .94)`);
  g.addColorStop(.19,`hsla(${h} ${s}% 79% / .65)`);g.addColorStop(.32,`hsla(${h} ${s}% 63% / .25)`);
  g.addColorStop(.58,`hsla(${h} ${s}% 58% / .12)`);g.addColorStop(1,`hsla(${h} ${s}% 50% / 0)`);
  c.fillStyle=g;c.fillRect(0,0,64,64);skySprites.set(key,sprite);return sprite;
}
function nebulaMist(points,hue){
  const mist=document.createElement('canvas');mist.width=mist.height=512;const c=mist.getContext('2d');
  // Sum density in floating point, quantise once with dithering. Repeated 8-bit
  // transparent gradient draws made visible stripes when a cloud was enlarged.
  const field=new Float32Array(512*512),r=rng(61813+Math.round(hue));
  points.filter((_,i)=>i%12===0).forEach((p,j)=>{
    const cx=256+p.x*136,cy=256+p.y*136,sigma=34+(j%3)*15,rr=sigma*3;
    for(let y=Math.max(0,Math.floor(cy-rr));y<Math.min(512,cy+rr);y++)for(let x=Math.max(0,Math.floor(cx-rr));x<Math.min(512,cx+rr);x++){
      field[y*512+x]+=.032*Math.exp(-((x-cx)**2+(y-cy)**2)/(2*sigma*sigma));
    }
  });
  const h=((hue%360)+360)%360/360,s=.42,l=.43;
  const colour=n=>{const k=(n+h*12)%12;return Math.round(255*(l-s*Math.min(l,1-l)*Math.max(-1,Math.min(k-3,9-k,1))));};
  const rgb=[colour(0),colour(8),colour(4)],pixels=c.createImageData(512,512);
  for(let i=0;i<field.length;i++){const j=i*4;pixels.data[j]=rgb[0];pixels.data[j+1]=rgb[1];pixels.data[j+2]=rgb[2];pixels.data[j+3]=Math.floor(Math.min(.28,field[i])*255+r());}
  c.putImageData(pixels,0,0);return mist;
}
function dreamShape(){
  if(!parts.length)return null;
  const step=Math.max(1,Math.ceil(parts.length/640));
  return parts.filter((p,i)=>i%step===0&&!p.dim).map(p=>[+p.ux.toFixed(3),+p.uy.toFixed(3),p.css]);
}
function legacyShape(a){
  // Older entries have no particle snapshot: rebuild their own scene strokes with a seeded RNG.
  const old={SP,OUT,R};
  try{
    const seed=hash(a.text),names=detectScenes(a.text,EMO[a.emo]?a.emo:'calm',[]),out=[];
    names.slice(0,3).forEach((n,i)=>{
      const st=buildScene(n,1,.055,seed),b=bbox(st),scale=.95/Math.max(b.x1-b.x0,b.y1-b.y0,.1);
      st.forEach(s=>s.pts.forEach((p,j)=>{if(j%3===0)out.push([(p[0]-(b.x0+b.x1)/2)*scale+(i-(names.length-1)/2)*.65,(p[1]-(b.y0+b.y1)/2)*scale]);}));
    });return out.filter((p,i)=>i%Math.max(1,Math.ceil(out.length/640))===0);
  }finally{SP=old.SP;OUT=old.OUT;R=old.R;}
}
function rebuildSky(){
  skyNodes=archive.map((a,i)=>{
    const r=rng(hash(a.text)),angle=i*2.39996,ring=Math.sqrt(i+1)*1.5/Math.max(1,Math.sqrt(archive.length/7));
    const centre=archive.length===1?[0,0,0]:[Math.cos(angle)*ring,Math.sin(angle)*ring*.58,(r()-.5)*5.2];
    let shape=Array.isArray(a.shape)&&a.shape.length?a.shape:legacyShape(a);
    shape=shape.filter(p=>Array.isArray(p)&&Number.isFinite(p[0])&&Number.isFinite(p[1]));
    const hue=(EMO[a.emo]||EMO.calm).hue;
    const xs=shape.map(p=>p[0]),ys=shape.map(p=>p[1]),x0=Math.min(0,...xs),x1=Math.max(0,...xs),y0=Math.min(0,...ys),y1=Math.max(0,...ys);
    const norm=1.8/Math.max(x1-x0,y1-y0,.1);
    // Fewer, individually legible stars: avoid an overexposed solid outline on phones.
    const step=Math.max(1,Math.ceil(shape.length/290));
    const points=shape.filter((_,j)=>j%step===0).map(p=>{
      const x=(p[0]-(x0+x1)/2)*norm,y=(p[1]-(y0+y1)/2)*norm;
      const original=typeof p[2]==='string'?parseFloat((p[2].match(/hsl\(([-.\d]+)/)||[])[1]):hue;
      const h=Number.isFinite(original)?original:hue;
      const colour=h+Math.sin(x*2.1+y*2.7)*15+(r()-.5)*18;
      const softEdge=.64+.36*Math.exp(-.9*((x/.9)**2*.5+(y/.9)**2*.5));
      return {x:x+(r()-.5)*.018,y:y+(r()-.5)*.018,z:(r()+r()+r()-1.5)*.48,phase:r()*TAU,
        size:.012+r()*.009,brightness:(.5+r()*.5)*softEdge,sprite:skySprite(colour),h:colour};
    });
    const names=detectScenes(a.text,EMO[a.emo]?a.emo:'calm',[]);
    return {a,centre,hue,points,names,mist:nebulaMist(points,hue)};
  });skySelected=-1;skyFocus=[0,0,0];skyTarget=[0,0,0];skyTargetZoom=skyZoom=1;skyYaw=0;skyPitch=.08;skyVelocity={x:0,y:0};skyLast=0;
}
function sizeSky(){
  const r=skyCanvas.getBoundingClientRect();skyW=r.width;skyH=r.height;skyDpr=Math.min(devicePixelRatio||1,2);
  skyCanvas.width=Math.round(skyW*skyDpr);skyCanvas.height=Math.round(skyH*skyDpr);
  skyCtx.imageSmoothingEnabled=true;skyCtx.imageSmoothingQuality='high';
}
function setSkyView(v){
  skyView=v;const on=v==='sky';$('#sky').hidden=!on;$('#grid').hidden=on;$('#skyInfo').hidden=!on;
  $('#viewSky').setAttribute('aria-pressed',String(on));$('#viewList').setAttribute('aria-pressed',String(!on));
  stopSky();if(on&&!$('#arch').hidden){rebuildSky();sizeSky();skyCanvas.setAttribute('aria-label',tx('skyAria',archive.length));renderSkyInfo();skyFrame();}
}
function stopSky(){cancelAnimationFrame(skyRAF);skyRAF=0;}
function skyCamera(x,y,z){
  x-=skyFocus[0];y-=skyFocus[1];z-=skyFocus[2];
  const c=Math.cos(skyYaw),s=Math.sin(skyYaw),xx=x*c-z*s,zz=x*s+z*c;
  const cp=Math.cos(skyPitch),sp=Math.sin(skyPitch),yy=y*cp-zz*sp,depth=zz*cp+y*sp;
  return {x:xx,y:yy,z:depth};
}
function skyPerspective(x,y,z){
  // Dolly the camera through space, rather than multiplying a flat image's size.
  const distance=9/skyZoom,depth=distance+z;if(depth<.65||depth>65)return null;
  const perspective=9/depth,scale=Math.min(skyW*.092,skyH*.15)*perspective;
  return {x:skyW/2+x*scale,y:skyH/2+y*scale,s:scale,d:depth,p:perspective};
}
function skyProject(x,y,z){const p=skyCamera(x,y,z);return skyPerspective(p.x,p.y,p.z);}
function skyBillboard(n,q){
  const centre=skyCamera(...n.centre);
  return skyPerspective(centre.x+q.x,centre.y+q.y,centre.z+q.z);
}
function skyFrame(now=performance.now()){
  if($('#arch').hidden||skyView!=='sky'){stopSky();return;}
  const dt=Math.min(.05,skyLast?(now-skyLast)/1000:1/60);skyLast=now;
  if(!reduce)skyTime+=dt;const ease=1-Math.exp(-dt*4);
  skyZoom+=(skyTargetZoom-skyZoom)*ease;skyFocus=skyFocus.map((v,i)=>v+(skyTarget[i]-v)*ease);
  if(!skyDrag&&!reduce){skyYaw+=skyVelocity.x*dt;skyPitch=clamp(skyPitch+skyVelocity.y*dt,-1.25,1.25);const damping=Math.exp(-dt*4.6);skyVelocity.x*=damping;skyVelocity.y*=damping;}
  const c=skyCtx;c.setTransform(skyDpr,0,0,skyDpr,0,0);c.clearRect(0,0,skyW,skyH);
  const g=c.createRadialGradient(skyW*.5,skyH*.5,0,skyW*.5,skyH*.5,skyW*.65);
  g.addColorStop(0,'#090914');g.addColorStop(1,'#040408');c.fillStyle=g;c.fillRect(0,0,skyW,skyH);
  for(const [x,y,z,phase] of skyStars){const p=skyProject(x,y,z);if(!p)continue;c.globalAlpha=(.09+phase*.23)*Math.min(1,p.p);c.fillStyle='#b3b4d2';c.fillRect(p.x,p.y,phase>.85?1:.6,phase>.85?1:.6);}
  c.globalAlpha=1;skyHits=[];
  const nodes=skyNodes.map((n,i)=>({n,i,p:skyProject(...n.centre)})).filter(n=>n.p).sort((a,b)=>b.p.d-a.p.d);
  // Fine constellation threads connect memories without obscuring their silhouettes.
  c.lineWidth=.7;c.strokeStyle='rgba(167,147,179,.15)';
  for(let i=1;i<nodes.length;i++){c.beginPath();c.moveTo(nodes[i-1].p.x,nodes[i-1].p.y);c.lineTo(nodes[i].p.x,nodes[i].p.y);c.stroke();}
  for(const {n,i,p} of nodes){
    const diameter=p.s*256/68;c.globalAlpha=i===skySelected?1:.85;
    c.drawImage(n.mist,p.x-diameter/2,p.y-diameter/2,diameter,diameter);c.globalAlpha=1;
    let bottom=p.y,minX=p.x,maxX=p.x,minY=p.y;
    const projected=[];
    for(const q of n.points){
      const wave=reduce?0:Math.sin(skyTime*.3+q.phase)*.014;
      const v=skyBillboard(n,{x:q.x,y:q.y+wave,z:q.z});if(!v)continue;
      bottom=Math.max(bottom,v.y);minY=Math.min(minY,v.y);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);
      projected.push({q,v});
    }
    projected.sort((a,b)=>b.v.d-a.v.d);
    // Each sprite is a continuous radial gradient, including its core; no hard-edged discs.
    for(const {q,v} of projected){
      const radius=clamp(q.size*v.s*3,.95,25),twinkle=.88+.12*Math.sin(q.phase+skyTime*.65);
      c.globalAlpha=q.brightness*twinkle*clamp(1.25-q.z*.28,.55,1);c.drawImage(q.sprite,v.x-radius,v.y-radius,radius*2,radius*2);
    }
    c.globalCompositeOperation='source-over';c.globalAlpha=.72;c.textAlign='center';c.font='11px '+FONT;c.fillStyle='#d6d9e8';
    c.fillText(n.names.map(sceneName).join(' · '),p.x,bottom+22);
    skyHits.push({i,x:p.x,y:(minY+bottom)/2,r:clamp(Math.max(maxX-minX,bottom-minY)/2+18,32,180)});
  }
  c.globalAlpha=1;if(!skyNodes.length){c.textAlign='center';c.fillStyle='#aaaebb';c.font='14px '+FONT;c.fillText(tx('skyEmpty'),skyW/2,skyH/2);}
  skyRAF=requestAnimationFrame(skyFrame);
}
function renderSkyInfo(){
  const panel=$('#skyInfo');panel.textContent='';
  const n=skyNodes[skySelected];
  if(!n){const h=document.createElement('p');h.className='sky-hint';h.textContent=tx('skyHint');panel.append(h);return;}
  const meta=document.createElement('div');meta.className='meta';meta.textContent=new Date(n.a.ts).toLocaleString(LANG==='en'?'en-GB':'zh-CN')+' · '+emoName(n.a.emo||'calm');
  const text=document.createElement('p');text.className='sky-dream';text.textContent=n.a.text;
  const row=document.createElement('div');row.className='sky-actions';
  const button=(label,fn)=>{const b=document.createElement('button');b.className='tbtn';b.textContent=tx(label);b.onclick=fn;row.append(b);};
  button('open',()=>enterSkyDream());button('skyBack',()=>{skySelected=-1;skyTarget=[0,0,0];skyTargetZoom=1;renderSkyInfo();});
  button('delShort',()=>{if(!persist(archive.filter(a=>a.id!==n.a.id))){toast(tx('delFail'));return;}renderArchive();rebuildSky();renderSkyInfo();});panel.append(meta,text,row);
}
function selectSky(i){
  if(i===skySelected){enterSkyDream();return;}
  skySelected=i;skyTarget=skyNodes[i].centre.slice();skyTargetZoom=2.6;renderSkyInfo();
}
function enterSkyDream(){const n=skyNodes[skySelected];if(!n)return;closeArchive();$('#inp').value=n.a.text;autosize();commit(n.a.text,'archive',n.a.emo);}
skyCanvas.addEventListener('pointerdown',e=>{skyDrag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};skyMoved=false;skyCanvas.setPointerCapture(e.pointerId);});
skyCanvas.addEventListener('pointermove',e=>{if(!skyDrag)return;const dx=e.clientX-skyDrag.x,dy=e.clientY-skyDrag.y;
  if(Math.hypot(e.clientX-skyDrag.startX,e.clientY-skyDrag.startY)>5)skyMoved=true;
  skyYaw+=dx*.005;skyPitch=clamp(skyPitch+dy*.004,-1.25,1.25);skyVelocity.x=dx*.005*25;skyVelocity.y=dy*.004*25;skyDrag.x=e.clientX;skyDrag.y=e.clientY;});
skyCanvas.addEventListener('pointerup',e=>{if(!skyDrag)return;skyDrag=null;if(skyMoved)return;
  const b=skyCanvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
  const hit=skyHits.map(h=>({...h,dist:Math.hypot(h.x-x,h.y-y)})).filter(h=>h.dist<h.r).sort((a,b)=>a.dist-b.dist)[0];if(hit)selectSky(hit.i);
});
skyCanvas.addEventListener('pointercancel',()=>skyDrag=null);
skyCanvas.addEventListener('wheel',e=>{e.preventDefault();skyTargetZoom=clamp(skyTargetZoom*Math.exp(-e.deltaY*.001),.5,3.7);},{passive:false});
skyCanvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if(!skyNodes.length)return;const i=(skySelected+(e.key==='ArrowRight'?1:-1)+skyNodes.length)%skyNodes.length;skySelected=-1;selectSky(i);}if(e.key==='Enter')enterSkyDream();});
addEventListener('resize',()=>{if(!$('#arch').hidden&&skyView==='sky')sizeSky();});
