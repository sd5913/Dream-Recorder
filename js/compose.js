'use strict';
/* ---------- compose scenes in sky / middle / ground rows ---------- */
function buildScene(n,s,RS,seed){SP=RS/s;OUT=[];R=rng(seed^hash(n));SC[n].build();return OUT;}
function bbox(st){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;st.forEach(o=>o.pts.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}));return{x0,y0,x1,y1};}
/* ---------- staging: one picture instead of tiles ----------
   The scenes are placed like a small stage set, not side by side:
   - a ground scene spans the width at the bottom; water and road are a FRONT ground, so things stand or float IN them (their lower part is covered);
     mountains, city, forest, house and stairs are a BACKDROP behind the things
   - sky scenes sit small in the upper part (stars, cloud and rain spread across it)
   - things share one baseline, overlap a little, and keep their real-life size class: a cup or an exam paper is small next to an elephant or a tower
   Each placed scene gets a depth z; words that fall behind a nearer scene are removed later (maskLayers), so overlaps read as in front / behind. */
const FRONT_GROUND=new Set(['sea','road']);
const WIDE_SKY=new Set(['stars','cloud','rain']);
const SIZE_BIG=new Set('train plane elevator elephant horse bear beast tower tree house city mountain forest bridge stairs boat car fire door'.split(' '));
const SIZE_SMALL=new Set('insect cup bottle bowl kettle jar box bag envelope phone laptop camera hat shoe knife hammer scissors ball egg coin cake bread key candle feather butterfly paper heart clock tooth note hourglass crown skull flower eye hand mouth foot umbrella picture guitar rabbit fish snake suitcase shirt dress'.split(' '));
const sizeOf=n=>n.startsWith('sym:')||n.startsWith('card:')?.6:SIZE_BIG.has(n)?1:SIZE_SMALL.has(n)?.5:.74;
function compose(names,seed,RS){
  const items=names.map((n,i)=>{const st=buildScene(n,1,RS,seed),b=bbox(st);return{n,i,hw:(b.x1-b.x0)/2,hh:(b.y1-b.y0)/2,cat:SC[n].cat,k:sizeOf(n)};});
  /* room available on screen, in scene units (U pixels = 1 unit) */
  const topBar=$('#top').getBoundingClientRect().bottom;
  const LH=Math.max(1.2,(2*(cy-topBar)-48)/U),LW=Math.min(Math.max(1.2,(W-30)/U),Math.max(LH*1.35,1.7));
  const T=-LH/2,B=LH/2,rnd=rng(seed^0x2f6e2b1),place=[];
  const put=(it,s,X,Y,z,rot)=>place.push({it,s:Math.min(2.6,s),X,Y,z,rot:rot||0});
  if(items.length===1){const it=items[0];put(it,Math.min(2.2,LH/(it.hh*2),LW/(it.hw*2)),0,0,10);}
  else{
    const sky=items.filter(i=>i.cat==='sky'),grounds=items.filter(i=>i.cat==='ground'),ground=grounds[0]||null;
    const heroes=items.filter(i=>i.cat==='hero').concat(grounds.slice(1));
    let heroBottom=B-.02*LH,front=false;
    if(ground){
      front=FRONT_GROUND.has(ground.n)||!!(SC[ground.n]&&SC[ground.n].water);
      const maxH=(front?(heroes.length?.34:.46):(heroes.length?.62:.7))*LH,gs=Math.min(LW/(ground.hw*2),maxH/(ground.hh*2)),gh=ground.hh*2*gs;
      put(ground,gs,0,B-gh/2,front?30:5);
      heroBottom=front?B-gh+gh*.3:B-.02*LH;
    }
    const others=heroes.length||ground,skyBand=(others?.36:1)*LH;
    sky.forEach((it,j)=>{
      if(WIDE_SKY.has(it.n)||(SC[it.n]&&SC[it.n].wide)){const maxH=it.n==='rain'&&others?LH*.8:skyBand,s=Math.min(LW/(it.hw*2),maxH/(it.hh*2));put(it,s,0,T+it.hh*s+j*.04*LH,1+j*.1);}
      else{const s=Math.min(skyBand*.92/(it.hh*2),LW*(others?.4:.55)/(it.hw*2)),side=(rnd()<.5?-1:1)*(j%2?-1:1);
        put(it,s,others||sky.length>1?side*(LW/2-it.hw*s-.02*LW):0,T+it.hh*s+.01*LH,2+j*.1);}
    });
    if(heroes.length){
      /* things are grouped in depth, not lined up: the main one stands further back and higher, the others in front of it, lower, overlapping.
         each slot: [x centre (x LW), lift of the baseline (x Hh), max height (x Hh), max width (x LW)] */
      const SLOTS={1:[[0,0,1,.96]],2:[[-.17,.14,.84,.68],[.2,0,.64,.56]],3:[[0,.27,.7,.7],[-.25,0,.5,.48],[.26,.05,.46,.46]]};
      const heroTop=sky.length?T+.14*LH:T,Hh=heroBottom-heroTop,kmax=Math.max(...heroes.map(h=>h.k)),n=Math.min(3,heroes.length);
      const rel=h=>Math.min(1,h.k/Math.max(kmax,ground||sky.length?.8:kmax));
      heroes.slice().sort((p,q)=>q.k-p.k||p.i-q.i).slice(0,3).forEach((h,j)=>{
        const [fx,lift,mh,mw]=SLOTS[n][j],s=Math.min(Hh*mh*rel(h)/(h.hh*2),LW*mw/(h.hw*2)),floats=front&&(ground.n==='sea'||!!SC[ground.n].water)&&h.k<1;
        const X=clamp(fx*LW,-LW/2+h.hw*s,LW/2-h.hw*s);
        put(h,s,X,heroBottom-lift*Hh-h.hh*s+(floats?h.hh*s*.12:0),10+j*2,floats?(rnd()-.5)*.26:0);});
      if(!ground&&n>1)place.push({floor:1,y:heroBottom+.012*LH,w:LW*.9,z:4});
    }
    /* centre the whole group vertically when it does not fill the frame */
    let y0=1e9,y1=-1e9;place.forEach(p=>{if(p.floor){y1=Math.max(y1,p.y+RS*3);return;}y0=Math.min(y0,p.Y-p.it.hh*p.s);y1=Math.max(y1,p.Y+p.it.hh*p.s);});
    const dy=-(y0+y1)/2;place.forEach(p=>{if(p.floor)p.y+=dy;else p.Y+=dy;});
  }
  const out=[];
  place.forEach((pl,pi)=>{
    if(pl.floor){for(let k=0;k<3;k++){const w=pl.w*(1-k*.16),y=pl.y+k*RS*1.05;out.push({pts:[[-w/2,y],[w/2,y]],keep:1,col:[222,14,46-k*8],z:pl.z,it:'floor'});}return;}
    const {it,s,X,Y,z,rot}=pl,st=buildScene(it.n,s,RS,seed),b=bbox(st),ox=(b.x0+b.x1)/2,oy=(b.y0+b.y1)/2,c=Math.cos(rot),sn=Math.sin(rot);
    st.forEach(o=>{
      const col=o.col;
      out.push({pts:o.pts.map(p=>{const dx=(p[0]-ox)*s,dy=(p[1]-oy)*s;return[dx*c-dy*sn+X,dx*sn+dy*c+Y];}),keep:o.keep,z,it:it.i,cat:it.cat,
        col:typeof col==='function'?((a,b)=>col((a-X)/s+ox,(b-Y)/s+oy)):col});
    });
  });
  return out;
}
