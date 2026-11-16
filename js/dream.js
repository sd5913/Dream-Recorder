'use strict';
/* ---------- commit a dream ---------- */
const $cap=$('#cap');
/* the caption under the picture: scene names, mood, and the evidence for what was recognised (rebuilt when the language changes) */
function renderCaption(src){
  const names=cur.names;
  const heard=[...new Set(names.hits.filter(h=>names.includes(h.name)).flatMap(h=>h.words)).values()].concat(names.basis.map(b=>b.kind==='combo'?tx('combo',b.word,whyName(b.why)):b.kind==='concept'?tx('concept',b.word,whyName(b.why)):tx('unclass',b.word))).slice(0,6);
  const why=src==='boot'?`<span class="hint">${tx('hint')}</span>`
    :names.fallback&&!names.symbols.length&&!names.basis.length?`<span class="why">${tx('nothing')}</span>`
    :`<span class="why">${tx('heard')}${heard.join(tx('sep'))}</span>`;
  $cap.innerHTML=`<span class="tags">${names.map(sceneName).join(' · ')}</span><span class="emo"></span>${src==='boot'?'':`<button type="button" class="miss">${tx('miss')}</button>`}${why}`;
  const mb=$cap.querySelector('.miss');if(mb)mb.onclick=()=>{logMiss(cur,'button');toast(tx('missToast'));};
  const e=$('#cap .emo');if(e)e.textContent=emoName(emoKey);
}
async function commit(text,src,forceEmo,instant){
  text=text.trim();if(!text)return;
  const my=++token;
  await ensureFont(text);if(my!==token)return;
  resize();
  const auto=detectEmotion(text),k=forceEmo||userEmo||auto;
  let pool=tokenize(text);if(!pool.length)return;
  const dust=unmatchedTokens(pool),names=detectScenes(text,k,dust);
  while(pool.length<14)pool=pool.concat(pool);
  const seed=hash(text);
  cur={text,names,seed,pool,dust,tone:detectTone(text)};
  const list=buildList(cur);
  retire();
  parts=spawn(list,instant);
  cur.src=src;renderCaption(src);
  applyEmotion(k);
  if(src==='boot')setTimeout(()=>{const h=$cap.querySelector('.hint');if(h)h.style.opacity=0;},7000);
  clearTimeout(saveTimer);
  if(src==='user'&&names.fallback)logMiss(cur,'fallback');
  if(src==='user'){saveTimer=setTimeout(()=>save(text,k),3200);}
  if(src!=='boot')Snd.bloom();
}
