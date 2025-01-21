<template>
    <div class="glry">
        <div class="glry__wrapper">
            <h1 class="glry__title">{{ title }}</h1>
            <div class="glry__grid" data-lenis-prevent>
                <Card
                    v-for="(item, i) in componentsReversed"
                    v-bind="item"
                    :key="item.id"
                    @mouseenter="iActive = i"
                    @mouseleave="iActive = null"
                    :active="iActive === i"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, defineProps, ref } from 'vue';

    import Card from './Card.vue';

    const props = defineProps({
        title: { default: 'Sandbox Hub' },
        configOptions: { default: [] },
        components: {
            default: [
                {
                    title: 'Test WebGL',
                    description: 'an example of a WebGL component',
                    path: '/sandbox/test-webgl-sandbox',
                },
            ],
        },
    });

    const iActive = ref();

    const componentsReversed = computed(() => [...props.components].reverse());

    /* 
    const loadConfigs = () => {
        const configs = window?.localStorage.getItem(localStorageId);
        return configs ? JSON.parse(configs) : {};
    };
    const saveConfigs = (configs) =>
        window?.localStorage.setItem(localStorageId, JSON.stringify(configs));
        const checkConfig = (id) => {
        const configs = loadConfigs();
        return configs[id] || false;
    };
    const updateConfigs = () => {
        let first = true;

        configUrl.value = '';
        const configs = loadConfigs();
        refOptions.value?.forEach((el) => {
            if (el.checked) {
                const prefix = first ? '?' : '&';
                configUrl.value += `${prefix}${el.name}=true`;
                first = false;
            }
            configs[el.name] = el.checked;
        });
        saveConfigs(configs);
    };

    const groupBy = (arr, fn) =>
        arr.map(typeof fn === 'function' ? fn : (val) => val[fn]).reduce((acc, val, i) => {
            acc[val] = (acc[val] || []).concat(arr[i]);
            return acc;
        }, {});

    const defaultCategory = 'General';
    // Group by categories
    const groupedComponents = Object.entries(groupBy(props.components, 'category')).map(
        ([category, components]) => ({
            category: category == 'undefined' ? defaultCategory : category,
            components,
        })
    ); 
    */
</script>

<style lang="scss">
    @use './styles/index.scss' as *;

    $prefix: 'glry';

    :root {
        --white: #fff;
        --off-white: #e9e8e3;
        --warm-grey: #94938d;

        --grey: #8a8a8a;
        --grey2: #858585;

        --black: #080808;
        --black-but-not-so: #111;
        --border-color: #212121;

        --elm-br: 2rem;

        --gap: 2rem;
        @media only screen and (min-width: 1920px) {
            --gap: 1rem;
        }
        @include mobile {
            --gap: 1.4rem;
        }

        --gap-divided: calc(var(--gap) / 2);
    }

    @media (prefers-color-scheme: light) {
    }

    body {
        @extend %SBScrollBar;
    }

    .#{$prefix} {
        position: relative;

        font-family: 'Space Grotesk', sans-serif;

        background-color: var(--black);
        color: var(--white);
        line-height: 1.5;
        padding: calc(var(--gap) * 2);

        @include mobile {
            padding: var(--gap);
        }

        font-size: min(15px, 1rem);
    }

    .#{$prefix}__title {
        font-family: 'Space Grotesk', sans-serif;
        font-variation-settings: 'wght' 375;
        font-size: 4em;

        margin-bottom: var(--gap);
    }

    .#{$prefix}__wrapper {
        max-width: 1920px;
        margin: 0 auto;
        @include mobile {
            width: 100%;

            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    .#{$prefix}__grid {
        position: relative;

        display: grid;
        gap: var(--gap-divided);
        // gap: var(--gap);

        padding-top: var(--gap);
        width: 100%;
        background-color: var(--black-but-not-so);

        padding: var(--gap);
        position: relative;
        border-radius: var(--elm-br);
        border: 1px var(--border-color) solid;

        grid-template-columns: repeat(3, 1fr);
        grid-auto-flow: dense;

        @media only screen and (min-width: 1920px) {
            grid-template-columns: repeat(5, 1fr);
        }

        @include mobile {
            grid-template-columns: repeat(2, 1fr);
            margin: var(--gap);
            padding: var(--gap);
        }
    }
</style>
