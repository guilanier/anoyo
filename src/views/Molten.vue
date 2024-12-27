<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
            <SmoothScrollLenis :options="{ infinite: true, lerp: 0.1, duration: 1.2 }">
                <Renderer
                    ref="refRenderer"
                    :antialias="false"
                    :autoResize="true"
                    :autoRender="true"
                >
                    <BlobProvider>
                        <BlobGLLayer />
                        <div class="molten__items">
                            <div v-for="props in itemsProps" :key="props.id">
                                <BlobItem ref="refItems" v-bind="props" />
                            </div>
                        </div>
                    </BlobProvider>
                </Renderer>
            </SmoothScrollLenis>
        </TweakPane>
    </div>
</template>

<script setup>
    import { Vector2 } from 'three';
    import { onMounted, reactive, ref, shallowRef } from 'vue';

    import { Alea } from '@resn/gozer-math';
    import { Renderer, ScrollerKey, SmoothScrollLenis, TweakPane, usePane } from '@resn/gozer-vue';
    import { gsap } from '@resn/gsap';
    import { ScrollTrigger } from '@resn/gsap/all';

    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
    import BlobItem from '@/components/Molten/BlobItem.vue';
    import { BlobProvider } from '@/components/Molten/providers/blob';

    const refItems = shallowRef([]);

    const propsReactive = reactive({
        sclTest: 0,
        step: 0,
    });

    const nItems = 10;
    // const nItems = 15;
    const itemsProps = ref(
        new Array(nItems).fill(0).map((_, i) => ({
            idx: i,
            pos0: new Vector2(),
            scl0: 1,
            speed: 1,
        }))
    );

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: false,
    });

    onMounted(() => {
        const { pane } = window;

        pane.addBinding(propsReactive, 'step', { step: 1, min: 0, max: 100 }).on('change', (ev) =>
            updateProps(~~(Math.random() * 1000))
        );
        pane.addBinding(propsReactive, 'sclTest', {
            step: 0.001,
            min: 0,
            max: 4,
        }).on('change', (ev) => {
            itemsProps.value.forEach((_, i) => {
                _.scl1 = ev.value;
                // _.speed = 2 - _.scl0;
            });
        });

        updateProps(676);
    });

    const updateProps = (seed) => {
        const rng = new Alea(seed);
        itemsProps.value.forEach((_, i) => {
            _.rng = rng;

            _.pos0.set(rng(), rng());
            _.scl0 = rng() * 0.5 + 0.5;
            _.speed = rng() * 1 + 0.5;
            // _.speed = 2 - _.scl0;

            refItems.value[i].resize();
        });
    };
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
    .molten {
        cursor: pointer;
        background-color: #000000;
        height: 500vh;

        &__items {
            position: fixed;
            inset: 0;
        }
    }
</style>
