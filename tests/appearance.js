// Shared colour/motion invariants for every mood, including reduced-motion mode.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const reduced of [false,true]){
 const c=vm.createContext({Math,console,reduce:reduced,U:220,TAU:Math.PI*2,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/emotion.js'),'utf8'),c);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/particles.js'),'utf8'),c);
 const result=vm.runInContext(`(()=>{
  const results=[];
  for(const k of Object.keys(EMO)){
   E=EMO[k];
   for(const hue of [0,60,120,180,240,300]){
    const base={base:[hue,95,65],jh:0,jl:0,ph:1.3,si:0,ux:.2,uy:.1,cat:'hero'};
    const centre={...base,light:1},edge={...base,light:.2};tint(centre);tint(edge);
    const parse=p=>p.css.match(/[-.\\d]+/g).map(Number),cc=parse(centre),ec=parse(edge);
    const a=wordDrift(centre,0),b=wordDrift(centre,2),other=wordDrift({...centre,ph:3.1},2);
    results.push({k,s:cc[1],centre:centre.opacity,edge:edge.opacity,l:cc[2],edgeL:ec[2],
     moved:Math.hypot(b.x-a.x,b.y-a.y),independent:Math.hypot(b.x-other.x,b.y-other.y),
     bounded:Math.abs(b.x)<6&&Math.abs(b.y)<6&&Math.abs(b.a)<.04});
   }
  }
  cur={tone:{h:null,s:0,l:20},names:['elephant']};const white={base:[30,80,55],jh:0,jl:0,si:0,cat:'hero',light:.8};tint(white);
  return {results,whiteS:+white.css.split(' ')[1].replace('%','')};
 })()`,c);
 assert.ok(result.results.every(r=>r.s<=64&&r.centre>r.edge+.2&&r.l>r.edgeL&&r.moved>.01&&r.independent>.01&&r.bounded));
 assert.equal(result.whiteS,0);
 console.log('appearance OK: all 6 moods, 6 source hues, centre-to-edge fade, independent bounded drift, white cue; reduced motion = '+reduced);
}
