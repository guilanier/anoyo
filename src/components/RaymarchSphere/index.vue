<template>
    <slot />
</template>

<script setup>
    import {
        Color,
        Mesh,
        OrthographicCamera,
        PlaneGeometry,
        ShaderMaterial,
        Vector2,
        Vector3,
    } from 'three';
    import { Spherical } from 'three';
    import { BoxGeometry } from 'three';
    import { MeshBasicMaterial } from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { inject, onMounted, reactive, watch } from 'vue';

    import { project } from '@resn/gozer-animation';
    import { clamp, lerp } from '@resn/gozer-math';
    import { simpleVs } from '@resn/gozer-three';
    import { Orbit } from '@resn/gozer-three';
    import {
        useDamp,
        usePane,
        useRaf,
        useSpring,
        useViewportResize,
        useWindowPointer,
    } from '@resn/gozer-vue';
    import { gsap } from '@resn/gsap';

    import fragmentShader from './2024-10-03-15:35:46-raymarch:spheres-space.frag';

    const { renderer, scene, registerRenderFn, camera, orthoCamera } = inject('renderer');
    // camera.position.set(0, 3.52016, 0.17339);
    camera.position.set(-0.821371, 3.52016, 0.17339);

    const propsSphere = {
        bulb: 0,
    };
    const config = {
        debugOrbit: false,
        debugLight: false,
    };

    const vResolution = new Vector2();
    const vCamera = new Vector3();

    const sphCurrent = new Spherical();
    const sphTarget = new Spherical();
    const sphDelta = new Spherical();
    const sphLast = new Spherical();

    const { set: setSpherical } = useDamp(sphCurrent, { lambda: 3 }, ['phi', 'theta']);

    const vPointer = new Vector2();
    const vPointerVl = new Vector2();

    const vLight0 = new Vector3();
    const vLight1 = new Vector3();
    const vLight = new Vector3();

    let mLightDebugger;
    if (config.debugLight) {
        mLightDebugger = new Mesh(
            new BoxGeometry(0.5, 0.5, 0.5),
            new MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
        );
        mLightDebugger.layers.set(0);
        scene.add(mLightDebugger);
    }

    const vPosSphere0 = new Vector3();
    const vPosSphere = new Vector3();

    // ― orbit
    const orbit = config.debugOrbit
        ? new OrbitControls(camera, renderer.domElement)
        : new Orbit(camera, { sphericalDelta: sphDelta });

    const minPolarAngle = Math.PI * -0.1;
    const maxPolarAngle = Math.PI * 0.25;

    onMounted(() => {
        gsap.timeline()
            .fromTo(vPosSphere0, { y: 3 }, { y: 0, duration: 2, ease: 'power1.out' }, 0)
            .fromTo(vLight0, { y: -3 }, { y: 0, duration: 4, ease: 'sine.out' }, 1.5);
    });

    const { set: setSphereProps } = useSpring(propsSphere, {
        stiffness: 40,
        damping: 15,
        mass: 1.2,
    });

    const colorDummy = new Color();
    const colorDefine = (hex) =>
        hex === '#000' || !hex
            ? false
            : `vec3(${colorDummy.set(hex).convertLinearToSRGB().toArray().join(',')})`;
    const defines = reactive({
        COLOR_BCK: '#000',
        COLOR_AMB: '#000',
        COLOR_LIGHT: '#000',
        COLOR_BAC: '#000',
        COLOR_FRE: '#000',
        COLOR_DOM: '#000',
    });

    const shader = new ShaderMaterial({
        vertexShader: simpleVs,
        fragmentShader,
        uniforms: {
            u_resolution: { value: vResolution },
            u_camera: { value: vCamera },
            u_time: { value: 0.0 },
            u_light: { value: vLight },

            u_posSphere: { value: vPosSphere },
            u_scSphere: { value: 1.2 },
            u_unionSphere: { value: 2 },
        },
    });

    const mesh = new Mesh(new PlaneGeometry(1, 1), shader);
    mesh.name = 'Mesh';
    mesh.layers.set(1);

    scene.add(mesh);

    const setPointer = ({ x, y }) => {
        vPointerVl.set(x, y).sub(vPointer);
        vPointerVl.needsUpdate = true;

        vPointer.set(x, y);

        // — ambient
        const n = pointerDown.value ? -0.008 : -0.001;
        sphTarget.theta += vPointerVl.x * n;
        sphTarget.phi += vPointerVl.y * n;

        sphTarget.phi = clamp(sphTarget.phi, minPolarAngle, maxPolarAngle);

        setSpherical({ phi: sphTarget.phi, theta: sphTarget.theta });
    };

    const setPointerDown = (bool) => {
        setSphereProps({ bulb: bool ? 1 : 0 });

        if (!bool) {
            const projTheta = project(vPointerVl.x, 0.1);
            const projPhi = project(vPointerVl.y, 0.1);

            sphTarget.theta += -projTheta;
            sphTarget.phi += -projPhi;
        }
    };

    const { isDown: pointerDown } = useWindowPointer(setPointer);

    useViewportResize(({ width, height }) => {
        mesh.scale.set(width, height, 1);
        vResolution.set(width, height);
    });

    watch(pointerDown, setPointerDown);

    let t = 0,
        tLight = 0;
    useRaf(({ delta }) => {
        const { debugLight } = config;
        const { bulb } = propsSphere;

        t += delta * 0.0012 * lerp(bulb, 1, 0.5);
        tLight += delta * 0.0012;

        const t0 = t + 2;

        sphDelta.theta = sphCurrent.theta - sphLast.theta;
        sphDelta.phi = sphCurrent.phi - sphLast.phi;
        sphLast.copy(sphCurrent);

        if (!vPointerVl.needsUpdate) vPointerVl.set(0, 0);
        vPointerVl.needsUpdate = false;

        orbit?.update(); // on tick

        // light
        vLight1.set(
            Math.sin(tLight) * 1,
            2 + Math.sin(tLight * 0.5) * 2,
            -Math.cos(tLight * 0.2) * -2
        );
        vLight.copy(vLight0).add(vLight1);
        if (debugLight)
            mLightDebugger.position.copy(vLight.clone().multiply(new Vector3(-1, 1, -1)));

        // — sphere
        vPosSphere.copy(vPosSphere0);
        vPosSphere.y += -0.5 + Math.sin(t0 * 0.8) * 1.0;

        // ― uniforms
        shader.uniforms.u_time.value = t;
        shader.uniforms.u_scSphere.value = lerp(bulb, 1.2, 1.4);
        shader.uniforms.u_unionSphere.value = lerp(bulb, 2.2, 1.2);

        vCamera.copy(camera.position);
    });

    const render = () => {
        renderer.clear();
        renderer.render(scene, orthoCamera);

        renderer.clearDepth();
        renderer.render(scene, camera);
    };
    registerRenderFn(render);

    const setDefines = (props) => {
        const defines = {
            COLOR_BCK: colorDefine(props.COLOR_BCK),
            COLOR_AMB: colorDefine(props.COLOR_AMB),
            COLOR_LIG: colorDefine(props.COLOR_LIGHT),
            COLOR_BAC: colorDefine(props.COLOR_BAC),
            COLOR_FRE: colorDefine(props.COLOR_FRE),
            COLOR_DOM: colorDefine(props.COLOR_DOM),
        };
        Object.assign(shader.defines, defines);
        shader.needsUpdate = true;
    };
    watch(defines, setDefines, { immediate: true });

    usePane([{ value: defines }], {
        title: 'RaymarchSphere',
        expanded: true,
    });
</script>
