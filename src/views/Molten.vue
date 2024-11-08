<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
            <SmoothScrollLenis :options="{ infinite: true, lerp: 0.1, duration: 0 }">
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
    import { shallowRef } from 'vue';

    import { Alea } from '@resn/gozer-math';
    import { Renderer, ScrollerKey, SmoothScrollLenis, TweakPane } from '@resn/gozer-vue';
    import { gsap } from '@resn/gsap';
    import { ScrollTrigger } from '@resn/gsap/all';

    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
    import BlobItem from '@/components/Molten/BlobItem.vue';
    import { BlobProvider } from '@/components/Molten/providers/blob';

    const rng = new Alea(1192);

    const nItems = 10;
    const items = shallowRef(
        new Array(nItems).fill(0).map((_, i) => ({
            pos0: new Vector2(rng(), rng()),
            scl0: rng() * 0.5 + 0.5,
            speed: rng() * 1 + 0.5,
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
    }
</style>
