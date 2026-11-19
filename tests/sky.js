// Rendering-independent regressions for camera-facing geometry and real perspective.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
// Check the entry point as well as the projection math.
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scripts=Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g),m=>m[1]);
assert.ok(scripts.includes('js/sky.js'),'index.html must load js/sky.js for archive sky controls');
assert.ok(scripts.indexOf('js/archive.js')<scripts.indexOf('js/sky.js'),'load archive before sky');
assert.ok(scripts.indexOf('js/sky.js')<scripts.indexOf('js/ui.js'),'load sky before wiring archive controls');
const canvas={getContext:()=>({}),addEventListener(){}};
const c=vm.createContext({console,Map,Float32Array,Math,performance:{now:()=>0},$:()=>canvas,addEventListener(){},TAU:Math.PI*2,
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),rng:()=>{let n=1;return()=>((n=(n*1664525+1013904223)>>>0)/4294967296);}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/sky.js'),'utf8'),c);
const out=vm.runInContext(`(()=>{
 skyW=1280;skyH=720;skyFocus=[0,0,0];skyZoom=1;const rotations=[];
 for(const yaw of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(const pitch of [-1,0,1]){
  skyYaw=yaw;skyPitch=pitch;const n={centre:[.4,.3,.5]},o=skyBillboard(n,{x:0,y:0,z:0}),x=skyBillboard(n,{x:1,y:0,z:0}),y=skyBillboard(n,{x:0,y:1,z:0});
  rotations.push([x.x-o.x,x.y-o.y,y.x-o.x,y.y-o.y]);
 }
 skyYaw=skyPitch=0;const near=skyProject(0,0,-3),far=skyProject(0,0,3),base=skyProject(0,0,0);skyZoom=2;
 return {rotations,near:near.s,far:far.s,dolly:skyProject(0,0,0).s,base:base.s,clipped:skyProject(0,0,-10)};
})()`,c);
assert.ok(out.rotations.every(([dx,dy,xy,yy])=>dx>0&&yy>0&&Math.abs(dy)<1e-7&&Math.abs(xy)<1e-7&&Math.abs(dx-yy)<1e-7));
assert.equal(out.near/out.far,2);assert.equal(out.dolly/out.base,2);assert.equal(out.clipped,null);
console.log('sky OK: 12 yaw/pitch combinations remain camera-facing; true perspective; camera dolly; near-plane clipping');
