import { join } from 'path';

import { compressImage } from '@resn/compression-tools';

compressImage('**/*.png', {
    cwd: join(__dirname, '../export'),
    output: '../src/public', // the output is relative to the cwd
});