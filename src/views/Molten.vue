<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
            <SmoothScrollLenis :options="{ infinite: true }">
                <Renderer
                    ref="refRenderer"
                    :antialias="false"
                    :autoResize="true"
                    :autoRender="true"
                >
                    <BlobProvider>
                        <BlobGLLayer />
                        <div class="molten__items">
                            <div v-for="item in items" :key="item.id">
                                <BlobItem v-bind="item" />
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
    import { randFloatSpread } from 'three/src/math/MathUtils';
    import { randFloat } from 'three/src/math/MathUtils';
    import { shallowRef } from 'vue';

    import { Renderer, ScrollerKey, SmoothScrollLenis, TweakPane } from '@resn/gozer-vue';
    import { gsap } from '@resn/gsap';
    import { ScrollTrigger } from '@resn/gsap/all';

    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
    import BlobItem from '@/components/Molten/BlobItem.vue';
    import { BlobProvider } from '@/components/Molten/providers/blob';

    const nItems = 10;
    const items = shallowRef(
        new Array(nItems).fill(0).map((_, i) => ({
            pos0: new Vector2(randFloat(0, 1), randFloat(0, 1)),
            scl0: randFloat(0.5, 1),
            speed: randFloat(0.5, 1.5),
        }))
    );

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: false,
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
    .molten {
        cursor: pointer;
        background-color: #000000;
        height: 500vh;

        &__items {
            position: fixed;
            inset: 0;
        }

        #blob1 {
            position: absolute;
            top: 50vh;
            left: 50vw;
            @include square(20rem);
        }
    }
</style>
