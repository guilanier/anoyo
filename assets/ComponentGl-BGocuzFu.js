var Xn=Object.defineProperty;var gn=(E,A,n)=>A in E?Xn(E,A,{enumerable:!0,configurable:!0,writable:!0,value:n}):E[A]=n;var L=(E,A,n)=>gn(E,typeof A!="symbol"?A+"":A,n);import{i as X,b as fn,j as Rn,w as p,k as cn,p as Nn,l as Bn,m as yn,_ as hn,n as bn,r as Tn,s as un,o as Y,c as Sn,q as Yn,v as wn,a as zn,g as an,x as tn,F as Wn,d as kn,y as vn,z as qn,u as b,A as Kn,B as Qn}from"./index-eI56Rhph.js";import{T as Zn}from"./TweakPane-BteI_cyG.js";import{V as jn,x as $n,y as Jn,c as ne,T as ee,g as Ae,j as Ee,N as ie,n as fe}from"./index-C1mECz12.js";import{V,a as l,C as nn,S as Fn,M as mn,P as Me,x as Un,E as Cn,h as Dn,b as $,N as de,O as Le,B as _e,F as Ln,U as Re,c as Te}from"./three.core-RZ2ajxyR.js";import{E as J}from"./useDamp-CM--nQvE.js";import{B as On,g as Pn}from"./index-BnRP3NjO.js";import{g as Se,l as _n,s as ae,d as te}from"./scale-Dysxp_Xs.js";import{E as xn,i as Ie}from"./is-tablet-CwWrv5SO.js";function sn(E,A){return E*A/(1-A)}var re=`#ifdef GLSLVIEWER
varying vec2 v_texcoord;
#else
varying vec2 vUv;
#define v_texcoord vUv
#endif

uniform vec3 u_camera;
uniform vec3 u_target;
uniform vec3 u_light;
uniform vec3 u_lightColor;
uniform float u_time;

uniform vec3 u_posSphere;
uniform float u_scSphere;
uniform float u_unionSphere;

uniform vec2 u_resolution;

#define uResolution u_resolution
#define uPointer u_mouse

#ifndef COLOR_BCK
#define COLOR_BCK vec3(0.0, 0.0, 0.0)
#endif
#ifndef COLOR_AMB
#define COLOR_AMB vec3(0.0, 0.0, 0.0)
#endif
#ifndef COLOR_LIGHT
#define COLOR_LIGHT vec3(1.0, 0.0, 0.0)
#endif
#ifndef COLOR_BAC
#define COLOR_BAC vec3(0.0)
#endif
#ifndef COLOR_FRE
#define COLOR_FRE vec3(0.0, 0.6627, 0.9059)
#endif
#ifndef COLOR_DOM
#define COLOR_DOM vec3(0.0, 0.0, 0.0)
#endif

#define RAYMARCH_AMBIENT COLOR_AMB
#define RAYMARCH_BACKGROUND COLOR_BCK

#define RAYMARCH_MIN_DIST 0.01
#define RAYMARCH_MAX_DIST 10.0

#define LIGHT_POSITION u_light
#define LIGHT_COLOR COLOR_LIGHT

#ifndef CIRCLESDF_FNC
#define CIRCLESDF_FNC(POS_UV) length(POS_UV)
#endif

#ifndef FNC_CIRCLESDF
#define FNC_CIRCLESDF

float circleSDF(in vec2 v) {
#ifdef CENTER_2D
    v -= CENTER_2D;
#else
    v -= 0.5;
#endif
    return CIRCLESDF_FNC(v) * 2.0;
}
#endif
#ifndef FNC_RECTSDF
#define FNC_RECTSDF

float rectSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;   
}

float rectSDF(vec2 p, float b, float r) {
    return rectSDF(p, vec2(b), r);
}

float rectSDF(in vec2 st, in vec2 s) {
    #ifdef CENTER_2D
        st -= CENTER_2D;
        st *= 2.0;
    #else
        st = st * 2.0 - 1.0;
    #endif
    return max( abs(st.x / s.x),
                abs(st.y / s.y) );
}

float rectSDF(in vec2 st, in float s) {
    return rectSDF(st, vec2(s) );
}

float rectSDF(in vec2 st) {
    return rectSDF(st, vec2(1.0));
}

#endif

#ifndef FNC_CROSSSDF
#define FNC_CROSSSDF
float crossSDF(in vec2 st, in float s) {
    vec2 size = vec2(.25, s);
    return min(rectSDF(st.xy, size.xy),
               rectSDF(st.xy, size.yx));
}
#endif
#ifndef FNC_HEARTSDF
#define FNC_HEARTSDF
float heartSDF(vec2 st) {
    #ifdef CENTER_2D
    st -= CENTER_2D;
    #else
    st -= 0.5;
    #endif
    st -= vec2(0.0, 0.3);
    float r = length(st) * 5.0;
    st = normalize(st);
    return r - ((st.y * pow(abs(st.x), 0.67)) / (st.y + 1.5) - (2.0) * st.y + 1.26);
}
#endif
#ifndef FNC_HEXSDF
#define FNC_HEXSDF
float hexSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 2.0;
#else
    st = st * 2.0 - 1.0;
#endif
    st = abs(st);
    return max(abs(st.y), st.x * .866025 + st.y * .5);
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_LINESDF
#define FNC_LINESDF
float lineSDF( in vec2 st, in vec2 a, in vec2 b ) {
    vec2 b_to_a = b - a;
    vec2 to_a = st - a;
    float h = saturate(dot(to_a, b_to_a)/dot(b_to_a, b_to_a));
    return length(to_a - h * b_to_a );
}

float lineSDF(vec3 p, vec3 a, vec3 b) {
    
    return length(cross(p - a, p - b))/length(b - a);
}
#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif

#ifndef FNC_POLYSDF
#define FNC_POLYSDF
float polySDF(in vec2 st, in int V) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 2.0;
#else
    st = st * 2.0 - 1.0;
#endif
    float a = atan(st.x, st.y) + PI;
    float r = length(st);
    float v = TAU / float(V);
    return cos(floor(.5 + a / v) * v - a ) * r;
}
#endif
#ifndef FNC_TRISDF
#define FNC_TRISDF
float triSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 5.0;
#else
    st -= 0.5;
    st *= 5.0;
#endif
    return max(abs(st.x) * .866025 + st.y * .5, -st.y * 0.5);
}
#endif
#ifndef FNC_SCALE
#define FNC_SCALE
vec2 scale(in float st, in float s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in float st, in float s) {
#ifdef CENTER_2D
    return scale(st,  s, CENTER_2D);
#else
    return scale(st,  s, vec2(0.5));
#endif
}

vec2 scale(in vec2 st, in vec2 s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in vec2 st, in float s, in vec2 center) { return scale(st, vec2(s), center); }
vec2 scale(in vec2 st, in vec2 s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec2 scale(in vec2 st, in float s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in vec3 s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in float s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in vec3 s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in float s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec4 scale(in vec4 st, float s) { return vec4(scale(st.xy, s), st.zw); }
vec4 scale(in vec4 st, vec2 s) { return vec4(scale(st.xy, s), st.zw); }
#endif

#ifndef FNC_RHOMBSDF
#define FNC_RHOMBSDF
float rhombSDF(in vec2 st) {
    float offset = 1.0;
    #ifdef CENTER_2D
    offset = CENTER_2D.y * 2.0;
    #endif 
    return max(triSDF(st),
               triSDF(vec2(st.x, offset-st.y)));

}
#endif
#ifndef FNC_SPIRALSDF
#define FNC_SPIRALSDF
float spiralSDF(vec2 st, float t) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    float r = dot(st, st);
    float a = atan(st.y, st.x);
    return abs(sin(fract(log(r) * t + a * 0.159)));
}
#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif
#ifndef FNC_SCALE
#define FNC_SCALE
vec2 scale(in float st, in float s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in float st, in float s) {
#ifdef CENTER_2D
    return scale(st,  s, CENTER_2D);
#else
    return scale(st,  s, vec2(0.5));
#endif
}

vec2 scale(in vec2 st, in vec2 s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in vec2 st, in float s, in vec2 center) { return scale(st, vec2(s), center); }
vec2 scale(in vec2 st, in vec2 s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec2 scale(in vec2 st, in float s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in vec3 s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in float s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in vec3 s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in float s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec4 scale(in vec4 st, float s) { return vec4(scale(st.xy, s), st.zw); }
vec4 scale(in vec4 st, vec2 s) { return vec4(scale(st.xy, s), st.zw); }
#endif

#ifndef FNC_STARSDF
#define FNC_STARSDF
float starSDF(in vec2 st, in int V, in float s) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 2.0;
    float a = atan(st.y, st.x) / TAU;
    float seg = a * float(V);
    a = ((floor(seg) + 0.5) / float(V) +
        mix(s, -s, step(0.5, fract(seg))))
        * TAU;
    return abs(dot(vec2(cos(a), sin(a)),
                   st));
}

float starSDF(in vec2 st, in int V) {
    return starSDF( scale(st, 12.0/float(V)), V, 0.1);
}
#endif
#ifndef FNC_CART2POLAR
#define FNC_CART2POLAR

vec2 cart2polar(in vec2 st) {
    return vec2(atan(st.y, st.x), length(st));
}

vec3 cart2polar( in vec3 st ) {
    float r = length(st);
    float phi = acos(st.z/r);
    float theta = atan(st.y, st.x);
    return vec3(r, phi, theta);
}

#endif

#ifndef FNC_SUPERSHAPESDF
#define FNC_SUPERSHAPESDF
float superShapeSDF( in vec2 st, in vec2 center, in float s, in float a, in float b, in float n1, in float n2, in float n3, in float m ) {
    st -= center;
    vec2 polar = cart2polar( st );
    float d = polar.y * 5.0;
    float theta = polar.x;
    float t1 = abs((1.0/a) * cos(m * theta * 0.25));
    t1 = pow(t1, n2);
    float t2 = abs((1.0/b) * sin(m * theta * 0.25));
    t2 = pow(t2, n3);
    float t3 = t1 + t2;
    float r = pow(t3, -1.0 / n1);
    vec2 q = s * r * vec2(cos(theta), sin(theta));
    return d - length(q); 
}

float superShapeSDF( in vec2 st, in float s, in float a, in float b, in float n1, in float n2, in float n3, in float m ) {
    #ifdef CENTER_2D
    return superShapeSDF( st, CENTER_2D, s, a, b, n1, n2, n3, m );
    #else
    return superShapeSDF( st, vec2(0.5), s, a, b, n1, n2, n3, m );
    #endif
}
#endif
#ifndef FNC_TRISDF
#define FNC_TRISDF
float triSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 5.0;
#else
    st -= 0.5;
    st *= 5.0;
#endif
    return max(abs(st.x) * .866025 + st.y * .5, -st.y * 0.5);
}
#endif
#ifndef CIRCLESDF_FNC
#define CIRCLESDF_FNC(POS_UV) length(POS_UV)
#endif

#ifndef FNC_CIRCLESDF
#define FNC_CIRCLESDF

float circleSDF(in vec2 v) {
#ifdef CENTER_2D
    v -= CENTER_2D;
#else
    v -= 0.5;
#endif
    return CIRCLESDF_FNC(v) * 2.0;
}
#endif

#ifndef FNC_VESICASDF
#define FNC_VESICASDF
float vesicaSDF(in vec2 st, in float w) {
    vec2 offset = vec2(w*0.5,0.);
    return max( circleSDF(st-offset),
                circleSDF(st+offset));
}

float vesicaSDF(in vec2 st) {
    return vesicaSDF(st, 0.5);
}
#endif
#ifndef FNC_FLOWERSDF
#define FNC_FLOWERSDF
float flowerSDF(vec2 st, int N) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 4.0;
    float r = length(st) * 2.0;
    float a = atan(st.y, st.x);
    float v = float(N) * 0.5;
    return 1.0 - (abs(cos(a * v)) *  0.5 + 0.5) / r;
}
#endif

#ifndef FNC_BOXFRAMESDF
#define FNC_BOXFRAMESDF

float boxFrameSDF( vec3 p, vec3 b, float e ) {
    p = abs(p) - b;
    vec3 q = abs(p + e) - e;

    return min(min(
        length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
        length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
        length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

#endif
#ifndef FNC_BOXSDF
#define FNC_BOXSDF

float boxSDF( vec3 p ) {
    vec3 d = abs(p);
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float boxSDF( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_CAPSULESDF
#define FNC_CAPSULESDF

float capsuleSDF( vec3 p, vec3 a, vec3 b, float r ) {
    vec3 pa = p-a, ba = b-a;
    float h = saturate( dot(pa,ba)/dot(ba,ba) );
    return length( pa - ba*h ) - r;
}

#endif
#ifndef FNC_CONESDF
#define FNC_CONESDF

float coneSDF( in vec3 p, in vec3 c ) {
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float coneSDF( in vec3 p, in vec2 c, float h ) {
    vec2 q = h*vec2(c.x,-c.y)/c.y;
    vec2 w = vec2( length(p.xz), p.y );
    
	vec2 a = w - q*clamp( dot(w,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = w - q*vec2( clamp( w.x/q.x, 0.0, 1.0 ), 1.0 );
    float k = sign( q.y );
    float d = min(dot( a, a ),dot(b, b));
    float s = max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
	return sqrt(d)*sign(s);
}

float coneSDF( in vec3 p, in float r1, float r2, float h ) {
    vec2 q = vec2( length(p.xz), p.y );
    
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);
    float k = dot(q,vec2(-b,a));
    
    if( k < 0.0 ) return length(q) - r1;
    if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
    return dot(q, vec2(a,b) ) - r1;
}

#endif
#ifndef FNC_BOXSDF
#define FNC_BOXSDF

float boxSDF( vec3 p ) {
    vec3 d = abs(p);
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float boxSDF( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

#endif

#ifndef FNC_CUBESDF
#define FNC_CUBESDF
float cubeSDF(vec3 p, float s)  { return boxSDF(p, vec3(s)); }
#endif
#ifndef FNC_CYLINDERSDF
#define FNC_CYLINDERSDF

float cylinderSDF( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cylinderSDF( vec3 p, float h ) {
    return cylinderSDF( p, vec2(h) );
}

float cylinderSDF( vec3 p, float h, float r ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cylinderSDF(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a;
    vec3 ba = b - a;
    float baba = dot(ba,ba);
    float paba = dot(pa,ba);

    float x = length(pa*baba-ba*paba) - r*baba;
    float y = abs(paba-baba*0.5)-baba*0.5;
    float x2 = x*x;
    float y2 = y*y*baba;
    float d = (max(x,y)<0.0)?-min(x2,y2):(((x>0.0)?x2:0.0)+((y>0.0)?y2:0.0));
    return sign(d)*sqrt(abs(d))/baba;
}

#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif

#ifndef FNC_DODECAHEDRONSDF
#define FNC_DODECAHEDRONSDF

float dodecahedronSDF(vec3 p) {
    vec3 n = normalize(vec3(PHI,1.0,0.0));
    p = abs(p);
    float a = dot(p,n.xyz);
    float b = dot(p,n.zxy);
    float c = dot(p,n.yzx);
    
    return (max(max(a,b),c)-n.x);
}

float dodecahedronSDF(vec3 p, float radius) {
    vec3 n = normalize(vec3(PHI,1.0,0.0));

    p = abs(p / radius);
    float a = dot(p, n.xyz);
    float b = dot(p, n.zxy);
    float c = dot(p, n.yzx);
    return (max(max(a,b),c)-n.x) * radius;
}

#endif
#ifndef FNC_ELLIPSOIDSDF
#define FNC_ELLIPSOIDSDF

float ellipsoidSDF( in vec3 p, in vec3 r ) {
    float k0 = length(p/r);
    float k1 = length(p/(r*r));
    return k0*(k0-1.0)/k1;
}

#endif
#ifndef FNC_HEXPRISMSDF
#define FNC_HEXPRISMSDF

float hexPrismSDF( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    float d1 = q.z-h.y;
    float d2 = max((q.x*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif

#ifndef FNC_ICOSAHEDRONSDF
#define FNC_ICOSAHEDRONSDF

float icosahedronSDF(vec3 p, float radius) {
    float q = 2.61803398875; 
    vec3 n1 = normalize(vec3(q, 1,0));
    vec3 n2 = vec3(0.57735026919);  

    p = abs(p / radius);
    float a = dot(p, n1.xyz);
    float b = dot(p, n1.zxy);
    float c = dot(p, n1.yzx);
    float d = dot(p, n2) - n1.x;
    return max(max(max(a,b),c)-n1.x,d) * radius;
}

#endif
#ifndef FNC_LINKSDF
#define FNC_LINKSDF
float linkSDF( vec3 p, float le, float r1, float r2 ) {
    vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
    return length(vec2(length(q.xy)-r1,q.z)) - r2;
}
#endif
#ifndef FNC_CART2POLAR
#define FNC_CART2POLAR

vec2 cart2polar(in vec2 st) {
    return vec2(atan(st.y, st.x), length(st));
}

vec3 cart2polar( in vec3 st ) {
    float r = length(st);
    float phi = acos(st.z/r);
    float theta = atan(st.y, st.x);
    return vec3(r, phi, theta);
}

#endif

#ifndef FNC_MANDELBULBSDF
#define FNC_MANDELBULBSDF
vec2 mandelbulbSDF( in vec3 st ) {
   vec3 zeta = st;
   float m = dot(st,st);
   float dz = 1.0;
   float n = 8.0;
   const int maxiterations = 20;
   float iterations = 0.0;
   float r = 0.0; 
   float dr = 1.0;
   for (int i = 0; i < maxiterations; i+=1) {
       dz = n*pow(m, 3.5)*dz + 1.0;
       vec3 sphericalZ = cart2polar( zeta ); 
       float newx = pow(sphericalZ.x, n) * sin(sphericalZ.y*n) * cos(sphericalZ.z*n);
       float newy = pow(sphericalZ.x, n) * sin(sphericalZ.y*n) * sin(sphericalZ.z*n);
       float newz = pow(sphericalZ.x, n) * cos(sphericalZ.y*n);
       zeta.x = newx + st.x;
       zeta.y = newy + st.y;
       zeta.z = newz + st.z;

       m = dot(zeta, zeta);
       if ( m > 2.0 )
         break;
   }
 
   
   return vec2(0.25*log(m) * sqrt(m) / dz, iterations);
}
#endif
#ifndef FNC_OCTAHEDRONSDF
#define FNC_OCTAHEDRONSDF

float octahedronSDF(vec3 p, float s) {
    p = abs(p);
    float m = p.x + p.y + p.z - s;

#ifdef OCTAHEDRON_EXACT_DISTANCE
    
    vec3 o = min(3.0*p - m, 0.0);
    o = max(6.0*p - m*2.0 - o*3.0 + (o.x+o.y+o.z), 0.0);
    return length(p - s*o/(o.x+o.y+o.z));

    
#else
    
    return m*0.57735027;
#endif
}

#endif
#ifndef FNC_OCTOGONPRISMSDF
#define FNC_OCTOGONPRISMSDF

float octogonPrismSDF( in vec3 p, in float r, float h ) {
   vec3 k = vec3( -0.9238795325,   
                  0.3826834323,   
                  0.4142135623 ); 
   
   p = abs(p);
   p.xy -= 2.0*min(dot(vec2( k.x,k.y),p.xy),0.0)*vec2( k.x,k.y);
   p.xy -= 2.0*min(dot(vec2(-k.x,k.y),p.xy),0.0)*vec2(-k.x,k.y);
   
   p.xy -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
   vec2 d = vec2( length(p.xy)*sign(p.y), p.z-h );
   return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

#endif
#ifndef FNC_PLANESDF
#define FNC_PLANESDF
float planeSDF( vec3 p ) { 
   return p.y; 
}

float planeSDF(vec3 p, vec3 planePoint, vec3 planeNormal) {
    return (dot(planeNormal, p) + dot(planeNormal, planePoint)) / length(planeNormal);
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_PYRAMIDSDF
#define FNC_PYRAMIDSDF

float pyramidSDF( in vec3 p, in float h )  {
   float m2 = h*h + 0.25;
   
   
   p.xz = abs(p.xz);
   p.xz = (p.z>p.x) ? p.zx : p.xz;
   p.xz -= 0.5;

   
   vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);

   float s = max(-q.x,0.0);
   float t = saturate( (q.y-0.5*p.z)/(m2+0.25) );
   
   float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
   float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
   
   float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
   
   
   return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));;
}

#endif
#ifndef FNC_SPHERESDF
#define FNC_SPHERESDF
float sphereSDF(vec3 p) { return length(p); }
float sphereSDF(vec3 p, float s) { return sphereSDF(p) - s; }
#endif
#ifndef FNC_TETRAHEDRONSDF
#define FNC_TETRAHEDRONSDF
float tetrahedronSDF(vec3 p, float h)  {
    vec3 q = abs(p);
    
    float y = p.y;
    float d1 = q.z-max(0.,y);
    float d2 = max(q.x*.5 + y*.5,.0) - min(h, h+y);
    return length(max(vec2(d1,d2),.005)) + min(max(d1,d2), 0.0);
}
#endif
#ifndef FNC_TORUSSDF
#define FNC_TORUSSDF
float torusSDF( vec3 p, vec2 t ) { return length( vec2(length(p.xz)-t.x,p.y) )-t.y; }

float torusSDF(in vec3 p, in vec2 sc, in float ra, in float rb) {
    p.x = abs(p.x);
    float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}
#endif
#ifndef FNC_TRIPRISMSDF
#define FNC_TRIPRISMSDF

float triPrismSDF( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

#endif
#ifndef FNC_ARROWSDF
#define FNC_ARROWSDF
float arrowSDF(vec3 v, vec3 start, vec3 end, float baseRadius, float tipRadius, float tipHeight){
    vec3 t = start - end;
    float l = length(t);
    t /= l;
    l = max(l, tipHeight);
    
    v -= end;
    if(t.y + 1. < .0001) {
        v.y = -v.y;
    } else {
        float k = 1. / (1. + t.y);
        vec3 column1 = vec3( t.z * t.z * k + t.y, t.x, t.z * -t.x * k );
        vec3 column2 = vec3( -t.x , t.y , -t.z );
        vec3 column3 = vec3( -t.x * t.z * k , t.z, t.x * t.x * k + t.y );
        v = mat3( column1 , column2 , column3 ) * v;
    }
    
    vec2 q = vec2( length(v.xz) , v.y );
    q.x = abs(q.x);
    
    
    vec2 e = vec2( tipRadius , tipHeight );
    float h = clamp( dot(q,e) / dot(e,e) , 0. , 1. );
    vec2 d1 = q - e * h;
    vec2 d2 = q - vec2( tipRadius , tipHeight );
    d2.x -= clamp( d2.x , baseRadius - tipRadius , 0. );
    
    
    vec2 d3 = q - vec2( baseRadius , tipHeight );
    d3.y -= clamp( d3.y , 0. , l - tipHeight );
    vec2 d4 = vec2( q.y - l , max( q.x - baseRadius , 0. ));
    
    float s = max( 
                max( 
                    max( d1.x , -d1.y ), 
                    d4.x
                ), 
                min( d2.y , d3.x ) 
            );

    return sqrt(
             min(
                min( 
                    min(dot(d1,d1), dot(d2,d2)), 
                    dot(d3,d3) 
                ),
                dot(d4,d4)
            )
        ) * sign(s);
}
#endif

#ifndef FNC_OPONION
#define FNC_OPONION

float opOnion( in float d, in float h ) {
    return abs(d)-h;
}

#endif
#ifndef FNC_OPREPEAT
#define FNC_OPREPEAT

vec2 opRepeat( in vec2 p, in float s ) {
    return mod(p+s*0.5,s)-s*0.5;
}

vec3 opRepeat( in vec3 p, in vec3 c ) {
    return mod(p+0.5*c,c)-0.5*c;
}

vec2 opRepeat( in vec2 p, in vec2 lima, in vec2 limb, in float s ) {
    return p-s*clamp(floor(p/s),lima,limb);
}

vec3 opRepeat( in vec3 p, in vec3 lima, in vec3 limb, in float s ) {
    return p-s*clamp(floor(p/s),lima,limb);
}

#endif
#ifndef FNC_OPREVOLVE
#define FNC_OPREVOLVE

vec2 opRevolve( in vec3 p, float w ) {
    return vec2( length(p.xz) - w, p.y );
}

#endif
#ifndef FNC_OPROUND
#define FNC_OPROUND

float opRound( in float d, in float h ) {
    return d - h;
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_OPSUBSTRACTION
#define FNC_OPSUBSTRACTION

float opSubtraction( float d1, float d2 ) { return max(-d1, d2); }
vec4  opSubtraction( vec4 d1, vec4 d2 ) { return (-d1.a > d2.a) ? -d1 : d2; }

float opSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

vec4 opSubtraction( vec4 d1, vec4 d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2.a+d1.a)/k, 0.0, 1.0 );
    vec4 result = mix( d2, -d1, h );
    result.a += k*h*(1.0-h);
    return result;
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif

#ifndef FNC_OPINTERSECTION
#define FNC_OPINTERSECTION

float opIntersection( float d1, float d2 ) { return max(d1,d2); }

Material opIntersection(Material d1, Material d2) {
    if (d1.sdf > d2.sdf){
        return d1;
    } else {
        return d2;
    }
}

float opIntersection( float d1, float d2, float k ) {
    float h = saturate( 0.5 - 0.5*(d2-d1)/k );
    return mix( d2, d1, h ) + k*h*(1.0-h); 
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif

#ifndef FNC_OPUNION
#define FNC_OPUNION

float opUnion( float d1, float d2 ) { return min(d1, d2); }

Material opUnion( Material d1, Material d2 ) {
    if (d1.sdf < d2.sdf) {
        return d1;
    } else {
        return d2;
    }
}

float opUnion( float d1, float d2, float k ) {
    float h = saturate( 0.5 + 0.5*(d2-d1)/k );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

vec4 opUnion( vec4 d1, vec4 d2, float k ) {
    float h = saturate( 0.5 + 0.5*(d2.a - d1.a)/k );
    vec4 result = mix(d2, d1, h);
    result.a -= k * h * (1.0 - h);
    return result;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_LINEAR2GAMMA
#define FNC_LINEAR2GAMMA
vec3 linear2gamma(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(1.0/GAMMA));
#else
    
    return sqrt(v);
#endif
}

vec4 linear2gamma(const in vec4 v) {
    return vec4(linear2gamma(v.rgb), v.a);
}

float linear2gamma(const in float v) {
#ifdef GAMMA
    return pow(v, 1.0/GAMMA);
#else
    
    return sqrt(v);
#endif
}
#endif
#ifndef FNC_SCALE
#define FNC_SCALE
vec2 scale(in float st, in float s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in float st, in float s) {
#ifdef CENTER_2D
    return scale(st,  s, CENTER_2D);
#else
    return scale(st,  s, vec2(0.5));
#endif
}

vec2 scale(in vec2 st, in vec2 s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in vec2 st, in float s, in vec2 center) { return scale(st, vec2(s), center); }
vec2 scale(in vec2 st, in vec2 s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec2 scale(in vec2 st, in float s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in vec3 s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in float s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in vec3 s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec3 scale(in vec3 st, in float s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}

vec4 scale(in vec4 st, float s) { return vec4(scale(st.xy, s), st.zw); }
vec4 scale(in vec4 st, vec2 s) { return vec4(scale(st.xy, s), st.zw); }
#endif
#ifndef FNC_RATIO
#define FNC_RATIO
vec2 ratio(in vec2 v, in vec2 s) {
    return mix( vec2((v.x*s.x/s.y)-(s.x*.5-s.y*.5)/s.y,v.y),
                vec2(v.x,v.y*(s.y/s.x)-(s.y*.5-s.x*.5)/s.x),
                step(s.x,s.y));
}
#endif

#define RAYMARCH_SHADING_FNC raymarchShading
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif

#ifndef RAYMARCH_NORMAL_OFFSET
#define RAYMARCH_NORMAL_OFFSET 0.0001
#endif

#ifndef FNC_RAYMARCH_NORMAL
#define FNC_RAYMARCH_NORMAL

vec3 raymarchNormal(vec3 pos, vec2 pixel) {
   vec2 offset = vec2(1.0, -1.0) * pixel;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal(vec3 pos, float e) {
   vec2 offset = vec2(1.0, -1.0) * e;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal( in vec3 pos ) {
   return raymarchNormal(pos, RAYMARCH_NORMAL_OFFSET);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif
#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef IOR_AIR
#define IOR_AIR 1.000293
#endif

#ifndef IOR_ICE
#define IOR_ICE 1.31
#endif

#ifndef IOR_WATER
#define IOR_WATER 1.333
#endif

#ifndef IOR_WATER_RGB
#define IOR_WATER_RGB vec3(1.337, 1.333, 1.331)
#endif

#ifndef IOR_GLYCERING
#define IOR_GLYCERING 1.473
#endif

#ifndef IOR_OIL
#define IOR_OIL 1.515
#endif

#ifndef IOR_OIL_RGB
#define IOR_OIL_RGB vec3(1.530, 1.520, 1.516)
#endif

#ifndef IOR_GLASS
#define IOR_GLASS 1.5168
#endif

#ifndef IOR_GLASS_RGB
#define IOR_GLASS_RGB vec3(1.524, 1.517, 1.515)
#endif

#ifndef IOR_GLASS_FLINT 
#define IOR_GLASS_FLINT 1.69
#endif

#ifndef IOR_GLASS_FLINT_RGB 
#define IOR_GLASS_FLINT_RGB vec3(1.639, 1.627, 1.622)
#endif

#ifndef IOR_SAPPHIRE
#define IOR_SAPPHIRE 1.77
#endif

#ifndef IOR_DIAMONG
#define IOR_DIAMONG 2.42
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef SURFACE_POSITION
#define SURFACE_POSITION vec3(0.0, 0.0, 0.0)
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef FNC_MATERIAL_NEW
#define FNC_MATERIAL_NEW

void materialNew(out Material _mat) {
    
    _mat.position           = (SURFACE_POSITION).xyz;
    _mat.normal             = materialNormal();

#if defined(RENDER_RAYMARCHING)
    _mat.sdf                = RAYMARCH_MAX_DIST;
    _mat.valid              = true;
#endif

    #if defined(SCENE_BACK_SURFACE) && defined(RESOLUTION)
        vec4 back_surface       = SAMPLER_FNC(SCENE_BACK_SURFACE, gl_FragCoord.xy / RESOLUTION);
        _mat.normal_back        = back_surface.xyz;
    #else
        #if defined(SCENE_BACK_SURFACE)
        
        _mat.normal_back        = -_mat.normal;
        #endif
    #endif

    
    _mat.albedo             = materialAlbedo();
    _mat.emissive           = materialEmissive();
    _mat.roughness          = materialRoughness();
    _mat.metallic           = materialMetallic();
    _mat.reflectance        = 0.5;

    _mat.ior                = vec3(IOR_GLASS_RGB);      

    _mat.ambientOcclusion   = materialOcclusion();

#if defined (SHADING_MODEL_CLEAR_COAT)
    _mat.clearCoat          = 0.0;
    _mat.clearCoatRoughness = 0.01;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    _mat.clearCoatNormal    = vec3(0.0, 0.0, 1.0);
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    _mat.thickness          = 300.0;
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    _mat.subsurfaceColor    = _mat.albedo.rgb;
    _mat.subsurfacePower    = 12.234;
    _mat.subsurfaceThickness = 20.0;

    
    
    #if defined(LIGHT_SHADOWMAP) && defined(LIGHT_COORD)
    {
        vec3 shadowCoord = LIGHT_COORD.xyz / LIGHT_COORD.w;
        float Di = SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy).r;
        float Do = LIGHT_COORD.z;
        float delta = Do - Di;

        #if defined(LIGHT_SHADOWMAP_SIZE) && !defined(PLATFORM_RPI)
        vec2 shadowmap_pixel = 1.0/vec2(LIGHT_SHADOWMAP_SIZE);
        shadowmap_pixel *= pow(delta, 0.6) * 20.0;

        Di = 0.0;
        for (float x= -2.0; x <= 2.0; x++)
            for (float y= -2.0; y <= 2.0; y++) 
                Di += SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy + vec2(x,y) * shadowmap_pixel).r;
        Di *= 0.04; 
        delta = Do - Di;
        #endif

        
        _mat.subsurfaceThickness = max(Do - Di, 0.005) * 30.0;
    }
    #endif

#endif
}

Material materialNew() {
    Material mat;
    materialNew(mat);
    return mat;
}

Material materialNew(vec3 albedo, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.sdf = sdf;
    return mat;
}

Material materialNew(vec3 albedo, float roughness, float metallic, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.metallic = metallic;
    mat.roughness = roughness;
    mat.sdf = sdf;
    return mat;
}

#endif

#ifndef RAYMARCH_SAMPLES
#define RAYMARCH_SAMPLES 256
#endif

#ifndef RAYMARCH_MIN_DIST
#define RAYMARCH_MIN_DIST 0.1
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef RAYMARCH_MIN_HIT_DIST
#define RAYMARCH_MIN_HIT_DIST 0.00001 * t
#endif

#ifndef FNC_RAYMARCH_CAST
#define FNC_RAYMARCH_CAST

Material raymarchCast( in vec3 ro, in vec3 rd ) {
    float tmin = RAYMARCH_MIN_DIST;
    float tmax = RAYMARCH_MAX_DIST;
   
    float t = tmin;
    Material m = materialNew();
    m.valid = false;
    for (int i = 0; i < RAYMARCH_SAMPLES; i++) {
        Material res = RAYMARCH_MAP_FNC(ro + rd * t);
        if (res.sdf < RAYMARCH_MIN_HIT_DIST || t > tmax) 
            break;
        m = res;
        t += res.sdf;
    }

    #if defined(RAYMARCH_BACKGROUND) || defined(RAYMARCH_FLOOR)
    if ( t > tmax )
        m.valid = false;
    #endif

    m.sdf = t;
    return m;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef RAYMARCH_AO_SAMPLES
#define RAYMARCH_AO_SAMPLES 5
#endif

#ifndef RAYMARCH_AO_INTENSITY
#define RAYMARCH_AO_INTENSITY 1.0
#endif

#ifndef RAYMARCH_AO_MIN_DIST
#define RAYMARCH_AO_MIN_DIST 0.001
#endif

#ifndef RAYMARCH_AO_MAX_DIST
#define RAYMARCH_AO_MAX_DIST 0.2
#endif

#ifndef RAYMARCH_AO_FALLOFF
#define RAYMARCH_AO_FALLOFF 0.95
#endif

#ifndef FNC_RAYMARCH_AO
#define FNC_RAYMARCH_AO

float raymarchAO(in vec3 pos, in vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    const float samplesFactor = 1.0 / float(RAYMARCH_AO_SAMPLES-1);
    for (int i = 0; i < RAYMARCH_AO_SAMPLES; i++) {
        float h = RAYMARCH_AO_MIN_DIST + RAYMARCH_AO_MAX_DIST * float(i) * samplesFactor;
        float d = RAYMARCH_MAP_FNC(pos + h * nor).sdf;
        occ += (h - d) * sca;
        sca *= RAYMARCH_AO_FALLOFF;
    }
    return saturate(1.0 - RAYMARCH_AO_INTENSITY * occ);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef RAYMARCH_SOFTSHADOW_ITERATIONS
#define RAYMARCH_SOFTSHADOW_ITERATIONS 64
#endif

#ifndef RAYMARCH_SHADOW_MIN_DIST
#define RAYMARCH_SHADOW_MIN_DIST 0.005
#endif

#ifndef RAYMARCH_SHADOW_MAX_DIST
#define RAYMARCH_SHADOW_MAX_DIST RAYMARCH_MAX_DIST
#endif

#ifndef RAYMARCH_SHADOW_SOLID_ANGLE
#define RAYMARCH_SHADOW_SOLID_ANGLE 0.1
#endif

#ifndef FNC_RAYMARCH_SOFTSHADOW
#define FNC_RAYMARCH_SOFTSHADOW

float raymarchSoftShadow(vec3 ro, vec3 rd) {
    const float mint = RAYMARCH_SHADOW_MIN_DIST;
    const float maxt = RAYMARCH_SHADOW_MAX_DIST;
    const float w = RAYMARCH_SHADOW_SOLID_ANGLE;

    float res = 1.0;
    float t = mint;
    for (int i = 0; i < RAYMARCH_SOFTSHADOW_ITERATIONS; i++) {
        if (t >= maxt)
            break;
        float h = RAYMARCH_MAP_FNC(ro + t * rd).sdf;
        res = min(res, h / (w * t));

        t += clamp(h, RAYMARCH_SHADOW_MIN_DIST, RAYMARCH_SHADOW_MAX_DIST);
        if (res < -1.0 || t > maxt)
            break;
    }
    res = max(res, -1.0);
    return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}

#endif
#ifndef STR_SHADING_DATA
#define STR_SHADING_DATA

struct ShadingData {
   vec3 V;
   vec3 N;
   vec3 H;
   vec3 L;
   vec3 R;

   float NoV;
   float NoL;
   float NoH;

   float roughness;
   float linearRoughness;
   vec3 diffuseColor;
   vec3 specularColor;

   vec3 energyCompensation;

   vec3 directDiffuse;
   vec3 directSpecular;
   vec3 indirectDiffuse;
   vec3 indirectSpecular;
};

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_REFLECTION
#define FNC_REFLECTION

vec3 reflection(const in vec3 _V, const in vec3 _N, const in float _roughness) {
        
#ifdef MATERIAL_ANISOTROPY
    vec3  anisotropicT = MATERIAL_ANISOTROPY_DIRECTION;
    vec3  anisotropicB = MATERIAL_ANISOTROPY_DIRECTION;

    #ifdef MODEL_VERTEX_TANGENT
    anisotropicT = normalize(v_tangentToWorld * MATERIAL_ANISOTROPY_DIRECTION);
    anisotropicB = normalize(cross(v_tangentToWorld[2], anisotropicT));
    #endif

    vec3  anisotropyDirection = MATERIAL_ANISOTROPY >= 0.0 ? anisotropicB : anisotropicT;
    vec3  anisotropicTangent  = cross(anisotropyDirection, _V);
    vec3  anisotropicNormal   = cross(anisotropicTangent, anisotropyDirection);
    float bendFactor          = abs(MATERIAL_ANISOTROPY) * saturate(5.0 * _roughness);
    vec3  bentNormal          = normalize(mix(_N, anisotropicNormal, bendFactor));
    return reflect(-_V, bentNormal);
#else

    return reflect(-_V, _N);
#endif

}

#endif
#ifndef FNC_REFLECTANCE2F0
#define FNC_REFLECTANCE2F0
float reflectance2f0(const float reflectance) { return 0.16 * reflectance * reflectance; }
#endif
#ifndef MIN_PERCEPTUAL_ROUGHNESS
#define MIN_PERCEPTUAL_ROUGHNESS 0.045
#endif

#ifndef FNC_PERCEPTUAL_LINEAR_ROUGHNESS
#define FNC_PERCEPTUAL_LINEAR_ROUGHNESS

float perceptual2linearRoughness(float perceptualRoughness) {
    perceptualRoughness = clamp(perceptualRoughness, MIN_PERCEPTUAL_ROUGHNESS, 1.0);
    return perceptualRoughness * perceptualRoughness;
}

#endif

#ifndef FNC_SHADING_DATA_NEW
#define FNC_SHADING_DATA_NEW 

ShadingData shadingDataNew() {
   ShadingData shadingData;

   shadingData.V = vec3(0.0, 0.0, 0.0);
   shadingData.N = vec3(0.0, 0.0, 0.0);
   shadingData.H = vec3(0.0, 0.0, 0.0);
   shadingData.L = vec3(0.0, 0.0, 0.0);
   shadingData.R = vec3(0.0, 0.0, 0.0);

   shadingData.NoV = 0.0;
   shadingData.NoL = 0.0;
   shadingData.NoH = 0.0;

   shadingData.roughness = 0.0;
   shadingData.linearRoughness = 0.0;
   shadingData.diffuseColor = vec3(0.0, 0.0, 0.0);
   shadingData.specularColor = vec3(0.0, 0.0, 0.0);

   shadingData.energyCompensation = vec3(1.0, 1.0, 1.0);

   shadingData.directDiffuse = vec3(0.0, 0.0, 0.0);
   shadingData.directSpecular = vec3(0.0, 0.0, 0.0);
   shadingData.indirectDiffuse = vec3(0.0, 0.0, 0.0);
   shadingData.indirectSpecular = vec3(0.0, 0.0, 0.0);

   return shadingData;
}

void shadingDataNew(Material mat, inout ShadingData shadingData) {
   float dielectricF0 = reflectance2f0(mat.reflectance);
   shadingData.N = mat.normal;
   shadingData.R = reflection(shadingData.V, shadingData.N, mat.roughness);
   shadingData.NoV = dot(shadingData.N, shadingData.V);
   shadingData.roughness = max(mat.roughness, MIN_PERCEPTUAL_ROUGHNESS);
   shadingData.linearRoughness = perceptual2linearRoughness(shadingData.roughness);
   shadingData.diffuseColor = mat.albedo.rgb * (1.0 - mat.metallic);
   shadingData.specularColor = mix(vec3(dielectricF0, dielectricF0, dielectricF0), mat.albedo.rgb, mat.metallic);
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef LIGHT_POSITION
#define LIGHT_POSITION vec3(0.0, 10.0, -50.0)
#endif

#ifndef LIGHT_COLOR
#define LIGHT_COLOR vec3(1.0, 1.0, 1.0)
#endif

#ifndef RAYMARCH_AMBIENT
#define RAYMARCH_AMBIENT vec3(1.0, 1.0, 1.0)
#endif

#ifndef RAYMARCH_SHADING_FNC
#define RAYMARCH_SHADING_FNC raymarchDefaultShading
#endif

#ifndef FNC_RAYMARCH_DEFAULTSHADING
#define FNC_RAYMARCH_DEFAULTSHADING

vec4 raymarchDefaultShading(Material m, ShadingData shadingData) {
    
    
    vec3 worldNormal = m.normal;
    vec3 worldPosition = m.position;

    #if defined(LIGHT_DIRECTION)
    vec3 lig = normalize(LIGHT_DIRECTION);
    #else
    vec3 lig = normalize(LIGHT_POSITION - m.position);
    #endif
    
    vec3 ref = reflect(-shadingData.V, m.normal);
    float occ = raymarchAO(m.position, m.normal);

    vec3 hal = normalize(lig + shadingData.V);
    float amb = saturate(0.5 + 0.5 * m.normal.y);
    float dif = saturate(dot(m.normal, lig));
    float bac = saturate(dot(m.normal, normalize(vec3(-lig.x, 0.0, -lig.z)))) * saturate(1.0 - m.position.y);
    float dom = smoothstep( -0.1, 0.1, ref.y );
    float fre = pow(saturate(1.0 + dot(m.normal, -shadingData.V)), 2.0);
    
    dif *= raymarchSoftShadow(m.position, lig);
    dom *= raymarchSoftShadow(m.position, ref);

    vec3 env = RAYMARCH_AMBIENT;
    vec3 shade = vec3(0.0, 0.0, 0.0);
    shade += 1.30 * dif * LIGHT_COLOR;
    shade += 0.40 * amb * occ * env;
    shade += 0.50 * dom * occ * env;
    shade += 0.50 * bac * occ * 0.25;
    shade += 0.25 * fre * occ;

    return vec4(m.albedo.rgb * shade, m.albedo.a);
}

#endif

vec4 raymarchShading(Material m, ShadingData shadingData) {
    vec3 env = RAYMARCH_AMBIENT;
    
    vec3 worldNormal = m.normal;
    vec3 worldPosition = m.position;
    
    #if defined(LIGHT_DIRECTION)
    vec3 lig = normalize(LIGHT_DIRECTION);
    #else
    vec3 lig = normalize(LIGHT_POSITION - m.position);
    #endif
    
    vec3 ref = reflect(-shadingData.V, m.normal);
    float occ = raymarchAO(m.position, m.normal);
    
    vec3 hal = normalize(lig + shadingData.V);
    float amb = saturate(0.5 + 0.5 * m.normal.y);
    float dif = saturate(dot(m.normal, lig));
    float bac = saturate(dot(m.normal, normalize(vec3(-lig.x, 0.0, - lig.z)))) * saturate(1.0 - m.position.y);
    float dom = smoothstep(-0.1, 0.1, ref.y);
    float fre = pow(saturate(1.0 + dot(m.normal, - shadingData.V)), 2.0);
    
    float fog = 1.0;
    fog = smoothstep(m.position.y, - 0.1, 0.0);
    
    vec3 extra = bac * vec3(0.0, 0.0, 1.0);
    
    vec3 brdf = vec3(0.0);
    brdf += 1.30 * dif * LIGHT_COLOR;
    brdf += 0.50 * amb * occ * env;
    #ifdef COLOR_DOM
    brdf += 0.5 * dom * COLOR_DOM * occ * env;
    #endif
    #ifdef COLOR_BAC
    brdf += 0.3 * bac * COLOR_BAC;
    #endif
    #ifdef COLOR_FRE
    brdf += 1.5 * fre * COLOR_FRE * occ;
    #endif
    brdf = mix(RAYMARCH_BACKGROUND, brdf + extra, fog);
    
    return vec4(brdf, m.albedo.a * fog);
}

#ifndef FNC_TOMAT3
#define FNC_TOMAT3
mat3 toMat3(mat4 m) {
    #if __VERSION__ >= 300
    return mat3(m);
    #else
    return mat3(m[0].xyz, m[1].xyz, m[2].xyz);
    #endif
}
#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif
#ifndef FNC_ROTATE2D
#define FNC_ROTATE2D
mat2 rotate2d(const in float r){
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}
#endif
#ifndef FNC_ROTATE4D
#define FNC_ROTATE4D
mat4 rotate4d(in vec3 a, const in float r) {
    a = normalize(a);
    float s = sin(r);
    float c = cos(r);
    float oc = 1.0 - c;
    vec4 col1 = vec4(oc * a.x * a.x + c, oc * a.x * a.y + a.z * s, oc * a.z * a.x - a.y * s, 0.0);
    vec4 col2 = vec4(oc * a.x * a.y - a.z * s, oc * a.y * a.y + c, oc * a.y * a.z + a.x * s, 0.0);
    vec4 col3 = vec4(oc * a.z * a.x + a.y * s, oc * a.y * a.z - a.x * s, oc * a.z * a.z + c, 0.0);
    vec4 col4 = vec4(0.0, 0.0, 0.0, 1.0);
    return mat4(col1, col2, col3, col4);
}
#endif

#ifndef FNC_ROTATE
#define FNC_ROTATE
vec2 rotate(in vec2 v, in float r, in vec2 c) {
    return rotate2d(r) * (v - c) + c;
}

vec2 rotate(in vec2 v, in float r) {
    #ifdef CENTER_2D
    return rotate(v, r, CENTER_2D);
    #else
    return rotate(v, r, vec2(.5));
    #endif
}

vec2 rotate(vec2 v, vec2 x_axis) {
    #ifdef CENTER_2D
    v -= CENTER_2D;
    #endif
    vec2 rta = vec2( dot(v, vec2(-x_axis.y, x_axis.x)), dot(v, x_axis) );
    #ifdef CENTER_2D
    rta += CENTER_2D;
    #endif
    return rta;
}

vec3 rotate(in vec3 v, in float r, in vec3 axis, in vec3 c) {
    return (rotate4d(axis, r) * vec4(v - c, 1.)).xyz + c;
}

vec3 rotate(in vec3 v, in float r, in vec3 axis) {
    #ifdef CENTER_3D
    return rotate(v, r, axis, CENTER_3D);
    #else
    return rotate(v, r, axis, vec3(0.));
    #endif
}

vec4 rotate(in vec4 v, in float r, in vec3 axis, in vec4 c) {
    return rotate4d(axis, r) * (v - c) + c;
}

vec4 rotate(in vec4 v, in float r, in vec3 axis) {
    #ifdef CENTER_4D
    return rotate(v, r, axis, CENTER_4D);
    #else
    return rotate(v, r, axis, vec4(0.));
    #endif
}

#if defined(FNC_QUATMULT)
vec3 rotate(QUAT q, vec3 v) {
    QUAT q_c = QUAT(-q.x, -q.y, -q.z, q.w);
    return quatMul(q, quatMul(vec4(v, 0), q_c)).xyz;
}

vec3 rotate(QUAT q, vec3 v, vec3 c) {
    vec3 dir = v - c;
    return c + rotate(q, dir);
}
#endif

#endif
#ifndef FNC_LOOKAT
#define FNC_LOOKAT

mat3 lookAt(vec3 forward, vec3 up) {
    vec3 zaxis = normalize(forward);
#if defined(LOOK_AT_RIGHT_HANDED)
    vec3 xaxis = normalize(cross(zaxis, up));
    vec3 yaxis = cross(xaxis, zaxis);
#else
    vec3 xaxis = normalize(cross(up, zaxis));
    vec3 yaxis = cross(zaxis, xaxis);
#endif
    return mat3(xaxis, yaxis, zaxis);
}

mat3 lookAt(vec3 eye, vec3 target, vec3 up) {
    vec3 forward = normalize(target - eye);
    return lookAt(forward, up);
}

mat3 lookAt(vec3 eye, vec3 target, float roll) {
    vec3 up = vec3(sin(roll), cos(roll), 0.0);
    return lookAt(eye, target, up);
}

mat3 lookAt(vec3 forward) {
    return lookAt(forward, vec3(0.0, 1.0, 0.0));
}

#endif
#ifndef FNC_TRANSLATE
#define FNC_TRANSLATE

 mat4 translate(mat3 m, vec3 translation) {
    return mat4(
        vec4(m[0], 0.0),
        vec4(m[1], 0.0),
        vec4(m[2], 0.0),
        vec4(translation, 1.0)
    );
}

#endif

#ifndef FNC_LOOKATVIEW
#define FNC_LOOKATVIEW

mat4 lookAtView( in vec3 position, in vec3 target, in vec3 up ) {
    mat3 m = lookAt(position, target, up);
    return translate(m, position);
}

mat4 lookAtView( in vec3 position, in vec3 target, in float roll ) {
    mat3 m = lookAt(position, target, roll);
    return translate(m, position);
}

mat4 lookAtView( in vec3 position, in vec3 lookAt ) {
    return lookAtView(position, lookAt, vec3(0.0, 1.0, 0.0));
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif
#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef IOR_AIR
#define IOR_AIR 1.000293
#endif

#ifndef IOR_ICE
#define IOR_ICE 1.31
#endif

#ifndef IOR_WATER
#define IOR_WATER 1.333
#endif

#ifndef IOR_WATER_RGB
#define IOR_WATER_RGB vec3(1.337, 1.333, 1.331)
#endif

#ifndef IOR_GLYCERING
#define IOR_GLYCERING 1.473
#endif

#ifndef IOR_OIL
#define IOR_OIL 1.515
#endif

#ifndef IOR_OIL_RGB
#define IOR_OIL_RGB vec3(1.530, 1.520, 1.516)
#endif

#ifndef IOR_GLASS
#define IOR_GLASS 1.5168
#endif

#ifndef IOR_GLASS_RGB
#define IOR_GLASS_RGB vec3(1.524, 1.517, 1.515)
#endif

#ifndef IOR_GLASS_FLINT 
#define IOR_GLASS_FLINT 1.69
#endif

#ifndef IOR_GLASS_FLINT_RGB 
#define IOR_GLASS_FLINT_RGB vec3(1.639, 1.627, 1.622)
#endif

#ifndef IOR_SAPPHIRE
#define IOR_SAPPHIRE 1.77
#endif

#ifndef IOR_DIAMONG
#define IOR_DIAMONG 2.42
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef SURFACE_POSITION
#define SURFACE_POSITION vec3(0.0, 0.0, 0.0)
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef FNC_MATERIAL_NEW
#define FNC_MATERIAL_NEW

void materialNew(out Material _mat) {
    
    _mat.position           = (SURFACE_POSITION).xyz;
    _mat.normal             = materialNormal();

#if defined(RENDER_RAYMARCHING)
    _mat.sdf                = RAYMARCH_MAX_DIST;
    _mat.valid              = true;
#endif

    #if defined(SCENE_BACK_SURFACE) && defined(RESOLUTION)
        vec4 back_surface       = SAMPLER_FNC(SCENE_BACK_SURFACE, gl_FragCoord.xy / RESOLUTION);
        _mat.normal_back        = back_surface.xyz;
    #else
        #if defined(SCENE_BACK_SURFACE)
        
        _mat.normal_back        = -_mat.normal;
        #endif
    #endif

    
    _mat.albedo             = materialAlbedo();
    _mat.emissive           = materialEmissive();
    _mat.roughness          = materialRoughness();
    _mat.metallic           = materialMetallic();
    _mat.reflectance        = 0.5;

    _mat.ior                = vec3(IOR_GLASS_RGB);      

    _mat.ambientOcclusion   = materialOcclusion();

#if defined (SHADING_MODEL_CLEAR_COAT)
    _mat.clearCoat          = 0.0;
    _mat.clearCoatRoughness = 0.01;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    _mat.clearCoatNormal    = vec3(0.0, 0.0, 1.0);
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    _mat.thickness          = 300.0;
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    _mat.subsurfaceColor    = _mat.albedo.rgb;
    _mat.subsurfacePower    = 12.234;
    _mat.subsurfaceThickness = 20.0;

    
    
    #if defined(LIGHT_SHADOWMAP) && defined(LIGHT_COORD)
    {
        vec3 shadowCoord = LIGHT_COORD.xyz / LIGHT_COORD.w;
        float Di = SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy).r;
        float Do = LIGHT_COORD.z;
        float delta = Do - Di;

        #if defined(LIGHT_SHADOWMAP_SIZE) && !defined(PLATFORM_RPI)
        vec2 shadowmap_pixel = 1.0/vec2(LIGHT_SHADOWMAP_SIZE);
        shadowmap_pixel *= pow(delta, 0.6) * 20.0;

        Di = 0.0;
        for (float x= -2.0; x <= 2.0; x++)
            for (float y= -2.0; y <= 2.0; y++) 
                Di += SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy + vec2(x,y) * shadowmap_pixel).r;
        Di *= 0.04; 
        delta = Do - Di;
        #endif

        
        _mat.subsurfaceThickness = max(Do - Di, 0.005) * 30.0;
    }
    #endif

#endif
}

Material materialNew() {
    Material mat;
    materialNew(mat);
    return mat;
}

Material materialNew(vec3 albedo, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.sdf = sdf;
    return mat;
}

Material materialNew(vec3 albedo, float roughness, float metallic, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.metallic = metallic;
    mat.roughness = roughness;
    mat.sdf = sdf;
    return mat;
}

#endif

#ifndef RAYMARCH_SAMPLES
#define RAYMARCH_SAMPLES 256
#endif

#ifndef RAYMARCH_MIN_DIST
#define RAYMARCH_MIN_DIST 0.1
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef RAYMARCH_MIN_HIT_DIST
#define RAYMARCH_MIN_HIT_DIST 0.00001 * t
#endif

#ifndef FNC_RAYMARCH_CAST
#define FNC_RAYMARCH_CAST

Material raymarchCast( in vec3 ro, in vec3 rd ) {
    float tmin = RAYMARCH_MIN_DIST;
    float tmax = RAYMARCH_MAX_DIST;
   
    float t = tmin;
    Material m = materialNew();
    m.valid = false;
    for (int i = 0; i < RAYMARCH_SAMPLES; i++) {
        Material res = RAYMARCH_MAP_FNC(ro + rd * t);
        if (res.sdf < RAYMARCH_MIN_HIT_DIST || t > tmax) 
            break;
        m = res;
        t += res.sdf;
    }

    #if defined(RAYMARCH_BACKGROUND) || defined(RAYMARCH_FLOOR)
    if ( t > tmax )
        m.valid = false;
    #endif

    m.sdf = t;
    return m;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef RAYMARCH_AO_SAMPLES
#define RAYMARCH_AO_SAMPLES 5
#endif

#ifndef RAYMARCH_AO_INTENSITY
#define RAYMARCH_AO_INTENSITY 1.0
#endif

#ifndef RAYMARCH_AO_MIN_DIST
#define RAYMARCH_AO_MIN_DIST 0.001
#endif

#ifndef RAYMARCH_AO_MAX_DIST
#define RAYMARCH_AO_MAX_DIST 0.2
#endif

#ifndef RAYMARCH_AO_FALLOFF
#define RAYMARCH_AO_FALLOFF 0.95
#endif

#ifndef FNC_RAYMARCH_AO
#define FNC_RAYMARCH_AO

float raymarchAO(in vec3 pos, in vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    const float samplesFactor = 1.0 / float(RAYMARCH_AO_SAMPLES-1);
    for (int i = 0; i < RAYMARCH_AO_SAMPLES; i++) {
        float h = RAYMARCH_AO_MIN_DIST + RAYMARCH_AO_MAX_DIST * float(i) * samplesFactor;
        float d = RAYMARCH_MAP_FNC(pos + h * nor).sdf;
        occ += (h - d) * sca;
        sca *= RAYMARCH_AO_FALLOFF;
    }
    return saturate(1.0 - RAYMARCH_AO_INTENSITY * occ);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif

#ifndef RAYMARCH_NORMAL_OFFSET
#define RAYMARCH_NORMAL_OFFSET 0.0001
#endif

#ifndef FNC_RAYMARCH_NORMAL
#define FNC_RAYMARCH_NORMAL

vec3 raymarchNormal(vec3 pos, vec2 pixel) {
   vec2 offset = vec2(1.0, -1.0) * pixel;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal(vec3 pos, float e) {
   vec2 offset = vec2(1.0, -1.0) * e;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal( in vec3 pos ) {
   return raymarchNormal(pos, RAYMARCH_NORMAL_OFFSET);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif

#ifndef RAYMARCH_NORMAL_OFFSET
#define RAYMARCH_NORMAL_OFFSET 0.0001
#endif

#ifndef FNC_RAYMARCH_NORMAL
#define FNC_RAYMARCH_NORMAL

vec3 raymarchNormal(vec3 pos, vec2 pixel) {
   vec2 offset = vec2(1.0, -1.0) * pixel;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal(vec3 pos, float e) {
   vec2 offset = vec2(1.0, -1.0) * e;
   return normalize( offset.xyy * RAYMARCH_MAP_FNC( pos + offset.xyy ).sdf +
                     offset.yyx * RAYMARCH_MAP_FNC( pos + offset.yyx ).sdf +
                     offset.yxy * RAYMARCH_MAP_FNC( pos + offset.yxy ).sdf +
                     offset.xxx * RAYMARCH_MAP_FNC( pos + offset.xxx ).sdf );
}

vec3 raymarchNormal( in vec3 pos ) {
   return raymarchNormal(pos, RAYMARCH_NORMAL_OFFSET);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif
#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef IOR_AIR
#define IOR_AIR 1.000293
#endif

#ifndef IOR_ICE
#define IOR_ICE 1.31
#endif

#ifndef IOR_WATER
#define IOR_WATER 1.333
#endif

#ifndef IOR_WATER_RGB
#define IOR_WATER_RGB vec3(1.337, 1.333, 1.331)
#endif

#ifndef IOR_GLYCERING
#define IOR_GLYCERING 1.473
#endif

#ifndef IOR_OIL
#define IOR_OIL 1.515
#endif

#ifndef IOR_OIL_RGB
#define IOR_OIL_RGB vec3(1.530, 1.520, 1.516)
#endif

#ifndef IOR_GLASS
#define IOR_GLASS 1.5168
#endif

#ifndef IOR_GLASS_RGB
#define IOR_GLASS_RGB vec3(1.524, 1.517, 1.515)
#endif

#ifndef IOR_GLASS_FLINT 
#define IOR_GLASS_FLINT 1.69
#endif

#ifndef IOR_GLASS_FLINT_RGB 
#define IOR_GLASS_FLINT_RGB vec3(1.639, 1.627, 1.622)
#endif

#ifndef IOR_SAPPHIRE
#define IOR_SAPPHIRE 1.77
#endif

#ifndef IOR_DIAMONG
#define IOR_DIAMONG 2.42
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef SURFACE_POSITION
#define SURFACE_POSITION vec3(0.0, 0.0, 0.0)
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef FNC_MATERIAL_NEW
#define FNC_MATERIAL_NEW

void materialNew(out Material _mat) {
    
    _mat.position           = (SURFACE_POSITION).xyz;
    _mat.normal             = materialNormal();

#if defined(RENDER_RAYMARCHING)
    _mat.sdf                = RAYMARCH_MAX_DIST;
    _mat.valid              = true;
#endif

    #if defined(SCENE_BACK_SURFACE) && defined(RESOLUTION)
        vec4 back_surface       = SAMPLER_FNC(SCENE_BACK_SURFACE, gl_FragCoord.xy / RESOLUTION);
        _mat.normal_back        = back_surface.xyz;
    #else
        #if defined(SCENE_BACK_SURFACE)
        
        _mat.normal_back        = -_mat.normal;
        #endif
    #endif

    
    _mat.albedo             = materialAlbedo();
    _mat.emissive           = materialEmissive();
    _mat.roughness          = materialRoughness();
    _mat.metallic           = materialMetallic();
    _mat.reflectance        = 0.5;

    _mat.ior                = vec3(IOR_GLASS_RGB);      

    _mat.ambientOcclusion   = materialOcclusion();

#if defined (SHADING_MODEL_CLEAR_COAT)
    _mat.clearCoat          = 0.0;
    _mat.clearCoatRoughness = 0.01;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    _mat.clearCoatNormal    = vec3(0.0, 0.0, 1.0);
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    _mat.thickness          = 300.0;
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    _mat.subsurfaceColor    = _mat.albedo.rgb;
    _mat.subsurfacePower    = 12.234;
    _mat.subsurfaceThickness = 20.0;

    
    
    #if defined(LIGHT_SHADOWMAP) && defined(LIGHT_COORD)
    {
        vec3 shadowCoord = LIGHT_COORD.xyz / LIGHT_COORD.w;
        float Di = SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy).r;
        float Do = LIGHT_COORD.z;
        float delta = Do - Di;

        #if defined(LIGHT_SHADOWMAP_SIZE) && !defined(PLATFORM_RPI)
        vec2 shadowmap_pixel = 1.0/vec2(LIGHT_SHADOWMAP_SIZE);
        shadowmap_pixel *= pow(delta, 0.6) * 20.0;

        Di = 0.0;
        for (float x= -2.0; x <= 2.0; x++)
            for (float y= -2.0; y <= 2.0; y++) 
                Di += SAMPLER_FNC(LIGHT_SHADOWMAP, LIGHT_COORD.xy + vec2(x,y) * shadowmap_pixel).r;
        Di *= 0.04; 
        delta = Do - Di;
        #endif

        
        _mat.subsurfaceThickness = max(Do - Di, 0.005) * 30.0;
    }
    #endif

#endif
}

Material materialNew() {
    Material mat;
    materialNew(mat);
    return mat;
}

Material materialNew(vec3 albedo, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.sdf = sdf;
    return mat;
}

Material materialNew(vec3 albedo, float roughness, float metallic, float sdf) {
    Material mat = materialNew();
    mat.albedo.rgb = albedo;
    mat.metallic = metallic;
    mat.roughness = roughness;
    mat.sdf = sdf;
    return mat;
}

#endif

#ifndef RAYMARCH_SAMPLES
#define RAYMARCH_SAMPLES 256
#endif

#ifndef RAYMARCH_MIN_DIST
#define RAYMARCH_MIN_DIST 0.1
#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef RAYMARCH_MIN_HIT_DIST
#define RAYMARCH_MIN_HIT_DIST 0.00001 * t
#endif

#ifndef FNC_RAYMARCH_CAST
#define FNC_RAYMARCH_CAST

Material raymarchCast( in vec3 ro, in vec3 rd ) {
    float tmin = RAYMARCH_MIN_DIST;
    float tmax = RAYMARCH_MAX_DIST;
   
    float t = tmin;
    Material m = materialNew();
    m.valid = false;
    for (int i = 0; i < RAYMARCH_SAMPLES; i++) {
        Material res = RAYMARCH_MAP_FNC(ro + rd * t);
        if (res.sdf < RAYMARCH_MIN_HIT_DIST || t > tmax) 
            break;
        m = res;
        t += res.sdf;
    }

    #if defined(RAYMARCH_BACKGROUND) || defined(RAYMARCH_FLOOR)
    if ( t > tmax )
        m.valid = false;
    #endif

    m.sdf = t;
    return m;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef RAYMARCH_AO_SAMPLES
#define RAYMARCH_AO_SAMPLES 5
#endif

#ifndef RAYMARCH_AO_INTENSITY
#define RAYMARCH_AO_INTENSITY 1.0
#endif

#ifndef RAYMARCH_AO_MIN_DIST
#define RAYMARCH_AO_MIN_DIST 0.001
#endif

#ifndef RAYMARCH_AO_MAX_DIST
#define RAYMARCH_AO_MAX_DIST 0.2
#endif

#ifndef RAYMARCH_AO_FALLOFF
#define RAYMARCH_AO_FALLOFF 0.95
#endif

#ifndef FNC_RAYMARCH_AO
#define FNC_RAYMARCH_AO

float raymarchAO(in vec3 pos, in vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    const float samplesFactor = 1.0 / float(RAYMARCH_AO_SAMPLES-1);
    for (int i = 0; i < RAYMARCH_AO_SAMPLES; i++) {
        float h = RAYMARCH_AO_MIN_DIST + RAYMARCH_AO_MAX_DIST * float(i) * samplesFactor;
        float d = RAYMARCH_MAP_FNC(pos + h * nor).sdf;
        occ += (h - d) * sca;
        sca *= RAYMARCH_AO_FALLOFF;
    }
    return saturate(1.0 - RAYMARCH_AO_INTENSITY * occ);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif

#ifndef RAYMARCH_MAX_DIST
#define RAYMARCH_MAX_DIST 20.0
#endif

#ifndef RAYMARCH_SOFTSHADOW_ITERATIONS
#define RAYMARCH_SOFTSHADOW_ITERATIONS 64
#endif

#ifndef RAYMARCH_SHADOW_MIN_DIST
#define RAYMARCH_SHADOW_MIN_DIST 0.005
#endif

#ifndef RAYMARCH_SHADOW_MAX_DIST
#define RAYMARCH_SHADOW_MAX_DIST RAYMARCH_MAX_DIST
#endif

#ifndef RAYMARCH_SHADOW_SOLID_ANGLE
#define RAYMARCH_SHADOW_SOLID_ANGLE 0.1
#endif

#ifndef FNC_RAYMARCH_SOFTSHADOW
#define FNC_RAYMARCH_SOFTSHADOW

float raymarchSoftShadow(vec3 ro, vec3 rd) {
    const float mint = RAYMARCH_SHADOW_MIN_DIST;
    const float maxt = RAYMARCH_SHADOW_MAX_DIST;
    const float w = RAYMARCH_SHADOW_SOLID_ANGLE;

    float res = 1.0;
    float t = mint;
    for (int i = 0; i < RAYMARCH_SOFTSHADOW_ITERATIONS; i++) {
        if (t >= maxt)
            break;
        float h = RAYMARCH_MAP_FNC(ro + t * rd).sdf;
        res = min(res, h / (w * t));

        t += clamp(h, RAYMARCH_SHADOW_MIN_DIST, RAYMARCH_SHADOW_MAX_DIST);
        if (res < -1.0 || t > maxt)
            break;
    }
    res = max(res, -1.0);
    return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}

#endif
#ifndef STR_SHADING_DATA
#define STR_SHADING_DATA

struct ShadingData {
   vec3 V;
   vec3 N;
   vec3 H;
   vec3 L;
   vec3 R;

   float NoV;
   float NoL;
   float NoH;

   float roughness;
   float linearRoughness;
   vec3 diffuseColor;
   vec3 specularColor;

   vec3 energyCompensation;

   vec3 directDiffuse;
   vec3 directSpecular;
   vec3 indirectDiffuse;
   vec3 indirectSpecular;
};

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_REFLECTION
#define FNC_REFLECTION

vec3 reflection(const in vec3 _V, const in vec3 _N, const in float _roughness) {
        
#ifdef MATERIAL_ANISOTROPY
    vec3  anisotropicT = MATERIAL_ANISOTROPY_DIRECTION;
    vec3  anisotropicB = MATERIAL_ANISOTROPY_DIRECTION;

    #ifdef MODEL_VERTEX_TANGENT
    anisotropicT = normalize(v_tangentToWorld * MATERIAL_ANISOTROPY_DIRECTION);
    anisotropicB = normalize(cross(v_tangentToWorld[2], anisotropicT));
    #endif

    vec3  anisotropyDirection = MATERIAL_ANISOTROPY >= 0.0 ? anisotropicB : anisotropicT;
    vec3  anisotropicTangent  = cross(anisotropyDirection, _V);
    vec3  anisotropicNormal   = cross(anisotropicTangent, anisotropyDirection);
    float bendFactor          = abs(MATERIAL_ANISOTROPY) * saturate(5.0 * _roughness);
    vec3  bentNormal          = normalize(mix(_N, anisotropicNormal, bendFactor));
    return reflect(-_V, bentNormal);
#else

    return reflect(-_V, _N);
#endif

}

#endif
#ifndef FNC_REFLECTANCE2F0
#define FNC_REFLECTANCE2F0
float reflectance2f0(const float reflectance) { return 0.16 * reflectance * reflectance; }
#endif
#ifndef MIN_PERCEPTUAL_ROUGHNESS
#define MIN_PERCEPTUAL_ROUGHNESS 0.045
#endif

#ifndef FNC_PERCEPTUAL_LINEAR_ROUGHNESS
#define FNC_PERCEPTUAL_LINEAR_ROUGHNESS

float perceptual2linearRoughness(float perceptualRoughness) {
    perceptualRoughness = clamp(perceptualRoughness, MIN_PERCEPTUAL_ROUGHNESS, 1.0);
    return perceptualRoughness * perceptualRoughness;
}

#endif

#ifndef FNC_SHADING_DATA_NEW
#define FNC_SHADING_DATA_NEW 

ShadingData shadingDataNew() {
   ShadingData shadingData;

   shadingData.V = vec3(0.0, 0.0, 0.0);
   shadingData.N = vec3(0.0, 0.0, 0.0);
   shadingData.H = vec3(0.0, 0.0, 0.0);
   shadingData.L = vec3(0.0, 0.0, 0.0);
   shadingData.R = vec3(0.0, 0.0, 0.0);

   shadingData.NoV = 0.0;
   shadingData.NoL = 0.0;
   shadingData.NoH = 0.0;

   shadingData.roughness = 0.0;
   shadingData.linearRoughness = 0.0;
   shadingData.diffuseColor = vec3(0.0, 0.0, 0.0);
   shadingData.specularColor = vec3(0.0, 0.0, 0.0);

   shadingData.energyCompensation = vec3(1.0, 1.0, 1.0);

   shadingData.directDiffuse = vec3(0.0, 0.0, 0.0);
   shadingData.directSpecular = vec3(0.0, 0.0, 0.0);
   shadingData.indirectDiffuse = vec3(0.0, 0.0, 0.0);
   shadingData.indirectSpecular = vec3(0.0, 0.0, 0.0);

   return shadingData;
}

void shadingDataNew(Material mat, inout ShadingData shadingData) {
   float dielectricF0 = reflectance2f0(mat.reflectance);
   shadingData.N = mat.normal;
   shadingData.R = reflection(shadingData.V, shadingData.N, mat.roughness);
   shadingData.NoV = dot(shadingData.N, shadingData.V);
   shadingData.roughness = max(mat.roughness, MIN_PERCEPTUAL_ROUGHNESS);
   shadingData.linearRoughness = perceptual2linearRoughness(shadingData.roughness);
   shadingData.diffuseColor = mat.albedo.rgb * (1.0 - mat.metallic);
   shadingData.specularColor = mix(vec3(dielectricF0, dielectricF0, dielectricF0), mat.albedo.rgb, mat.metallic);
}

#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef LIGHT_POSITION
#define LIGHT_POSITION vec3(0.0, 10.0, -50.0)
#endif

#ifndef LIGHT_COLOR
#define LIGHT_COLOR vec3(1.0, 1.0, 1.0)
#endif

#ifndef RAYMARCH_AMBIENT
#define RAYMARCH_AMBIENT vec3(1.0, 1.0, 1.0)
#endif

#ifndef RAYMARCH_SHADING_FNC
#define RAYMARCH_SHADING_FNC raymarchDefaultShading
#endif

#ifndef FNC_RAYMARCH_DEFAULTSHADING
#define FNC_RAYMARCH_DEFAULTSHADING

vec4 raymarchDefaultShading(Material m, ShadingData shadingData) {
    
    
    vec3 worldNormal = m.normal;
    vec3 worldPosition = m.position;

    #if defined(LIGHT_DIRECTION)
    vec3 lig = normalize(LIGHT_DIRECTION);
    #else
    vec3 lig = normalize(LIGHT_POSITION - m.position);
    #endif
    
    vec3 ref = reflect(-shadingData.V, m.normal);
    float occ = raymarchAO(m.position, m.normal);

    vec3 hal = normalize(lig + shadingData.V);
    float amb = saturate(0.5 + 0.5 * m.normal.y);
    float dif = saturate(dot(m.normal, lig));
    float bac = saturate(dot(m.normal, normalize(vec3(-lig.x, 0.0, -lig.z)))) * saturate(1.0 - m.position.y);
    float dom = smoothstep( -0.1, 0.1, ref.y );
    float fre = pow(saturate(1.0 + dot(m.normal, -shadingData.V)), 2.0);
    
    dif *= raymarchSoftShadow(m.position, lig);
    dom *= raymarchSoftShadow(m.position, ref);

    vec3 env = RAYMARCH_AMBIENT;
    vec3 shade = vec3(0.0, 0.0, 0.0);
    shade += 1.30 * dif * LIGHT_COLOR;
    shade += 0.40 * amb * occ * env;
    shade += 0.50 * dom * occ * env;
    shade += 0.50 * bac * occ * 0.25;
    shade += 0.25 * fre * occ;

    return vec4(m.albedo.rgb * shade, m.albedo.a);
}

#endif
#ifndef FOG_DENSITY
#define FOG_DENSITY 0.0
#endif

#ifndef FOG_FALLOFF
#define FOG_FALLOFF 0.0
#endif

#ifndef FOG_COLOR_COOL
#define FOG_COLOR_COOL vec3(0.5, 0.6, 0.7)
#endif

#ifndef FOG_COLOR_WARM
#define FOG_COLOR_WARM vec3(1.0, 0.9, 0.7)
#endif

#ifndef FNC_RAYMARCH_FOG
#define FNC_RAYMARCH_FOG

vec3 raymarchFog(in vec3 col,   
                in float t) {   
    float fogAmount = 1.0 - exp(-t * FOG_DENSITY);
    return mix(col, FOG_COLOR_COOL, fogAmount);
}

vec3 raymarchColorFog(in vec3 col,      
                      in float t,       
                      in vec3 rd,       
                      in vec3 lig) {    
    float fogAmount = 1.0 - exp(-t * FOG_DENSITY);
    float sunAmount = max(dot(rd, lig), 0.0);
    vec3 fogColor = mix(FOG_COLOR_COOL, FOG_COLOR_WARM, pow(sunAmount, 8.0));
    return mix(col, fogColor, fogAmount);
}

vec3 raymarchHeightFog( in vec3 col,     
                        in float t,      
                        in vec3 ro,      
                        in vec3 rd) {    
    float fogAmount = (FOG_DENSITY / FOG_FALLOFF) * exp(-ro.y * FOG_FALLOFF) * (1.0 - exp(-t * rd.y * FOG_FALLOFF)) / rd.y;
    return mix(col, FOG_COLOR_COOL, saturate(fogAmount));
}

vec3 raymarchFog(in vec3 col, in float t, in vec3 ro, in vec3 rd){
    if (FOG_DENSITY > 0.0 && FOG_FALLOFF > 0.0) {
        return raymarchHeightFog(col, t, ro, rd);
    }
    else if (FOG_DENSITY > 0.0) {
        #ifdef LIGHT_DIRECTION
            return raymarchColorFog(col, t, rd, LIGHT_DIRECTION);
        #else
            return raymarchFog(col, t);
        #endif
    }
    else {
        return col;
    }
}

#endif

#ifndef RAYMARCH_BACKGROUND
#define RAYMARCH_BACKGROUND vec3(0.0, 0.0, 0.0)
#endif

#ifndef FNC_RAYMARCH_DEFAULT
#define FNC_RAYMARCH_DEFAULT

vec4 raymarchDefaultRender( in vec3 rayOrigin, in vec3 rayDirection, vec3 cameraForward,
                            out float dist ,out float eyeDepth, out Material res) { 

    res = raymarchCast(rayOrigin, rayDirection);
    float t = res.sdf;
    vec3 worldPos = rayOrigin + t * rayDirection;
    vec3 worldNormal = raymarchNormal( worldPos );

    vec4 color = vec4(RAYMARCH_BACKGROUND, 0.0);
    if (res.valid) {
        res.position = worldPos;
        res.normal = worldNormal;
        res.ambientOcclusion = raymarchAO(res.position, res.normal);
        ShadingData shadingData = shadingDataNew();
        shadingData.V = -rayDirection;
        color = RAYMARCH_SHADING_FNC(res, shadingData);
        dist = t;
    } else {
        dist = RAYMARCH_MAX_DIST;
    }
    
    color.rgb = raymarchFog(color.rgb, t, rayOrigin, rayDirection);

    #if defined(RAYMARCH_AOV)
    
    eyeDepth = t * dot(rayDirection, cameraForward);
    #else
    eyeDepth = 0.0;
    #endif

    return color;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef RAYMARCH_MAP_FNC
#define RAYMARCH_MAP_FNC raymarchMap
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef FNC_RAYMARCH_MAP
#define FNC_RAYMARCH_MAP

Material RAYMARCH_MAP_FNC( in vec3 pos );
Medium RAYMARCH_VOLUME_MAP_FNC( in vec3 pos );

#endif
#ifndef LIGHT_ATTENUATION_CONSTANT
#define LIGHT_ATTENUATION_CONSTANT 0.0
#endif

#ifndef LIGHT_ATTENUATION_LINEAR
#define LIGHT_ATTENUATION_LINEAR 0.0
#endif

#ifndef LIGHT_ATTENUATION_EXPONENTIAL
#define LIGHT_ATTENUATION_EXPONENTIAL 1.0
#endif

#ifndef LIGHT_ATTENUATION_EXPONENT
#define LIGHT_ATTENUATION_EXPONENT 2.0
#endif

#ifndef FNC_LIGHT_ATTENUATION
#define FNC_LIGHT_ATTENUATION

float attenuation(float dist) {
    return 1.0 / (
        LIGHT_ATTENUATION_CONSTANT + 
        LIGHT_ATTENUATION_LINEAR * dist +
        LIGHT_ATTENUATION_EXPONENTIAL * pow(dist, LIGHT_ATTENUATION_EXPONENT)
        );
}

#endif
#ifndef RANDOM_SCALE
#ifdef RANDOM_HIGHER_RANGE
#define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
#else
#define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
#endif
#endif

#ifndef FNC_RANDOM
#define FNC_RANDOM
float random(in float x) {
#ifdef RANDOM_SINLESS
    x = fract(x * RANDOM_SCALE.x);
    x *= x + 33.33;
    x *= x + x;
    return fract(x);
#else
    return fract(sin(x) * 43758.5453);
#endif
}

float random(in vec2 st) {
#ifdef RANDOM_SINLESS
    vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
#else
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
#endif
}

float random(in vec3 pos) {
#ifdef RANDOM_SINLESS
    pos  = fract(pos * RANDOM_SCALE.xyz);
    pos += dot(pos, pos.zyx + 31.32);
    return fract((pos.x + pos.y) * pos.z);
#else
    return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
#endif
}

float random(in vec4 pos) {
#ifdef RANDOM_SINLESS
    pos = fract(pos * RANDOM_SCALE);
    pos += dot(pos, pos.wzxy + 33.33);
    return fract((pos.x + pos.y) * (pos.z + pos.w));
#else
    float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
    return fract(sin(dot_product) * 43758.5453);
#endif
}

vec2 random2(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec2 p) {
    vec3 p3 = fract(p.xyx * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec3 p3) {
    p3 = fract(p3 * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 random3(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx); 
}

vec3 random3(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yxz + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

vec3 random3(vec3 p) {
    p = fract(p * RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec4 random4(float p) {
    vec4 p4 = fract(p * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);   
}

vec4 random4(vec2 p) {
    vec4 p4 = fract(p.xyxy * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec3 p) {
    vec4 p4 = fract(p.xyzx * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec4 p4) {
    p4 = fract(p4  * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif
#ifndef STR_MEDIUM
#define STR_MEDIUM

struct Medium {
    vec3    scattering;
    vec3    absorption;
    float   sdf;
};

#endif

#ifndef FNC_MEDIUM_NEW
#define FNC_MEDIUM_NEW

void mediumNew(out Medium _mat) {
    _mat.scattering   = vec3(1.0, 1.0, 1.0);
    _mat.absorption   = vec3(1.0, 1.0, 1.0);
    _mat.sdf     = RAYMARCH_MAX_DIST;

}

Medium mediumNew() {
    Medium mat;
    mediumNew(mat);
    return mat;
}

Medium mediumNew(vec3 scattering, vec3 absorption, float sdf) {
    Medium mat = mediumNew();
    mat.scattering = scattering;
    mat.absorption = absorption;
    mat.sdf = sdf;
    return mat;
}

Medium mediumNew(vec3 scattering, float sdf) {
    return mediumNew(scattering, vec3(0.0, 0.0, 0.0), sdf);
}

#endif

#ifndef LIGHT_COLOR
#if defined(GLSLVIEWER)
#define LIGHT_COLOR u_lightColor
#else
#define LIGHT_COLOR vec3(0.5, 0.5, 0.5)
#endif
#endif

#ifndef LIGHT_INTENSITY
#define LIGHT_INTENSITY 1.0
#endif

#ifndef RAYMARCH_VOLUME_SAMPLES
#define RAYMARCH_VOLUME_SAMPLES 64
#endif

#ifndef RAYMARCH_VOLUME_SAMPLES_LIGHT
#define RAYMARCH_VOLUME_SAMPLES_LIGHT 32
#endif

#ifndef RAYMARCH_VOLUME_MAP_FNC
#define RAYMARCH_VOLUME_MAP_FNC raymarchVolumeMap
#endif

#ifndef RAYMARCH_VOLUME_DITHER
#define RAYMARCH_VOLUME_DITHER 0.1
#endif

#if !defined(FNC_RAYMARCH_VOLUME) && defined(RAYMARCH_VOLUME)
#define FNC_RAYMARCH_VOLUME

vec3 raymarchVolumeShadowTransmittance(vec3 position, vec3 rayDirectionL, float stepSizeL) {
    vec3 transmittanceL = vec3(1.0, 1.0, 1.0);
    float tL = 0.0;

    for (int j = 0; j < RAYMARCH_VOLUME_SAMPLES_LIGHT; j++) {                
        vec3 positionL = position + rayDirectionL * tL;
        #if defined(RAYMARCH_VOLUMETRIC_SHADOWS)
            Material mat = RAYMARCH_MAP_FNC(positionL);
            if (mat.sdf <= 0.0) {
                return vec3(0.0, 0.0, 0.0);
            }
        #endif
        Medium resL = RAYMARCH_VOLUME_MAP_FNC(positionL);
        float densityL = -resL.sdf;
        vec3 extinctionL = resL.absorption + resL.scattering;
        transmittanceL *= exp(-densityL * extinctionL * stepSizeL);

        float offset = random(position)*(stepSizeL*RAYMARCH_VOLUME_DITHER);
        tL += stepSizeL + offset;
    }

    return transmittanceL;
}

vec3 raymarchVolume(vec3 rayOrigin, vec3 rayDirection, vec2 st, float minDist, vec3 background) {
    vec3 scatteredLuminance = vec3(0.0, 0.0, 0.0);
    vec3 transmittance = vec3(1.0, 1.0, 1.0);
    float stepSize = RAYMARCH_MAX_DIST/float(RAYMARCH_VOLUME_SAMPLES);

    float t = RAYMARCH_MIN_DIST;

    for(int i = 0; i < RAYMARCH_VOLUME_SAMPLES; i++) {        
        vec3 position = rayOrigin + rayDirection * t;
        Medium res = RAYMARCH_VOLUME_MAP_FNC(position);
        float density = -res.sdf;
        vec3 extinction = res.absorption + res.scattering;

        if (t < minDist && density > 0.0) {

            #if defined(LIGHT_DIRECTION) || defined(LIGHT_POSITION)
                #if defined(LIGHT_DIRECTION) 
                    float stepSizeL = RAYMARCH_MAX_DIST/float(RAYMARCH_VOLUME_SAMPLES_LIGHT);
                    vec3 rayDirectionL = normalize(LIGHT_DIRECTION);
                    const float attenuationL = 1.0;
                #else 
                    float distL = distance(LIGHT_POSITION, position);
                    float stepSizeL = distL/float(RAYMARCH_VOLUME_SAMPLES_LIGHT);
                    vec3 rayDirectionL = normalize(LIGHT_POSITION - position);
                    float attenuationL = attenuation(distL);
                #endif
                vec3 shadow = raymarchVolumeShadowTransmittance(position, rayDirectionL, stepSizeL);
                vec3 L = LIGHT_COLOR * LIGHT_INTENSITY;
            #else 
                const float attenuationL = 1.0;
                const vec3 shadow = 1.0;
                const vec3 L = vec3(1.0, 1.0, 1.0);
            #endif

            #if defined(RAYMARCH_ENERGY_CONSERVING)
                
                vec3 S = L * attenuationL * shadow * density * res.scattering;
                vec3 sampleExtinction = max(vec3(EPSILON, EPSILON, EPSILON), density * extinction);
                vec3 Sint = (S - S * exp(-sampleExtinction * stepSize)) / sampleExtinction;
                scatteredLuminance += transmittance * Sint;
                transmittance *= exp(-sampleExtinction * stepSize);
            #else
                
                scatteredLuminance += attenuationL * shadow * transmittance * density * res.scattering * stepSize * L;
                transmittance *= exp(-density * extinction * stepSize);
            #endif
        }

        float offset = random(st)*(stepSize*RAYMARCH_VOLUME_DITHER);
        t += stepSize + offset;
    }

    return background * transmittance + scatteredLuminance;
}

#endif
#ifndef FNC_MATERIAL_ZERO
#define FNC_MATERIAL_ZERO

void materialZero(out Material _mat) {
    _mat.albedo = vec4(0.0);
    _mat.emissive = vec3(0.0);
    _mat.position = vec3(0.0);
    _mat.normal = vec3(0.0);
#if defined(RENDER_RAYMARCHING)
    _mat.sdf = 0.0;
    _mat.valid = true;
#endif

#if defined(SCENE_BACK_SURFACE)
    _mat.normal_back = vec3(0.0);
#endif
    _mat.ior = vec3(0.0);
    _mat.roughness = 0.0;
    _mat.metallic = 0.0;
    _mat.reflectance = 0.0;
    _mat.ambientOcclusion = 0.0;

#if defined (SHADING_MODEL_CLEAR_COAT)
    _mat.clearCoat = 0.0;
    _mat.clearCoatRoughness = 0.0;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    _mat.clearCoatNormal = vec3(0.0);
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    _mat.thickness          = 0.0;
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    _mat.subsurfaceColor    = vec3(0.0);
    _mat.subsurfacePower    = 0.0;
    _mat.subsurfaceThickness = 0.0;
#endif
}

Material materialZero() {
    Material mat;
    materialZero(mat);
    return mat;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif

#ifndef MATERIAL_ADD
#define MATERIAL_ADD

void materialAdd(Material a, Material b, Material r) {
    r.albedo = a.albedo + b.albedo;
    r.emissive = a.emissive + b.emissive;
    r.position = a.position + b.position;
    r.normal = a.normal + b.normal;

    #if defined(SCENE_BACK_SURFACE)
    r.normal_back = a.normal_back + b.normal_back;
    #endif

    r.ior = a.ior + b.ior;
    r.roughness = a.roughness + b.roughness;
    r.metallic = a.metallic + b.metallic;
    r.reflectance = a.reflectance + b.reflectance;
    r.ambientOcclusion = a.ambientOcclusion + b.ambientOcclusion;

    #if defined(SHADING_MODEL_CLEAR_COAT)
    r.clearCoat = a.clearCoat + b.clearCoat;
    r.clearCoatRoughness = a.clearCoatRoughness + b.clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    r.clearCoatNormal = a.clearCoatNormal + b.clearCoatNormal;
    #endif
    #endif

    #if defined(SHADING_MODEL_IRIDESCENCE)
    r.thickness  = a.thickness + b.thickness;
    #endif

    #if defined(SHADING_MODEL_SUBSURFACE)
    r.subsurfaceColor = a.subsurfaceColor + b.subsurfaceColor;
    r.subsurfacePower = a.subsurfacePower + b.subsurfacePower;
    r.subsurfaceThickness = a.subsurfaceThickness + b.subsurfaceThickness;
    #endif
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_EMISSIVE
#define FNC_MATERIAL_EMISSIVE

#ifdef MATERIAL_EMISSIVEMAP
uniform SAMPLER_TYPE MATERIAL_EMISSIVEMAP;
#endif

vec3 materialEmissive() {
    vec3 emission = vec3(0.0);

#if defined(MATERIAL_EMISSIVEMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_EMISSIVEMAP_OFFSET)
    uv += (MATERIAL_EMISSIVEMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_EMISSIVEMAP_SCALE)
    uv *= (MATERIAL_EMISSIVEMAP_SCALE).xy;
    #endif
    emission = gamma2linear( SAMPLER_FNC(MATERIAL_EMISSIVEMAP, uv) ).rgb;

#elif defined(MATERIAL_EMISSIVE)
    emission = MATERIAL_EMISSIVE;
#endif

    return emission;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_OCCLUSION
#define FNC_MATERIAL_OCCLUSION

#ifdef MATERIAL_OCCLUSIONMAP
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialOcclusion() {
    float occlusion = 1.0;

#if defined(MATERIAL_OCCLUSIONMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONMAP, uv).r;
#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    occlusion = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).r;
#endif

#if defined(MATERIAL_OCCLUSIONMAP_STRENGTH)
    occlusion *= MATERIAL_OCCLUSIONMAP_STRENGTH;
#endif

    return occlusion;
}

#endif

#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_NORMAL
#define FNC_MATERIAL_NORMAL

#ifdef MATERIAL_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_NORMALMAP;
#endif

#ifdef MATERIAL_BUMPMAP_NORMALMAP
uniform SAMPLER_TYPE MATERIAL_BUMPMAP_NORMALMAP;
#endif

vec3 materialNormal() {
    vec3 normal = vec3(0.0, 0.0, 1.0);

#ifdef MODEL_VERTEX_NORMAL
    normal = v_normal;

    #if defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_NORMALMAP) 
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_NORMALMAP_OFFSET)
    uv += (MATERIAL_NORMALMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_NORMALMAP_SCALE)
    uv *= (MATERIAL_NORMALMAP_SCALE).xy;
        #endif
        
    normal = SAMPLER_FNC(MATERIAL_NORMALMAP, uv).xyz;
    normal = v_tangentToWorld * (normal * 2.0 - 1.0);

    #elif defined(MODEL_VERTEX_TANGENT) && defined(MODEL_VERTEX_TEXCOORD) && defined(MATERIAL_BUMPMAP_NORMALMAP)
    vec2 uv = v_texcoord.xy;
        #if defined(MATERIAL_BUMPMAP_OFFSET)
    uv += (MATERIAL_BUMPMAP_OFFSET).xy;
        #endif
        #if defined(MATERIAL_BUMPMAP_SCALE)
    uv *= (MATERIAL_BUMPMAP_SCALE).xy;
        #endif
    normal = v_tangentToWorld * ( SAMPLER_FNC(MATERIAL_BUMPMAP_NORMALMAP, uv).xyz * 2.0 - 1.0) ;
    #endif
#endif

    return normal;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef TOMETALLIC_MIN_REFLECTANCE
#define TOMETALLIC_MIN_REFLECTANCE 0.04
#endif

#ifndef FNC_TOMETALLIC
#define FNC_TOMETALLIC

float toMetallic(const in vec3 diffuse, const in vec3 specular, const in float maxSpecular) {
    float perceivedDiffuse = sqrt(0.299 * diffuse.r * diffuse.r + 0.587 * diffuse.g * diffuse.g + 0.114 * diffuse.b * diffuse.b);
    float perceivedSpecular = sqrt(0.299 * specular.r * specular.r + 0.587 * specular.g * specular.g + 0.114 * specular.b * specular.b);
    if (perceivedSpecular < TOMETALLIC_MIN_REFLECTANCE) {
        return 0.0;
    }
    float a = TOMETALLIC_MIN_REFLECTANCE;
    float b = perceivedDiffuse * (1.0 - maxSpecular) / (1.0 - TOMETALLIC_MIN_REFLECTANCE) + perceivedSpecular - 2.0 * TOMETALLIC_MIN_REFLECTANCE;
    float c = TOMETALLIC_MIN_REFLECTANCE - perceivedSpecular;
    float D = max(b * b - 4.0 * a * c, 0.0);
    return saturate((-b + sqrt(D)) / (2.0 * a));
}

float toMetallic(const in vec3 diffuse, const in vec3 specular) {
    float maxSpecula = max(max(specular.r, specular.g), specular.b);
    return toMetallic(diffuse, specular, maxSpecula);
}

#endif
#if !defined(GAMMA) && !defined(TARGET_MOBILE) && !defined(PLATFORM_RPI) && !defined(PLATFORM_WEBGL)
#define GAMMA 2.2
#endif

#ifndef FNC_GAMMA2LINEAR
#define FNC_GAMMA2LINEAR
float gamma2linear(const in float v) {
#ifdef GAMMA
    return pow(v, GAMMA);
#else
    
    return v * v;
#endif
}

vec3 gamma2linear(const in vec3 v) {
#ifdef GAMMA
    return pow(v, vec3(GAMMA));
#else
    
    return v * v;
#endif
}

vec4 gamma2linear(const in vec4 v) {
    return vec4(gamma2linear(v.rgb), v.a);
}
#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ALBEDO
#define FNC_MATERIAL_ALBEDO

#ifdef MATERIAL_BASECOLORMAP
uniform SAMPLER_TYPE MATERIAL_BASECOLORMAP;
#endif

#ifdef MATERIAL_ALBEDOMAP
uniform SAMPLER_TYPE MATERIAL_ALBEDOMAP;
#endif

vec4 materialAlbedo() {
    vec4 albedo = vec4(0.5, 0.5, 0.5, 1.0);
    
#if defined(MATERIAL_BASECOLORMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_BASECOLORMAP_OFFSET)
    uv += (MATERIAL_BASECOLORMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_BASECOLORMAP_SCALE)
    uv *= (MATERIAL_BASECOLORMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_BASECOLORMAP, uv) );

#elif defined(MATERIAL_ALBEDOMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ALBEDOMAP_OFFSET)
    uv += (MATERIAL_ALBEDOMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ALBEDOMAP_SCALE)
    uv *= (MATERIAL_ALBEDOMAP_SCALE).xy;
    #endif
    albedo = gamma2linear( SAMPLER_FNC(MATERIAL_ALBEDOMAP, uv) );

#elif defined(MATERIAL_BASECOLOR)
    albedo = MATERIAL_BASECOLOR;

#elif defined(MATERIAL_ALBEDO)
    albedo = MATERIAL_ALBEDO;

#endif

#if defined(MODEL_VERTEX_COLOR)
    albedo *= v_color;
#endif

    return albedo;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_SPECULAR
#define FNC_MATERIAL_SPECULAR

#ifdef MATERIAL_SPECULARMAP
uniform SAMPLER_TYPE MATERIAL_SPECULARMAP;
#endif

vec3 materialSpecular() {
    vec3 spec = vec3(0.04);
#if defined(MATERIAL_SPECULARMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_SPECULARMAP_OFFSET)
    uv += (MATERIAL_SPECULARMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_SPECULARMAP_SCALE)
    uv *= (MATERIAL_SPECULARMAP_SCALE).xy;
    #endif
    spec = SAMPLER_FNC(MATERIAL_SPECULARMAP, uv).rgb;
#elif defined(MATERIAL_SPECULAR)
    spec = MATERIAL_SPECULAR;
#endif
    return spec;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_METALLIC
#define FNC_MATERIAL_METALLIC

#ifdef MATERIAL_METALLICMAP
uniform SAMPLER_TYPE MATERIAL_METALLICMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif
    
float materialMetallic() {
    float metallic = 0.0;

#if defined(MATERIAL_METALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_METALLICMAP_OFFSET)
    uv += (MATERIAL_METALLICMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_METALLICMAP_SCALE)
    uv *= (MATERIAL_METALLICMAP_SCALE).xy;
    #endif
    metallic = SAMPLER_FNC(MATERIAL_METALLICMAP, uv).b;

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    metallic = SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).b;

#elif defined(MATERIAL_METALLIC)
    metallic = MATERIAL_METALLIC;

#else
    vec3 diffuse = materialAlbedo().rgb;
    vec3 specular = materialSpecular();
    metallic = toMetallic(diffuse, specular);
#endif

    return metallic;
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_MATERIAL_ROUGHNESS
#define FNC_MATERIAL_ROUGHNESS

#ifdef MATERIAL_ROUGHNESSMAP
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMAP;
#endif

#if defined(MATERIAL_ROUGHNESSMETALLICMAP) && !defined(MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_ROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_ROUGHNESSMETALLICMAP;
#endif

#if defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && !defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM)
#define MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP_UNIFORM
uniform SAMPLER_TYPE MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP;
#endif

float materialRoughness() {
    float roughness = 0.05;

#if defined(MATERIAL_ROUGHNESSMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    #if defined(MATERIAL_ROUGHNESSMAP_OFFSET)
    uv += (MATERIAL_ROUGHNESSMAP_OFFSET).xy;
    #endif
    #if defined(MATERIAL_ROUGHNESSMAP_SCALE)
    uv *= (MATERIAL_ROUGHNESSMAP_SCALE).xy;
    #endif
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_ROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP) && defined(MODEL_VERTEX_TEXCOORD)
    vec2 uv = v_texcoord.xy;
    roughness = max(roughness, SAMPLER_FNC(MATERIAL_OCCLUSIONROUGHNESSMETALLICMAP, uv).g);

#elif defined(MATERIAL_ROUGHNESS)
    roughness = MATERIAL_ROUGHNESS;

#endif

    return roughness;
}

#endif

#ifndef FNC_TOSHININESS
#define FNC_TOSHININESS
float toShininess(const in float roughness, const in float metallic) {
    float s = .95 - roughness * 0.5;
    s *= s;
    s *= s;
    return s * (80. + 160. * (1.0-metallic));
}
#endif

#ifndef FNC_MATERIAL_SHININESS
#define FNC_MATERIAL_SHININESS

float materialShininess() {
    float shininess = 15.0;

#ifdef MATERIAL_SHININESS
    shininess = MATERIAL_SHININESS;

#elif defined(FNC_MATERIAL_METALLIC) && defined(MATERIAL_METALLIC) && defined(FNC_MATERIAL_ROUGHNESS) && defined(MATERIAL_ROUGHNESS)
    float roughness = materialRoughness();
    float metallic = materialMetallic();
    shininess = toShininess(roughness, metallic);
#endif

    return shininess;
}

#endif

#if !defined(MATERIAL_OPT_IN)
#define RENDER_RAYMARCHING
#define SHADING_MODEL_CLEAR_COAT
#endif

#ifndef STR_MATERIAL
#define STR_MATERIAL
struct Material {
    vec4    albedo;
    vec3    emissive;

    vec3    position;       
    vec3    normal;         

#if defined(RENDER_RAYMARCHING)
    float   sdf;
    bool    valid;
#endif

    #if defined(SCENE_BACK_SURFACE)
    vec3    normal_back;    
    #endif
    
    vec3    ior;            

    float   roughness;
    float   metallic;
    float   reflectance;
    float   ambientOcclusion;   

#if defined(SHADING_MODEL_CLEAR_COAT)
    float   clearCoat;
    float   clearCoatRoughness;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    vec3    clearCoatNormal;    
    #endif
#endif

#if defined(SHADING_MODEL_IRIDESCENCE)
    float   thickness; 
#endif

#if defined(SHADING_MODEL_SUBSURFACE)
    vec3    subsurfaceColor;    
    float   subsurfacePower;    
    float   subsurfaceThickness;
#endif

};
#endif

#ifndef MATERIAL_MULTIPLY
#define MATERIAL_MULTIPLY

void materialMultiply(Material mat, float f, Material r) {
    r.albedo = mat.albedo * f;
    r.emissive = mat.emissive * f;
    r.position = mat.position * f;
    r.normal = mat.normal * f;
    #if defined(SCENE_BACK_SURFACE)
    r.normal_back = mat.normal_back * f;
    #endif
    r.ior = mat.ior * f;
    r.roughness = mat.roughness * f;
    r.metallic = mat.metallic * f;
    r.reflectance = mat.reflectance * f;
    r.ambientOcclusion = mat.ambientOcclusion * f;
    #if defined(SHADING_MODEL_CLEAR_COAT)
    r.clearCoat = mat.clearCoat * f;
    r.clearCoatRoughness = mat.clearCoatRoughness * f;
    #if defined(MATERIAL_HAS_CLEAR_COAT_NORMAL)
    r.clearCoatNormal = mat.clearCoatNormal * f;
    #endif
    #endif
    #if defined(SHADING_MODEL_IRIDESCENCE)
    r.thickness = mat.thickness * f;
    #endif
    #if defined(SHADING_MODEL_SUBSURFACE)
    r.subsurfaceColor = mat.subsurfaceColor * f;
    r.subsurfacePower = mat.subsurfacePower * f;
    r.subsurfaceThickness = mat.subsurfaceThickness * f;
    #endif
}

#endif

#ifndef RAYMARCH_RENDER_FNC
#define RAYMARCH_RENDER_FNC raymarchDefaultRender
#endif

#ifndef RAYMARCH_VOLUME_RENDER_FNC
#define RAYMARCH_VOLUME_RENDER_FNC raymarchVolume
#endif

#ifndef RAYMARCH_CAMERA_FOV
#define RAYMARCH_CAMERA_FOV 60.0
#endif

#ifndef FNC_RAYMARCH
#define FNC_RAYMARCH

#if defined(RAYMARCH_MULTISAMPLE)
const float RAYMARCH_MULTISAMPLE_FACTOR = 1.0/float(RAYMARCH_MULTISAMPLE);
#endif

vec4 raymarch(mat4 viewMatrix, vec2 st, out float eyeDepth, out Material mat) {

    float fov = 1.0 / tan(RAYMARCH_CAMERA_FOV * DEG2RAD * 0.5);
    vec3 camera = viewMatrix[3].xyz;
    vec3 cameraForward = viewMatrix[2].xyz;
    mat3 viewMatrix3 = toMat3(viewMatrix);

#if defined(RAYMARCH_MULTISAMPLE)

    #if defined(RAYMARCH_AOV)
    Material matAcc;
    materialZero(matAcc);
    #endif

    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    eyeDepth = 0.0;

    vec2 pixel = 1.0/RESOLUTION;
    vec2 offset = rotate( vec2(0.5, 0.0), EIGHTH_PI);

    for (int i = 0; i < RAYMARCH_MULTISAMPLE; i++) {
        vec3 rayDirection = viewMatrix3 * normalize(vec3((st + offset * pixel)*2.0-1.0, fov));

        float sampleDepth = 0.0;
        float dist = 0.0;

        vec4 opaque = RAYMARCH_RENDER_FNC(camera, rayDirection, cameraForward, dist, sampleDepth, mat);
        #ifdef RAYMARCH_VOLUME
        color += vec4(RAYMARCH_VOLUME_RENDER_FNC(camera, rayDirection, st, dist, opaque.rgb), opaque.a);
        #else
        color += opaque;
        #endif

        eyeDepth += sampleDepth;
        
        #if defined(RAYMARCH_AOV)
        materialAdd(matAcc, mat, matAcc);
        #endif

        offset = rotate(offset, HALF_PI);
    }

    eyeDepth *= RAYMARCH_MULTISAMPLE_FACTOR;

    #if defined(RAYMARCH_AOV)  
        materialMultiply(matAcc, RAYMARCH_MULTISAMPLE_FACTOR, mat);
    #endif
    
    return color * RAYMARCH_MULTISAMPLE_FACTOR;
    
#else 

    vec3 rayDirection = viewMatrix3 * normalize(vec3(st*2.0-1.0, fov));
    float dist = 0.0;

    vec4 opaque = RAYMARCH_RENDER_FNC( camera, rayDirection, cameraForward, dist, eyeDepth, mat);
    #ifdef RAYMARCH_VOLUME
        vec4 color = vec4(RAYMARCH_VOLUME_RENDER_FNC(camera, rayDirection, st, dist, opaque.rgb), opaque.a);
    #else
        vec4 color = opaque;
    #endif

    return color;

#endif
}

vec4 raymarch(mat4 viewMatrix, vec2 st, out float eyeDepth) {
    Material mat;
    materialZero(mat);
    return raymarch(viewMatrix, st, eyeDepth, mat);
}

vec4 raymarch(mat4 viewMatrix, vec2 st) {
    float eyeDepth = 0.0;
    return raymarch(viewMatrix, st, eyeDepth);
}

vec4 raymarch(vec3 cameraPosition, vec3 cameraLookAt, vec2 st, out float eyeDepth, out Material mat) {
    mat4 viewMatrix = lookAtView(cameraPosition, cameraLookAt);
    return raymarch(viewMatrix, st, eyeDepth, mat);
}

vec4 raymarch(vec3 cameraPosition, vec3 cameraLookAt, vec2 st, out float eyeDepth) {
    mat4 viewMatrix = lookAtView(cameraPosition, cameraLookAt);
    return raymarch(viewMatrix, st, eyeDepth);
}

vec4 raymarch(vec3 cameraPosition, vec3 cameraLookAt, vec2 st) {
    mat4 viewMatrix = lookAtView(cameraPosition, cameraLookAt);
    return raymarch(viewMatrix, st);
}

#endif

Material raymarchMap(vec3 pos) {
    
    float t = u_time;
    float t0 = u_time / 2.0;
    
    vec3 p0 = pos;
    p0 += u_posSphere;
    /* p0 += vec3(0.0, 0.3, 0.0);
    p0.y += - 1.0 + sin(u_time * 1.0) * 1.0; */
    
    float sdPlane = planeSDF(pos);
    
    float sdSph0;
    sdSph0 = sphereSDF(p0, u_scSphere);
    
    Material res = materialNew(vec3(0.0), 0.0);
    
    float s = abs(sin(t0 * 0.8) * 0.4);
    res.sdf = opUnion(sdSph0, sdPlane, u_unionSphere);
    
    return res;
}

void main() {
    vec3 color = vec3(0.0);
    vec2 uv = v_texcoord;
    vec2 st = ratio(uv, u_resolution);
    vec4 res = raymarch(u_camera, u_target, st);
    
    color = res.rgb;
    color = linear2gamma(color);
    
    float a = res.a;
    
    gl_FragColor = vec4(color, a);
}`;const Ce={__name:"index",setup(E){const{renderer:A,scene:n,registerRenderFn:e,camera:i,orthoCamera:f}=X("renderer");i.position.set(-.821371,3.52016,.17339);const M={bulb:0},d={debugOrbit:!1,debugLight:!1},S=new V,I=new l,a=new $,C=new $,U=new $,_=new $,{set:r}=J(a,{lambda:3},["phi","theta"]),o=new V,P=new V,F=new l,g=new l,B=new l;let q;const K=new l,y=new l,N=new jn(i,{sphericalDelta:U}),Mn=Math.PI*-.1,h=Math.PI*.25;fn(()=>{Se.timeline().fromTo(K,{y:3},{y:0,duration:2,ease:"power1.out"},0).fromTo(F,{y:-3},{y:0,duration:4,ease:"sine.out"},1.5)});const{set:dn}=$n(M,{stiffness:40,damping:15,mass:1.2}),Q=new nn,D=T=>T==="#000"||!T?!1:`vec3(${Q.set(T).convertLinearToSRGB().toArray().join(",")})`,O=Rn({COLOR_BCK:"#000",COLOR_AMB:"#000",COLOR_LIGHT:"#000",COLOR_BAC:"#000",COLOR_FRE:"#000",COLOR_DOM:"#000"}),m=new Fn({vertexShader:Jn,fragmentShader:re,uniforms:{u_resolution:{value:S},u_camera:{value:I},u_time:{value:0},u_light:{value:B},u_posSphere:{value:y},u_scSphere:{value:1.2},u_unionSphere:{value:2}}}),G=new mn(new Me(1,1),m);G.name="Mesh",G.layers.set(1),n.add(G);const Z=({x:T,y:c})=>{P.set(T,c).sub(o),P.needsUpdate=!0,o.set(T,c);const x=R.value?-.008:-.001;C.theta+=P.x*x,C.phi+=P.y*x,C.phi=ne(C.phi,Mn,h),r({phi:C.phi,theta:C.theta})},j=T=>{if(dn({bulb:T?1:0}),!T){const c=sn(P.x,.1),x=sn(P.y,.1);C.theta+=-c,C.phi+=-x}},{isDown:R}=Un(Z);Cn(({width:T,height:c})=>{G.scale.set(T,c,1),S.set(T,c)}),p(R,j);let u=0,s=0;return Dn(({delta:T})=>{const{debugLight:c}=d,{bulb:x}=M;u+=T*.0012*_n(x,1,.5),s+=T*.0012;const Hn=u+2;U.theta=a.theta-_.theta,U.phi=a.phi-_.phi,_.copy(a),P.needsUpdate||P.set(0,0),P.needsUpdate=!1,N==null||N.update(),g.set(Math.sin(s)*1,2+Math.sin(s*.5)*2,-Math.cos(s*.2)*-2),B.copy(F).add(g),c&&q.position.copy(B.clone().multiply(new l(-1,1,-1))),y.copy(K),y.y+=-.5+Math.sin(Hn*.8)*1,m.uniforms.u_time.value=u,m.uniforms.u_scSphere.value=_n(x,1.2,1.4),m.uniforms.u_unionSphere.value=_n(x,2.2,1.2),I.copy(i.position)}),e(()=>{A.clear(),A.render(n,f),A.clearDepth(),A.render(n,i)}),p(O,T=>{const c={COLOR_BCK:D(T.COLOR_BCK),COLOR_AMB:D(T.COLOR_AMB),COLOR_LIG:D(T.COLOR_LIGHT),COLOR_BAC:D(T.COLOR_BAC),COLOR_FRE:D(T.COLOR_FRE),COLOR_DOM:D(T.COLOR_DOM)};Object.assign(m.defines,c),m.needsUpdate=!0},{immediate:!0}),On([{value:O}],{title:"RaymarchSphere",expanded:!0}),(T,c)=>cn(T.$slots,"default")}};var v;(function(E){E.LOAD_START="load-start",E.LOAD_PRIORITY="load-priority",E.LOAD_COMPLETE="load-complete",E.LOAD_PROGRESS="load-progress",E.LOAD_ERROR="load-error",E.LOAD_CANCELLED="load-cancelled"})(v||(v={}));var t;(function(E){E.QUEUED="queued",E.LOADING="loading",E.ERROR="error",E.COMPLETE="complete",E.CANCELLED="cancelled"})(t||(t={}));class en extends xn{constructor(n,e){super();L(this,"id");L(this,"url");L(this,"state",t.QUEUED);L(this,"type");L(this,"opts");L(this,"priority",0);L(this,"_accuratePercentage",null);L(this,"_parent");this.url=n,this.opts=e}get parent(){return this._parent}async start(){return this.setState(t.LOADING),this.emitProgress(),this.load(this.opts||{}).then(n=>(this.emitProgress(),this.state!==t.CANCELLED&&this.setState(t.COMPLETE),n)).catch(n=>(console.error("Failed to load : ",n),this.setState(t.ERROR,n),n))}setState(n,e){if(this.state!==n)switch(this.state=n,this.state){case t.LOADING:this.emit(v.LOAD_START,{loader:this});break;case t.COMPLETE:this.emit(v.LOAD_COMPLETE,{loader:this,data:this.data});break;case t.ERROR:this.emit(v.LOAD_ERROR,{loader:this,error:e});break;case t.CANCELLED:this.emit(v.LOAD_CANCELLED,{loader:this});break}}emitProgress(){this.emit(v.LOAD_PROGRESS,{loader:this,progress:this.progress()})}setAccuratePercentage(n){this._accuratePercentage=n}progress(){return this.state===t.COMPLETE||this.state===t.CANCELLED||this.state===t.ERROR?{count:1,total:1,percentage:1}:{count:0,total:1,percentage:this._accuratePercentage>0?this._accuratePercentage:0}}setParent(n){this._parent=n}}class z{constructor(){L(this,"register",{})}static create(A=[]){const n=new z;return A.forEach(e=>n.merge(e)),n}registerLoader(A,n){const e=A,{RESOLVE:i}=e;if(i)(!this.register[i.type]||n)&&(this.register[i.type]={Construct:e,...i});else throw new Error("No resolve metadata found on Loader.")}loaderFromURL(A){const[n,e]=A.split("#"),i=`.${n.split(".").pop()}`;let f=null;if(e){const M=this.register[e];f=M?new M.Construct(n):null}else if(i){const M=Object.values(this.register).filter(d=>d.extensions.filter(S=>i===S).length>0);f=M.length>0?new M[0].Construct(n):null}else throw new Error(`Couldn't parse url when trying to resolve: ${A}`);if(f)return f;throw new Error(`Couldn't find Loader to handle url : ${A} / ${i}`)}merge(A){Object.entries(A.register).forEach(([,n])=>{this.registerLoader(n.Construct,!0)})}}var In;(function(E){E.STATS_UPDATE="stats-update"})(In||(In={}));const En=class En extends xn{constructor(n={}){super();L(this,"opts");L(this,"_queue",new Map);L(this,"_locked",!1);this.opts=n,n.concurrency=n.concurrency||En.DEFAULT_CONCURRENCY}add(n,e){if(this._locked)throw new Error(`LoaderScheduler is locked. Cannot add new loaders. This may be because new loaders should not be added outside the Vue lifecycle. URL: ${n.url||void 0}`);this._queue.has(n)||(this._queue.set(n,{loader:n,cb:e}),this.next())}next(){const n=this.stats(),e=Math.max(0,this.opts.concurrency-n.loading),{queued:i}=n.loaders;e>0&&n.queued>0?(i.sort((f,M)=>M.priority-f.priority),i.slice(0,e).forEach(f=>{f.start().then(()=>{this._queue.get(f).cb(f),this.next()})})):n.queued,this.emit(In.STATS_UPDATE,n)}lock(){this._locked=!0}unlock(){this._locked=!1}dispose(){this._queue.clear()}stats(){const n=[],e=[],i=[],f=[];for(const M of this._queue.values()){const d=M.loader.state;d===t.COMPLETE?n.push(M.loader):d===t.QUEUED?e.push(M.loader):d===t.LOADING?M.loader instanceof k||i.push(M.loader):d===t.ERROR&&f.push(M.loader)}return{queued:e.length,loading:i.length,complete:n.length,errored:f.length,loaders:{queued:e,loading:i,complete:n,errored:f}}}};L(En,"DEFAULT_CONCURRENCY",10);let W=En;const Oe=E=>Object.getPrototypeOf(E)===Object.prototype,w=class w extends en{constructor(n,e={}){super("",e);L(this,"_loaders",[]);L(this,"_resolvable",[]);L(this,"_resolver");L(this,"_scheduler");L(this,"_returnRecord",!1);if(e.resolver&&e.resolver instanceof z&&(this._resolver=e.resolver),e.scheduler&&e.scheduler instanceof W&&(this._scheduler=e.scheduler),n instanceof Array)this._returnRecord=!1,n.forEach((i,f)=>{typeof i=="string"?this._resolvable.push([f.toString(),i]):this.addLoader(i)});else if(Oe(n))this._returnRecord=!0,Object.entries(n).forEach(([i,f])=>{if(f instanceof en)f.id=i,this.addLoader(f);else if(typeof f=="string")this._resolvable.push([i,f]);else throw new Error("Unhandled LoaderRecord type.")});else throw new Error("Unknown supplied loader format.")}get resolver(){return this._resolver}get scheduler(){return this._scheduler}get loaders(){return this._loaders}addLoader(n){this._loaders.indexOf(n)===-1&&(this._loaders.push(n),n.setParent(this))}start(){return this.resolve(!0),super.start()}schedulerNearestParent(){if(this._scheduler)return this._scheduler;{let n=null,e=this.parent;for(;e&&!n;)n=e.scheduler,e=e.parent;return n}}async load(){const n=this.schedulerNearestParent();return n?new Promise(e=>{this.loaders.length===0&&e(this.data),this.loaders.forEach(i=>{const f=()=>{this.emitProgress()};i.on(v.LOAD_PROGRESS,f),n.add(i,()=>{i.removeListener(v.LOAD_PROGRESS,f);const M=this.progress();M.count===M.total&&e(this.data)})})}):this.loaders.length===0?this.data:Promise.all(this.loaders.map(e=>e.start().then(()=>{this.emitProgress()}))).then(()=>this.data)}progress(){const n=this.loaders.reduce((e,i)=>{const f=i.progress();return e.count+=f.count,e.total+=f.total,e.percentage+=f.percentage,e},{count:0,percentage:0,total:0});return this.loaders.length>0?n.percentage/=this.loaders.length:n.percentage,n}resolverChain(){const n=this._resolver?[this._resolver]:[];let e=this.parent;for(;e;)e.resolver&&n.unshift(e.resolver),e=e.parent;return n}resolve(n=!0){if(this._resolvable.length>0){const e=this.resolverChain(),i=z.create(e);this._resolvable.forEach(([f,M],d)=>{const S=i.loaderFromURL(M);S&&(S.id=f,this._loaders.push(S),this._resolvable[d]=null)}),this._resolvable=this._resolvable.filter(f=>f!==null)}n&&this._loaders.forEach(e=>{e instanceof w&&e.resolve(!0)})}loadersRecursive(){return this._loaders.flatMap(n=>n instanceof w?n.loadersRecursive():n)}async cancel(){this.loaders.forEach(n=>n.cancel())}async dispose(){this.loaders.forEach(n=>n.dispose()),this._scheduler&&this._scheduler.dispose()}get data(){return this._returnRecord?this._loaders.reduce((n,e)=>(n[e.id]=e.data,n),{}):this._loaders.map(n=>n.data)}};L(w,"DEFAULT_CONCURRENCY",10);let k=w;class oe extends k{constructor(A={}){super([],{resolver:new z,scheduler:new W({concurrency:A.concurrency||W.DEFAULT_CONCURRENCY})}),A.loaders&&A.loaders.forEach(n=>this.registerLoader(n))}registerLoader(A){this.resolver.registerLoader(A)}lock(){this.scheduler.lock()}unlock(){this.scheduler.unlock()}}class pn extends en{constructor(n,e){super(n,e);L(this,"_controller");L(this,"_data");this._controller=new AbortController}async load(n){return new Promise((e,i)=>{fetch(this.url,{...n,signal:this._controller.signal}).then(f=>{if(f.status===200)return f.json();i({status:f.status,statusText:f.statusText})}).then(f=>(this._data=f,f)).then(e)})}async cancel(){this._controller&&this._controller.abort()}async dispose(){this._data=null}get data(){return this._data}}L(pn,"RESOLVE",{type:"json",extensions:[".json"]});const le=E=>({decode:!1,crossOrigin:"",decoding:"async",initTexture:!0,...E}),H=class H extends en{constructor(){super(...arguments);L(this,"_image",null);L(this,"_data",null)}static setGlobals(n){H.globals=n}async load(n){const e=le(n),i=this._image=new Image,f=new ee,M=e.renderer||H.globals.renderer;if(!M&&e.initTexture)throw new Error("TextureLoader: Could not initialise texture. No renderer set.");return new Promise((d,S)=>{i.addEventListener("error",a=>{S(a.error)});const I=a=>{f.image=a,f.needsUpdate=!0,e.initTexture&&M&&M.initTexture(f),this._data=f,d(f)};i.addEventListener("load",()=>e.decode?i.decode().then(()=>I):I(i)),i.decoding=e.decoding,i.crossOrigin=e.crossOrigin,i.src=this.url})}async cancel(){this._image&&(this._image.src="")}async dispose(){this._image=null,this._data&&this._data.dispose()}get data(){return this._data}};L(H,"RESOLVE",{type:"texture",extensions:[".jpg",".jpeg",".png",".gif",".webp"]}),L(H,"globals",{});let An=H;const Gn=(E,A)=>{const n=X(E,()=>null,!0),e=A.add(n==null?void 0:n.current),i={chain:[...n?n.chain:[],e],current:e,root:n?n.root:e,parent:n?n.current:void 0};return Nn(E,i),Bn(()=>{A.remove(i.current,i.parent)}),i},rn="LOADER_CHAIN",Pe=E=>{let A;return E?A=Gn(rn,{add:n=>{const e=new oe(E);return n&&n.addLoader(e),e},remove:(n,e)=>{e&&n.cancel()}}):A=X(rn),A.root},se=E=>Gn(rn,{add:A=>{const n=new k(E);return A&&A.addLoader(n),n},remove:(A,n)=>{if(n){A.dispose();const e=n.loaders.indexOf(A);n.loaders.splice(e,1),A.setParent(null)}}}).current,ce=(E,A=()=>{})=>{const n=se(E);return n.once(v.LOAD_COMPLETE,A),n},Vn="ASSETS_PROVIDER_KEY",Ne=(E=noop)=>{const A=X(Vn);if(!A)throw new Error("Assets provider not found");return fn(()=>{A.loader.state==="complete"&&E({data:A.loader.data}),A.loader.once(v.LOAD_COMPLETE,E)}),A},ue=yn({setup(){const n={assets:null,loader:ce({fontMap:"textures/TitleLens/fellix-bold.png#texture",fontData:"textures/TitleLens/fellix-bold.json"},({data:e})=>{n.assets=e})};Nn(Vn,n)},render(){return this.$slots.default()}});var ve=`#ifndef FNC_COORD
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
#define mx coord(uPointer)`,Fe=`float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float median(vec3 rgb) {
    return max(min(rgb.r, rgb.g), min(max(rgb.r, rgb.g), rgb.b));
}`,me=`#ifndef FNC_SATURATE
#define FNC_SATURATE
float saturate(float x) { return clamp(x, 0.0, 1.0); }
vec2 saturate(vec2 x) { return clamp(x, 0.0, 1.0); }
vec3 saturate(vec3 x) { return clamp(x, 0.0, 1.0); }
vec4 saturate(vec4 x) { return clamp(x, 0.0, 1.0); }
#endif

#ifndef FNC_MAP
#define FNC_MAP

float map( float value, float inMin, float inMax ) {
    return saturate( (value-inMin)/(inMax-inMin));
}

vec2 map( vec2 value, vec2 inMin, vec2 inMax ) {
    return saturate( (value-inMin)/(inMax-inMin));
}

vec3 map( vec3 value, vec3 inMin, vec3 inMax ) {
    return saturate( (value-inMin)/(inMax-inMin));
}

vec4 map( vec4 value, vec4 inMin, vec4 inMax ) {
    return saturate( (value-inMin)/(inMax-inMin));
}

float map(in float value, in float inMin, in float inMax, in float outMin, in float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec2 map(in vec2 value, in vec2 inMin, in vec2 inMax, in vec2 outMin, in vec2 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec3 map(in vec3 value, in vec3 inMin, in vec3 inMax, in vec3 outMin, in vec3 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec4 map(in vec4 value, in vec4 inMin, in vec4 inMax, in vec4 outMin, in vec4 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float map(float value, float inMin, float inMax, float outMin, float outMax, bool clamped) {
    if (clamped) value = min(inMax, max(inMin, value));
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

#endif`,Ue=`#ifndef FNC_SATURATE
#define FNC_SATURATE
float saturate(float x) { return clamp(x, 0.0, 1.0); }
vec2 saturate(vec2 x) { return clamp(x, 0.0, 1.0); }
vec3 saturate(vec3 x) { return clamp(x, 0.0, 1.0); }
vec4 saturate(vec4 x) { return clamp(x, 0.0, 1.0); }
#endif`,De=`#ifndef FNC_SDFCIRCLE
#define FNC_SDFCIRCLE

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.;
}

float sdCircle(in vec2 st) {
    return sdCircle(st, vec2(.5));
}

#endif`;class xe extends Fn{constructor(A,n){A=Object.assign({vertexShader:pe,fragmentShader:Ge,type:"LensMaterial",extensions:{derivatives:!0},transparent:!0,depthTest:!1,depthTest:!1},A),super(A),this.defines={HAS_REVERSE:!1,HAS_MASKING:!1,HAS_BLENDING:!1,CENTER_ALIGN:!0,LOW_RES:!1,USE_DEBUG:!1,...A.defines};const e={u_time:{value:0},u_alpha:{value:0},u_progressBlur0:{value:0},u_progressBlur1:{value:0},u_pointer:{value:new V},u_pointerBlur:{value:.25},u_color:{value:new nn("#000000")},u_colorBlending:{value:new nn("#ffffff")}};this.uniforms={...e,...this.uniforms},Ae(this)}}const pe=`
    varying vec2 vUv;
    varying vec3 vLocalPos;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vLocalPos = position.xyz;
    }
`,Ge=`
    uniform vec3 uBounds;
    uniform vec2 uResolution;
    
    uniform vec3 u_color;
    uniform float u_time;
    uniform float u_alpha;
    
    uniform vec2 u_pointer;
    uniform float u_pointerBlur;

    uniform float u_progressBlur0;
    uniform float u_progressBlur1;


    #define uPointer u_pointer

    uniform sampler2D tMap;
    #ifdef HAS_BLENDING
    uniform vec3 u_colorBlending;
    #endif

    #define TEX_SIZE vec2(512.0)


    varying vec2 vUv;
    varying vec3 vLocalPos;

    ${ve}
    ${Fe}
    ${me}
    ${Ue}
    ${De}
    ${ae}
    ${te}

    float getBlur(vec2 st, float f, float p) {
        float feather = (1.0 / uBounds.x) * f;
        // float featherHalf = feather * 0.5;
        // float aBlurDistFromEdge = mix(featherHalf, 1.0 - featherHalf, uvRemapped.x);
        float res = smoothstep(p - feather, p + feather, st.x);
        return res;
    }

    void main() {
        vec2 uv = vUv;

        vec2 st = st0 + 0.5;
        vec2 stPointer = st - mx;
        
        vec2 uvRemapped;
        #ifdef CENTER_ALIGN
            uvRemapped = map(vLocalPos.xy, 
                -uBounds.xy / 2.0, uBounds.xy / 2.0, 
                vec2(0.0), vec2(1.0)
            );
        #else
            uvRemapped = map(vLocalPos.xy, 
                vec2(0.0), uBounds.xy, 
                vec2(0.0), vec2(1.0)
            );
        #endif
        #ifdef HAS_REVERSE
            uvRemapped = scale(uvRemapped, -1.);
        #endif
        
        vec2 uvRemapped0 = uvRemapped;
        if(uvRemapped0.x > 0.5)
            uvRemapped0 = scale(uvRemapped0, -1.);


        // ― pointer shape
        float sdPointerSize = u_pointerBlur != 0.0 ? u_pointerBlur : 0.25;
        float sdPointer = fill(
            sdCircle(stPointer), 
            sdPointerSize * 0.4, 
            sdPointerSize * 1.2
        ); 
                
        // ― shape blur & blend
        float sampled = median(texture2D(tMap, vUv).rgb);

        float aBlur;
        aBlur = getBlur(uvRemapped0 / 0.7, 0.6, u_progressBlur0);
        aBlur += getBlur(uvRemapped, 0.3, u_progressBlur1);
        aBlur += sdPointer * 0.6;
        aBlur = saturate(aBlur);
    
        // ― SDF Text
        float sdfBlur;
        sdfBlur = 1.0 - fill(
            sampled, 
            mix(0.2, 0.5, 1. - aBlur), 
            mix(0.5, 0., 1. - aBlur)
        );
        
        float sdfDefault;
        #ifdef LOW_RES
            vec2 dxy = dFdx(vUv) * TEX_SIZE;
            float threshold = 0.45;
            float sigDist = sampled;
            float afwidth = fwidth(sigDist);
            sdfDefault = smoothstep(threshold - afwidth, threshold + afwidth, sigDist);
        #else
            sdfDefault = aastep(0.5, sampled);
        #endif
        float sdf = aBlur > 0.0 ? sdfBlur : sdfDefault;
        
        float a = sdf * u_alpha;
        a *= 1.0 - smoothstep(0.1, .9, aBlur);
        a = saturate(a);
        
        
        vec3 c = u_color;
        #ifdef HAS_BLENDING
            float blendReveal = saturate(sdMaskBlend + sdBlendShape);
            c = mix(u_colorBlending, c, a);
            gl_FragColor = vec4(c, 1.0);
        #else
            gl_FragColor = vec4(c, a);
        #endif
        
        #ifdef USE_DEBUG
        gl_FragColor = vec4(vec3(aBlur), 0.5);
        // gl_FragColor = vec4(vec3(aBlur * 0.4, sdfDefault * (1. - aBlur), 1.), 0.5);
        // gl_FragColor = vec4(vec3(sdPointer), 1.);
        // gl_FragColor = vec4(c, sdf);
        // gl_FragColor = vec4(c, sdfDefault * u_alpha);
        // gl_FragColor = vec4(vec3(vLocalPos.x, 0., 1.), 1.);
        // gl_FragColor = vec4(vec3(uvRemapped.x, 0., 1.), 1.);
        #endif
    }
`,Ve={name:"TextLens",props:{id:{type:Number,default:Date.now()},text:{type:String,default:""},width:{type:Number,default:1/0},align:{type:String,default:"center"},blending:{type:Number,default:de},color:{type:String,default:"#ffffff"},lowQuality:{type:Boolean,default:!1},focused:{type:Boolean,default:!0},placeholder:{type:Boolean,default:!1}},emits:["text:focus","text:unfocus"],setup(E,{emit:A}){const n=Rn({posInner:new l(0,0,0),posOffset:new l(0,0,0),aBlur:0,aAlpha:1,sBase:Ie?22.2:13.4,sZoom:1,pSizePointerBlur:.25}),{renderer:e}=X("renderer"),i=Cn(({width:R,height:u})=>{const s=e.getPixelRatio();F.set(R*s,u*s)},{immediate:!0}),f=Rn({});Ne(({data:R})=>{f.fontMap=R.fontMap,f.fontData=R.fontData,D()});const M=bn(()=>n.sBase*n.sZoom*(16/1920*i.width)),{object:d}=Ee(null,{props:{s:M}}),S=new Le,I=new _e;let a=null,C=null;const U=new l,_=new l,r=new l(.5,0,0),o=new V,P=new l().copy(n.posOffset),F=new V,g=new V,B=new nn(E.color),{set:q}=J(U,{lambda:1.4}),{set:K}=J(n,{lambda:6},["pSizePointerBlur"]),{set:y}=J(g,{lambda:8},["x","y"]);let N;const Mn=async()=>{const R={tMap:{value:f.fontMap},uBounds:{value:_},uResolution:{value:F},u_pointer:{value:g},u_color:{value:B}};N=new xe({uniforms:R,defines:{HAS_MASKING:!0,CENTER_ALIGN:E.align==="center",LOW_RES:E.lowQuality},blending:E.blending}),C=new mn(I,N),C.layers.set(1),S.add(C)},h=R=>{if(!a)return;a.update({text:R});const{position:u,uv:s,id:on,index:ln}=a.buffers;I.setAttribute("position",new Ln(u,3)),I.setAttribute("uv",new Ln(s,2)),I.setAttribute("id",new Ln(on,1)),I.setIndex(new Re(ln,1)),I.computeBoundingBox(),I.boundingBox.getSize(_),q({x:Math.max(r.x-(_.x-r.x),0)},!0),r.copy(_),o.set(a.width,a.height),C.position.set(0,_.y*(_.y/a.height),0),q(_)},{isDown:dn}=Un(({x:R,y:u})=>{const s=e.getPixelRatio();y({x:R*s,y:F.y-u*s})});p(dn,R=>{K({pSizePointerBlur:R?.5:.25})}),p(n.posInner,R=>S.position.copy(R).add(P),{immediate:!0});const Q=()=>{const{aAlpha:R,aBlur:u}=n;N&&(N.u_progressBlur0=u,N.u_progressBlur1=E.placeholder?1:_.x==0?0:Math.max(0,U.x/_.x),N.u_pointerBlur=n.pSizePointerBlur,N.u_alpha=R)},D=()=>{a=new ie({font:f.fontData,text:E.text,width:E.width,align:E.align,letterSpacing:E.letterSpacing,lineHeight:E.lineHeight,maxTimes:120}),d.add(S),Mn(),h(E.text),Q()};let O;const m=()=>{O==null||O.kill(),E.placeholder?O=Pn.timeline().fromTo(n,{aAlpha:0},{aAlpha:1,duration:3},.1).fromTo(n,{sZoom:1.6},{sZoom:1,duration:2.4,ease:"sine.out"},0).fromTo(n,{aBlur:0},{aBlur:1,duration:4,ease:"power2.out"},.2):Z()},G=()=>{O==null||O.kill(),O=Pn.timeline({onComplete:()=>A("text:unfocus",{id:E.id})}).to(n,{aAlpha:0,duration:1.4},.1).to(n,{sZoom:.7,duration:1.6,ease:"power3.out"},0).to(n,{aBlur:0,duration:2.5,ease:"power2.out"},0)},Z=()=>{n.aBlur=1,n.aAlpha=1,n.sZoom=1};Dn(Q),p(()=>E.text,R=>{O==null||O.kill(),E.focused&&(R==""&&(r.set(.5,0,0),_.set(0,0,0)),Z(),h(R))}),p(()=>E.focused,R=>R?m():G(),{immediate:!0}),p(()=>E.placeholder,R=>{R||(r.set(.5,0,0),_.set(0,0,0),h(E.text))});const j=On([],{title:"Text",expanded:!0});return j.addButton({title:"focus"}).on("click",()=>m()),j.addButton({title:"unfocus"}).on("click",()=>G()),{object:d}}};function He(E,A,n,e,i,f){return cn(E.$slots,"default")}const Xe=hn(Ve,[["render",He]]),ge=16,Be={__name:"index",setup(E){const{renderer:A,scene:n,registerRenderFn:e}=X("renderer"),i=new Te(-1,1,1,-1,0,10);i.layers.set(1),Cn(({width:_,height:r})=>{i.left=-_/2,i.right=_/2,i.top=r/2,i.bottom=-r/2,i.updateProjectionMatrix()});const f=Pe({concurrency:10,loaders:[pn,An]});An.setGlobals({renderer:A});const M=Tn(null),d=Tn([{id:Date.now(),text:"TYPE.",focused:!1}]),S=un(""),I=()=>{d.value[d.value.length-1]&&(d.value[d.value.length-1].focused=!1),d.value.push({id:Date.now(),focused:!0,placeholder:!1}),S.value=""},a=()=>{M.value.focus()},C=_=>{_.key==="Enter"&&I()},U=({id:_})=>{const r=d.value.findIndex(o=>o.id===_);r!==-1&&d.value.splice(r,1)};return p(S,_=>{_.length>=ge&&I(),_.length>0&&d.value[0].placeholder==!0&&(d.value[0].placeholder=!1)}),On([],{title:"Title Lens",expanded:!0}),fn(()=>{f.start(),f.lock(),d.value[0].focused=!0,d.value[0].placeholder=!0,setTimeout(()=>{M.value.focus()},1500)}),e(()=>{A.clear(),A.render(n,i)}),(_,r)=>(Y(),Sn("div",{class:"textLens",onClick:a},[Yn(zn("input",{ref_key:"refInput",ref:M,class:"textLens__input",onKeyup:C,"onUpdate:modelValue":r[0]||(r[0]=o=>S.value=o),placeholder:""},null,544),[[wn,S.value]]),an(b(ue),null,{default:tn(()=>[(Y(!0),Sn(Wn,null,kn(d.value,(o,P)=>{var F;return Y(),vn(Xe,qn({key:o.id,ref_for:!0},o,{text:o.placeholder?"TYPE.":o.focused?S.value.toUpperCase():(F=S.value.value)==null?void 0:F.toUpperCase(),"onText:unfocus":U}),null,16,["text"])}),128))]),_:1})]))}},ye=["data-name"],Qe={__name:"ComponentGl",setup(E){const A=Kn(),n=Tn(),e=un(),i="production",M=[{id:"raymarch-sphere",component:Ce},{id:"text-lens",component:Be}].find(d=>new RegExp(`\\b${d.id}\\b`,"i").test(A.path));return e.value=M.component,fn(()=>document.body.style.overflow="hidden"),(d,S)=>(Y(),Sn("div",{class:"component no-select","data-name":b(M).id},[an(b(Zn),{hiddenOnStart:b(i)=="production"},{default:tn(()=>[an(b(fe),{ref:"refRenderer",antialias:!1,autoResize:!0,autoRender:!0},{default:tn(()=>[(Y(),vn(Qn(e.value),{ref_key:"refComponent",ref:n},null,512))]),_:1},512)]),_:1},8,["hiddenOnStart"])],8,ye))}};export{Qe as default};
