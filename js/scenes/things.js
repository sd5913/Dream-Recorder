'use strict';
function flame(x0,base,h,w){
  const L=[],Rr=[];for(let i=0;i<=24;i++){const u=i/24,g=Math.sin(Math.PI*Math.pow(u,.62))*(1-.35*u)*w,sw=Math.sin(u*4.2+x0*5)*.05*u*h;L.push([x0-g+sw,base-h*u]);Rr.push([x0+g+sw,base-h*u]);}
  hatch([L.concat(Rr.reverse())],Math.PI/2,(x,y)=>{const d=Math.min(1,Math.abs(x-x0)/w);return[8+(1-d)*42,92,46+(1-d)*22];},{min:.06});
}
def('fire','火焰','hero','火|燃|烧|爆炸|fire|burn|flame|explosion',()=>{flame(0,.6,1.2,.28);flame(-.42,.6,.75,.2);flame(.4,.6,.7,.19);});
def('eye','眼睛','hero','眼|盯|凝视|eye|stare|gaze|watching',()=>{
  const top=[],bot=[];for(let i=0;i<=30;i++){const x=-.8+1.6*i/30,h=.3*Math.pow(1-Math.pow(x/.8,2),.9);top.push([x,-h]);bot.push([x,h]);}
  const lens=top.concat(bot.reverse()),iris=ellP(0,0,.26,.26,0,56);
  hatch([lens,iris],0,[40,14,80]);
  const n=Math.round(.17/SP);for(let k=0;k<n;k++){const r=.26-k*SP,f=k/Math.max(1,n-1);if(r>.07)S(closeP(arcP(0,0,r,0,TAU)),[mix(190,45,f),mix(70,90,f),mix(42,60,f)],{keep:1});}
  for(let i=0;i<9;i++){const x=-.6+i*.15,h=.3*Math.pow(1-Math.pow(x/.8,2),.9),a=-Math.PI/2+x*.9;S([[x,-h-.02],[x+Math.cos(a)*.17,-h+Math.sin(a)*.17]],[30,20,70]);}
});
def('cat','猫','hero','猫|狗|动物|宠物|cat|kitten|dog|animal|pet',()=>{
  const bump=(t,c)=>Math.max(0,1-Math.abs(t-c)/.3),head=[];
  for(let i=0;i<120;i++){const t=-Math.PI+i/120*TAU,r=.36+.4*bump(t,-2.3)+.4*bump(t,-.84);head.push([Math.cos(t)*r,.05+Math.sin(t)*r*.92]);}
  const eL=ellP(-.16,-.02,.075,.045,.3,24),eR=ellP(.16,-.02,.075,.045,-.3,24),nose=[[0,.14],[-.04,.08],[.04,.08]];
  hatch([head,eL,eR,nose],0,(x,y)=>[28,22+Math.abs(x)*20,56+(1-Math.abs(x))*14]);
  S(closeP(ellP(-.16,-.02,.105,.07,.3,28)),[75,85,56],{keep:1});S(closeP(ellP(.16,-.02,.105,.07,-.3,28)),[75,85,56],{keep:1});
  [[.3,.12,.8,.04],[.3,.17,.82,.2],[.28,.22,.76,.38]].forEach(([a,b,c,d])=>{S([[-a,b],[-c,d]],[40,10,80]);S([[a,b],[c,d]],[40,10,80]);});
});
def('butterfly','蝴蝶','hero','蝶|虫|butterfly|moth|insect',()=>{
  const col=(x)=>[305-Math.abs(x)*130,70,64];
  [1,-1].forEach(s=>{
    hatch([ellP(s*.32,-.2,.36,.2,-s*.45)],0,col);hatch([ellP(s*.22,.22,.24,.16,s*.5)],0,col);
    S(bez([0,-.3],[s*.08,-.5],[s*.18,-.58],[s*.26,-.64]),[300,40,75]);});
  hatch([ellP(0,.02,.045,.34)],Math.PI/2,[260,30,60],{min:.05,pad:0});
});
def('flower','花','hero','花|向日葵|sunflower|flower|rose|garden|bloom',()=>{
  const fx=0,fy=-.2;
  S(spiralP(fx,fy,.02,.22,SP*.95),(x,y)=>{const d=Math.hypot(x-fx,y-fy)/.22;return[22+d*8,55,22+d*14];},{keep:1});
  const n=26;for(let i=0;i<n;i++){const a=i/n*TAU,r1=.3,r2=.62+.06*Math.sin(i*2.1)+(i%2?0:.08);S([[fx+Math.cos(a)*r1,fy+Math.sin(a)*r1],[fx+Math.cos(a)*r2,fy+Math.sin(a)*r2]],[36+Math.sin(i)*4,95,52+(i%3)*4]);}
  const stem=bez([0,.08],[-.1,.3],[.12,.55],[.04,.85]);[-1,0,1].forEach(j=>S(offs(stem,j*SP*.9),[100,60,40]));
  hatch([ellP(-.22,.5,.2,.075,-.5)],.5,[105,55,40],{min:.05});hatch([ellP(.22,.38,.2,.075,.5)],-.5,[105,55,42],{min:.05});
});
def('snake','蛇','hero','蛇|龙|snake|dragon|serpent',()=>{
  const c=[];for(let x=-.8;x<=.76;x+=.02)c.push([x,.25*Math.sin(x*4.5+.3)]);
  for(let j=-2;j<=2;j++){const o=offs(c,j*SP);S(o,(x)=>[mix(100,52,(x+.8)/1.6),70,mix(38,56,(x+.8)/1.6)],j===0?{}:{});}
});
def('falling','坠落','hero','坠|掉|跌|跳|fall|drop|jump|plunge',()=>{
  for(let i=0;i<14;i++){const x=-.7+i*.108;if(Math.abs(x)<.14)continue;const y0=-.8+R()*.4,y1=Math.min(.8,y0+.7+R()*.6);S([[x,y1],[x+.02,y0]],[215,25,64]);}
  S(closeP(ellP(0,.36,.07,.07,0,20)),[10,70,68],{keep:1});S([[0,.28],[0,-.02]],[10,70,68]);
  S([[0,.18],[-.2,.02]],[10,70,68]);S([[0,.18],[.2,.02]],[10,70,68]);S([[0,-.02],[-.13,-.3]],[10,70,68]);S([[0,-.02],[.15,-.28]],[10,70,68]);
});
def('road','路','ground','路|走|追|跑|逃|车|开车|road|walk|path|chase|run|running|escape|drive|car|train',()=>{
  hatch([[[-.72,.6],[.72,.6],[.06,-.1],[-.06,-.1]]],0,(x,y)=>[220,14,34+(-y+.6)*18]);
  S([[-.74,.62],[-.07,-.12]],[30,70,62]);S([[.74,.62],[.07,-.12]],[30,70,62]);
  for(let i=0;i<5;i++){const y0=.55-i*.14*(1-i*.1),y1=y0-.08*(1-i*.1);S([[0,y0],[0,y1]],[48,90,70],{});}
  const h=[];for(let x=-.85;x<=.85;x+=.05)h.push([x,-.14+Math.sin(x*9)*.01]);S(h,[260,40,62]);
});
def('city','城市','ground','城|高楼|大楼|街|city|building|street|town',()=>{
  [[-.8,.3],[-.55,.55],[-.28,.4],[0,.7],[.26,.45],[.52,.6]].forEach(([x0,h],i)=>{
    const hue=205+i*8;hatch([[[x0,.55-h],[x0+.22,.55-h],[x0+.22,.55],[x0,.55]]],Math.PI/2,(x,y)=>((Math.floor(y*18)+i)%5===0)?[46,90,66]:[hue,30,34+(.55-y)*20],{min:.06});});
});
def('paper','试卷','hero','考试|试卷|作业|书|学校|课|exam|test|paper|homework|book|school|class',()=>{
  hatch([[[-.45,-.6],[.25,-.6],[.45,-.4],[.45,.6],[-.45,.6]]],0,[45,14,86]);
  hatch([[[.25,-.58],[.43,-.4],[.25,-.4]]],Math.PI/4,[30,30,60],{min:.04});
});
def('person','人影','hero','人|朋友|妈|爸|孩子|老师|同学|person|friend|mother|father|family|child|girl|boy|someone|teacher',()=>{
  S(spiralP(0,-.42,.02,.15,SP),[28,45,66],{keep:1});
  hatch([[[-.3,.6],[-.28,.02],[-.18,-.16],[.18,-.16],[.28,.02],[.3,.6]]],0,(x,y)=>[215,40,40+(.6-y)*25]);
});
def('swirl','漩涡','hero','$^',()=>{
  for(let a=0;a<3;a++)for(let j=-1;j<=1;j++){const p=[];for(let i=0;i<=140;i++){const u=i/140,r=.06+.8*u+j*SP,t=a*TAU/3+u*4.2;p.push([Math.cos(t)*r,Math.sin(t)*r*.85]);}
    S(p,(x,y)=>[(250+Math.hypot(x,y)*120)%360,70,56+Math.hypot(x,y)*14],{keep:1});}
});
for(const k in SC)SC[k].rx=SC[k].kw==='$^'?null:rxOf(SC[k].kw);

function detectScenes(text){
  const hits=[];
  for(const k in SC){const rx=SC[k].rx;if(!rx)continue;rx.lastIndex=0;const m=rx.exec(text);if(m)hits.push([m.index,k]);}
  hits.sort((a,b)=>a[0]-b[0]);
  let names=hits.map(h=>h[1]);
  if(names.includes('forest'))names=names.filter(n=>n!=='tree');
  names=names.slice(0,3);
  return names.length?names:['swirl'];
}
