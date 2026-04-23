import{a as e,i as t,l as n,n as r,s as i,t as a}from"./dist-3ap1knOS.js";import{B as o,C as s,D as c,G as l,H as u,N as d,O as f,S as p,T as m,_ as h,a as g,b as _,c as v,d as y,f as b,g as x,i as S,j as C,o as w,t as T,w as E,y as D,z as O}from"./runtime-core.esm-bundler-DnoU2oRd.js";import{t as k}from"./_plugin-vue_export-helper-S3RvzygF.js";import{n as A,t as j}from"./useRafBool-D7F50MBV.js";import{Cr as M,Fr as N,Gn as P,Ir as F,It as ee,Nr as te,Pr as I,vr as L,xt as R,z as ne,zt as z}from"./three.module-jOpLywQc.js";import{a as B,c as V,i as H,l as U,o as re,s as ie}from"./dist-DBmidM8m.js";import{t as W}from"./useDamp-BO5sk6vT.js";import{t as G}from"./TweakPane-CVVjQQyd.js";import{n as K,r as q,t as J}from"./scale-CbSIT-J-.js";var Y=`ScrollerKey`,ae=(e,t=e=>{})=>{let n=o(!1),{stop:r}=N(e,([{isIntersecting:e}])=>{n.value=e,t(e)});return _(()=>{r()}),n},oe=({onScroll:r,useProxy:a=!1,manual:c=!1,enabled:l=!0,options:u={}}={})=>{let d=null,f=new i.default,h=o(!1),g={scroller:null,type:`lenis`,events:f,scroll:0,velocity:0,direction:0};m(Y,g),D(()=>{!c&&l&&v()}),p(()=>{n.refresh()});let _=I(),v=function(n=window,r=document.documentElement){return d?.destroy(),d=new t({wrapper:n,content:r,duration:.6,...u}),d.on(`scroll`,x),g.scroller=d,e.ticker.add(y),e.ticker.lagSmoothing(0),a&&b(),d},y=e=>{d?.raf(e*1e3)},b=()=>{let{wrapper:e}=d.options;n.scrollerProxy(e,{getBoundingClientRect(){return{top:0,left:0,width:_.width,height:_.height}}})},x=e=>{let{scroll:t,velocity:i,direction:a}=e;g.scroll=t,g.velocity=i,g.direction=a,n.update(),f.emit(`scroll`,g),r?.(g)},S=e=>{e?d?.stop():d?.start()},C=()=>{console.warn(`🚀 ~ useScrollLenis destroy function is still WIP...`)};return s(C),{create:v,destroy:C,paused:h,setPause:S}},se={class:`scrollContent`},ce={__name:`SmoothScrollLenis`,props:{enabled:{default:!0},paused:{default:!1},useProxy:{default:!0},options:{default:{}}},setup(e){let t=e,{setPause:n,create:r,destroy:i}=oe({enabled:t.enabled,useProxy:t.useProxy,options:t.options});return C(()=>t.paused,e=>n(e)),C(()=>t.enabled,e=>{e?r():i()}),(e,t)=>(E(),v(`div`,se,[f(e.$slots,`default`)]))}};function X(){return(function(e){var t=0,n=0,r=0,i=1;e.length==0&&(e=[+new Date]);var a=le();t=a(` `),n=a(` `),r=a(` `);for(var o=0;o<e.length;o++)t-=a(e[o]),t<0&&(t+=1),n-=a(e[o]),n<0&&(n+=1),r-=a(e[o]),r<0&&(r+=1);a=null;var s=function(){var e=2091639*t+i*23283064365386963e-26;return t=n,n=r,r=e-(i=e|0)};return s.next=s,s.uint32=function(){return s()*4294967296},s.fract53=function(){return s()+(s()*2097152|0)*11102230246251565e-32},s.version=`Alea 0.9`,s.args=e,s.exportState=function(){return[t,n,r,i]},s.importState=function(e){t=+e[0]||0,n=+e[1]||0,r=+e[2]||0,i=+e[3]||0},s})(Array.prototype.slice.call(arguments))}function le(){var e=4022871197,t=function(t){t=t.toString();for(var n=0;n<t.length;n++){e+=t.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26};return t.version=`Mash 0.9`,t}X.importState=function(e){var t=new X;return t.importState(e),t};function ue(e,t){return(e%t+t)%t}var Z=`#ifndef FNC_COORD
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

vec2 pos(in float x, in float y) { return st0 + vec2(x * rx, y * rx); }
vec2 pos(in float x) { return pos(x, x); }
vec2 pos(in vec2 p) { return pos(p.x, p.y); }
float size(in float x) { return x * rx; }
vec2 size(in float x, in float y) { return vec2(x * rx, y * rx); }`,de=`#ifndef FNC_SDFCIRCLE
#define FNC_SDFCIRCLE

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.;
}

float sdCircle(in vec2 st) {
    return sdCircle(st, vec2(.5));
}

#endif

#ifndef FNC_CIRCLE
#define FNC_CIRCLE

float circle(vec2 st, float size) {
    return fill(sdCircle(st), size);
}

float circle(vec2 st, float size, float strokeWidth) {
    return stroke(sdCircle(st), size, strokeWidth);
}

#endif`,fe={__name:`MoltenCursor`,props:{open:{type:Boolean,default:!0}},setup(e,{expose:t}){let n=e,r=S(()=>n.open),i=new L,o=new L,c=new L,l=new L,u=new L,d=new L,f=new L,m=new L,{object:h,props:g}=V(null,{addToParent:!0,name:`MeshMoltenCursor`,props:{}}),_={sc0:0,sc1:1},{set:v}=W(u,{lambda:a?20:10},[`x`,`y`]),{set:y}=U(_,{stiffness:60,damping:6,mass:1},[`sc0`]),b=new P({vertexShader:H,fragmentShader:`
            uniform vec2 uResolution;
            varying vec2 vUv;
            ${Z}
            ${K}
            ${de}
            void main(void) {
                vec2 res = uResolution;
                float edge = size(100.0);
                vec2 rSize = max(vec2(res.x / res.y, 1.), vec2(1.0, res.y / res.x));
                vec2 st = vUv;
                float sdf = fill(sdCircle(st), max(rSize.x, rSize.y) - edge, edge);            
                gl_FragColor = vec4(vec3(1.0), sdf);
                // gl_FragColor = vec4(vec3(1.0), clamp(sdf + 0.5, 0., 1.));
            }
        `,uniforms:{uResolution:{value:i}},transparent:!0}),x=new R(new z(1,1),b);x.layers.set(1),h.add(x);let{isDown:w,pointer:T}=te(({x:e,y:t})=>{a||k({x:e,y:t})});p(()=>{a&&addEventListener(`touchmove`,E)}),s(()=>{a&&removeEventListener(`touchmove`,E)});let E=e=>{let{x:t,y:n}={x:e.touches[0].clientX,y:e.touches[0].clientY};k({x:t,y:n})},D,O,k=({x:e,y:t})=>{o.set(e,t),O||(O=performance.now(),c.set(e,t)),O=performance.now(),l.subVectors(o,c).clampScalar(-10,10),l.needsUpdate=!0,c.set(e,t),f.x+=l.x*.4,f.y+=l.y*.4,v({x:e,y:-t})};C(w,e=>{e&&v({px:T.x,py:-T.y}),y({sc0:e?1:0})});let A=()=>{l.needsUpdate||l.set(0,0),l.needsUpdate=!1;let e=performance.now();D||=e;let t=e-D;D=e;let n=3.2,r=Math.PI*.06,a=2*Math.PI*.001;f.x=q(t/1e3*n,f.x,0),f.y=q(t/1e3*n,f.y,0),m.x=Math.abs(f.x)*Math.sin(a*e)*r,m.y=Math.abs(f.y)*Math.sin(a*e)*r;let{sc0:o,sc1:s}=_;x.scale.x=i.x*(o+s)+m.x*-6,x.scale.y=i.y*(o+s)+m.y*6;let c=d.x-h.position.x,p=d.y-h.position.y;d.set(h.position.x,h.position.y),h.rotation.z=Math.atan2(Math.PI+p,c),g.px=u.x,g.py=u.y};return j(r,()=>A()),I(({width:e})=>{let t=a?120:re(e*.1,120,160);i.set(t,t)},!0),t({vectors:{vPos:u,vPointer:o,vPointerVl:l}}),(e,t)=>null}},pe=`#ifndef FNC_RECTSDF
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

#ifndef FNC_RECT
#define FNC_RECT

float rect(vec2 st, vec2 size, float strokeWidth) {
    return stroke(sdRect(st, size), 1.0, strokeWidth);
}

float rect(vec2 st, float size, float strokeWidth) {
    return stroke(sdRect(st, vec2(size)), 1.0, strokeWidth);
}

float rect(vec2 st, vec2 size) {
    return fill(sdRect(st, size), 1.0);
}

float rect(vec2 st, float size) {
    return fill(sdRect(st, vec2(size)), 1.0);
}

#endif`,me=`#define CONTAIN 0 
#define COVER 1 

vec2 UVResize(vec2 uvBase, vec2 resolution, vec2 aspect, vec2 scale, int fit) {
    
    vec2 st = resolution / aspect;
    float r = fit == COVER ? max(st.x, st.y) : min(st.x, st.y);
    
    vec2 uv = uvBase;
    uv -= vec2(0.5);
    uv *= st;
    uv *= 1.0 / r;
    uv *= 1.0 / scale;
    uv += vec2(0.5);
    
    return uv;
}`,Q={__name:`MoltenGLItem`,props:{id:String,borderRadius:{default:null}},setup(e,{expose:t}){let n=e,r=new L,{object:i}=V(null,{addToParent:!0,props:{s:1}}),a=new P({vertexShader:H,fragmentShader:`
            uniform vec2 uResolution;
            // uniform vec3 uColor;
            uniform float uBorderRadius;
            varying vec2 vUv;
            ${Z}
            ${K}
            ${pe}
            ${J}
            ${me}
            void main(void) {
                vec2 res = uResolution;
                float brdRad = size(uBorderRadius * 10.);
                float edge = size(100.0);
                vec2 rSize = max(
                    vec2(res.x / res.y, 1.0),
                    vec2(1.0, res.y / res.x)
                );
                vec2 st = UVResize(vUv, res, vec2(1.0), vec2(1.0), 0);
                
                
                float sdf;
                sdf = fill(sdRect(st, rSize * 2.1, brdRad), - edge, edge);
                
                vec3 c = vec3(1.);
                // vec3 c = uColor;
                
                gl_FragColor = vec4(c, sdf);
                // gl_FragColor = vec4(vec3(1.0), sdf);
            }
        `,uniforms:{uResolution:{value:r},uBorderRadius:{value:n.borderRadius||18}},transparent:!0}),o=new R(new z(1,1),a);return o.name=`MeshMolten`,o.layers.set(1),i.add(o),s(()=>{o.geometry.dispose(),o.material.dispose()}),t({update:e=>{if(i.visible=e.visible,!e.visible)return;let{x:t,y:n,width:a,height:s}=e.bounds;i.position.set(t,-n,0),o.position.set(a/2,-s/2,0),o.scale.set(a,s,1),r.set(o.scale.x,o.scale.y)}}),(e,t)=>null}},$=`BLOB_KEY`,he=()=>{let e=x($,{events:null,blobs:null});if(!e)throw Error(`useMolten must be used within a MoltenProvider`);return e},ge=b({setup(){let e=o([]),t=o(!1),n=t=>{e.value.push(t)},r=t=>{let n=e.value.findIndex(e=>e.id===t.id);n>-1&&e.value.splice(n,1)},a=new i.default;F(()=>{a.emit(`transform`),a.emit(`update`),t.value=e.value.some(e=>e.visible),a.emit(`render`)}),m($,{blobs:e,registerMolten:n,unregisterMolten:r,events:a})},render(){return this.$slots.default()}}),_e=(e=`MoltenId`)=>`${e}-${Math.random().toString(36).substr(2,9)}`,ve=(e=null,{id:t=`MoltenId`,useAutoBounds:n=!0,borderRadius:r=18}={})=>{let i=x($);if(!i)throw Error(`useMolten must be used within a MoltenProvider`);let a=x(`stickyMolten`,{offset:0,emit:null}),o=ae(e),s=()=>{if(o.value){let t=e.value.getBoundingClientRect();c.x=t.x,c.y=t.y,c.width=t.width,c.height=t.height,c.top=t.top,c.left=t.left}},c={x:0,y:0,width:0,height:0,top:0,left:0,offset:a.offset},l={id:_e(t),bounds:c,visible:o,borderRadius:r};return p(()=>{i.registerMolten(l),i.events.on(`update`,s)}),_(()=>{i.unregisterMolten(l),i.events.off(`update`,s)}),l},ye={__name:`MoltenGLLayer`,setup(e,{expose:t}){let{blobs:n,events:i}=he(),{scene:a,renderer:s}=x(`renderer`),u=new ee(-1,1,1,-1,0,10);u.layers.set(1);let d=new ne;a.add(d),m(`addTo`,d);let f=o([]),g=o(null),_=o(!1);p(()=>_.value=!r);let b=new M,S=new B(s,{shader:new P({vertexShader:H,fragmentShader:`
            #include <common>
            varying vec2 vUv;
            uniform sampler2D tMap;
            ${K}
            void main() {
                vec4 tDiffuse = texture2D(tMap, vUv);
                float edge = 0.5;
                float a;
                a = tDiffuse.a;
                a = aastep(edge, a);
                gl_FragColor = vec4(vec3(1.), a);
            }`,uniforms:{tMap:{value:b.texture}},transparent:!0})});I(({width:e,height:t})=>{u.left=-e/2,u.right=e/2,u.top=t/2,u.bottom=-t/2,u.updateProjectionMatrix();let n=Math.max(s.getPixelRatio(),2);S.setSize(e*n,t*n),b.setSize(e*n,t*n),d.position.set(-e/2,t/2,0)},!0);let C=()=>{f.value.forEach((e,t)=>{let r=n.value[t];e.update(r)})};return i.on(`render`,()=>{C(),s.setRenderTarget(b),s.clear(),s.render(a,u),s.setRenderTarget(null),S.render({final:!0,clear:!0})}),t({refCursor:g}),(e,t)=>(E(),v(T,null,[(E(!0),v(T,null,c(l(n),e=>(E(),w(Q,h({ref_for:!0,ref_key:`refItems`,ref:f,key:e.id},{ref_for:!0},e),null,16))),128)),y(fe,{ref_key:`refCursor`,ref:g,open:!0},null,512)],64))}},be=k({__name:`MoltenItem`,props:{idx:{type:Number,default:0},id:{type:String,default:`Molten`},borderRadius:{type:Number,default:null},speed:{type:Number,default:1},size:{type:Number,default:1},pos0:{type:Object,default:new L},scl0:{type:Number,default:0},cursorVectors:{type:Object,default:null},rng:{type:Function,default:()=>1}},setup(e,{expose:t}){let n=e,r=I(()=>T(),{immediate:!0}),i=S(()=>{let{width:e,height:t}=r;return(.1+n.size)*(Math.max(e,t)*.25)}),a=new L,s=new L,c=new L,l=new L,u=new L,d=new L,f=x(Y,{}),m=O({direction:0});O({impact:!1,invalidate:!1});let h=o(!0),g=o(null),y=A(g,{align:`left`});ve(g,{id:n.id,borderRadius:n.borderRadius});let b=new L,{set:w}=U(b,{stiffness:100,damping:14,mass:1},[`x`,`y`]);C(i,e=>y.w=y.h=e,{immediate:!0});let T=()=>{let{width:e,height:t}=r;a.set(e,t),s.set(e-i.value,t*2.5),c.copy(s).multiply(n.pos0)};p(()=>{k()});let D={set:0,curr:0,last:0,needsUpdate:!1},k=({velocity:e=0,direction:t=0}={})=>{m.direction=t,l.y-=e*1.2*n.speed,D.set=e/24,D.needsUpdate=!0};f.events.on(`scroll`,e=>{let{velocity:t,direction:n}=e;k({velocity:t,direction:n})});let M,N,P=0;return C(()=>n.rng,()=>{M=n.rng()*Math.PI*2,N=n.rng()*.02}),j(h,()=>{let e=D.set-D.last;D.last=D.set,D.curr+=e,w({x:Math.min(Math.abs(D.curr),2)*-.2,y:Math.abs(D.curr)*.12}),D.needsUpdate||(D.set=0,D.curr=0),D.needsUpdate=!1,u.y-=.3*(m.direction||1)*n.speed;let{x:t,y:i}=c.clone().add(l).add(u).add(d),a=(()=>{P+=N;let{scl0:e}=n,t=1+.06*Math.sin(P+M);return[t*(e+b.x),t*(e+b.y)]})();y.px=t,y.py=-r.height+ue(i,s.y),y.s=a}),_(()=>{h.value=!1}),t({el:g,resize:T,vectors:{vPosStart:c}}),(e,t)=>(E(),v(`div`,{ref_key:`refRoot`,ref:g,class:`blob`},null,512))}},[[`__scopeId`,`data-v-5f4f3651`]]),xe={class:`molten`},Se={class:`molten__items`},Ce=12,we={__name:`Molten`,setup(t){let r=u([]),i=o(),a=O({sclTest:0,step:0}),s=o(Array(Ce).fill(0).map((e,t)=>({idx:t,pos0:new L,scl0:1,speed:1,cursorVectors:{}})));e.registerPlugin(n),n.config({ignoreMobileResize:!0,limitCallbacks:!1}),p(()=>{let{pane:e}=window,{vectors:t}=i.value.refCursor;s.value.forEach((e,n)=>{e.cursorVectors=t}),e.addBinding(a,`step`,{step:1,min:0,max:100}).on(`change`,e=>f(~~(Math.random()*1e3))),f(639)});let f=e=>{let t=new X(e);s.value.forEach((e,n)=>{e.rng=t,e.pos0.set(t(),t()),e.scl0=t()*.5+.5,e.speed=t()*1+.5,r.value[n].resize()})};return(e,t)=>(E(),v(`div`,xe,[y(l(G),{hiddenOnStart:e.nodeEnv==`production`},{default:d(()=>[y(l(ce),{options:{infinite:!0,lerp:.1,duration:1}},{default:d(()=>[y(l(ie),{ref:`refRenderer`,antialias:!1,autoResize:!0,autoRender:!0},{default:d(()=>[y(l(ge),null,{default:d(()=>[y(ye,{ref_key:`refGLLayer`,ref:i},null,512),g(`div`,Se,[(E(!0),v(T,null,c(s.value,e=>(E(),v(`div`,{key:e.id},[y(be,h({ref_for:!0,ref_key:`refItems`,ref:r},{ref_for:!0},e),null,16)]))),128))])]),_:1})]),_:1},512)]),_:1})]),_:1},8,[`hiddenOnStart`])]))}};export{we as default};