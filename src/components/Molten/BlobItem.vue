<template>
    <div ref="refRoot" class="blob" />
</template>

<script setup>
    import { Vector2 } from 'three';
    import { computed, inject, onMounted, ref, watch } from 'vue';

    import { modulo } from '@resn/gozer-math';
    import { ScrollerKey, useDomElement, useRafBool, useViewportResize } from '@resn/gozer-vue';

    import { useBlob } from './providers/blob';

    const props = defineProps({
        id: { type: String, default: 'Blob' },
        borderRadius: { type: Number, default: null },
        speed: { type: Number, default: 1 },
        size: { type: Number, default: 1 },

        pos0: { type: Object, default: new Vector2() },
        scl0: { type: Number, default: 0 },
    });

    const viewport = useViewportResize(
        ({ width, height }) => {
            vViewport.set(width, height);
            vBoundsParent.set(width - size.value, height * 2.5);
            vPosStart.copy(vBoundsParent).multiply(props.pos0);
        },
        {
            immediate: true,
        }
    );
    const size = computed(() => (0.1 + props.size) * (viewport.width * 0.25));

    const vViewport = new Vector2();
    const vBoundsParent = new Vector2();

    const vPosStart = new Vector2();
    const vPosOffset = new Vector2();

    const scroller = inject(ScrollerKey, {});

    const active = ref(true);
    const needsUpdateBounds = ref(true);

    const refRoot = ref(null);
    const { bounds } = useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });

    const propsEl = useDomElement(refRoot, {
        align: 'left',
        s: props.scl0,
    });

    watch(
        size,
        (val) => {
            propsEl.w = val;
            propsEl.h = val;
        },
        { immediate: true }
    );

    onMounted(() => {
        updateScroll();
    });
    const updateScroll = ({ velocity = 0 } = {}) => {
        vPosOffset.y -= velocity * props.speed;
        propsEl.py = -viewport.height + modulo(vPosStart.y + vPosOffset.y, vBoundsParent.y);
    };

    scroller.events.on('scroll', ({ velocity }) => {
        updateScroll({ velocity });
    });

    useRafBool(active, () => {
        if (needsUpdateBounds.value && bounds.top) {
            vPosStart.y += bounds.top;
            needsUpdateBounds.value = false;
        }

        const { x: vw, y: vh } = vViewport;

        propsEl.px = vPosStart.x;
        // propsEl.py = -vPosStart.y + vPosOffset.y;
        // propsEl.py = -vPosStart.y + modulo(vPosStart.y + vPosOffset.y, vBounds.y);
    });

    defineExpose({ el: refRoot });
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
