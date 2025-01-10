<template>
    <div class="demo" ref="refRoot" @click="onClick">
        <Frame
            ref="refFrame"
            borderColor="#fff"
            borderWidth="4"
            :hasElementSize="true"
            :step="tutoStep"
        >
            <template #outer>
                <div class="frame__points" :style="{ opacity: +(tutoStep == 0) }">
                    <div v-for="_ in ptsDemo" :key="_.id" class="ptDemo" ref="refsPtDemo">
                        x: {{ ~~_.x }} - y: {{ ~~_.y }}
                    </div>
                </div>
                <div class="frame__outer" ref="refOuter">
                    <img src="/images/FrameClipPath/outer.png" />
                </div>
            </template>
            <template #inner>
                <div class="frame__bg" :style="{ opacity: +(tutoStep > 1) }" />
                <div class="frame__inner" ref="refInner">
                    <img src="/images/FrameClipPath/inner.png" />
                </div>
            </template>
        </Frame>
    </div>
</template>

<script setup>
    import { Vector2, Vector3 } from 'three';
    import { onMounted, reactive, ref } from 'vue';

    import {
        useDamp,
        useDomElement,
        useRafBool,
        useViewportResize,
        useWindowPointer,
    } from '@resn/gozer-vue';

    import Frame from '@/components/FrameClipPath/Frame.vue';

    const ptsDemo = reactive([
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.1 },
        { x: 0.9, y: 0.9 },
        { x: 0.1, y: 0.9 },
    ]);

    onMounted(() => (document.body.style.overflow = 'hidden'));

    const active = ref(true);
    const tutoStep = ref(0);

    const refRoot = ref();
    const refFrame = ref();
    const refOuter = ref();
    const refInner = ref();

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

    const propsElOuter = useDomElement(refOuter, { w: null, h: null, s: 1, align: 'left' });
    const propsElInner = useDomElement(refInner, { w: null, h: null, s: 1, align: 'left' });

    const propsFrameInner = { sc0: 1, sc1: 0 };

    const computePathLength = () => {
        const path = refFrame.value.refPath;
        const pathLength = path.getTotalLength();
        if (pathLength) refRoot.value.style.setProperty('--path-length', pathLength);
    };

    useViewportResize(
        ({ width, height }) => {
            vViewport.set(width, height), { immediate: true };
            computePathLength();
        },
        { immediate: true }
    );

    useWindowPointer(({ xPr, yPr }) => {
        vPointerNorm.set(xPr, yPr).subScalar(0.5).multiplyScalar(2);
        vPointerFrame.copy(vPointerNorm.clone().multiplyScalar(vViewport.x * 0.05));

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

        for (let i = 0; i < refsPtDemo.value.length; i++) {
            const { x, y } = refFrame.value.clipMask.ptsProjected[i];
            const pt = refsPtDemo.value[i];
            const ptDemo = ptsDemo[i];
            ptDemo.x = x;
            ptDemo.y = y;
            pt.style.transform = `translate(${x}px, ${y}px)`;

            propsElOuter.px = vPosition2.x * 0.4;
            propsElOuter.py = vPosition2.y * 0.4;

            propsElInner.px = vPosition2.x * 0.3;
            propsElInner.py = vPosition2.y * 0.3;
        }
    };

    const onClick = () => {
        tutoStep.value = (tutoStep.value + 1) % 4;
    };

    onMounted(() => {
        setTimeout(() => {
            computePathLength();
            setTimeout(() => refRoot.value.style.setProperty('--path-dur', '0.8s'), 1000);
        }, 100);
    });

    useRafBool(active, update);
</script>

<style lang="scss">
    /* body {
    width: 100vw;
    position: relative;
    background: black;
    height: 100vh;
    font-family: sans-serif;
    overflow-y: hidden;
}
 */
    #app {
        position: relative;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    .demo {
        --path-length: -1;
        --path-dur: 0;

        position: fixed;
        inset: 0;

        user-select: none;

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        background: #000;

        .frame {
            position: relative;
            width: min(70vmin, 70vmin);
            aspect-ratio: 1 / 1;
            .frame__border {
                transition:
                    stroke-dashoffset var(--path-dur, 0s),
                    fill 0.5s;
                stroke-dasharray: var(--path-length);
                stroke-dashoffset: var(--path-length);
            }
            &[step='1'],
            &[step='2'],
            &[step='3'] {
                .frame__border {
                    stroke-dashoffset: 0;
                }
            }
            &[step='3'] {
                .frame__inner img,
                .frame__outer img {
                    opacity: 1;
                }
            }

            &__bg {
                transition: opacity 0.5s;
                background: #fff;
            }

            &__inner,
            &__outer,
            &__bg {
                position: absolute;
                inset: 0;
                img {
                    transition: opacity 0.5s;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: translateY(20%) scale(1.6);
                }
            }
        }

        .ptDemo {
            position: absolute;
            pointer-events: none;
            color: white;
        }
    }
</style>
