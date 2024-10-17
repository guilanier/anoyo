<template>
    <Text :text="propsReactive.text" />
</template>

<script setup>
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { inject, onMounted, reactive } from 'vue';

    import { TextureLoader } from '@resn/gozer-loading';
    import { JSONLoader } from '@resn/gozer-loading';
    import { usePane } from '@resn/gozer-vue';
    import { useLoaderContext } from '@resn/gozer-vue/loading';

    import Text from './Text.vue';

    const { renderer, scene, registerRenderFn, camera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    // const orbit = new OrbitControls(camera, renderer.domElement);

    const propsReactive = reactive({
        text: 'LE TEXT',
    });

    usePane([{ value: propsReactive }], {
        title: 'Title Lens',
        expanded: true,
    });

    onMounted(() => {
        context.start();
        context.lock();
    });

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, camera);
    });
</script>
