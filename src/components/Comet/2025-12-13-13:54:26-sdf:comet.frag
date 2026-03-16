#ifdef GL_ES
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

#define uResolution u_resolution
#define uPointer u_mouse

#include "node_modules/@resn/gozer-glsl/functions/coord.glsl"

#include "lygia/draw/fill.glsl"
#include "lygia/draw/stroke.glsl"
#include "lygia/draw/circle.glsl"
#include "lygia/sdf/circleSDF.glsl"
#include "lygia/sdf/rectSDF.glsl"
#include "lygia/space/scale.glsl"

void main() {
    
    vec2 st = st0 + 0.5;
    vec2 cMouse = mx;
    vec2 stPointer = st - cMouse;
    stPointer = 1.0 - stPointer;
    
    float blurSize = u_blur != 0.0 ? u_blur : 0.6;
    // float blurAmount = circleSDF(stPointer);
    float blurAmount = fill(
        circleSDF(stPointer),
        blurSize * 1.0,
        blurSize * 2.0
    ) * 2.0;
    
    float size = u_size != 0.0 ? u_size : 0.1;
    
    float sdCircle = circleSDF(st);
    float sdShape = sdCircle;
    
    float sdfFill = fill(sdShape, size, blurAmount) * 2.0;
    
    float sdf;
    sdf = sdfFill;
    
    float shapeOut = sdf;
    float sd = saturate(shapeOut);
    
    vec3 color = vec3(0.0);
    color = vec3(sd);
    // color = vec3(blurAmount);
    
    gl_FragColor = vec4(color, 1.0);
}