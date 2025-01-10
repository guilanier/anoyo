<template>
    <div class="root">
        <Gallery title="Anoyo" :components="getComponents()" />
    </div>
</template>

<script setup>
    import Gallery from '@/components/gallery/Gallery.vue';
    import { getComponents } from '@/route-info';
</script>

<style lang="scss">
    @import '@resn/gozer-styles';

    body {
        background-color: #000;
        scroll-behavior: smooth;
    }
    html {
        @include desktop {
            @include baseFontSizeVW(1024);
        }
        @include mobile {
            @include baseFontSizeVW(620);
        }
    }
</style>
