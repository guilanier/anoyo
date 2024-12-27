import { isReactive, onMounted, reactive, toRefs, watchEffect } from 'vue';

const defaultProps = {
    v: true,
    s: 1,
    o: 1,
    px: 0,
    py: 0,
    pz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    w: 100,
    h: 100,
    align: 'center',
};

export const useDomElementProps = () => {
    const obj = {};
    Object.entries(defaultProps).forEach(([key, value]) => {
        obj[key] = { default: value };
    });

    return obj;
};

export const useDomElement = (target, _props = {}) => {
    const userProps = isReactive(_props) ? toRefs(_props) : _props;
    const props = reactive({ ...defaultProps, ...userProps });

    onMounted(() => {
        const el = target.value;

        watchEffect(() => (el.style.visibility = props.v ? 'visible' : 'hidden'));
        watchEffect(() => (el.style.opacity = props.o));

        // Set Layout`
        watchEffect(() => {
            const { align, w, h } = props;

            el.style.position = 'absolute';
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;

            switch (align) {
                case 'left':
                    Object.assign(el.style, {
                        top: '0',
                        left: '0',
                    });
                    break;

                case 'center':
                    Object.assign(el.style, {
                        top: '50%',
                        left: '50%',
                        marginTop: `${h / -2}px`,
                        marginLeft: `${w / -2}px`,
                    });
                    break;
            }
        });

        watchEffect(() => {
            const { px, py, pz, rx, ry, rz, s } = props;

            if (props.s instanceof Array)
                el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(${rz}rad) scale(${s[0]}, ${s[1]})`;
            else
                el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(${rz}rad) scale(${s})`;
        });
    });

    return props;
};
