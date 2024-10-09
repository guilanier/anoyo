<template>
    <TweakPane :hidden-on-start="true">
        <LineType
            class="lineType"
            ref="refLineType"
            :class="theme"
            :active="true"
            :active-lines="true"
            :color="theme == 'dark' ? '#fff' : '#000'"
            :colorFill="colorFill"
            :text="copy"
        >
            <button class="btnTheme" @click="switchTheme" />
        </LineType>
    </TweakPane>
</template>

<script setup>
    import { usePreferredColorScheme } from '@vueuse/core';
    import gsap from 'gsap';
    import { Color } from 'three';
    import { onMounted, reactive, ref, watch } from 'vue';

    import { TweakPane, useRaf } from '@resn/gozer-vue';

    import LineType from '@/components/LineType/index.vue';

    const refLineType = ref();

    const colors = ['#000000', '#ffa441', '#ff6359', '#4596ff'];
    const scheme = usePreferredColorScheme();
    const theme = ref();
    const copy = ref(
        "Hey, Bob I'm lookin' at what, uh, Jack was talkin' about And, uh, it's definitely not a particle that's nearby It is a, uh, bright object And it's, uh, obviously rotating because it's flashing It's, uh, way out in the distance Currently rotating in a very rhythmic fashion Because the, uh, flashes come around, uh, almost on time As we look back at the earth, it's, uh, up at about 11 o'clock About, uh, well, maybe ten or twelve diameters- diameters, uh I don't know whether that does you any good But there's somethin' out there . . . . . . . . . . . ."
    );

    const colorIx = ref(0);
    const color0 = new Color();
    const color1 = new Color();
    const colorFill = new Color();

    const props0 = reactive({
        colorLrp: 0,
    });
    const urlSearch = new URLSearchParams(window.location.search);
    const RECORD_MODE = urlSearch.get('record') == 'true';

    watch(
        colorIx,
        (value) => {
            color0.copy(color1);
            color1.set(
                theme.value == 'dark' && colors[value] == '#ffffff'
                    ? '#000000'
                    : theme.value == 'light' && colors[value] == '#000000'
                      ? '#ffffff'
                      : colors[value]
            );
            props0.colorLrp = 0;

            gsap.killTweensOf(props0, { colorLrp: true });
            gsap.to(props0, { colorLrp: 1, duration: 1.2, ease: 'sine.inOut' });
        },
        { immediate: true }
    );

    let curr = 0;
    let delta = 0;
    let acc = 0;
    let ite = 0;
    useRaf(() => {
        colorFill.lerpColors(color0, color1, props0.colorLrp);

        // Record mode stuff (switch color and theme automatically, etc…)
        if (RECORD_MODE) {
            if (refLineType.value && refLineType.value.lines.length) {
                let tmp = 0;
                for (let i = 0; i < refLineType.value.lines.length; i++) {
                    tmp += refLineType.value.lines[i].lengthCurve.end0;
                }
                delta = tmp - curr;
                curr = tmp;
                acc += delta > 0 ? delta : 0;
            }
            if (acc > 760) {
                switchColor();
                acc = 0;
                ite++;
            }
        }
    });

    const switchColor = () => {
        colorIx.value = (colorIx.value + 1) % colors.length;
    };

    const switchTheme = () => {
        switchColor();
        theme.value = theme.value == 'dark' ? 'light' : 'dark';
    };

    watch(theme, (value, oldValue) => {
        colors[0] = value == 'dark' ? '#000000' : '#ffffff';
        if (!oldValue) {
            color0.set(colors[0]);
            color1.set(colors[0]);
        }
    });
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
            --color-ui: #fff;
        }
        &.light {
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
