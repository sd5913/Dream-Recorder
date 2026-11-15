// Checks how unknown words are classified: object archetype (by head word), abstract concept (by documented table) or unclassified.
// Run:  node tests/classify.js
// The words below were written down BEFORE looking at what the tables return; "none" means no honest evidence exists, so it should stay unclassified.
const fs=require('fs'),vm=require('vm'),path=require('path');const root=path.join(__dirname,'..');
const ctx={console,document:{querySelector:()=>({getContext:()=>({})})},matchMedia:()=>({matches:false}),Intl};vm.createContext(ctx);ctx.window=ctx;vm.runInContext('const SC={};',ctx);
const src=['js/core.js','js/lexicon.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^'use strict';/,'')).join('\n');
vm.runInContext(src+'\nthis.__x={matchScenes,pickScenes,conceptMatches,comboMatches};',ctx);
const {matchScenes,pickScenes,conceptMatches,comboMatches}=ctx.__x;
const T=[ // [word, expected]  obj:scene | con:family | none
['保温杯','obj:cup'],['啤酒瓶','obj:bottle'],['玻璃瓶','obj:bottle'],['饭碗','obj:bowl'],['电饭锅','obj:kettle'],['垃圾桶','obj:jar'],['纸箱','obj:box'],['购物袋','obj:bag'],
['苹果手机','obj:phone'],['笔记本电脑','obj:laptop'],['旧电视','obj:tv'],['单反相机','obj:camera'],['折叠椅','obj:chair'],['餐桌','obj:table'],['羽绒服','obj:shirt'],['连衣裙','obj:dress'],
['草帽','obj:hat'],['运动鞋','obj:shoe'],['水果刀','obj:knife'],['锤子','obj:hammer'],['剪刀','obj:scissors'],['出租车','obj:car'],['摩托车','obj:bicycle'],['足球','obj:ball'],
['鸡蛋','obj:egg'],['硬币','obj:coin'],['生日蛋糕','obj:cake'],['面包','obj:bread'],['油画','obj:picture'],['钢琴','obj:piano'],['小提琴','obj:guitar'],['牙齿','obj:tooth'],
['coffee mug','obj:cup'],['wine bottle','obj:bottle'],['paper bag','obj:bag'],['smartphone','obj:phone'],['leather jacket','obj:shirt'],['red dress','obj:dress'],['guitar','obj:guitar'],['old piano','obj:piano'],
['记忆','con:ripple'],['孤独','con:orbit'],['秘密','con:knot'],['希望','con:crystal'],['噩梦','con:pyramid'],['寂静','con:waves'],['loneliness','con:orbit'],['secret','con:knot'],['memory','con:ripple'],['danger','con:pyramid'],
['量子','none'],['拓扑','none'],['哲学','none'],['zephyr','none'],['quasar','none'],['俄罗斯套娃','none']
];
// second batch, written after the tables were tuned on the first batch: this is the honest, unseen measurement
const T2=[['马克杯','obj:cup'],['热水壶','obj:kettle'],['保险箱','obj:box'],['双肩包','obj:bag'],['行李箱','obj:suitcase'],['平板电脑','obj:laptop'],['沙发床','obj:sofa'],['毛衣','obj:shirt'],['高跟鞋','obj:shoe'],['菜刀','obj:knife'],
['篮球','obj:ball'],['月饼','obj:cake'],['照片','obj:picture'],['吉他','obj:guitar'],['雨衣','obj:shirt'],['bookshelf','obj:table'],['sneakers','obj:shoe'],['backpack','obj:bag'],['teapot','obj:kettle'],['birthday cake','obj:cake'],
['回声','con:ripple'],['距离','con:orbit'],['谜团','con:knot'],['梦想','con:crystal'],['威胁','con:pyramid'],['silence','con:waves'],['hope','con:crystal'],['nightmare','con:pyramid'],
['时间','combo:hourglass+moon'],['爱情','combo:heart+flower'],['死亡','combo:skull+candle'],['自由','combo:fly+cloud'],['wedding','combo:dress+heart'],['betrayal','combo:knife+heart'],['思念','combo:moon+envelope'],['毕业','combo:hat+paper'],['微积分','none'],['政策','none'],['dialectic','none'],['蒸汽朋克','none']];
T.push(...T2);
let ok=0,bad=[];
for(const [w,exp] of T){
  const s=pickScenes(matchScenes(w)),c=conceptMatches(w);
  const k=comboMatches(w),got=k.length?'combo:'+k[0].a+'+'+k[0].b:s.length?'obj:'+s[0]:c.length?'con:'+c[0].fam:'none';
  if(got===exp)ok++;else bad.push(`${w}: wanted ${exp}, got ${got}`);
}
const ok2=T2.filter(([w,e])=>{const s=pickScenes(matchScenes(w)),c=conceptMatches(w);const k=comboMatches(w);return (k.length?'combo:'+k[0].a+'+'+k[0].b:s.length?'obj:'+s[0]:c.length?'con:'+c[0].fam:'none')===e;}).length;
console.log(`unseen batch: ${ok2}/${T2.length}`);
console.log(`classified correctly ${ok}/${T.length} (${(100*ok/T.length).toFixed(0)}%)`);
bad.forEach(b=>console.log('  miss  '+b));
