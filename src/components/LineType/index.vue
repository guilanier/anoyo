<template>
    <div class="line-type" ref="refRoot"></div>
</template>

<script setup>
    import { Vector2 } from 'three';
    import { computed, defineEmits, defineProps, onMounted, reactive, ref, watch } from 'vue';
    import { watchEffect } from 'vue';

    import { createCanvas, resizeCanvas } from '@resn/gozer-canvas';
    import { isHandheld, isMobile } from '@resn/gozer-env';
    import { rectangle } from '@resn/gozer-math';
    import { pointInRect } from '@resn/gozer-math/point';
    import { usePane, useRaf, useViewportResize, useWindowPointer } from '@resn/gozer-vue';

    import Line from './line';

    let cx;
    let cv;

    const vPointer = new Vector2();
    const vPointerVl = new Vector2();
    const vPointerLst = new Vector2();

    const rPointer = rectangle.rectMake(0, 0, 1, 1);
    const sizeEl = reactive({ width: 1, height: 1 });

    const props = defineProps({
        color: { type: String, default: '#ffffff' },
        active: { type: Boolean, default: false },

        rectHit: { type: Object, default: { w: 1, h: 1 } },
        maxWordsVisible: { type: Number, default: isMobile ? 19 : 38 },

        text: {
            type: String,
            default:
                'Consectetur ex irure est consectetur eu pariatur aliqua enim aute et ipsum culpa ullamco. Elit pariatur pariatur ullamco ipsum excepteur tempor',
        },
        textArr: { type: Array, default: [] },
    });

    const propsReactive = reactive({
        direction: 0,
        fontSize: 16,
        nIterations: 5,

        activePointer: false,
        activePointerIdle: true,
        activeLines: false,

        text: props.text,
        textArrIndex: 0,
    });
    const activeComputed = computed(() => props.active || propsReactive.activeLines);

    const config = reactive({
        showLine: false,
    });

    const lines = [];
    let lineCurrent = null;

    const refRoot = ref(null);

    const emits = defineEmits(['drawing:start', 'drawing:stop']);

    onMounted(() => init());

    const resize = ({ width, height }) => {
        propsReactive.fontSize = parseInt(getComputedStyle(refRoot.value).fontSize);

        resizeRectHit({ width, height });
        resizeCanvas(cx, width, height);

        sizeEl.width = width;
        sizeEl.height = height;
    };

    const viewport = useViewportResize(resize);

    const resizeRectHit = ({ width, height }) => {
        const { w: wNorm, h: hNorm } = props.rectHit;

        const rectWidth = width * wNorm;
        const rectHeight = height * hNorm;

        rPointer.x = width - rectWidth;
        rPointer.y = height - rectHeight;
        rPointer.width = rectWidth;
        rPointer.height = rectHeight;
    };

    const init = () => {
        cx = createCanvas();
        cv = cx.canvas;

        refRoot.value.appendChild(cv);

        const { stop, start } = useRaf(update);
        watchEffect(() => (activeComputed.value ? start() : stop()));
    };

    watch(
        () => props.maxWordsVisible,
        (val) => lines.forEach((line) => (line.maxWordsVisible = val))
    );
    watch(
        () => props.rectHit,
        () => resizeRectHit({ width: sizeEl.width, height: sizeEl.height })
    );

    const update = () => {
        if (!vPointerVl.needsUpdate) vPointerVl.set(0, 0);
        vPointerVl.needsUpdate = false;

        cx.clearRect(0, 0, cv.width, cv.height);
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];
            line.update();
            // remove the line if it's too long to avoid bugs and add new line
            if (line.curve.points.length && line.curve.getLength() > 6000) {
                removeLine(l);
                addLine();
            }
        }
        propsReactive.activeLines = lines.length > 0;
    };

    const addLine = () => {
        if (props.textArr.length > 0) {
            propsReactive.text = props.textArr[propsReactive.textArrIndex];
            propsReactive.textArrIndex = (propsReactive.textArrIndex + 1) % props.textArr.length;
        }

        const { text, fontSize } = propsReactive;
        const { maxWordsVisible, color } = props;

        const l = new Line(cx, { text, vPointerVl, config, fontSize, color, maxWordsVisible });
        lines.push(l);
        lineCurrent = lines[lines.length - 1];
        lineCurrent.addPoint(vPointer.x, vPointer.y);
    };

    const removeLine = (i) => {
        if (i == -1) return;
        lines[i].hide({ onComplete: () => lines.splice(i, 1) });
        lineCurrent = lines[lines.length - 1];
    };

    const startDrawing = () => {
        if (!props.active) return;
        vPointer.set(pointer.x, pointer.y);
        vPointerLst.copy(vPointer);
        addLine();
    };

    const stopDrawing = () => {
        vPointerVl.needsUpdate = false;
        let l = lines.length;
        while (l >= 1) {
            l--;
            removeLine(l);
        }
    };

    let tLst;
    let int = 0;
    const { pointer, isDown: pointerDown } = useWindowPointer();
    watch(
        () => props.active,
        (bool) => (bool ? null : stopDrawing())
    );

    watch(pointerDown, (val) => !val && (propsReactive.activePointer = false));

    watch(
        () => propsReactive.activePointer,
        (bool) => {
            if (bool) {
                startDrawing();
                emits('drawing:start');
            } else {
                stopDrawing();
                emits('drawing:stop');
            }
        }
    );

    const handlePointer = ({ x, y }) => {
        if (!props.active) return;

        propsReactive.activePointer = pointInRect(x, y, rPointer);
        if (!propsReactive.activePointer) return;

        vPointer.set(x, y);

        if (!tLst) {
            tLst = performance.now();
            vPointerLst.set(x, y);
        }
        let t = performance.now();
        let dt = t - tLst;
        tLst = t;

        if (vPointer.distanceTo(vPointerLst) < 10) return;
        vPointerVl.subVectors(vPointer, vPointerLst).divideScalar(dt);
        vPointerVl.needsUpdate = true;

        vPointerLst.set(x, y);

        // add point every 5 interations
        if (int >= propsReactive.nIterations) {
            lineCurrent?.addPoint(x, y);
            int = 0;
        }
        int++;
    };

    watch(pointer, ({ x, y }) => handlePointer({ x, y }));

    usePane([{ value: propsReactive, options: { step: 1 } }, { value: config }], {
        title: 'Line Type',
        expanded: true,
    });
</script>

<style lang="scss" scoped>
    .line-type {
        position: fixed;
        height: 100vh;
        height: 100dvh;

        color: v-bind(color);
        font-size: 1.6rem;
        overflow: hidden;
    }
</style>
