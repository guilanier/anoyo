<template>
    <BlobLayerItem ref="refItems" v-for="_ in blobs" :key="_.id" v-bind="_" />
    <BlobCursor v-if="showCursor" :open="true" />
</template>

<script setup>
    import { Group, ShaderMaterial, WebGLRenderTarget } from 'three';
    import { inject, onMounted, provide, ref, watch } from 'vue';

    import { isHandheld } from '@resn/gozer-env';
    import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
    import { simpleVs } from '@resn/gozer-three';
    import { ShaderPass } from '@resn/gozer-three/passes';
    import { useViewportResize } from '@resn/gozer-vue';

    import BlobCursor from './BlobCursor.vue';
    import BlobLayerItem from './BlobLayerItem.vue';
    import { useBlobs } from './providers/blob';

    const { blobs, events } = useBlobs();
    const { scene, renderer, orthoCamera } = inject('renderer');

    const object = new Group();
    scene.add(object);
    provide('addTo', object);

    const refItems = ref([]);
    const hasPostProcessing = true;

    const showCursor = ref(false);
    onMounted(() => (showCursor.value = !isHandheld));

    const fbo = new WebGLRenderTarget();
    const shader = new ShaderMaterial({
        vertexShader: simpleVs,
        fragmentShader: /* glsl */ `
            #include <common>
            varying vec2 vUv;
            uniform sampler2D tMap;
            ${glslDraw}
            void main() {
                vec4 tDiffuse = texture2D(tMap, vUv);
                float edge = 0.5;
                float a;
                a = tDiffuse.a;
                a = aastep(edge, a);
                gl_FragColor = vec4(vec3(1.), a);
            }`,
        uniforms: {
            tMap: { value: fbo.texture },
        },
        transparent: true,
    });

    const passOut = new ShaderPass(renderer, { shader });

    useViewportResize(({ width, height }) => {
        const dpr = Math.max(renderer.getPixelRatio(), 2);
        passOut.setSize(width * dpr, height * dpr);
        fbo.setSize(width * dpr, height * dpr);
        object.position.set(-width / 2, height / 2, 0);
    }, true);

    const updatePositions = () => {
        refItems.value.forEach((item, index) => {
            const data = blobs.value[index];
            item.update(data);
        });
    };

    const render = () => {
        updatePositions();

        if (hasPostProcessing) {
            renderer.setRenderTarget(fbo);
            renderer.clear();
            renderer.render(scene, orthoCamera);
            renderer.setRenderTarget(null);

            passOut.render({ final: true, clear: true });
        } else renderer.render(scene, orthoCamera);
    };

    events.on('render', render);
</script>
