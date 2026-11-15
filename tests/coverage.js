// Measures how many test dreams get specific scenes from the lexicon.
// Run:  node tests/coverage.js        (needs Node 16+, no packages)
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const ctx={console,document:{querySelector:()=>({getContext:()=>({})})},matchMedia:()=>({matches:false}),Intl};vm.createContext(ctx);
ctx.window=ctx;vm.runInContext('const SC={};',ctx);
const src=['js/core.js','js/lexicon.js','js/emotion.js','js/words.js','js/symbols.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^'use strict';/,'')).join('\n');
vm.runInContext(src+'\nthis.__x={LEX,matchScenes,pickScenes,detectEmotion,tokenize,unmatchedTokens,symbolWords};',ctx);
const {matchScenes,pickScenes,detectEmotion,tokenize,unmatchedTokens,symbolWords}=ctx.__x;
const dreams=JSON.parse(fs.readFileSync(path.join(__dirname,'dreams.json'),'utf8'));
const verbose=process.argv.includes('-v');
const res={};
for(const d of dreams){
  const names=pickScenes(matchScenes(d.text)),syms=names.length<2?symbolWords(d.text,!names.length):[];
  const r=res[d.set]||(res[d.set]={n:0,none:0,exp:0,found:0,picked:0,right:0,sym:0});
  r.n++;if(!names.length)r.none++;if(syms.length)r.sym++;
  r.picked+=names.length;
  for(const n of names)if(d.expect.includes(n))r.right++;
  r.exp+=d.expect.length;for(const e of d.expect)if(names.includes(e))r.found++;
  if(verbose)console.log(d.set.padEnd(8),(names.join('+')||'(none)').padEnd(24),'want:',d.expect.join('+').padEnd(22),'sym:',(syms.slice(0,2).join(',')||'-').padEnd(10),d.text.slice(0,30));
}
const pct=(a,b)=>b?(100*a/b).toFixed(0)+'%':'-';
const line=(s,r)=>console.log(`${s.padEnd(8)} no-match ${r.none}/${r.n} (symbol offered in ${r.sym}) | recall ${pct(r.found,r.exp)} (found ${r.found} of ${r.exp} wanted scenes) | precision ${pct(r.right,r.picked)} (${r.right} of ${r.picked} drawn scenes were wanted)`);
const tot={n:0,none:0,exp:0,found:0,picked:0,right:0,sym:0};
for(const s in res){line(s,res[s]);for(const k in tot)tot[k]+=res[s][k];}
line('all',tot);
