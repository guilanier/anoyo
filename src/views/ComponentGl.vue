<template>
    <div class="component">
        <TweakPane :hiddenOnStart="false">
            <Renderer ref="refRenderer" :antialias="false" :autoResize="true" :autoRender="true">
                <Component ref="refComponent" :is="component" />
            </Renderer>
        </TweakPane>
    </div>
</template>

<script setup>
    import { onMounted, ref, shallowRef } from 'vue';
    import { useRoute } from 'vue-router';

    import { Renderer, TweakPane } from '@resn/gozer-vue';

    import SpaceTest from '@/components/SpaceTest/index.vue';
    import TextLens from '@/components/TextLens/index.vue';

    const route = useRoute();

    const refComponent = ref();
    const component = shallowRef();

    const componentTypes = [
        { id: 'sphere-space-neon', component: SpaceTest },
        { id: 'text-lens', component: TextLens },
    ];
    const componentData = componentTypes.find((c) => {
        const test = new RegExp(`\\b${c.id}\\b`, 'i').test(route.path);
        return test;
    });

    component.value = componentData.component;

    onMounted(() => (document.body.style.overflow = 'hidden'));
</script>

<style lang="scss">
    .component {
        position: fixed;
        inset: 0;
        cursor: pointer;
    }
</style>
