import { materialEasyUniforms } from '@resn/gozer-three';
import { ShaderMaterial, Color, Vector2 } from 'three';

import glslMedian from '@resn/gozer-glsl/functions/median.glsl';
import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
import glslMap from '@resn/gozer-glsl/math/map.glsl';
import glslSaturate from '@resn/gozer-glsl/math/saturate.glsl';
import glslScale from '@resn/gozer-glsl/transform/scale.glsl';
import glslCoord from '@resn/gozer-glsl/functions/coord.glsl';
import glslSDCircle from '@resn/gozer-glsl/sdf/sdCircle.glsl';

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
                    HAS_BLENDING_MAP: false,
                    HAS_STROKE: false,

                    CENTER_ALIGN: true,
                    LOW_RES: false,
                },
                transparent: true,
                depthTest: false,
            },
            props,
        );
        super(props);

        const uniforms = {
            uTime: { value: 0 },
            uAlpha: { value: 0 },

            uProgressBlur: { value: 0 },
            uProgressMask: { value: 0 },
            uPointerSpeed: { value: new Vector2() },

            uBlurShapePower: { value: 0.5 },
            uBlurShapeSize: { value: 0.1 },

            uColor: { value: new Color('#000000') },
            uColorBlending: { value: new Color('#ffffff') },

            uMapBlendOffset: { value: new Vector2() },
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
    uniform vec3 uColor;
    uniform vec3 uBounds;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform vec2 uPointerSpeed;
    uniform float uTime;
    uniform float uAlpha;
    
    uniform sampler2D tMap;
    #ifdef HAS_BLENDING
        uniform vec3 uColorBlending;
        #ifdef HAS_BLENDING_MAP
            uniform vec2 uMapBlendOffset;
            uniform sampler2D tMapBlend;
        #endif
    #endif

    #define TEX_SIZE vec2(512.)

    uniform float uBlurShapePower;
    uniform float uBlurShapeSize;
    
    uniform float uProgressBlur;
    #ifdef HAS_MASKING
        uniform float uProgressMask;
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

    float getBlurShape(in vec2 st, in float size, in float edge, in float amount){
        vec2 transformedUV = st + mx * vec2(-1., 1.);
        transformedUV -= 0.5;
        float l = length(transformedUV);
        vec2 pspeed = uPointerSpeed;
        if(length(pspeed) < 0.001){
            pspeed.x = 0.1;
        }
        float angle = atan(transformedUV.y, transformedUV.x)+atan(pspeed.x, pspeed.y);
        float len = max(0.001, length(uPointerSpeed));
        transformedUV = vec2(cos(angle)*(l*(1.0+len*0.03)), sin(angle)*(l/max(0.1, (1.0+abs(len)*0.03))));
            
        transformedUV += 0.5;
        float sd = fill(sdCircle(transformedUV), size, edge);
        return sd * amount;
    }

    void main() {
        vec2 uv = vUv;
        vec2 uvRemapped = map(
            vLocalPos.xy, 
            #ifdef CENTER_ALIGN
                -uBounds.xy / 2., 
                uBounds.xy / 2., 
            #else
                vec2(0.), 
                uBounds.xy, 
            #endif
            vec2(0.), vec2(1.));
        #ifdef HAS_REVERSE
            uvRemapped = scale(uvRemapped, -1.);
        #endif

        float cursorSpeed = pow(max(0.001, length(uPointerSpeed)*0.01), 4.0);
       
      
        vec2 st = st0 + 0.5;
        
        float speedMul = max(0.0, 1.0 - cursorSpeed*100.0);
        // ― shape blur & blend
        float size = max(0.0, uBlurShapeSize*speedMul);
        float sdBlurShape = getBlurShape(st, size, mix(size, 0.06, 0.4), 2.);
        float sdBlendShape = getBlurShape(st, size*1.2, size + 0.07, 1.);
        sdBlurShape *= smoothstep(1.0, 0.8, sdBlurShape);
        // float sdBlurShape = getBlurShape(st, 0.15, 0.3, uBlurShapePower);
        // float sdBlendShape = getBlurShape(st, 0.3, 0.3, 0.8);
        
        float feather = 0.3;
        float sdfSample = median(texture2D(tMap, vUv).rgb);
        float sdBlur = smoothstep(
            1. - feather, 1., 
            uvRemapped.x + mix(-feather, 1., uProgressBlur)
        );
             sdBlur += sdBlurShape*size*10.0;
             sdBlur = saturate(sdBlur);
        
             // ― SDF Text 
             float sdfBlur = 1. - fill(
                     sdfSample, 
                     mix(0.5, 0., sdBlur),
                     mix(0., 1., sdBlur)
                 );
                 sdfBlur = smoothstep(0.5, 1., sdfBlur);
        

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
        float sdf = sdBlur > 0. ? sdfBlur : sdfDefault;


        float a = sdf * uAlpha;
              a *= 1. - max(0.0, ((smoothstep(0.4, 1.0, sdBlur))* 0.8));//*max(0.0, (1.0-cursorSpeed*1000.0*sdBlurShape)));
              a *= 1. - (sdBlurShape * 0.2);
              a = saturate(a);
              
        #ifdef HAS_MASKING
            float sdMask = smoothstep(
                1. - feather, 1., 
                uvRemapped.x + mix(-feather, 1., uProgressMask)
            );
        #endif
        
        vec3 c = uColor;
        #ifdef HAS_BLENDING
            float blendReveal = saturate(sdMask + sdBlendShape);
                 
            #ifdef HAS_BLENDING_MAP
                vec2 stMapBlend = uv0;
                     stMapBlend += uMapBlendOffset;
                vec3 cBlend = texture2D(tMapBlend, stMapBlend).rgb;
                c = mix(c, cBlend, blendReveal);
            #endif
            c = mix(uColorBlending, c, a);
            gl_FragColor = vec4(c, 1.);
        #else
            gl_FragColor = vec4(c, a);
        #endif

        gl_FragColor.xyz *= 1.0+sdBlurShape*speedMul*0.001;
        gl_FragColor.xyz *= 1.0+(sdBlurShape*0.01);
        // gl_FragColor = vec4(vec3(sdBlurShape), 1.);
        // gl_FragColor = vec4(vec3(sdfDefault), 1.);
        // gl_FragColor = vec4(c, a);
        gl_FragColor = vec4(vec3(sdfSample), 1.);
    }
`;
