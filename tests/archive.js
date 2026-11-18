// Storage regression tests: successful, quota-limited, blocked, and malformed data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/archive.js'),'utf8');
function env(initial,write){
 const messages=[],box={URLSearchParams,location:{search:''},localStorage:{getItem:()=>initial,setItem:write},console,Date,Math,
  $:()=>({textContent:'',append(){},hidden:true}),document:{createElement:()=>({})},tx:x=>x,toast:x=>messages.push(x)};
 const c=vm.createContext(box);vm.runInContext(source,c);vm.runInContext("renderArchive=()=>{};snap=()=> 'thumbnail';",c);return {c,messages,run:s=>vm.runInContext(s,c)};
}
let stored;
let e=env('{}',(_,s)=>stored=s);assert.equal(e.run('archive.length'),0);
e=env('[null,{}, {"id":1,"text":"moon"}]',(_,s)=>stored=s);assert.equal(e.run('archive.length'),1);
assert.equal(e.run("save('cat','calm')"),true);assert.equal(JSON.parse(stored).length,2);assert.deepEqual(e.messages,['saved']);
e=env('[]',(_,s)=>{if(JSON.parse(s).some(a=>a.thumb))throw Error('quota');stored=s});
assert.equal(e.run("save('moon','calm')"),true);assert.equal(JSON.parse(stored)[0].thumb,'');assert.deepEqual(e.messages,['savedTrim']);
e=env('[{"id":1,"text":"moon"}]',()=>{throw Error('blocked')});
assert.equal(e.run("save('cat','calm')"),false);assert.equal(e.run('archive.length'),1);assert.deepEqual(e.messages,['saveFail']);
assert.equal(e.run('persist([])'),null);assert.equal(e.run('archive.length'),1);
console.log('archive OK: malformed data, successful save, quota fallback, blocked save, blocked deletion');
