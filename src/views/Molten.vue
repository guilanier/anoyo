<template>
    <div class="molten">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
            <SmoothScrollLenis>
                <Renderer
                    ref="refRenderer"
                    :antialias="false"
                    :autoResize="true"
                    :autoRender="true"
                >
                    <BlobProvider>
                        <BlobGLLayer v-if="enableBlobs" />
                    </BlobProvider>
                </Renderer>
                <div class="molten__items">
                    <Blob />
                </div>
            </SmoothScrollLenis>
        </TweakPane>
    </div>
</template>

<script setup>
    import { Renderer, SmoothScrollLenis, TweakPane } from '@resn/gozer-vue';

    import Blob from '@/components/Molten/Blob.vue';
    import BlobGLLayer from '@/components/Molten/BlobGLLayer.vue';
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
    }
</style>
