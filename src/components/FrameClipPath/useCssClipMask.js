import { Euler, Vector3 } from 'three';
import { ref } from 'vue';

import { createRoundedPolygonPath, project } from './utils';

export const useCssClipMask = ({ focalLength = 800 } = {}) => {
    const path = ref('');

    const transform = {
        position: new Vector3(),
        rotation: new Euler(),
        scale: 1,
        borderRadius: 5,
    };
    const vScale = new Vector3();

    const vertices = [
        [0.5, -0.5, 0],
        [0.5, 0.5, 0],
        [-0.5, 0.5, 0],
        [-0.5, -0.5, 0],
    ].map((pt) => new Vector3().fromArray(pt));

    const pts = vertices.map(() => new Vector3());
    const ptsProjected = vertices.map(() => ({ x: 0, y: 0, z: 0 }));

    const update = () => {
        const { scale, rotation, position } = transform;
        Array.isArray(scale) ? vScale.fromArray(scale) : vScale.setScalar(scale);

        for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            const vCloned = pts[i];
            vCloned.copy(v).multiply(vScale).applyEuler(rotation);
        }

        project({
            vertices: pts,
            pts: ptsProjected,
            ptOrigin: position,
            fl: focalLength,
        });

        const path = updatePath();

        return path;
    };

    const updatePath = () => {
        path.value = createRoundedPolygonPath(ptsProjected, transform.borderRadius / 2);
        return path.value;
    };

    return { path, update, updatePath, transform, pts, ptsProjected };
};
