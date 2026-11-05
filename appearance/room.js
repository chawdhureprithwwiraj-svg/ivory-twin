/* Ivory Appearance · video-room adapter only.
 * Raw camera acquisition/publication remains with the live/call room.
 * This controller owns only its hidden source video, worker and canvas track.
 */
import {FX,loadState,saveState,retireLegacyState,makeParams} from './params.js';

const STYLE_ID='iv-appearance-room-style';
const CSS=`
.iva-sheet{position:absolute;isolation:isolate;z-index:90;left:50%;bottom:82px;transform:translateX(-50%);width:min(430px,calc(100% - 24px));max-height:min(62vh,520px);overflow:auto;box-sizing:border-box;padding:18px 18px 16px;border:1px solid rgba(177,129,54,.32);border-radius:24px;background:rgba(255,252,246,.98);color:#4c2632;box-shadow:0 18px 58px rgba(63,28,38,.25);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.iva-sheet[hidden]{display:none}.iva-sheet.iva-high-dock{bottom:168px;max-height:min(58vh,500px)}.iva-head{display:flex;align-items:center;gap:12px}.iva-head>div{flex:1;min-width:0}.iva-title{display:block;font:800 18px/1.2 Georgia,serif;color:#572838}.iva-status{display:block;margin-top:4px;font:600 11px/1.35 system-ui,sans-serif;color:#956b68}.iva-close{position:static;float:none;flex:0 0 36px;width:36px;height:36px;margin:0;padding:0;appearance:none;-webkit-appearance:none;border:1px solid rgba(145,94,65,.2);border-radius:50%;background:#fff8ed;color:#6a3944;font:400 24px/1 system-ui;cursor:pointer}.iva-master{width:100%;margin:16px 0 13px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(177,129,54,.25);border-radius:16px;background:linear-gradient(135deg,#fff8e8,#f9ead3);color:#5d303c;font:800 14px/1.2 system-ui;cursor:pointer}.iva-switch{position:relative;width:44px;height:25px;border-radius:20px;background:#d9ccc2;transition:background .18s}.iva-switch:after{content:'';position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;background:white;box-shadow:0 2px 6px #6a39442b;transition:transform .18s}.iva-master[aria-pressed=true] .iva-switch{background:#b5863f}.iva-master[aria-pressed=true] .iva-switch:after{transform:translateX(19px)}.iva-row{display:block;padding:10px 2px 8px}.iva-label{display:flex;align-items:center;justify-content:space-between;gap:12px;font:700 12px/1.3 system-ui;color:#633844}.iva-value{font-variant-numeric:tabular-nums;color:#a16d43;font-size:11px}.iva-range{display:block;width:100%;height:24px;margin:7px 0 0;accent-color:#b5863f;cursor:pointer}.iva-note{margin:9px 2px 0;font:500 10px/1.45 system-ui;color:#9a7670}.lv-key.iva-on,.ivr-key.iva-on{background:linear-gradient(180deg,#fff3d2,#dfae55);color:#3f2405;border-color:transparent}.iva-sheet button:focus-visible,.iva-sheet input:focus-visible{outline:3px solid rgba(181,134,63,.35);outline-offset:2px}@media(max-height:620px){.iva-sheet{bottom:72px;max-height:66vh;padding:13px 16px}.iva-row{padding:6px 2px}.iva-master{margin:10px 0 7px}}
`;
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const style=document.createElement('style');style.id=STYLE_ID;style.textContent=CSS;document.head.appendChild(style);}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
function toast(message,bad){try{if(window.ivoryToast)window.ivoryToast(message,bad);}catch(e){}}
function asPromise(value){return Promise.resolve(value);}

