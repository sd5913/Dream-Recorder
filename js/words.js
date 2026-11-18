'use strict';
/* ---------- words: tokenise the dream, then lay words along strokes ---------- */
const isCJK=t=>/[一-鿿]/.test(t);
const cjkLen=t=>t.replace(/[，。！？、；：,.!?…"“”'’‘]/g,'').length;
function tokenize(text){
  let raw=[];
  if(window.Intl&&Intl.Segmenter){
    for(const g of new Intl.Segmenter(isCJK(text)?'zh':'en',{granularity:'word'}).segment(text)){
      if(!g.segment.trim())continue;
      if(!g.isWordLike&&raw.length)raw[raw.length-1]+=g.segment;else raw.push(g.segment);}
  }else{
    text.split(/\s+/).forEach(w=>{if(!isCJK(w))raw.push(w);else for(let i=0;i<w.length;i+=2)raw.push(w.slice(i,i+2));});
  }
  const out=[];
  for(let i=0;i<raw.length;i++){let t=raw[i];
    while(isCJK(t)&&cjkLen(t)<2&&i+1<raw.length&&isCJK(raw[i+1])&&cjkLen(t)+cjkLen(raw[i+1])<=3)t+=raw[++i];
    out.push(t);}
  return out;
}
const wcache={};
function measure(t){return wcache[t]||(wcache[t]=ctx.measureText(t).width);}

function layoutWords(strokes,pool,seed,names){
  const rnd=rng(seed^0x9e3779b9),fsW=fontPx/U,gap=fsW*.3,res=[];
  ctx.font=`${fontPx}px ${FONT}`;
  let pi=0;const MAX=2400;
  strokes.forEach((o,si)=>{
    let pts=o.pts;if(pts.length<2)return;
    if(!o.keep){
      const a=pts[0],b=pts[pts.length-1],dx=b[0]-a[0],dy=b[1]-a[1];
      if(Math.abs(dx)>=Math.abs(dy)*.35?dx<0:dy>0)pts=pts.slice().reverse();
    }
    const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    const total=cum[cum.length-1];if(total<fsW*1.4)return;
    let j=0;const at=s=>{s=clamp(s,0,total);while(j>0&&cum[j]>s)j--;while(j<cum.length-2&&cum[j+1]<s)j++;
      const d=cum[j+1]-cum[j]||1,t=(s-cum[j])/d;return[pts[j][0]+(pts[j+1][0]-pts[j][0])*t,pts[j][1]+(pts[j+1][1]-pts[j][1])*t];};
    let s=gap*.4;
    while(res.length<MAX){
      let k=0,w=0,tok=null;
      for(;k<6;k++){tok=pool[(pi+k)%pool.length];w=measure(tok)/U;if(s+w<=total)break;tok=null;}
      if(!tok){const ch=Array.from(pool[pi%pool.length])[0];w=measure(ch)/U;if(s+w>total)break;tok=ch;k=0;}
      const p1=at(s),p2=at(s+w),pm=at(s+w/2);
      const ang=Math.atan2(p2[1]-p1[1],p2[0]-p1[0]);
      const base=typeof o.col==='function'?o.col(pm[0],pm[1]):o.col;
      res.push({t:tok,ux:pm[0],uy:pm[1],ang,base,jh:(rnd()-.5)*12,jl:(rnd()-.5)*10,idx:res.length,
                spin:(rnd()<.5?-1:1)*(2+rnd()*5),ph:rnd()*TAU,si,z:o.z||0,it:o.it,cat:o.cat});
      pi+=k+1;
      s+=w+gap;
    }
  });
  return res;
}

/* ---------- words that matched no scene: they drift around the picture as dim "dream dust" ---------- */
const STOP=new Set(('我 你 他 她 它 的 了 在 是 有 和 就 都 也 很 还 又 一个 一直 怎么 什么 没有 不是 自己 突然 然后 可是 但是 因为 所以 这个 那个 已经 开始 好像 感觉 我们 他们 一样 一点 越来越 所有 终于 最后 一些 不会 可以 看不懂 '+
  'that with from this then when were have been they their there what just could would about into over while where which kept never even very much some only also than them these those').split(' '));
function unmatchedTokens(pool){
  const out=[];
  for(const t of pool){
    const w=t.replace(/[，。！？、；：,.!?…"“”'’‘]/g,'').trim();
    if(!w||STOP.has(w.toLowerCase()))continue;
    if(isCJK(w)?cjkLen(w)<2:w.length<4)continue;
    if(out.includes(w))continue;
    if(matchScenes(w).length)continue;
    out.push(w);
  }
  return out;
}
function dustWords(tokens,seed,list){
  if(!tokens.length)return [];
  const rnd=rng(seed^0x51ed270b),n=Math.min(30,Math.max(8,tokens.length*3)),out=[];
  const topBar=$('#top').getBoundingClientRect().bottom;
  const lim=Math.min(.98,(W/2-14)/U),limy=Math.max(.5,(cy-topBar-fontPx*1.5)/U),minD=fontPx*1.6/U;
  for(let tries=0;out.length<n&&tries<n*40;tries++){
    const ux=(rnd()*2-1)*lim,uy=(rnd()*2-1)*limy;
    if(list.some(q=>Math.hypot(q.ux-ux,q.uy-uy)<minD))continue;
    if(out.some(q=>Math.hypot(q.ux-ux,q.uy-uy)<minD*1.8))continue;
    out.push({t:tokens[out.length%tokens.length],ux,uy,ang:(rnd()-.5)*.5,base:[215,24,72],jh:(rnd()-.5)*20,jl:(rnd()-.5)*8,
      idx:list.length+out.length,spin:(rnd()<.5?-1:1)*(2+rnd()*5),ph:rnd()*TAU,si:-1,dim:.42});
  }
  return out;
}
/* overlaps: go from the nearest scene to the farthest; a word that would sit on or right next to a word of a nearer scene is dropped,
   so a thing standing in water loses its lower part and a backdrop is cut out around what stands in front of it */
function maskLayers(list){
  const cell=fontPx*1.2/U,occ=new Map(),key=(x,y)=>(x+2048)*4096+(y+2048);
  const zs=[...new Set(list.map(p=>p.z))].sort((a,b)=>b-a);if(zs.length<2)return list;
  const out=[];
  for(const z of zs){
    const keep=list.filter(p=>p.z===z).filter(p=>{const gx=Math.floor(p.ux/cell),gy=Math.floor(p.uy/cell);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(occ.has(key(gx+dx,gy+dy)))return false;return true;});
    keep.forEach(p=>occ.set(key(Math.floor(p.ux/cell),Math.floor(p.uy/cell)),1));
    for(const p of keep)out.push(p);
  }
  return out;
}
/* the full set of word particles for the current dream: picture + dust */
function buildList(c){
  const list=maskLayers(layoutWords(compose(c.names,c.seed,fontPx*1.12/U),c.pool,c.seed,c.names));
  return list.concat(dustWords(c.dust,c.seed,list));
}
