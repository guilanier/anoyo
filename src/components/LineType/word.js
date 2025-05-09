import { Vector2 } from "three";
import { inRange, map } from '@resn/gozer-math';
import gsap from 'gsap';
import { drawCircle } from "@resn/gozer-canvas";
import { hexToRgb } from "@resn/gozer-color";

const debug = new URLSearchParams(window.location.search).get('debug');
export default class Word {
    i = 0;
    x = 0;
    y = 0;
    text = '';

    visible = false;
    active = false;

    propsTween = {
        xIn: 0,
        xOut: 0,
        xPr: 0,
        rStart: 0,
        rEnd: 0,
    };

    constructor({ x, y, text, i, direction, kerning = 1, velocity = [0, 0], color } = {}) {
        this.i = i;
        this.x = x;
        this.y = y;

        this.text = text;
        this.direction = direction;
        this.kerning = kerning;

        this.vVelocity = new Vector2().fromArray(velocity);

        const offsetAmount = map(this.vVelocity.length(), 0, 10, 10, 100, true) * -1;

        this.vOffset = new Vector2().add(this.vVelocity.normalize().multiplyScalar(offsetAmount));
        this.vOffsetTg = new Vector2().copy(this.vOffset);
        this.vOffsetVel = new Vector2();

        this.chars = this.text.split('');

        this.setColor(color);
    }

    setColor(c) {
        this.rgb = hexToRgb(c);
    }

    show() {
        this.visible = true;
        this.active = true;

        gsap.to(this.propsTween, { rEnd: 1, duration: 0.5, ease: 'power1.out' });
        this.vOffsetTg.set(0, 0);
    }

    hide() {
        this.visible = false;
        gsap.to(this.propsTween, {
            rStart: 1,
            duration: 0.5,
            ease: 'power1.out',
            onComplete: () => this.active = false
        });
    }

    update(cx) {
        const { xIn, xOut, xPr, rEnd, rStart } = this.propsTween;
        const { text, vOffset, direction, kerning, rgb } = this;

        const tmp = this.vOffsetTg.clone().sub(this.vOffset).multiplyScalar(0.1);
        this.vOffsetVel.add(tmp).multiplyScalar(0.5);
        this.vOffset.add(this.vOffsetVel);

        const x = this.x + vOffset.x + xIn + xOut + xPr;
        const y = this.y + vOffset.y;

        cx.save();

        if (debug) {
            cx.fillStyle = '#0000ff';
            drawCircle(cx, this.x, this.y, 2);
            cx.fill();
        }

        const nChars = this.chars.length;

        const iEnd = Math.round(rEnd * nChars);
        const iStart = Math.min(Math.round(rStart * nChars), iEnd);
        let xChar = x;

        const textWidth = cx.measureText(text).width;
        const textAlign = direction == 1 ? 'left' : 'right';
        switch (textAlign) {
            case 'right':
                xChar -= textWidth;
                break;
            case 'center':
                xChar -= textWidth / 2;
                break;
        }

        for (let i = 0; i < nChars; i++) {
            const v = inRange(i, iStart, iEnd, true);
            const char = text.charAt(i);
            cx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${+v})`;
            cx.fillText(char, xChar, y);
            xChar += cx.measureText(char).width + kerning;
        }

        cx.restore();
    }
}