<template>
    <Text />
</template>

<script setup>
    import { inject, onMounted } from 'vue';

    import { TextureLoader } from '@resn/gozer-loading';
    import { JSONLoader } from '@resn/gozer-loading';
    import { useLoaderContext } from '@resn/gozer-vue/loading';

    import Text from './Text.vue';

    const { renderer, scene, registerRenderFn, camera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    onMounted(() => {
        context.start();
        context.lock();
    });

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, camera);
    });
</script>
