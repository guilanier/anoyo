<template>
    <div class="textLens" @click="onClick">
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
    import { OrthographicCamera } from 'three';
    import { inject, onMounted, reactive, ref, shallowRef, unref, watch } from 'vue';

    import { JSONLoader, TextureLoader } from '@resn/gozer-loading';
    import { usePane } from '@resn/gozer-vue';
    import { useViewportResize } from '@resn/gozer-vue';
    import { useLoaderContext } from '@resn/gozer-vue/loading';

    import { AssetsProvider } from './AssetsProvider';
    import Text from './Text.vue';

    const { renderer, scene, registerRenderFn } = inject('renderer');

    const orthoCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
    orthoCamera.layers.set(1);

    useViewportResize(({ width, height }) => {
        orthoCamera.left = -width / 2;
        orthoCamera.right = width / 2;
        orthoCamera.top = height / 2;
        orthoCamera.bottom = -height / 2;

        orthoCamera.updateProjectionMatrix();
    });

    const context = useLoaderContext({
        concurrency: 10,
        loaders: [JSONLoader, TextureLoader],
    });
    TextureLoader.setGlobals({ renderer });

    const refInput = ref(null);
    const refTexts = ref([{ id: Date.now(), text: 'TYPE.', focused: false }]);
    const refText = shallowRef('');

    const next = () => {
        if (refTexts.value[refTexts.value.length - 1])
            refTexts.value[refTexts.value.length - 1].focused = false;
        refTexts.value.push({
            id: Date.now(),
            focused: true,
            placeholder: false,
        });
        refText.value = '';
    };

    const characterLimit = 16;

    const onClick = () => {
        refInput.value.focus();
    };

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

        setTimeout(() => {
            refInput.value.focus();
        }, 1500);
    });

    registerRenderFn(() => {
        renderer.clear();
        renderer.render(scene, orthoCamera);
    });
</script>
<style lang="scss">
    @import '@resn/gozer-styles/base/document';
    @import '@resn/gozer-styles';

    html {
        @include desktop {
            @include baseFontSizeVW(1920);
        }
        @include mobile {
            @include baseFontSizeVW(375);
        }
    }

    .textLens {
        @include fill(fixed);
        @include mobile {
            height: 100vh;
        }
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

            caret-color: #fff;
            color: transparent;
            // color: rgba(255, 255, 255, 0.5);

            @include desktop {
                font-size: 16rem;
            }
            @include mobile {
                font-size: 6rem;
            }
        }
    }
</style>
