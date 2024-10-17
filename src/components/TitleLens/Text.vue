<template>
    <div ref="container"></div>
</template>

<script>
    import gsap from 'gsap';
    import {
        BufferGeometry,
        Color,
        Float32BufferAttribute,
        Mesh,
        NormalBlending,
        Object3D,
        Uint16BufferAttribute,
        Vector2,
        Vector3,
    } from 'three';
    import { computed, reactive, watch } from 'vue';

    import { LoaderEvent } from '@resn/gozer-loading';
    import { Text } from '@resn/gozer-three';
    import { usePane, useRaf, useThreeObject } from '@resn/gozer-vue';
    import { useLoader } from '@resn/gozer-vue/loading';

    import TextLensMaterial from './Material';

    export default {
        name: 'TextLens',
        props: {
            text: { type: String, default: 'LE TEXT' },
            width: { type: Number, default: 4 },
            align: { type: String, default: 'center' },
            letterSpacing: { type: Number, default: -0.04 },
            blending: { type: Number, default: NormalBlending },
            lineHeight: { type: Number, default: 1.4 },

            shader: { type: Object, default: null },

            color: { type: String, default: '#ffffff' },
            lowQuality: { type: Boolean, default: false },
        },
        setup(props) {
            const props0 = reactive({
                aBlur: 1,
                aAlpha: 1,
                aBlending: 1,

                sBase: 1,
                sZoom: 1,

                posInner: new Vector3(),
                posOffset: new Vector3(),
            });

            const assets = {
                fontMap: null,
                fontData: null,
            };

            const { object, props: propsTfObject } = useThreeObject(null, {
                props: { s: computed(() => props0.sZoom * props0.sBase) },
            });
            const inner = new Object3D();

            const geo = new BufferGeometry();

            let textBuffers = null;
            let mesh = null;

            const vBounds = new Vector3();
            const vTextSize = new Vector2();
            const vTextOffset = new Vector3().copy(props0.posOffset);
            const vResolution = new Vector2();
            const vPointer = new Vector2();

            const cColor = new Color(props.color);

            useLoader({
                fontMap: '/textures/font/fellix-bold.png#texture',
                fontData: '/textures/font/fellix-bold.json',
            }).once(LoaderEvent.LOAD_COMPLETE, ({ data }) => {
                const { fontMap, fontData } = data;
                assets.fontMap = fontMap;
                assets.fontData = fontData;
                init();
            });

            let shader;
            const createMesh = async () => {
                const uniforms = {
                    tMap: { value: assets.fontMap },
                    uBounds: { value: vBounds },
                    uResolution: { value: vResolution },
                    uPointer: { value: vPointer },
                    u_pointerSpeed: { value: new Vector2() },
                    u_blurShapeSize: { value: 0.1 },
                    u_color: { value: cColor },
                };
                shader =
                    props.shader ||
                    new TextLensMaterial({
                        uniforms,
                        defines: {
                            HAS_MASKING: true,
                            // HAS_REVERSE: true,
                            CENTER_ALIGN: props.align === 'center',
                            LOW_RES: props.lowQuality,
                        },
                        blending: props.blending,
                    });

                mesh = new Mesh(geo, shader);
                mesh.position.set(0, vTextSize.y * 0.5, 0);
                inner.add(mesh);
            };

            const updateText = (text) => {
                if (!textBuffers) return;

                textBuffers.update({ text });
                geo.setAttribute(
                    'position',
                    new Float32BufferAttribute(textBuffers.buffers.position, 3)
                );
                geo.setAttribute('uv', new Float32BufferAttribute(textBuffers.buffers.uv, 2));
                geo.setAttribute('id', new Float32BufferAttribute(textBuffers.buffers.id, 1));
                geo.setIndex(new Uint16BufferAttribute(textBuffers.buffers.index, 1));

                geo.computeBoundingBox();
                geo.boundingBox.getSize(vBounds);

                vTextSize.set(textBuffers.width, textBuffers.height);
            };

            watch(props0.posInner, (v) => inner.position.copy(v).add(vTextOffset));

            const update = () => {
                const { aBlur, aAlpha, aBlending } = props0;

                if (shader) {
                    shader.u_progressBlur = aBlur;
                    shader.u_progressMask = aBlending;
                    shader.u_alpha = aAlpha;
                }
            };

            const init = async () => {
                textBuffers = new Text({
                    font: assets.fontData,
                    text: props.text,
                    width: props.width,
                    align: props.align,
                    letterSpacing: props.letterSpacing,
                    lineHeight: props.lineHeight,
                    maxTimes: 120,
                });
                object.add(inner);
                updateText(props.text);
                await createMesh();
                update();
            };

            const playRevealAnimation = () => {
                gsap.timeline()
                    .fromTo(props0.posInner, { z: 1 }, { z: 0, duration: 2, ease: 'power3.out' }, 0)
                    .fromTo(props0, { aAlpha: 0 }, { aAlpha: 1, duration: 1.4 }, 0.2)
                    .fromTo(props0, { aBlur: 1 }, { aBlur: 0, duration: 2.5, ease: 'sine.out' }, 0);
            };

            useRaf(update);

            watch(
                () => props.text,
                (t) => updateText(t)
            );

            const pane = usePane([{ value: props0 }], {
                title: 'Text',
                expanded: true,
            });
            pane.addButton({ label: 'play', title: 'Reveal' }).on('click', () =>
                playRevealAnimation()
            );

            return {
                object,
            };
        },
    };
</script>
