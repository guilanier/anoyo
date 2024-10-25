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
                transparent: true,
                depthTest: false,
                depthTest: false,
            },
            props
        );
        super(props);

        this.defines = {
            HAS_REVERSE: false,
            HAS_MASKING: false,
            HAS_BLENDING: false,

            CENTER_ALIGN: true,
            LOW_RES: false,

            USE_DEBUG: false,
            ...props.defines
        };


        const uniforms = {
            u_time: { value: 0 },
            u_alpha: { value: 0 },

            u_progressBlur: { value: 0 },
            u_progressMask: { value: 0 },

            u_pointer: { value: new Vector2() },
            u_pointerBlur: { value: 0.25 },

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
    uniform vec3 uBounds;
    uniform vec2 uResolution;
    
    uniform vec3 u_color;
    uniform float u_time;
    uniform float u_alpha;
    
    uniform vec2 u_pointer;
    uniform float u_pointerBlur;

    #define uPointer u_pointer

    uniform sampler2D tMap;
    #ifdef HAS_BLENDING
    uniform vec3 u_colorBlending;
    #endif

    #define TEX_SIZE vec2(512.0)

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

        vec2 st = st0 + 0.5;
        vec2 stPointer = st - mx;
        
        vec2 uvRemapped;
        #ifdef CENTER_ALIGN
            uvRemapped = map(vLocalPos.xy, 
                - uBounds.xy / 2.0, 
                uBounds.xy / 2.0, 
                vec2(0.0), vec2(1.0)
            );
        #else
            uvRemapped = map(vLocalPos.xy, 
                vec2(0.0), 
                uBounds.xy, vec2(0.0), vec2(1.0)
            );
        #endif
        #ifdef HAS_REVERSE
            uvRemapped = scale(uvRemapped, - 1.0);
        #endif

        // ― pointer shape
        float sdPointerSize = u_pointerBlur != 0.0 ? u_pointerBlur : 0.25;;
        float sdPointer = fill(
            sdCircle(stPointer), 
            sdPointerSize * 0.7, 
            sdPointerSize * 1.5
        ); 
                
        // ― shape blur & blend
        float sampled = median(texture2D(tMap, vUv).rgb);

        float aBlurFeather = (1.0 / uBounds.x) * 0.3;
        float aBlurFeatherHalf = aBlurFeather * 0.5;
        float aBlurDistFromEdge = mix(aBlurFeatherHalf, 1.0 - aBlurFeatherHalf, uvRemapped.x);
        float aBlur = smoothstep(
            u_progressBlur - aBlurFeather, 
            u_progressBlur + aBlurFeather, 
            uvRemapped.x
        );
        aBlur += sdPointer * 0.5;
        aBlur = saturate(aBlur);
    
        // ― SDF Text
        float sdfBlur;
        sdfBlur = 1.0 - fill(
            sampled, 
            mix(0.2, 0.5, 1. - aBlur), 
            mix(0.5, 0., 1. - aBlur)
        );
        // sdfBlur = smoothstep(0., 1.0, sdfBlur);
        
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
        
        #ifdef HAS_MASKING
        float sdMaskBlend = smoothstep(
            1.0 - aBlurFeather, 1.0,
            uvRemapped.x + mix(-aBlurFeather, 1.0, u_progressMask)
        );
        #endif
        
        vec3 c = u_color;
        #ifdef HAS_BLENDING
            float blendReveal = saturate(sdMaskBlend + sdBlendShape);
            c = mix(u_colorBlending, c, a);
            gl_FragColor = vec4(c, 1.0);
        #else
            gl_FragColor = vec4(c, a);
        #endif
        
        #ifdef USE_DEBUG
        // gl_FragColor = vec4(vec3(aBlur * 0.4, sdfDefault * (1. - aBlur), 1.), 0.5);
        // gl_FragColor = vec4(vec3(sdPointer), 1.);
        // gl_FragColor = vec4(c, sdf);
        // gl_FragColor = vec4(vec3(vLocalPos.x, 0., 1.), 1.);
        // gl_FragColor = vec4(vec3(uvRemapped.x, 0., 1.), 1.);
        #endif
    }
`;
