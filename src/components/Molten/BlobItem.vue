<template>
    <div ref="refRoot" class="blob" />
</template>

<script setup>
    import { ref } from 'vue';

    import { useBlob } from './providers/blob';

    const props = defineProps({
        id: { type: String, default: 'Blob' },
        borderRadius: { type: Number, default: null },
    });

    const refRoot = ref(null);
    useBlob(refRoot, { id: props.id, borderRadius: props.borderRadius });

    defineExpose({ el: refRoot });
</script>

<style lang="scss" scoped>
    .blob {
        position: absolute;
        inset: -24px;
        pointer-events: none;
        border-radius: 3rem;
        background-color: rgba(255, 0, 0, 0.31);
    }
</style>
