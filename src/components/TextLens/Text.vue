<template>
    <slot />
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
    import { computed, defineEmits, inject, reactive, watch } from 'vue';

    import { Text } from '@resn/gozer-three';
    import {
        useDamp,
        usePane,
        useRaf,
        useThreeObject,
        useViewportResize,
        useWindowPointer,
    } from '@resn/gozer-vue';

    import { useAssets } from './AssetsProvider';
    import TextLensMaterial from './Material';

    export default {
        name: 'TextLens',
        props: {
            id: { type: Number, default: Date.now() },

            text: { type: String, default: '' },
            width: { type: Number, default: Infinity },
            align: { type: String, default: 'center' },
            blending: { type: Number, default: NormalBlending },
            color: { type: String, default: '#ffffff' },
            lowQuality: { type: Boolean, default: false },

            focused: { type: Boolean, default: true },
            placeholder: { type: Boolean, default: false },
        },
        emits: ['text:focus', 'text:unfocus'],
        setup(props, { emit }) {
            const props0 = reactive({
                posInner: new Vector3(0, 0, 0),
                posOffset: new Vector3(0, 0, 0),

                aBlur: 0,
                aAlpha: 1,

                sBase: 13.4,
                sZoom: 1,

                pSizePointerBlur: 0.25,
            });

            const { renderer } = inject('renderer');

            const viewport = useViewportResize(
                ({ width, height }) => {
                    const dpr = renderer.getPixelRatio();
                    vResolution.set(width * dpr, height * dpr);
                },
                { immediate: true }
            );

            const assets = reactive({});
            useAssets(({ data }) => {
                assets.fontMap = data.fontMap;
                assets.fontData = data.fontData;
                init();
            });

            const scObject = computed(
                () => props0.sBase * props0.sZoom * ((16 / 1920) * viewport.width)
            );

            const { object } = useThreeObject(null, {
                props: { s: scObject },
            });
            const inner = new Object3D();
            const geo = new BufferGeometry();

            let textBuffers = null;
            let mesh = null;

            const vBounds = new Vector3();
            const vBoundsTarget = new Vector3();
            const vBoundsTarget0 = new Vector3();

            const vTextSize = new Vector2();
            const vTextOffset = new Vector3().copy(props0.posOffset);
            const vResolution = new Vector2();
            const vPointerDamped = new Vector2();

            const cColor = new Color(props.color);

            const { set: setDampBounds } = useDamp(vBounds, { lambda: 1.4 });
            const { set: setProps0Damped } = useDamp(props0, { lambda: 6 }, ['pSizePointerBlur']);
            const { set: setPointerDamped } = useDamp(vPointerDamped, { lambda: 8 }, ['x', 'y']);

            let shader;
            const createMesh = async () => {
                const uniforms = {
                    tMap: { value: assets.fontMap },
                    uBounds: { value: vBoundsTarget },
                    uResolution: { value: vResolution },
                    u_pointer: { value: vPointerDamped },
                    u_color: { value: cColor },
                };
                shader = new TextLensMaterial({
                    uniforms,
                    defines: {
                        HAS_MASKING: true,
                        CENTER_ALIGN: props.align === 'center',
                        LOW_RES: props.lowQuality,
                        USE_DEBUG: true,
                    },
                    blending: props.blending,
                });

                mesh = new Mesh(geo, shader);
                mesh.layers.set(1);

                inner.add(mesh);
            };

            const refreshText = (text) => {
                if (!textBuffers) return;

                textBuffers.update({ text });

                const { position, uv, id, index } = textBuffers.buffers;
                geo.setAttribute('position', new Float32BufferAttribute(position, 3));
                geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
                geo.setAttribute('id', new Float32BufferAttribute(id, 1));
                geo.setIndex(new Uint16BufferAttribute(index, 1));

                geo.computeBoundingBox();
                geo.boundingBox.getSize(vBoundsTarget);
                setDampBounds({ x: vBoundsTarget0.x - (vBoundsTarget.x - vBoundsTarget0.x) }, true);
                vBoundsTarget0.copy(vBoundsTarget);

                vTextSize.set(textBuffers.width, textBuffers.height);
                mesh.position.set(0, vBoundsTarget.y * (vBoundsTarget.y / textBuffers.height), 0);
                setDampBounds(vBoundsTarget);
                console.log('🚀 ~ refreshText ~ vBoundsTarget:', vBoundsTarget, text, props.id);
            };

            const { isDown: pointerDown } = useWindowPointer(({ x, y }) => {
                const dpr = renderer.getPixelRatio();
                setPointerDamped({ x: x * dpr, y: vResolution.y - y * dpr });
            });

            watch(pointerDown, (bool) => {
                setProps0Damped({ pSizePointerBlur: bool ? 0.5 : 0.25 });
            });

            watch(props0.posInner, (v) => inner.position.copy(v).add(vTextOffset), {
                immediate: true,
            });

            const update = () => {
                const { aAlpha, aBlur } = props0;
                if (shader) {
                    shader.u_progressBlur0 = aBlur;
                    shader.u_progressBlur1 = aBlur < 0.8 ? 1 : vBounds.x / vBoundsTarget.x;

                    shader.u_pointerBlur = props0.pSizePointerBlur;
                    shader.u_alpha = aAlpha;
                }
            };

            const init = () => {
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

                createMesh();
                refreshText(props.text);
                update();
            };

            let tlFocus;
            const focus = () => {
                tlFocus?.kill();
                tlFocus = gsap
                    .timeline()
                    .fromTo(props0, { aAlpha: 0 }, { aAlpha: 1, duration: 1.4 }, 0.1)
                    .fromTo(
                        props0,
                        { sZoom: 1.6 },
                        { sZoom: 1, duration: 2, ease: 'power1.out' },
                        0
                    )
                    .fromTo(
                        props0,
                        { aBlur: 0 },
                        { aBlur: 1, duration: 3, ease: 'power2.out' },
                        0.1
                    );
            };
            const unfocus = () => {
                tlFocus?.kill();

                tlFocus = gsap
                    .timeline({ onComplete: () => emit('text:unfocus', { id: props.id }) })
                    .to(props0, { aAlpha: 0, duration: 1.4 }, 0.1)
                    .to(props0, { sZoom: 0.7, duration: 1.6, ease: 'power3.out' }, 0)
                    .to(props0, { aBlur: 0, duration: 2.5, ease: 'power2.out' }, 0);
            };

            useRaf(update);

            watch(
                () => props.text,
                (t) => (props.text !== '' ? refreshText(t) : null)
            );

            watch(
                () => props.focused,
                (v) => (v ? focus() : unfocus()),
                { immediate: true }
            );

            const pane = usePane([], {
                title: 'Text',
                expanded: true,
            });
            pane.addButton({ title: 'focus' }).on('click', () => focus());
            pane.addButton({ title: 'unfocus' }).on('click', () => unfocus());

            return {
                object,
            };
        },
    };
</script>
