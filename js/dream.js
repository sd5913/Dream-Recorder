'use strict';
/* ---------- commit a dream ---------- */
const $cap=$('#cap');
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
  const heard=[...new Set(names.hits.filter(h=>names.includes(h.name)).flatMap(h=>h.words)).values()].concat(names.basis.map(b=>b.kind==='combo'?b.word+'（组合：'+b.why+'）':b.kind==='concept'?b.word+'（象征：'+b.why+'）':b.word+'（未归类）')).slice(0,6);
  const why=src==='boot'?'<span class="hint">用手指拨动文字</span>'
    :names.fallback&&!names.symbols.length&&!names.basis.length?'<span class="why">没认出具体的东西，按情绪画了这一幅</span>'
    :`<span class="why">识别到：${heard.join('、')}</span>`;
  $cap.innerHTML=`<span class="tags">${names.map(n=>SC[n].zh).join(' · ')}</span><span class="emo"></span>${src==='boot'?'':'<button type="button" class="miss">少了什么？</button>'}${why}`;
  const mb=$cap.querySelector('.miss');if(mb)mb.onclick=()=>{logMiss(cur,'button');toast('已记下这个梦，谢谢');};
  applyEmotion(k);
  if(src==='boot')setTimeout(()=>{const h=$cap.querySelector('.hint');if(h)h.style.opacity=0;},7000);
  clearTimeout(saveTimer);
  if(src==='user'&&names.fallback)logMiss(cur,'fallback');
  if(src==='user'){saveTimer=setTimeout(()=>save(text,k),3200);}
  if(src!=='boot')Snd.bloom();
}
