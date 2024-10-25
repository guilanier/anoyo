<template>
    <div class="textLens" @click="onClick">
        <input ref="refInput" v-model="refText" placeholder="TYPE." />
        <!-- <Text :text="refText.toUpperCase()" v-for="refWords" /> -->
        <Text :text="refText.toUpperCase()" v-for="item in refWords" :key="item.id" v-bind="item">
        </Text>
    </div>
</template>

<script setup>
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { inject, onMounted, ref, shallowRef } from 'vue';

    import { JSONLoader, TextureLoader } from '@resn/gozer-loading';
    import { usePane } from '@resn/gozer-vue';
    import { useLoaderContext } from '@resn/gozer-vue/loading';

    import Text from './Text.vue';

    const { renderer, scene, registerRenderFn, orthoCamera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    // new OrbitControls(camera, renderer.domElement);
    const refInput = ref(null);
    const refWords = ref([{}]);
    const refText = shallowRef('');

    const onClick = () => {
        refWords.value.push({
            text: refText.value,
        });
    };

    usePane([], {
        title: 'Title Lens',
        expanded: true,
    });

    onMounted(() => {
        context.start();
        context.lock();

        window.addEventListener('keydown', (e) => {
            refInput.value.focus();
        });
    });

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, orthoCamera);
    });
</script>
<style lang="scss">
    @import '@resn/gozer-styles';

    html {
        @include baseFontSizeVW($baseWidth: 1920);
    }

    .textLens {
        @include fill(fixed);
    }

    input {
        position: absolute;
        width: 100%;
        z-index: 1;
        text-align: center;
        text-transform: uppercase;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        border: none;
        background: none;
        outline: none;
        color: #fff;

        font-family: 'Fellix', sans-serif;
        font-style: bold;
        font-weight: 400;
        font-size: 16rem;

        caret-color: #fff;
        color: transparent;
        // color: rgba(255, 255, 255, 0.5);
    }
</style>
