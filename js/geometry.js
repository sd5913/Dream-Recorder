'use strict';
/* ---------- geometry helpers (scene-local units, y down) ---------- */
let SP=.07,OUT=[],R=Math.random;
const S=(pts,col,o)=>{OUT.push(Object.assign({pts,col},o));};
const arcP=(x,y,r,a0,a1,rx,ry)=>{rx=rx||r;ry=ry||r;const n=Math.max(12,Math.ceil(Math.abs(a1-a0)*Math.max(rx,ry)/.012));const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}return p;};
const ellP=(x,y,rx,ry,rot=0,n=48)=>{const p=[],c=Math.cos(rot),s=Math.sin(rot);for(let i=0;i<n;i++){const a=i/n*TAU,u=Math.cos(a)*rx,v=Math.sin(a)*ry;p.push([x+u*c-v*s,y+u*s+v*c]);}return p;};
const closeP=p=>p.concat([p[0]]);
const bez=(a,b,c,d,n=44)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n,m=1-t;p.push([m*m*m*a[0]+3*m*m*t*b[0]+3*m*t*t*c[0]+t*t*t*d[0],m*m*m*a[1]+3*m*m*t*b[1]+3*m*t*t*c[1]+t*t*t*d[1]]);}return p;};
const spiralP=(x,y,r0,r1,gap,a0=0)=>{const turns=Math.max(1,(r1-r0)/gap);const n=Math.ceil(turns*70);const p=[];for(let i=0;i<=n;i++){const u=i/n,a=a0+u*turns*TAU,r=r0+(r1-r0)*u;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}return p;};
const offs=(pts,d)=>pts.map((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[p[0]-dy/l*d,p[1]+dx/l*d];});
const mix=(a,b,t)=>a+(b-a)*t;

/* fill polygons (even-odd, so holes work) with parallel rows of text */
function hatch(polys,ang,col,o){
  o=o||{};const ca=Math.cos(-ang),sa=Math.sin(-ang),ci=Math.cos(ang),si=Math.sin(ang);
  const Rr=polys.map(p=>p.map(q=>[q[0]*ca-q[1]*sa,q[0]*sa+q[1]*ca]));
  let y0=1e9,y1=-1e9;Rr.forEach(p=>p.forEach(q=>{y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}));
  const sp=o.sp||SP,pad=o.pad==null?.008:o.pad,min=o.min||.07;
  for(let y=y0+sp*.55;y<y1;y+=sp){
    const xs=[];
    Rr.forEach(p=>{for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]));}});
    xs.sort((a,b)=>a-b);
    for(let i=0;i+1<xs.length;i+=2){const xa=xs[i]+pad,xb=xs[i+1]-pad;if(xb-xa<min)continue;
      S([[xa*ci-y*si,xa*si+y*ci],[xb*ci-y*si,xb*si+y*ci]],col,o.keep?{keep:1}:null);}
  }
}
/* union of discs, flat bottom */
function hatchDiscs(cs,ybot,col){
  let y0=1e9;cs.forEach(c=>y0=Math.min(y0,c[1]-c[2]));
  for(let y=y0+SP*.55;y<ybot;y+=SP){
    const iv=[];cs.forEach(c=>{const d=y-c[1];if(Math.abs(d)<c[2]){const h=Math.sqrt(c[2]*c[2]-d*d);iv.push([c[0]-h,c[0]+h]);}});
    iv.sort((a,b)=>a[0]-b[0]);const m=[];iv.forEach(v=>{if(m.length&&v[0]<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],v[1]);else m.push(v.slice());});
    m.forEach(v=>{if(v[1]-v[0]>.07)S([[v[0]+.008,y],[v[1]-.008,y]],col);});
  }
}
