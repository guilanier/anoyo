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
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { inject, reactive, watch } from 'vue';

    import { simpleVs } from '@resn/gozer-three';
    import { usePane, useViewportResize } from '@resn/gozer-vue';

    import fragmentShader from './2024-10-03-15:35:46-raymarch:spheres-space.frag';

    const { renderer, scene, registerRenderFn, camera } = inject('renderer');
    camera.position.set(-0.821371, 3.52016, 1.17339);

    const orthoCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 100);
    orthoCamera.layers.set(1);

    const vResolution = new Vector2();
    const vCamera = new Vector3();

    const orbit = new OrbitControls(camera, renderer.domElement);

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
        },
    });

    const mesh = new Mesh(new PlaneGeometry(1, 1), shader);
    mesh.name = 'Mesh';
    mesh.layers.set(1);

    scene.add(mesh);

    useViewportResize(({ width, height }) => {
        orthoCamera.left = -width / 2;
        orthoCamera.right = width / 2;
        orthoCamera.top = height / 2;
        orthoCamera.bottom = -height / 2;

        orthoCamera.updateProjectionMatrix();

        mesh.scale.set(width, height, 1);
        vResolution.set(width, height);
    });

    registerRenderFn(() => {
        shader.uniforms.u_time.value = performance.now() / 1000;
        vCamera.copy(camera.position);

        renderer.clear();
        renderer.render(scene, orthoCamera);
    });

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
