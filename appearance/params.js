/* Ivory appearance: exactly three skin controls plus one whole-face slimming control. */
export const FX=[
  {k:'blemish',name:'Pimple marks & blemish smoothing',d:.90},
  {k:'whitening',name:'Skin whitening & even tone',d:.82},
  {k:'blush',name:'Rosy cheeks',d:.72}
];
export const STORAGE_KEY='ivory.appearance.v2';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));
export const rgb=h=>{if(Array.isArray(h))return h.slice(0,3);const s=String(h).replace('#','');const n=parseInt(s.length===3?s.split('').map(x=>x+x).join(''):s.slice(-6),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};
export function initialState(){const s={on:false,open:false,master:1,before:false,faceSlim:.60,fx:{},off:{}};FX.forEach(f=>{s.fx[f.k]=f.d;s.off[f.k]=false;});return s;}
export function loadState(){const s=initialState();try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!d)return s;if(typeof d.on==='boolean')s.on=d.on;if(typeof d.master==='number')s.master=clamp(d.master);if(typeof d.faceSlim==='number')s.faceSlim=clamp(d.faceSlim);FX.forEach(f=>{if(d.fx&&typeof d.fx[f.k]==='number')s.fx[f.k]=clamp(d.fx[f.k]);if(d.off&&typeof d.off[f.k]!=='undefined')s.off[f.k]=!!d.off[f.k];});}catch(e){}return s;}
export function saveState(s){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({on:!!s.on,master:clamp(s.master),faceSlim:clamp(s.faceSlim),fx:s.fx,off:s.off}));}catch(e){}}
export function retireLegacyState(){try{['ivory.appearance.v1','ivory.beauty.v3','ivory.beauty.v2','ivory.beauty.v1'].forEach(k=>localStorage.removeItem(k));}catch(e){}}
export function makeParams(s,before=false,phase=2){const master=before?0:clamp(s.master),v=k=>s.off[k]?0:clamp(s.fx[k]),m=x=>clamp(x*master),white=v('whitening'),slim=phase>=2?clamp(s.faceSlim):0;return{
  smoothing:m(v('blemish')*.98),whitening:m(white*.78),bodySkin:m(.72),
  blush:m(v('blush')*.86),blushColor:rgb('#F06C8C'),skinTint:rgb('#FFE4D6'),skinTintAmount:m(white*.16),
  faceSlim:m(slim*.72),__texture:.55,__identity:before||master<=0};}
export function hasMakeup(p){return p.blush>0;}
export function scopeReport(){return{phaseOne:FX.map(f=>f.k),phaseTwo:['faceSlim'],cancelled:['lens','iris','eye','lip','nose','cheek','jaw-bone','teeth','grade','vignette','presets']};}
