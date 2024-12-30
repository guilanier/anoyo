<script setup>
    import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
    import { inject, onMounted, ref, watch } from 'vue';

    import { isMobile } from '@resn/gozer-env';
    import { clamp } from '@resn/gozer-math';
    import { simpleVs } from '@resn/gozer-three';
    import { useDamp, useRaf, useResize, useSpring, useWindowPointer } from '@resn/gozer-vue';

    import fragmentShader from './shaders/2024-04-08-5:31:15-sdf-lensBlur.frag';

    const { renderer, scene, orthoCamera } = inject('renderer');

    const vPointerDamped = new Vector2();
    const vResolution = new Vector2();

    const iState = ref(0);

    const props0 = {
        pSizeBlur: 0.25,
    };
    const props1 = { pStroke: 0, pBorderRadius: 0.01 };

    const { set: setProps0Damped } = useDamp(props0, { lambda: 6 }, ['pSizeBlur']);
    const { set: setProps1Spring } = useSpring(props1, {
        stiffness: 90,
        damping: 12,
        mass: 1,
    });
    const { set: setPointerDamped } = useDamp(vPointerDamped, { lambda: 12 }, ['x', 'y']);

    let mesh, shader;
    const init = () => {
        shader = new ShaderMaterial({
            vertexShader: simpleVs,
            fragmentShader,
            uniforms: {
                u_resolution: { value: vResolution },
                u_mouse: { value: vPointerDamped },

                u_size: { value: isMobile ? 0.8 : 0.6 },
                u_blur: { value: 0.25 },
                u_stroke: { value: 0 },
                u_borderRadius: { value: 0.01 },
            },
            extensions: {
                derivatives: true,
            },
            transparent: false,
        });

        mesh = new Mesh(new PlaneGeometry(1, 1), shader);
        mesh.scale.set(window.innerWidth, window.innerHeight, 1);
        mesh.layers.set(1);
        scene.add(mesh);
    };

    useResize((viewport) => {
        const { width, height } = viewport;
        const dpr = clamp(window.devicePixelRatio, 1, 2);
        vResolution.set(width, height).multiplyScalar(dpr);
        mesh?.scale.set(width, height);
    }, true);

    const { isDown: pointerDown } = useWindowPointer(({ x, y }) => {
        const dpr = renderer.getPixelRatio();
        setPointerDamped({ x: x * dpr, y: vResolution.y - y * dpr });
    });

    watch(pointerDown, (bool) => {
        if (bool) {
            setProps0Damped({ pSizeBlur: 0.5 });
        } else {
            setProps0Damped({ pSizeBlur: 0.25 });
        }
        if (!bool) iState.value = (iState.value + 1) % 4;
    });

    watch(iState, (i) => {
        switch (i) {
            case 0:
                setProps1Spring({ pStroke: 0, pBorderRadius: 0.01 });
                break;
            case 1:
                setProps1Spring({ pStroke: 1, pBorderRadius: 0.5 });
                break;
            case 2:
                setProps1Spring({ pStroke: 1, pBorderRadius: -0.2 });
                break;
            case 3:
                setProps1Spring({ pStroke: 0, pBorderRadius: 0.5 });
                break;
            default:
                break;
        }
    });

    const render = () => {
        const uniforms = shader?.uniforms;
        if (uniforms) {
            uniforms.u_blur.value = props0.pSizeBlur;
            uniforms.u_stroke.value = props1.pStroke;
            uniforms.u_borderRadius.value = props1.pBorderRadius;
        }

        renderer.clear();
        renderer.render(scene, orthoCamera);
    };
    useRaf(render);

    onMounted(init);
</script>
