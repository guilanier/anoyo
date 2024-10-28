<template>
    <div class="textLens">
        <input
            ref="refInput"
            class="textLens__input"
            @keyup="onInputKeyUp"
            v-model="refText"
            placeholder="TYPE."
        />

        <AssetsProvider>
            <Text
                v-for="(item, i) in refTexts"
                :key="item.id"
                :focused="item.focused"
                :text="item.focused ? refText.toUpperCase() : item.text.toUpperCase()"
            />
        </AssetsProvider>
    </div>
</template>

<script setup>
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { inject, onMounted, reactive, ref, shallowRef } from 'vue';

    import { JSONLoader, TextureLoader } from '@resn/gozer-loading';
    import { usePane } from '@resn/gozer-vue';
    import { useLoader, useLoaderContext } from '@resn/gozer-vue/loading';

    import { AssetsProvider } from './AssetsProvider';
    import Text from './Text.vue';
    import TextTest from './TextTest.vue';

    const { renderer, scene, registerRenderFn, orthoCamera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    // new OrbitControls(camera, renderer.domElement);
    const refInput = ref(null);
    const refTexts = ref([{ focused: true }]);
    const refText = shallowRef('');
    const assets = reactive({
        fontMap: null,
        fontData: null,
    });

    const nextWord = () => {
        refTexts.value.push({
            index: refTexts.value.length,
            text: refText.value,
            focused: false,
        });
        console.log('🚀 ~ nextWord ~ refTexts:', refTexts);
    };

    const onInputKeyUp = (e) => {
        if (e.key === 'Enter') {
            nextWord();
            refText.value = '';
        }
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
        &__input {
            @include centerAlignTransform();
            width: 100%;
            z-index: 1;
            text-align: center;
            text-transform: uppercase;

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
    }
</style>
