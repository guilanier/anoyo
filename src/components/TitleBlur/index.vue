<template>
    <Item />
</template>

<script setup>
    import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
    import { inject, onMounted } from 'vue';

    import { LoaderEvent } from '@resn/gozer-loading';
    import { TextureLoader } from '@resn/gozer-loading';
    import { JSONLoader } from '@resn/gozer-loading';
    import { useJSON, useLoader, useLoaderContext } from '@resn/gozer-vue/loading';

    import Item from './Item.vue';

    const { renderer, scene, registerRenderFn, camera, orthoCamera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });
    /* 
    useJSON('/assets/textures/font/fellix-bold.json').then((data) => {
        jsonRef.value.innerHTML = JSON.stringify(data, null, 4);
    }); */

    /*     useLoader({
        fontMap: 'assets/textures/font/fellix-bold.png#texture',
        fontData: '/assets/textures/font/fellix-bold.json',
    }).once(LoaderEvent.LOAD_COMPLETE, ({ data }) => {
        const { fontMap, fontData } = data;
        console.log('🚀 ~ setup ~ { fontMap, fontData }:', { fontMap, fontData });
    });
 */
    onMounted(() => {
        context.start();
        context.lock();
    });

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, camera);
    });
</script>
