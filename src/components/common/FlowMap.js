import gsap from 'gsap';
import { HalfFloatType, ShaderMaterial, Vector2 } from 'three';
import {
    defineComponent,
    defineExpose,
    inject,
    onBeforeUnmount,
    provide,
    reactive,
    ref,
    watch,
    watchEffect,
} from 'vue';

import { isHandheld, isMobile } from '@resn/gozer-env';
import glslSDCircle from '@resn/gozer-glsl/sdf/sdCircle.glsl';
import glslDrawing from '@resn/gozer-glsl/shapes/draw.glsl';
import { FBOReader, simpleVs } from '@resn/gozer-three';
import { FlowPass } from '@resn/gozer-three/passes';
import { useDamp, usePane, useRafBool, useViewportResize, useWindowPointer, useElementTouch } from '@resn/gozer-vue';

const postKey = 'FLOWMAP_KEY';

export const useFlowmap = () => {
    const flowMap = inject(postKey, { fbo: null, render: null, pass: null });
    return flowMap;
};

export const FlowMap = defineComponent({
    props: {
        debug: { type: Boolean, default: false },
        autoRender: { type: Boolean, default: true },
    },
    setup(props) {
        const { renderer } = inject('renderer');

        const enabled = ref(true);

        const vPointer = new Vector2();
        const vPointerNorm = new Vector2();
        const vPointerVelocity = new Vector2();
        const vPointerLast = new Vector2();

        const vFlowVelocity = new Vector2();
        const vResolution = new Vector2();

        const uPulse = { value: 0 };

        const params = reactive({
            pulseSmoothed: false,

            size: 0.2,
            alpha: 1,
            falloff: 0.3,
            dissipation: 0.92,
        });

        const paramsDefault = Object.freeze({ ...params });

        const setParameters = (obj) => {
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) params[key] = obj[key];
            }
        };

        const { set: setFlowVelocity } = useDamp(vFlowVelocity, { lambda: 8 }, ['x', 'y']);
        const { set: setPulse } = useDamp(uPulse, { lambda: 8 }, ['value']);

        watch(params, ({ size, alpha, falloff, dissipation }) => {
            shaderFlow.uniforms.uSize.value = size;
            shaderFlow.uniforms.uAlpha.value = alpha;
            shaderFlow.uniforms.uFalloff.value = falloff;
            shaderFlow.uniforms.uDissipation.value = dissipation;
        });

        watch(
            () => params.pulseSmoothed,
            (val) => {
                shaderFlow.defines.USE_PULSE_SMOOTH = val;
                shaderFlow.needsUpdate = true;
            }
        );

        // ― flow map
        let shaderFlow;
        shaderFlow = new ShaderMaterial({
            vertexShader: simpleVs,
            fragmentShader: /* glsl */ `
                precision highp float;

                uniform sampler2D tMap;
                uniform float uFalloff;
                uniform float uAlpha;
                uniform float uPulse;
                uniform float uSize;
                uniform float uDissipation;
                uniform vec2 uPointer;
                uniform vec2 uVelocity;
                
                varying vec2 vUv;
                
                ${glslDrawing}
                ${glslSDCircle}
                
                void main() {
                    vec4 color = texture2D(tMap, vUv) * uDissipation;
                    float l = length(uVelocity);
                    vec2 st = clamp(vUv + (0.5 - uPointer), -1., 1.);

                    // ― impulse 
                    float impulse;
                    #ifdef USE_PULSE_SMOOTH
                        impulse = fill(sdCircle(st), 0.2, 0.6) * uPulse;
                    #else
                        impulse = fill(sdCircle(st), mix(0., 0.25, uPulse), mix(0., 0.8, uPulse));
                    #endif
                    
                    // ― stamp 
                    vec3 stamp = vec3(uVelocity, impulse);
                    vec2 stPulse = clamp(vUv - uPointer, -1., 1.);
                    float falloff = fill(sdCircle(st), uSize, uFalloff) * uAlpha;
                    
                    // ― apply
                    if(color.b < 0.01) color.rgb = mix(color.rgb, stamp, falloff);
                    color.rgb = mix(color.rgb, vec3(1.), impulse);
                    // color.rgb = mix(color.rgb, vec3(stPulse, 1.), impulse);
                    
                    gl_FragColor = color;
                    // gl_FragColor = vec4(vec3(stImpulse, 0.), 1.);
                    // gl_FragColor = vec4(vec3(1.0 - pow(1.0 - min(1.0, l), 3.0)), 1.);
            }`,
            uniforms: {
                tMap: { value: null },

                uSize: { value: params.size },
                uAlpha: { value: params.alpha },
                uDissipation: { value: params.dissipation },
                uFalloff: { value: params.falloff },

                uResolution: { value: vResolution },
                uPointer: { value: vPointerNorm },
                uVelocity: { value: vFlowVelocity },

                uPulse,
            },
            depthTest: false,
            defines: {
                USE_PULSE_SMOOTH: true,
            },
        });

        const flowPass = new FlowPass(renderer, {
            shader: shaderFlow,
            vVelocity: vFlowVelocity,
            vPosition: vPointerNorm,
            type: HalfFloatType,
            falloff: 0.32,
            dissipation: 0.92,
            size: 256,
        });
        if (shaderFlow) shaderFlow.uniforms.tMap = flowPass.uniform;

        let fboReader;
        if (props.debug) {
            fboReader = new FBOReader(renderer, { minWidth: 128 });
            fboReader.attach(flowPass.fbo.read);
            // fboReader.attach(shaderPassDebug.fbo.read);
        }

        onBeforeUnmount(() => {
            flowPass?.dispose();
            fboReader?.dispose();
        });

        const render = () => {
            if (!vPointerVelocity.needsUpdate) vPointerVelocity.set(0, 0);
            vPointerVelocity.needsUpdate = false;

            setFlowVelocity({ x: vPointerVelocity.x, y: -vPointerVelocity.y });

            flowPass?.render();
            fboReader?.render();
        };

        let tlPulse;
        const pulse = () => {
            if (params.pulseSmoothed) {
                tlPulse?.kill();
                tlPulse = gsap
                    .timeline({ options: { overwrite: true } })
                    .to(uPulse, { value: 0.6, duration: 0.5, ease: 'expo.out' })
                    .to(uPulse, { value: 0, duration: 0.5, ease: 'expo.out' });
            } else {
                setPulse({ value: 1 });
                setTimeout(() => setPulse({ value: 0 }, true), 150);
            }
        };

        // ― pointer
        const { pointer } = isMobile ? useElementTouch() : useWindowPointer();
        let tPointerFlowLast;
        const updatePointer = ({ x, y }) => {
            if (!tPointerFlowLast) {
                tPointerFlowLast = performance.now();
                vPointerLast.set(x, y);
            }
            vPointerNorm.set(x, y).divide(vResolution);

            const t = performance.now();
            const dt = Math.max(14, t - tPointerFlowLast);
            tPointerFlowLast = t;

            if (isHandheld) return;

            vPointer.set(x, y);
            vPointerVelocity.subVectors(vPointer, vPointerLast).divideScalar(dt).clampLength(0, 3);
            vPointerVelocity.needsUpdate = true;
            vPointerLast.set(x, y);
        };
        watchEffect(() => updatePointer(pointer));
        // watch(isDown, (val) => (val ? pulse() : null));

        const providerObj = {
            fbo: flowPass.fbo.read,
            setParameters,
            setEnabled(val) {
                enabled.value = val;
            },
            get enabled() {
                return enabled.value;
            },
            paramsDefault,
            render
        };

        defineExpose({ provider: providerObj });
        provide(postKey, providerObj);

        useViewportResize(({ width, height }) => vResolution.set(width, height), true);

        useRafBool(enabled && props.autoRender, () => render());
        usePane([{ name: 'enabled', value: enabled }, { value: params }], {
            title: 'Flow Map',
            expanded: true,
        });
    },

    render() {
        if (this.$slots.default) return this.$slots.default();
    },
});
