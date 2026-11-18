'use strict';
/* ---------- commit a dream ---------- */
const $cap=$('#cap');
/* the caption under the picture: scene names, mood, and the evidence for what was recognised (rebuilt when the language changes) */
function renderCaption(src){
  const names=cur.names;
  const heard=[...new Set(names.hits.filter(h=>names.includes(h.name)).flatMap(h=>h.words)).values()].concat(names.basis.filter(b=>b.kind!=='card').map(b=>b.kind==='tarot'?tx('tarotWord',b.word,cardName(b.fam),whyName(b.why)):b.kind==='combo'?tx('combo',b.word,whyName(b.why)):b.kind==='concept'?tx('concept',b.word,whyName(b.why)):tx('unclass',b.word))).slice(0,6);
  const why=src==='boot'?`<span class="hint">${tx('hint')}</span>`
    :src==='live'&&!names.hits.length&&!names.basis.length?`<span class="why">${tx('liveHint')}</span>`
    :names.reading?`<span class="why">${tx('reading',emoName(names.reading.primary)+(names.reading.secondary?' / '+emoName(names.reading.secondary):''),names.reading.energy>.65?tx('energyHi'):names.reading.energy<.35?tx('energyLo'):'')}${heard.length?tx('sep')+heard.join(tx('sep')):''}</span>`
    :names.fallback&&!names.symbols.length&&!names.basis.length?`<span class="why">${tx('nothing')}</span>`
    :`<span class="why">${tx('heard')}${heard.join(tx('sep'))}</span>`;
  $cap.innerHTML=`<span class="tags">${names.map(sceneName).join(' · ')}</span><span class="emo"></span>${src==='boot'||src==='live'?'':`<button type="button" class="miss">${tx('miss')}</button>`}${why}`;
  const mb=$cap.querySelector('.miss');if(mb)mb.onclick=()=>{logMiss(cur,'button');toast(tx('missToast'));};
  const e=$('#cap .emo');if(e)e.textContent=emoName(emoKey);
}
/* A dream typed by the user is saved 3.2 s after it is drawn, so the thumbnail shows the finished picture.
   If another dream starts before that, the waiting one is saved first: two quick submissions never lose the first dream. */
function flushSave(){
  clearTimeout(saveTimer);if(!pendingSave)return;
  const p=pendingSave;pendingSave=null;save(p.text,cur&&cur.text===p.text?emoKey:p.emo);
}
addEventListener('pagehide',flushSave);
document.addEventListener('visibilitychange',()=>{if(document.hidden)flushSave();});
async function commit(text,src,forceEmo,instant){
  text=text.trim();if(!text)return;
  flushSave();   /* first, while the previous picture is still on screen (resize() below clears the canvas) */
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
  parts=instant?(retire(),spawn(list,true)):morph(list);
  cur.src=src;renderCaption(src);
  applyEmotion(k);
  if(src==='boot')setTimeout(()=>{const h=$cap.querySelector('.hint');if(h)h.style.opacity=0;},7000);
  if(src==='user'&&names.fallback)logMiss(cur,'fallback');
  if(src==='user'){pendingSave={text,emo:k};saveTimer=setTimeout(flushSave,3200);}
  if(src==='live')Snd.tick(text.length);else if(src!=='boot')Snd.bloom();
}
