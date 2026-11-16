'use strict';
/* ---------- abstract symbols ----------
   Order of evidence for a word the scene lexicon does not know:
   1. an everyday object: its head word (last character, e.g. 玻璃瓶 -> 瓶) is in the lexicon, so it already matched an object scene;
   2. an abstract idea in CONCEPT (lexicon.js): the shape family is chosen because it behaves like the idea (memory ripples outward, ...);
   3. otherwise it is "unclassified": a shape family from a hash of the word (stable but arbitrary), and the word is logged for the team. */
const SYM_FAMILIES=['orbit','ripple','crystal','burst','waves','pyramid','drop','knot'];
function symbolBuild(word,forced){
  const fam=forced||SYM_FAMILIES[hash(word)%SYM_FAMILIES.length],h0=hash(word+'#')%360;
  const hue=(x,y,k=0)=>mix(h0,h0+70,Math.max(0,Math.min(1,(y+.6)/1.2+k)));
  if(fam==='orbit'){
    hatch([ellP(0,0,.2,.2)],0,(x,y)=>[hue(x,y),62,60]);
    const n=2+Math.floor(R()*2);
    for(let i=0;i<n;i++){const rot=-.6+i*(1.2/Math.max(1,n-1))+(R()-.5)*.3,rx=.42+i*.16;
      S(closeP(ellP(0,0,rx,rx*.36,rot,72)),[h0+i*25,60,64-i*5],{keep:1});}
  }else if(fam==='ripple'){
    const n=Math.round(.5/(SP*1.25));
    for(let k=0;k<n;k++){const r=.52-k*SP*1.25,f=k/Math.max(1,n-1);if(r>.07)S(closeP(arcP(0,0,r,0,TAU)),[mix(h0,h0+80,f),65,mix(48,66,f)],{keep:1});}
  }else if(fam==='crystal'){
    const w=.34+R()*.1,top=[[0,-.62],[w,-.12],[0,.62],[-w,-.12]];
    hatch([top],(R()-.5)*.5,(x,y)=>[hue(x,y),58,52+Math.abs(x)*40]);
    [[0,-.62],[w,-.12],[0,.62],[-w,-.12]].forEach(q=>S([[0,-.12],q],[h0+20,30,84]));
  }else if(fam==='burst'){
    const n=6+Math.floor(R()*4),p=[];for(let i=0;i<n*2;i++){const a=i/(n*2)*TAU-Math.PI/2,r=i%2?.2:.58;p.push([Math.cos(a)*r,Math.sin(a)*r]);}
    hatch([p],0,(x,y)=>[hue(x,y),66,56+(1-Math.hypot(x,y))*16]);
  }else if(fam==='waves'){
    const n=4+Math.floor(R()*2),amp=.07+R()*.05;
    for(let k=0;k<n;k++){const p=[],y0=-.3+k*(.6/(n-1)),ph=R()*TAU;for(let i=0;i<=60;i++){const x=-.6+1.2*i/60;p.push([x,y0+Math.sin(i/60*TAU*2+ph)*amp]);}
      S(p,[mix(h0,h0+60,k/(n-1)),62,60],{keep:1});}
  }else if(fam==='pyramid'){
    for(let k=0;k<4;k++){const s=1-k*.22,y=.5-k*.06;S(closeP([[0,-.6*s+.08*k],[.5*s,y*s],[-.5*s,y*s]]),[mix(h0,h0+60,k/3),60,mix(56,70,k/3)],{keep:1});}
    S(closeP(ellP(0,.1,.06,.06)),[h0+60,70,70],{keep:1});
  }else if(fam==='drop'){
    const p=bez([0,-.62],[-.34,-.1],[-.36,.3],[0,.36],30).concat(bez([0,.36],[.36,.3],[.34,-.1],[0,-.62],30));
    hatch([p],0,(x,y)=>[hue(x,y),62,56+y*14]);
    [.1,.2].forEach((d,i)=>S(closeP(ellP(0,.5+i*.12,.3+d,.06+i*.02,0,48)),[h0+30,50,62-i*8],{keep:1}));
  }else{ /* knot */
    const a=2+Math.floor(R()*2),b=3+Math.floor(R()*2),ph=R()*TAU;
    [0,.03].forEach((d,i)=>{const p=[];for(let k=0;k<=160;k++){const t=k/160*TAU;p.push([(.55+d)*Math.sin(a*t+ph),(.5+d)*Math.sin(b*t)]);}S(p,[h0+i*30,62,62],{keep:1});});
  }
}
function ensureSymbol(word,fam){
  const n='sym:'+word;
  if(!SC[n]||SC[n].fam!==(fam||''))SC[n]={zh:word+'（象征）',cat:'hero',kw:'',fam:fam||'',build:()=>symbolBuild(word,fam)};
  return n;
}

