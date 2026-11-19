// Storage regression tests: successful, quota-limited, blocked, and malformed data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/archive.js'),'utf8');
function env(initial,write,legacy='[]'){
 const messages=[],box={URLSearchParams,location:{search:''},localStorage:{getItem:k=>k==='dream-recorder-demo-v1'?legacy:initial,setItem:write},console,Date,Math,
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
// The normal archive includes the six original examples plus both existing stores.
const examplesCode=fs.readFileSync(require('node:path').join(__dirname,'../js/demo.js'),'utf8');
function installExamples(e){const start=examplesCode.indexOf('archiveExamples=EXAMPLE_DREAMS');e.run(examplesCode.slice(0,start));e.run('exampleShape=()=>[[0,0,"hsl(200 30% 70%)"]]');e.run(examplesCode.slice(start));}
let writes=0;e=env('[]',()=>writes++);installExamples(e);
assert.equal(e.run('archiveEntries().length'),6);assert.equal(e.run('archive.length'),0);assert.equal(writes,0);
const sampleRecords=JSON.parse(e.run('JSON.stringify(archiveExamples)')).map((a,i)=>({id:'old:'+i,text:a.text,emo:a.emo,ts:10+i,shape:a.shape}));
const personal=[{id:'real:1',text:'my existing dream one',emo:'calm'},{id:'real:2',text:'my existing dream two',emo:'sad'}];
e=env(JSON.stringify(personal),()=>writes++,JSON.stringify(sampleRecords));installExamples(e);
assert.equal(e.run('archiveEntries().length'),8);assert.equal(e.run('archive.length'),2);assert.equal(e.run('legacyArchive.length'),6);assert.equal(writes,0);
assert.equal(e.run('archiveEntries().filter(a=>a._preset).length'),0);
e.run("save('a future dream','calm')");assert.equal(e.run('archiveEntries().length'),9);assert.equal(e.run('archive.length'),3);assert.equal(e.run('legacyArchive.length'),6);
assert.ok(e.run("archive.some(a=>a.id==='real:1')&&archive.some(a=>a.id==='real:2')"));
console.log('unified archive OK: six examples on normal route; old real and legacy records retained; no duplicate examples; no startup writes; future saves share the same archive');
