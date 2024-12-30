<template>
    <BlobGLItem ref="refItems" v-for="_ in blobs" :key="_.id" v-bind="_" />
    <BlobCursor ref="refCursor" :open="true" />
</template>

<script setup>
    import { Group, OrthographicCamera, ShaderMaterial, WebGLRenderTarget } from 'three';
    import { inject, onMounted, provide, ref } from 'vue';

    import { isHandheld } from '@resn/gozer-env';
    import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
    import { simpleVs } from '@resn/gozer-three';
    import { ShaderPass } from '@resn/gozer-three/passes';
    import { useViewportResize } from '@resn/gozer-vue';

    import BlobCursor from './BlobCursor.vue';
    import BlobGLItem from './BlobGLItem.vue';
    import { useBlobs } from './providers/blob';

    const { blobs, events } = useBlobs();
    const { scene, renderer } = inject('renderer');

    const orthoCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
    orthoCamera.layers.set(1);

    const object = new Group();
    scene.add(object);
    provide('addTo', object);

    const refItems = ref([]);
    const refCursor = ref(null);

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
        orthoCamera.left = -width / 2;
        orthoCamera.right = width / 2;
        orthoCamera.top = height / 2;
        orthoCamera.bottom = -height / 2;

        orthoCamera.updateProjectionMatrix();

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

    defineExpose({ refCursor });
</script>
