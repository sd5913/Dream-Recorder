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
                spin:(rnd()<.5?-1:1)*(2+rnd()*5),ph:rnd()*TAU,si});
      pi+=k+1;
      s+=w+gap;
    }
  });
  return res;
}
