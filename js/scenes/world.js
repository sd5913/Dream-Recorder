'use strict';
def('sea','海','ground','海|洋|水|湖|河|游|浪|洪|sea|ocean|water|lake|river|swim|wave|flood',()=>{
  const rows=Math.max(5,Math.round(.9/SP));
  for(let i=0;i<rows;i++){const f=i/rows,y=-.4+i*SP,amp=.018+.03*f,ph=i*1.1,p=[];
    for(let x=-.85;x<=.85;x+=.03)p.push([x,y+Math.sin(x*3.6+ph)*amp]);
    S(p,i===0?[190,35,86]:[196+f*26,62,72-f*38],{keep:1});}
});
def('fish','鱼','hero','鱼|鲸|鲨|fish|whale|shark',()=>{
  const body=ellP(-.12,0,.46,.25),eye=ellP(-.4,-.05,.045,.045,0,16);
  hatch([body,eye],0,(x,y)=>[26+(y+.25)*70,88,58-(y+.25)*20]);
  hatch([[[.3,0],[.68,-.28],[.6,0],[.68,.28]]],0,[10,85,55]);
  hatch([[[-.2,-.24],[.05,-.46],[.14,-.22]]],Math.PI/3,[18,85,60]);
  [[-.64,-.26],[-.72,-.42]].forEach(([x,y])=>S(closeP(ellP(x,y,.05,.05,0,20)),[195,60,78],{keep:1}));
});
def('fly','飞翔','hero','飞|翅|翼|鸟|翔|fly|flying|bird|wing|plane|flies|flew',()=>{
  const wing=[[.05,0],[.25,-.3],[.55,-.5],[.85,-.5],[.78,-.3],[.8,-.15],[.66,-.05],[.62,.12],[.45,.12],[.38,.28],[.2,.2],[.08,.12]];
  const col=(x,y)=>[205+Math.abs(x)*20,55,62+Math.abs(x)*22];
  hatch([wing],-.38,col);hatch([wing.map(p=>[-p[0],p[1]])],.38,col);
  hatch([ellP(0,.12,.07,.27)],Math.PI/2,[28,50,52],{min:.06});
  S(closeP(ellP(0,-.17,.06,.06,0,20)),[30,60,60],{keep:1});
  hatch([[[0,.35],[-.11,.64],[.11,.64]]],Math.PI/2,[30,45,48],{min:.05});
});
def('house','房子','ground','房|家|屋|house|home|room|bedroom|dorm',()=>{
  const walls=[[-.5,-.02],[.5,-.02],[.5,.5],[-.5,.5]],win=(x,y)=>[[x,y],[x+.17,y],[x+.17,y+.17],[x,y+.17]],door=[[-.1,.2],[.1,.2],[.1,.5],[-.1,.5]];
  hatch([walls,win(-.36,.05),win(.19,.05),door],0,[35,40,70]);
  hatch([[[-.64,-.02],[0,-.54],[.64,-.02]]],0,(x,y)=>[8,60,40+(y+.5)*30]);
  hatch([door],Math.PI/2,[22,70,44],{min:.05});
  hatch([win(-.36,.05)],0,[48,92,70],{min:.05});hatch([win(.19,.05)],0,[48,92,70],{min:.05});
  const g=[];for(let x=-.85;x<=.85;x+=.05)g.push([x,.58+Math.sin(x*5)*.01]);S(g,[100,35,42]);
});
def('door','门','hero','门|走廊|电梯|door|hallway|corridor|elevator|gate',()=>{
  const n=Math.max(3,Math.floor(.34/SP));
  for(let k=0;k<n;k++){const w=.4-k*SP,f=k/Math.max(1,n-1),p=[[-w,.58],[-w,-.15]].concat(arcP(0,-.15,w,Math.PI,TAU)).concat([[w,-.15],[w,.58]]);
    S(p,[mix(24,50,f),mix(40,95,f),mix(34,72,f)],{keep:1});}
  for(let i=0;i<4;i++)S([[-.12-i*.1,.66+i*SP],[.12+i*.1,.66+i*SP]],[48,70,60-i*5]);
});
def('stairs','楼梯','ground','楼梯|梯|台阶|爬|stairs|step|climb|stair',()=>{
  const n=7,dx=.24,dy=.13,x0=-.84,pts=[[x0,.62]];
  for(let i=0;i<n;i++){const y=.5-i*dy;pts.push([x0+i*dx,y],[x0+(i+1)*dx,y]);}
  pts.push([x0+n*dx,.62]);
  hatch([pts],0,(x,y)=>[225,28,30+((Math.floor((.5-y)/dy)+100)%2)*20+(.62-y)*22]);
  S(spiralP(.6,-.62,.02,.14,SP),[48,60,80],{keep:1});
});
function tree(x,y,sc){
  const base=y+.62*sc,cc=y-.22*sc,Rr=.42*sc;
  hatch([[[x-.11*sc,base],[x-.045*sc,y+.1*sc],[x+.045*sc,y+.1*sc],[x+.11*sc,base]]],Math.PI/2,[28,50,34],{min:.05});
  S([[x,y+.2*sc],[x-.22*sc,y-.05*sc]],[28,50,40]);S([[x,y+.15*sc],[x+.25*sc,y-.02*sc]],[28,50,40]);
  const rings=Math.max(2,Math.round(Rr/SP));
  for(let k=0;k<rings;k++){const f=1-k/rings,p=[];
    for(let i=0;i<=72;i++){const a=i/72*TAU,rr=Rr*f*(1+.09*Math.sin(5*a+1)+.05*Math.sin(3*a+2));p.push([x+Math.cos(a)*rr,cc+Math.sin(a)*rr*.9]);}
    S(p,[100-k*5,56+k*3,36+k*5],{keep:1});}
}
def('tree','树','hero','树|叶|tree|leaf',()=>tree(0,0,1));
def('forest','森林','ground','森林|林|forest|wood|jungle',()=>{tree(-.56,.12,.6);tree(.56,.12,.6);tree(0,.02,.78);});
def('mountain','山','ground','山|悬崖|峰|mountain|hill|cliff|peak',()=>{
  const A=[-.8,.5],B=[-.25,-.5],C=[.35,.5],yc=-.18,t=(yc-B[1])/(A[1]-B[1]),xl=B[0]+(A[0]-B[0])*t,xr=B[0]+(C[0]-B[0])*t;
  hatch([[B,[xr,yc],[xl,yc]]],0,[208,18,88]);hatch([[[xl,yc],[xr,yc],C,A]],0,(x,y)=>[225,30,38+(.5-y)*14]);
  const B2=[.58,-.14],tt=(.12-B2[1])/(.5-B2[1]),l2=B2[0]+(.3-B2[0])*tt,r2=B2[0]+(.85-B2[0])*tt;
  hatch([[B2,[r2,.12],[l2,.12]]],0,[208,18,84]);hatch([[[l2,.12],[r2,.12],[.85,.5],[.3,.5]]],0,[215,26,56]);
});
