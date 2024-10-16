<template>
    <div ref="container"></div>
</template>

<script>
    import {
        BufferGeometry,
        Color,
        Float32BufferAttribute,
        Group,
        Mesh,
        NormalBlending,
        Object3D,
        Uint16BufferAttribute,
        Vector2,
        Vector3,
    } from 'three';
    import { onMounted, reactive, ref, watch } from 'vue';

    import { LoaderEvent } from '@resn/gozer-loading';
    import { Text } from '@resn/gozer-three';
    import { useThreeObject } from '@resn/gozer-vue';
    import { useLoader } from '@resn/gozer-vue/loading';

    import TextLensMaterial from './Material';

    export default {
        name: 'TextLens',
        props: {
            text: { type: String, default: 'le text' },
            width: { type: Number, default: 4 },
            align: { type: String, default: 'center' },
            letterSpacing: { type: Number, default: 0 },
            blending: { type: Number, default: NormalBlending },
            lineHeight: { type: Number, default: 1.4 },
            shader: { type: Object, default: null },
            posInner: { type: Object, default: new Vector3() },
            posOffset: { type: Object, default: new Vector3() },
            c: { type: String, default: '#141414' },
            lowQuality: { type: Boolean, default: false },
        },
        propsAnimation: reactive({
            aBlur: 0,
            aZoom: 1,
            aAlpha: 0,
            aBlending: 0,
        }),
        setup(props) {
            const { object: container } = useThreeObject();
            const inner = new Object3D();
            const geo = new BufferGeometry();
            let textBuffers = null;
            let shader = null;
            let mesh = null;
            const vBounds = new Vector3();
            const vTextSize = new Vector2();
            const vTextOffset = new Vector3().copy(props.posOffset);
            const vResolution = new Vector2();
            const vPointer = new Vector2();
            const cColor = new Color(props.c);

            const options = {
                fontMap: null,
                fontData: null,
            };

            useLoader({
                fontMap: '/textures/font/fellix-bold.png#texture',
                fontData: '/textures/font/fellix-bold.json',
            }).once(LoaderEvent.LOAD_COMPLETE, ({ data }) => {
                const { fontMap, fontData } = data;
                options.fontMap = fontMap;
                options.fontData = fontData;
                init();
            });

            const createMesh = async () => {
                const uniforms = {
                    tMap: { value: options.fontMap },
                    // tMapBlend: { value: options.mapBlend },
                    uBounds: { value: vBounds },
                    uResolution: { value: vResolution },
                    uPointer: { value: vPointer },
                    uPointerSpeed: { value: new Vector2() },
                    uBlurShapeSize: { value: 0.1 },
                    uColor: { value: cColor },
                };
                const shaderMaterial =
                    props.shader ||
                    new TextLensMaterial({
                        uniforms,
                        defines: {
                            HAS_REVERSE: false,
                            HAS_BLENDING: options.mapBlend !== null,
                            HAS_BLENDING_MAP: options.mapBlend !== null,
                            HAS_MASKING: true,
                            CENTER_ALIGN: props.align === 'center',
                            LOW_RES: props.lowQuality,
                        },
                        blending: props.blending,
                    });

                shader = shaderMaterial;
                mesh = new Mesh(geo, shaderMaterial);
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

            const update = () => {
                /* const { aBlur, aZoom, aAlpha, aBlending } = propsAnimation;
                if (shader) {
                    shader.uProgressBlur = aBlur; // Adjust based on props/animation state
                    shader.uProgressMask = aBlending; // Adjust based on props/animation state
                    shader.uAlpha = aAlpha; // Adjust based on props/animation state
                } */
            };

            const init = async () => {
                textBuffers = new Text({
                    font: options.fontData,
                    text: props.text,
                    width: props.width,
                    align: props.align,
                    letterSpacing: props.letterSpacing,
                    lineHeight: props.lineHeight,
                    maxTimes: 120,
                });
                container.add(inner);
                updateText(props.text);
                await createMesh();
                update();
            };

            watch(
                () => props.text,
                (newText) => {
                    updateText(newText);
                }
            );

            return {
                container,
            };
        },
    };
</script>
