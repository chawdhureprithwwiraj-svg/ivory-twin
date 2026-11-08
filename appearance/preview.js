/* Ivory-only pre-Live Beauty preview. This module owns its camera stream and
   never creates an Agora client, requests a token, joins a room or publishes.
   Phase-one skin controls mirror the frozen native preview: no face-shape,
   lens or eye-colour effect is applied here. The video-room phase-two engine
   and its released controls are not changed. */
import {AppearanceEngine} from './engine.js';
import {FX,loadState,saveState,retireLegacyState,makeParams} from './params.js';

const STYLE_ID='iv-live-beauty-preview-style';
const CSS=`
.c105-beauty-preview{position:fixed;inset:0;z-index:10020;overflow:hidden;background:#5C1222;color:#FFFDD0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.c105-beauty-preview video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#5C1222}
.c105-beauty-preview video[hidden]{display:block;opacity:0;pointer-events:none}
.c105-bp-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(74,14,23,.60),rgba(74,14,23,0) 25%,rgba(38,11,24,0) 52%,rgba(38,11,24,.87))}
.c105-bp-top{position:absolute;z-index:2;top:0;left:0;right:0;display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 12px 8px 8px}
.c105-bp-top>b{flex:1;font-size:11px;letter-spacing:1px;font-weight:900}
.c105-bp-icon{display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:rgba(74,14,23,.25);color:#FFFDD0;cursor:pointer}
.c105-bp-icon:disabled{opacity:.4}.c105-bp-icon svg,.c105-bp-label svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.c105-bp-bottom{position:absolute;z-index:3;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-height:82vh;overflow:auto;box-sizing:border-box;padding:14px;border:1px solid rgba(212,175,55,.55);border-radius:20px;background:rgba(74,14,23,.94);box-shadow:0 18px 50px rgba(38,11,24,.35)}
.c105-bp-label{display:flex;align-items:center;gap:7px;color:#D4AF37;font-size:10px;font-weight:900;letter-spacing:1px}.c105-bp-label svg{width:18px;height:18px}
.c105-bp-status{margin:8px 0 6px;color:rgba(255,253,208,.95);font-size:12px;line-height:1.4}
.c105-bp-explain{margin:0 0 10px;color:rgba(255,253,208,.72);font-size:10.5px;line-height:1.4}
.c105-bp-adjust,.c105-bp-resume{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;min-height:44px;padding:11px 14px;border:1.2px solid #E3A857;border-radius:12px;background:#D4AF37;color:#4A0E17;font-size:12px;font-weight:900;letter-spacing:.5px;cursor:pointer}
.c105-bp-adjust:disabled{background:#FDF1DC;color:rgba(74,14,23,.45)}.c105-bp-resume{margin-top:7px;background:transparent;color:#FFFDD0}
.c105-bp-resume[hidden]{display:none}.c105-bp-scope{margin:7px 0 0;color:#FFFDD0;font-size:10.5px}
.c105-bp-panel{margin:0 0 12px;padding:12px;border:1px solid rgba(212,175,55,.35);border-radius:15px;background:rgba(255,252,242,.97);color:#4A0E17}.c105-bp-panel[hidden]{display:none}
.c105-bp-master{display:flex;align-items:center;justify-content:space-between;width:100%;padding:8px 0;border:0;background:transparent;color:#4A0E17;font-size:14px;font-weight:800;cursor:pointer}
.c105-bp-switch{position:relative;width:46px;height:28px;border-radius:22px;background:#E9D8CF}.c105-bp-switch:after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#FFFDD0;transition:transform .18s}.c105-bp-master[aria-checked=true] .c105-bp-switch{background:#4A0E17}.c105-bp-master[aria-checked=true] .c105-bp-switch:after{transform:translateX(18px)}
.c105-bp-row{display:block;padding:8px 0}.c105-bp-row>span{display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:700}.c105-bp-row output{color:#9A6B35;font-variant-numeric:tabular-nums}.c105-bp-row input{display:block;width:100%;margin-top:7px;accent-color:#D4AF37}
.c105-bp-panelnote{margin:7px 0 0;color:rgba(74,14,23,.60);font-size:10.5px;line-height:1.4}
body.on-beauty-preview{overflow:hidden!important}
`;
const BACK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
const SWITCH='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h11l-2-2m2 2-2 2M20 16H9l2-2m-2 2 2 2"/><path d="M17 4h3v4M7 20H4v-4"/></svg>';
const FACE='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8.5 15c2 1.5 5 1.5 7 0M9 3l1-2M15 3l-1-2"/></svg>';
const TUNE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"/></svg>';
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=CSS;document.head.appendChild(s);}
function play(video){let last=null;return (async()=>{for(let i=0;i<3;i++){try{await video.play();return;}catch(e){last=e;if(!e||e.name!=='AbortError'||i===2)break;await new Promise(r=>setTimeout(r,80*(i+1)));}}throw last||new Error('The camera preview did not open');})();}

