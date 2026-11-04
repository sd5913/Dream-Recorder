'use strict';
let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!cur)return;resize();
  const strokes=compose(cur.names,cur.seed,fontPx*1.12/U);const list=layoutWords(strokes,cur.pool,cur.seed,cur.names);parts=spawn(list,true);},180);});

renderArchive();resize();applyEmotion('calm');
window.__dream={commit:(t,e)=>commit(t,'test',e,true),ptr,get n(){return parts.length;}};
commit('我梦见一朵巨大的向日葵，在海边的风里慢慢转动，月亮挂在天上，我伸手想碰它，它却越来越亮','boot');
requestAnimationFrame(frame);
