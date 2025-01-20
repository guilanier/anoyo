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
                :class="{ loaded: thumbLoaded }"
                @load="onImageLoad"
            />
            <div class="card__inner">
                <div class="card__infos">
                    <span class="card__title">{{ title }}</span>
                    <span class="card__description" v-if="description">{{ description }}</span>
                </div>
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

    const thumbLoaded = ref(false);
    const refThumb = ref(null);

    const onImageLoad = () => {
        thumbLoaded.value = true;
    };

    onMounted(() => {
        if (refThumb.value.complete) {
            onImageLoad();
        }
    });
</script>

<style lang="scss" scoped>
    .card {
        position: relative;
        overflow: hidden;

        &__content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow: hidden;
            aspect-ratio: 1 / 1;
        }

        &__image,
        &__video {
            height: 100%;
            width: 100%;
            object-fit: cover;
            transition:
                transform 700ms,
                opacity 1s ease-in-out;

            // Nested hover state
            .card:hover & {
                transform: scale(1.05);
            }
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
            transition: opacity 1000ms;

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
