import { inject, onBeforeUnmount, onMounted, ref } from 'vue';

import { BlobKey } from './BlobProvider';
import { useIntersectionObserver } from '@resn/gozer-vue';

const uniqueId = (id = 'BlobId') => {
    return `${id}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useBlob = (
    el = null,
    { id = 'BlobId', useAutoBounds = true, borderRadius = 18 } = {}
) => {
    const blob = inject(BlobKey);

    if (!blob) {
        throw new Error('useBlob must be used within a BlobProvider');
    }

    const sticky = inject('stickyBlob', { offset: 0, emit: null });

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
        blob.registerBlob(object);
        blob.events.on('update', update);
    });

    onBeforeUnmount(() => {
        blob.unregisterBlob(object);
        blob.events.off('update', update);
    });

    return object;
};
