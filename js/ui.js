'use strict';
/* ---------- UI wiring ---------- */
let tt=0;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2400);}
/* sample buttons and mood chips hold text, so they are rebuilt whenever the language changes */
function buildChrome(){
  const sm=$('#samples'),em=$('#emos');
  sm.querySelectorAll('.sample').forEach(e=>e.remove());em.querySelectorAll('.chip').forEach(e=>e.remove());
  tx('samplesList').forEach(([l,t])=>{const b=document.createElement('button');b.type='button';b.className='sample';b.textContent=l;b.onclick=()=>{$('#inp').value=t;autosize();userEmo=null;commit(t,'sample');};sm.append(b);});
  Object.keys(EMO).forEach(k=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=k;b.setAttribute('aria-pressed',String(k===userEmo));
    b.style.setProperty('--c',`hsl(${EMO[k].ui[0]} ${EMO[k].ui[1]}% ${EMO[k].ui[2]}%)`);b.innerHTML=`<i></i>${emoName(k)}`;
    b.onclick=()=>{userEmo=userEmo===k?null:k;applyEmotion(userEmo||(cur?detectEmotion(cur.text):'calm'));};em.append(b);});
}
const inp=$('#inp');
function autosize(){inp.style.height='auto';inp.style.height=Math.min(96,inp.scrollHeight)+'px';}
inp.addEventListener('input',autosize);
/* draw while typing: shortly after the last keystroke the picture follows the text (not while an input method is still composing) */
let liveT=0,composing=false;
function liveSoon(){clearTimeout(liveT);if(composing)return;
  liveT=setTimeout(()=>{const t=inp.value.trim();if(t.length>=2&&(!cur||t!==cur.text))commit(t,'live');},450);}
inp.addEventListener('compositionstart',()=>{composing=true;clearTimeout(liveT);});
inp.addEventListener('compositionend',()=>{composing=false;liveSoon();});
inp.addEventListener('input',liveSoon);
inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#form').requestSubmit();}});
$('#form').addEventListener('submit',e=>{e.preventDefault();const t=inp.value.trim();if(!t)return;clearTimeout(liveT);inp.value='';autosize();inp.blur();commit(t,'user');});
$('#btnArch').onclick=openArchive;$('#archClose').onclick=closeArchive;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeArchive();});
$('#btnSound').onclick=()=>Snd.toggle();
$('#btnLang').onclick=()=>setLang(LANG==='en'?'zh':'en');
$('#btnSave').onclick=()=>{if(typeof exportPNG==='function')exportPNG();};
$('#viewSky').onclick=()=>setSkyView('sky');$('#viewList').onclick=()=>setSkyView('list');

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
if(SR){$('#mic').hidden=false;$('#mic').onclick=()=>{
  if(rec){rec.stop();return;}
  try{rec=new SR();}catch(e){toast(tx('micErr'));return;}
  rec.lang=tx('micLang');rec.interimResults=true;rec.continuous=true;
  let base=inp.value;
  rec.onresult=ev=>{let s='';for(let i=0;i<ev.results.length;i++)s+=ev.results[i][0].transcript;inp.value=(base?base+' ':'')+s;autosize();liveSoon();};
  rec.onerror=()=>toast(tx('micErr2'));
  rec.onend=()=>{rec=null;$('#mic').setAttribute('aria-pressed','false');if(inp.value.trim())$('#form').requestSubmit();};
  $('#mic').setAttribute('aria-pressed','true');try{rec.start();}catch(e){rec=null;$('#mic').setAttribute('aria-pressed','false');toast(tx('micErr2'));}
};}