/* ---------- which unknown words deserve a symbol (best guess at nouns, no dictionary needed) ---------- */
const CLASSIFIER='只个座条片位颗朵张件间扇棵头匹辆艘架把根块群堆道面';
function cleanNoun(w){
  w=w.replace(/^[的了在把被让给跟和与我你他她它们一这那两几某每不没很都就还也又直才只刚正再从向对为]+/,'').replace(/[的了着过地得吗呢吧啊]+$/,'');
  if(isCJK(w)){if(cjkLen(w)<2||cjkLen(w)>4)return '';}else if(w.length<4)return '';
  return w;
}
function rawWords(text){
  const out=[];
  if(window.Intl&&Intl.Segmenter){for(const g of new Intl.Segmenter(isCJK(text)?'zh':'en',{granularity:'word'}).segment(text))if(g.isWordLike)out.push(g.segment);}
  else text.split(/\s+/).forEach(w=>out.push(w));
  return out;
}
const ARTICLES=new Set('a an the my his her their our your its this that some one'.split(' '));
const EN_VERBS=new Set('was were is are had has have kept began turned told made came went got saw felt could would did do does said'.split(' '));
function symbolWords(text,fallback){
  const out=[],ws=rawWords(text),add=w=>{w=cleanNoun((w||'').trim());if(!w||STOP.has(w.toLowerCase())||out.includes(w)||matchScenes(w).length)return;
    if(!isCJK(w)&&/(ing|ed|ly)$/i.test(w))return;out.push(w);};
  /* a noun usually follows "的" or "一只/一座/…" (Chinese) and "a/the/my…" (English); "巨大" in "一个巨大的瓶子" is an adjective, so it is skipped when 的 follows */
  ws.forEach((w,i)=>{
    const prev=ws[i-1]||'',next=ws[i+1]||'';
    if(isCJK(w)){
      if((prev==='的'||(prev.length<=3&&CLASSIFIER.includes(prev.slice(-1))&&/^[一二两三几这那每]/.test(prev)))&&next!=='的')add(w);
    }else if(ARTICLES.has(prev.toLowerCase())){
      add(next&&!EN_VERBS.has(next.toLowerCase())&&!STOP.has(next.toLowerCase())&&next.length>=4&&!ARTICLES.has(next.toLowerCase())&&/^[a-z]+$/i.test(next)&&w.length>=4&&!matchScenes(next).length&&ws[i+2]&&!/^(of|and|to|in|on)$/i.test(next)?next:w);
    }
  });
  if(fallback)ws.forEach(w=>add(w));
  return out;
}

/* ---------- colour words change the colour of the picture ("白象" is a white elephant) ---------- */
const TONES=[
  [/(?<![明空坦告清表漂苍])白(?![天费痴话])|white|snowy white/i,{h:210,s:.1,l:14}],
  [/漆黑|黑色|黑(?![暗夜客])|black/i,{s:.25,l:-22}],
  [/红|red|crimson/i,{h:355,s:1.1,l:0}],
  [/蓝|blue/i,{h:215,s:1,l:0}],
  [/绿|green/i,{h:135,s:1,l:0}],
  [/紫|purple|violet/i,{h:280,s:1,l:0}],
  [/粉|pink/i,{h:330,s:.9,l:8}],
  [/金色|金黄|golden|gold\b/i,{h:42,s:1,l:4}],
  [/银色|银白|silver/i,{h:210,s:.15,l:14}],
  [/橙|orange/i,{h:24,s:1,l:0}],
  [/灰色|灰|gr[ae]y/i,{s:.12,l:0}]
];
function detectTone(text){for(const [rx,t] of TONES)if(rx.test(text))return t;return null;}
