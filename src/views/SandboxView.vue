<template>
    <div class="root">
        <SandboxHub title="ANOYO —" :components="getComponents()" />
    </div>
</template>

<script setup>
    import { SandboxHub } from '@resn/gozer-vue/sandbox';

    import { getComponents } from '@/route-info';
</script>

<style lang="scss" scoped>
    @import '@resn/gozer-styles';
    @import '@resn/gozer-vue/sandbox/styles';

    $prefix: 'root';

    .#{$prefix} {
        @extend %themeVariables;

        position: fixed;
        inset: 0;
    }
</style>
