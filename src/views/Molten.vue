<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="true">
            <!-- <TweakPane :hiddenOnStart="nodeEnv == 'production'"> -->
            <SmoothScrollLenis :options="{ infinite: true, lerp: 0.1, duration: 1 }">
                <Renderer
                    ref="refRenderer"
                    :antialias="false"
                    :autoResize="true"
                    :autoRender="true"
                >
                    <MoltenProvider>
                        <MoltenGLLayer ref="refGLLayer" />
                        <div class="molten__items">
                            <div v-for="props in itemsProps" :key="props.id">
                                <MoltenItem ref="refItems" v-bind="props" />
                            </div>
                        </div>
                    </MoltenProvider>
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

    import MoltenGLLayer from '@/components/Molten/MoltenGLLayer.vue';
    import MoltenItem from '@/components/Molten/MoltenItem.vue';
    import { MoltenProvider } from '@/components/Molten/providers/molten';

    const refItems = shallowRef([]);
    const refGLLayer = ref();

    const propsReactive = reactive({
        sclTest: 0,
        step: 0,
    });

    const nItems = 12;
    const itemsProps = ref(
        new Array(nItems).fill(0).map((_, i) => ({
            idx: i,
            pos0: new Vector2(),
            scl0: 1,
            speed: 1,
            cursorVectors: {},
        }))
    );

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: false,
    });

    onMounted(() => {
        const { pane } = window;
        const { vectors: cursorVectors } = refGLLayer.value.refCursor;

        itemsProps.value.forEach((_, i) => {
            _.cursorVectors = cursorVectors;
        });

        pane.addBinding(propsReactive, 'step', { step: 1, min: 0, max: 100 }).on('change', (ev) =>
            updatePropsWidthSeed(~~(Math.random() * 1000))
        );

        updatePropsWidthSeed(639);
    });

    const updatePropsWidthSeed = (seed) => {
        const rng = new Alea(seed);
        itemsProps.value.forEach((_, i) => {
            _.rng = rng;

            _.pos0.set(rng(), rng());
            _.scl0 = rng() * 0.5 + 0.5;
            _.speed = rng() * 1 + 0.5;

            refItems.value[i].resize();
        });
    };
</script>

<style lang="scss">
    @use '@resn/gozer-styles' as *;

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
