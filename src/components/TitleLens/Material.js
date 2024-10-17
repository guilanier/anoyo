import { Color, ShaderMaterial, Vector2 } from 'three';

import glslCoord from '@resn/gozer-glsl/functions/coord.glsl';
import glslMedian from '@resn/gozer-glsl/functions/median.glsl';
import glslMap from '@resn/gozer-glsl/math/map.glsl';
import glslSaturate from '@resn/gozer-glsl/math/saturate.glsl';
import glslSDCircle from '@resn/gozer-glsl/sdf/sdCircle.glsl';
import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
import glslScale from '@resn/gozer-glsl/transform/scale.glsl';
import { materialEasyUniforms } from '@resn/gozer-three';

class TextLensMaterial extends ShaderMaterial {
    constructor(props, options) {
        props = Object.assign(
            {
                vertexShader,
                fragmentShader,
                type: 'LensMaterial',
                extensions: { derivatives: true },
                defines: {
                    HAS_REVERSE: false,
                    HAS_MASKING: false,
                    HAS_BLENDING: false,

                    CENTER_ALIGN: true,
                    LOW_RES: false,

                    USE_DEBUG: false,
                },
                transparent: true,
                depthTest: false,
                depthTest: false,
            },
            props
        );
        super(props);

        const uniforms = {
            u_time: { value: 0 },
            u_alpha: { value: 0 },

            u_progressBlur: { value: 0 },
            u_progressMask: { value: 0 },
            u_pointerSpeed: { value: new Vector2() },

            u_blurShapePower: { value: 0.5 },
            u_blurShapeSize: { value: 0.1 },

            u_color: { value: new Color('#000000') },
            u_colorBlending: { value: new Color('#ffffff') },

        };
        this.uniforms = { ...uniforms, ...this.uniforms };
        materialEasyUniforms(this);
    }
}
export default TextLensMaterial;

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vLocalPos;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vLocalPos = position.xyz;
    }
`;
const fragmentShader = /* glsl */ `
uniform vec3 u_color;
uniform vec3 uBounds;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 u_pointerSpeed;
uniform float u_time;
uniform float u_alpha;

uniform sampler2D tMap;
#ifdef HAS_BLENDING
uniform vec3 u_colorBlending;
#endif

#define TEX_SIZE vec2(512.0)

uniform float u_blurShapePower;
uniform float u_blurShapeSize;

uniform float u_progressBlur;
#ifdef HAS_MASKING
uniform float u_progressMask;
#endif

varying vec2 vUv;
varying vec3 vLocalPos;

${glslCoord}
${glslMedian}
${glslMap}
${glslSaturate}
${glslSDCircle}
${glslScale}
${glslDraw}

void main() {
    vec2 uv = vUv;
    vec2 uvRemapped;
    #ifdef CENTER_ALIGN
        uvRemapped = map(vLocalPos.xy, 
            - uBounds.xy / 2.0, uBounds.xy / 2.0, 
            vec2(0.0), vec2(1.0)
        );
    #else
        uvRemapped = map(vLocalPos.xy, vec2(0.0), uBounds.xy,, vec2(0.0), vec2(1.0));
    #endif
    
    #ifdef HAS_REVERSE
        uvRemapped = scale(uvRemapped, - 1.0);
    #endif
    
    float cursorSpeed = pow(max(0.001, length(u_pointerSpeed) * 0.01), 4.0);
    
    vec2 st = st0 + 0.5;
    
    float speedMul = max(0.0, 1.0 - cursorSpeed * 100.0);
    // ― shape blur & blend
    float size = max(0.0, u_blurShapeSize * speedMul);

    float feather = 0.3;
    float sdfSample = median(texture2D(tMap, vUv).rgb);
    float sdBlur = smoothstep(
        1.0 - feather, 1.0,
        uvRemapped.x + mix(-feather, 1.0, u_progressBlur)
    );
    sdBlur = saturate(sdBlur);
    
    // ― SDF Text
    float sdfBlur = 1.0 - fill(
        sdfSample,
        mix(0.5, 0.0, sdBlur),
        mix(0.0, 1.0, sdBlur)
    );
    sdfBlur = smoothstep(0.5, 1.0, sdfBlur);
    
    float sdfDefault;
    #ifdef LOW_RES
        vec2 dxy = dFdx(vUv) * TEX_SIZE;
        float threshold = 0.45;
        float sigDist = sdfSample;
        float afwidth = fwidth(sigDist);
        sdfDefault = smoothstep(threshold - afwidth, threshold + afwidth, sigDist);
    #else
        sdfDefault = aastep(0.5, sdfSample);
    #endif
    float sdf = sdBlur > 0.0 ? sdfBlur : sdfDefault;
    
    float a = sdf * u_alpha;
    a *= 1.0 - max(0.0, ((smoothstep(0.4, 1.0, sdBlur)) * 0.8));
    // a *= 1.0 - (sdBlurShape * 0.2);
    a = saturate(a);
    
    #ifdef HAS_MASKING
    float sdMask = smoothstep(
        1.0 - feather, 1.0,
        uvRemapped.x + mix(-feather, 1.0, u_progressMask)
    );
    #endif
    
    vec3 c = u_color;
    #ifdef HAS_BLENDING
        float blendReveal = saturate(sdMask + sdBlendShape);
        c = mix(u_colorBlending, c, a);
        gl_FragColor = vec4(c, 1.0);
    #else
        gl_FragColor = vec4(c, a);
    #endif
    
    #ifdef USE_DEBUG
    // gl_FragColor = vec4(vec3(sdBlurShape), 1.);
    // gl_FragColor = vec4(vec3(sdfDefault), 1.);
    #endif
}`;
