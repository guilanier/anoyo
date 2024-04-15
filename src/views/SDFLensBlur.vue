<template>
    <div class="component">
        <Renderer ref="refRenderer" :antialias="false" :autoResize="true" :autoRender="false">
            <SDFLensBlur />
        </Renderer>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { Renderer } from '@resn/gozer-vue';

    import SDFLensBlur from '@/components/SDFLensBlur/index.vue';

    onMounted(() => (document.body.style.overflow = 'hidden'));
</script>

<style lang="scss">
    .component {
        position: fixed;
        inset: 0;
        cursor: pointer;
    }
</style>
