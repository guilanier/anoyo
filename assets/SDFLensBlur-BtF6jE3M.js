import{y as A,r as M}from"./index-DLHI8i1A.js";import{h as B,b as z,d as N,e as W,f as I}from"./useViewportResize-D9UB2WHs.js";import{i as T}from"./is-tablet-BNbJoBUp.js";import{r as H,b as w,A as F,y as G,j as U,d as E,c as j,p as C,q as V,u as Y,o as $}from"./index-DNfydORA.js";import{x as K}from"./useWindowPointer-DerI7Y0P.js";import{E as k}from"./useDamp-X2zm-HEj.js";import"./SmoothScrollGsap-C4mrJViF.js";const x=[],a=H({width:0,height:0,aspect:1});let L=!1;const O=()=>{a.width=window.innerWidth,a.height=window.innerHeight,x.forEach(t=>t(a))},Z=()=>{window.addEventListener("resize",O)},q=()=>{window.removeEventListener("resize",O)},Q=()=>{L||(a.width=window.innerWidth,a.height=window.innerHeight,a.aspect=a.width/a.height,Z(),L=!0)},J=()=>{q()};function X(t=()=>{},s){return w(()=>{Q(),x.push(t),t(a)}),F(()=>{x.splice(x.indexOf(t)>>>0,1),x.length||J()}),a}const ee=(t,s,r,i,u)=>{const f=-i*(t-s),p=-u*r;return f+p},ne=(t,s={},r=[])=>{const i={properties:{},config:{stiffness:100,damping:10,mass:1,...s}},u=o=>{i.properties[o]={current:t[o],velocity:0,to:t[o]}},f=r.length?{...r}:t;if(r.length)for(let o=0;o<r.length;o++){const e=r[o];u(e)}else for(const o in f)Object.hasOwnProperty.call(t,o)&&u(o);const{stiffness:p,damping:R,mass:h}=i.config,_=({delta:o})=>{for(const e in i.properties){const n=i.properties[e],{current:c,to:b,velocity:P}=n,D=ee(c,b,P,p,R),S=o/1e3;n.velocity+=D*S/h,n.current+=n.velocity*S,Math.abs(b-c)<1e-4&&(n.current=n.to),t[e]=n.current}},{stop:d,start:m,isActive:l}=B(_),v=(o,e=!1)=>{for(const n in o)Object.hasOwnProperty.call(i.properties,n)&&(i.properties[n].to=o[n],e&&(i.properties[n].current=o[n]))},y=()=>l.value?d():m(),g=()=>document.visibilityState==="visible"?m():d();return w(()=>{m(),document.addEventListener("visibilitychange",g)}),F(()=>{d(),document.removeEventListener("visibilitychange",g)}),{start:m,stop:d,toggle:y,set:v}};function te(t,s,r){return Math.min(r,Math.max(s,t))}var oe=`#ifdef GL_ES
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

#ifndef FNC_COORD
#define FNC_COORD
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
#endif

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
}`;const re={__name:"index",setup(t){const{renderer:s,scene:r,orthoCamera:i}=G("renderer"),u=new z,f=new z,p=U(0),R={pSizeBlur:.25},h={pStroke:0,pBorderRadius:.01},{set:_}=k(R,{lambda:6},["pSizeBlur"]),{set:d}=ne(h,{stiffness:90,damping:12,mass:1}),{set:m}=k(u,{lambda:12},["x","y"]);let l,v;const y=()=>{v=new N({vertexShader:A,fragmentShader:oe,uniforms:{u_resolution:{value:f},u_mouse:{value:u},u_size:{value:T?.8:.6},u_blur:{value:.25},u_stroke:{value:0},u_borderRadius:{value:.01}},extensions:{derivatives:!0},transparent:!1}),l=new W(new I(1,1),v),l.scale.set(window.innerWidth,window.innerHeight,1),l.layers.set(1),r.add(l)};X(e=>{const{width:n,height:c}=e,b=te(window.devicePixelRatio,1,2);f.set(n,c).multiplyScalar(b),l==null||l.scale.set(n,c)});const{isDown:g}=K(({x:e,y:n})=>{const c=s.getPixelRatio();m({x:e*c,y:f.y-n*c})});return E(g,e=>{_(e?{pSizeBlur:.5}:{pSizeBlur:.25}),e||(p.value=(p.value+1)%4)}),E(p,e=>{switch(e){case 0:d({pStroke:0,pBorderRadius:.01});break;case 1:d({pStroke:1,pBorderRadius:.5});break;case 2:d({pStroke:1,pBorderRadius:-.2});break;case 3:d({pStroke:0,pBorderRadius:.5});break}}),B(()=>{const e=v==null?void 0:v.uniforms;e&&(e.u_blur.value=R.pSizeBlur,e.u_stroke.value=h.pStroke,e.u_borderRadius.value=h.pBorderRadius),s.clear(),s.render(r,i)}),w(y),()=>{}}},se={class:"component"},pe={__name:"SDFLensBlur",setup(t){return w(()=>document.body.style.overflow="hidden"),(s,r)=>($(),j("div",se,[C(Y(M),{ref:"refRenderer",antialias:!1,autoResize:!0,autoRender:!1},{default:V(()=>[C(re)]),_:1},512)]))}};export{pe as default};
