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
            vPosStart.copy(vViewport).multiply(props.pos0);
        },
        {
            immediate: true,
        }
    );
    const vViewport = new Vector2();

    const size = computed(() => (0.2 + props.size) * (viewport.width * 0.2));

    const vPosStart = new Vector2();
    const vPosOffset = new Vector2();

    const scroller = inject(ScrollerKey, {});

    const active = ref(true);
    const needsUpdateBounds = ref(true);

    const refRoot = ref(null);
    const { bounds } = useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });
    onMounted(() => {});

    const propsEl = useDomElement(refRoot, {
        align: 'left',
        s: props.scl0,
        py: 0,
    });

    watch(
        size,
        (val) => {
            propsEl.w = val;
            propsEl.h = val;
        },
        { immediate: true }
    );

    scroller.events.on('scroll', ({ velocity }) => {
        vPosOffset.y -= velocity * props.speed;
        propsEl.py = -vPosStart.y + modulo(vPosStart.y + vPosOffset.y, vViewport.height * 1.5);
    });

    useRafBool(active, () => {
        if (needsUpdateBounds.value && bounds.top) {
            vPosStart.y = bounds.top;
            needsUpdateBounds.value = false;
        }
    });

    defineExpose({ el: refRoot });
</script>

<style lang="scss" scoped>
    .blob {
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: 3rem;
        background-color: rgba(255, 0, 0, 0.31);
    }
</style>
