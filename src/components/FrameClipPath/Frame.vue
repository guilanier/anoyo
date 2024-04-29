<template>
    <!-- v-show="show" -->
    <div class="frame" ref="refRoot" :class="{ show }">
        <div class="frame__outer">
            <slot name="outer" />
        </div>
        <div class="frame__mask" ref="refMask">
            <div class="frame__content" ref="refContent">
                <slot name="content"></slot>
            </div>
            <slot name="inner" />

            <svg
                class="frame__border"
                v-if="hasBorder"
                :stroke="borderColor"
                :fill="fillColor"
                :stroke-width="borderWidth"
            >
                <path class="frame__borderPath" ref="refBorderPath" />
            </svg>
        </div>
    </div>
</template>

<script setup>
    import { useElementSize } from '@vueuse/core';
    import { Vector3 } from 'three';
    import { computed, ref, watchEffect } from 'vue';

    import { useDomElement, useRafBool, useWindowPointer } from '@resn/gozer-vue';

    import { useCssClipMask } from './useCssClipMask';

    const refRoot = ref();
    const refContent = ref();
    const refMask = ref();
    const refMedia = ref();
    const refBorderPath = ref();

    const props = defineProps({
        active: { default: true },
        asset: { default: null },

        borderRadius: { default: 8 },
        borderColor: { default: '#000000' },
        borderWidth: { default: '2' },

        hasBorder: { default: true },
        hasRootTransform: { default: false },
        hasElementSize: { default: false },

        fillColor: { default: 'none' },

        focalLength: { default: 800 },
    });

    const active = computed(() => props.active);
    const show = ref();

    const clipMask = useCssClipMask({ focalLength: props.focalLength });
    clipMask.transform.borderRadius = props.borderRadius;

    const vCenter = new Vector3();
    const vPosition = new Vector3();
    const vRotation = new Vector3();
    const vScale = new Vector3().setScalar(1);
    const vSize = new Vector3();

    const propsFrame = {
        vPosition,
        vRotation,
        vScale,
        vSize,
    };

    const propsRoot = props.hasRootTransform
        ? useDomElement(refRoot, { w: null, h: null, align: 'left' })
        : null;
    const propsContent = useDomElement(refContent, { w: null, h: null, align: 'left' });

    const size = useElementSize(refRoot);

    watchEffect(() => {
        const { width, height } = size;
        vSize.set(width.value, height.value);
        vCenter.set(width.value / 2, height.value / 2);
    });

    const update = () => {
        const { transform: tf } = clipMask;
        const { hasElementSize } = props;

        const position = vCenter.clone().add(vPosition);
        const scale = hasElementSize ? vScale.clone().multiply(vSize) : vScale.clone();

        tf.position.copy(position);
        tf.rotation.setFromVector3(vRotation);
        tf.scale = scale.clampScalar(0.01, Infinity).toArray();

        const path = clipMask.update();
        refMask.value.style.clipPath = `path('${path}')`;
        refBorderPath.value?.setAttribute('d', path);

        show.value = tf.scale[0] > 0.01;
    };
    useRafBool(active, update);

    defineExpose({
        refMedia,

        propsRoot,
        propsFrame,
        propsContent,
        size,

        clipMask,
        update,
    });
</script>

<style lang="scss" scoped>
    .frame {
        position: absolute;
        inset: 0;
        // background-color: #ff000045;
        &.show {
            opacity: 1;
        }
        &__content {
            z-index: 1;
            inset: 0;
        }
        &__content,
        &__outer,
        &__mask {
            inset: 0;
        }

        &__outer {
            position: absolute;
            z-index: 3;
        }

        :deep(img),
        :deep(video) {
            object-fit: cover;
            object-position: center;
            inset: 0;
        }

        &__border,
        &__borderPath {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
        }
    }
</style>
