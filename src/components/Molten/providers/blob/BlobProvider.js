import { EventEmitter } from 'eventemitter3';
import { defineComponent, inject, onMounted, onUnmounted, provide, ref, watch } from 'vue';

import { useIntersectionObserver, useOnScroll, useRaf } from '@resn/gozer-vue';

// import { useElementBounds } from '~/composables/useElementBounds';

export const BlobKey = 'blob';

export const BlobProvider = defineComponent({
    setup() {
        const blobs = ref([]);

        const active = ref(false);

        const registerBlob = (obj) => {
            // renderQueue.splice(index, 0, {fn, index});
            blobs.value.push(obj);
        };

        const unregisterBlob = (obj) => {
            const index = blobs.value.findIndex((item) => item.id === obj.id);
            if (index > -1) {
                blobs.value.splice(index, 1);
            }
        };

        const events = new EventEmitter();

        const update = () => {
            events.emit('transform');
            events.emit('update');

            active.value = blobs.value.some((blob) => blob.visible);
            // const totalActive = blobs.value.filter((blob) => blob.visible).length;

            // if (active.value) {

            events.emit('render');
        };

        // useOnScroll(update);
        useRaf(update);

        provide(BlobKey, { blobs, registerBlob, unregisterBlob, events });
    },

    render() {
        if (this.$slots.default) {
            return this.$slots.default();
        }
    },
});
