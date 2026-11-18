'use strict';
/* ---------- save the picture as a PNG ----------
   The image is built in the browser from what is on screen: background, words, then a small caption (images, mood, the dream text, date). Nothing is uploaded. */
function wrapText(c,text,maxW,maxLines){
  const out=[];let line='';
  for(const ch of Array.from(text)){if(c.measureText(line+ch).width>maxW&&line){out.push(line);line=ch.trimStart();if(out.length===maxLines)break;}else line+=ch;}
  if(out.length<maxLines&&line)out.push(line);else if(out.length===maxLines)out[maxLines-1]=out[maxLines-1].replace(/.{0,2}$/,'…');
  return out;
}
function buildExport(){
  const top=$('#top').getBoundingClientRect().bottom-6,bot=$('#cap').getBoundingClientRect().top+2,s=DPR;
  const ph=Math.max(120,bot-top),foot=96,o=document.createElement('canvas');o.width=Math.round(W*s);o.height=Math.round((ph+foot)*s);
  const c=o.getContext('2d');c.fillStyle='#050507';c.fillRect(0,0,o.width,o.height);
  const b=$('#bg');if(b&&b.width)c.drawImage(b,0,top,W,ph,0,0,W*s,ph*s);
  c.drawImage(cv,0,top*s,W*s,ph*s,0,0,W*s,ph*s);
  c.scale(s,s);c.textAlign='center';c.textBaseline='alphabetic';
  const names=cur?cur.names.map(sceneName).join(' · '):'',u=E.ui;
  c.font=`500 14px ${FONT}`;c.fillStyle='#ebe6dc';c.fillText(names,W/2,ph+22);
  c.font=`12px ${FONT}`;c.fillStyle=`hsl(${u[0]} ${u[1]}% ${u[2]}%)`;c.fillText(emoName(emoKey),W/2,ph+41);
  c.fillStyle='#8f8b84';wrapText(c,cur?cur.text:'',W-48,2).forEach((l,i)=>c.fillText(l,W/2,ph+60+i*16));
  const d=new Date();c.textAlign='left';c.font='italic 12px Newsreader, Georgia, serif';c.fillStyle='#6f6b64';c.fillText('Dream Recorder',16,ph+foot-6);
  c.textAlign='right';c.font=`11px ${FONT}`;c.fillText(`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`,W-16,ph+foot-6);
  return o;
}
function exportPNG(){
  if(!cur){return;}
  let o;try{o=buildExport();}catch(e){toast(tx('exportFail'));return;}
  const d=new Date(),name=`dream-${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}.png`;
  o.toBlob(async blob=>{
    if(!blob){toast(tx('exportFail'));return;}
    /* phones: the share sheet is the reliable way to keep an image; desktop: a normal download */
    try{const f=new File([blob],name,{type:'image/png'});
      if(matchMedia('(pointer:coarse)').matches&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return;}
    }catch(e){if(e&&e.name==='AbortError')return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast(tx('exported'));
  },'image/png');
}
