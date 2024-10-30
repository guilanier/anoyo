<template></template>

<script setup>
    import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
    import { computed, onMounted, onUnmounted, watch } from 'vue';

    import { hasTouch } from '@resn/gozer-env';
    import glslUnits from '@resn/gozer-glsl/functions/units.glsl';
    import glslCircle from '@resn/gozer-glsl/shapes/circle.glsl';
    import glslDraw from '@resn/gozer-glsl/shapes/draw.glsl';
    import { clamp, lerp } from '@resn/gozer-math';
    import { simpleVs } from '@resn/gozer-three';
    import {
        useDamp,
        useRafBool,
        useSpring,
        useThreeObject,
        useViewportResize,
        useWindowPointer,
    } from '@resn/gozer-vue';

    const props = defineProps({
        open: { type: Boolean, default: true },
    });
    const open = computed(() => props.open);

    const vResolution = new Vector2();

    const vPointer = new Vector2();
    const vPointerLt = new Vector2();
    const vPointerVl = new Vector2();

    const vPosLt = new Vector2();

    const vWobble = new Vector2();
    const vWobbleSin = new Vector2();

    const { object, props: propsObject } = useThreeObject(null, {
        addToParent: true,
        name: 'MeshBlobCursor',
        props: {},
    });
    const propsTf = { sc0: 0, sc1: 1 };

    const { set: setPositionDamp } = useDamp(propsObject, { lambda: hasTouch ? 20 : 10 }, [
        'px',
        'py',
    ]);
    const { set: setPropsScaleSpring } = useSpring(
        propsTf,
        { stiffness: 60, damping: 6, mass: 1 },
        ['sc0']
    );

    const shader = new ShaderMaterial({
        vertexShader: simpleVs,
        fragmentShader: /* glsl */ `
            uniform vec2 uResolution;
            varying vec2 vUv;
            ${glslUnits}
            ${glslDraw}
            ${glslCircle}
            void main(void) {
                vec2 res = uResolution;
                float edge = size(100.0);
                vec2 rSize = max(vec2(res.x / res.y, 1.), vec2(1.0, res.y / res.x));
                vec2 st = vUv;
                float sdf = fill(sdCircle(st), max(rSize.x, rSize.y) - edge, edge);            
                gl_FragColor = vec4(vec3(1.0), sdf);
                // gl_FragColor = vec4(vec3(1.0), clamp(sdf + 0.5, 0., 1.));
            }
        `,
        uniforms: {
            uResolution: { value: vResolution },
        },
        transparent: true,
    });

    const mesh = new Mesh(new PlaneGeometry(1, 1), shader);
    mesh.layers.set(1);
    object.add(mesh);

    const { isDown: isPointerDown, pointer } = useWindowPointer(({ x, y }) => {
        if (!hasTouch) setPointer({ x, y });
    });
    onMounted(() => {
        if (hasTouch) addEventListener('touchmove', onTouchMove);
    });
    onUnmounted(() => {
        if (hasTouch) removeEventListener('touchmove', onTouchMove);
    });

    const onTouchMove = (e) => {
        const { x, y } = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setPointer({ x, y });
    };

    let tLast1, tLast0;
    const setPointer = ({ x, y }) => {
        vPointer.set(x, y);
        if (!tLast0) {
            tLast0 = performance.now();
            vPointerLt.set(x, y);
        }
        let t = performance.now();
        tLast0 = t;

        vPointerVl.subVectors(vPointer, vPointerLt).clampScalar(-10, 10);
        vPointerVl.needsUpdate = true; // Flag update to prevent hanging velocity values when not moving
        vPointerLt.set(x, y);

        vWobble.x += vPointerVl.x * 0.4;
        vWobble.y += vPointerVl.y * 0.4;

        setPositionDamp({ px: x, py: -y });
    };

    watch(isPointerDown, (bool) => {
        if (bool) setPositionDamp({ px: pointer.x, py: -pointer.y });
        setPropsScaleSpring({ sc0: bool ? 1 : 0 });
    });

    const update = () => {
        if (!vPointerVl.needsUpdate) vPointerVl.set(0, 0);
        vPointerVl.needsUpdate = false;

        const t = performance.now();
        if (!tLast1) tLast1 = t;
        const dt = t - tLast1;
        tLast1 = t;

        const speed = 0.001;
        const recovery = 3.2;
        const maxAngle = Math.PI * 0.06;
        const pulse = 2 * Math.PI * speed;

        // decrease wobble over time
        vWobble.x = lerp((dt / 1000) * recovery, vWobble.x, 0);
        vWobble.y = lerp((dt / 1000) * recovery, vWobble.y, 0);

        // make a sine wave of the decreasing wobble
        vWobbleSin.x = Math.abs(vWobble.x) * Math.sin(pulse * t) * maxAngle;
        vWobbleSin.y = Math.abs(vWobble.y) * Math.sin(pulse * t) * maxAngle;

        // update scale
        const { sc0, sc1 } = propsTf;

        mesh.scale.x = vResolution.x * (sc0 + sc1) + vWobbleSin.x * 8;
        mesh.scale.y = vResolution.y * (sc0 + sc1) + vWobbleSin.y * -8;

        // update rotation
        const xR = vPosLt.x - object.position.x;
        const yR = vPosLt.y - object.position.y;
        // if (vPosLt.x !== object.position.x || vPosLt.y !== object.position.y)
        vPosLt.set(object.position.x, object.position.y);
        object.rotation.z = Math.atan2(yR, xR);
    };

    useRafBool(open, () => update());

    useViewportResize(({ width }) => {
        const size = hasTouch ? 120 : clamp(width * 0.08, 120, 160);
        vResolution.set(size, size);
    }, true);
</script>
