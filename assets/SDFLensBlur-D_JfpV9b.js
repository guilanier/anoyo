import{u as B,e as H,P as j,O as V,b as Y,C as Z,W as $,f as A,g as K,B as Q,V as t,h as q,R as W,M as F,E as X,d as z,c as J,i as ee,j as ne}from"./useWindowPointer-BKAoNcUq.js";import{i as te}from"./is-tablet-BNbJoBUp.js";import{r as oe,b as k,s as N,v as P,e as T,q as se,B as re,o as G,c as I,a as ie,g as ae,F as le,x as ce,d as L,j as M,k as de,u as ue}from"./index-CzauofU5.js";import{u as O}from"./useDamp-CBzOTnJn.js";const C=[],R=oe({width:0,height:0,aspect:1});let D=!1;const U=e=>{R.width=window.innerWidth,R.height=window.innerHeight,C.forEach(a=>a(R))},fe=()=>{window.addEventListener("resize",U)},pe=()=>{window.removeEventListener("resize",U)},ve=()=>{D||(R.width=window.innerWidth,R.height=window.innerHeight,R.aspect=R.width/R.height,fe(),D=!0)},me=()=>{pe()};function we(e=()=>{},a){return k(()=>{ve(),C.push(e),a&&e(R)}),N(()=>{C.splice(C.indexOf(e)>>>0,1),C.length||me()}),R}const he=(e,a,c,u,d)=>{const w=-u*(e-a),s=-d*c;return w+s},xe=(e,a={},c=[])=>{const u={properties:{},config:{stiffness:100,damping:10,mass:1,...a}},d=r=>{u.properties[r]={current:e[r],velocity:0,to:e[r]}},w=c.length?{...c}:e;if(c.length)for(let r=0;r<c.length;r++){const n=c[r];d(n)}else for(const r in w)Object.hasOwnProperty.call(e,r)&&d(r);const{stiffness:s,damping:y,mass:p}=u.config,f=({delta:r})=>{for(const n in u.properties){const i=u.properties[n],{current:x,to:o,velocity:l}=i,g=he(x,o,l,s,y),E=r/1e3;i.velocity+=g*E/p,i.current+=i.velocity*E,Math.abs(o-x)<1e-4&&(i.current=i.to),e[n]=i.current}},{stop:v,start:m,isActive:h}=B(f),_=(r,n=!1)=>{for(const i in r)Object.hasOwnProperty.call(u.properties,i)&&(u.properties[i].to=r[i],n&&(u.properties[i].current=r[i]))},b=()=>h.value?v():m(),S=()=>document.visibilityState==="visible"?m():v();return k(()=>{m(),document.addEventListener("visibilitychange",S)}),N(()=>{v(),document.removeEventListener("visibilitychange",S)}),{start:m,stop:v,toggle:b,set:_}},Re=()=>{const e=new H;return P("scene",e),P("addTo",e),e},_e={__name:"Renderer",props:{autoRender:{default:!0},autoResize:{default:!1},antialias:{default:!1},stencil:{default:!1}},emits:["setupComplete"],setup(e,{expose:a,emit:c}){function u(o,l,g){return Math.min(g,Math.max(l,o))}const d=e,w=T(null);let s;const y=Re(),p=new j(45,1,d.near,d.far),f=new V(-1,1,1,-1,.1,100),v=new Z;v.start(),p.position.z=f.position.z=5,f.layers.set(1);const m=[],h=(o,l=1/0)=>{m.push({fn:o,index:l}),m.sort((g,E)=>g.index-E.index)},_=o=>{const l=m.find(g=>g.fn===o);m.splice(l,1)},b=({width:o,height:l})=>{const g=u(window.devicePixelRatio,1,2);s.setSize(o,l),s.setPixelRatio(g),p.aspect=o/l,p.updateProjectionMatrix(),f.left=-o/2,f.right=o/2,f.top=l/2,f.bottom=-l/2,f.updateProjectionMatrix()},S={scene:y,camera:p,orthoCamera:f,clock:v,registerRenderFn:h,unregisterRenderFn:_,resize:b};P("renderer",S);const r=()=>{s=new $({antialias:d.antialias,stencil:d.stencil}),s.autoClear=!1,s.setClearAlpha(0),S.renderer=s,x("setupComplete",{renderer:s})},n=()=>{s&&m.forEach(o=>{var l;(l=o.fn)==null||l.call(o,{renderer:s,camera:p})})};B(()=>{d.autoRender&&n()}),d.autoResize&&Y(b,!0),se(()=>{r()}),k(()=>{w.value.appendChild(s.domElement),window.camera=p}),re(()=>{w.value.removeChild(s.domElement),s.dispose()});const x=c;return a({resize:b}),(o,l)=>(G(),I(le,null,[ie("div",{ref_key:"glContainer",ref:w,class:"gl"},null,512),ae(o.$slots,"default")],64))}},ge=_e;function ye(e,a,c){return Math.min(c,Math.max(a,e))}new A(1,1);new K(1,32,32);new Q(1,1,1);const be=`
	varying vec2 vUv;
	void main() {
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_Position = projectionMatrix * mvPosition;
	}
`;new t;new z;new t(0,1,0);new t;new q;new W;new z;new t;new z;new z;new t;new t;new F;new t;new t;new W;new t;new t;new t(1,0,0),new t(0,1,0),new t(0,0,1);new X;new t(0,1,0);new t(0,0,0);new F;new t;new F;new t(1,0,0);new t(0,1,0);new t(0,0,1);new t;new t;new t;var Se=`#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_size;
uniform float u_blur;
uniform float u_stroke;
uniform float u_borderRadius;

#define uResolution u_resolution
#define uPointer u_mouse

vec2 coord(in vec2 p) {
	p = p / uResolution.xy;
	
	if (uResolution.x > uResolution.y) {
		p.x *= uResolution.x / uResolution.y;
		p.x += (uResolution.y - uResolution.x) / uResolution.y / 2.0;
	} else {
		p.y *= uResolution.y / uResolution.x;
		p.y += (uResolution.x - uResolution.y) / uResolution.x / 2.0;
	}
	
	p -= 0.5;
	p *= vec2(-1.0, 1.0);
	return p;
}
#define rx 1.0 / min(uResolution.x, uResolution.y)
#define uv0 gl_FragCoord.xy / uResolution.xy
#define st0 coord(gl_FragCoord.xy)
#define mx coord(uPointer)
float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

float aaedge(vec2 uv, float thresh) {
    vec2 st = abs((uv - 0.5) * 2.0);
    float border = aastep(0.5, smoothstep(1.0, thresh, length(st.x))) *
    aastep(0.5, smoothstep(1.0, thresh, length(st.y)));
    return border;
}

#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

/* Signed distance drawing methods */
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float fill(float x, float size) {
    return 1.0 - aastep(size, x);
}

float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w) {
    float d = aastep(size, x + w * 0.5) - aastep(size, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }

vec3 field(float d) {
	vec3 c1 = mix(WHITE, YELLOW, 0.4);
	vec3 c2 = mix(WHITE, AZUR, 0.7);
	vec3 c3 = mix(WHITE, ORANGE, 0.9);
	vec3 c4 = BLACK;
	
	float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
	float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
	float d2 = abs(stroke(d, 0.004));
	float f = clamp(d * 0.85, 0.0, 1.0);
	
	vec3 grd = mix(c1, c2, f);
	grd = mix(grd, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
	grd = mix(grd, c3, fill(d));
	grd = mix(grd, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
	
	return grd;
}
#ifndef FNC_RECTSDF
#define FNC_RECTSDF

float sdRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdRect(vec2 p, float b, float r) {
    return sdRect(p, vec2(b), r);
}

float sdRect(in vec2 st, in vec2 s) {
    st = st * 2.0 - 1.0;
    return max(abs(st.x / s.x),
    abs(st.y / s.y));
}

float sdRect(in vec2 st, in float s) {
    return sdRect(st, vec2(s));
}

float sdRect(in vec2 st) {
    return sdRect(st, vec2(1.0));
}

#endif
#ifndef FNC_SDFCIRCLE
#define FNC_SDFCIRCLE

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.;
}

float sdCircle(in vec2 st) {
    return sdCircle(st, vec2(.5));
}

#endif

void main() {
    
    vec2 st = st0 + 0.5;
    vec2 stPointer = st - mx;
    
    float blurSize = u_blur != 0.0 ? u_blur : 0.25;
    float blurShape = fill(sdCircle(stPointer), blurSize, blurSize * 2.0);
    
    float brd = mix(0.04, 0.0, u_stroke);
    float brdRad = u_borderRadius != 0.0 ? u_borderRadius : 0.02;
    float size = u_size != 0.0 ? u_size : 0.6;
    
    float sdShapeRectRnd = sdRect(st, 0.5, brdRad);
    float sdShape = sdShapeRectRnd;
    
    float sdfStro = stroke(sdShape, size, brd, blurShape) * 4.0;
    float sdfFill = fill(sdShape, size, blurShape) * 1.2;
    
    float sdf;
    sdf = mix(sdfStro, sdfFill, u_stroke);
    
    float shapeOut = sdf;
    float sd = clamp(shapeOut, 0.0, 1.0);
    
    vec3 color = vec3(0.0);
    color = vec3(sd);
    
    gl_FragColor = vec4(color, 1.0);
}`;const ze={__name:"index",setup(e){const{renderer:a,scene:c,orthoCamera:u}=ce("renderer"),d=new z,w=new z,s=T(0),y={pSizeBlur:.25},p={pStroke:0,pBorderRadius:.01},{set:f}=O(y,{lambda:6},["pSizeBlur"]),{set:v}=xe(p,{stiffness:90,damping:12,mass:1}),{set:m}=O(d,{lambda:12},["x","y"]);let h,_;const b=()=>{_=new ee({vertexShader:be,fragmentShader:Se,uniforms:{u_resolution:{value:w},u_mouse:{value:d},u_size:{value:te?.8:.6},u_blur:{value:.25},u_stroke:{value:0},u_borderRadius:{value:.01}},extensions:{derivatives:!0},transparent:!1}),h=new ne(new A(1,1),_),h.scale.set(window.innerWidth,window.innerHeight,1),h.layers.set(1),c.add(h)};we(n=>{const{width:i,height:x}=n,o=ye(window.devicePixelRatio,1,2);w.set(i,x).multiplyScalar(o),h==null||h.scale.set(i,x)},!0);const{isDown:S}=J(({x:n,y:i})=>{const x=a.getPixelRatio();m({x:n*x,y:w.y-i*x})});return L(S,n=>{f(n?{pSizeBlur:.5}:{pSizeBlur:.25}),n||(s.value=(s.value+1)%4)}),L(s,n=>{switch(n){case 0:v({pStroke:0,pBorderRadius:.01});break;case 1:v({pStroke:1,pBorderRadius:.5});break;case 2:v({pStroke:1,pBorderRadius:-.2});break;case 3:v({pStroke:0,pBorderRadius:.5});break}}),B(()=>{const n=_==null?void 0:_.uniforms;n&&(n.u_blur.value=y.pSizeBlur,n.u_stroke.value=p.pStroke,n.u_borderRadius.value=p.pBorderRadius),a.clear(),a.render(c,u)}),k(b),()=>{}}},Ce={class:"component"},Fe={__name:"SDFLensBlur",setup(e){return k(()=>document.body.style.overflow="hidden"),(a,c)=>(G(),I("div",Ce,[M(ue(ge),{ref:"refRenderer",antialias:!1,autoResize:!0,autoRender:!1},{default:de(()=>[M(ze)]),_:1},512)]))}};export{Fe as default};
