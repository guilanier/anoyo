---
name: threejs-imports
description: >
    Enforces proper Three.js tree-shaking by always using named imports instead
    of the `import * as THREE` namespace pattern. Apply this skill whenever
    writing or touching any Three.js code — new files, new features, or
    refactoring existing scenes. If you see `THREE.Anything` in code you're
    already editing, convert the whole block. Never write `new THREE.Vector3()`
    or any `THREE.*` access — always destructure from 'three' or its add-on paths.
---

# Three.js Imports Skill

## Purpose

The `import * as THREE` pattern imports the entire Three.js library, preventing
bundlers (Vite, Rollup, webpack) from tree-shaking unused classes. Named imports
let bundlers include only what is actually used, which significantly reduces
bundle size in production.

---

## The Rule

```js
// ❌ Never — defeats tree shaking, inflates bundle
import * as THREE from 'three';
new THREE.Vector3();
new THREE.BoxGeometry(1, 1, 1);

// ✅ Always — tree-shakeable
import { Vector3, BoxGeometry } from 'three';
new Vector3();
new BoxGeometry(1, 1, 1);
```

---

## Core Package Imports

Always import from `'three'` directly:

```js
import {
    // Math
    Vector2,
    Vector3,
    Vector4,
    Matrix3,
    Matrix4,
    Quaternion,
    Euler,
    Color,
    MathUtils,

    // Scene graph
    Scene,
    Group,
    Object3D,

    // Mesh & geometry
    Mesh,
    InstancedMesh,
    Points,
    Line,
    LineSegments,
    BoxGeometry,
    PlaneGeometry,
    SphereGeometry,
    CylinderGeometry,
    BufferGeometry,
    BufferAttribute,
    InstancedBufferAttribute,

    // Materials
    MeshBasicMaterial,
    MeshStandardMaterial,
    MeshPhysicalMaterial,
    MeshDepthMaterial,
    ShaderMaterial,
    RawShaderMaterial,

    // Textures
    Texture,
    DataTexture,
    VideoTexture,
    CubeTexture,

    // Lights
    AmbientLight,
    DirectionalLight,
    PointLight,
    SpotLight,

    // Camera
    PerspectiveCamera,
    OrthographicCamera,

    // Renderer
    WebGLRenderer,
    WebGLRenderTarget,

    // Loaders
    TextureLoader,
    CubeTextureLoader,

    // Constants — import these too, never use THREE.* for them
    RepeatWrapping,
    ClampToEdgeWrapping,
    LinearFilter,
    NearestFilter,
    RGBAFormat,
    SRGBColorSpace,
    LinearSRGBColorSpace,
    FrontSide,
    BackSide,
    DoubleSide,
    AdditiveBlending,
    NormalBlending,
} from 'three';
```

## Add-on Imports

Add-ons live under `three/addons/` (Vite/modern bundler path):

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
```

> **Note:** In older setups using `three/examples/jsm/`, the paths are the same
> structure but rooted at `three/examples/jsm/controls/OrbitControls.js` etc.
> Prefer `three/addons/` for new code.

---

## Constants

Three.js constants are plain numbers — import them as named exports just like classes:

```js
// ✅
import { RepeatWrapping, LinearFilter, SRGBColorSpace } from 'three';
texture.wrapS = RepeatWrapping;
texture.colorSpace = SRGBColorSpace;

// ❌
texture.wrapS = THREE.RepeatWrapping;
```

---

## Refactoring Existing Code

When touching a file that uses `import * as THREE`:

1. Remove the `import * as THREE` line.
2. Collect every `THREE.Foo` used in the file.
3. Replace each `THREE.Foo` with `Foo` throughout the file.
4. Add a single consolidated named import block at the top.

```js
// Before
import * as THREE from 'three';
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geo, mat);
mesh.position.set(0, 1, 0);

// After
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';
const geo = new BoxGeometry(1, 1, 1);
const mat = new MeshStandardMaterial({ color: 0xff0000 });
const mesh = new Mesh(geo, mat);
mesh.position.set(0, 1, 0);
```

---

## With the Variable Naming Skill

When both skills apply, combine them naturally:

```js
import { Vector3, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';

const vPosition = new Vector3(0, 1, 0);
const elMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 0xffffff }));
```
