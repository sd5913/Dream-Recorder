'use strict';
/* ---------- commit a dream ---------- */
const $cap=$('#cap');
async function commit(text,src,forceEmo,instant){
  text=text.trim();if(!text)return;
  const my=++token;
  await ensureFont(text);if(my!==token)return;
  resize();
  const names=detectScenes(text),auto=detectEmotion(text),k=forceEmo||userEmo||auto;
  let pool=tokenize(text);if(!pool.length)return;
  while(pool.length<14)pool=pool.concat(pool);
  const seed=hash(text),RS=fontPx*1.12/U;
  const strokes=compose(names,seed,RS);
  const list=layoutWords(strokes,pool,seed,names);
  cur={text,names,seed,pool};
  retire();
  parts=spawn(list,instant);
  $cap.innerHTML=`<span class="tags">${names.map(n=>SC[n].zh).join(' · ')}</span><span class="emo"></span>${src==='boot'?'<span class="hint">用手指拨动文字</span>':''}`;
  applyEmotion(k);
  if(src==='boot')setTimeout(()=>{const h=$cap.querySelector('.hint');if(h)h.style.opacity=0;},7000);
  clearTimeout(saveTimer);
  if(src==='user'){saveTimer=setTimeout(()=>save(text,k),3200);}
  if(src!=='boot')Snd.bloom();
}
