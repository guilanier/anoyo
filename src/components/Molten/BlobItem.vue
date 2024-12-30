<template>
    <div ref="refRoot" class="blob" />
</template>

<script setup>
    import { Vector2 } from 'three';
    import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

    import { inRange, modulo } from '@resn/gozer-math';
    import { clamp } from '@resn/gozer-math';
    import {
        ScrollerKey,
        useDomElement,
        useRafBool,
        useSpring,
        useViewportResize,
    } from '@resn/gozer-vue';
    import { useDamp } from '@resn/gozer-vue';

    import { useBlob } from './providers/blob';

    const props = defineProps({
        idx: { type: Number, default: 0 },
        id: { type: String, default: 'Blob' },
        borderRadius: { type: Number, default: null },
        speed: { type: Number, default: 1 },
        size: { type: Number, default: 1 },

        pos0: { type: Object, default: new Vector2() },
        scl0: { type: Number, default: 0 },
        // scl1: { type: Number, default: 0 },

        cursorVectors: { type: Object, default: null },

        rng: {
            type: Function,
            default: () => {
                return 1;
            },
        },
    });

    const viewport = useViewportResize(() => resize(), { immediate: true });
    const size = computed(() => (0.1 + props.size) * (viewport.width * 0.25));

    const vViewport = new Vector2();
    const vBoundsParent = new Vector2();

    const vPosStart = new Vector2();
    const vPosOffset = new Vector2();
    const vPosAmbient = new Vector2();
    const vPosImpact = new Vector2();

    const scroller = inject(ScrollerKey, {});

    const propsScroll = reactive({ direction: 0 });
    const propsMotion = reactive({ impact: false, invalidate: false });

    const active = ref(true);

    const refRoot = ref(null);

    const propsEl = useDomElement(refRoot, { align: 'left' });
    useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });

    const vScale0Spring = new Vector2();

    const { set: setScaleSpring } = useSpring(
        vScale0Spring,
        { stiffness: 100, damping: 10, mass: 1 },
        ['x', 'y']
    );
    const { set: setVPosImpactDamp } = useDamp(vPosImpact, { lambda: 4 }, ['x', 'y']);

    watch(
        size,
        (val) => {
            propsEl.w = val;
            propsEl.h = val;
        },
        { immediate: true }
    );

    const resize = () => {
        const { width, height } = viewport;
        vViewport.set(width, height);
        vBoundsParent.set(width - size.value, height * 2.5);
        vPosStart.copy(vBoundsParent).multiply(props.pos0);
    };

    onMounted(() => {
        updateScroll();
    });

    const vel = { set: 0, curr: 0, last: 0, needsUpdate: false };
    const updateScroll = ({ velocity = 0, direction = 0 } = {}) => {
        propsScroll.direction = direction;
        vPosOffset.y -= velocity * 1.2 * props.speed;

        vel.set = velocity / 30;
        vel.needsUpdate = true;
    };

    scroller.events.on('scroll', (e) => {
        const { velocity, direction } = e;
        updateScroll({ velocity, direction });
    });

    let breathOff;
    let breathSpeed;
    let tBreath = 0;

    watch(
        () => props.rng,
        () => {
            breathOff = props.rng() * Math.PI * 2;
            breathSpeed = props.rng() * 0.02;
        }
    );

    useRafBool(active, () => {
        const dt = vel.set - vel.last;
        vel.last = vel.set;
        vel.curr += dt;
        vel.curr = clamp(vel.curr, -6, 6);

        const velAbs = Math.abs(vel.curr);

        setScaleSpring({ x: velAbs * -0.2, y: Math.abs(vel.curr) * 0.12 });

        if (!vel.needsUpdate) vel.curr = 0;
        vel.needsUpdate = false;

        vPosAmbient.y -= 0.3 * (propsScroll.direction || 1) * props.speed;
        const { x, y } = vPosStart.clone().add(vPosOffset).add(vPosAmbient).add(vPosImpact);

        const getScale = () => {
            tBreath += breathSpeed;

            const { scl0 } = props;

            const sclBreath = 1 + 0.06 * Math.sin(tBreath + breathOff);

            const x = sclBreath * (scl0 + vScale0Spring.x);
            const y = sclBreath * (scl0 + vScale0Spring.y);

            return [x, y];
        };

        const sc = getScale();

        propsEl.px = x;
        propsEl.py = -viewport.height + modulo(y, vBoundsParent.y);

        propsEl.s = sc;
        /* 
        if (props.cursorVectors) {
            const { vPos: vPosCursor, vPointer: vPointerCursor } = props.cursorVectors;
            checkBounds(vPosCursor);
        } */
    });

    /*const checkBounds = ({ x, y }) => {
        const xEl = propsEl.px;
        const yEl = propsEl.py;

        const wEl = propsEl.w * (propsEl.s[0] || 1);
        const hEl = propsEl.h * (propsEl.s[1] || 1);

        propsMotion.impact = inRange(x, xEl, xEl + wEl) && inRange(-y, yEl, yEl + hEl);
    };

         watch(
        () => propsMotion.impact,
        (bool) => {
            if (!props.cursorVectors || propsMotion.invalidate) return;
            const { vPos, vPointer, vPointerVl } = props.cursorVectors;
            setVPosImpactDamp({
                x: vPosImpact.x + vPointerVl.x * 10,
                y: vPosImpact.y + vPointerVl.y * 10,
            });
            if (!bool) {
                propsMotion.invalidate = true;
                setTimeout(() => (propsMotion.invalidate = false), 400);
            }
        }
    ); */

    onBeforeUnmount(() => {
        active.value = false;
    });

    defineExpose({ el: refRoot, resize, vectors: { vPosStart } });
</script>

<style lang="scss" scoped>
    .blob {
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: 3rem;
        // background-color: rgba(255, 0, 0, 0.31);
    }
</style>
