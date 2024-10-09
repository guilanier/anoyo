<template>
    <slot />
</template>

<script setup>
    import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
    import { inject } from 'vue';

    const { renderer, scene, registerRenderFn, camera, orthoCamera } = inject('renderer');

    const mesh = new Mesh(new PlaneGeometry(2, 2), new MeshBasicMaterial({ color: 0x0000ff }));
    mesh.name = 'MeshText';
    // mesh.layers.set(1);
    scene.add(mesh);

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, camera);
    });
</script>
