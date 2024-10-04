<template>
    <TweakPane :hidden-on-start="false">
        <LineType
            class="lineType"
            :class="theme"
            :active="true"
            :active-lines="true"
            :color="theme == 'dark' ? '#fff' : '#000'"
        >
            <button class="btnTheme" @click="switchTheme" />
            <input class="lineType__input tp-txtv_i" type="text" />
        </LineType>
    </TweakPane>
</template>

<script setup>
    import { usePreferredColorScheme } from '@vueuse/core';
    import { onMounted, ref } from 'vue';

    import { TweakPane, usePane } from '@resn/gozer-vue';

    import LineType from '@/components/LineType/index.vue';

    const colorScheme = usePreferredColorScheme();
    console.log('🚀 ~ colorScheme:', colorScheme);
    const theme = ref(colorScheme);
    const switchTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
    };

    onMounted(() => {
        document.body.style.overflow = 'hidden';
    });
</script>

<style lang="scss">
    @import '@resn/gozer-styles';
    @import '@resn/gozer-styles/base/document';

    html {
        font-synthesis: none;
        @include baseFontSizeVW(375);
        @include breakpoint-width-min(450px) {
            font-size: 12px;
        }
        @include desktop {
            @include baseFontSizeVW(1280);
        }
    }

    .tp-dfwv {
        position: relative;
        top: 6rem !important;
    }

    .lineType {
        &.dark {
            --color-bg: #000;
            --color-ui: #fff;
        }
        &.light {
            --color-bg: #fff;
            --color-ui: #000;
        }
        @include fill;
        background-color: var(--color-bg);
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
        .lineType__input {
            width: 30%;
            @include centerAlignTransform;

            border: none;
            border-radius: 0.5rem;
            font-size: 1.4rem;
            font-family: 'Courier New', monospace;
            &:focus {
                outline: none;
            }
        }
    }

    body {
        overflow: hidden;
        cursor: pointer;
    }
</style>
