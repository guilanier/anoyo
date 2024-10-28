import { LoaderEvent } from '@resn/gozer-loading';
import { useLoaderComplete } from '@resn/gozer-vue/loading';
import { defineComponent, inject, provide, onMounted } from 'vue';

const AssetsKey = 'ASSETS_PROVIDER_KEY';
export const useAssets = (onLoaded = noop) => {
    const provider = inject(AssetsKey);
    if (!provider) throw new Error('Assets provider not found');

    onMounted(() => {
        if (provider.loader.state === 'complete') onLoaded({ data: provider.loader.data });
        provider.loader.once(LoaderEvent.LOAD_COMPLETE, onLoaded);
    });

    return provider;
};
export const AssetsProvider = defineComponent({
    setup() {
        const onLoaded = ({ data }) => {
            provider.assets = data;
        };

        const loader = useLoaderComplete(
            {
                fontMap: 'textures/TitleLens/fellix-bold.png#texture',
                fontData: 'textures/TitleLens/fellix-bold.json',
            }, onLoaded
        );

        const provider = {
            assets: null,
            loader,
        };

        provide(AssetsKey, provider);
    },

    render() {
        return this.$slots.default();
    }
});