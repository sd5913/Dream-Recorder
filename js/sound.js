'use strict';
/* ---------- soundscape (off until switched on) ---------- */
/* each mood has its own voice: wave shape, attack (s), ring (s) and the order in which a new dream is announced */
const VOICE={calm:['sine',.02,1.8,'up'],joy:['triangle',.006,1.1,'up'],fear:['square',.004,.7,'cluster'],sad:['sine',.05,2.4,'down'],strange:['triangle',.01,1.5,'shuffle'],nostalgia:['sine',.03,2.2,'arch']};
const Snd={ctx:null,on:false,master:null,nodes:[],
  init(){if(this.ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    try{this.ctx=new AC();}catch(e){return false;}
    const c=this.ctx;this.master=c.createGain();this.master.gain.value=0;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;
    const dl=c.createDelay(1);dl.delayTime.value=.34;const fb=c.createGain();fb.gain.value=.38;dl.connect(fb);fb.connect(dl);
    this.master.connect(lp);lp.connect(c.destination);lp.connect(dl);dl.connect(c.destination);return true;},
  mood(){if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime;
    this.nodes.forEach(n=>{try{n.g.gain.cancelScheduledValues(t);n.g.gain.linearRampToValueAtTime(0,t+1.2);n.o.stop(t+1.3);}catch(e){}});this.nodes=[];
    E.chord.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();
      o.type=i%2?'triangle':'sine';o.frequency.value=f<180?f*2:f;o.detune.value=(i-1.5)*5;g.gain.value=0;
      l.frequency.value=.08+i*.05;lg.gain.value=.03;l.connect(lg);lg.connect(g.gain);
      o.connect(g);g.connect(this.master);o.start();l.start();g.gain.linearRampToValueAtTime(.16,t+1.5);this.nodes.push({o,g});});},
  /* one note: pitch from the mood's scale, left/right from where it happened */
  note(f,pan,vol){const c=this.ctx,t=c.currentTime,v=VOICE[emoKey]||VOICE.calm,o=c.createOscillator(),g=c.createGain();
    o.type=v[0];o.frequency.value=f;if(emoKey==='strange')o.detune.value=(Math.random()-.5)*60;
    const peak=vol*(v[0]==='square'?.35:1);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+v[1]);g.gain.exponentialRampToValueAtTime(.0008,t+v[1]+v[2]);
    o.connect(g);
    if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=clamp(pan,-1,1);g.connect(p);p.connect(this.master);}else g.connect(this.master);
    o.start(t);o.stop(t+v[1]+v[2]+.1);},
  /* touching the words: higher on the screen = higher in the scale, left half an octave lower */
  pluck(x,y){if(!this.on||!this.ctx)return;const t=this.ctx.currentTime;
    if(t-(this._lt||0)<.16)return;this._lt=t;
    const sc=E.scale,f=sc[Math.floor(clamp(1-y,0,.999)*sc.length)]*(x>.5?1:.5);this.note(f,x*2-1,.32);},
  /* a new dream is announced in the manner of its mood */
  bloom(){if(!this.on||!this.ctx)return;let s=E.scale.slice(0,5);const how=(VOICE[emoKey]||VOICE.calm)[3];
    if(how==='down')s.reverse();else if(how==='shuffle')s.sort(()=>Math.random()-.5);else if(how==='arch')s=[s[0],s[2],s[4],s[2],s[0]];
    const gap=how==='cluster'?45:how==='down'?190:120;
    s.forEach((f,i)=>setTimeout(()=>{if(this.on)this.note(f,(i/(s.length-1))*1.2-.6,.25);},i*gap));},
  /* while typing: one quiet note per redraw, walking up the scale as the dream grows */
  tick(n){if(!this.on||!this.ctx)return;const sc=E.scale;this.note(sc[n%sc.length],0,.14);},
  toggle(){
    if(!this.on){if(!this.init()){toast(tx('noSound'));return;}this.ctx.resume&&this.ctx.resume();this.on=true;this.master.gain.linearRampToValueAtTime(1,this.ctx.currentTime+.3);this.mood();this.bloom();}
    else{this.on=false;const t=this.ctx.currentTime;this.master.gain.linearRampToValueAtTime(0,t+.5);this.nodes.forEach(n=>{try{n.o.stop(t+.6);}catch(e){}});this.nodes=[];}
    $('#btnSound').setAttribute('aria-pressed',String(this.on));$('#sndLab').textContent=this.on?tx('soundOn'):tx('sound');}
};
