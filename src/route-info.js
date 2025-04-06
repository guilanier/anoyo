export const routeInfo = {
    SDFLensBlur: {
        name: 'SDF Lens Blur',
        path: '/sdf-lens-blur',
        componentName: 'SDFLensBlur',
        image: './thumbnails/sdf-lens@lg.webp',
        video: './videos/sdf-lens@lg.webm',
    },
    LineType: {
        name: 'Line Type',
        path: '/line-type',
        componentName: 'LineType',
        image: './thumbnails/line-type@lg.webp',
        video: './videos/line-type@lg.webm',
    },
    FrameClipPath: {
        name: 'Frame Clip Path',
        path: '/frame-clip-path',
        componentName: 'FrameClipPath',
        image: './thumbnails/frame-clip-path@lg.webp',
        video: './videos/frame-clip-path@lg.webm',
    },
    TextLens: {
        name: 'Text Lens',
        path: '/text-lens',
        componentName: 'ComponentGl',
        image: './thumbnails/text-lens@lg.webp',
        video: './videos/text-lens@lg.webm',
    },
    Molten: {
        name: 'Molten',
        path: '/molten',
        componentName: 'Molten',
        image: './thumbnails/molten@lg.webp',
        video: './videos/molten@lg.webm',
    },
    RaymarchSphere: {
        name: '·',
        path: '/raymarch-sphere',
        description: '3d raymarching sphere',
        componentName: 'ComponentGl',
        image: './thumbnails/raymarch-sphere@lg.webp',
        video: './videos/raymarch-sphere@lg.webm',
    },
    Comet: {
        name: 'Comet',
        path: '/comet',
        componentName: 'ComponentGl',
        // image: './thumbnails/comet@lg.webp',
        // video: './videos/comet@lg.webm',
    },
};

export const getComponents = () => {
    const components = Object.values(routeInfo)
        .map((route) => {
            const info = routeInfo[route.name] || {};
            return { ...route, ...info };
        })
        .map((_) => ({
            ..._, ...{
                title: _.title || _.name,
                path: (import.meta.env.BASE_URL + _.path).replace('//', '/'),
                description: _.description,
            }
        }));
    return components;
};