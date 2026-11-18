// Scene-registration contract: the lexicon (js/lexicon.js) and the drawings (js/scenes/*.js) must agree, and every scene must really be selectable.
// Run:  node tests/registry.js      (exit code 1 if anything is broken)
// It loads the files in the same order as index.html, then checks:
//   1. every scene in the lexicon has a drawing, and every drawing has keywords and an English name
//   2. typing a scene's own first Chinese and first English keyword selects that scene (not merely "the file parses")
//   3. every drawing can actually be built without throwing
//   4. no keyword is listed under two scenes; known look-alike pairs (dog/cat ...) land on the right scene
const fs=require('fs'),vm=require('vm'),path=require('path');const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const order=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const upTo=order.indexOf('js/tarot.js');
const files=order.slice(0,upTo+1);
const el=()=>({getContext:()=>({}),getBoundingClientRect:()=>({bottom:52,top:0}),style:{},dataset:{}});
const ctx={console,Intl,document:{querySelector:el,querySelectorAll:()=>[],documentElement:{style:{setProperty(){}}},getElementById:()=>null},
  matchMedia:()=>({matches:false}),navigator:{language:'zh-CN'},localStorage:{getItem:()=>null,setItem(){}},innerWidth:390,innerHeight:844};
vm.createContext(ctx);ctx.window=ctx;
const src=files.map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^'use strict';/,'')).join('\n');
vm.runInContext(src+'\nthis.__x={SC,LEX,SCN,matchScenes,pickScenes,detectScenes};',ctx);
const {SC,LEX,SCN,matchScenes,pickScenes}=ctx.__x;
const bad=[],ok=m=>{};const fail=m=>bad.push(m);
const lex=Object.keys(LEX),drawn=Object.keys(SC).filter(n=>!n.startsWith('sym:')&&!n.startsWith('card:'));
// 1
lex.forEach(n=>{if(!SC[n])fail(`lexicon scene "${n}" has no drawing`);});
drawn.forEach(n=>{if(!LEX[n])fail(`drawing "${n}" has no keywords in the lexicon`);if(!SCN[n])fail(`drawing "${n}" has no English name in i18n.js`);if(!SC[n].zh)fail(`drawing "${n}" has no Chinese name`);});
// 2
let selectable=0;
drawn.filter(n=>n!=='swirl').forEach(n=>{
  const words=LEX[n].split('|').filter(w=>!/[()\[\]?^$\\]/.test(w));
  const zh=words.find(w=>/[一-鿿]/.test(w)),en=words.find(w=>/^[a-z]+$/i.test(w));
  [zh&&('我梦见'+zh),en&&('I saw the '+en+' there')].filter(Boolean).forEach(t=>{
    if(pickScenes(matchScenes(t)).includes(n))selectable++;else fail(`scene "${n}" is not selected by its own keyword: "${t}" -> ${pickScenes(matchScenes(t)).join(',')||'nothing'}`);});
});
// 3
let built=0;
drawn.forEach(n=>{try{SC[n].build();built++;}catch(e){fail(`drawing "${n}" throws when built: ${e.message}`);}});
// 4
const owner={};
lex.forEach(n=>LEX[n].split('|').forEach(w=>{const k=w.toLowerCase();if(owner[k]&&owner[k]!==n)fail(`keyword "${w}" is listed under both "${owner[k]}" and "${n}"`);owner[k]=n;}));
[['一只狗在追我','canine'],['一只猫坐在窗边','cat'],['a dog barked at me','canine'],['my cat was sleeping','cat'],['狼在叫','canine'],['小猫和小狗在一起',null]]
  .forEach(([t,want])=>{const got=pickScenes(matchScenes(t));
    if(want&&!got.includes(want))fail(`"${t}" should select ${want}, got ${got.join(',')||'nothing'}`);
    if(want==='canine'&&got.includes('cat'))fail(`"${t}" wrongly selects cat`);if(want==='cat'&&got.includes('canine'))fail(`"${t}" wrongly selects dog`);
    if(!want&&!(got.includes('cat')&&got.includes('canine')))fail(`"${t}" should select both cat and dog, got ${got.join(',')}`);});
console.log(`scripts loaded in index.html order: ${files.length}`);
console.log(`lexicon scenes ${lex.length}, drawings ${drawn.length}, keywords ${Object.keys(owner).length}`);
console.log(`own-keyword selections that worked: ${selectable}`);
console.log(`drawings built without error: ${built}`);
if(bad.length){console.log(`\nFAILED (${bad.length})`);bad.forEach(b=>console.log('  - '+b));process.exit(1);}
console.log('registry OK');
