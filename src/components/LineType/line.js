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

        this.lengthDamp = 0;
        this.lengthDampPr = 0;
    }

    addPoint(x, y) {
        this.curve.points.push(new Vector2(x, y));
        this.curve.updateArcLengths();
    }

    reset() {
        this.curve.points = [];
        this.words.length = 0;
        this.textArray = this.text.split(' ');
        this.lengthDamp = 0;
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
    }

    update() {
        const { cx, curve, config } = this;
        const cv = this.cx.canvas;

        if (!this.tLst) this.tLst = performance.now();
        const t = performance.now();
        const dt = t - this.tLst; // real delta
        this.tLst = t;


        if (curve.points.length > 1) {
            cx.save();

            const lengthCurve = curve.getLength();

            this.lengthDamp = damp(this.lengthDamp, lengthCurve, 6, dt / 1000);
            this.lengthDampPr = this.lengthDamp / lengthCurve;

            // draw the curve in cx 2d
            if (config.showLine && this.lengthDampPr <= 1) {
                cx.beginPath();
                cx.moveTo(curve.points[0].x, curve.points[0].y);

                for (let i = 0; i < this.lengthDamp * this.lengthDampPr; i++) {
                    const pt = curve.getPointAt(i / this.lengthDamp);
                    cx.lineTo(pt.x, pt.y);
                }

                cx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                cx.lineWidth = 2;
                cx.lineCap = 'round';

                cx.stroke();
            }

            this.updateText();

            cx.restore();
        }
    }

    updateText() {
        const { cx, curve, text, textArray, kerning, maxWordsVisible, words, fontSize, color } = this;

        const lengthCurve = curve.getLength();
        const unitDivision = fontSize + 10;

        const velocity = this.vPointerVl.toArray();
        const wordSpacing = 10;

        cx.save();

        cx.font = `bold ${fontSize}px Reckless`;
        cx.textBaseline = 'middle';

        let distanceOnCurve = 0;
        for (let d = 0; d < textArray.length; d++) {
            if (distanceOnCurve < lengthCurve) {
                const text = textArray[d];
                const pr = Math.min(distanceOnCurve / lengthCurve, 1);

                const tangent = curve.getTangentAt(pr);

                const space =
                    Math.abs(tangent.x) > 0.8
                        ? cx.measureText(text).width + (wordSpacing + kerning * text.length)
                        : unitDivision;

                const pt = curve.getPointAt(pr);

                const word =
                    this.words[d] ||
                    new Word({ x: pt.x, y: pt.y, i: d, direction: this.direction, color, text, velocity });
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