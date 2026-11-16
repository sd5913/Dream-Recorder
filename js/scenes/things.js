'use strict';
function flame(x0,base,h,w){
  const L=[],Rr=[];for(let i=0;i<=24;i++){const u=i/24,g=Math.sin(Math.PI*Math.pow(u,.62))*(1-.35*u)*w,sw=Math.sin(u*4.2+x0*5)*.05*u*h;L.push([x0-g+sw,base-h*u]);Rr.push([x0+g+sw,base-h*u]);}
  hatch([L.concat(Rr.reverse())],Math.PI/2,(x,y)=>{const d=Math.min(1,Math.abs(x-x0)/w);return[8+(1-d)*42,92,46+(1-d)*22];},{min:.06});
}
def('fire','火焰','hero',LEX.fire,()=>{flame(0,.6,1.2,.28);flame(-.42,.6,.75,.2);flame(.4,.6,.7,.19);});
def('eye','眼睛','hero',LEX.eye,()=>{
  const top=[],bot=[];for(let i=0;i<=30;i++){const x=-.8+1.6*i/30,h=.3*Math.pow(1-Math.pow(x/.8,2),.9);top.push([x,-h]);bot.push([x,h]);}
  const lens=top.concat(bot.reverse()),iris=ellP(0,0,.26,.26,0,56);
  hatch([lens,iris],0,[40,14,80]);
  const n=Math.round(.17/SP);for(let k=0;k<n;k++){const r=.26-k*SP,f=k/Math.max(1,n-1);if(r>.07)S(closeP(arcP(0,0,r,0,TAU)),[mix(190,45,f),mix(70,90,f),mix(42,60,f)],{keep:1});}
  for(let i=0;i<9;i++){const x=-.6+i*.15,h=.3*Math.pow(1-Math.pow(x/.8,2),.9),a=-Math.PI/2+x*.9;S([[x,-h-.02],[x+Math.cos(a)*.17,-h+Math.sin(a)*.17]],[30,20,70]);}
});
def('cat','猫','hero',LEX.cat,()=>{
  const bump=(t,c)=>Math.max(0,1-Math.abs(t-c)/.3),head=[];
  for(let i=0;i<120;i++){const t=-Math.PI+i/120*TAU,r=.36+.4*bump(t,-2.3)+.4*bump(t,-.84);head.push([Math.cos(t)*r,.05+Math.sin(t)*r*.92]);}
  const eL=ellP(-.16,-.02,.075,.045,.3,24),eR=ellP(.16,-.02,.075,.045,-.3,24),nose=[[0,.14],[-.04,.08],[.04,.08]];
  hatch([head,eL,eR,nose],0,(x,y)=>[28,22+Math.abs(x)*20,56+(1-Math.abs(x))*14]);
  S(closeP(ellP(-.16,-.02,.105,.07,.3,28)),[75,85,56],{keep:1});S(closeP(ellP(.16,-.02,.105,.07,-.3,28)),[75,85,56],{keep:1});
  [[.3,.12,.8,.04],[.3,.17,.82,.2],[.28,.22,.76,.38]].forEach(([a,b,c,d])=>{S([[-a,b],[-c,d]],[40,10,80]);S([[a,b],[c,d]],[40,10,80]);});
});
def('butterfly','蝴蝶','hero',LEX.butterfly,()=>{
  const col=(x)=>[305-Math.abs(x)*130,70,64];
  [1,-1].forEach(s=>{
    hatch([ellP(s*.32,-.2,.36,.2,-s*.45)],0,col);hatch([ellP(s*.22,.22,.24,.16,s*.5)],0,col);
    S(bez([0,-.3],[s*.08,-.5],[s*.18,-.58],[s*.26,-.64]),[300,40,75]);});
  hatch([ellP(0,.02,.045,.34)],Math.PI/2,[260,30,60],{min:.05,pad:0});
});
def('flower','花','hero',LEX.flower,()=>{
  const fx=0,fy=-.2;
  S(spiralP(fx,fy,.02,.22,SP*.95),(x,y)=>{const d=Math.hypot(x-fx,y-fy)/.22;return[22+d*8,55,22+d*14];},{keep:1});
  const n=26;for(let i=0;i<n;i++){const a=i/n*TAU,r1=.3,r2=.62+.06*Math.sin(i*2.1)+(i%2?0:.08);S([[fx+Math.cos(a)*r1,fy+Math.sin(a)*r1],[fx+Math.cos(a)*r2,fy+Math.sin(a)*r2]],[36+Math.sin(i)*4,95,52+(i%3)*4]);}
  const stem=bez([0,.08],[-.1,.3],[.12,.55],[.04,.85]);[-1,0,1].forEach(j=>S(offs(stem,j*SP*.9),[100,60,40]));
  hatch([ellP(-.22,.5,.2,.075,-.5)],.5,[105,55,40],{min:.05});hatch([ellP(.22,.38,.2,.075,.5)],-.5,[105,55,42],{min:.05});
});
def('snake','蛇','hero',LEX.snake,()=>{
  const c=[];for(let x=-.8;x<=.76;x+=.02)c.push([x,.25*Math.sin(x*4.5+.3)]);
  for(let j=-2;j<=2;j++){const o=offs(c,j*SP);S(o,(x)=>[mix(100,52,(x+.8)/1.6),70,mix(38,56,(x+.8)/1.6)],j===0?{}:{});}
});
def('falling','坠落','hero',LEX.falling,()=>{
  for(let i=0;i<14;i++){const x=-.7+i*.108;if(Math.abs(x)<.14)continue;const y0=-.8+R()*.4,y1=Math.min(.8,y0+.7+R()*.6);S([[x,y1],[x+.02,y0]],[215,25,64]);}
  S(closeP(ellP(0,.36,.07,.07,0,20)),[10,70,68],{keep:1});S([[0,.28],[0,-.02]],[10,70,68]);
  S([[0,.18],[-.2,.02]],[10,70,68]);S([[0,.18],[.2,.02]],[10,70,68]);S([[0,-.02],[-.13,-.3]],[10,70,68]);S([[0,-.02],[.15,-.28]],[10,70,68]);
});
def('road','路','ground',LEX.road,()=>{
  hatch([[[-.72,.6],[.72,.6],[.06,-.1],[-.06,-.1]]],0,(x,y)=>[220,14,34+(-y+.6)*18]);
  S([[-.74,.62],[-.07,-.12]],[30,70,62]);S([[.74,.62],[.07,-.12]],[30,70,62]);
  for(let i=0;i<5;i++){const y0=.55-i*.14*(1-i*.1),y1=y0-.08*(1-i*.1);S([[0,y0],[0,y1]],[48,90,70],{});}
  const h=[];for(let x=-.85;x<=.85;x+=.05)h.push([x,-.14+Math.sin(x*9)*.01]);S(h,[260,40,62]);
});
def('city','城市','ground',LEX.city,()=>{
  [[-.8,.3],[-.55,.55],[-.28,.4],[0,.7],[.26,.45],[.52,.6]].forEach(([x0,h],i)=>{
    const hue=205+i*8;hatch([[[x0,.55-h],[x0+.22,.55-h],[x0+.22,.55],[x0,.55]]],Math.PI/2,(x,y)=>((Math.floor(y*18)+i)%5===0)?[46,90,66]:[hue,30,34+(.55-y)*20],{min:.06});});
});
def('paper','试卷','hero',LEX.paper,()=>{
  hatch([[[-.45,-.6],[.25,-.6],[.45,-.4],[.45,.6],[-.45,.6]]],0,[45,14,86]);
  hatch([[[.25,-.58],[.43,-.4],[.25,-.4]]],Math.PI/4,[30,30,60],{min:.04});
});
def('person','人影','hero',LEX.person,()=>{
  S(spiralP(0,-.42,.02,.15,SP),[28,45,66],{keep:1});
  hatch([[[-.3,.6],[-.28,.02],[-.18,-.16],[.18,-.16],[.28,.02],[.3,.6]]],0,(x,y)=>[215,40,40+(.6-y)*25]);
});
def('swirl','漩涡','hero',LEX.swirl,()=>{
  for(let a=0;a<3;a++)for(let j=-1;j<=1;j++){const p=[];for(let i=0;i<=140;i++){const u=i/140,r=.06+.8*u+j*SP,t=a*TAU/3+u*4.2;p.push([Math.cos(t)*r,Math.sin(t)*r*.85]);}
    S(p,(x,y)=>[(250+Math.hypot(x,y)*120)%360,70,56+Math.hypot(x,y)*14],{keep:1});}
});

