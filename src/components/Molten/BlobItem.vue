<template>
    <div ref="refRoot" class="blob" />
</template>

<script setup>
    import { inject, onMounted, reactive, ref } from 'vue';

    import { modulo } from '@resn/gozer-math';
    import { ScrollerKey, useDomElement } from '@resn/gozer-vue';

    import { useBlob } from './providers/blob';

    const props = defineProps({
        id: { type: String, default: 'Blob' },
        borderRadius: { type: Number, default: null },
    });

    const propsTfInit = reactive({
        py: 0,
    });

    const refRoot = ref(null);
    const { bounds } = useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });
    onMounted(() => {
        setTimeout(() => {
            propsTfInit.py = bounds.top;
        }, 100);
    });

    const propsTf = useDomElement(refRoot, {
        align: 'left',
        w: null,
        h: null,
        py: 0,
    });

    const scroller = inject(ScrollerKey, {});
    scroller.events.on('scroll', (data) => {
        const py = propsTfInit.py + propsTf.py;
        console.log('🚀 ~ scroller.events.on ~ py:', py);
        propsTf.py -= data.velocity;
        propsTf.py %= 720;
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
