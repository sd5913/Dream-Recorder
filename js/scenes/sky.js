'use strict';
/* ---------- scene library: every scene is a set of strokes the words will follow ---------- */
const SC={};
const def=(name,zh,cat,kw,build)=>{SC[name]={zh,cat,kw,build};};

def('sun','太阳','sky','太阳|日出|日落|阳光|烈日|sun|sunrise|sunset|sunshine',()=>{
  S(spiralP(0,0,.02,.32,SP),(x,y)=>{const d=Math.hypot(x,y)/.32;return[20+d*26,92,44+d*20];},{keep:1});
  for(let i=0;i<16;i++){const a=i/16*TAU+.1,r1=i%2?.68:.84;S([[Math.cos(a)*.42,Math.sin(a)*.42],[Math.cos(a)*r1,Math.sin(a)*r1]],[46,95,64]);}
});
def('moon','月亮','sky','月|moon',()=>{
  const C1=[0,0],R1=.5,C2=[.2,-.08],R2=.42,N=Math.max(3,Math.round(.3/SP));
  for(let i=0;i<N;i++){
    const t=(i+.5)/N,c=[mix(C1[0],C2[0],t),mix(C1[1],C2[1],t)],r=mix(R1,R2,t);let best=[],cur=[];
    for(let k=0;k<=240;k++){const a=k/240*TAU,p=[c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r];
      if(Math.hypot(p[0]-C1[0],p[1]-C1[1])<=R1+.002&&Math.hypot(p[0]-C2[0],p[1]-C2[1])>=R2-.002)cur.push(p);
      else{if(cur.length>best.length)best=cur;cur=[];}}
    if(cur.length>best.length)best=cur;
    if(best.length>4)S(best,(x)=>[48,58,72+Math.max(0,-x-.1)*30],{keep:1});
  }
});
def('stars','星空','sky','星|夜|night|star|midnight',()=>{
  [[-.55,-.5,.2],[.5,-.55,.15],[.08,-.12,.28],[-.62,.3,.15],[.62,.2,.2],[-.12,.6,.13],[.36,.55,.11],[-.2,-.62,.1]].forEach(([x,y,l])=>{
    S([[x-l,y],[x+l,y]],[52,80,78]);S([[x,y+l*1.5],[x,y-l*1.5]],[52,80,78]);
    S([[x-l*.6,y+l*.6],[x+l*.6,y-l*.6]],[200,50,78]);S([[x-l*.6,y-l*.6],[x+l*.6,y+l*.6]],[200,50,78]);});
});
function cloud(ox,oy,sc,col){
  const cs=[[-.38,.05,.2],[-.12,-.12,.28],[.18,-.08,.24],[.42,.06,.18]].map(c=>[ox+c[0]*sc,oy+c[1]*sc,c[2]*sc]);
  hatchDiscs(cs,oy+.22*sc,col);
}
def('cloud','云','sky','云|雾|天空|雪|cloud|sky|snow|fog|mist',()=>{cloud(0,0,1,(x,y)=>[215,22,84-y*30]);});
def('rain','雨','sky','雨|暴风|雷|rain|storm|thunder',()=>{
  cloud(0,-.45,1.05,[215,25,64]);
  for(let i=0;i<13;i++){const x=-.6+i*.1+(R()-.5)*.04,y0=-.12+R()*.1;S([[x,y0],[x-.1,y0+.34+R()*.26]],[205,70,68]);}
});