/* which scenes to draw for a dream.
   1. keywords pick known scenes;  2. with room to spare, an unknown noun becomes an abstract symbol;
   3. with no keyword at all, the emotion picks a default scene and unknown nouns become symbols. */
function detectScenes(text,emo,dust){
  const hits=matchScenes(text),names=pickScenes(hits);
  /* tarot cards: an idea drawn as two existing pictures */
  const combos=comboMatches(text);
  const cons=[],seen=new Set();conceptMatches(text).forEach(c=>{if(!seen.has(c.fam)&&!combos.some(k=>k.word===c.word)){seen.add(c.fam);cons.push(c);}});
  const unk=symbolWords(text,!names.length&&!cons.length&&!combos.length).filter(w=>!cons.some(c=>c.word===w||w.includes(c.word))&&!combos.some(c=>c.word===w||w.includes(c.word)));
  const cand=cons.map(c=>({word:c.word,fam:c.fam,kind:'concept',why:c.why})).concat(unk.map(w=>({word:w,fam:'',kind:'unclassified',why:''})));
  /* a scene that matched only through a word the combo card already explains gives way to the card (时间 is hourglass + moon, not just a clock) */
  let out=names.filter(n=>{const h=hits.find(x=>x.name===n);return !(h&&combos.length&&h.words.every(w=>combos.some(c=>c.word.toLowerCase().includes(w))));});const basis=[];
  const room=()=>3-out.length;
  /* 1. combo cards, while there is room for both pictures */
  for(const c of combos){
    const need=[c.a,c.b].filter(n=>!out.includes(n));
    if(need.length&&need.length<=room()){need.forEach(n=>out.push(n));basis.push({word:c.word,kind:'combo',why:c.why,parts:[c.a,c.b]});}
    else if(!need.length)basis.push({word:c.word,kind:'combo',why:c.why,parts:[c.a,c.b]});
  }
  /* 2. nothing at all: emotion defaults, plus symbols */
  let use=[];
  if(!out.length){
    const fb=EMO_FALLBACK[emo]||['swirl'];
    use=cand.slice(0,2);out=cand.length?[fb[0]]:fb.slice();out.fallback=true;
  }else if(out.length<2)use=cand.slice(0,1);
  basis.push(...use);out.basis=basis;
  use.forEach(u=>out.push(ensureSymbol(u.word,u.fam)));
  out.hits=hits;out.symbols=use.map(u=>u.word);
  return out;
}
