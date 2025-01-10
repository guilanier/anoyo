import { resolve } from 'path';
import { defineResnConfig } from '@resn/cli';
import { GltfEtc1sPreset, GltfUastcPreset, ImagePreset, KtxEtc1sPreset, VideoAlphaPreset, } from '@resn/compression-tools';
const baseDir = resolve(process.cwd(), './assets');
const outputDir = resolve(process.cwd(), './public');
const customTextureResize = (args) => { };
const baseGltfOpts = {
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
const baseVideoOpts = {
    crf: 20,
    baseDir,
    targetFiles: '**/*.{mp4,mov}',
    outputDir,
    audio: false,
    format: ['mp4', 'webm'],
    quality: 60,
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
            {
                name: 'Video w/Alpha Compression',
                ...baseVideoOpts,
                ...VideoAlphaPreset,
            },
        ],
    },
});
