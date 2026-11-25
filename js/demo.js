'use strict';
/* The original six dreams belong to the normal archive, alongside saved entries.
   They are built-in read-only examples, not a separate archive or stored copies. */
const EXAMPLE_DREAMS=[
 ['我梦见一朵巨大的向日葵，月亮挂在海边的天上','joy'],
 ['深夜的楼梯尽头有一扇发光的门，我一直在爬，星星很近','calm'],
 ['小时候的老房子，院子里有一只猫，我很想念那里','nostalgia'],
 ['我在海里游着，忽然像鸟一样飞了起来，风很轻','calm'],
 ['我一直在坠落，什么也抓不住，很害怕','fear'],
 ['一切都很安静，我慢慢地呼吸','strange']
];
function exampleShape(text,emo){
  const old={cur,E,SP,OUT,R};
  try{
    let pool=tokenize(text);const dust=unmatchedTokens(pool),names=detectScenes(text,emo,dust);
    while(pool.length<14)pool=pool.concat(pool);
    const c={text,names,seed:hash(text),pool,dust,tone:detectTone(text)};
    cur=c;E=EMO[emo];
    const list=buildList(c).filter(p=>!p.dim),step=Math.max(1,Math.ceil(list.length/640));
    return list.filter((_,i)=>i%step===0).map(p=>{tint(p);return[+p.ux.toFixed(3),+p.uy.toFixed(3),p.css];});
  }finally{cur=old.cur;E=old.E;SP=old.SP;OUT=old.OUT;R=old.R;}
}
archiveExamples=EXAMPLE_DREAMS.map(([text,emo],i)=>({id:'example:'+i,text,emo,ts:0,_preset:true,shape:exampleShape(text,emo)})).reverse();
renderArchive();
