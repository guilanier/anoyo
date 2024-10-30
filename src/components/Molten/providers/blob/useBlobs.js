import { inject } from 'vue';

import { BlobKey } from './BlobProvider';

export const useBlobs = () => {
    const blob = inject(BlobKey, { events: null, blobs: null });

    if (!blob) {
        throw new Error('useBlob must be used within a BlobProvider');
    }
    return blob;
};
