'use strict';
/* ---------- soundscape (off until switched on) ---------- */
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
  pluck(x,y){if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime;
    if(t-(this._lt||0)<.16)return;this._lt=t;
    const sc=E.scale,f=sc[Math.floor(clamp(1-y,0,.999)*sc.length)]*(x>.5?1:.5),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+1.4);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+1.5);},
  bloom(){if(!this.on||!this.ctx)return;E.scale.slice(0,5).forEach((f,i)=>setTimeout(()=>this.pluck2(f),i*120));},
  pluck2(f){const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.02);g.gain.exponentialRampToValueAtTime(.0008,t+1.8);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+1.9);},
  toggle(){
    if(!this.on){if(!this.init()){toast('此设备不支持声音');return;}this.ctx.resume&&this.ctx.resume();this.on=true;this.master.gain.linearRampToValueAtTime(1,this.ctx.currentTime+.3);this.mood();this.bloom();}
    else{this.on=false;const t=this.ctx.currentTime;this.master.gain.linearRampToValueAtTime(0,t+.5);this.nodes.forEach(n=>{try{n.o.stop(t+.6);}catch(e){}});this.nodes=[];}
    $('#btnSound').setAttribute('aria-pressed',String(this.on));$('#sndLab').textContent=this.on?'声音 开':'声音';}
};
