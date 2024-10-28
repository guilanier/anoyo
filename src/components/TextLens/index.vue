<template>
    <div class="textLens">
        <input
            ref="refInput"
            class="textLens__input"
            @keyup="onInputKeyUp"
            v-model="refText"
            placeholder=""
        />

        <AssetsProvider>
            <Text
                v-for="(item, i) in refTexts"
                :key="item.id"
                v-bind="item"
                :text="
                    item.placeholder
                        ? 'TYPE.'
                        : item.focused
                          ? refText.toUpperCase()
                          : refText.value?.toUpperCase()
                "
                @text:unfocus="onTextUnfocus"
            />
        </AssetsProvider>
    </div>
</template>

<script setup>
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { inject, onMounted, reactive, ref, shallowRef, unref, watch } from 'vue';

    import { JSONLoader, TextureLoader } from '@resn/gozer-loading';
    import { usePane } from '@resn/gozer-vue';
    import { useLoader, useLoaderContext } from '@resn/gozer-vue/loading';

    import { AssetsProvider } from './AssetsProvider';
    import Text from './Text.vue';

    const { renderer, scene, registerRenderFn, orthoCamera } = inject('renderer');

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    const refInput = ref(null);
    const refTexts = ref([{ text: 'TYPE.', focused: false }]);
    const refText = shallowRef('');

    const next = () => {
        if (refTexts.value[refTexts.value.length - 1])
            refTexts.value[refTexts.value.length - 1].focused = false;
        refTexts.value.push({
            id: Date.now(),
            focused: true,
            placeholder: false,
        });
        refText.value = '.';
    };

    const characterLimit = 16;

    const onInputKeyUp = (e) => {
        if (e.key === 'Enter') next();
    };

    const onTextUnfocus = ({ id }) => {
        const index = refTexts.value.findIndex((item) => item.id === id);
        if (index !== -1) {
            refTexts.value.splice(index, 1);
        }
    };
    watch(refText, (newValue) => {
        if (newValue.length >= characterLimit) next();
        if (newValue.length > 0 && refTexts.value[0].placeholder == true) {
            refTexts.value[0].placeholder = false;
        }
    });

    usePane([], {
        title: 'Title Lens',
        expanded: true,
    });

    onMounted(() => {
        context.start();
        context.lock();

        refTexts.value[0].focused = true;
        refTexts.value[0].placeholder = true;

        refInput.value.focus();
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
