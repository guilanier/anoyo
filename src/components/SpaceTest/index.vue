<template>
    <slot />
</template>

<script setup>
    import { Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { inject } from 'vue';

    import { simpleVs } from '@resn/gozer-three';
    import { useViewportResize } from '@resn/gozer-vue';

    import fragmentShader from './2024-10-03-15:35:46-raymarch:spheres-space-neon.frag';

    const { renderer, scene, registerRenderFn, camera, orthoCamera } = inject('renderer');
    camera.position.y = 5;

    const vResolution = new Vector2();
    const vCamera = new Vector3();

    const orbit = new OrbitControls(camera, renderer.domElement);

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
        mesh.scale.set(width, height, 1);
        vResolution.set(width, height);
    });

    registerRenderFn(() => {
        shader.uniforms.u_time.value = performance.now() / 1000;
        vCamera.copy(camera.position);

        renderer.clear();
        renderer.render(scene, orthoCamera);
    });
</script>
