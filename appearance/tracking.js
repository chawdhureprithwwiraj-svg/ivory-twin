/* One-Euro smoothing with the synchronized renderer's light 3/40 tuning. */
const NOSE_TIP=1,MATCH_DISTANCE=.2,D_CUTOFF=1;
const alpha=(cutoff,dt)=>{const tau=1/(2*Math.PI*cutoff);return 1/(1+tau/dt);};
class OneEuroLandmarks{
  constructor(minCutoff=3,beta=40){this.minCutoff=minCutoff;this.beta=beta;this.x=null;this.dx=null;this.last=0;}
  filter(input,timeMs){
    if(!this.x||this.x.length!==input.length){this.x=new Float32Array(input);this.dx=new Float32Array(input.length);this.last=timeMs;return new Float32Array(input);}
    let dt=(timeMs-this.last)/1000;if(dt<=0||dt>1)dt=1/30;this.last=timeMs;
    const ad=alpha(D_CUTOFF,dt),out=new Float32Array(input.length);
    for(let i=0;i<input.length;i++){const d=(input[i]-this.x[i])/dt;this.dx[i]+=ad*(d-this.dx[i]);
      const a=alpha(this.minCutoff+this.beta*Math.abs(this.dx[i]),dt);this.x[i]+=a*(input[i]-this.x[i]);out[i]=this.x[i];}
    return out;
  }
  distanceTo(face){if(!this.x||face.length<4)return Infinity;const i=NOSE_TIP*2;return Math.hypot(this.x[i]-face[i],this.x[i+1]-face[i+1]);}
}
export class LandmarkSmoothing{
  constructor(){this.tracks=[];}
  reset(){this.tracks=[];}
  smooth(raw,timeMs){
    const next=[],out=[];
    for(const face of raw){let best=null,bestDist=MATCH_DISTANCE;
      for(const track of this.tracks){if(next.includes(track))continue;const d=track.distanceTo(face);if(d<bestDist){best=track;bestDist=d;}}
      if(!best)best=new OneEuroLandmarks();next.push(best);out.push(best.filter(face,timeMs));}
    this.tracks=next;return out;
  }
}
export function interpolateFaces(a,b,timestamp){
  if(a===b||a.timestamp===b.timestamp)return b;
  const t=(timestamp-a.timestamp)/(b.timestamp-a.timestamp);
  if(a.faces.length!==b.faces.length)return t<.5?a:b;
  const faces=[];
  for(let f=0;f<b.faces.length;f++){const fa=a.faces[f],fb=b.faces[f];if(fa.length!==fb.length)return t<.5?a:b;
    const out=new Float32Array(fb.length);for(let i=0;i<out.length;i++)out[i]=fa[i]+(fb[i]-fa[i])*t;faces.push(out);}
  return{timestamp,faces};
}
