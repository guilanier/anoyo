import{B as e,C as t,D as n,G as r,H as i,N as a,O as o,S as s,T as c,_ as l,a as u,b as d,c as f,d as p,f as m,g as h,i as g,j as _,o as v,t as y,w as b,y as x,z as S}from"./runtime-core.esm-bundler-CcJlyGsM.js";import{t as C}from"./_plugin-vue_export-helper-S3RvzygF.js";import{a as w,i as T,l as E,n as D,s as O,t as k}from"./dist-C2jCnoBA.js";import{n as A,t as j}from"./useRafBool-DV8y8LPZ.js";import{Cr as M,Fr as N,Gn as P,Ir as F,It as ee,Nr as te,Pr as I,vr as L,xt as R,z as ne,zt as z}from"./three.module-BuIdCjeS.js";import{a as B,c as V,i as H,l as U,o as re,s as ie}from"./dist-n5_9iAry.js";import{t as W}from"./useDamp-6DmnxVo-.js";import{t as G}from"./TweakPane-DIumONVw.js";import{n as K,r as q,t as J}from"./scale-BuPTE1go.js";var Y=`ScrollerKey`,ae=(t,n=e=>{})=>{let r=e(!1),{stop:i}=N(t,([{isIntersecting:e}])=>{r.value=e,n(e)});return d(()=>{i()}),r},oe=({onScroll:n,useProxy:r=!1,manual:i=!1,enabled:a=!0,options:o={}}={})=>{let l=null,u=new O.default,d=e(!1),f={scroller:null,type:`lenis`,events:u,scroll:0,velocity:0,direction:0};c(Y,f),x(()=>{!i&&a&&m()}),s(()=>{E.refresh()});let p=I(),m=function(e=window,t=document.documentElement){return l?.destroy(),l=new T({wrapper:e,content:t,duration:.6,...o}),l.on(`scroll`,_),f.scroller=l,w.ticker.add(h),w.ticker.lagSmoothing(0),r&&g(),l},h=e=>{l?.raf(e*1e3)},g=()=>{let{wrapper:e}=l.options;E.scrollerProxy(e,{getBoundingClientRect(){return{top:0,left:0,width:p.width,height:p.height}}})},_=e=>{let{scroll:t,velocity:r,direction:i}=e;f.scroll=t,f.velocity=r,f.direction=i,E.update(),u.emit(`scroll`,f),n?.(f)},v=e=>{e?l?.stop():l?.start()},y=()=>{console.warn(`🚀 ~ useScrollLenis destroy function is still WIP...`)};return t(y),{create:m,destroy:y,paused:d,setPause:v}},se={class:`scrollContent`},ce={__name:`SmoothScrollLenis`,props:{enabled:{default:!0},paused:{default:!1},useProxy:{default:!0},options:{default:{}}},setup(e){let t=e,{setPause:n,create:r,destroy:i}=oe({enabled:t.enabled,useProxy:t.useProxy,options:t.options});return _(()=>t.paused,e=>n(e)),_(()=>t.enabled,e=>{e?r():i()}),(e,t)=>(b(),f(`div`,se,[o(e.$slots,`default`)]))}};function X(){return(function(e){var t=0,n=0,r=0,i=1;e.length==0&&(e=[+new Date]);var a=le();t=a(` `),n=a(` `),r=a(` `);for(var o=0;o<e.length;o++)t-=a(e[o]),t<0&&(t+=1),n-=a(e[o]),n<0&&(n+=1),r-=a(e[o]),r<0&&(r+=1);a=null;var s=function(){var e=2091639*t+i*23283064365386963e-26;return t=n,n=r,r=e-(i=e|0)};return s.next=s,s.uint32=function(){return s()*4294967296},s.fract53=function(){return s()+(s()*2097152|0)*11102230246251565e-32},s.version=`Alea 0.9`,s.args=e,s.exportState=function(){return[t,n,r,i]},s.importState=function(e){t=+e[0]||0,n=+e[1]||0,r=+e[2]||0,i=+e[3]||0},s})(Array.prototype.slice.call(arguments))}function le(){var e=4022871197,t=function(t){t=t.toString();for(var n=0;n<t.length;n++){e+=t.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26};return t.version=`Mash 0.9`,t}X.importState=function(e){var t=new X;return t.importState(e),t};function ue(e,t){return(e%t+t)%t}var Z=`#ifndef FNC_COORD
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

#endif`,fe={__name:`MoltenCursor`,props:{open:{type:Boolean,default:!0}},setup(e,{expose:n}){let r=e,i=g(()=>r.open),a=new L,o=new L,c=new L,l=new L,u=new L,d=new L,f=new L,p=new L,{object:m,props:h}=V(null,{addToParent:!0,name:`MeshMoltenCursor`,props:{}}),v={sc0:0,sc1:1},{set:y}=W(u,{lambda:k?20:10},[`x`,`y`]),{set:b}=U(v,{stiffness:60,damping:6,mass:1},[`sc0`]),x=new P({vertexShader:H,fragmentShader:`
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
        `,uniforms:{uResolution:{value:a}},transparent:!0}),S=new R(new z(1,1),x);S.layers.set(1),m.add(S);let{isDown:C,pointer:w}=te(({x:e,y:t})=>{k||O({x:e,y:t})});s(()=>{k&&addEventListener(`touchmove`,T)}),t(()=>{k&&removeEventListener(`touchmove`,T)});let T=e=>{let{x:t,y:n}={x:e.touches[0].clientX,y:e.touches[0].clientY};O({x:t,y:n})},E,D,O=({x:e,y:t})=>{o.set(e,t),D||(D=performance.now(),c.set(e,t)),D=performance.now(),l.subVectors(o,c).clampScalar(-10,10),l.needsUpdate=!0,c.set(e,t),f.x+=l.x*.4,f.y+=l.y*.4,y({x:e,y:-t})};_(C,e=>{e&&y({px:w.x,py:-w.y}),b({sc0:+!!e})});let A=()=>{l.needsUpdate||l.set(0,0),l.needsUpdate=!1;let e=performance.now();E||=e;let t=e-E;E=e;let n=3.2,r=Math.PI*.06,i=2*Math.PI*.001;f.x=q(t/1e3*n,f.x,0),f.y=q(t/1e3*n,f.y,0),p.x=Math.abs(f.x)*Math.sin(i*e)*r,p.y=Math.abs(f.y)*Math.sin(i*e)*r;let{sc0:o,sc1:s}=v;S.scale.x=a.x*(o+s)+p.x*-6,S.scale.y=a.y*(o+s)+p.y*6;let c=d.x-m.position.x,g=d.y-m.position.y;d.set(m.position.x,m.position.y),m.rotation.z=Math.atan2(Math.PI+g,c),h.px=u.x,h.py=u.y};return j(i,()=>A()),I(({width:e})=>{let t=k?120:re(e*.1,120,160);a.set(t,t)},!0),n({vectors:{vPos:u,vPointer:o,vPointerVl:l}}),(e,t)=>null}},pe=`#ifndef FNC_RECTSDF
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
}`,Q={__name:`MoltenGLItem`,props:{id:String,borderRadius:{default:null}},setup(e,{expose:n}){let r=e,i=new L,{object:a}=V(null,{addToParent:!0,props:{s:1}}),o=new P({vertexShader:H,fragmentShader:`
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
        `,uniforms:{uResolution:{value:i},uBorderRadius:{value:r.borderRadius||18}},transparent:!0}),s=new R(new z(1,1),o);return s.name=`MeshMolten`,s.layers.set(1),a.add(s),t(()=>{s.geometry.dispose(),s.material.dispose()}),n({update:e=>{if(a.visible=e.visible,!e.visible)return;let{x:t,y:n,width:r,height:o}=e.bounds;a.position.set(t,-n,0),s.position.set(r/2,-o/2,0),s.scale.set(r,o,1),i.set(s.scale.x,s.scale.y)}}),(e,t)=>null}},$=`BLOB_KEY`,he=()=>{let e=h($,{events:null,blobs:null});if(!e)throw Error(`useMolten must be used within a MoltenProvider`);return e},ge=m({setup(){let t=e([]),n=e(!1),r=e=>{t.value.push(e)},i=e=>{let n=t.value.findIndex(t=>t.id===e.id);n>-1&&t.value.splice(n,1)},a=new O.default;F(()=>{a.emit(`transform`),a.emit(`update`),n.value=t.value.some(e=>e.visible),a.emit(`render`)}),c($,{blobs:t,registerMolten:r,unregisterMolten:i,events:a})},render(){return this.$slots.default()}}),_e=(e=`MoltenId`)=>`${e}-${Math.random().toString(36).substr(2,9)}`,ve=(e=null,{id:t=`MoltenId`,useAutoBounds:n=!0,borderRadius:r=18}={})=>{let i=h($);if(!i)throw Error(`useMolten must be used within a MoltenProvider`);let a=h(`stickyMolten`,{offset:0,emit:null}),o=ae(e),c=()=>{if(o.value){let t=e.value.getBoundingClientRect();l.x=t.x,l.y=t.y,l.width=t.width,l.height=t.height,l.top=t.top,l.left=t.left}},l={x:0,y:0,width:0,height:0,top:0,left:0,offset:a.offset},u={id:_e(t),bounds:l,visible:o,borderRadius:r};return s(()=>{i.registerMolten(u),i.events.on(`update`,c)}),d(()=>{i.unregisterMolten(u),i.events.off(`update`,c)}),u},ye={__name:`MoltenGLLayer`,setup(t,{expose:i}){let{blobs:a,events:o}=he(),{scene:u,renderer:d}=h(`renderer`),m=new ee(-1,1,1,-1,0,10);m.layers.set(1);let g=new ne;u.add(g),c(`addTo`,g);let _=e([]),x=e(null),S=e(!1);s(()=>S.value=!D);let C=new M,w=new B(d,{shader:new P({vertexShader:H,fragmentShader:`
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
            }`,uniforms:{tMap:{value:C.texture}},transparent:!0})});I(({width:e,height:t})=>{m.left=-e/2,m.right=e/2,m.top=t/2,m.bottom=-t/2,m.updateProjectionMatrix();let n=Math.max(d.getPixelRatio(),2);w.setSize(e*n,t*n),C.setSize(e*n,t*n),g.position.set(-e/2,t/2,0)},!0);let T=()=>{_.value.forEach((e,t)=>{let n=a.value[t];e.update(n)})};return o.on(`render`,()=>{T(),d.setRenderTarget(C),d.clear(),d.render(u,m),d.setRenderTarget(null),w.render({final:!0,clear:!0})}),i({refCursor:x}),(e,t)=>(b(),f(y,null,[(b(!0),f(y,null,n(r(a),e=>(b(),v(Q,l({ref_for:!0,ref_key:`refItems`,ref:_,key:e.id},{ref_for:!0},e),null,16))),128)),p(fe,{ref_key:`refCursor`,ref:x,open:!0},null,512)],64))}},be=C({__name:`MoltenItem`,props:{idx:{type:Number,default:0},id:{type:String,default:`Molten`},borderRadius:{type:Number,default:null},speed:{type:Number,default:1},size:{type:Number,default:1},pos0:{type:Object,default:new L},scl0:{type:Number,default:0},cursorVectors:{type:Object,default:null},rng:{type:Function,default:()=>1}},setup(t,{expose:n}){let r=t,i=I(()=>D(),{immediate:!0}),a=g(()=>{let{width:e,height:t}=i;return(.1+r.size)*(Math.max(e,t)*.25)}),o=new L,c=new L,l=new L,u=new L,p=new L,m=new L,v=h(Y,{}),y=S({direction:0});S({impact:!1,invalidate:!1});let x=e(!0),C=e(null),w=A(C,{align:`left`});ve(C,{id:r.id,borderRadius:r.borderRadius});let T=new L,{set:E}=U(T,{stiffness:100,damping:14,mass:1},[`x`,`y`]);_(a,e=>w.w=w.h=e,{immediate:!0});let D=()=>{let{width:e,height:t}=i;o.set(e,t),c.set(e-a.value,t*2.5),l.copy(c).multiply(r.pos0)};s(()=>{k()});let O={set:0,curr:0,last:0,needsUpdate:!1},k=({velocity:e=0,direction:t=0}={})=>{y.direction=t,u.y-=e*1.2*r.speed,O.set=e/24,O.needsUpdate=!0};v.events.on(`scroll`,e=>{let{velocity:t,direction:n}=e;k({velocity:t,direction:n})});let M,N,P=0;return _(()=>r.rng,()=>{M=r.rng()*Math.PI*2,N=r.rng()*.02}),j(x,()=>{let e=O.set-O.last;O.last=O.set,O.curr+=e,E({x:Math.min(Math.abs(O.curr),2)*-.2,y:Math.abs(O.curr)*.12}),O.needsUpdate||(O.set=0,O.curr=0),O.needsUpdate=!1,p.y-=.3*(y.direction||1)*r.speed;let{x:t,y:n}=l.clone().add(u).add(p).add(m),a=(()=>{P+=N;let{scl0:e}=r,t=1+.06*Math.sin(P+M);return[t*(e+T.x),t*(e+T.y)]})();w.px=t,w.py=-i.height+ue(n,c.y),w.s=a}),d(()=>{x.value=!1}),n({el:C,resize:D,vectors:{vPosStart:l}}),(e,t)=>(b(),f(`div`,{ref_key:`refRoot`,ref:C,class:`blob`},null,512))}},[[`__scopeId`,`data-v-5f4f3651`]]),xe={class:`molten`},Se={class:`molten__items`},Ce=12,we={__name:`Molten`,setup(t){let o=i([]),c=e(),d=S({sclTest:0,step:0}),m=e(Array(Ce).fill(0).map((e,t)=>({idx:t,pos0:new L,scl0:1,speed:1,cursorVectors:{}})));w.registerPlugin(E),E.config({ignoreMobileResize:!0,limitCallbacks:!1}),s(()=>{let{pane:e}=window,{vectors:t}=c.value.refCursor;m.value.forEach((e,n)=>{e.cursorVectors=t}),e.addBinding(d,`step`,{step:1,min:0,max:100}).on(`change`,e=>h(~~(Math.random()*1e3))),h(639)});let h=e=>{let t=new X(e);m.value.forEach((e,n)=>{e.rng=t,e.pos0.set(t(),t()),e.scl0=t()*.5+.5,e.speed=t()*1+.5,o.value[n].resize()})};return(e,t)=>(b(),f(`div`,xe,[p(r(G),{hiddenOnStart:e.nodeEnv==`production`},{default:a(()=>[p(r(ce),{options:{infinite:!0,lerp:.1,duration:1}},{default:a(()=>[p(r(ie),{ref:`refRenderer`,antialias:!1,autoResize:!0,autoRender:!0},{default:a(()=>[p(r(ge),null,{default:a(()=>[p(ye,{ref_key:`refGLLayer`,ref:c},null,512),u(`div`,Se,[(b(!0),f(y,null,n(m.value,e=>(b(),f(`div`,{key:e.id},[p(be,l({ref_for:!0,ref_key:`refItems`,ref:o},{ref_for:!0},e),null,16)]))),128))])]),_:1})]),_:1},512)]),_:1})]),_:1},8,[`hiddenOnStart`])]))}};export{we as default};