import{u as P,c as j,P as Y,O as Z,C as $,W as K,d as T,e as Q,B as V,f as c,V as z,g as q,R as W,M as L,E as X,b as J,h as ee,i as ne,j as te}from"./is-tablet-C250NfAo.js";import{h as oe,d as C,e as M,p as B,k as N,b as se,t as re,o as G,c as I,a as ie,r as ae,F as ce,i as le,l as F,s as O,n as de,q as ue}from"./index-BH1L809D.js";const k=[],b=oe({width:0,height:0,aspect:1});let A=!1;const U=n=>{b.width=window.innerWidth,b.height=window.innerHeight,k.forEach(r=>r(b))},fe=()=>{window.addEventListener("resize",U)},pe=()=>{window.removeEventListener("resize",U)},ve=()=>{A||(b.width=window.innerWidth,b.height=window.innerHeight,b.aspect=b.width/b.height,fe(),A=!0)},me=()=>{pe()};function H(n=()=>{},r){return C(()=>{ve(),k.push(n),r&&n(b)}),M(()=>{k.splice(k.indexOf(n)>>>0,1),k.length||me()}),b}const we=(n,r,t,i,p)=>{const x=-i*(n-r),a=-p*t;return x+a},he=(n,r={},t=[])=>{const i={properties:{},config:{stiffness:100,damping:10,mass:1,...r}},p=e=>{i.properties[e]={current:n[e],velocity:0,to:n[e]}},x=t.length?{...t}:n;if(t.length)for(let e=0;e<t.length;e++){const s=t[e];p(s)}else for(const e in x)Object.hasOwnProperty.call(n,e)&&p(e);const{stiffness:a,damping:y,mass:f}=i.config,u=({delta:e})=>{for(const s in i.properties){const l=i.properties[s],{current:g,to:d,velocity:v}=l,S=we(g,d,v,a,y),E=e/1e3;l.velocity+=S*E/f,l.current+=l.velocity*E,Math.abs(d-g)<1e-4&&(l.current=l.to),n[s]=l.current}},{stop:m,start:w,isActive:R}=P(u),_=(e,s=!1)=>{for(const l in e)Object.hasOwnProperty.call(i.properties,l)&&(i.properties[l].to=e[l],s&&(i.properties[l].current=e[l]))},o=()=>R.value?m():w(),h=()=>document.visibilityState==="visible"?w():m();return C(()=>{w(),document.addEventListener("visibilitychange",h)}),M(()=>{m(),document.removeEventListener("visibilitychange",h)}),{start:w,stop:m,toggle:o,set:_}},xe=(n,r,t)=>r+n*(t-r),Re=(n,r,t,i)=>xe(1-Math.exp(-t*i),n,r),D=(n,r={},t=[])=>{const i={properties:{},config:{lambda:3,...r}},p=o=>{i.properties[o]={current:n[o],to:n[o]}},x=t.length?{...t}:n;if(t.length)for(let o=0;o<t.length;o++){const h=t[o];p(h)}else for(const o in x)Object.hasOwnProperty.call(n,o)&&p(o);const{lambda:a}=i.config,y=({delta:o})=>{for(const h in i.properties){const e=i.properties[h],{current:s,to:l}=e,g=o/1e3;e.current=Re(e.current,e.to,a,g),Math.abs(l-s)<1e-4&&(e.current=e.to),n[h]=e.current}},{stop:f,start:u,isActive:m}=P(y),w=(o,h=!1)=>{for(const e in o)Object.hasOwnProperty.call(i.properties,e)&&(i.properties[e].to=o[e],h&&(i.properties[e].current=o[e]))},R=()=>m.value?f():u(),_=()=>document.visibilityState==="visible"?u():f();return C(()=>{u(),document.addEventListener("visibilitychange",_)}),M(()=>{f(),document.removeEventListener("visibilitychange",_)}),{start:u,stop:f,toggle:R,set:w}},_e=()=>{const n=new j;return B("scene",n),B("addTo",n),n},ge={__name:"Renderer",props:{autoRender:{default:!0},autoResize:{default:!1},antialias:{default:!1}},emits:["setupComplete"],setup(n,{expose:r,emit:t}){function i(d,v,S){return Math.min(S,Math.max(v,d))}const p=n,x=N(null);let a;const y=_e(),f=new Y(45,1,p.near,p.far),u=new Z(-1,1,1,-1,.1,100),m=new $;m.start(),f.position.z=u.position.z=5,u.layers.set(1);const w=[],R=(d,v=1/0)=>{w.push({fn:d,index:v}),w.sort((S,E)=>S.index-E.index)},_=d=>{const v=w.find(S=>S.fn===d);w.splice(v,1)},o=({width:d,height:v})=>{const S=i(window.devicePixelRatio,1,2);a.setSize(d,v),a.setPixelRatio(S),f.aspect=d/v,f.updateProjectionMatrix(),u.left=-d/2,u.right=d/2,u.top=v/2,u.bottom=-v/2,u.updateProjectionMatrix()},h={scene:y,camera:f,orthoCamera:u,clock:m,registerRenderFn:R,unregisterRenderFn:_,resize:o};B("renderer",h);const e=()=>{a=new K({antialias:p.antialias}),a.autoClear=!1,a.setClearAlpha(0),h.renderer=a,g("setupComplete",{renderer:a})},s=()=>{a&&w.forEach(d=>{var v;(v=d.fn)==null||v.call(d,{renderer:a,camera:f})})};P(()=>{p.autoRender&&s()}),p.autoResize&&H(o,!0),se(()=>{e()}),C(()=>{x.value.appendChild(a.domElement),window.camera=f}),re(()=>{x.value.removeChild(a.domElement),a.dispose()});const g=t;return r({resize:o}),(d,v)=>(G(),I(ce,null,[ie("div",{ref_key:"glContainer",ref:x,class:"gl"},null,512),ae(d.$slots,"default")],64))}},be=ge;function ye(n,r,t){return Math.min(t,Math.max(r,n))}new T(1,1);new Q(1,32,32);new V(1,1,1);const Se=`
	varying vec2 vUv;
	void main() {
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_Position = projectionMatrix * mvPosition;
	}
`;new c;new z;new c(0,1,0);new c;new q;new W;new z;new c;new z;new z;new c;new c;new L;new c;new c;new W;new c;new c;new c(1,0,0),new c(0,1,0),new c(0,0,1);new X;new c(0,1,0);new c(0,0,0);new L;new c;new L;new c(1,0,0);new c(0,1,0);new c(0,0,1);new c;new c;new c;var ze=`#ifdef GL_ES
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
	const vec3 c1 = mix(WHITE, YELLOW, 0.4);
	const vec3 c2 = mix(WHITE, AZUR, 0.7);
	const vec3 c3 = mix(WHITE, ORANGE, 0.9);
	const vec3 c4 = BLACK;
	float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
	float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
	float d2 = abs(stroke(d, 0.004));
	float f = clamp(d * 0.85, 0.0, 1.0);
	vec3 gradient = mix(c1, c2, f);
	gradient = mix(gradient, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
	gradient = mix(gradient, c3, fill(d));
	gradient = mix(gradient, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
	return gradient;
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
    st = st * 2. - 1.;
    return max( abs(st.x / s.x),
                abs(st.y / s.y) );
}

float sdRect(in vec2 st, in float s) {
    return sdRect(st, vec2(s) );
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
}`;const Ce={__name:"index",setup(n){const{renderer:r,scene:t,orthoCamera:i}=le("renderer"),p=new z,x=new z,a=N(0),y={pSizeBlur:.25},f={pStroke:0,pBorderRadius:.01},{set:u}=D(y,{lambda:6},["pSizeBlur"]),{set:m}=he(f,{stiffness:90,damping:12,mass:1}),{set:w}=D(p,{lambda:12},["x","y"]);let R,_;const o=()=>{_=new ee({vertexShader:Se,fragmentShader:ze,uniforms:{u_resolution:{value:x},u_mouse:{value:p},u_size:{value:ne?.8:.6},u_blur:{value:.25},u_stroke:{value:0},u_borderRadius:{value:.01}},extensions:{derivatives:!0},transparent:!1}),R=new te(new T(1,1),_),R.scale.set(window.innerWidth,window.innerHeight,1),R.layers.set(1),t.add(R)};H(s=>{const{width:l,height:g}=s,d=ye(window.devicePixelRatio,1,2);x.set(l,g).multiplyScalar(d),R==null||R.scale.set(l,g)},!0);const{isDown:h}=J(({x:s,y:l})=>{const g=r.getPixelRatio();w({x:s*g,y:x.y-l*g})});return F(h,s=>{u(s?{pSizeBlur:.5}:{pSizeBlur:.25}),s||(a.value=(a.value+1)%4)}),F(a,s=>{switch(s){case 0:m({pStroke:0,pBorderRadius:.01});break;case 1:m({pStroke:1,pBorderRadius:.5});break;case 2:m({pStroke:1,pBorderRadius:-.2});break;case 3:m({pStroke:0,pBorderRadius:.5});break}}),P(()=>{const s=_==null?void 0:_.uniforms;s&&(s.u_blur.value=y.pSizeBlur,s.u_stroke.value=f.pStroke,s.u_borderRadius.value=f.pBorderRadius),r.clear(),r.render(t,i)}),C(o),()=>{}}},ke={class:"component"},Be={__name:"SDFLensBlur",setup(n){return C(()=>document.body.style.overflow="hidden"),(r,t)=>(G(),I("div",ke,[O(ue(be),{ref:"refRenderer",antialias:!1,autoResize:!0,autoRender:!1},{default:de(()=>[O(Ce)]),_:1},512)]))}};export{Be as default};
