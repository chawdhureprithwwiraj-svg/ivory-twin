/*
 * FaceBeauty GPU renderer, ported from BeautyRenderer.java (Apache-2.0).
 * WebGL2 host integration and resource ownership are new; effect geometry and
 * shading remain the licensed upstream algorithms. One face is used by Ivory.
 */
import {S, INPUT_HEADER} from './shaders.js';
import {TRIANGLES, UV, VERTEX_COUNT} from './mesh.js';
import {R} from './regions.js';
import {hasMakeup} from './params.js';

const IDENTITY = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));
const px=(lm,i,w)=>lm[2*i]*w, py=(lm,i,h)=>(1-lm[2*i+1])*h;
const dist=(lm,a,b,w,h)=>Math.hypot(px(lm,a,w)-px(lm,b,w),py(lm,a,h)-py(lm,b,h));
const area=(ax,ay,bx,by,cx,cy)=>(bx-ax)*(cy-ay)-(cx-ax)*(by-ay);

class Program {
  constructor(gl,vs,fs){
    this.gl=gl;this.cache=new Map();this.p=gl.createProgram();
    const v=this.shader(gl.VERTEX_SHADER,vs),f=this.shader(gl.FRAGMENT_SHADER,fs);
    gl.attachShader(this.p,v);gl.attachShader(this.p,f);
    gl.bindAttribLocation(this.p,0,'aPos');gl.bindAttribLocation(this.p,1,'aVal');gl.bindAttribLocation(this.p,1,'aUv');
    gl.linkProgram(this.p);gl.deleteShader(v);gl.deleteShader(f);
    if(!gl.getProgramParameter(this.p,gl.LINK_STATUS)){const log=gl.getProgramInfoLog(this.p);gl.deleteProgram(this.p);throw new Error('Appearance shader link: '+log);}
  }
  shader(type,src){const g=this.gl,s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);
    if(!g.getShaderParameter(s,g.COMPILE_STATUS)){const log=g.getShaderInfoLog(s);g.deleteShader(s);throw new Error('Appearance shader compile: '+log+'\n'+src);}return s;}
  use(){this.gl.useProgram(this.p);return this;}
  loc(n){if(!this.cache.has(n))this.cache.set(n,this.gl.getUniformLocation(this.p,n));return this.cache.get(n);}
  f(n,v){this.gl.uniform1f(this.loc(n),v);} i(n,v){this.gl.uniform1i(this.loc(n),v);}
  v2(n,x,y){this.gl.uniform2f(this.loc(n),x,y);} v4(n,a,b,c,d){this.gl.uniform4f(this.loc(n),a,b,c,d);}
  v4v(n,a){this.gl.uniform4fv(this.loc(n),a);} mat(n,a){this.gl.uniformMatrix4fv(this.loc(n),false,a);}
  release(){if(this.p){this.gl.deleteProgram(this.p);this.p=null;this.cache.clear();}}
}
export class Fbo {
  constructor(gl){this.gl=gl;this.fbo=null;this.texture=null;this.width=0;this.height=0;}
  ensure(w,h){w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));if(w===this.width&&h===this.height&&this.fbo)return;
    const g=this.gl;if(!this.texture)this.texture=makeTexture(g);if(!this.fbo)this.fbo=g.createFramebuffer();
    this.width=w;this.height=h;g.bindTexture(g.TEXTURE_2D,this.texture);
    g.texImage2D(g.TEXTURE_2D,0,g.RGBA,w,h,0,g.RGBA,g.UNSIGNED_BYTE,null);
    g.bindFramebuffer(g.FRAMEBUFFER,this.fbo);g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,this.texture,0);
    if(g.checkFramebufferStatus(g.FRAMEBUFFER)!==g.FRAMEBUFFER_COMPLETE)throw new Error('Appearance framebuffer is incomplete');
    g.bindFramebuffer(g.FRAMEBUFFER,null);}
  bind(){const g=this.gl;g.bindFramebuffer(g.FRAMEBUFFER,this.fbo);g.viewport(0,0,this.width,this.height);}
  release(){const g=this.gl;if(this.fbo)g.deleteFramebuffer(this.fbo);if(this.texture)g.deleteTexture(this.texture);
    this.fbo=this.texture=null;this.width=this.height=0;}
}
function makeTexture(g){const t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);return t;}

