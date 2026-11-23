// The abstract deck and the mood "tarot" spread (js/tarot.js).   Run:  node tests/tarot.js   (exit code 1 on failure)
// Checks: the deck is complete and every card draws; each layer has enough cards; the mood reading notices mood and energy;
// a spread is one sky, one heart and one ground card, all different, the same every time for the same text;
// the heart card fits the mood (among the 5 of 14 heart cards with the highest affinity for it); different dreams of one mood do not all get the same cards.
const fs=require('fs'),vm=require('vm'),path=require('path');const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const order=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const files=order.slice(0,order.indexOf('js/tarot.js')+1).concat(order.includes('js/words.js')&&order.indexOf('js/words.js')>order.indexOf('js/tarot.js')?['js/words.js']:[]);
const el=()=>({getContext:()=>({}),getBoundingClientRect:()=>({bottom:52,top:0}),style:{},dataset:{}});
const ctx={console,Intl,document:{querySelector:el,querySelectorAll:()=>[],documentElement:{style:{setProperty(){}}},getElementById:()=>null},
  matchMedia:()=>({matches:false}),navigator:{language:'zh-CN'},localStorage:{getItem:()=>null,setItem(){}},innerWidth:390,innerHeight:844};
vm.createContext(ctx);ctx.window=ctx;
vm.runInContext(files.map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^'use strict';/,'')).join('\n')+
  '\nthis.DRAW=DRAW;this.CONCEPT=CONCEPT;this.__x={DECK,CARD,readMood,drawSpread,detectEmotion,detectScenes,unmatchedTokens,tokenize,SC,MOODS,matchScenes,comboMatches};',ctx);
const {DECK,CARD,readMood,drawSpread,detectEmotion,detectScenes,unmatchedTokens,tokenize,SC,MOODS,matchScenes,comboMatches}=ctx.__x;
const bad=[],fail=m=>bad.push(m);
// deck
if(DECK.length<22)fail(`deck has ${DECK.length} cards, expected at least 22`);
DECK.forEach(c=>{if(!ctx.DRAW[c[0]])fail(`card ${c[0]} has no drawing`);});
const byLayer={};DECK.forEach(c=>{(byLayer[c[3]]=byLayer[c[3]]||[]).push(c[0]);});
['sky','heart','ground'].forEach(l=>{if(!byLayer[l]||byLayer[l].length<3)fail(`layer ${l} has fewer than 3 cards`);});
let drawn=0;DECK.forEach(c=>{try{ctx.ensureCard(c[0]);SC['card:'+c[0]].build();drawn++;}catch(e){fail(`card ${c[0]} throws: ${e.message}`);}});
MOODS.forEach(m=>{const top=DECK.filter(c=>c[6][MOODS.indexOf(m)]>=.7).length;if(top<2)fail(`only ${top} cards carry the mood ${m} strongly (affinity >= .7)`);});
// reading
const hi=readMood('我拼命地跑，突然爆炸了！','fear'),lo=readMood('我慢慢地躺着，很安静，雾在飘','calm');
if(!(hi.energy>.7))fail(`intense dream read as energy ${hi.energy.toFixed(2)}`);
if(!(lo.energy<.3))fail(`still dream read as energy ${lo.energy.toFixed(2)}`);
const mix=readMood('我很害怕，但又有点怀念','fear');if(mix.secondary!=='nostalgia')fail(`second mood should be nostalgia, got ${mix.secondary}`);
// every concept word group points to a card that exists, and its reason is that card's meaning
for(const fam in ctx.CONCEPT){if(!CARD[fam])fail(`concept group ${fam} has no card`);else if(ctx.CONCEPT[fam].why!==CARD[fam].mz)fail(`concept ${fam}: reason "${ctx.CONCEPT[fam].why}" differs from the card meaning "${CARD[fam].mz}"`);}
// spreads: invented dreams with no lexicon word at all
const D={
  fear:['量子打印机一直在响，我很害怕，拼命逃','黑暗里有人追我，我尖叫','I was terrified and kept running from something'],
  joy:['我们一直在笑，很开心，大家跳起来','I was so happy, laughing with everyone','奖状发下来，我高兴得要飞起来'],
  sad:['我很难过，一个人哭了很久','I felt so sad and lonely and cried','她走了以后我一直很伤心'],
  calm:['一切都很安静，我慢慢地呼吸','I was calm and quiet, slowly breathing','很平静地漂着'],
  strange:['一切都很奇怪，颠倒过来','Everything was strange and weird','莫名其妙的规则，荒诞'],
  nostalgia:['小时候的味道，我很怀念','I missed my childhood so much','想起从前的同学，很想念']};
