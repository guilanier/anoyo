import { EventEmitter } from 'eventemitter3';
import { defineComponent, ref, provide } from 'vue';

import { useRaf } from '@resn/gozer-vue';



export const BlobKey = 'BLOB_KEY';

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


            events.emit('render');
        };

        // useOnScroll(update);
        useRaf(update);

        provide(BlobKey, { blobs, registerBlob, unregisterBlob, events });
    },

    render() {
        return this.$slots.default();
    }
});     