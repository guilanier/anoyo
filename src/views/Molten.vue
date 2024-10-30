<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
            <!-- <SmoothScrollLenis> -->
            <Renderer ref="refRenderer" :antialias="false" :autoResize="true" :autoRender="true">
                <BlobProvider>
                    <BlobGLLayer />
                    <div class="molten__items">
                        <div id="blob1">
                            <BlobItem />
                        </div>
                    </div>
                </BlobProvider>
            </Renderer>
            <!-- </SmoothScrollLenis> -->
        </TweakPane>
    </div>
</template>

<script setup>
    import { Renderer, SmoothScrollLenis, TweakPane } from '@resn/gozer-vue';

    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
    import BlobItem from '@/components/Molten/BlobItem.vue';
    import { BlobProvider } from '@/components/Molten/providers/blob';
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
        position: fixed;
        inset: 0;
        cursor: pointer;

        &__items {
            position: inherit;
            width: 100%;
            height: 500vh;
        }

        #blob1 {
            position: absolute;
            @include square(20rem);
        }
    }
</style>
