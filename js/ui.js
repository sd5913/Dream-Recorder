'use strict';
/* ---------- UI wiring ---------- */
let tt=0;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2400);}
const SAMPLES=[['海里飞翔','我在海里游着，忽然像鸟一样飞了起来，风很轻'],['夜晚的门','深夜的楼梯尽头有一扇发光的门，我一直在爬，星星很近'],['旧房子与猫','小时候的老房子，院子里有一只猫，我很想念那里'],['不停坠落','我一直在坠落，什么也抓不住，很害怕']];
SAMPLES.forEach(([l,t])=>{const b=document.createElement('button');b.type='button';b.className='sample';b.textContent=l;b.onclick=()=>{$('#inp').value=t;autosize();userEmo=null;commit(t,'sample');};$('#samples').append(b);});
Object.keys(EMO).forEach(k=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=k;b.setAttribute('aria-pressed','false');
  b.style.setProperty('--c',`hsl(${EMO[k].ui[0]} ${EMO[k].ui[1]}% ${EMO[k].ui[2]}%)`);b.innerHTML=`<i></i>${EMO[k].zh}`;
  b.onclick=()=>{userEmo=userEmo===k?null:k;applyEmotion(userEmo||(cur?detectEmotion(cur.text):'calm'));};$('#emos').append(b);});
const inp=$('#inp');
function autosize(){inp.style.height='auto';inp.style.height=Math.min(96,inp.scrollHeight)+'px';}
inp.addEventListener('input',autosize);
inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#form').requestSubmit();}});
$('#form').addEventListener('submit',e=>{e.preventDefault();const t=inp.value.trim();if(!t)return;inp.value='';autosize();inp.blur();commit(t,'user');});
$('#btnArch').onclick=openArchive;$('#archClose').onclick=closeArchive;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeArchive();});
$('#btnSound').onclick=()=>Snd.toggle();

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
if(SR){$('#mic').hidden=false;$('#mic').onclick=()=>{
  if(rec){rec.stop();return;}
  try{rec=new SR();}catch(e){toast('无法使用语音输入，请直接输入文字');return;}
  rec.lang=navigator.language&&/^zh|^en/.test(navigator.language)?navigator.language:'zh-CN';rec.interimResults=true;rec.continuous=true;
  let base=inp.value;
  rec.onresult=ev=>{let s='';for(let i=0;i<ev.results.length;i++)s+=ev.results[i][0].transcript;inp.value=(base?base+' ':'')+s;autosize();};
  rec.onerror=()=>toast('无法使用麦克风，请直接输入文字');
  rec.onend=()=>{rec=null;$('#mic').setAttribute('aria-pressed','false');if(inp.value.trim())$('#form').requestSubmit();};
  $('#mic').setAttribute('aria-pressed','true');try{rec.start();}catch(e){rec=null;$('#mic').setAttribute('aria-pressed','false');toast('无法使用麦克风，请直接输入文字');}
};}
