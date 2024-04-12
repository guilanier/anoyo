<template>
    <div class="component">
        <Renderer ref="refRenderer" :antialias="false" :autoResize="true" :autoRender="false">
            <SDFLensBlur />
        </Renderer>
    </div>
</template>

<script setup>
    import { inject, ref } from 'vue';

    import { Renderer } from '@resn/gozer-vue';

    import SDFLensBlur from '@/components/SDFLensBlur/index.vue';
</script>

<style lang="scss"></style>
