<script setup>
    import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
    import { inject, onMounted, ref, watch } from 'vue';

    import { clamp } from '@resn/gozer-math';
    import { simpleVs } from '@resn/gozer-three';
    import { useDamp, useRaf, useResize, useSpring, useWindowPointer } from '@resn/gozer-vue';

    import fragmentShader from './2025-12-13-13:54:26-sdf:comet.frag';

    const { renderer, scene, orthoCamera } = inject('renderer');

    const vPointerDamped = new Vector2();
    const vResolution = new Vector2();

    const props0 = {
        pSizeBlur: 0.5,
    };

    const { set: setProps0Damped } = useDamp(props0, { lambda: 6 }, ['pSizeBlur']);
    const { set: setPointerDamped } = useDamp(vPointerDamped, { lambda: 12 }, ['x', 'y']);

    let mesh, shader;
    const init = () => {
        shader = new ShaderMaterial({
            vertexShader: simpleVs,
            fragmentShader,
            uniforms: {
                u_resolution: { value: vResolution },
                u_mouse: { value: vPointerDamped },

                u_size: { value: 0.1 },
                u_blur: { value: 0.5 },
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
        setProps0Damped({ pSizeBlur: bool ? 0.5 : 0.5 });
    });

    const render = () => {
        const uniforms = shader?.uniforms;
        if (uniforms) {
            uniforms.u_blur.value = props0.pSizeBlur;
        }

        renderer.clear();
        renderer.render(scene, orthoCamera);
    };
    useRaf(render);

    onMounted(init);
</script>
