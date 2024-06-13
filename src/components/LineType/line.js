import { SplineCurve, Vector2 } from "three";
import { damp } from 'three/src/math/MathUtils';
import Word from "./word";
import { gsap } from "gsap";

export default class Line {

    constructor(context, { text = 'lorem ipsum', vPointerVl = new Vector2(), kerning = 1, fontSize = 16, maxWordsVisible = 38, color = '', config = {} } = {}) {
        this.cx = context;
        this.curve = new SplineCurve();

        this.vPointerVl = vPointerVl;
        this.kerning = kerning;
        this.fontSize = fontSize;
        this.color = color;
        this.maxWordsVisible = maxWordsVisible;

        this.tLst = 0;
        this.config = config;
        this.words = [];

        this.text = text;
        this.textArray = text.split(' ');

        this.lengthCurve = { start: 0, end: 0, start0: null, end0: 0 };
    }

    addPoint(x, y) {
        this.curve.points.push(new Vector2(x, y));
        this.curve.updateArcLengths();
    }

    reset() {
        this.curve.points = [];
        this.words.length = 0;
        this.textArray = this.text.split(' ');
        this.lengthCurve = 0;
    }

    setPointerDown(bool) {
        if (bool) this.lengthCurve.start = this.lengthCurve.end0;
        this.lengthCurve.start0 = this.lengthCurve.end0;
    }

    hide({ onComplete = noop } = {}) {
        const propsTween = this.words.filter((_) => _.visible).map((_) => _.propsTween);
        if (!propsTween.length) return onComplete();
        gsap.to(propsTween, {
            rStart: 1,
            duration: 0.2,
            stagger: 0.01,
            ease: 'power1.out',
            onComplete: () => {
                onComplete();
                this.reset();
            }
        });
        this.lengthCurve.start0 = this.lengthCurve.end0; // hide line
    }

    update() {
        const { cx, curve, config } = this;

        if (!curve.points.length) return
        cx.save();

        if (config.showLine) this.updateLine();
        this.updateText();

        cx.restore();
    }

    updateLine() {
        const { cx, curve, config } = this;

        if (!this.tLst) this.tLst = performance.now();
        const t = performance.now();
        const dt = t - this.tLst; // real delta
        this.tLst = t;

        const lengthCurveFull = this.lengthCurve.end0 = curve.getLength();
        const { start, end, start0, end0 } = this.lengthCurve;

        this.lengthCurve.start = damp(start, start0, 4, dt / 1000);
        this.lengthCurve.end = damp(end, end0, 6, dt / 1000);

        // draw the curve in cx 2d
        const ptStart = start < lengthCurveFull ? curve.getPointAt(start / lengthCurveFull) : null;
        if (!ptStart || start0 == null) return;

        cx.beginPath();
        cx.moveTo(ptStart.x, ptStart.y);

        for (let i = start; i < end; i++) {
            const pt = curve.getPointAt(i / lengthCurveFull);
            cx.lineTo(pt.x, pt.y);
        }

        cx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        cx.lineWidth = 1;
        cx.lineCap = 'round';

        cx.stroke();
    }

    updateText() {
        const { cx, curve, text, textArray, kerning, maxWordsVisible, words, fontSize, color } = this;

        const lengthCurve = curve.getLength();
        const unitDivision = fontSize + 12;

        const velocity = this.vPointerVl.toArray();
        const wordSpacing = 12;

        cx.save();

        cx.font = `bold ${fontSize}px Reckless`;
        cx.textBaseline = 'middle';

        let distanceOnCurve = 0;
        for (let d = 0; d < textArray.length; d++) {
            if (distanceOnCurve < lengthCurve) {
                const text = textArray[d];
                const pr = Math.min(distanceOnCurve / lengthCurve, 1);

                const tangent = curve.getTangentAt(pr);

                const direction = Math.sign(tangent.x);
                const space = Math.abs(tangent.x) > 0.8
                    ? cx.measureText(text).width + (wordSpacing + kerning * text.length)
                    : unitDivision;

                const pt = curve.getPointAt(pr);

                const word =
                    this.words[d] ||
                    new Word({ x: pt.x, y: pt.y, i: d, direction, color, text, velocity });
                if (!this.words[d]) {
                    this.words.push(word);
                    word.show();
                }
                const wordsVisible = this.words.filter((_) => _.visible);
                if (wordsVisible.length >= maxWordsVisible) {
                    const w = wordsVisible[wordsVisible.length - maxWordsVisible];
                    w.hide();
                }
                if (word.visible) word.update(cx);
                distanceOnCurve += space;
            }
        }
        // deplicate the text if limit reached
        if (words.length >= textArray.length) textArray.push(...text.split(' '));

        cx.restore();
    }
}