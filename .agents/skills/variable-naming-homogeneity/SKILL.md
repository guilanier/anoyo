---
name: variable-naming-homogeneity
description: >
    Enforces consistent prefix-based variable naming for readability and visual
    homogeneity in Vue/JS/TS files. Use this skill whenever writing new variables,
    refactoring or touching existing code blocks, adding animation/math/vector
    logic, or cleaning up mixed naming in the same local scope. Apply it even when
    the user doesn't explicitly ask for it — if you're already touching a file and
    see inconsistent naming in the same scope, apply the conventions there too.
    Does NOT perform broad project-wide renames unless explicitly requested.
---

# Variable Naming Homogeneity Skill

## Purpose

Apply a consistent prefix-based naming style so variable declarations are easy
to scan and visually homogeneous. Focused on:

- Readability and scannability
- Consistency within touched scopes
- Clean stacked declarations
- Safe, local renaming (only in code blocks already being touched)

---

## Prefix Conventions

| Prefix | Meaning                                                       | Examples                                                  |
| ------ | ------------------------------------------------------------- | --------------------------------------------------------- |
| `ref*` | Vue refs (DOM/component refs)                                 | `refRoot`, `refInner`, `refMedia`, `refStickyBlock`       |
| `i*`   | Indexes / integer cursor positions                            | `iCurrent`, `iPrevious`, `iSelected`, `iVariant`, `iTone` |
| `is*`  | Booleans                                                      | `isActive`, `isHovered`, `isIntersecting`, `isDragging`   |
| `pr*`  | Normalized progress (0..1, remapped/eased)                    | `pr`, `prNorm`, `prRemapped`, `prSpring`                  |
| `p*`   | Proportional / percent-like values (not final progress state) | `pTones`, `pPosters`, `pXNorm`, `pYNorm`                  |
| `sc*`  | Scale-related variables                                       | `sc`, `scX`, `scY`, `scTarget`, `scBaked`                 |
| `v*`   | Vectors                                                       | `vPosition`, `vVelocity`, `vNormal`, `vElementPosition`   |
| `el*`  | Raw DOM elements / queried nodes                              | `elImage`, `elContainer`, `elPoster`                      |
| `tl*`  | GSAP timelines                                                | `tlIn`, `tlMain`, `tlOutro`                               |

---

## Naming Preferences

1. **Prefer full words** over short abbreviations when practical:
    - Prefer `iCurrent` over `iCurr`
    - Prefer `iPrevious` over `iPrev`

2. **Keep function names semantic**, not prefix-mangled:
    - `getScale()` is preferred over `getSc()`
    - Prefixes apply to _variable_ names, not function names.

3. **Group related declarations** for visual consistency:

    ```js
    const iCurrent = ref(0);
    const iPrevious = ref(0);
    const iSelected = ref(-1);

    const isActive = ref(false);
    const isHovered = ref(false);
    const isIntersecting = ref(false);
    ```

4. **Scope disambiguation** when multiple entities of the same type exist:
    ```js
    const vElementPosition = new THREE.Vector3();
    const vElementVelocity = new THREE.Vector3();
    const vCameraPosition = new THREE.Vector3();
    ```

---

## Application Rules

### When touching a file / code block

- Apply correct prefixes to any new variables you introduce.
- If refactoring or editing existing code, rename variables in the **same local scope** to match conventions — don't leave mixed naming in a single block.
- Do **not** rename variables in untouched files or distant scopes.

### Stacking style

Keep declarations vertically aligned when grouped:

```js
// Good — homogeneous stack
const scX = 1;
const scY = 1;
const scTarget = 0;

// Avoid — mixed naming breaks visual rhythm
const scaleX = 1;
const scY = 1;
const targetSc = 0;
```

### Boolean guards

Always use `is*` prefix — never bare adjectives:

```js
// Good
const isVisible = ref(false);

// Avoid
const visible = ref(false);
const show = ref(false);
```

### Progress vs proportion

Distinguish `pr*` (final progress, 0..1, often eased) from `p*` (raw proportional ratio):

```js
const pRaw = scrollY / maxScroll; // raw ratio
const prEased = ease(pRaw); // eased progress fed to animation
```

---

## Examples

### Before (mixed naming)

```js
const currentIndex = ref(0);
const prevIndex = ref(0);
const active = ref(false);
const domEl = document.querySelector('.card');
const tween = gsap.timeline();
```

### After (with skill applied)

```js
const iCurrent = ref(0);
const iPrevious = ref(0);
const isActive = ref(false);
const elCard = document.querySelector('.card');
const tlIn = gsap.timeline();
```
