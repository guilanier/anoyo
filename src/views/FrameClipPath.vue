<template>
    <div class="demo">
        <Frame
            ref="refFrame"
            borderColor="none"
            fillColor="none"
            borderWidth="4"
            :hasElementSize="true"
        >
            <template #content></template>
            <template #outer>
                <div v-for="_ in ptsDemo" :key="_.id" class="ptDemo" ref="refsPtDemo">
                    x: {{ ~~_.x }} - y: {{ ~~_.y }}
                </div>
            </template>
            <template #inner></template>
        </Frame>
    </div>
</template>

<script setup>
    import { Vector2, Vector3 } from 'three';
    import { onMounted, reactive, ref } from 'vue';

    import { useViewportResize } from '@resn/gozer-vue';
    import { useWindowPointer } from '@resn/gozer-vue';
    import { useDamp } from '@resn/gozer-vue';
    import { useRafBool } from '@resn/gozer-vue';

    import Frame from '@/components/FrameClipPath/Frame.vue';

    const ptsDemo = reactive([
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.1 },
        { x: 0.9, y: 0.9 },
        { x: 0.1, y: 0.9 },
    ]);

    onMounted(() => (document.body.style.overflow = 'hidden'));

    const active = ref(true);
    const refFrame = ref();
    const refsPtDemo = ref([]);

    // ― transform frame
    const vPointerNorm = new Vector2();
    const vPointerFrame = new Vector2();

    const vPosition0 = new Vector3(0, 0, 100);
    const vPosition1 = new Vector3();
    const vPosition2 = new Vector3();

    const vRotation0 = new Vector3();
    const vRotation1 = new Vector3();
    const vRotation2 = new Vector3();

    const vScale0 = new Vector3().setScalar(0.8);
    const vScale1 = new Vector3();

    const vViewport = new Vector2();

    const { set: setDampFramePos2 } = useDamp(vPosition2, { lambda: 7 }, ['x', 'y']);
    const { set: setDampFrameRot2 } = useDamp(vRotation2, { lambda: 6 }, ['x', 'y']);

    const propsFrameInner = { sc0: 1, sc1: 0 };

    useViewportResize(({ width, height }) => vViewport.set(width, height), { immediate: true });

    useWindowPointer(({ xPr, yPr }) => {
        vPointerNorm.set(xPr, yPr).subScalar(0.5).multiplyScalar(2);
        vPointerFrame.copy(vPointerNorm.clone().multiplyScalar(vViewport.x * 0.03));

        setDampFramePos2({ x: vPointerFrame.x, y: vPointerFrame.y });
        setDampFrameRot2({
            x: vPointerNorm.y * (Math.PI * 0.2),
            y: vPointerNorm.x * (Math.PI * -0.2),
        });
    });

    const update = () => {
        const {
            vScale: vFrameScale,
            vPosition: vFramePosition,
            vRotation: vFrameRotation,
        } = refFrame.value.propsFrame;

        vFramePosition.copy(vPosition0).add(vPosition1).add(vPosition2);
        vFrameRotation.copy(vRotation0).add(vRotation1).add(vRotation2);
        vFrameScale.copy(vScale0).add(vScale1);

        const propsContentTf = refFrame.value.propsContent;
        propsContentTf.s = propsFrameInner.sc0 + propsFrameInner.sc1;

        // console.log(refFrame.value.clipMask.ptsProjected);
        for (let i = 0; i < refsPtDemo.value.length; i++) {
            const { x, y } = refFrame.value.clipMask.ptsProjected[i];
            const pt = refsPtDemo.value[i];
            const ptDemo = ptsDemo[i];
            ptDemo.x = x;
            ptDemo.y = y;
            pt.style.transform = `translate(${x}px, ${y}px)`;
        }
    };

    useRafBool(active, update);
</script>

<style lang="scss">
    .demo {
        position: fixed;
        inset: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        .frame {
            position: relative;
            width: min(60vmin, 60vmin);
            aspect-ratio: 1 / 1;
            .frame__border {
                stroke-dasharray: 1230;
                // stroke-dashoffset: 500;
            }
        }
        .ptDemo {
            position: absolute;
            pointer-events: none;
            color: red;
        }
    }
</style>
