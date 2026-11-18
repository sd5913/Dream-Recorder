// Portable test entry point. Node only; no package install or browser dependency.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');let count=0;
function run(args){const r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8'});if(r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.js')){run(['--check',p]);count++;}}}
walk(path.join(root,'js'));walk(__dirname);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)){if(!/^https?:/.test(m[1])&&!fs.existsSync(path.join(root,m[1])))throw Error('Missing script: '+m[1]);}
console.log('Syntax and script references OK: '+count+' JavaScript files');
for(const name of ['classify','coverage','tarot','archive','sky','appearance']){console.log('\n--- '+name+' ---');run([path.join(__dirname,name+'.js')]);}
console.log('\nAll 6 test scripts passed. Browser interaction/playtest remains a separate check.');
