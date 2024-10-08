<template>
    <TweakPane :hidden-on-start="false">
        <LineType
            class="lineType"
            :class="theme"
            :active="true"
            :active-lines="true"
            :color="theme == 'dark' ? '#fff' : '#000'"
            :colorFill="colorFill"
            text="I love the music. I think it’s the spirit, and it’s the bringing of people together, that probably is more in my interest."
            @click="switchColor"
        >
            <button class="btnTheme" @click="switchTheme" />
        </LineType>
    </TweakPane>
</template>

<script setup>
    import { usePreferredColorScheme } from '@vueuse/core';
    import { Color } from 'three';
    import { onMounted, reactive, ref, watch } from 'vue';

    import { TweakPane, useDamp, usePane, useRaf } from '@resn/gozer-vue';

    import LineType from '@/components/LineType/index.vue';

    const colors = ['#000000', '#ffa441', '#ff6359', '#4596ff', 'rgb(22, 161, 71)'];

    const scheme = usePreferredColorScheme();

    const theme = ref();

    const colorIx = ref(0);
    const color0 = new Color('#000000');
    const color1 = new Color('#000000');
    const colorFill = new Color();

    const props0 = reactive({
        lerpColor: 0,
    });
    const { set: setColorDamp } = useDamp(props0, { lambda: 6 }, ['lerpColor']);

    watch(
        colorIx,
        (value) => {
            color0.copy(color1);
            color1.set(colors[value]);

            setColorDamp({ lerpColor: 0 }, true);
            setColorDamp({ lerpColor: 1 });
        },
        { immediate: true }
    );

    useRaf(() => {
        colorFill.lerpColors(color0, color1, props0.lerpColor);
    });

    const switchColor = () => {
        colorIx.value = (colorIx.value + 1) % colors.length;
    };

    const switchTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark');

    watch(scheme, (value) => (theme.value = value), { immediate: true });

    onMounted(() => {
        document.body.style.overflow = 'hidden';
    });
</script>

<style lang="scss">
    @import '@resn/gozer-styles';
    @import '@resn/gozer-styles/base/document';

    html {
        &.lenis-scrolling {
            pointer-events: none;
        }

        @include baseFontSizeVW(375);

        @include desktop {
            @include baseFontSizeVW(1800);
            @include breakpoint-width-min(1200px) {
                font-size: 8px;
            }
            @include breakpoint-width-min(2000px) {
                font-size: 11px;
            }
        }
    }

    body {
        font-size: 1.5rem;
        font-family: sans-serif;
        touch-action: pan-y !important;
    }

    .tp-dfwv {
        position: relative;
        top: 6rem !important;
    }

    .lineType {
        &.dark {
            // --color-bg: #000;
            --color-ui: #fff;
        }
        &.light {
            // --color-bg: #fff;
            --color-ui: #000;
        }
        // background-color: var(--color-bg);
        // transition: background-color 1s cubic-bezier(0.61, 1, 0.88, 1);
        z-index: 0;
        .btnTheme {
            @include circle(2rem);
            position: absolute;
            right: 2rem;
            top: 2rem;
            z-index: 1;
            background-color: var(--color-ui);
            &:active {
                opacity: 0.8;
            }
        }
    }

    body {
        overflow: hidden;
        cursor: pointer;
    }
</style>
