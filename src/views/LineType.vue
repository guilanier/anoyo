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
    body {
        overflow: hidden;
        cursor: pointer;
    }
</style>
