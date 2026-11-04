'use strict';
/* ---------- compose scenes in sky / middle / ground rows ---------- */
function buildScene(n,s,RS,seed){SP=RS/s;OUT=[];R=rng(seed^hash(n));SC[n].build();return OUT;}
function bbox(st){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;st.forEach(o=>o.pts.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}));return{x0,y0,x1,y1};}
function compose(names,seed,RS){
  const items=names.map(n=>{const st=buildScene(n,1,RS,seed),b=bbox(st);return{n,hw:(b.x1-b.x0)/2,hh:(b.y1-b.y0)/2,cat:SC[n].cat};});
  const by=c=>items.filter(i=>i.cat===c),sky=by('sky'),hero=by('hero'),gr=by('ground'),gap=.06,cands=[];
  const add=rows=>{rows=rows.filter(r=>r.length);if(rows.length)cands.push(rows);};
  add([sky,hero,gr]);
  if(sky.length&&hero.length)add([hero.concat(sky),gr]);
  if(items.length>1)add([items.slice()]);
  let best=null;
  cands.forEach(rows=>{
    const rw=rows.map(r=>r.reduce((a,i)=>a+i.hw*2,0)+(r.length-1)*gap),rh=rows.map(r=>Math.max(...r.map(i=>i.hh*2)));
    const totH=rh.reduce((a,b)=>a+b,0)+(rows.length-1)*gap,s=Math.min(1.8,1.86/totH,1.86/Math.max(...rw));
    if(!best||s>best.s+.02)best={rows,rw,rh,totH,s};
  });
  const {rows,rw,rh,totH,s}=best;
  let yc=-totH*s/2;const out=[];
  rows.forEach((r,ri)=>{
    const top=yc,hRow=rh[ri]*s;yc+=hRow+gap*s;let x=-rw[ri]*s/2;
    r.forEach(it=>{
      const Y=it.cat==='sky'&&r.length>1?top+it.hh*s:it.cat==='ground'&&r.length>1?top+hRow-it.hh*s:top+hRow/2;
      const st=buildScene(it.n,s,RS,seed),b=bbox(st),ox=(b.x0+b.x1)/2,oy=(b.y0+b.y1)/2,X=x+it.hw*s;x+=(it.hw*2+gap)*s;
      st.forEach(o=>{
        const col=o.col;
        out.push({pts:o.pts.map(p=>[(p[0]-ox)*s+X,(p[1]-oy)*s+Y]),keep:o.keep,
          col:typeof col==='function'?((a,b)=>col((a-X)/s+ox,(b-Y)/s+oy)):col});
      });
    });
  });
  return out;
}