export class AppearanceRoomController{
  constructor(options){
    this.options=options;this.hooks=options.hooks;this.phase=options.phase===1?1:2;this.surface=options.surface||'video';
    retireLegacyState();this.state=loadState();this.state.open=false;this.engine=null;this.video=null;this.raw=null;this.rawMST=null;
    this.published=null;this.custom=null;this.mode='';this.active=false;this.destroyed=false;this.generation=0;this.queue=Promise.resolve();this.button=null;this.gateTimer=null;
    ensureStyle();this.buildSheet();this.bindButton(options.button||null);
  }
  buildSheet(){
    const sheet=el('section','iva-sheet');if(this.surface==='video-call'&&this.hooks.root.querySelector('#ivr-moretime'))sheet.classList.add('iva-high-dock');sheet.hidden=true;sheet.setAttribute('role','dialog');sheet.setAttribute('aria-label','Appearance controls');sheet.dataset.phase=String(this.phase);
    const head=el('div','iva-head'),titles=el('div');titles.appendChild(el('b','iva-title','Appearance'));this.status=el('s','iva-status','Raw camera');titles.appendChild(this.status);head.appendChild(titles);
    const close=el('button','iva-close','×');close.type='button';close.setAttribute('aria-label','Close appearance controls');close.addEventListener('click',()=>this.close());head.appendChild(close);sheet.appendChild(head);
    this.master=el('button','iva-master');this.master.type='button';this.master.setAttribute('aria-pressed','false');this.master.appendChild(el('span','','Beauty'));
    this.master.appendChild(el('span','iva-switch'));this.master.setAttribute('aria-label','Turn Beauty on or off');this.master.addEventListener('click',()=>{this.setOn(!this.state.on).catch(()=>{});});sheet.appendChild(this.master);
    this.rows={};FX.forEach(f=>sheet.appendChild(this.makeRange(f.k,f.name)));
    if(this.phase===2)sheet.appendChild(this.makeRange('faceSlim','Face slimming'));
    sheet.appendChild(el('p','iva-note','Applied only to this video room. Your camera returns to normal when Beauty is off.'));
    this.sheet=sheet;this.hooks.root.appendChild(sheet);this.paint();
  }
  makeRange(key,name){
    const row=el('label','iva-row'),label=el('span','iva-label'),value=el('span','iva-value');label.appendChild(el('span','',name));label.appendChild(value);row.appendChild(label);
    const input=el('input','iva-range');input.type='range';input.min='0';input.max='100';input.step='1';input.dataset.fx=key;input.setAttribute('aria-label',name);
    input.addEventListener('input',()=>{const n=Math.max(0,Math.min(1,Number(input.value)/100));if(key==='faceSlim')this.state.faceSlim=n;else this.state.fx[key]=n;saveState(this.state);value.textContent=Math.round(n*100)+'%';this.applyParams();});
    row.appendChild(input);this.rows[key]={input,value};return row;
  }
  bindButton(button){
    this.button=button||null;if(!button)return;button.classList.toggle('iva-on',!!this.state.on);button.setAttribute('aria-pressed',String(!!this.state.on));button.setAttribute('aria-label','Appearance controls');
  }
  paint(){
    const on=!!this.state.on;this.master.setAttribute('aria-pressed',String(on));this.master.setAttribute('aria-label',on?'Turn Beauty off':'Turn Beauty on');
    Object.keys(this.rows).forEach(key=>{const n=key==='faceSlim'?this.state.faceSlim:this.state.fx[key];this.rows[key].input.value=String(Math.round(n*100));this.rows[key].value.textContent=Math.round(n*100)+'%';});
    this.status.textContent=this.active?'On · strong skin finish':(on?(this.hooks.cameraEnabled()?'Preparing a steady picture…':'On · waiting for the camera'):'Raw camera');this.bindButton(this.button);
  }
  open(){if(this.destroyed)return;if(!this.hooks.getRawTrack()){toast('Your camera is still opening.',true);return;}this.state.open=true;this.sheet.hidden=false;this.paint();}
  close(){this.state.open=false;if(this.sheet)this.sheet.hidden=true;}
  attach(){this.bindButton(this.options.button||this.button);this.watchGate();return this.state.on?this.requestSync():Promise.resolve();}
  watchGate(){
    if(this.gateTimer)return;
    const check=()=>{
      if(this.destroyed)return;let allowed=true;try{allowed=this.hooks.isActive?!!this.hooks.isActive():true;}catch(e){allowed=false;}
      if(this.button)this.button.hidden=!allowed;if(allowed)return;
      this.close();if(!(this.active||this.engine||this.state.on))return;
      this.state.on=false;saveState(this.state);this.generation++;
      this.enqueue(()=>this.cleanup(true)).then(()=>this.paint()).catch(()=>{});
    };
    check();this.gateTimer=setInterval(check,200);
  }
  requestSync(){const gen=++this.generation;return this.enqueue(()=>this.sync(gen));}
  setOn(on){
    if(this.destroyed)return Promise.resolve();on=!!on;if(on&&(!this.hooks.getRawTrack()||!this.hooks.cameraEnabled())){toast('Turn your camera on first.',true);return Promise.resolve();}
    this.state.on=on;saveState(this.state);this.paint();return this.requestSync();
  }
  enqueue(work){const next=this.queue.then(work,work);this.queue=next.catch(()=>{});return next;}
  async sync(gen){
    if(this.destroyed||gen!==this.generation)return;if(!this.state.on){await this.cleanup(true);this.paint();return;}if(this.active)return;
    if(!this.hooks.isActive()||!this.hooks.getRawTrack()){this.state.on=false;saveState(this.state);this.paint();return;}
    if(!this.hooks.cameraEnabled()){await this.cleanup(true);this.paint();return;}
    await this.cleanup(true);if(gen!==this.generation||this.destroyed)return;
    try{await this.start(gen);}catch(error){if(gen!==this.generation||this.destroyed)return;try{await this.cleanup(true);}catch(e){}
      this.state.on=false;saveState(this.state);this.paint();toast('Beauty stayed off so your camera can continue normally.',true);throw error;}
  }
  async start(gen){
    const raw=this.hooks.getRawTrack();if(!raw||!raw.getMediaStreamTrack)throw new Error('The raw camera is not ready');const rawMST=raw.getMediaStreamTrack();
    if(!rawMST||rawMST.readyState!=='live')throw new Error('The raw camera is not live');this.raw=raw;this.rawMST=rawMST;
    const {AppearanceEngine}=await import('./engine.js');if(gen!==this.generation||this.destroyed)return;
    const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.autoplay=true;video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');
    video.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-4px;top:-4px;z-index:-1;clip-path:inset(50%);-webkit-clip-path:inset(50%)';video.tabIndex=-1;this.hooks.root.appendChild(video);this.video=video;
    video.srcObject=new MediaStream([rawMST]);
    /* WebKit can reject a newly attached MediaStream with a transient
       AbortError even while the camera track remains live. Retry only that
       interruption, inside this generation; every persistent/other failure
       still follows the safe raw-camera recovery below. */
    let played=false,playError=null;
    for(let attempt=0;attempt<3&&!played;attempt++){
      try{await video.play();played=true;playError=null;}catch(error){
        playError=error;if(gen!==this.generation||this.destroyed)return;
        if(!error||error.name!=='AbortError'||attempt===2)throw error;
        await new Promise(resolve=>setTimeout(resolve,80*(attempt+1)));
      }
    }
    if(!played)throw playError||new Error('The camera preview did not open');
    if(gen!==this.generation||this.destroyed)return;
    const engine=new AppearanceEngine(video,{params:makeParams(this.state,false,this.phase),onFatal:error=>this.onFatal(error),onQuality:()=>{if(this.active)this.status.textContent='On · adjusted for a steady picture';}});this.engine=engine;await engine.start();
    if(gen!==this.generation||this.destroyed||this.raw!==this.hooks.getRawTrack()){await engine.stop();return;}
    await this.publish(engine.track);if(gen!==this.generation||this.destroyed)return;this.active=true;this.paint();
  }
  async publish(track){
    const raw=this.raw,rawMST=this.rawMST,client=this.hooks.getClient();let replaced=false;
    if(raw&&typeof raw.replaceTrack==='function'){
      try{await raw.replaceTrack(track,false);replaced=!raw.getMediaStreamTrack||raw.getMediaStreamTrack()===track;
        if(!replaced)await raw.replaceTrack(rawMST,false).catch(()=>{});
      }catch(e){try{await raw.replaceTrack(rawMST,false);}catch(ignore){}}
    }
    if(replaced){this.mode='replace';this.published=raw;this.hooks.onPublished(raw);this.hooks.show(raw);return;}
    if(!window.AgoraRTC||typeof AgoraRTC.createCustomVideoTrack!=='function'||!client)throw new Error('This room cannot publish the processed camera');
    const custom=await asPromise(AgoraRTC.createCustomVideoTrack({mediaStreamTrack:track}));this.custom=custom;
    try{await client.unpublish(raw);await client.publish(custom);}catch(error){try{if(client.localTracks&&client.localTracks.indexOf(custom)>=0)await client.unpublish(custom);await client.publish(raw);}catch(ignore){}try{custom.close();}catch(ignore){}this.custom=null;throw error;}
    this.mode='custom';this.published=custom;this.hooks.onPublished(custom);this.hooks.show(custom);
  }
  applyParams(){if(this.engine)this.engine.setParams(makeParams(this.state,false,this.phase));}
  onFatal(error){if(this.destroyed||!this.state.on)return;this.state.on=false;this.active=false;saveState(this.state);this.generation++;this.paint();const restored=this.enqueue(()=>this.cleanup(true));restored.then(()=>this.paint(),()=>this.paint());restored.catch(()=>{toast('The camera needs you to step out and rejoin.',true);});toast('Beauty was turned off to keep your camera smooth.',true);return restored;}
  async restart(mutator){
    if(this.destroyed)return asPromise(mutator());const gen=++this.generation;return this.enqueue(async()=>{await this.cleanup(true);if(gen!==this.generation||this.destroyed)return;const result=await mutator();if(gen!==this.generation||this.destroyed||!this.state.on)return result;try{await this.sync(gen);}catch(e){}this.paint();return result;});
  }
  async setEnabled(enabled){
    if(this.destroyed)return;const gen=++this.generation;return this.enqueue(async()=>{
      if(this.rawMST)try{this.rawMST.enabled=!!enabled;}catch(e){}const jobs=[];if(this.raw&&this.raw.setEnabled)jobs.push(asPromise(this.raw.setEnabled(enabled)));
      if(this.published&&this.published!==this.raw&&this.published.setEnabled)jobs.push(asPromise(this.published.setEnabled(enabled)));await Promise.all(jobs);
      if(!enabled){await this.cleanup(true);this.paint();}else if(this.state.on&&!this.active)await this.sync(gen);
    });
  }
  async cleanup(restore){
    const engine=this.engine,raw=this.raw,published=this.published,custom=this.custom,mode=this.mode,rawMST=this.rawMST,video=this.video;
    let restored=!restore||!mode||!published,restoreError=null;
    for(let attempt=0;attempt<2&&!restored;attempt++){
      try{
        if(mode==='replace'){
          if(!raw||!rawMST||typeof raw.replaceTrack!=='function')throw new Error('The raw camera is no longer available');
          await raw.replaceTrack(rawMST,false);
          if(raw.getMediaStreamTrack&&raw.getMediaStreamTrack()!==rawMST)throw new Error('The room did not accept the raw camera');
        }else{
          const client=this.hooks.getClient();if(!client||!raw)throw new Error('The video room is no longer available');
          await client.unpublish(published);await client.publish(raw);
        }
        this.hooks.onPublished(raw);this.hooks.show(raw);restored=true;restoreError=null;
      }catch(error){restoreError=error;}
    }
    if(!restored){
      /* Do not cut the only living video track. Neutralise the effect, retain
         the references, and let the next room operation retry the restore. */
      this.active=false;if(engine)try{engine.setParams(makeParams(this.state,true,this.phase));}catch(e){}
      if(this.status)this.status.textContent='Camera needs rejoin';
      throw restoreError||new Error('The raw camera could not be restored');
    }
    this.engine=null;this.video=null;this.active=false;this.published=null;this.custom=null;this.mode='';
    if(video){try{video.pause();}catch(e){}try{video.srcObject=null;}catch(e){}video.remove();}
    if(engine)try{await engine.stop();}catch(e){}if(custom)try{custom.close();}catch(e){}this.raw=null;this.rawMST=null;
  }
  destroy(restore=true){
    if(this.destroyed)return this.queue;this.destroyed=true;this.generation++;if(this.gateTimer){clearInterval(this.gateTimer);this.gateTimer=null;}this.close();const result=this.enqueue(()=>this.cleanup(!!restore).catch(()=>this.cleanup(false)));
    return result.then(()=>{if(this.sheet)this.sheet.remove();this.sheet=null;this.button=null;});
  }
  diagnostics(){return{surface:this.surface,phase:this.phase,active:this.active,mode:this.mode,on:this.state.on,open:this.state.open,
    controls:this.phase===2?['blemish','whitening','blush','faceSlim']:['blemish','whitening','blush'],raw:this.rawMST?this.rawMST.readyState:'none',
    processed:this.engine&&this.engine.track?this.engine.track.readyState:'none',engine:this.engine?this.engine.diagnostics():null};}
}

export function createAppearanceController(options){return new AppearanceRoomController(options);}
