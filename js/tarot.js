'use strict';
/* ---------- the abstract deck: 31 shapes, used like the cards of a tarot deck ----------
   An abstract shape is used when a dream has no picture of its own. Each card has:
   - a layer: sky (hangs above), heart (stands in the middle) or ground (lies below), so a spread of three makes one picture, not three tiles
   - an energy from 0 (still) to 1 (violent)
   - an affinity to each of the six moods, 0..1: how well the shape carries that mood
   - a meaning, shown in the caption, which is the reason the shape fits
   The table is a design convention written by the team, not a fact; docs/vocabulary-and-mapping.md lists it in full. */
//            fam            zh     en              layer    energy hue  calm joy fear sad strange nostalgia   meaning zh / en
const DECK=[
  ['halo',         '光晕','Halo',          'sky',   .15, 45, [1, .6, 0, .2, .1, .4],'安宁、被照亮','peace, being lit'],
  ['phases',       '月相','Moon phases',   'sky',   .3, 220, [.6,.1,.1,.5,.4, .9],'盈亏、等待','waxing and waning, waiting'],
  ['constellation','星座','Constellation', 'sky',   .35,200, [.5,.4,.1,.2,.5, .7],'相连、命运','connected, fate'],
  ['orbit',        '轨道','Orbit',         'sky',   .4, 260, [.4,.1,.2,.7,.4, .6],'围绕与距离','circling, distance'],
  ['veil',         '帷幕','Veil',          'sky',   .25,280, [.4,0, .4,.5,.8, .4],'遮蔽、朦胧','hidden, hazy'],
  ['crystal',      '水晶','Crystal',       'heart', .4, 190, [.6,.6,0, .1,.4, .3],'透明、发光、易碎','clear, glowing, fragile'],
  ['bloom',        '绽放','Bloom',         'heart', .6, 330, [.4,1, 0, 0, .1, .4],'打开、生长','opening, growing'],
  ['burst',        '迸发','Burst',         'heart', 1,   30, [0, 1, .4,0, .3, 0],'突然向外迸发','bursts outward'],
  ['drop',         '水滴','Drop',          'heart', .2, 205, [.3,0, .1,1, .1, .5],'一点点汇聚、孕育','gathers drop by drop'],
  ['pyramid',      '尖塔','Spire',         'heart', .7,   0, [0, 0, 1, .2,.4, 0],'尖锐、层层逼近','sharp, closing in'],
  ['shards',       '碎片','Shards',        'heart', .9, 350, [0, 0, .8,.6,.5, 0],'破碎、震惊','broken, shocked'],
  ['cage',         '牢笼','Cage',          'heart', .5, 230, [0, 0, .8,.5,.3, 0],'困住、出不去','trapped'],
  ['knot',         '绳结','Knot',          'heart', .5, 300, [0, 0, .4,.3,.9, .2],'缠绕、解不开','tangled, hard to undo'],
  ['spiral',       '漩涡','Vortex',        'heart', .8, 270, [0, .2,.5,.1,1,  0],'卷入、失控','pulled in, out of control'],
  ['mirror',       '镜像','Mirror',        'heart', .3, 180, [.3,0, .3,.2,1, .3],'另一个自己','another self'],
  ['arch',         '门槛','Threshold',     'heart', .4,  35, [.3,.3,.3,.2,.5, .4],'将要跨过','about to cross'],
  ['ascent',       '上升','Ascent',        'heart', .7, 150, [.2,.8,0, 0, .3, .1],'向上、挣脱','rising, breaking free'],
  ['descent',      '下沉','Descent',       'heart', .75,240, [0, 0, .8,.8,.3, 0],'下沉、失去','sinking, losing'],
  ['fan',          '展翼','Wings',         'heart', .7, 160, [.3,.9,0, 0, .2, .2],'展开、自由','unfolding, free'],
  ['waves',        '声波','Waves',         'ground',.5, 200, [.5,.3,.3,.3,.4, .3],'会传播、起伏','travels, rises and falls'],
  ['ripple',       '涟漪','Ripples',       'ground',.2, 210, [.7,.1,0, .4,.2,  1],'会扩散、会淡去','spreads and fades'],
  ['roots',        '根系','Roots',         'ground',.2,  25, [.4,.1,.1,.3,.2,  1],'来处、扎根','where you come from'],
  /* added for the three big families of dreams (docs/dream-types.md): close to waking life, frightening, surreal */
  ['loop',         '循环','Loop',          'heart', .45,280, [.2,0, .4,.3,1, .6],'一遍又一遍，回到原点','over and over, back to the start'],
  ['melt',         '融化','Melting',       'heart', .4,  20, [.1,0, .4,.5,.9, .2],'融化、变形','melting, losing shape'],
  ['nest',         '无尽','Endless',       'heart', .35,250, [.2,.1,.3,.1,.9, .3],'越变越大或越变越小，没有尽头','growing or shrinking without end'],
  ['shadow',       '黑影','Shadow',        'heart', .5, 240, [0, 0, 1, .3,.6, .2],'看不清的身影','a figure you cannot make out'],
  ['eyes',         '眼睛','Eyes',          'sky',   .5,   0, [0, 0, 1, .1,.7,  0],'被看着','being watched'],
  ['inversion',    '倒悬','Upside down',   'sky',   .45,190, [.1,.1,.3,.1,1, .2],'颠倒、反过来','turned upside down'],
  ['crack',        '裂缝','Crack',         'ground',.85, 15, [0, 0, .9,.4,.4,  0],'脚下裂开','the ground splits'],
  ['thorns',       '荆棘','Thorns',        'ground',.6, 340, [0, 0, .8,.7,.3,  0],'刺、疼','thorns, pain'],
  ['dunes',        '沙丘','Dunes',         'ground',.15, 35, [.6,.1,.1,.6,.5, .5],'空旷、荒芜','empty, barren'],
];
const MOODS=['calm','joy','fear','sad','strange','nostalgia'];
const CARD={};DECK.forEach(([fam,zh,en,layer,e,hue,aff,mz,me])=>{CARD[fam]={fam,zh,en,layer,e,hue,aff:Object.fromEntries(MOODS.map((m,i)=>[m,aff[i]])),mz,me};});
/* card meanings are also the reasons shown for concept words, so their English goes into the shared table */
if(typeof WHY_EN!=='undefined')DECK.forEach(c=>{WHY_EN[c[7]]=c[8];});
const WIDE_CARDS=new Set(['phases','constellation','veil','eyes','inversion']);   /* spread across the top like stars or clouds */
const WATER_CARDS=new Set(['waves','ripple']);                 /* a front ground that things float in, like the sea */

