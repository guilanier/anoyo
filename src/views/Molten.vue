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
                            <div id="blob1">
                                <BlobItem />
                            </div>
                        </div>
                    </BlobProvider>
                </Renderer>
            </SmoothScrollLenis>
        </TweakPane>
    </div>
</template>

<script setup>
    import { inject } from 'vue';

    import { Renderer, ScrollerKey, SmoothScrollLenis, TweakPane } from '@resn/gozer-vue';
    import { gsap } from '@resn/gsap';
    import { ScrollTrigger } from '@resn/gsap/all';

    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
    import BlobItem from '@/components/Molten/BlobItem.vue';
    import { BlobProvider } from '@/components/Molten/providers/blob';

    /*     const scroller = inject(ScrollerKey, {
        onScroll: (data) => {
            console.log('🚀 ~ scroller ~ data:', data);
        },
    });
    console.log('🚀 ~ scroller:', scroller); */

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
        background-color: #444444;
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
