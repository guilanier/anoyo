<template>
    <div ref="refRoot" class="blob" />
</template>

<script setup>
    import { Vector2 } from 'three';
    import { computed, inject, onMounted, reactive, ref, watch } from 'vue';

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
    const vPosAmbient = new Vector2();

    const scroller = inject(ScrollerKey, {});
    const propsScroll = reactive({ direction: 0 });

    const active = ref(true);

    const refRoot = ref(null);

    const propsEl = useDomElement(refRoot, {
        align: 'left',
        s: props.scl0,
    });
    useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });

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
    const updateScroll = ({ velocity = 0, direction = 0 } = {}) => {
        propsScroll.direction = direction;
        vPosOffset.y -= velocity * props.speed;
    };

    scroller.events.on('scroll', (e) => {
        const { velocity, direction } = e;
        updateScroll({ velocity, direction });
    });

    useRafBool(active, () => {
        vPosAmbient.y -= 0.4 * (propsScroll.direction || 1) * props.speed;
        const x = vPosStart.x + vPosOffset.x + vPosAmbient.x;
        const y = vPosStart.y + vPosOffset.y + vPosAmbient.y;

        propsEl.px = x;
        propsEl.py = -viewport.height + modulo(y, vBoundsParent.y);
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