export class AppearanceRenderer {
  constructor(canvas,options={}){
    this.canvas=canvas;this.options=options;this.config={processDownscale:options.processDownscale||3,
      warpCellPx:options.warpCellPx||12,tier:options.tier||'MEDIUM'};
    const attrs={alpha:false,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,
      preserveDrawingBuffer:!!options.preserveDrawingBuffer,powerPreference:'high-performance',desynchronized:true};
    const g=canvas.getContext('webgl2',attrs);if(!g)throw new Error('WebGL2 is required for appearance processing');this.gl=g;
    this.ready=false;this.programs=[];this.params={};this.presence=0;this.lastTime=0;this.faces=[];
    this.opA=new Float32Array(8*4);this.opB=new Float32Array(8*4);this.bodyA=new Float32Array(8);this.bodyB=new Float32Array(8);
    this.maskVerts=new Float32Array(4096);this.pts=new Float32Array(80);
    this.cmdStart=new Int32Array(32);this.cmdCount=new Int32Array(32);this.cmdMode=new Int32Array(32);this.cmdColor=new Float32Array(32*4);
    this.tmp=new Fbo(g);this.mean=new Fbo(g);this.dev=new Fbo(g);this.mask=new Fbo(g);this.makeup=new Fbo(g);
    this.makeupImage=options.makeupImage||null;
    this.makeupTex=null;
    this.gridInW=this.gridInH=0;this.gridIndexCount=0;this.meshVerts=new Float32Array(VERTEX_COUNT*4);
    this.init();
  }
  program(vs,fs){const p=new Program(this.gl,vs,fs);this.programs.push(p);return p;}
  init(){const g=this.gl;
    this.copyProg=this.program(S.QUAD_VS,INPUT_HEADER+S.COPY_FS);
    this.blurInProg=this.program(S.QUAD_VS,INPUT_HEADER+S.BLUR_INPUT_FS);
    this.devProg=this.program(S.QUAD_VS,INPUT_HEADER+S.DEV_FS);
    this.compProg=this.program(S.COMPOSITE_VS,INPUT_HEADER+S.COMPOSITE_FS);
    this.blurProg=this.program(S.QUAD_VS,S.FRAG_PRECISION+S.BLUR_FS);
    this.maskProg=this.program(S.MASK_VS,S.MASK_FS);this.makeupProg=this.program(S.MAKEUP_VS,S.MAKEUP_FS);
    this.presentProg=this.program(S.PRESENT_VS,S.PRESENT_FS);
    this.quadVbo=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,this.quadVbo);
    g.bufferData(g.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]),g.STATIC_DRAW);
    this.maskVbo=g.createBuffer();this.meshVbo=g.createBuffer();this.meshIbo=g.createBuffer();
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,this.meshIbo);g.bufferData(g.ELEMENT_ARRAY_BUFFER,TRIANGLES,g.STATIC_DRAW);
    this.gridVbo=g.createBuffer();this.gridIbo=g.createBuffer();
    g.disable(g.DEPTH_TEST);g.disable(g.CULL_FACE);g.disable(g.BLEND);this.ready=true;
  }
  createInput(){return makeTexture(this.gl);}
  upload(tex,source){const g=this.gl;g.bindTexture(g.TEXTURE_2D,tex);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
    g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,source);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);}
  deleteTexture(t){if(t)this.gl.deleteTexture(t);}
  bindTex(unit,tex){const g=this.gl;g.activeTexture(g.TEXTURE0+unit);g.bindTexture(g.TEXTURE_2D,tex||null);}
  drawQuad(){const g=this.gl;g.bindBuffer(g.ARRAY_BUFFER,this.quadVbo);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);
    g.enableVertexAttribArray(0);g.drawArrays(g.TRIANGLE_STRIP,0,4);}
  copyFrame(input,dst){const g=this.gl;g.disable(g.BLEND);dst.bind();const p=this.copyProg.use();
    p.mat('uTexMatrix',IDENTITY);p.f('uFlipY',1);this.bindTex(0,input);p.i('uInput',0);this.drawQuad();}
  ensureBuffers(w,h){const d=this.config.processDownscale,lw=Math.max(16,Math.round(w/d)),lh=Math.max(16,Math.round(h/d));
    this.tmp.ensure(lw,lh);this.mean.ensure(lw,lh);this.dev.ensure(lw,lh);const md=Math.min(d,2);
    this.mask.ensure(Math.max(16,Math.round(w/md)),Math.max(16,Math.round(h/md)));
    // Valid neutral targets keep all declared samplers complete even when unused.
    if(!this.makeup.texture)this.makeup.ensure(16,16);
    if(w!==this.gridInW||h!==this.gridInH||this.config.warpCellPx!==this.gridWarpCell)this.buildGrid(w,h);}
  buildGrid(w,h){const g=this.gl,cols=Math.max(16,Math.min(160,Math.round(w/this.config.warpCellPx))),
    rows=Math.max(16,Math.min(160,Math.round(h/this.config.warpCellPx))),verts=new Float32Array((cols+1)*(rows+1)*2),
    idx=new Uint16Array(cols*rows*6);let k=0;
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){verts[k++]=x/cols;verts[k++]=y/rows;}k=0;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;
      idx[k++]=a;idx[k++]=a+1;idx[k++]=b;idx[k++]=b;idx[k++]=a+1;idx[k++]=b+1;}
    g.bindBuffer(g.ARRAY_BUFFER,this.gridVbo);g.bufferData(g.ARRAY_BUFFER,verts,g.STATIC_DRAW);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,this.gridIbo);g.bufferData(g.ELEMENT_ARRAY_BUFFER,idx,g.STATIC_DRAW);
    this.gridIndexCount=idx.length;this.gridInW=w;this.gridInH=h;this.gridWarpCell=this.config.warpCellPx;}
  setPlacement(p,w,h,t){const ia=w/h,oa=t.width/t.height;let sx=1,sy=1;
    if((ia>oa)===(t.scaleType!=='fit'))sx=ia/oa;else sy=oa/ia;if(t.mirror)sx=-sx;if(t.flipY)sy=-sy;p.v4('uPosXform',sx,sy,0,0);}
  present(input,w,h,t){const g=this.gl;g.disable(g.BLEND);g.bindFramebuffer(g.FRAMEBUFFER,t.framebuffer||null);g.viewport(0,0,t.width,t.height);
    const p=this.presentProg.use();this.setPlacement(p,w,h,t);this.bindTex(0,input);p.i('uTex',0);this.drawQuad();}
  render(input,w,h,target,frame,params){
    if(!this.ready)return;const g=this.gl,p=params||this.params,out=target||{framebuffer:null,width:this.canvas.width,height:this.canvas.height,scaleType:'fill'};
    const now=performance.now()/1000,dt=this.lastTime?Math.min(.1,now-this.lastTime):1/30;this.lastTime=now;
    const valid=frame&&frame.faces&&frame.faces.length&&frame.faces[0]&&frame.faces[0].length>=R.MIN_LANDMARKS*2;
    if(valid){this.faces=frame.faces;this.presence=Math.min(1,this.presence+dt/.12);}
    else{this.presence=Math.max(0,this.presence-dt/.3);if(this.presence===0)this.faces=[];}
    g.disable(g.DEPTH_TEST);g.disable(g.CULL_FACE);g.disable(g.BLEND);
    if(p.__identity){this.present(input,w,h,out);return;}
    this.ensureBuffers(w,h);this.buildFaceGeometry(p,w,h);this.drawMask();
    this.makeupDrawn=this.drawMakeup(p,w,h);
    const spread=this.maxFaceWidthPx>0?clamp(.03*this.maxFaceWidthPx/this.config.processDownscale/3.23,.7,4):1;
    this.drawStatistics(input,spread,p.smoothing>0);this.drawComposite(input,w,h,p,out);
  }
  buildFaceGeometry(p,w,h){
    this.opCount=this.bodyCount=this.cmdTotal=this.maskFloats=0;this.maxFaceWidthPx=0;if(this.presence<=0)return;
    const slim=clamp(p.faceSlim)*this.presence;
    for(const lm of this.faces){if(this.bodyCount>=2||!lm||lm.length<R.MIN_LANDMARKS*2)continue;
      const faceW=dist(lm,R.RIGHT_CHEEK,R.LEFT_CHEEK,w,h),faceH=dist(lm,R.FOREHEAD,R.CHIN,w,h);if(faceW<8||faceH<8)continue;
      this.maxFaceWidthPx=Math.max(this.maxFaceWidthPx,faceW);const chinX=px(lm,R.CHIN,w),chinY=py(lm,R.CHIN,h),upX=(px(lm,R.FOREHEAD,w)-chinX)/faceH,upY=(py(lm,R.FOREHEAD,h)-chinY)/faceH;
      let axX=px(lm,R.LEFT_EYE_OUTER,w)-px(lm,R.RIGHT_EYE_OUTER,w),axY=py(lm,R.LEFT_EYE_OUTER,h)-py(lm,R.RIGHT_EYE_OUTER,h);const axLen=Math.hypot(axX,axY);if(axLen<.001)continue;axX/=axLen;axY/=axLen;
      const b=this.bodyCount*4,cx=(px(lm,R.FOREHEAD,w)+chinX)*.5-upX*.35*faceH,cy=(py(lm,R.FOREHEAD,h)+chinY)*.5-upY*.35*faceH;
      this.bodyA[b]=cx;this.bodyA[b+1]=cy;this.bodyA[b+2]=axX;this.bodyA[b+3]=axY;this.bodyB[b]=1/(.9*faceW);this.bodyB[b+1]=1/(1.05*faceH);this.bodyB[b+2]=this.presence;this.bodyB[b+3]=0;this.bodyCount++;
      // The only reshape: a bounded, symmetric whole-face slimming warp.
      if(slim>0)for(let i=0;i<R.JAW_PAIRS.length;i++){const amount=slim*.055*faceW*R.JAW_WEIGHTS[i];for(const idx of R.JAW_PAIRS[i])this.addInwardOp(lm,idx,chinX,chinY,upX,upY,amount,.35*faceW,w,h);}
      this.buildMasks(lm,upX,upY);
    }
  }
  addInwardOp(lm,idx,ax,ay,upX,upY,amount,radius,w,h){const x=px(lm,idx,w),y=py(lm,idx,h),t=(x-ax)*upX+(y-ay)*upY;
    let dx=ax+upX*t-x,dy=ay+upY*t-y;const len=Math.hypot(dx,dy);if(len<.001)return;dx=dx/len+upX*.2;dy=dy/len+upY*.2;this.addMoveOp(x,y,dx*amount,dy*amount,radius);}
  addMoveOp(x,y,dx,dy,radius){const len=Math.hypot(dx,dy),max=radius*.4;if(len>max){dx*=max/len;dy*=max/len;}if(len>.05)this.addOp(x,y,radius,0,dx,dy);}
  addOp(x,y,radius,scale,dx,dy){if(this.opCount>=8||radius<1)return;const i=this.opCount*4;
    this.opA[i]=x;this.opA[i+1]=y;this.opA[i+2]=1/(radius*radius);this.opA[i+3]=scale;
    this.opB[i]=dx;this.opB[i+1]=dy;this.opB[i+2]=this.opB[i+3]=0;this.opCount++;}
  gather(lm,idx,out){for(let i=0;i<idx.length;i++){out[2*i]=lm[2*idx[i]];out[2*i+1]=1-lm[2*idx[i]+1];}return idx.length;}
  beginCmd(mode,r,g,b,a){if(this.cmdTotal>=32)return;const i=this.cmdTotal;this.cmdStart[i]=this.maskFloats/3;this.cmdMode[i]=mode;
    this.cmdColor[i*4]=r;this.cmdColor[i*4+1]=g;this.cmdColor[i*4+2]=b;this.cmdColor[i*4+3]=a;}
  endCmd(){if(this.cmdTotal>=32)return;const i=this.cmdTotal;this.cmdCount[i]=this.maskFloats/3-this.cmdStart[i];if(this.cmdCount[i]>0)this.cmdTotal++;}
  ensureMask(extra){if(this.maskFloats+extra<=this.maskVerts.length)return;const n=new Float32Array(Math.max(this.maskVerts.length*2,this.maskFloats+extra));
    n.set(this.maskVerts.subarray(0,this.maskFloats));this.maskVerts=n;}
  vert(x,y,v){this.maskVerts[this.maskFloats++]=x;this.maskVerts[this.maskFloats++]=y;this.maskVerts[this.maskFloats++]=v;}
  emitPolygon(p,n,scale,feather){if(n<3)return;let cx=0,cy=0;for(let i=0;i<n;i++){cx+=p[2*i];cy+=p[2*i+1];}cx/=n;cy/=n;
    const si=Math.max(0,scale-feather),so=scale+feather;this.ensureMask(n*27);
    for(let i=0;i<n;i++){const j=(i+1)%n,ax=p[2*i]-cx,ay=p[2*i+1]-cy,bx=p[2*j]-cx,by=p[2*j+1]-cy,
      aix=cx+ax*si,aiy=cy+ay*si,aox=cx+ax*so,aoy=cy+ay*so,bix=cx+bx*si,biy=cy+by*si,box=cx+bx*so,boy=cy+by*so;
      this.vert(cx,cy,1);this.vert(aix,aiy,1);this.vert(bix,biy,1);this.vert(aix,aiy,1);this.vert(aox,aoy,0);this.vert(bix,biy,1);
      this.vert(bix,biy,1);this.vert(aox,aoy,0);this.vert(box,boy,0);}}
  emitStrip(lm,upper,lower){this.ensureMask(upper.length*18);for(let i=0;i+1<upper.length;i++){
    const ux0=lm[2*upper[i]],uy0=1-lm[2*upper[i]+1],ux1=lm[2*upper[i+1]],uy1=1-lm[2*upper[i+1]+1],
      lx0=lm[2*lower[i]],ly0=1-lm[2*lower[i]+1],lx1=lm[2*lower[i+1]],ly1=1-lm[2*lower[i+1]+1];
    this.vert(ux0,uy0,1);this.vert(lx0,ly0,1);this.vert(ux1,uy1,1);this.vert(ux1,uy1,1);this.vert(lx0,ly0,1);this.vert(lx1,ly1,1);}}
  buildMasks(lm,upX,upY){const pr=this.presence;let n=this.gather(lm,R.FACE_OVAL,this.pts),cx=0,cy=0;for(let i=0;i<n;i++){cx+=this.pts[2*i];cy+=this.pts[2*i+1];}cx/=n;cy/=n;
    for(let i=0;i<n;i++){const dx=this.pts[2*i]-cx,dy=this.pts[2*i+1]-cy,len=Math.hypot(dx,dy);if(len<1e-6)continue;const up=(dx*upX+dy*upY)/len;if(up>0){const s=1+.22*up;this.pts[2*i]=cx+dx*s;this.pts[2*i+1]=cy+dy*s;}}
    this.beginCmd(0,pr,0,0,0);this.emitPolygon(this.pts,n,.97,.1);this.endCmd();
    // Keep eyes, lips and brows out of skin smoothing/whitening. No feature makeup.
    this.beginCmd(1,1,0,0,0);this.emitPolygon(this.pts,this.gather(lm,R.RIGHT_EYE,this.pts),1.1,.15);this.emitPolygon(this.pts,this.gather(lm,R.LEFT_EYE,this.pts),1.1,.15);this.emitPolygon(this.pts,this.gather(lm,R.LIPS_OUTER,this.pts),1.08,.12);this.emitStrip(lm,R.RIGHT_BROW_UPPER,R.RIGHT_BROW_LOWER);this.emitStrip(lm,R.LEFT_BROW_UPPER,R.LEFT_BROW_LOWER);this.endCmd();}
  drawMask(){const g=this.gl;this.mask.bind();g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);if(!this.cmdTotal)return;
    g.bindBuffer(g.ARRAY_BUFFER,this.maskVbo);g.bufferData(g.ARRAY_BUFFER,this.maskVerts.subarray(0,this.maskFloats),g.DYNAMIC_DRAW);
    const p=this.maskProg.use();g.enable(g.BLEND);g.vertexAttribPointer(0,2,g.FLOAT,false,12,0);g.enableVertexAttribArray(0);
    g.vertexAttribPointer(1,1,g.FLOAT,false,12,8);g.enableVertexAttribArray(1);
    for(let i=0;i<this.cmdTotal;i++){if(this.cmdMode[i]===0)g.blendFunc(g.ONE,g.ONE_MINUS_SRC_COLOR);else g.blendFunc(g.ZERO,g.ONE_MINUS_SRC_COLOR);
      const c=i*4;g.uniform4f(p.loc('uColor'),this.cmdColor[c],this.cmdColor[c+1],this.cmdColor[c+2],this.cmdColor[c+3]);
      g.drawArrays(g.TRIANGLES,this.cmdStart[i],this.cmdCount[i]);}
    g.disableVertexAttribArray(1);g.disable(g.BLEND);}
  blur(tex,sx,sy){const p=this.blurProg.use();p.mat('uTexMatrix',IDENTITY);p.f('uFlipY',1);p.v2('uStep',sx,sy);this.bindTex(0,tex);p.i('uTex',0);this.drawQuad();}
  drawStatistics(input,spread,withDev){const sx=spread/this.tmp.width,sy=spread/this.tmp.height,hx=sx,hy=0;
    this.tmp.bind();let p=this.blurInProg.use();p.mat('uTexMatrix',IDENTITY);p.f('uFlipY',1);p.v2('uStepIn',hx,hy);this.bindTex(0,input);p.i('uInput',0);this.drawQuad();
    this.mean.bind();this.blur(this.tmp.texture,0,sy);if(!withDev)return;
    this.tmp.bind();p=this.devProg.use();p.mat('uTexMatrix',IDENTITY);p.f('uFlipY',1);p.v2('uStepIn',hx,hy);p.v2('uStep',sx,0);
    this.bindTex(0,input);p.i('uInput',0);this.bindTex(1,this.mean.texture);p.i('uMean',1);this.drawQuad();this.dev.bind();this.blur(this.tmp.texture,0,sy);}
  canonical(tex,image){if(tex)return tex;const g=this.gl,t=makeTexture(g);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
    g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,image);g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR_MIPMAP_LINEAR);return t;}
  drawMakeup(p,w,h){if(!hasMakeup(p)||this.presence<=0||!this.faces.length||!this.makeupImage)return false;
    this.makeupTex=this.canonical(this.makeupTex,this.makeupImage);const div=this.config.tier==='LOW'?2:1;
    return this.drawMeshMap(this.makeupTex,this.makeup,Math.max(16,Math.floor(w/div)),Math.max(16,Math.floor(h/div)));}
  drawMeshMap(tex,fbo,w,h){const g=this.gl;fbo.ensure(w,h);fbo.bind();g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);
    const p=this.makeupProg.use();this.bindTex(0,tex);p.i('uTex',0);p.f('uFade',this.presence);g.enable(g.CULL_FACE);g.cullFace(g.BACK);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,this.meshIbo);let drawn=false;
    for(const lm of this.faces){if(!lm||lm.length<VERTEX_COUNT*2)continue;for(let i=0;i<VERTEX_COUNT;i++){
      this.meshVerts[i*4]=lm[2*i];this.meshVerts[i*4+1]=1-lm[2*i+1];this.meshVerts[i*4+2]=UV[2*i];this.meshVerts[i*4+3]=UV[2*i+1];}
      const screen=area(lm[2*R.FOREHEAD],1-lm[2*R.FOREHEAD+1],lm[2*R.RIGHT_CHEEK],1-lm[2*R.RIGHT_CHEEK+1],lm[2*R.LEFT_CHEEK],1-lm[2*R.LEFT_CHEEK+1]),
        uv=area(UV[2*R.FOREHEAD],UV[2*R.FOREHEAD+1],UV[2*R.RIGHT_CHEEK],UV[2*R.RIGHT_CHEEK+1],UV[2*R.LEFT_CHEEK],UV[2*R.LEFT_CHEEK+1]);
      g.frontFace(screen*uv<0?g.CCW:g.CW);g.bindBuffer(g.ARRAY_BUFFER,this.meshVbo);g.bufferData(g.ARRAY_BUFFER,this.meshVerts,g.DYNAMIC_DRAW);
      g.vertexAttribPointer(0,2,g.FLOAT,false,16,0);g.enableVertexAttribArray(0);g.vertexAttribPointer(1,2,g.FLOAT,false,16,8);g.enableVertexAttribArray(1);
      g.drawElements(g.TRIANGLES,TRIANGLES.length,g.UNSIGNED_SHORT,0);drawn=true;}
    g.disableVertexAttribArray(1);g.disable(g.CULL_FACE);g.frontFace(g.CCW);return drawn;}
  setColor(p,n,c,a){p.v4(n,c[0],c[1],c[2],a);}
  drawComposite(input,w,h,p,t){const g=this.gl;g.bindFramebuffer(g.FRAMEBUFFER,t.framebuffer||null);g.viewport(0,0,t.width,t.height);const pr=this.compProg.use();this.setPlacement(pr,w,h,t);pr.v2('uWarpSize',w,h);pr.i('uOpCount',this.opCount);pr.v4v('uOpA[0]',this.opA);pr.v4v('uOpB[0]',this.opB);
    this.bindTex(0,input);pr.i('uInput',0);this.bindTex(1,this.mean.texture);pr.i('uMean',1);this.bindTex(2,this.dev.texture);pr.i('uDev',2);this.bindTex(3,this.mask.texture);pr.i('uMask',3);pr.mat('uTexMatrix',IDENTITY);pr.v2('uSize',w,h);
    const smooth=clamp(p.smoothing);pr.f('uSmoothMix',Math.min(1,smooth*1.6)*.95);pr.f('uEps',(.0004+.006*smooth*smooth)*(1-.55*clamp(p.__texture)));const white=clamp(p.whitening),bm1=2+6*white;pr.f('uWhiteMix',Math.min(1,white*1.5));pr.f('uWhiteBm1',bm1);pr.f('uWhiteInvLog',1/Math.log(1+bm1));pr.f('uBodySkin',clamp(p.bodySkin));pr.i('uBodyCount',this.bodyCount);pr.v4v('uBodyA[0]',this.bodyA);pr.v4v('uBodyB[0]',this.bodyB);
    this.bindTex(4,this.makeup.texture);pr.i('uMakeup',4);this.setColor(pr,'uBlush',p.blushColor,this.makeupDrawn?clamp(p.blush):0);this.setColor(pr,'uSkinTint',p.skinTint,clamp(p.skinTintAmount));
    if(this.opCount>0){g.bindBuffer(g.ARRAY_BUFFER,this.gridVbo);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);g.enableVertexAttribArray(0);g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,this.gridIbo);g.drawElements(g.TRIANGLES,this.gridIndexCount,g.UNSIGNED_SHORT,0);}else this.drawQuad();for(let i=4;i>=1;i--)this.bindTex(i,null);g.activeTexture(g.TEXTURE0);}
  release(){if(!this.ready)return;const g=this.gl;this.ready=false;this.programs.forEach(p=>p.release());this.programs=[];
    [this.tmp,this.mean,this.dev,this.mask,this.makeup].forEach(f=>f.release());
    this.deleteTexture(this.makeupTex);this.makeupTex=null;
    [this.quadVbo,this.maskVbo,this.meshVbo,this.meshIbo,this.gridVbo,this.gridIbo].forEach(b=>{if(b)g.deleteBuffer(b);});
    this.faces=[];this.gridInW=this.gridInH=0;}
}
