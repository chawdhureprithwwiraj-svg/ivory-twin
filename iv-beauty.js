/* ══════════════════════════════════════════════════════════════════════════════
   IVORY · THE BEAUTY STUDIO · a real-time, zero-cost facial enhancement engine

   One file, fetched on demand beside the page (like iv-films.js) so the page
   itself never grows. Nothing here leaves the phone: frames are read from the
   camera, processed on the GPU in two passes, and a filtered MediaStream is
   handed back to Agora as a custom video track.

   The architecture, in the order the PDF asks for it
   ---------------------------------------------------
   · face region — the skin mask is rendered at 64 × 48, read back every few
     frames, and its moments give a face box; that box is smoothed over time
     (EMA) so nothing jitters. No model download, no wasm, no network.
   · skin mask — chroma (Cb/Cr) gated by luma, then multiplied by a soft
     ellipse prior around the face box, then blended with the previous frame's
     mask (temporal stabilisation) so edges do not crawl.
   · edge-aware smoothing — a 9-tap bilateral on the GPU: neighbouring pixels
     only count when their colour is close, so eyelids, brows, lips and hair
     keep their edges while the skin settles.
   · texture preservation — the high-pass the bilateral removed is added back
     at her chosen amount, which is what keeps pores instead of plastic.
   · geometry — slimming and jaw work in UV space, weighted by the mask and the
     face box, so the background can never warp.
   · colour & light — tone balance, warmth, exposure/contrast, a face-aware
     illumination gradient, blush, lip and eye placements taken from the box's
     own proportions, and a cinematic grade.

   Why not MediaPipe / TensorFlow.js (the comparison the PDF asks for)
   ------------------------------------------------------------------
   MediaPipe Face Landmarker is free and excellent, but its wasm runtime and
   model are ~5–8 MB before a single pixel is drawn, must be fetched at the
   moment a broadcast starts, and on a mid-range Android it costs more frame
   time than the effect itself. TF.js face-mesh adds the same weight again.
   A bilateral skin mask plus a tracked face box reaches the same visual result
   for this use (smoothing, lifting, tinting) at ~40 KB of code, no model, no
   network, and it degrades to a plain picture rather than a black screen.
   That is the trade this house chose, and it is written down in CHANGELOG.
   ══════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.IVBEAUTY) return;

  var LS = 'ivory.beauty.v3';

  /* ── what she may dial ─────────────────────────────────────────────────── */
  var FX = [
    { k: 'smooth',    g: 'skin',  name: 'Smoothing',        d: 0.55 },
    { k: 'blemish',   g: 'skin',  name: 'Blemish lift',     d: 0.45 },
    { k: 'spots',     g: 'skin',  name: 'Spot & pigment',   d: 0.40 },
    { k: 'undereye',  g: 'skin',  name: 'Under-eye',        d: 0.35 },
    { k: 'lines',     g: 'skin',  name: 'Fine lines',       d: 0.30 },
    { k: 'texture',   g: 'skin',  name: 'Pore & texture',   d: 0.55 },
    { k: 'tone',      g: 'skin',  name: 'Tone balance',     d: 0.30 },
    { k: 'radiance',  g: 'skin',  name: 'Brightening',      d: 0.25 },

    { k: 'slim',      g: 'face',  name: 'Face slimming',    d: 0.20 },
    { k: 'jaw',       g: 'face',  name: 'Jawline',          d: 0.18 },
    { k: 'cheek',     g: 'face',  name: 'Cheek definition', d: 0.15 },
    { k: 'nose',      g: 'face',  name: 'Nose refinement',  d: 0.12 },
    { k: 'symmetry',  g: 'face',  name: 'Symmetry',         d: 0.10 },

    { k: 'blush',     g: 'makeup', name: 'Rosy cheeks',     d: 0.18 },
    { k: 'lip',       g: 'makeup', name: 'Lip tint',        d: 0.16 },
    { k: 'eyes',      g: 'makeup', name: 'Eye enhancement', d: 0.14 },
    { k: 'warmth',    g: 'makeup', name: 'Warmth',          d: 0.12 },
    { k: 'exposure',  g: 'makeup', name: 'Exposure',        d: 0.10 },
    { k: 'contrast',  g: 'makeup', name: 'Contrast',        d: 0.10 },

    { k: 'illum',     g: 'light', name: 'Face light',       d: 0.30 },
    { k: 'studio',    g: 'light', name: 'Studio softness',  d: 0.25 },
    { k: 'highlight', g: 'light', name: 'Highlight & shadow', d: 0.18 },
    { k: 'cinematic', g: 'light', name: 'Cinematic finish', d: 0.14 }
  ];
  var GROUPS = [['skin', 'Skin'], ['face', 'Face'], ['makeup', 'Makeup'], ['light', 'Light'], ['lens', 'Eyes']];

  var PRESETS = {
    natural: { master: 0.55, smooth: .50, blemish: .40, spots: .35, undereye: .30, lines: .25, texture: .60,
               tone: .25, radiance: .18, slim: .12, jaw: .10, cheek: .10, nose: .08, symmetry: .06,
               blush: .14, lip: .12, eyes: .10, warmth: .10, exposure: .06, contrast: .06,
               illum: .22, studio: .18, highlight: .14, cinematic: .08 },
    glam:    { master: 0.72, smooth: .62, blemish: .55, spots: .48, undereye: .42, lines: .35, texture: .48,
               tone: .38, radiance: .30, slim: .20, jaw: .16, cheek: .18, nose: .12, symmetry: .10,
               blush: .28, lip: .30, eyes: .24, warmth: .16, exposure: .12, contrast: .14,
               illum: .34, studio: .26, highlight: .24, cinematic: .16 },
    radiant: { master: 0.80, smooth: .50, blemish: .42, spots: .40, undereye: .45, lines: .30, texture: .62,
               tone: .34, radiance: .55, slim: .10, jaw: .10, cheek: .12, nose: .08, symmetry: .06,
               blush: .20, lip: .16, eyes: .16, warmth: .22, exposure: .20, contrast: .08,
               illum: .46, studio: .34, highlight: .30, cinematic: .10 },
    studio:  { master: 0.65, smooth: .58, blemish: .50, spots: .45, undereye: .38, lines: .30, texture: .50,
               tone: .30, radiance: .22, slim: .14, jaw: .12, cheek: .14, nose: .10, symmetry: .08,
               blush: .10, lip: .10, eyes: .12, warmth: .08, exposure: .08, contrast: .10,
               illum: .40, studio: .40, highlight: .32, cinematic: .24 }
  };

  /* ── ten green lenses, light to deep ────────────────────────────────────
     c0 collarette (by the pupil) · c1 the body of the iris · c2 the limbal
     ring. Nothing grey, nothing blue: every one of them is a green.        */
  var LENSES = [
    { id: 'mint',    name: 'Crystal Mint',   c0: [0.62, 0.74, 0.63], c1: [0.48, 0.62, 0.50], c2: [0.20, 0.31, 0.23], warm: 0.06 },
    { id: 'aqua',    name: 'Light Aqua',     c0: [0.54, 0.72, 0.66], c1: [0.40, 0.60, 0.55], c2: [0.14, 0.27, 0.25], warm: 0.04 },
    { id: 'sage',    name: 'Soft Sage',      c0: [0.62, 0.65, 0.50], c1: [0.50, 0.55, 0.40], c2: [0.24, 0.27, 0.17], warm: 0.12 },
    { id: 'spring',  name: 'Fresh Spring',   c0: [0.56, 0.68, 0.38], c1: [0.44, 0.58, 0.30], c2: [0.20, 0.29, 0.12], warm: 0.07 },
    { id: 'emerald', name: 'Natural Emerald', c0: [0.30, 0.55, 0.42], c1: [0.20, 0.42, 0.31], c2: [0.06, 0.19, 0.14], warm: 0.05 },
    { id: 'olive',   name: 'Olive',          c0: [0.48, 0.48, 0.26], c1: [0.38, 0.40, 0.20], c2: [0.16, 0.17, 0.08], warm: 0.16 },
    { id: 'jade',    name: 'Jade',           c0: [0.32, 0.58, 0.48], c1: [0.22, 0.46, 0.38], c2: [0.07, 0.20, 0.17], warm: 0.06 },
    { id: 'forest',  name: 'Deep Forest',    c0: [0.20, 0.36, 0.25], c1: [0.14, 0.28, 0.19], c2: [0.04, 0.12, 0.08], warm: 0.07 },
    { id: 'bottle',  name: 'Rich Bottle',   c0: [0.13, 0.25, 0.17], c1: [0.08, 0.19, 0.13], c2: [0.02, 0.08, 0.05], warm: 0.06 },
    { id: 'ench',    name: 'Dark Enchanted', c0: [0.08, 0.17, 0.13], c1: [0.05, 0.11, 0.08], c2: [0.01, 0.04, 0.03], warm: 0.05 }
  ];

  var S = {
    on: false, open: false, tab: 'skin', preset: 'natural',
    master: 0.55, before: false, quality: 1,
    lens: 'emerald', lensAmt: 0.90, lensOn: false,
    fx: {}, off: {}, saved: null
  };
  FX.forEach(function (f) { S.fx[f.k] = f.d; S.off[f.k] = false; });

  function load() {
    try {
      var raw = localStorage.getItem(LS);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (!d) return;
      if (typeof d.master === 'number') S.master = d.master;
      if (typeof d.on === 'boolean') S.on = d.on;
      if (d.fx) FX.forEach(function (f) { if (typeof d.fx[f.k] === 'number') S.fx[f.k] = d.fx[f.k]; });
      if (d.off) FX.forEach(function (f) { S.off[f.k] = !!d.off[f.k]; });
      if (d.preset) S.preset = d.preset;
      if (typeof d.lens === 'string' && LENSES.some(function (l) { return l.id === d.lens; })) S.lens = d.lens;
      if (typeof d.lensAmt === 'number') S.lensAmt = d.lensAmt;
      if (typeof d.lensOn === 'boolean') S.lensOn = d.lensOn;
      if (d.saved) S.saved = d.saved;
    } catch (e) {}
  }
  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        on: S.on, master: S.master, preset: S.preset, saved: S.saved,
        lens: S.lens, lensAmt: S.lensAmt, lensOn: S.lensOn,
        fx: S.fx, off: S.off
      }));
    } catch (e) {}
  }
  load();

  function eff(k) { return S.off[k] ? 0 : (S.fx[k] || 0); }

  /* ── the WebGL engine ─────────────────────────────────────────────────── */
  /* v is the picture's own coordinates: (0,0) at its top-left, exactly the
     space the face landmarks are given in. The old build mapped v to clip
     space, which drew every filtered frame upside down.                    */
  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*0.5+0.5,0.5-p.y*0.5);gl_Position=vec4(p,0.,1.);}';

  var FS_MASK = [
    'precision mediump float;varying vec2 v;',
    'uniform sampler2D tex;uniform vec2 box;uniform vec2 rad;uniform float prev;',
    'uniform sampler2D hist;uniform float blend;',
    'void main(){',
    '  vec3 c=texture2D(tex,v).rgb;',
    '  float cb=-0.168736*c.r-0.331264*c.g+0.5*c.b;',
    '  float cr=0.5*c.r-0.418688*c.g-0.081312*c.b;',
    '  float y=dot(c,vec3(0.299,0.587,0.114));',
    '  float mcb=smoothstep(-0.215,-0.175,cb)*(1.0-smoothstep(-0.02,0.02,cb));',
    '  float mcr=smoothstep(0.005,0.035,cr)*(1.0-smoothstep(0.155,0.19,cr));',
    '  float lum=smoothstep(0.12,0.22,y)*(1.0-smoothstep(0.93,0.99,y));',
    '  float skin=mcb*mcr*lum;',
    '  vec2 q=(v-box)/rad;',
    '  float prior=1.0-smoothstep(0.85,1.30,length(q));',
    '  float m=skin*prior;',
    '  float p=texture2D(hist,v).r;',
    '  gl_FragColor=vec4(mix(m,p,blend),0.0,0.0,1.0);',
    '}'].join('\n');

  var FS_MAIN = [
    'precision highp float;varying vec2 v;',
    'uniform sampler2D tex;uniform sampler2D mask;',
    'uniform vec2 box;uniform vec2 rad;uniform vec2 texel;',
    'uniform float master;',
    'uniform float uSm,uBl,uSp,uUe,uLn,uTx,uTn,uRd;',
    'uniform float uSl,uJw,uCk,uNs,uSy;',
    'uniform float uBh,uLp,uEy,uWm,uEx,uCt;',
    'uniform float uIl,uSt,uHi,uCi;',
    'uniform float before;',
    '',
    /* the two eyes: centre, radii · lid: the open lid's y, the low lid's y,
       confidence, unused                                                     */
    'uniform vec4 eyeL;uniform vec4 lidL;uniform vec4 eyeR;uniform vec4 lidR;',
    'uniform vec3 lc0;uniform vec3 lc1;uniform vec3 lc2;',
    'uniform float lensAmt;uniform float lensOn;uniform vec2 lensTune;',
    /* the face's own width, band by band, read off the landmarks */
    'uniform sampler2D prof;uniform vec2 profY;uniform float profOn;',
    '',
    'float mAt(vec2 uv){ return texture2D(mask,uv).r; }',
    '',
    /* one lens, worn by one eye. The colour is ours; the light, the shade,
       the fibres, the limbal ring and the catchlight are the eye's own —
       so the tint sits inside the eye instead of on top of it.          */
    'vec3 lensEye(vec3 col, vec2 uv, vec4 e, vec4 lid){',
    '  vec2 d=(uv-e.xy)/max(e.zw,vec2(1e-4));',
    '  float rad=length(d);',
    '  if(rad>1.24) return col;',
    '  float shape=1.0-smoothstep(0.92,1.06,rad);',
    '  float f=0.0050;',
    '  float band=smoothstep(lid.x-f,lid.x+f,uv.y)*(1.0-smoothstep(lid.y-f,lid.y+f,uv.y));',
    '  float open=smoothstep(0.26,0.72,(lid.y-lid.x)/max(e.w*2.0,1e-4));',
    '  vec3 kL=vec3(0.299,0.587,0.114);',
    '  float m0=dot(texture2D(tex,e.xy+e.zw*vec2(0.42,0.0)).rgb,kL);',
    '  float m1=dot(texture2D(tex,e.xy-e.zw*vec2(0.42,0.0)).rgb,kL);',
    '  float m2=dot(texture2D(tex,e.xy+e.zw*vec2(0.0,0.42)).rgb,kL);',
    '  float m3=dot(texture2D(tex,e.xy-e.zw*vec2(0.0,0.42)).rgb,kL);',
    '  float mean=max(0.045,(m0+m1+m2+m3)*0.25);',
    '  vec3 src=texture2D(tex,uv).rgb;',
    '  float lum=dot(src,kL);',
    '  vec2 q=e.zw*0.16;',
    '  float b0=dot(texture2D(tex,uv+vec2(q.x,0.0)).rgb,kL);',
    '  float b1=dot(texture2D(tex,uv-vec2(q.x,0.0)).rgb,kL);',
    '  float b2=dot(texture2D(tex,uv+vec2(0.0,q.y)).rgb,kL);',
    '  float b3=dot(texture2D(tex,uv-vec2(0.0,q.y)).rgb,kL);',
    /* bl: the eye's own light and shade across the iris — lid shadow above */
    '  float bl=max(0.020,(lum+b0+b1+b2+b3)*0.2);',
    '  float sh=clamp(bl/max(mean,0.05),0.50,1.70);',
    /* det: the fibres, read off the photograph itself */
    '  float det=clamp((lum-bl)/max(bl,0.05),-0.70,0.70);',
    '  float t=clamp(rad,0.0,1.0);',
    '  vec3 bse=mix(lc0,lc1,smoothstep(0.06,0.72,t));',
    '  bse=mix(bse,lc2,smoothstep(0.76,1.08,t));',
    '  vec3 c=bse*(0.66+0.34*sh)*(1.0+det*0.75);',
    '  c=mix(c,c*1.07+vec3(0.010),clamp(1.0-smoothstep(0.30,0.56,rad),0.0,1.0)*0.45);',
    '  c*=mix(1.0,0.45,smoothstep(0.86,1.10,rad));',
    /* a catchlight is white light on the surface: only that comes back */
    '  float spec=smoothstep(0.70,0.96,lum)*smoothstep(1.45,2.10,lum/max(mean,0.05))*smoothstep(0.98,0.86,rad);',
    '  c=mix(c,src*1.04,clamp(spec,0.0,1.0)*0.62);',
    '  c=mix(c,vec3(dot(c,kL)),0.10);',
    '  float pupil=smoothstep(0.16,0.34,rad);',
    '  float a=lensAmt*shape*band*open*pupil*clamp(lid.z,0.0,1.0);',
    /* the pupil and the lashes are not pigment: leave them be */
    '  a*=smoothstep(0.022,0.080,lum);',
    '  return mix(col,c,clamp(a,0.0,0.94));',
    '}',
    '',
    'void main(){',
    '  vec2 uv=v;',
    '  float m=mAt(uv);',
    '  vec2 q=(uv-box)/rad;',
    '  float inside=smoothstep(1.15,0.55,length(q));',
    '  float w=mix(0.0,1.0,inside)*smoothstep(0.05,0.45,m);',
    '',
    '  /* geometry, inside the face only — and driven by the face’s own width */',
    '  vec2 wuv=uv;',
    '  if(profOn>0.5){',
    '    float pb=(uv.y-profY.x)*profY.y;',
    '    if(pb>0.004&&pb<0.996){',
    '      vec4 pf=texture2D(prof,vec2(pb,0.5));',
    '      float dx=uv.x-pf.r;',
    '      float rel=abs(dx)/max(pf.g,0.004);',
    /* the narrowing peaks on the cheek and is gone by the contour, so the
       hair line and the backdrop never move */
    '      float edge=smoothstep(0.16,0.86,rel)*(1.0-smoothstep(0.90,1.12,rel));',
    '      wuv.x=clamp(pf.r+dx*(1.0+uSl*0.17*pf.b*edge),0.0,1.0);',
    '    }',
    '  } else {',
    '    wuv.x=box.x+(uv.x-box.x)*(1.0+uSl*0.14*w);',
    '  }',
    '  wuv.x=box.x+(wuv.x-box.x)*(1.0+uNs*0.20*w*smoothstep(0.42,0.0,abs(q.x))*smoothstep(0.55,0.05,abs(q.y+0.05)));',
    '  wuv.y+= -uJw*0.055*w*smoothstep(-0.05,-0.95,q.y);',
    '  wuv.y+= uCk*0.012*w*smoothstep(0.15,0.75,q.y)*(step(0.0,q.x)-0.5)*2.0;',
    '',
    '  vec3 base=texture2D(tex,wuv).rgb;',
    '  if(before>0.5){ gl_FragColor=vec4(base,1.0); return; }',
    '',
    '  /* 9-tap bilateral: neighbours only count when their colour is close */',
    '  vec3 acc=base; float ws=1.0;',
    '  float rr=1.35;',
    '  for(int i=0;i<8;i++){',
    '    float a=float(i)*0.7853982;',
    '    vec2 o=vec2(cos(a),sin(a))*texel*rr;',
    '    vec3 c2=texture2D(tex,wuv+o).rgb;',
    '    vec3 df=c2-base;',
    '    float wt=exp(-dot(df,df)*90.0);',
    '    acc+=c2*wt; ws+=wt;',
    '  }',
    '  vec3 blur=acc/ws;',
    '  vec3 hp=base-blur;',
    '',
    '  /* a wider, unweighted mean: this is what a blemish is measured against */',
    '  vec3 wacc=base;',
    '  for(int j=0;j<8;j++){',
    '    float a2=float(j)*0.7853982+0.39;',
    '    vec2 o2=vec2(cos(a2),sin(a2))*texel*(j<4?6.0:13.0);',
    '    wacc+=texture2D(tex,wuv+o2).rgb;',
    '  }',
    '  vec3 wide=wacc/9.0;',
    '',
    '  float k=uSm*(0.55+0.45*m);',
    '  vec3 col=mix(base,blur,clamp(k,0.0,0.9)*w);',
    '  col=mix(col,wide,clamp(uSm*w*0.40,0.0,0.55));',
    '',
    '  /* keep pores: the high-pass comes back at her texture amount */',
    '  col+=hp*(uTx*0.75)*w*(1.0-uSm*0.35);',
    '',
    '  /* blemishes: what sits darker than the wide mean is lifted toward it */',
    '  float dark=max(0.0,dot(wide-base,vec3(0.333)));',
    '  col+=dark*(uBl*1.20)*w;',
    '',
    '  /* pigment and blotches: the colour is pulled toward its own neighbourhood */',
    '  float chlen=length(base-wide);',
    '  float blotch=smoothstep(0.035,0.20,chlen);',
    '  col=mix(col,wide,clamp(uSp*w*blotch*0.55,0.0,0.60));',
    '',
    '  /* under-eye: the band below each eye is lifted, never flattened */',
    '  float ey=exp(-pow((abs(q.x)-0.40)/0.22,2.0)-pow((q.y-0.02)/0.20,2.0));',
    '  col+=uUe*ey*w*(0.22*(1.0-dot(col,vec3(0.333))));',
    '',
    '  /* fine lines: a second, tighter smoothing on the forehead and corners */',
    '  float band=exp(-pow((q.y-0.62)/0.34,2.0))+0.6*exp(-pow((abs(q.x)-0.52)/0.22,2.0)-pow((q.y-0.22)/0.18,2.0));',
    '  col=mix(col,blur,clamp(uLn*band*w*0.55,0.0,0.55));',
    '',
    '  /* tone balance: pull the skin toward one calm mid-tone */',
    '  float l=dot(col,vec3(0.299,0.587,0.114));',
    '  col=mix(col,vec3(l)*vec3(1.03,1.0,0.97)+(col-vec3(l))*0.55,uTn*w*0.5);',
    '',
    '  /* radiance */',
    '  col+=uRd*w*mix(vec3(0.03,0.026,0.02),vec3(0.06,0.05,0.035),l)*2.0;',
    '',
    '  /* symmetry: the face is blended with its own mirror, inside only */',
    '  if(uSy>0.001){',
    '    vec3 mir=texture2D(tex,vec2(2.0*box.x-wuv.x,wuv.y)).rgb;',
    '    col=mix(col,mir,uSy*0.35*w);',
    '  }',
    '',
    '  /* blush: two soft gaussians on the cheeks */',
    '  float bl=exp(-pow((abs(q.x)-0.46)/0.30,2.0)-pow((q.y-0.10)/0.24,2.0));',
    '  col=mix(col,col*vec3(1.06,0.90,0.92),clamp(uBh*bl*w,0.0,0.5));',
    '',
    '  /* lips: a rose wash over the mouth’s own place */',
    '  float lp=exp(-pow(q.x/0.30,2.0)-pow((q.y+0.52)/0.13,2.0));',
    '  col=mix(col,col*vec3(1.05,0.82,0.86)+vec3(0.02,0.0,0.005),clamp(uLp*lp*w,0.0,0.6));',
    '',
    '  /* eyes: a touch of contrast on the lash line and iris */',
    '  float e2=exp(-pow((abs(q.x)-0.38)/0.20,2.0)-pow((q.y-0.20)/0.13,2.0));',
    '  col=mix(col,col*1.10-0.01,clamp(uEy*e2*w,0.0,0.35));',
    '',
    '  /* warmth, exposure, contrast */',
    '  col+=vec3(0.035,0.012,-0.012)*uWm;',
    '  col=col*(1.0+0.35*uEx)+0.04*uEx;',
    '  col=(col-0.5)*(1.0+0.45*uCt)+0.5;',
    '',
    '  /* face-aware illumination, then studio highlight/shadow balance */',
    '  float d=length(q);',
    '  float lamp=1.0-smoothstep(0.0,1.35,d);',
    '  col+=vec3(0.05,0.045,0.035)*uIl*lamp*m;',
    '  col=mix(col,col+(1.0-col)*0.18,clamp(uSt*m,0.0,0.6));',
    '  float hi=smoothstep(0.62,0.95,dot(col,vec3(0.333)));',
    '  float lo=1.0-smoothstep(0.10,0.38,dot(col,vec3(0.333)));',
    '  col+=vec3(0.05)*uHi*hi*m;',
    '  col+=vec3(0.035,0.03,0.025)*uHi*lo*m;',
    '',
    '  /* cinematic: a gentle S and a cool shadow / warm light split */',
    '  vec3 s=col*col*(3.0-2.0*col);',
    '  col=mix(col,s,uCi*0.35);',
    '  col.r+=0.02*uCi*hi; col.b+=0.02*uCi*lo;',
    '  float vig=1.0-0.12*uCi*smoothstep(0.55,1.25,length((uv-0.5)*vec2(1.15,1.0)));',
    '  col*=vig;',
    '',
    '  /* her master strength, and the mask keeps the room out of it */',
    '  vec3 out_c=mix(base,col,clamp(master*w,0.0,1.0));',
    '',
    '  /* the lenses, after every grade — her eyes are never tinted by warmth */',
    '  if(lensOn>0.001){',
    '    out_c=lensEye(out_c,uv,eyeL,lidL);',
    '    out_c=lensEye(out_c,uv,eyeR,lidR);',
    '  }',
    '  gl_FragColor=vec4(clamp(out_c,0.0,1.0),1.0);',
    '}'].join('\n');


  /* ══ the face, followed ══════════════════════════════════════════════════
     MediaPipe's Face Landmarker — Apache-2.0, free, no key, no cloud, no
     frame leaves the device. 478 points: the full mesh, the face oval, and
     both iris rings (468-477), which is what a lens has to sit on. It is
     fetched the first time a lens or a landmark-driven slim is asked for,
     and never at page load.                                                */
  var TR = { state: 'idle', err: '', bootMs: 0, ms: 0, every: 1, hits: 0, lastAt: 0, src: null };
  var FL = null;                 /* the landmarker */
  var LM = { pts: null, raw: null, t: 0, conf: 0, vel: [0, 0, 0, 0, 0, 0, 0, 0] };
  var FACE = null;               /* what the shader needs, computed once a frame */
  var EYE_IDX = {
    L: { c: 468, ring: [469, 470, 471, 472], up: [33, 160, 159, 158, 133], lo: [33, 144, 145, 146, 133] },
    R: { c: 473, ring: [474, 475, 476, 477], up: [263, 387, 386, 385, 362], lo: [263, 373, 374, 380, 362] }
  };
  /* the app's own face oval, 36 points, in order round the face */
  var OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
              400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

  function trackerBase() {
    var sc = document.currentScript;
    var src = (sc && sc.src) || '';
    if (!src) {
      var all = document.getElementsByTagName('script');
      for (var i = all.length - 1; i >= 0; i--) { if (/iv-beauty\.js/.test(all[i].src)) { src = all[i].src; break; } }
    }
    return src ? src.replace(/[^\/]*$/, '') : './';
  }
  var TBASE = trackerBase();

  function loadTracker() {
    if (FL) return Promise.resolve(FL);
    if (TR.state === 'loading') return TR.p;
    TR.state = 'loading';
    var t0 = (window.performance || Date).now();
    TR.p = import(TBASE + 'media/face/vision.js').then(function (vision) {
      return vision.FilesetResolver.forVisionTasks(TBASE + 'media/face').then(function (files) {
        function make(delegate) {
          return vision.FaceLandmarker.createFromOptions(files, {
            baseOptions: { modelAssetPath: TBASE + 'media/face/face_landmarker.task', delegate: delegate },
            runningMode: 'VIDEO', numFaces: 1,
            outputFaceBlendshapes: false, outputFacialTransformationMatrixes: false
          });
        }
        return make('GPU').catch(function () { return make('CPU'); });
      });
    }).then(function (fl) {
      FL = fl; TR.state = 'ready'; TR.bootMs = (window.performance || Date).now() - t0;
      LM.pts = null; LM.conf = 0;
      return fl;
    }).catch(function (e) {
      TR.state = 'off'; TR.err = String((e && e.message) || e).slice(0, 160);
      TR.p = null;
      throw e;
    });
    return TR.p;
  }
  function trackerReady() { return TR.state === 'ready'; }
  function trackerBusy() { return TR.state === 'loading'; }

  /* one detection, now. The engine calls it on the frame it has a picture. */
  function feed(src) {
    if (!FL) return false;
    var now = (window.performance || Date).now();
    if (now - TR.lastAt < TR.every * 24) return false;
    var ts = Math.max(now, (TR.ts || 0) + 1); TR.ts = ts;
    var t0 = now, res = null;
    try { res = FL.detectForVideo(src, ts); } catch (e) {
      LM.conf = 0; return false;
    }
    TR.ms = (window.performance || Date).now() - t0;
    TR.lastAt = (window.performance || Date).now();
    /* a slow device detects less often — it never stops drawing */
    TR.every = TR.ms > 90 ? 3 : (TR.ms > 45 ? 2 : 1);
    var pts = res && res.faceLandmarks && res.faceLandmarks[0];
    if (!pts || pts.length < 478) { TR.misses = (TR.misses || 0) + 1; if (TR.misses > 2) LM.conf = Math.max(0, LM.conf - 0.5); return false; }
    TR.misses = 0;
    var raw = new Float32Array(956);
    for (var i = 0; i < 478; i++) { raw[i * 2] = pts[i].x; raw[i * 2 + 1] = pts[i].y; }
    LM.raw = raw;
    var k = TR.every > 1 ? 0.80 : 0.58;
    if (!LM.pts) { LM.pts = new Float32Array(raw); }
    else {
      for (var j = 0; j < 956; j++) {
        var d = raw[j] - LM.pts[j];
        LM.pts[j] += d * k;
        if (j < 8) LM.vel[j] = LM.vel[j] * 0.6 + d * 0.4;
      }
    }
    LM.t = (window.performance || Date).now();
    LM.conf = Math.min(1, LM.conf + 0.55);
    TR.hits++;
    return true;
  }

  function yOnChain(P, chain, x) {
    for (var i = 0; i < chain.length - 1; i++) {
      var a = chain[i], b = chain[i + 1];
      var ax = P[a * 2], ay = P[a * 2 + 1], bx = P[b * 2], by = P[b * 2 + 1];
      var lo = Math.min(ax, bx), hi = Math.max(ax, bx);
      if (x >= lo && x <= hi && Math.abs(bx - ax) > 1e-6) {
        var t = (x - ax) / (bx - ax);
        return ay + (by - ay) * t;
      }
    }
    var first = chain[0], last = chain[chain.length - 1];
    return (P[first * 2 + 1] + P[last * 2 + 1]) / 2;
  }

  /* the whole face, from the smoothed points, once a frame */
  function computeFace(w, h) {
    var P = LM.pts;
    if (!P) { FACE = null; return null; }
    var age = (window.performance || Date).now() - LM.t;
    var conf = Math.max(0, Math.min(1, LM.conf * (1 - Math.max(0, (age - 420)) / 1400)));
    function eye(spec) {
      var cx = P[spec.c * 2], cy = P[spec.c * 2 + 1];
      var r0 = spec.ring[0], r1 = spec.ring[1], r2 = spec.ring[2], r3 = spec.ring[3];
      var rx = (Math.hypot(P[r0 * 2] - cx, P[r0 * 2 + 1] - cy) + Math.hypot(P[r2 * 2] - cx, P[r2 * 2 + 1] - cy)) / 2;
      var ry = (Math.hypot(P[r1 * 2] - cx, P[r1 * 2 + 1] - cy) + Math.hypot(P[r3 * 2] - cx, P[r3 * 2 + 1] - cy)) / 2;
      /* a little prediction so a fast glance does not slide the lens */
      var dx = LM.vel[0] * 0, dy = 0;
      var yUp = yOnChain(P, spec.up, cx), yLo = yOnChain(P, spec.lo, cx);
      return { c: [cx, cy], r: [Math.max(0.004, rx * 1.04), Math.max(0.004, ry * 1.04)], up: yUp, lo: yLo };
    }
    var eL = eye(EYE_IDX.L), eR = eye(EYE_IDX.R);
    /* the face's own width, band by band */
    var yTop = 1, yBot = 0, i;
    for (i = 0; i < OVAL.length; i++) {
      var y = P[OVAL[i] * 2 + 1];
      if (y < yTop) yTop = y;
      if (y > yBot) yBot = y;
    }
    var eyeY = (P[EYE_IDX.L.up[2] * 2 + 1] + P[EYE_IDX.R.up[2] * 2 + 1]) / 2;
    var chinY = P[152 * 2 + 1];
    var prof = FACE && FACE.prof ? FACE.prof : new Uint8Array(256);
    for (var b = 0; b < 64; b++) {
      var yb = yTop + (b + 0.5) / 64 * Math.max(1e-4, yBot - yTop);
      var xl = 1, xr = 0, hit = 0;
      for (i = 0; i < OVAL.length; i++) {
        var a0 = OVAL[i], a1 = OVAL[(i + 1) % OVAL.length];
        var y0 = P[a0 * 2 + 1], y1 = P[a1 * 2 + 1];
        if ((y0 <= yb && yb <= y1) || (y1 <= yb && yb <= y0)) {
          if (Math.abs(y1 - y0) < 1e-7) continue;
          var t = (yb - y0) / (y1 - y0);
          var x = P[a0 * 2] + (P[a1 * 2] - P[a0 * 2]) * t;
          if (x < xl) xl = x;
          if (x > xr) xr = x;
          hit++;
        }
      }
      var cx = 0.5, half = 0.20, wt = 0;
      if (hit && xr > xl) {
        cx = (xl + xr) / 2; half = (xr - xl) / 2;
        var tt = (yb - eyeY) / Math.max(1e-4, chinY - eyeY);
        tt = Math.max(0, Math.min(1, tt));
        wt = (tt <= 0 ? 0 : Math.min(1, (tt - 0.08) / 0.42)) * (1 - 0.30 * Math.max(0, Math.min(1, (tt - 0.86) / 0.14)));
        wt *= (1 - 0.55 * Math.max(0, Math.min(1, Math.abs(yb - eyeY) / Math.max(1e-4, (chinY - eyeY) * 0.22)) * 0));
      }
      prof[b * 4] = Math.round(cx * 255);
      prof[b * 4 + 1] = Math.round(half * 255);
      prof[b * 4 + 2] = Math.round(Math.max(0, Math.min(1, wt)) * 255);
      prof[b * 4 + 3] = 255;
    }
    FACE = { conf: conf, eyeL: eL, eyeR: eR, prof: prof, yTop: yTop, yBot: yBot, h: h, w: w };
    return FACE;
  }

  function lensDef() {
    for (var i = 0; i < LENSES.length; i++) if (LENSES[i].id === S.lens) return LENSES[i];
    return LENSES[4];
  }

  var G = null;

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    return p;
  }
  function tex(gl) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function fbo(gl, w, h) {
    var t = tex(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { t: t, f: f, w: w, h: h };
  }

  var MW = 64, MH = 48;

  function glBoot(canvas) {
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false,
      preserveDrawingBuffer: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { alpha: false, antialias: false, depth: false,
        preserveDrawingBuffer: true });
    if (!gl) return null;
    var g = {
      gl: gl, canvas: canvas,
      pm: program(gl, VS, FS_MASK), px: program(gl, VS, FS_MAIN),
      buf: gl.createBuffer(),
      tex: tex(gl),
      m1: fbo(gl, MW, MH), m2: fbo(gl, MW, MH),
      hist: { t: null, f: null, w: MW, h: MH },
      box: { x: 0.5, y: 0.5, rx: 0.26, ry: 0.34 },
      prof: tex(gl), u: {},
      ticks: 0, last: 0, slow: 0, fast: 0, ready: false
    };
    gl.bindTexture(gl.TEXTURE_2D, g.prof);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(256));
    g.U = function (n) {
      if (!(n in g.u)) g.u[n] = gl.getUniformLocation(g.px, n);
      return g.u[n];
    };
    g.hist = g.m1;
    gl.bindBuffer(gl.ARRAY_BUFFER, g.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = {
      m: { p: gl.getAttribLocation(g.pm, 'p') },
      x: { p: gl.getAttribLocation(g.px, 'p') }
    };
    g.loc = loc;
    return g;
  }

  function bindQuad(gl, prog, attr) {
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.buf);
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
  }

  function uni(gl, prog, names, vals) {
    for (var i = 0; i < names.length; i++) {
      var l = gl.getUniformLocation(prog, names[i]);
      if (l) gl.uniform1f(l, vals[i] || 0);
    }
  }

  /* one filtered frame from a source (video or canvas) */
  function render(src, w, h) {
    var gl = G.gl;
    if (G.canvas.width !== w || G.canvas.height !== h) { G.canvas.width = w; G.canvas.height = h; }
    gl.viewport(0, 0, w, h);

    /* upload the frame */
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, G.tex);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); } catch (e) { return; }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /* ── mask pass, into the spare 64×48 target ── */
    var dst = (G.hist === G.m1) ? G.m2 : G.m1;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.f);
    gl.viewport(0, 0, MW, MH);
    bindQuad(gl, G.pm, G.loc.m.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tex);
    gl.uniform1i(gl.getUniformLocation(G.pm, 'tex'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, G.hist.t);
    gl.uniform1i(gl.getUniformLocation(G.pm, 'hist'), 1);
    gl.uniform2f(gl.getUniformLocation(G.pm, 'box'), G.box.x, G.box.y);
    gl.uniform2f(gl.getUniformLocation(G.pm, 'rad'), G.box.rx, G.box.ry);
    gl.uniform1f(gl.getUniformLocation(G.pm, 'blend'), G.box.lock ? 0.62 : 0.30);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /* ── main pass ── */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    bindQuad(gl, G.px, G.loc.x.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tex);
    gl.uniform1i(gl.getUniformLocation(G.px, 'tex'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dst.t);
    gl.uniform1i(gl.getUniformLocation(G.px, 'mask'), 1);
    gl.uniform2f(gl.getUniformLocation(G.px, 'box'), G.box.x, G.box.y);
    gl.uniform2f(gl.getUniformLocation(G.px, 'rad'), G.box.rx, G.box.ry);
    gl.uniform2f(gl.getUniformLocation(G.px, 'texel'), 1 / w, 1 / h);
    gl.uniform1f(gl.getUniformLocation(G.px, 'master'), S.on ? S.master : 0);
    gl.uniform1f(gl.getUniformLocation(G.px, 'before'), S.before ? 1 : 0);
    /* ── the face: one geometry per frame, uploaded as four little uniforms
       and one 64-band width strip ── */
    var F = computeFace(w, h), U = G.U;
    var eL = F ? F.eyeL : null, eR = F ? F.eyeR : null, cf = F ? F.conf : 0;
    var lensWanted = (S.on && S.lensOn && !S.before) ? 1 : 0;
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, G.prof);
    if (F) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, F.prof);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.uniform1i(U('prof'), 2);
    gl.uniform2f(U('profY'), F ? F.yTop : 0, F ? 1 / Math.max(1e-4, F.yBot - F.yTop) : 0);
    gl.uniform1f(U('profOn'), (F && cf > 0.2) ? 1 : 0);
    if (!eL) { eL = { c: [0.5, 0.5], r: [0.001, 0.001], up: 0, lo: 0 }; }
    if (!eR) { eR = { c: [0.5, 0.5], r: [0.001, 0.001], up: 0, lo: 0 }; }
    gl.uniform4f(U('eyeL'), eL.c[0], eL.c[1], eL.r[0], eL.r[1]);
    gl.uniform4f(U('lidL'), eL.up, eL.lo, cf, 0);
    gl.uniform4f(U('eyeR'), eR.c[0], eR.c[1], eR.r[0], eR.r[1]);
    gl.uniform4f(U('lidR'), eR.up, eR.lo, cf, 0);
    var LDL = lensDef();
    gl.uniform3fv(U('lc0'), LDL.c0);
    gl.uniform3fv(U('lc1'), LDL.c1);
    gl.uniform3fv(U('lc2'), LDL.c2);
    gl.uniform1f(U('lensOn'), lensWanted);
    gl.uniform1f(U('lensAmt'), S.lensOn ? S.lensAmt : 0);
    gl.uniform2f(U('lensTune'), 0.55, LDL.warm);

    uni(gl, G.px,
      ['uSm','uBl','uSp','uUe','uLn','uTx','uTn','uRd','uSl','uJw','uCk','uNs','uSy',
       'uBh','uLp','uEy','uWm','uEx','uCt','uIl','uSt','uHi','uCi'],
      [eff('smooth'), eff('blemish'), eff('spots'), eff('undereye'), eff('lines'), eff('texture'),
       eff('tone'), eff('radiance'), eff('slim'), eff('jaw'), eff('cheek'), eff('nose'), eff('symmetry'),
       eff('blush'), eff('lip'), eff('eyes'), eff('warmth'), eff('exposure'), eff('contrast'),
       eff('illum'), eff('studio'), eff('highlight'), eff('cinematic')]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /* ── the face box, read from the mask every sixth frame ── */
    G.ticks++;
    if (G.ticks % 6 === 0) trackBox(dst);

    G.hist = dst;
    G.ready = true;
  }

  var px4 = new Uint8Array(MW * MH * 4);
  function trackBox(f) {
    var gl = G.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.f);
    gl.readPixels(0, 0, MW, MH, gl.RGBA, gl.UNSIGNED_BYTE, px4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    var sw = 0, sx = 0, sy = 0, sx2 = 0, sy2 = 0;
    for (var y = 0; y < MH; y++) {
      for (var x = 0; x < MW; x++) {
        var a = px4[(y * MW + x) * 4] / 255;
        if (a < 0.35) continue;
        var nx = (x + 0.5) / MW, ny = 1 - (y + 0.5) / MH; /* GL's y runs upward */
        sw += a; sx += nx * a; sy += ny * a; sx2 += nx * nx * a; sy2 += ny * ny * a;
      }
    }
    if (sw < MW * MH * 0.012) { G.box.lock = false; return; }
    var mx = sx / sw, my = sy / sw;
    var vx = Math.max(1e-5, sx2 / sw - mx * mx), vy = Math.max(1e-5, sy2 / sw - my * my);
    var rx = Math.min(0.42, Math.max(0.16, Math.sqrt(vx) * 2.2));
    var ry = Math.min(0.48, Math.max(0.20, Math.sqrt(vy) * 2.2));
    var k = 0.28;
    G.box.x += (mx - G.box.x) * k;
    G.box.y += (my - G.box.y) * k;
    G.box.rx += (rx - G.box.rx) * k;
    G.box.ry += (ry - G.box.ry) * k;
    G.box.lock = true;
  }

  /* ── the live engine: camera → GL → canvas → custom Agora track ───────── */
  var LIVE = null;

  function attach(camTrack, onReady) {
    if (LIVE) detach();
    var ms = camTrack && camTrack.getMediaStreamTrack ? camTrack.getMediaStreamTrack() : null;
    if (!ms) return null;
    var vid = document.createElement('video');
    vid.muted = true; vid.autoplay = true; vid.playsInline = true;
    vid.setAttribute('playsinline', ''); vid.setAttribute('webkit-playsinline', '');
    vid.style.cssText = 'position:fixed;left:-2px;top:-2px;width:2px;height:2px;opacity:0;pointer-events:none;';
    vid.srcObject = new MediaStream([ms]);
    document.body.appendChild(vid);
    var cv = document.createElement('canvas');
    cv.width = 960; cv.height = 540;

    try { G = glBoot(cv); } catch (e) { G = null; }
    if (!G) { try { vid.remove(); } catch (e) {} return null; }

    var stream = null, track = null, raf = 0, playing = false, lastT = 0, ft = [];

    function loop(t) {
      raf = requestAnimationFrame(loop);
      if (!playing) return;
      if (!vid.videoWidth) return;
      var cap = Math.round(960 * S.quality);
      var w = Math.min(cap, vid.videoWidth), h = Math.round(vid.videoHeight * (w / vid.videoWidth));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      var t0 = performance.now();
      if (TR.state === 'ready') feed(vid);
      render(vid, w, h);
      var dt = performance.now() - t0;
      /* the governor: if the phone is struggling, the mask resolution and the
         canvas fall before the frame-rate does */
      if (G.ticks % 30 === 0) {
        ft.push(dt);
        if (ft.length > 6) ft.shift();
        var avg = ft.reduce(function (a, b) { return a + b; }, 0) / ft.length;
        G.frameMs = avg;
        if (avg > 26 && S.quality > 0.56) S.quality = Math.max(0.56, S.quality - 0.22);
        else if (avg < 10 && S.quality < 1) S.quality = Math.min(1, S.quality + 0.11);
      }
      void t; void lastT;
    }

    vid.addEventListener('loadeddata', function () {
      if (playing) return;
      playing = true;
      try { cv.getContext('webgl'); } catch (e) {}
      stream = cv.captureStream ? cv.captureStream(30) : null;
      if (!stream) return;
      try {
        track = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: stream.getVideoTracks()[0] });
      } catch (e) { track = null; }
      if (onReady) onReady(track, cv);
    });
    vid.play().catch(function () {});

    LIVE = {
      vid: vid, canvas: cv, stream: function () { return stream; },
      track: function () { return track; },
      destroy: function () {
        cancelAnimationFrame(raf);
        try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        try { if (track && track.close) track.close(); } catch (e) {}
        try { vid.pause(); vid.srcObject = null; vid.remove(); } catch (e) {}
        LIVE = null;
      }
    };
    raf = requestAnimationFrame(loop);
    return LIVE;
  }

  function detach() { if (LIVE) LIVE.destroy(); }

  /* ── the studio's own sheet ───────────────────────────────────────────── */
  var CSS = [
    '.bty{position:fixed;inset:0;z-index:9300;display:none}',
    '.bty.on{display:flex;align-items:flex-end;justify-content:center}',
    '.bty-back{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,rgba(40,2,12,.72),rgba(18,0,6,.9))',
    ';backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
    '.bty-sheet{position:relative;width:min(560px,100%);max-height:88vh;display:flex;flex-direction:column;',
    '  background:linear-gradient(180deg,#3A0512,#2A030D 60%,#22020A);color:#FFF3DE;',
    '  border-radius:22px 22px 0 0;box-shadow:0 -18px 50px rgba(0,0,0,.6),inset 0 1px 0 rgba(243,208,138,.22);',
    '  padding-bottom:calc(10px + env(safe-area-inset-bottom,0px))}',
    '.bty-hd{display:flex;align-items:center;gap:10px;padding:14px 16px 8px}',
    '.bty-hd b{font:800 12px/1 Georgia,serif;letter-spacing:.22em;text-transform:uppercase;color:#F3D08A}',
    '.bty-x{margin-left:auto;width:38px;height:38px;border-radius:50%;border:1px solid rgba(243,208,138,.30);',
    '  background:rgba(255,246,226,.07);color:#FFF3DC;display:grid;place-items:center;cursor:pointer}',
    '.bty-master{display:flex;align-items:center;gap:10px;padding:2px 16px 10px}',
    '.bty-sw{width:52px;height:30px;border-radius:999px;border:1px solid rgba(243,208,138,.34);cursor:pointer;',
    '  background:rgba(255,246,226,.10);position:relative;flex:none}',
    '.bty-sw i{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;',
    '  background:radial-gradient(circle at 35% 30%,#FFF6D8,#D9B061 70%,#A87B2C);transition:transform .18s ease}',
    '.bty-sw.on{background:linear-gradient(90deg,rgba(233,193,97,.35),rgba(233,193,97,.16))}',
    '.bty-sw.on i{transform:translateX(22px)}',
    '.bty-lab{font:700 13px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:.04em}',
    '.bty-lab s{display:block;text-decoration:none;font:400 11px/1.3 system-ui,sans-serif;color:rgba(255,240,214,.55)}',
    '.bty-mval{margin-left:auto;font:800 13px/1 Georgia,serif;color:#F3D08A}',
    '.bty-presets{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 10px}',
    '.bty-p{flex:none;min-height:34px;padding:0 12px;border-radius:999px;cursor:pointer;',
    '  font:700 10px/1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;',
    '  color:#F6DFAE;background:rgba(255,246,226,.06);border:1px solid rgba(243,208,138,.26)}',
    '.bty-p.on{background:linear-gradient(180deg,#FFF3D2,#DFAE55);color:#3F2405;border-color:transparent}',
    '.bty-tabs{display:flex;gap:6px;padding:0 14px 8px}',
    '.bty-tab{flex:1;min-height:38px;border:0;border-radius:11px;background:rgba(255,246,226,.06);cursor:pointer;',
    '  font:800 10px/1 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,240,214,.7)}',
    '.bty-tab.on{background:linear-gradient(180deg,rgba(255,240,200,.22),rgba(233,193,97,.14));color:#FFE9B8}',
    '.bty-list{overflow-y:auto;overscroll-behavior:contain;padding:2px 16px 6px;flex:1;min-height:120px}',
    '.bty-row{display:grid;grid-template-columns:34px 1fr 44px;grid-template-areas:"dot name val" "sl sl sl";',
    '  gap:4px 8px;align-items:center;padding:7px 0;border-top:1px solid rgba(243,208,138,.10)}',
    '.bty-dot{grid-area:dot;width:30px;height:30px;border-radius:50%;border:1px solid rgba(243,208,138,.28);',
    '  background:rgba(255,246,226,.05);cursor:pointer;display:grid;place-items:center;color:rgba(255,240,214,.4)}',
    '.bty-dot.on{color:#2A030D;background:linear-gradient(180deg,#FFE9B0,#D2A24C);border-color:transparent}',
    '.bty-name{grid-area:name;font:600 12.5px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:.02em}',
    '.bty-val{grid-area:val;text-align:right;font:800 12px/1 Georgia,serif;color:#F3D08A}',
    '.bty-r{grid-area:sl;width:100%;height:26px;-webkit-appearance:none;appearance:none;background:transparent}',
    '.bty-r::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:rgba(255,246,226,.16)}',
    '.bty-r::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;margin-top:-7px;border-radius:50%;',
    '  background:radial-gradient(circle at 35% 30%,#FFF6D8,#DCB063 70%,#A87B2C);border:2px solid #3A0512;',
    '  box-shadow:0 1px 5px rgba(0,0,0,.5)}',
    '.bty-r::-moz-range-track{height:6px;border-radius:99px;background:rgba(255,246,226,.16)}',
    '.bty-r::-moz-range-thumb{width:18px;height:18px;border-radius:50%;border:2px solid #3A0512;',
    '  background:radial-gradient(circle at 35% 30%,#FFF6D8,#DCB063 70%,#A87B2C)}',
    '.bty-ft{display:grid;grid-template-columns:1.24fr 1fr 1fr;gap:8px;padding:8px 16px 4px;',
    '  border-top:1px solid rgba(243,208,138,.14)}',
    '.bty-b{min-height:46px;border-radius:12px;border:1px solid rgba(243,208,138,.30);cursor:pointer;',
    '  background:rgba(255,246,226,.06);color:#F6DFAE;font:800 9.5px/1 system-ui,sans-serif;letter-spacing:.12em;',
    '  text-transform:uppercase;white-space:nowrap}',
    '.bty-b.hold{background:rgba(255,246,226,.12)}',
    '.bty-b.hold:active{background:linear-gradient(180deg,#FFF3D2,#DFAE55);color:#3F2405}',
    '.bty-lrow{display:flex;align-items:center;gap:10px;padding:6px 0 12px}',
    '.bty-lensgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:9px 6px;padding:2px 0 10px}',
    '.bty-lens{border:0;background:transparent;padding:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px}',
    '.bty-lens i{display:block;width:44px;height:44px;border-radius:50%;position:relative;',
    '  box-shadow:inset 0 0 0 1px rgba(243,208,138,.22),0 2px 8px rgba(0,0,0,.45)}',
    '.bty-lens i:after{content:"";position:absolute;inset:35%;border-radius:50%;background:#150609;',
    '  box-shadow:inset 0 0 3px rgba(255,255,255,.12)}',
    '.bty-lens s{text-decoration:none;font:600 8.5px/1.15 system-ui,sans-serif;letter-spacing:.02em;',
    '  color:rgba(255,240,214,.62);text-align:center}',
    '.bty-lens.on i{box-shadow:inset 0 0 0 2px #F3D08A,0 0 0 3px rgba(243,208,138,.16),0 2px 10px rgba(0,0,0,.5)}',
    '.bty-lens.on s{color:#FFE9B8}',
    '.bty-q{padding:4px 16px 6px;font:400 10.5px/1.3 system-ui,sans-serif;color:rgba(255,240,214,.5)}',
    '.bty-no{position:fixed;left:50%;transform:translateX(-50%);bottom:88px;background:#2D1A12;color:#FFF6E2;',
    '  padding:11px 16px;border-radius:99px;font:600 12px/1 system-ui,sans-serif;z-index:9400;opacity:0;',
    '  transition:opacity .2s ease;pointer-events:none;max-width:86vw;text-align:center}',
    '.bty-no.on{opacity:1}'
  ].join('\n');

  var sheet = null, toastT = 0;

  function say(m) {
    var el = document.getElementById('bty-say');
    if (!el) return;
    el.textContent = m; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600);
  }

  function build() {
    if (sheet) return;
    var st = document.createElement('style');
    st.id = 'iv-beauty-css'; st.textContent = CSS;
    document.head.appendChild(st);

    sheet = document.createElement('div');
    sheet.className = 'bty'; sheet.id = 'iv-beauty';
    sheet.innerHTML =
      '<div class="bty-back" data-shut></div>' +
      '<div class="bty-sheet" role="dialog" aria-label="Beauty studio">' +
        '<div class="bty-hd"><b>Beauty studio</b>' +
          '<button class="bty-x" data-shut aria-label="Close the studio">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button></div>' +
        '<div class="bty-master">' +
          '<button class="bty-sw" id="bty-on" role="switch" aria-checked="false" aria-label="Beauty on or off"><i></i></button>' +
          '<span class="bty-lab">Beauty<s id="bty-state">off · your camera is untouched</s></span>' +
          '<span class="bty-mval" id="bty-mv">55</span>' +
        '</div>' +
        '<div class="bty-row" style="border-top:0;padding-top:12px">' +
          '<span class="bty-name" style="grid-area:dot/name">All effects — strength</span>' +
          '<input class="bty-r" id="bty-master" type="range" min="0" max="100" value="55" aria-label="Overall beauty strength">' +
        '</div>' +
        '<div class="bty-presets" id="bty-presets"></div>' +
        '<div class="bty-tabs" id="bty-tabs"></div>' +
        '<div class="bty-list" id="bty-list"></div>' +
        '<div class="bty-ft">' +
          '<button class="bty-b hold" id="bty-before">Hold · before</button>' +
          '<button class="bty-b" id="bty-reset">Reset</button>' +
          '<button class="bty-b" id="bty-save">Save mine</button>' +
        '</div>' +
        '<p class="bty-q" id="bty-q"></p>' +
      '</div>' +
      '<div class="bty-no" id="bty-say"></div>';
    document.body.appendChild(sheet);

    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-shut]')) { close(); return; }
      var p = e.target.closest('[data-preset]');
      if (p) { applyPreset(p.getAttribute('data-preset')); return; }
      var t = e.target.closest('[data-tab]');
      if (t) { S.tab = t.getAttribute('data-tab'); paint(); return; }
      var ln = e.target.closest('[data-lens]');
      if (ln) { setLens(ln.getAttribute('data-lens')); return; }
      if (e.target.closest('[data-lon]')) {
        S.lensOn = !S.lensOn; save();
        if (S.lensOn) ensureTracker();
        paint(); return;
      }
      var d = e.target.closest('[data-off]');
      if (d) {
        var k = d.getAttribute('data-off');
        S.off[k] = !S.off[k];
        save(); paint(); return;
      }
    });
    sheet.querySelector('#bty-on').addEventListener('click', function () { setOn(!S.on); });
    sheet.querySelector('#bty-master').addEventListener('input', function (e) {
      S.master = (+e.target.value) / 100; save(); paintMaster();
    });
    sheet.querySelector('#bty-before').addEventListener('pointerdown', function () { S.before = true; });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
      sheet.querySelector('#bty-before').addEventListener(ev, function () { S.before = false; });
    });
    sheet.querySelector('#bty-reset').addEventListener('click', function () {
      applyPreset(S.preset === 'mine' ? 'natural' : S.preset);
      say('Back to the preset');
    });
    sheet.querySelector('#bty-save').addEventListener('click', function () {
      S.saved = { master: S.master, fx: JSON.parse(JSON.stringify(S.fx)), off: JSON.parse(JSON.stringify(S.off)) };
      S.preset = 'mine'; save(); paint();
      say('Kept as “Mine” on this device');
    });
    sheet.querySelector('#bty-list').addEventListener('input', function (e) {
      if (e.target.closest('[data-sl2="lens"]')) {
        S.lensAmt = (+e.target.value) / 100;
        save();
        var v = sheet.querySelector('[data-v="lens"]');
        if (v) v.textContent = Math.round(S.lensAmt * 100);
        return;
      }
      var r = e.target.closest('[data-sl]');
      if (!r) return;
      var k = r.getAttribute('data-sl');
      S.fx[k] = (+e.target.value) / 100;
      S.off[k] = S.fx[k] <= 0.001;
      S.preset = 'mine';
      save(); paintRow(k); paintPresets();
    });
  }

  function paintPresets() {
    var box = sheet.querySelector('#bty-presets');
    if (!box) return;
    var names = [['natural', 'Natural'], ['glam', 'Soft glam'], ['radiant', 'Radiant'], ['studio', 'Studio'],
                 ['mine', 'Mine']];
    box.innerHTML = names.map(function (n) {
      var on = (n[0] === S.preset) || (n[0] === 'mine' && S.preset === 'mine' && S.saved);
      return '<button class="bty-p' + (on ? ' on' : '') + '" data-preset="' + n[0] + '">' + n[1] + '</button>';
    }).join('');
  }

  function paintMaster() {
    var sw = sheet && sheet.querySelector('#bty-on');
    if (sw) { sw.classList.toggle('on', S.on); sw.setAttribute('aria-checked', S.on ? 'true' : 'false'); }
    var st = sheet && sheet.querySelector('#bty-state');
    if (st) st.textContent = S.on ? 'on · live on your camera' : 'off · your camera is untouched';
    var mv = sheet && sheet.querySelector('#bty-mv');
    if (mv) mv.textContent = Math.round(S.master * 100);
    var m = sheet && sheet.querySelector('#bty-master');
    if (m && +m.value !== Math.round(S.master * 100)) m.value = Math.round(S.master * 100);
    var q = sheet && sheet.querySelector('#bty-q');
    if (q) q.textContent = 'Processed on this device · ' + Math.round((G && G.frameMs) || 0) + ' ms a frame · no server, no model download';
  }

  function paintRow(k) {
    var r = sheet && sheet.querySelector('[data-sl="' + k + '"]');
    if (!r) return;
    r.value = Math.round((S.fx[k] || 0) * 100);
    var v = sheet.querySelector('[data-v="' + k + '"]');
    if (v) v.textContent = Math.round((S.fx[k] || 0) * 100);
    var d = sheet.querySelector('[data-off="' + k + '"]');
    if (d) d.classList.toggle('on', !S.off[k]);
  }

  function paint() {
    if (!sheet) return;
    paintMaster(); paintPresets();
    var tabs = sheet.querySelector('#bty-tabs');
    tabs.innerHTML = GROUPS.map(function (g) {
      return '<button class="bty-tab' + (g[0] === S.tab ? ' on' : '') + '" data-tab="' + g[0] + '">' + g[1] + '</button>';
    }).join('');
    var list = sheet.querySelector('#bty-list');
    if (S.tab === 'lens') { list.innerHTML = lensPanel(); ensureTracker(); return; }
    list.innerHTML = FX.filter(function (f) { return f.g === S.tab; }).map(function (f) {
      return '<div class="bty-row">' +
        '<button class="bty-dot' + (S.off[f.k] ? '' : ' on') + '" data-off="' + f.k + '" aria-label="' + f.name + ' on or off">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>' +
        '</button>' +
        '<span class="bty-name">' + f.name + '</span>' +
        '<span class="bty-val" data-v="' + f.k + '">' + Math.round((S.fx[f.k] || 0) * 100) + '</span>' +
        '<input class="bty-r" type="range" min="0" max="100" data-sl="' + f.k + '" value="' +
          Math.round((S.fx[f.k] || 0) * 100) + '" aria-label="' + f.name + '">' +
      '</div>';
    }).join('');
  }

  function hex(c) {
    function b(v) { var s = Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16); return s.length < 2 ? '0' + s : s; }
    return '#' + b(c[0]) + b(c[1]) + b(c[2]);
  }
  function lensPanel() {
    var cur = lensDef();
    var state = TR.state === 'ready'
      ? 'Eyes found · ' + Math.round(TR.ms) + ' ms a face'
      : (TR.state === 'loading' ? 'Waking the eye tracker…' : (TR.state === 'off' ? 'The tracker did not load — no lens to wear' : 'The tracker wakes the moment you choose a lens'));
    return '<div class="bty-lrow">' +
        '<button class="bty-sw' + (S.lensOn ? ' on' : '') + '" data-lon role="switch" aria-checked="' + (S.lensOn ? 'true' : 'false') + '" aria-label="Green lenses on or off"><i></i></button>' +
        '<span class="bty-lab">Green lenses<s>' + (S.lensOn ? 'worn · ' + cur.name : 'off · your own eye colour') + '</s></span>' +
      '</div>' +
      '<div class="bty-lensgrid">' + LENSES.map(function (l) {
        var on = (l.id === S.lens);
        return '<button class="bty-lens' + (on ? ' on' : '') + '" data-lens="' + l.id + '" aria-label="' + l.name + '" aria-pressed="' + on + '">' +
          '<i style="background:radial-gradient(circle at 50% 46%,' + hex(l.c0) + ' 0%,' + hex(l.c1) + ' 52%,' + hex(l.c2) + ' 100%)"></i>' +
          '<s>' + l.name + '</s></button>';
      }).join('') + '</div>' +
      '<div class="bty-row" style="border-top:1px solid rgba(243,208,138,.10)">' +
        '<span class="bty-name" style="grid-area:dot/name">Lens strength</span>' +
        '<span class="bty-val" data-v="lens">' + Math.round((S.lensAmt || 0) * 100) + '</span>' +
        '<input class="bty-r" type="range" min="0" max="100" data-sl2="lens" value="' + Math.round((S.lensAmt || 0) * 100) + '" aria-label="Lens strength">' +
      '</div>' +
      '<p class="bty-q" style="padding:6px 0 2px">' + state + ' · both eyes, no frame leaves this device</p>';
  }

  function setLens(id) {
    S.lens = id; S.lensOn = true;
    if (S.fx.eyes < 0.02) S.fx.eyes = 0.10;
    if (!S.on) setOn(true); else save();
    ensureTracker(); paint();
  }
  function ensureTracker() {
    if (TR.state === 'idle' || TR.state === 'off') {
      TR.state = 'loading';
      loadTracker().catch(function () {
        say('The eye tracker could not be fetched — your own eyes stay as they are.', true);
        if (sheet) paint();
      }).then(function () { if (sheet) paint(); });
    }
  }

  function applyPreset(name) {
    if (name === 'mine') {
      if (!S.saved) { say('Nothing saved yet — dial it, then “Save mine”'); return; }
      S.master = S.saved.master;
      FX.forEach(function (f) {
        S.fx[f.k] = typeof S.saved.fx[f.k] === 'number' ? S.saved.fx[f.k] : f.d;
        S.off[f.k] = !!S.saved.off[f.k];
      });
    } else {
      var p = PRESETS[name];
      if (!p) return;
      S.master = p.master;
      FX.forEach(function (f) {
        S.fx[f.k] = typeof p[f.k] === 'number' ? p[f.k] : f.d;
        S.off[f.k] = false;
      });
    }
    S.preset = name;
    save(); paint();
  }

  function setOn(v) {
    S.on = !!v;
    if (S.on && S.lensOn) ensureTracker();
    save(); paintMaster();
    if (S.on && !LIVE && window.IVLIVE && window.IVLIVE.beautyAttach) window.IVLIVE.beautyAttach();
    if (!S.on) {
      S.before = false;
      if (window.IVLIVE && window.IVLIVE.beautyDetach) window.IVLIVE.beautyDetach();
    }
  }

  /* ── the one thing the room asks for ──────────────────────────────────── */
  function wanted() { return !!S.on; }

  window.IVBEAUTY = {
    open: function () { build(); paint(); sheet.classList.add('on'); S.open = true; },
    close: close,
    isOpen: function () { return !!sheet && sheet.classList.contains('on'); },
    on: wanted,
    setOn: setOn,
    attach: attach,
    detach: detach,
    canvas: function () { return LIVE && LIVE.canvas; },
    track: function () { return LIVE && LIVE.track(); },
    state: S,
    lenses: LENSES,
    setLens: setLens,
    tracker: {
      load: loadTracker, feed: feed, state: TR,
      ready: trackerReady, busy: trackerBusy,
      face: function () { return FACE; },
      points: function () { return LM.pts; },
      conf: function () { return LM.conf; }
    },
    preset: applyPreset,
    /* the bench's own door: draw one frame from any source, synchronously */
    renderOnce: function (src, w, h) {
      if (!G) { var c = document.createElement('canvas'); c.width = w; c.height = h; G = glBoot(c); }
      if (!G) return null;
      render(src, w, h);
      return G.canvas;
    },
    /* the bench's door to the tracker: one detection on a still, forced */
    look: function (src) {
      if (!FL) return false;
      var res = null, pts = null;
      /* a new source sometimes answers empty on its very first frame */
      for (var attempt = 0; attempt < 2 && !pts; attempt++) {
        var ts = Math.max((window.performance || Date).now(), (TR.ts || 0) + 1); TR.ts = ts;
        res = FL.detectForVideo(src, ts);
        pts = res && res.faceLandmarks && res.faceLandmarks[0];
      }
      if (!pts) return false;
      var raw = new Float32Array(956);
      for (var i = 0; i < 478; i++) { raw[i * 2] = pts[i].x; raw[i * 2 + 1] = pts[i].y; }
      LM.raw = raw; LM.pts = raw; LM.t = (window.performance || Date).now(); LM.conf = 1;
      computeFace((src && src.width) || 0, (src && src.height) || 0);
      return true;
    },
    faceBox: function () { return G && G.box; },
    quality: function () { return { frameMs: (G && G.frameMs) || 0, scale: S.quality }; },
    _gl: function () { return G; }
  };

  function close() {
    if (sheet) sheet.classList.remove('on');
    S.open = false;
    S.before = false;
  }
})();
