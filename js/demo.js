'use strict';
// Explicit preview mode uses its own storage key, separate from real dreams.
if(new URLSearchParams(location.search).has('demo')){
(async()=>{
 const samples=[['我梦见一朵巨大的向日葵，月亮挂在海边的天上','joy'],['深夜的楼梯尽头有一扇发光的门，我一直在爬，星星很近','calm'],['小时候的老房子，院子里有一只猫，我很想念那里','nostalgia'],['我在海里游着，忽然像鸟一样飞了起来，风很轻','calm'],['我一直在坠落，什么也抓不住，很害怕','fear'],['一切都很安静，我慢慢地呼吸','strange']];
 if(!archive.length)for(const [t,e] of samples){await commit(t,'demo',e,true);await new Promise(r=>setTimeout(r,100));save(t,e);}
 const params=new URLSearchParams(location.search),requested=Number(params.get('picture'));
 const preview=params.get('picture')&&Number.isInteger(requested)?clamp(requested,0,samples.length-1):1;
 await commit(samples[preview][0],'demo',samples[preview][1],true);
 const label=document.createElement('span');label.textContent=LANG==='en'?'Local preview · sample dreams':'本地演示 · 示例梦境';label.style.cssText='position:fixed;bottom:2px;right:18px;font:10px sans-serif;color:#78849a;z-index:8;pointer-events:none';document.body.append(label);
 if(params.has('picture')){closeArchive();$('#inp').value=samples[preview][0];autosize();}else openArchive();
})();}
