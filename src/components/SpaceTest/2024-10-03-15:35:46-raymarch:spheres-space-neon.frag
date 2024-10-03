/*
glslViewer 2024-10-03-15:35:46-raymarch:spheres-neon.frag -e camera_position,-1.4,6.,2. -e floor,on -l
--fxaa -e floor,on
*/
varying vec2 vUv;

uniform vec3 u_camera;
uniform vec3 u_target;
uniform vec3 u_light;
uniform vec3 u_lightColor;
uniform float u_time;

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

#define LIGHT_POSITION vec3(sin(u_time * 1.0) * 1.0, sin(u_time * 0.2) * 2.0, - cos(u_time * 0.2) * -2.0)
#define LIGHT_COLOR COLOR_LIGHT

#include "lygia/space/ratio.glsl"
#include "lygia/sdf.glsl"
#include "lygia/color/space/linear2gamma.glsl"
#include "lygia/space/scale.glsl"

// SHADING
#define RAYMARCH_SHADING_FNC raymarchShading
#include "lygia/lighting/raymarch/shading.glsl"

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

#include "lygia/lighting/raymarch.glsl"

Material raymarchMap(vec3 pos) {
    
    float t = u_time;
    float t0 = u_time / 2.0;
    
    vec3 p0 = pos;
    p0 += vec3(0.0, 0.3, 0.0);
    p0.y += - 1.0 + sin(u_time * 1.0) * 1.0;
    
    vec3 p1 = pos;
    p1 += vec3(
        sin(t0 * -1.0) * 1.0,
        cos(t0 * 0.6) * 0.4,
        sin(t0 * -0.2) * 2.0
    );
    
    float sdPlane = planeSDF(pos);
    
    float sdSph0;
    sdSph0 = sphereSDF(p0, 1.2);
    
    float sdSph1;
    sdSph1 = sphereSDF(p1, 1.0);
    
    Material res = materialNew(vec3(0.0), 0.0);
    res.sdf = opUnion(sdSph0, sdPlane, 2.0);
    
    return res;
}

void main() {
    vec3 color = vec3(0.0);
    vec2 uv = vUv;
    vec2 st = ratio(uv, u_resolution);
    vec4 res = raymarch(u_camera, u_target, st);
    
    color = res.rgb;
    color = linear2gamma(color);
    
    float a = res.a;
    
    gl_FragColor = vec4(color, a);
    // gl_FragColor = vec4(vec3(st.x), 1.0);
}

