<template>
    <a class="card" :href="path" :key="title">
        <div class="card__content">
            <div class="card__video">
                <video v-if="video && active" autoplay muted loop playsinline>
                    <source :src="video" type="video/webm" />
                </video>
            </div>
            <img
                ref="refThumb"
                class="card__image"
                :src="image"
                :alt="title"
                :class="{ loaded: isLoadedThumb }"
                @load="onImageLoad"
            />
        </div>
        <div class="card__inner">
            <div class="card__infos">
                <span class="card__title">{{ title }}</span>
                <span class="card__description" v-if="description">{{ description }}</span>
            </div>
        </div>
    </a>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    const props = defineProps({
        path: { type: String },
        title: { type: String },
        description: { type: String },
        video: { type: String },
        image: { type: String },
        active: { type: Boolean },
    });

    const refThumb = ref(null);

    const isLoadedThumb = ref(false);
    const onImageLoad = () => (isLoadedThumb.value = true);

    onMounted(() => {
        if (refThumb.value.complete) onImageLoad();
    });
</script>

<style lang="scss" scoped>
    .card {
        position: relative;
        overflow: clip;

        aspect-ratio: 1 / 1;
        // aspect-ratio: 4 / 5;

        &__content {
            position: absolute;
            inset: 0;
            transition: transform 700ms;
            .card:hover & {
                transform: scale(1.05);
            }
        }

        &__image,
        &__video,
        video {
            position: absolute;
            width: 100%;
            height: 100%;

            object-fit: cover;
            transition: opacity 1s ease-in-out;
        }

        &__image {
            opacity: 0;
            &.loaded {
                opacity: 1;
            }
        }

        &__video {
            position: absolute;
            z-index: 1;
            opacity: 0;
            transition: opacity 600ms;

            video {
                height: 100%;
                width: 100%;
            }

            .card:hover & {
                opacity: 1;
            }
        }

        &:active {
            .card__inner:after {
                content: '';
                position: absolute;
                background-color: rgba(0, 0, 0, 0.6);
                inset: 0;
            }
        }

        &__inner {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, black, rgba(0, 0, 0, 0.4), transparent);
            opacity: 0;
            transition: opacity 300ms;

            padding: 1em;
            z-index: 2;

            display: flex;
            align-items: flex-end;

            // Nested hover state
            .card:hover & {
                opacity: 1;
            }
        }

        &__infos {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__title {
            color: white;
            font-size: 1.2em;
        }

        &__description {
            color: rgba(255, 255, 255, 0.613);
            font-size: 0.8em;
        }
    }
</style>
