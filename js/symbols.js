'use strict';
/* ---------- abstract symbols ----------
   Order of evidence for a word the scene lexicon does not know:
   1. an everyday object: its head word (last character, e.g. 玻璃瓶 -> 瓶) is in the lexicon, so it already matched an object scene;
   2. an abstract idea in CONCEPT (lexicon.js): the shape family is chosen because it behaves like the idea (memory ripples outward, ...);
   3. otherwise it is "unclassified": it gets the card of the abstract deck that best fits the dream's mood and energy (js/tarot.js), and the word is logged for the team. */
/* the shapes themselves, how they are chosen by mood (the "tarot" spread) and ensureSymbol() live in js/tarot.js */

/* ---------- which unknown words deserve a symbol (best guess at nouns, no dictionary needed) ---------- */
const CLASSIFIER='只个座条片位颗朵张件间扇棵头匹辆艘架把根块群堆道面';
function cleanNoun(w){
  if(/^一切/.test(w))return '';   /* 一切 (everything) is not a noun to draw, and stripping 一 would leave 切都 */
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
const EN_VERBS=new Set('was were is are had has have kept began turned told made came went got saw felt feel could would should did do does said say know knew think thought want wanted seemed looked about there where which while what when why with from into could not'.split(' '));
/* mood words (安静, happy ...) describe the feeling, which the reading already uses; they are not things to draw */
let MOOD_RX=null;
function isMoodWord(w){if(typeof EMO_KW==='undefined')return false;if(!MOOD_RX)MOOD_RX=rxOf(Object.values(EMO_KW).join('|'));MOOD_RX.lastIndex=0;const m=w.match(MOOD_RX);return !!(m&&m.join('').length>=w.length*.6);}
function symbolWords(text,fallback){
  const out=[],ws=rawWords(text),add=w=>{w=cleanNoun((w||'').trim());if(!w||STOP.has(w.toLowerCase())||out.includes(w)||matchScenes(w).length||isMoodWord(w)||(!isCJK(w)&&EN_VERBS.has(w.toLowerCase())))return;
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
