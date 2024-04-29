import { Vector3 } from 'three';

export function createRoundedPolygonPath(vertices, radius) {
    const pathData = [];
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        const p0 = i > 0 ? vertices[i - 1] : vertices[n - 1];
        const p1 = vertices[i];
        const p2 = i < n - 1 ? vertices[i + 1] : vertices[0];

        const v0 = { x: p0.x - p1.x, y: p0.y - p1.y };
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };

        const v0Len = Math.sqrt(v0.x ** 2 + v0.y ** 2);
        const v1Len = Math.sqrt(v1.x ** 2 + v1.y ** 2);

        const sin = v0.x * v1.y - v0.y * v1.x;
        const cos = v0.x * v1.x + v0.y * v1.y;

        const theta = Math.atan2(sin, cos);
        const phi = Math.PI - Math.abs(theta);

        const r = radius / Math.sin(phi / 2);
        const l = r * Math.cos(phi / 2);

        if (l > Math.min(v0Len / 2, v1Len / 2)) {
            radius = Math.min(v0Len, v1Len) / (2 * Math.cos(phi / 2));
        }

        const p0p1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        const p1p2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

        const p0p1Len = Math.sqrt((p1.x - p0p1.x) ** 2 + (p1.y - p0p1.y) ** 2);
        const p1p2Len = Math.sqrt((p2.x - p1p2.x) ** 2 + (p2.y - p1p2.y) ** 2);

        const offset0 = radius / p0p1Len;
        const offset1 = radius / p1p2Len;

        const p0Rounded = { x: p1.x + v0.x * offset0, y: p1.y + v0.y * offset0 };
        const p2Rounded = { x: p1.x + v1.x * offset1, y: p1.y + v1.y * offset1 };

        if (i === 0) {
            pathData.push(`M${p0Rounded.x},${p0Rounded.y}`);
        }

        pathData.push(`L${p0Rounded.x},${p0Rounded.y}`);
        pathData.push(`Q${p1.x},${p1.y},${p2Rounded.x},${p2Rounded.y}`);
    }

    pathData.push('Z');
    return pathData.join(' ');
}

export function project({ vertices = [], pts = [], ptOrigin = new Vector3(), fl = 800 } = {}) {
    for (var i = 0; i < vertices.length; i++) {
        var v = vertices[i],
            scale = fl / (fl + (v.z + ptOrigin.z));
        var p = pts[i];
        p.x = ptOrigin.x + v.x * scale;
        p.y = ptOrigin.y + v.y * scale;
    }
}
