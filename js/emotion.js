'use strict';
/* ---------- emotions: colour + motion character ---------- */
const EMO={
  calm:{zh:'平静',hue:200,mix:.22,s:.8,l:0,k:11,c:4.6,sway:.012,fr:.6,trem:0,ui:[200,55,64],chord:[146.8,220,293.7,370],scale:[293.7,329.6,370,440,493.9,587.3]},
  joy:{zh:'喜悦',hue:42,mix:.2,s:1.12,l:5,k:22,c:5.2,sway:.02,fr:1.5,trem:0,ui:[42,92,62],chord:[130.8,196,261.6,329.6],scale:[261.6,293.7,329.6,392,440,523.3]},
  fear:{zh:'恐惧',hue:338,mix:.3,s:1,l:-5,k:30,c:7,sway:.006,fr:3,trem:.0042,ui:[338,70,62],chord:[55,58.3,110,116.5],scale:[220,233,311,330,466]},
  sad:{zh:'悲伤',hue:222,mix:.38,s:.62,l:-6,k:8,c:5.6,sway:.008,fr:.35,trem:0,ui:[222,50,66],chord:[110,164.8,220,261.6],scale:[220,261.6,329.6,392,440]},
  strange:{zh:'怪异',hue:150,mix:0,rainbow:1,s:1,l:0,k:16,c:3.6,sway:.03,fr:1.1,trem:.001,ui:[290,65,68],chord:[98,138.6,207.6,277.2],scale:[261.6,293.7,329.6,370,415.3,466]},
  nostalgia:{zh:'怀念',hue:30,mix:.38,s:.8,l:-2,k:9,c:4,sway:.01,fr:.5,trem:0,ui:[32,60,64],chord:[87.3,130.8,174.6,220,261.6],scale:[349.2,392,440,523.3,587.3]}
};
const EMO_KW={
  fear:'怕|恐|吓|惊|追|逃|坠|掉|噩梦|尖叫|fear|scar|afraid|nightmare|chase|falling|terror',
  joy:'开心|快乐|笑|幸福|兴奋|自由|happy|joy|fun|laugh|free',
  sad:'哭|悲|伤|难过|孤独|失去|死|去世|sad|cry|lonely|loss|grief',
  nostalgia:'想念|怀念|小时候|童年|以前|过去|老家|miss|childhood|nostalg|old home',
  strange:'奇怪|怪|诡|变成|消失|不对|weird|strange|odd|surreal|disappear',
  calm:'平静|安静|宁静|温柔|慢慢|calm|quiet|peace|gentle|slow'
};
const rxOf=s=>new RegExp(s.split('|').map(w=>/^[a-z]/i.test(w)?'\\b'+w+'(?:s|es|ing|ed)?\\b':w).join('|'),'ig');
function detectEmotion(t){
  let best='calm',n=0;
  for(const k in EMO_KW){const m=t.match(rxOf(EMO_KW[k]));if(m&&m.length>n){n=m.length;best=k;}}
  return best;
}
