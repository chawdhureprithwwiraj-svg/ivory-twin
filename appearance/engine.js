/* Lazy, bounded, synchronized video appearance engine.
 * The engine never acquires, publishes or stops the source camera track.
 */
import {AppearanceRenderer,Fbo} from './renderer.js';
import {LandmarkSmoothing,interpolateFaces} from './tracking.js';
const TIERS={
  LOW:{detectionSize:320,processDownscale:4,warpCellPx:16,maxShortSide:540},
  MEDIUM:{detectionSize:416,processDownscale:3,warpCellPx:12,maxShortSide:720},
  HIGH:{detectionSize:512,processDownscale:2,warpCellPx:8,maxShortSide:1080}
};
const EMPTY={timestamp:0,faces:[]};
export function preferredDetector(ua){ua=String(ua||'');if(/iPhone|iPad|iPod/i.test(ua))return'tfjs';
  return /AppleWebKit/i.test(ua)&&/Safari/i.test(ua)&&!/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS|Android/i.test(ua)?'tfjs':'mediapipe';}
export function chooseTier(){
  const n=navigator,memory=Number(n.deviceMemory)||0,cores=Number(n.hardwareConcurrency)||4,
    mobile=/Android|iPhone|iPad|iPod/i.test(n.userAgent)||((n.maxTouchPoints||0)>1&&/Macintosh/.test(n.userAgent));
  if(cores<=4||(memory>0&&memory<=4)||(mobile&&(!memory||memory<6)))return'LOW';
  return'MEDIUM';
}
async function imageBitmap(url){
  const response=await fetch(url);if(!response.ok)throw new Error('Appearance asset '+response.status);
  const blob=await response.blob();return createImageBitmap(blob,{premultiplyAlpha:'none',colorSpaceConversion:'default'});
}
export class AppearanceEngine{
  constructor(video,options={}){
    if(!video)throw new Error('A playing source video is required');this.video=video;this.options=options;
    this.tier=options.tier||chooseTier();this.config=Object.assign({},TIERS[this.tier]);this.params=options.params||{__identity:true};
    this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.canvas.style.display='none';
    this.baseParams=this.params;this.before=false;this.startedAt=0;
    this.renderer=null;this.worker=null;this.track=null;this.stream=null;this.input=null;this.slots=[];this.results=[];
    this.smoother=new LandmarkSmoothing();this.running=false;this.starting=false;this.closed=false;this.workerReady=false;
    this.detectionBusy=false;this.detector=options.detector==='tfjs'||options.detector==='mediapipe'?options.detector:preferredDetector(navigator.userAgent);this.workerBackend='';this.imageDataFallback=!!options.imageDataDetection||this.detector==='tfjs';this.detectionSize=this.config.detectionSize;this.targetFps=options.fps||30;
    this.maxDelay=options.maxDelay||180;this.adaptive=options.adaptive!==false;this.sequence=0;this.head=0;this.count=0;
    this.nextOutput=0;this.lastSubmit=0;this.vfcId=0;this.rafId=0;this.detectCanvas=null;this.detectCtx=null;this.sourceEpoch=0;
    this.stats={rendered:0,dropped:0,detections:0,errors:0,fps:0,detectionMs:0,renderMs:0,qualityChanges:0};
    this.windowStart=0;this.windowFrames=0;this.windowRenderMs=0;this.lowWindows=0;this.fatalSent=false;this.stopPromise=null;
    this.onMessage=e=>this.onWorkerMessage(e.data||{});this.onWorkerError=e=>this.workerFailure(e.message||'Worker error');
  }
  async start(){
    if(this.running)return this.track;if(this.starting)throw new Error('Appearance engine is already starting');
    if(this.stopPromise)throw new Error('An appearance engine is single-use; create a new instance');
    this.starting=true;this.closed=false;const session=++this.sequence;
    try{
      await this.waitForVideo();if(session!==this.sequence||this.closed)throw new DOMException('Stopped','AbortError');
      this.setDimensions();
      const modelUrl=new URL('./models/face_landmarker.task',import.meta.url).href;
      const workerPromise=this.startWorker(modelUrl),assetsPromise=imageBitmap(new URL('./assets/makeup.png',import.meta.url));
      const [_,makeupImage]=await Promise.all([workerPromise,assetsPromise]);if(session!==this.sequence||this.closed)throw new DOMException('Stopped','AbortError');
      this.makeupImage=makeupImage;
      this.renderer=new AppearanceRenderer(this.canvas,{makeupImage:this.makeupImage,
        processDownscale:this.config.processDownscale,warpCellPx:this.config.warpCellPx,tier:this.tier});
      this.input=this.renderer.createInput();
      const n=Math.max(3,Math.ceil(this.maxDelay/33)+2);for(let i=0;i<n;i++)this.slots.push({fbo:new Fbo(this.renderer.gl),timestamp:0,arrival:0,fed:false});
      this.createTrack();this.running=true;this.workerReady=true;this.windowStart=this.startedAt=performance.now();
      // A complete graded frame exists before the caller replaces its raw publication.
      this.renderer.upload(this.input,this.video);this.renderer.render(this.input,this.width,this.height,null,EMPTY,this.params);this.requestFrame();
      this.submit(performance.now(),true);this.scheduleSource();this.scheduleRender();this.starting=false;return this.track;
    }catch(error){this.starting=false;await this.stop();throw error;}
  }
  async waitForVideo(){if(this.video.videoWidth>0&&this.video.readyState>=2)return;
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('Camera metadata timed out'));},10000);
      const ready=()=>{if(this.video.videoWidth>0){cleanup();resolve();}};const cleanup=()=>{clearTimeout(timer);
        this.video.removeEventListener('loadedmetadata',ready);this.video.removeEventListener('canplay',ready);};
      this.video.addEventListener('loadedmetadata',ready);this.video.addEventListener('canplay',ready);});}
  setDimensions(){const vw=this.video.videoWidth,vh=this.video.videoHeight;if(!vw||!vh)throw new Error('Camera has no dimensions');
    const scale=Math.min(1,this.config.maxShortSide/Math.min(vw,vh)),even=v=>Math.max(2,Math.round(v/2)*2);
    this.sourceWidth=vw;this.sourceHeight=vh;this.width=even(vw*scale);this.height=even(vh*scale);
    if(this.canvas.width!==this.width)this.canvas.width=this.width;if(this.canvas.height!==this.height)this.canvas.height=this.height;}
  createTrack(){if(!this.canvas.captureStream)throw new Error('Canvas video capture is unsupported');
    const manual=typeof CanvasCaptureMediaStreamTrack!=='undefined'&&CanvasCaptureMediaStreamTrack.prototype.requestFrame;
    this.manual=!!manual;this.stream=this.canvas.captureStream(manual?0:this.targetFps);this.track=this.stream.getVideoTracks()[0];
    if(!this.track)throw new Error('Processed video track was not created');this.track.contentHint='detail';}
  requestFrame(){if(this.manual&&this.track&&this.track.readyState==='live')try{this.track.requestFrame();}catch(e){}}
  startWorker(modelUrl){return new Promise((resolve,reject)=>{
    let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Face model initialization timed out'));}},30000);
    const workerFile=this.detector==='tfjs'?'./worker-tfjs.js':'./worker.js';this.worker=new Worker(new URL(workerFile,import.meta.url),{name:'ivory-appearance-'+this.detector});
    this.worker.onmessage=e=>{const m=e.data||{};if(m.type==='ready'&&!settled){this.workerBackend=m.backend||(this.detector==='tfjs'?'wasm':'mediapipe');settled=true;clearTimeout(timer);resolve();}
      else if(m.type==='error'&&m.phase==='init'&&!settled){settled=true;clearTimeout(timer);reject(new Error(m.message||'Face model failed'));}
      this.onMessage(e);};this.worker.onerror=e=>{const detail=(e.message||'Worker error')+(e.filename?' @ '+e.filename+':'+e.lineno+':'+e.colno:'');
      if(this.workerInitReject)this.workerInitReject(new Error(detail));this.onWorkerError(e);};this.worker.postMessage({type:'init',modelUrl,canvasMode:this.options.workerCanvasMode||''});
    this.workerInitReject=error=>{if(!settled){settled=true;clearTimeout(timer);reject(error);}};
  });}
  onWorkerMessage(m){
    if(m.type==='result'){
      this.detectionBusy=false;if(typeof m.epoch==='number'&&m.epoch!==this.sourceEpoch)return;
      const raw=m.landmarks&&m.landmarks.length?[m.landmarks]:[],faces=this.smoother.smooth(raw,m.timestamp);
      this.results.push({timestamp:m.timestamp,faces,detectionMs:m.detectionMs||0});if(this.results.length>16)this.results.shift();
      this.stats.detections++;this.stats.detectionMs=this.stats.detectionMs*.85+(m.detectionMs||0)*.15;
      this.feedNewestIfIdle();this.drain(false);return;
    }
    if(m.type==='error'){this.detectionBusy=false;this.stats.errors++;
      if(m.phase==='detect'&&this.running&&!this.imageDataFallback&&/GLctx|WebGL|ImageBitmap|activeTexture/i.test(m.message||'')){
        this.imageDataFallback=true;if(this.count)this.slots[(this.head+this.count-1)%this.slots.length].fed=false;
        this.qualityChanged('ImageData detector transport');this.feedNewestIfIdle();return;}
      if(m.phase!=='init'&&this.running)this.workerFailure((m.phase||'detect')+': '+(m.message||'Detection failed')+(m.stack?' | '+m.stack:''));}
  }
  workerFailure(message){this.stats.errors++;if(!this.running)return;this.fatal(new Error(String(message||'Appearance tracking failed')));}
  fatal(error){if(this.fatalSent||this.closed)return;this.fatalSent=true;let restored;
    try{if(this.options.onFatal)restored=this.options.onFatal(error);}catch(e){}
    /* The room adapter restores/publishes the raw track before stopping the
       processed source. Standalone engines retain the immediate-stop path. */
    if(restored&&typeof restored.then==='function')restored.then(()=>this.stop(),()=>{});else this.stop();}
  scheduleSource(){if(!this.running)return;
    if(this.video.requestVideoFrameCallback){const cb=now=>{if(!this.running)return;this.submit(now);this.vfcId=this.video.requestVideoFrameCallback(cb);};
      this.vfcId=this.video.requestVideoFrameCallback(cb);} }
  scheduleRender(){if(!this.running)return;const frame=now=>{if(!this.running)return;
    if(!this.video.requestVideoFrameCallback&&now-this.lastSubmit>=1000/this.targetFps)this.submit(now);
    this.drain(false);this.adapt(now);this.rafId=requestAnimationFrame(frame);};this.rafId=requestAnimationFrame(frame);}
  submit(now,force=false){
    if(!this.running||!this.renderer||this.video.readyState<2)return;const interval=1000/this.targetFps;
    if(!force&&now-this.lastSubmit<interval*.85)return;this.lastSubmit=now;
    if(this.video.videoWidth!==this.sourceWidth||this.video.videoHeight!==this.sourceHeight){
      this.sourceEpoch++;this.head=this.count=0;this.results=[];this.smoother.reset();this.nextOutput=0;this.setDimensions();}
    if(this.width!==this.canvas.width||this.height!==this.canvas.height)return;
    if(this.count===this.slots.length&&!this.drainOne(true))this.dropOldest();
    const slot=this.slots[(this.head+this.count)%this.slots.length];
    try{this.renderer.upload(this.input,this.video);slot.fbo.ensure(this.width,this.height);this.renderer.copyFrame(this.input,slot.fbo);}
    catch(error){this.fatal(error);return;}
    slot.timestamp=now;slot.arrival=performance.now();slot.fed=false;this.count++;this.feedNewestIfIdle();}
  feedNewestIfIdle(){if(!this.running||!this.workerReady||this.detectionBusy||this.count===0)return;
    const slot=this.slots[(this.head+this.count-1)%this.slots.length];if(slot.fed)return;slot.fed=true;this.detectionBusy=true;
    const timestamp=slot.timestamp,id=++this.sequence,epoch=this.sourceEpoch;let promise;
    if(this.imageDataFallback){try{const packet=this.imageDataFromCanvas();
      this.worker.postMessage({type:'detect',id,timestamp,epoch,pixels:packet.pixels,width:packet.width,height:packet.height},[packet.pixels]);
    }catch(e){this.detectionBusy=false;}return;}
    try{const vw=this.video.videoWidth,vh=this.video.videoHeight,scale=Math.min(1,this.detectionSize/Math.max(vw,vh)),
      w=Math.max(2,Math.round(vw*scale)),h=Math.max(2,Math.round(vh*scale));
      promise=createImageBitmap(this.video,{resizeWidth:w,resizeHeight:h,resizeQuality:'low'}).catch(()=>this.bitmapFromCanvas());
    }catch(e){promise=this.bitmapFromCanvas();}
    promise.then(bitmap=>{if(!this.running||!this.worker){if(bitmap.close)bitmap.close();return;}
      this.worker.postMessage({type:'detect',id,timestamp,epoch,bitmap},[bitmap]);}).catch(()=>{this.detectionBusy=false;});
  }
  drawDetection(){const vw=this.video.videoWidth,vh=this.video.videoHeight,scale=Math.min(1,this.detectionSize/Math.max(vw,vh)),
    w=Math.max(2,Math.round(vw*scale)),h=Math.max(2,Math.round(vh*scale));
    if(!this.detectCanvas){this.detectCanvas=document.createElement('canvas');this.detectCtx=this.detectCanvas.getContext('2d',{alpha:false});}
    if(this.detectCanvas.width!==w)this.detectCanvas.width=w;if(this.detectCanvas.height!==h)this.detectCanvas.height=h;
    this.detectCtx.drawImage(this.video,0,0,w,h);return{width:w,height:h};}
  bitmapFromCanvas(){this.drawDetection();return createImageBitmap(this.detectCanvas);}
  imageDataFromCanvas(){const size=this.drawDetection(),image=this.detectCtx.getImageData(0,0,size.width,size.height);
    return{pixels:image.data.buffer,width:size.width,height:size.height};}
  drain(force){if(this.running)this.drainOne(force);}
  drainOne(force){
    const now=performance.now();if(now<this.nextOutput||this.count===0||!this.renderer)return false;
    const slot=this.slots[this.head],ts=slot.timestamp;let before=null,after=null;
    for(const r of this.results){if(r.timestamp<=ts)before=r;if(r.timestamp>=ts&&after===null)after=r;}
    const waited=now-slot.arrival>this.maxDelay;if(after===null&&!force&&!waited&&this.workerReady)return false;
    const frame=after===null?(before||EMPTY):interpolateFaces(before||after,after,ts),start=performance.now();
    try{this.renderer.render(slot.fbo.texture,this.width,this.height,null,frame,this.params);this.requestFrame();}
    catch(error){this.fatal(error);return false;}
    const elapsed=performance.now()-start;this.stats.renderMs=this.stats.renderMs*.9+elapsed*.1;this.stats.rendered++;
    this.windowFrames++;this.windowRenderMs+=elapsed;this.nextOutput=performance.now()+1000/this.targetFps;
    this.head=(this.head+1)%this.slots.length;this.count--;this.pruneResults(this.count?this.slots[this.head].timestamp:ts);return true;
  }
  dropOldest(){if(!this.count)return;this.head=(this.head+1)%this.slots.length;this.count--;this.stats.dropped++;
    this.pruneResults(this.count?this.slots[this.head].timestamp:0);}
  pruneResults(oldest){let keep=0;for(let i=0;i<this.results.length;i++)if(this.results[i].timestamp<=oldest)keep=i;
    if(keep>0)this.results.splice(0,keep);}
  adapt(now){if(!this.adaptive||document.hidden){this.windowStart=now;this.windowFrames=0;this.windowRenderMs=0;return;}
    const elapsed=now-this.windowStart;if(elapsed<2000)return;const fps=this.windowFrames*1000/elapsed,render=this.windowFrames?this.windowRenderMs/this.windowFrames:0;
    this.stats.fps=fps;this.windowStart=now;this.windowFrames=0;this.windowRenderMs=0;if(now-this.startedAt<6000)return;
    if(fps<24||render>1000/this.targetFps)this.lowWindows++;else this.lowWindows=0;if(this.lowWindows<2)return;
    if(this.targetFps>24){this.targetFps=24;this.stats.qualityChanges++;this.lowWindows=0;this.qualityChanged('24 fps');return;}
    if(this.config.processDownscale<4||this.detectionSize>320){this.config.processDownscale=4;this.config.warpCellPx=16;this.detectionSize=320;
      if(this.renderer){this.renderer.config.processDownscale=4;this.renderer.config.warpCellPx=16;}
      this.stats.qualityChanges++;this.lowWindows=0;this.qualityChanged('low processing load');return;}
    /* A slow device is a quality constraint, not a processing failure. Keep
       the camera and Beauty alive at a bounded rate instead of crashing out. */
    if(this.targetFps>20){this.targetFps=20;this.stats.qualityChanges++;this.lowWindows=0;this.qualityChanged('20 fps');return;}
    if(this.targetFps>15){this.targetFps=15;this.stats.qualityChanges++;this.lowWindows=0;this.qualityChanged('15 fps');return;}
    this.lowWindows=0;
  }
  qualityChanged(label){try{if(this.options.onQuality)this.options.onQuality(label,this.diagnostics());}catch(e){}}
  setParams(params){this.baseParams=params||{__identity:true};
    this.params=this.before?Object.assign({},this.baseParams,{__identity:true}):this.baseParams;}
  setBefore(before){this.before=!!before;this.setParams(this.baseParams);}
  diagnostics(){return{running:this.running,tier:this.tier,detector:this.detector,workerBackend:this.workerBackend,width:this.width,height:this.height,targetFps:this.targetFps,
    fps:this.stats.fps,detectionMs:this.stats.detectionMs,renderMs:this.stats.renderMs,queued:this.count,slots:this.slots.length,
    rendered:this.stats.rendered,dropped:this.stats.dropped,detections:this.stats.detections,errors:this.stats.errors,
    detectionSize:this.detectionSize,processDownscale:this.config.processDownscale,qualityChanges:this.stats.qualityChanges,
    workerReady:this.workerReady,track:this.track?this.track.readyState:'none'};}
  async stop(){if(this.stopPromise)return this.stopPromise;this.stopPromise=(async()=>{
    this.closed=true;this.running=false;this.starting=false;this.sequence++;
    if(this.vfcId&&this.video.cancelVideoFrameCallback)try{this.video.cancelVideoFrameCallback(this.vfcId);}catch(e){}this.vfcId=0;
    if(this.rafId)cancelAnimationFrame(this.rafId);this.rafId=0;
    const worker=this.worker;this.worker=null;this.workerReady=false;this.detectionBusy=false;
    if(this.workerInitReject)this.workerInitReject(new DOMException('Stopped','AbortError'));this.workerInitReject=null;
    if(worker){await new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);worker.terminate();resolve();};
      const timer=setTimeout(finish,250);worker.onmessage=e=>{if(e.data&&e.data.type==='closed')finish();};worker.onerror=finish;
      try{worker.postMessage({type:'close'});}catch(e){finish();}});}
    if(this.renderer){for(const slot of this.slots)slot.fbo.release();this.renderer.deleteTexture(this.input);this.renderer.release();}
    this.slots=[];this.results=[];this.smoother.reset();this.input=null;this.renderer=null;
    if(this.track)try{this.track.stop();}catch(e){}this.track=null;if(this.stream){this.stream.getTracks().forEach(t=>t.stop());this.stream=null;}
    if(this.makeupImage&&this.makeupImage.close)this.makeupImage.close();
    this.makeupImage=null;if(this.detectCanvas){this.detectCanvas.width=this.detectCanvas.height=1;this.detectCanvas=null;this.detectCtx=null;}
    this.head=this.count=0;this.nextOutput=0;this.lastSubmit=0;this.canvas.width=this.canvas.height=1;
  })();return this.stopPromise;}
}
export async function createAppearance(video,options={}){const engine=new AppearanceEngine(video,options);await engine.start();return engine;}
