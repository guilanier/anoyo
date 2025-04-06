<template>
    <div class="component no-select" :data-name="componentData.id">
        <TweakPane :hiddenOnStart="nodeEnv == 'production'">
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

    import Comet from '@/components/Comet/index.vue';
    import RaymarchSphere from '@/components/RaymarchSphere/index.vue';
    import SDFLensBlur from '@/components/SDFLensBlur/index.vue';
    import TextLens from '@/components/TextLens/index.vue';

    const route = useRoute();

    const refComponent = ref();
    const component = shallowRef();

    const nodeEnv = import.meta.env.MODE;
    const componentTypes = [
        { id: 'sdf-lens-blur', component: SDFLensBlur },
        { id: 'text-lens', component: TextLens },
        { id: 'raymarch-sphere', component: RaymarchSphere },
        { id: 'comet', component: Comet },
    ];
    const componentData = componentTypes.find((c) => {
        const test = new RegExp(`\\b${c.id}\\b`, 'i').test(route.path);
        return test;
    });

    component.value = componentData.component;

    onMounted(() => (document.body.style.overflow = 'hidden'));
</script>

<style lang="scss">
    @use '@resn/gozer-styles' as *;
    .component {
        position: fixed;
        inset: 0;
        cursor: pointer;
        // cursor: none; // for recordings

        &[data-name='raymarch-sphere'] {
            @include grabbingCursor;
        }
    }
</style>
