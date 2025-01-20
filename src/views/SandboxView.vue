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
    @use '@resn/gozer-vue/sandbox/styles' as *;

    $prefix: 'root';

    .#{$prefix} {
        @extend %themeVariables;

        position: fixed;
        inset: 0;
    }
</style>
