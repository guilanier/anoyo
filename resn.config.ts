import { resolve } from 'path';

import { defineResnConfig } from '@resn/cli';
import type {
    CompressGltfOpts,
    CompressVideoOpts,
    CustomResizeTextureArgs,
} from '@resn/compression-tools';
import {
    GltfEtc1sPreset,
    GltfUastcPreset,
    ImagePreset,
    KtxEtc1sPreset,
    VideoAlphaPreset,
} from '@resn/compression-tools';

const baseDir = resolve(process.cwd(), './assets');
const outputDir = resolve(process.cwd(), './public');

const customTextureResize = (args: CustomResizeTextureArgs): void | [number, number] => {};

const baseGltfOpts: Omit<CompressGltfOpts, 'name'> & { targetFiles: string } = {
    targetFiles: '**/*.glb',
    baseDir,
    outputDir,
    ktx: true,
    sizes: {
        lg: 1,
    },
    force: true,
    customTextureResize,
};

const baseVideoOpts: Omit<CompressVideoOpts, 'name'> & { targetFiles: string } = {
    baseDir,
    targetFiles: '**/*.{mp4,mov}',
    outputDir,
    audio: false,
    format: ['webm'],
    quality: 30,
    sizes: {
        lg: 1,
    },
};

export default defineResnConfig({
    poster: {
        // Generate posters for all mp4 and mov files
        extract: [
            {
                targetFiles: '**/*.{mp4,mov}',
                baseDir,
                outputDir: baseDir,
            },
        ],
    },
    compression: {
        ktx: [
            {
                name: 'KTX Texture Compression',
                baseDir: resolve(baseDir, './textures'),
                targetFiles: '**/*.{jpg,png,jpeg}',
                outputDir: resolve(outputDir, './textures'),
                ...KtxEtc1sPreset,
            },
        ],
        gltf: [
            {
                name: 'ETC1S GLTF Compression',
                ...baseGltfOpts,
                ...GltfEtc1sPreset,
            },
            {
                name: 'UASTC GLTF Compression',
                ...baseGltfOpts,
                ...GltfUastcPreset,
            },
        ],
        img: [
            {
                name: 'Image Compression',
                targetFiles: '**/*.{jpg,png,jpeg}',
                baseDir,
                outputDir,
                // ignore: ['**/textures/**'],
                sizes: {
                    lg: 1,
                },
                ...ImagePreset,
            },
        ],
        video: [
            {
                name: 'Video Compression',
                ...baseVideoOpts,
                ignore: ['**/*-alpha.{mp4,mov}'],
            },
        ],
    },
});