const HEARTS=DECK.filter(c=>c[3]==='heart').length;
/* rank = how many heart cards fit the mood strictly better (ties share a rank) */
const rank=(fam,m)=>{const k=MOODS.indexOf(m),a=DECK.find(c=>c[0]===fam)[6][k];return DECK.filter(c=>c[3]==='heart'&&c[6][k]>a).length;};
let fit=0,total=0,fallbacks=0;const heartsPerMood={};
for(const m in D)for(const t of D[m]){
  const rd=readMood(t,m),s=drawSpread(rd,t),s2=drawSpread(readMood(t,m),t);
  if(s.map(x=>x.pos).join()!=='sky,heart,ground')fail(`"${t}": spread positions ${s.map(x=>x.pos)}`);
  if(new Set(s.map(x=>x.card.fam)).size!==3)fail(`"${t}": repeated card`);
  if(s.map(x=>x.card.fam).join()!==s2.map(x=>x.card.fam).join())fail(`"${t}": not deterministic`);
  s.forEach(x=>{if(x.card.layer!==x.pos)fail(`"${t}": ${x.card.fam} is a ${x.card.layer} card in the ${x.pos} position`);});
  const heart=s[1].card;total++;if(rank(heart.fam,m)<5)fit++;else fail(`"${t}" (${m}): heart card ${heart.fam} is only #${rank(heart.fam,m)+1} of ${HEARTS} heart cards for ${m}`);
  (heartsPerMood[m]=heartsPerMood[m]||new Set()).add(heart.fam);
  const k=detectEmotion(t),names=detectScenes(t,k,unmatchedTokens(tokenize(t)));
  if(!matchScenes(t).length&&!comboMatches(t).length){fallbacks++;if(!names.fallback||names.length!==3)fail(`"${t}": expected a 3-card fallback picture, got ${names.join(',')}`);}
}
const varied=Object.values(heartsPerMood).filter(s=>s.size>1).length;
/* Recognised dreams keep their concrete scenes and add one mood image. */
for(const [text,mood] of [
  ['我梦见一只猫','calm'],
  ['I saw an elephant, a tiger and a rabbit','joy'],
  ['I saw a moon above the sea','fear']
]){
  const names=detectScenes(text,mood,unmatchedTokens(tokenize(text)));
  const original=ctx.pickScenes(matchScenes(text));
  if(names.fallback)fail(`"${text}": known scenes used the fallback spread`);
  if(!names.moodCard||!names.includes('card:'+names.moodCard))fail(`"${text}": mood card missing`);
  if(!original.every(n=>names.includes(n)))fail(`"${text}": a recognised scene was replaced`);
  if(names.length!==original.length+1)fail(`"${text}": expected ${original.length} scenes plus one mood card, got ${names.length}`);
  if(original.length===3&&original.every(n=>SC[n].cat==='hero')&&SC['card:'+names.moodCard].cat!=='sky')fail(`"${text}": fourth hero would be omitted by the composer`);
  const repeat=detectScenes(text,mood,unmatchedTokens(tokenize(text)));
  if(repeat.moodCard!==names.moodCard)fail(`"${text}": mood card changed for the same dream`);
}
console.log(`deck ${DECK.length} cards (sky ${byLayer.sky.length}, heart ${byLayer.heart.length}, ground ${byLayer.ground.length}), all drawn: ${drawn}`);
console.log(`energy: intense ${hi.energy.toFixed(2)}, still ${lo.energy.toFixed(2)}`);
console.log(`dreams with no picture word that got a 3-card spread in detectScenes: ${fallbacks}`);
console.log(`heart card among the 5 heart cards (of ${HEARTS}) that fit the mood best: ${fit}/${total}; moods whose dreams got more than one heart card: ${varied}/6`);
for(const m in D)console.log(`  ${m.padEnd(9)} ${D[m].map(t=>drawSpread(readMood(t,m),t).map(x=>x.card.fam).join('+')).join('   ')}`);
if(bad.length){console.log(`\nFAILED (${bad.length})`);bad.forEach(b=>console.log('  - '+b));process.exit(1);}
console.log('tarot OK');
