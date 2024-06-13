<template>
    <TweakPane :hidden-on-start="true">
        <LineType :active="true" :active-lines="true" />
    </TweakPane>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { TweakPane } from '@resn/gozer-vue';

    import LineType from '@/components/LineType/index.vue';

    onMounted(() => {
        document.body.style.overflow = 'hidden';
    });
</script>

<style lang="scss">
    @import '@resn/gozer-styles';
    html {
        @include baseFontSizeVW(375);
        font-synthesis: none;

        @include breakpoint-width-min(450px) {
            font-size: 12px;
        }

        @include desktop {
            @include baseFontSizeVW(1000);
        }
    }

    body {
        overflow: hidden;
        cursor: pointer;
    }
</style>
