import { EventEmitter } from 'eventemitter3';
import { defineComponent, ref, provide, inject } from 'vue';

import { useRaf } from '@resn/gozer-vue';

export const MoltenKey = 'BLOB_KEY';

export const useMoltens = () => {
    const blob = inject(MoltenKey, { events: null, blobs: null });
    if (!blob) {
        throw new Error('useMolten must be used within a MoltenProvider');
    }
    return blob;
};

export const MoltenProvider = defineComponent({
    setup() {
        const blobs = ref([]);

        const active = ref(false);

        const registerMolten = (obj) => {
            // renderQueue.splice(index, 0, {fn, index});
            blobs.value.push(obj);
        };

        const unregisterMolten = (obj) => {
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

        provide(MoltenKey, { blobs, registerMolten, unregisterMolten, events });
    },

    render() {
        return this.$slots.default();
    }
});     