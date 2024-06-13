<template>
    <TweakPane :hidden-on-start="true">
        <LineType
            class="lineType"
            :class="theme"
            :active="true"
            :active-lines="true"
            :color="theme == 'dark' ? '#fff' : '#000'"
        >
            <button class="btnTheme" @click="switchTheme" />
        </LineType>
    </TweakPane>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import { TweakPane } from '@resn/gozer-vue';

    import LineType from '@/components/LineType/index.vue';

    const theme = ref('dark');
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
            position: absolute;
            right: 2rem;
            top: 2rem;
            @include circle(2rem);
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
