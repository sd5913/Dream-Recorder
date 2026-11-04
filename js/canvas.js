'use strict';
/* ---------- fonts / sizing ---------- */
function ensureFont(text){
  if(!document.fonts||!document.fonts.load)return Promise.resolve();
  return Promise.race([document.fonts.load('400 16px "Noto Sans SC"',text.slice(0,200)).catch(()=>{}),new Promise(r=>setTimeout(r,1200))]);
}
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
  const t=$('#top').getBoundingClientRect(),d=$('#dock').getBoundingClientRect(),capH=$('#cap').offsetHeight;
  const top=t.bottom,bot=d.top-capH+6;
  cx=W/2;cy=(top+bot)/2;U=Math.max(60,Math.min(W*.96,bot-top)/2);
  fontPx=clamp(U*.042,7,12);
}