/* ---------- drawings (normalised box, about -0.6..0.6) ---------- */
const DRAW={
  orbit(h){hatch([ellP(0,0,.2,.2)],0,(x,y)=>[h(x,y),62,60]);const n=2+Math.floor(R()*2);
    for(let i=0;i<n;i++){const rot=-.6+i*(1.2/Math.max(1,n-1))+(R()-.5)*.3,rx=.42+i*.16;S(closeP(ellP(0,0,rx,rx*.36,rot,72)),[h(0,0)+i*25,60,64-i*5],{keep:1});}},
  ripple(h){const n=6;for(let k=0;k<n;k++){const r=.72-k*.115,f=k/(n-1);S(closeP(ellP(0,0,r,r*.3,0,80)),[h(0,f-.5),58,mix(44,70,f)],{keep:1});}
    hatch([ellP(0,0,.07,.025)],0,[h(0,0),60,76]);},
  crystal(h){const w=.34+R()*.1,top=[[0,-.62],[w,-.12],[0,.62],[-w,-.12]];hatch([top],(R()-.5)*.5,(x,y)=>[h(x,y),58,52+Math.abs(x)*40]);
    top.forEach(q=>S([[0,-.12],q],[h(0,0)+20,30,84]));},
  burst(h){const n=6+Math.floor(R()*4),p=[];for(let i=0;i<n*2;i++){const a=i/(n*2)*TAU-Math.PI/2,r=i%2?.2:.58;p.push([Math.cos(a)*r,Math.sin(a)*r]);}
    hatch([p],0,(x,y)=>[h(x,y),66,56+(1-Math.hypot(x,y))*16]);},
  waves(h){const n=5,amp=.06+R()*.04;for(let k=0;k<n;k++){const p=[],y0=-.24+k*(.48/(n-1)),ph=R()*TAU;for(let i=0;i<=60;i++){const x=-.7+1.4*i/60;p.push([x,y0+Math.sin(i/60*TAU*2+ph)*amp]);}
    S(p,[h(0,y0),62,mix(52,68,k/(n-1))],{keep:1});}},
  pyramid(h){for(let k=0;k<4;k++){const s=1-k*.22,y=.5-k*.06;S(closeP([[0,-.6*s+.08*k],[.5*s,y*s],[-.5*s,y*s]]),[h(0,k/3-.5),60,mix(56,70,k/3)],{keep:1});}
    S(closeP(ellP(0,.1,.06,.06)),[h(0,0)+60,70,70],{keep:1});},
  drop(h){const p=bez([0,-.62],[-.34,-.1],[-.36,.3],[0,.36],30).concat(bez([0,.36],[.36,.3],[.34,-.1],[0,-.62],30));hatch([p],0,(x,y)=>[h(x,y),62,56+y*14]);
    [.1,.2].forEach((d,i)=>S(closeP(ellP(0,.5+i*.12,.3+d,.06+i*.02,0,48)),[h(0,.5)+30,50,62-i*8],{keep:1}));},
  knot(h){const a=2+Math.floor(R()*2),b=3+Math.floor(R()*2),ph=R()*TAU;
    [0,.03].forEach((d,i)=>{const p=[];for(let k=0;k<=160;k++){const t=k/160*TAU;p.push([(.55+d)*Math.sin(a*t+ph),(.5+d)*Math.sin(b*t)]);}S(p,[h(0,0)+i*30,62,62],{keep:1});});},
  halo(h){hatch([ellP(0,0,.16,.16)],0,(x,y)=>[h(x,y),70,72]);
    for(let k=0;k<3;k++)S(closeP(arcP(0,0,.26+k*.1,0,TAU)),[h(0,0)+k*8,55,70-k*8],{keep:1});
    const n=16;for(let i=0;i<n;i++){const a=i/n*TAU,r0=.6,r1=i%2?.68:.76;S([[Math.cos(a)*r0,Math.sin(a)*r0],[Math.cos(a)*r1,Math.sin(a)*r1]],[h(0,0),55,66]);}},
  phases(h){const n=5;for(let i=0;i<n;i++){const x=-.8+i*.4,f=i/(n-1),r=.13;
    S(closeP(arcP(x,0,r,0,TAU)),[h(x,0),40,58],{keep:1});
    const k=Math.cos(f*TAU);   /* how much of the disc is dark: new, crescent, full, crescent, new */
    if(i===2)hatch([arcP(x,0,r,0,TAU)],0,[h(x,0),60,74]);
    else{const side=i<2?1:-1,lit=arcP(x,0,r,-Math.PI/2,Math.PI/2).map(([px,py])=>[x+(px-x)*side,py]);
      const inner=[];for(let j=0;j<=20;j++){const t=Math.PI/2-j/20*Math.PI;inner.push([x+Math.cos(t)*r*k*side*.9,Math.sin(t)*r]);}
      hatch([lit.concat(inner.reverse())],0,[h(x,0),60,72]);}}},
  constellation(h){const pts=[];for(let i=0;i<8;i++)pts.push([-.8+i*.23+(R()-.5)*.1,(R()-.5)*.34]);
    pts.forEach((p,i)=>{if(i)S([pts[i-1],p],[h(p[0],0),35,60]);if(i>2&&R()<.4)S([pts[i-3],p],[h(p[0],0),30,52]);
      const s=.03+R()*.02;S([[p[0]-s,p[1]],[p[0]+s,p[1]]],[h(p[0],0),60,80],{keep:1});S([[p[0],p[1]-s],[p[0],p[1]+s]],[h(p[0],0),60,80],{keep:1});
      hatch([ellP(p[0],p[1],.018,.018)],0,[h(p[0],0),60,82]);});},
  veil(h){S([[-.85,-.3],[.85,-.3]],[h(0,-.3),30,60],{keep:1});
    for(let i=0;i<14;i++){const x0=-.82+i*.126,p=[];for(let j=0;j<=24;j++){const t=j/24;p.push([x0+Math.sin(t*5+i)*.03*t,-.3+t*(.5+Math.sin(i*1.7)*.12)]);}
      S(p,[h(x0,0),45,mix(64,48,i%3/2)],{keep:1});}},
  bloom(h){const n=7;for(let i=0;i<n;i++){const a=i/n*TAU,cx=Math.cos(a)*.28,cy=Math.sin(a)*.28;hatch([ellP(cx,cy,.26,.12,a,40)],0,(x,y)=>[h(x,y),62,66-Math.hypot(x,y)*14]);}
    hatch([ellP(0,0,.1,.1)],0,[h(0,0)+40,70,70]);},
  shards(h){const n=7;for(let i=0;i<n;i++){const a=i/n*TAU+R()*.4,d=.12+R()*.32,cx=Math.cos(a)*d,cy=Math.sin(a)*d,s=.1+R()*.12,b=R()*TAU;
    const tri=[0,1,2].map(k=>{const t=b+k*2.1+(R()-.5)*.6;return[cx+Math.cos(t)*s*(1+R()*.6),cy+Math.sin(t)*s];});
    hatch([tri],R()*3,(x,y)=>[h(x,y),58,60+(x-y)*20]);S(closeP(tri),[h(cx,cy),40,78]);}},
  cage(h){S(arcP(0,-.3,.34,Math.PI,TAU),[h(0,-.3),40,64],{keep:1});S([[-.34,-.3],[-.34,.5]],[h(0,0),40,62],{keep:1});S([[.34,-.3],[.34,.5]],[h(0,0),40,62],{keep:1});
    for(let i=1;i<6;i++){const x=-.34+i*.68/6,top=-.3-Math.sqrt(Math.max(0,.34*.34-x*x));S([[x,top],[x,.5]],[h(x,0),40,60],{keep:1});}
    [[-.3],[.1],[.5]].forEach(([y])=>S([[-.36,y],[.36,y]],[h(0,y),40,56],{keep:1}));S([[0,-.64],[0,-.76]],[h(0,-.7),40,60],{keep:1});},
  spiral(h){[0,Math.PI].forEach((o,j)=>{const p=[];for(let k=0;k<=200;k++){const t=k/200,a=o+t*TAU*2.6,r=.04+t*.58;p.push([Math.cos(a)*r,Math.sin(a)*r*.8]);}
    S(p,[h(0,j-.5),62,mix(70,52,j)],{keep:1});});},
  mirror(h){S([[0,-.62],[0,.62]],[h(0,0),20,70],{keep:1});
    const half=bez([0,-.5],[-.5,-.5],[-.42,.1],[-.12,.52],24).concat([[0,.52]]);hatch([half.concat([[0,-.5]])],0,(x,y)=>[h(x,y),58,60+y*10]);
    S(half.map(([x,y])=>[-x,y]),[h(.2,0),40,72],{keep:1});S(arcP(-.24,-.18,.05,0,TAU),[h(0,0),20,30],{keep:1});S(arcP(.24,-.18,.05,0,TAU),[h(0,0),40,72],{keep:1});},
  arch(h){const o=arcP(0,-.1,.4,Math.PI,TAU).concat([[.4,.5],[-.4,.5]]),i=arcP(0,-.1,.26,Math.PI,TAU).concat([[.26,.5],[-.26,.5]]);
    hatch([o,i],0,(x,y)=>[h(x,y),50,58-y*10]);hatch([i],0,[h(0,0)+30,60,74],{});
    [0,1,2].forEach(k=>S([[-.46-k*.06,.5+k*.06],[.46+k*.06,.5+k*.06]],[h(0,.5),30,56-k*6],{keep:1}));},
  ascent(h){for(let k=0;k<5;k++){const y=.5-k*.24,w=.42-k*.05;S([[-w,y],[0,y-.18],[w,y]],[h(0,y),60,mix(52,74,k/4)],{keep:1});
    S([[-w,y+.04],[0,y-.14],[w,y+.04]],[h(0,y),50,mix(48,66,k/4)]);}},
  descent(h){for(let k=0;k<5;k++){const y=-.5+k*.24,w=.42-k*.05;S([[-w,y],[0,y+.18],[w,y]],[h(0,y),55,mix(70,46,k/4)],{keep:1});}
    for(let i=0;i<4;i++){const x=-.5+i*.33+(R()-.5)*.08;S([[x,-.62],[x,-.62+.3+R()*.5]],[h(x,0),30,54]);}},
  fan(h){[-1,1].forEach(s=>{for(let i=0;i<8;i++){const a=-Math.PI/2+s*(.25+i*.17),L=.62-i*.03;
    S(bez([0,.42],[s*.12,.2],[Math.cos(a)*L*.6,.42+Math.sin(a)*L*.6],[Math.cos(a)*L,.42+Math.sin(a)*L],18),[h(s*.3,0),58,mix(70,54,i/7)],{keep:1});}});
    hatch([ellP(0,.44,.06,.06)],0,[h(0,.4),60,70]);},
  loop(h){[0,1].forEach(j=>{const r=.5-j*.17,a0=-Math.PI/2+.5+j*1.6,a1=a0+TAU-.7;S(arcP(0,0,r,a0,a1,r,r*.86),[h(0,j-.5),60,mix(66,54,j)],{keep:1});
    const ex=Math.cos(a1)*r,ey=Math.sin(a1)*r*.86,ta=a1+Math.PI/2,ux=Math.cos(ta),uy=Math.sin(ta)*.86;
    S([[ex-ux*.09+uy*.06,ey-uy*.09-ux*.06],[ex,ey],[ex-ux*.09-uy*.06,ey-uy*.09+ux*.06]],[h(0,j-.5),60,70],{keep:1});});
    hatch([ellP(0,0,.06,.06)],0,[h(0,0),60,74]);},
  melt(h){const top=arcP(0,-.1,.42,Math.PI,TAU),drip=[];const n=7;
    for(let i=0;i<=n*4;i++){const x=.42-i*.84/(n*4),k=i%4,L=[0,.18,.42+R()*.2,.18][k];drip.push([x,-.1+L*(.6+.4*Math.sin(i*1.3+1))]);}
    hatch([top.concat(drip)],0,(x,y)=>[h(x,y),58,64-y*20]);
    for(let i=0;i<3;i++){const x=-.3+i*.3+(R()-.5)*.08;hatch([bez([x,.38+i*.04],[x-.05,.48],[x-.04,.54],[x,.55],10).concat(bez([x,.55],[x+.04,.54],[x+.05,.48],[x,.38+i*.04],10))],0,[h(x,.5),58,60],{min:.03});}},
  nest(h){for(let k=0;k<8;k++){const s=.62*Math.pow(.78,k),a=k*.19,c=Math.cos(a),sn=Math.sin(a);
    S(closeP([[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>[(x*c-y*sn)*s*.8,(x*sn+y*c)*s*.8])),[h(0,k/7-.5),58,mix(54,74,k/7)],{keep:1});}},
  shadow(h){const b=bez([-.3,.6],[-.34,.1],[-.24,-.12],[-.1,-.16],20).concat(bez([.1,-.16],[.24,-.12],[.34,.1],[.3,.6],20));
    hatch([ellP(0,-.36,.15,.18)],0,[h(0,-.4),20,20]);hatch([b],0,(x,y)=>[h(x,y),16,16+(.6-y)*10]);
    [.035,.07].forEach((d,i)=>{S(closeP(ellP(d,-.36,.15,.18)),[h(0,0),20,34-i*8]);S(b.map(([x,y])=>[x+d,y]),[h(0,0),20,34-i*8]);});},
  eyes(h){for(let i=0;i<5;i++){const x=-.8+i*.4,y=(i%2?.06:-.04),w=.15,e=bez([x-w,y],[x-w*.4,y-.11],[x+w*.4,y-.11],[x+w,y],16).concat(bez([x+w,y],[x+w*.4,y+.11],[x-w*.4,y+.11],[x-w,y],16));
    S(e,[h(x,0),40,72],{keep:1});hatch([ellP(x,y,.05,.05)],0,[h(x,0),70,46],{min:.03});}},
  inversion(h){S([[-.85,0],[.85,0]],[h(0,0),30,66],{keep:1});
    [[-.55,.34],[-.12,.5],[.38,.4]].forEach(([x,d])=>{hatch([[[x-.22,0],[x+.22,0],[x,d]]],0,(px,py)=>[h(px,py),50,60-py*20]);
      S(closeP([[x-.14,0],[x+.14,0],[x,-d*.45]]),[h(x,0),30,46]);});},
  crack(h){S([[-.85,-.1],[-.08,-.1]],[h(0,0),30,60],{keep:1});S([[.08,-.06],[.85,-.06]],[h(0,0),30,60],{keep:1});
    const p=[[0,-.12]];let x=0,y=-.12;for(let i=0;i<8;i++){x+=(R()-.5)*.16;y+=.07;p.push([x,y]);}S(p,[h(0,.2),60,62],{keep:1});
    [2,4,6].forEach(k=>{const [bx,by]=p[k],d=k%4?1:-1;S([[bx,by],[bx+d*.12,by+.06],[bx+d*.2,by+.04]],[h(bx,by),50,56],{keep:1});});
    hatch([[[-.85,-.1],[-.08,-.1],[-.04,.04],[-.85,.12]]],.05,[h(-.4,0),25,40]);hatch([[[.08,-.06],[.85,-.06],[.85,.16],[.04,.1]]],-.05,[h(.4,0),25,40]);},
  thorns(h){const p=[];for(let i=0;i<=60;i++){const x=-.85+1.7*i/60;p.push([x,Math.sin(i/60*TAU*2)*.06]);}S(p,[h(0,0),45,48],{keep:1});
    for(let i=2;i<58;i+=4){const [x,y]=p[i],up=i%8<4?-1:1;S([[x-.025,y],[x+.01,y+up*.11],[x+.035,y]],[h(x,y),55,60],{keep:1});}},
  dunes(h){[[-.5,.0,.55,.18],[.25,.06,.7,.22],[-.1,.18,.9,.14]].forEach(([cx,cy,w,ht],i)=>{const p=[];for(let k=0;k<=40;k++){const u=k/40,x=cx-w+2*w*u;p.push([x,cy-Math.sin(u*Math.PI)*ht]);}
    S(p,[h(cx,cy),45,mix(66,52,i/2)],{keep:1});S(p.map(([x,y])=>[x,y+.035]),[h(cx,cy),35,mix(56,44,i/2)]);});},
  roots(h){S([[-.7,-.5],[.7,-.5]],[h(0,-.5),40,58],{keep:1});
    const br=(x,y,a,L,d)=>{const ex=x+Math.cos(a)*L,ey=y+Math.sin(a)*L;S([[x,y],[ex,ey]],[h(ex,ey),40,mix(60,46,1-d/4)],{keep:d>1?1:0});
      if(d>0){br(ex,ey,a-.45-R()*.2,L*.72,d-1);br(ex,ey,a+.45+R()*.2,L*.72,d-1);}};
    [-.36,0,.36].forEach(x=>br(x,-.5,Math.PI/2+(R()-.5)*.3,.3,4));},
};
function symbolBuild(word,fam){
  const c=CARD[fam]||CARD[DECK[hash(word)%DECK.length][0]],h0=c.hue+(hash(word+'#')%30)-15;
  const hue=(x,y,k=0)=>mix(h0,h0+50,Math.max(0,Math.min(1,(y+.6)/1.2+k)));
  DRAW[c.fam](hue);
}
const sceneMeta=c=>({cat:c.layer==='heart'?'hero':c.layer,wide:WIDE_CARDS.has(c.fam),water:WATER_CARDS.has(c.fam),fam:c.fam});
/* a word drawn as a card (concept words, unknown nouns) */
function ensureSymbol(word,fam){
  const n='sym:'+word,c=CARD[fam]||CARD[DECK[hash(word)%DECK.length][0]];
  if(!SC[n]||SC[n].fam!==c.fam)SC[n]=Object.assign({zh:word+'（象征）',kw:'',build:()=>symbolBuild(word,c.fam)},sceneMeta(c));
  return n;
}
/* a card on its own (a spread with no words to label) */
function ensureCard(fam){
  const n='card:'+fam,c=CARD[fam];
  if(!SC[n])SC[n]=Object.assign({zh:c.zh,kw:'',build:()=>symbolBuild(fam,fam)},sceneMeta(c));
  return n;
}

/* ---------- reading the mood of a dream ----------
   primary: the mood the app shows (detected or chosen by the user); secondary: the next strongest mood in the words;
   energy: how violent or still the dream is, from motion words and exclamation marks. */
const ENERGY_HI=rxOf('跑|追|冲|逃|飞奔|爆炸|炸|尖叫|大喊|喊|突然|猛|撞|跳|打架|抢|拼命|着火|心跳|快点|run|running|chase|chased|escape|explode|scream|shout|sudden|suddenly|crash|jump|fight|hurry|rush');
const ENERGY_LO=rxOf('慢|静|安静|躺|睡|坐着|等|发呆|漂|飘|缓缓|慢慢|轻轻|沉默|停|雾|slow|slowly|quiet|still|lie|lying|sleep|sit|wait|float|drift|silent|fog');
function readMood(text,emo){
  const counts={};MOODS.forEach(k=>{const m=text.match(rxOf(EMO_KW[k]));counts[k]=m?m.length:0;});
  const primary=MOODS.includes(emo)?emo:'calm';
  let secondary=null,best=0;MOODS.forEach(k=>{if(k!==primary&&counts[k]>best){best=counts[k];secondary=k;}});
  const hi=(text.match(ENERGY_HI)||[]).length+(text.match(/[!！]/g)||[]).length,lo=(text.match(ENERGY_LO)||[]).length;
  const energy=.5+.5*Math.tanh((hi-lo)/2);
  return {primary,secondary,energy,counts};
}
/* ---------- drawing cards for a reading ----------
   score = fit to the main mood + half the fit to the second mood - distance in energy + a little chance (seeded by the text, so the same dream draws the same cards) */
function scoreCard(c,rd,text){
  return c.aff[rd.primary]+(rd.secondary?.45*c.aff[rd.secondary]:0)-.6*Math.abs(c.e-rd.energy)+.38*((hash(text+'|'+c.fam)%1000)/1000);
}
function pickCard(rd,text,layer,used){
  let best=null,bs=-1e9;
  for(const fam in CARD){const c=CARD[fam];if(used.has(fam)||(layer&&c.layer!==layer))continue;const s=scoreCard(c,rd,text);if(s>bs){bs=s;best=c;}}
  if(best)used.add(best.fam);return best;
}
/* a three-card spread: sky, heart, ground. A card can be given in advance (a concept word fixes the heart card). */
function drawSpread(rd,text,fixed){
  const used=new Set(Object.values(fixed||{}).filter(Boolean).map(c=>c.fam));
  return ['sky','heart','ground'].map(pos=>({pos,card:(fixed&&fixed[pos])||pickCard(rd,text,pos,used)}));
}
