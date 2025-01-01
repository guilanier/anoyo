import { inject, onBeforeUnmount, onMounted, ref } from 'vue';

import { MoltenKey } from './MoltenProvider';
import { useIntersectionObserver } from '@resn/gozer-vue';

const uniqueId = (id = 'MoltenId') => {
    return `${id}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useMolten = (
    el = null,
    { id = 'MoltenId', useAutoBounds = true, borderRadius = 18 } = {}
) => {
    const blob = inject(MoltenKey);

    if (!blob) {
        throw new Error('useMolten must be used within a MoltenProvider');
    }

    const sticky = inject('stickyMolten', { offset: 0, emit: null });

    const intersecting = useIntersectionObserver(el);

    const update = () => {
        if (intersecting.value) {
            const rect = el.value.getBoundingClientRect();
            bounds.x = rect.x;
            bounds.y = rect.y;
            bounds.width = rect.width;
            bounds.height = rect.height;
            bounds.top = rect.top;
            bounds.left = rect.left;
        }
    };

    const bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        offset: sticky.offset,
    };
    const object = { id: uniqueId(id), bounds, visible: intersecting, borderRadius };

    onMounted(() => {
        blob.registerMolten(object);
        blob.events.on('update', update);
    });

    onBeforeUnmount(() => {
        blob.unregisterMolten(object);
        blob.events.off('update', update);
    });

    return object;
};