export class LocalLiveBeautyPreview{
  constructor(){
    retireLegacyState();this.state=loadState();this.state.on=!!this.state.on;this.generation=0;this.effectGeneration=0;this.stream=null;this.engine=null;this.facing='user';this.starting=false;this.closing=false;this.pausedByVisibility=false;this.ready=false;
    ensureStyle();this.build();
  }
  build(){
    const root=document.createElement('section');root.className='c105-beauty-preview';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Private pre-Live Beauty preview');root.tabIndex=-1;
    root.innerHTML='<video data-raw muted playsinline autoplay></video><video data-output muted playsinline autoplay hidden></video><div class="c105-bp-shade"></div>'+
      '<header class="c105-bp-top"><button type="button" class="c105-bp-icon" data-close aria-label="Close private preview">'+BACK+'</button><b>PRIVATE PRE-LIVE PREVIEW</b><button type="button" class="c105-bp-icon" data-switch aria-label="Switch camera" disabled>'+SWITCH+'</button></header>'+
      '<div class="c105-bp-bottom"><section class="c105-bp-panel" data-panel hidden></section><div class="c105-bp-label">'+FACE+'<span>IVORY ONLY · CAMERA STAYS LOCAL</span></div>'+
      '<p class="c105-bp-status" data-status aria-live="polite">Preparing a private camera preview...</p>'+
      '<p class="c105-bp-explain">No room joined, no token requested, no broadcast started. These are the same skin controls used in your host broadcast.</p>'+
      '<button type="button" class="c105-bp-adjust" data-adjust aria-controls="c105-bp-adjustments" aria-expanded="false">'+TUNE+'<span>ADJUST BEAUTY</span></button><button type="button" class="c105-bp-resume" data-resume hidden>TRY THE CAMERA AGAIN</button>'+
      '<p class="c105-bp-scope">No face-shape or eye-colour effects are included.</p></div>';
    this.root=root;this.raw=root.querySelector('[data-raw]');this.output=root.querySelector('[data-output]');this.status=root.querySelector('[data-status]');this.switchButton=root.querySelector('[data-switch]');this.adjust=root.querySelector('[data-adjust]');this.resume=root.querySelector('[data-resume]');this.panel=root.querySelector('[data-panel]');this.panel.id='c105-bp-adjustments';
    [this.raw,this.output].forEach(v=>{v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('playsinline','');});
    root.querySelector('[data-close]').addEventListener('click',()=>this.close());this.switchButton.addEventListener('click',()=>this.switchCamera());this.adjust.setAttribute('aria-controls',this.panel.id);this.adjust.setAttribute('aria-expanded','false');this.adjust.addEventListener('click',()=>{this.panel.hidden=!this.panel.hidden;this.adjust.setAttribute('aria-expanded',String(!this.panel.hidden));});this.resume.addEventListener('click',()=>this.start());
    this.onKey=e=>{if(e.key==='Escape'){e.preventDefault();this.close();}};this.onVisibility=()=>this.visibility();this.buildPanel();
  }
  buildPanel(){
    this.panel.innerHTML='';this.master=document.createElement('button');this.master.type='button';this.master.className='c105-bp-master';this.master.setAttribute('role','switch');this.master.innerHTML='<span>Beauty</span><span class="c105-bp-switch"></span>';this.master.addEventListener('click',()=>this.setOn(!this.state.on));this.panel.appendChild(this.master);this.rows={};
    FX.forEach(f=>{const row=document.createElement('label');row.className='c105-bp-row';const head=document.createElement('span');const name=document.createElement('span');name.textContent=f.name;const value=document.createElement('output');head.appendChild(name);head.appendChild(value);const input=document.createElement('input');input.type='range';input.min='0';input.max='100';input.step='1';input.setAttribute('aria-label',f.name);input.addEventListener('input',()=>{this.state.fx[f.k]=Math.max(0,Math.min(1,Number(input.value)/100));value.textContent=Math.round(this.state.fx[f.k]*100)+'%';saveState(this.state);this.applyParams();});row.appendChild(head);row.appendChild(input);this.panel.appendChild(row);this.rows[f.k]={input,value};});
    const note=document.createElement('p');note.className='c105-bp-panelnote';note.textContent='Local skin preview only. Your camera returns to normal when Beauty is off or this preview closes.';this.panel.appendChild(note);this.paintPanel();
  }
  paintPanel(){this.master.setAttribute('aria-checked',String(!!this.state.on));Object.keys(this.rows).forEach(k=>{const n=Math.round(this.state.fx[k]*100);this.rows[k].input.value=String(n);this.rows[k].value.textContent=n+'%';});}
  setStatus(text,error=false){if(this.closing)return;this.status.textContent=text;this.resume.hidden=!error;this.ready=!error&&!!this.stream;this.switchButton.disabled=!this.ready||this.starting;}
  async open(){if(this.root.isConnected)return this;document.body.appendChild(this.root);document.body.classList.add('on-beauty-preview');document.addEventListener('keydown',this.onKey);document.addEventListener('visibilitychange',this.onVisibility);this.root.focus();this.start();return this;}
  async acquire(facing){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('Camera preview is not supported in this browser.');
    const constraints={audio:false,video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720}}};
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  async start(facing=this.facing){
    if(this.starting||this.closing||!this.root.isConnected)return;this.starting=true;const gen=++this.generation;this.setStatus('Preparing a private camera preview...');
    await this.stopEngine();this.stopStream();
    try{
      const stream=await this.acquire(facing);if(gen!==this.generation||this.closing){stream.getTracks().forEach(t=>t.stop());return;}
      this.stream=stream;this.facing=facing;this.raw.srcObject=stream;await play(this.raw);if(gen!==this.generation||this.closing)return;
      this.setStatus('Your private preview is ready. You are not live.');if(this.state.on)await this.startEngine();
    }catch(e){if(gen!==this.generation||this.closing)return;this.stopStream();this.setStatus('The private camera preview could not start. Check camera access.',true);}
    finally{if(gen===this.generation)this.starting=false;if(!this.closing)this.switchButton.disabled=!this.stream;}
  }
  async startEngine(){
    if(this.engine||!this.state.on||!this.stream||this.closing)return;const gen=++this.effectGeneration;let engine=null;
    try{
      engine=new AppearanceEngine(this.raw,{params:makeParams(this.state,false,1),onFatal:()=>this.onFatal(engine)});await engine.start();
      if(gen!==this.effectGeneration||this.closing||!this.state.on){await engine.stop();return;}
      this.engine=engine;this.output.srcObject=new MediaStream([engine.track]);await play(this.output);this.output.hidden=false;this.setStatus('Your private Beauty preview is ready. You are not live.');
    }catch(e){if(engine)try{await engine.stop();}catch(ignore){}if(gen!==this.effectGeneration||this.closing)return;this.engine=null;this.state.on=false;saveState(this.state);this.paintPanel();this.showRaw();this.setStatus('Beauty stayed off. Your raw private preview is still here.',false);}
  }
  async stopEngine(){++this.effectGeneration;const engine=this.engine;this.engine=null;this.showRaw();if(engine)try{await engine.stop();}catch(e){}}
  showRaw(){if(this.output){try{this.output.pause();}catch(e){}this.output.srcObject=null;this.output.hidden=true;}}
  onFatal(engine){if(this.closing)return Promise.resolve();if(this.engine===engine)this.engine=null;this.state.on=false;saveState(this.state);this.paintPanel();this.showRaw();this.setStatus('Beauty was turned off. Your raw private preview is still here.');return Promise.resolve();}
  applyParams(){if(this.engine)this.engine.setParams(makeParams(this.state,false,1));}
  async setOn(on){this.state.on=!!on;saveState(this.state);this.paintPanel();if(on){if(!this.stream){this.setStatus('Allow camera access to preview your look.',true);return;}await this.startEngine();}else{await this.stopEngine();this.setStatus('Your private preview is ready. You are not live.');}}
  stopStream(){const stream=this.stream;this.stream=null;if(this.raw){try{this.raw.pause();}catch(e){}this.raw.srcObject=null;}if(stream)stream.getTracks().forEach(t=>{try{t.stop();}catch(e){}});}
  async switchCamera(){if(this.starting||!this.stream||this.closing)return;const next=this.facing==='user'?'environment':'user';this.switchButton.disabled=true;await this.start(next);}
  visibility(){if(this.closing)return;if(document.hidden){if(this.stream){this.pausedByVisibility=true;++this.generation;this.starting=false;this.stopEngine();this.stopStream();}}else if(this.pausedByVisibility){this.pausedByVisibility=false;this.start();}}
  diagnostics(){return{localOnly:true,joined:false,published:false,facing:this.facing,raw:this.stream?this.stream.getTracks().map(t=>t.readyState):[],processed:this.engine&&this.engine.track?this.engine.track.readyState:'none',phase:1,engine:this.engine?this.engine.diagnostics():null};}
  async close(){if(this.closing)return;this.closing=true;++this.generation;++this.effectGeneration;document.removeEventListener('keydown',this.onKey);document.removeEventListener('visibilitychange',this.onVisibility);await this.stopEngine();this.stopStream();this.root.remove();document.body.classList.remove('on-beauty-preview');if(window.IVBEAUTYPREVIEW105===this)window.IVBEAUTYPREVIEW105=null;}
}
export async function openLiveBeautyPreview(){
  if(!(window.ivIsAdmin&&window.ivIsAdmin()))throw new Error('This private camera preview is for Ivory only.');
  if(window.IVBEAUTYPREVIEW105&&window.IVBEAUTYPREVIEW105.root.isConnected)return window.IVBEAUTYPREVIEW105;
  const preview=new LocalLiveBeautyPreview();window.IVBEAUTYPREVIEW105=preview;return preview.open();
}
