<template></template>

<script setup>
    import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
    import { onUnmounted } from 'vue';

    import glslUnits from '@resn/gozer-glsl/functions/units.glsl';
    import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
    import glslRect from '@resn/gozer-glsl/shapes/rect.glsl';
    import glslScale from '@resn/gozer-glsl/transform/scale.glsl';
    import glslUVResize from '@resn/gozer-glsl/transform/uv/uv-resize.glsl';
    import { simpleVs } from '@resn/gozer-three';
    import { useThreeObject } from '@resn/gozer-vue';

    const props = defineProps({ id: String, borderRadius: { default: null } });

    const vResolution = new Vector2();

    const { object } = useThreeObject(null, { addToParent: true, props: { s: 1 } });

    const shader = new ShaderMaterial({
        vertexShader: simpleVs,
        fragmentShader: /* glsl */ `
            uniform vec2 uResolution;
            // uniform vec3 uColor;
            uniform float uBorderRadius;
            varying vec2 vUv;
            ${glslUnits}
            ${glslDraw}
            ${glslRect}
            ${glslScale}
            ${glslUVResize}
            void main(void) {
                vec2 res = uResolution;
                float brdRad = size(uBorderRadius * 10.);
                float edge = size(100.0);
                vec2 rSize = max(
                    vec2(res.x / res.y, 1.0),
                    vec2(1.0, res.y / res.x)
                );
                vec2 st = UVResize(vUv, res, vec2(1.0), vec2(1.0), 0);
                
                
                float sdf;
                sdf = fill(sdRect(st, rSize * 2.1, brdRad), - edge, edge);
                
                vec3 c = vec3(1.);
                // vec3 c = uColor;
                
                gl_FragColor = vec4(c, sdf);
                // gl_FragColor = vec4(vec3(1.0), sdf);
            }
        `,
        uniforms: {
            // uColor: { value: new Color(props.id.includes('blobWipe') ? 0xff0000 : 0xffffff) },
            uResolution: { value: vResolution },
            uBorderRadius: { value: props.borderRadius || 18 },
        },
        transparent: true,
    });

    const mesh = new Mesh(new PlaneGeometry(1, 1), shader);
    mesh.name = 'MeshBlob';
    mesh.layers.set(1);
    object.add(mesh);

    const update = (data) => {
        object.visible = data.visible;
        if (!data.visible) return;

        let { x, y, width, height } = data.bounds;

        object.position.set(x, -y, 0);

        mesh.position.set(width / 2, -height / 2, 0);
        mesh.scale.set(width, height, 1);

        vResolution.set(mesh.scale.x, mesh.scale.y);
    };

    onUnmounted(() => {
        mesh.geometry.dispose();
        mesh.material.dispose();
    });

    defineExpose({ update });
</script>
