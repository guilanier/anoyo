<template>
    <div class="root">
        <SandboxHub title="ANOYO —" :components="components" />
    </div>
</template>

<script setup>
    import { SandboxHub } from '@resn/gozer-vue/sandbox';

    import { routeInfo } from '@/route-info';
    import router from '@/router';

    const components = Object.values(routeInfo)
        .map((route) => {
            const info = routeInfo[route.name] || {};
            return { ...route, ...info };
        })
        .map((route) => ({
            title: route.title || route.name,
            path: (import.meta.env.BASE_URL + route.path).replace('//', '/'),
            description: route.description,
            category: route.category || '',
        }))
        .sort((a, b) => {
            return a.category < b.category ? -1 : a.category > b.category ? 1 : 0;
        });
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
