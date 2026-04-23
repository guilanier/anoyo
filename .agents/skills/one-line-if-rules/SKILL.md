---
name: one-line-if-rules
description: Enforces a compact conditional style: when an if/else branch contains exactly one statement, write it on a single line without braces. Use when editing JS/TS/Vue code, refactoring conditionals, or when the user asks for “one-line if”, “no brackets”, or conditional formatting rules.
---

# One-line if rules (no braces)

## Scope

Apply these rules in JS/TS and Vue `<script setup>` code when changing or generating code.

## Rules

- **Single statement**: If an `if` / `else if` / `else` branch has exactly **one** statement, write it **on one line** with **no braces**.
- **Multiple statements**: If a branch needs **2+ statements**, either:
  - **Use braces**, or
  - **Refactor** to keep the branch single-statement (extract helper function, early return, etc.).
- **Prefer early returns** to avoid nested blocks and keep conditions readable.
- **Prefer ternaries** when it stays readable (simple assignments/returns), but do not nest ternaries or use them for multi-step side effects.
- **Do not compress logic** into hard-to-read comma operators, `void (...)`, or mixed side effects just to keep it one line. One-line style must not reduce clarity.

## Examples

### Single statement (required one-line)

```ts
if (!id) return;
if (props.themeNext) appStore.theme = props.themeNext;
else emit('done');
```

### Multiple statements (use braces or refactor)

✅ Braces:

```ts
if (remembered) {
    appStore.theme = remembered;
    delete appStore.themeMemory[key];
}
```

✅ Refactor to single statement:

```ts
if (!remembered) return;
restoreRememberedTheme(key, remembered);
```

### Prefer ternaries (when readable)

✅ Good (simple assignment/return):

```ts
const theme = isDark ? THEME_DARK : THEME_LIGHT;
return ok ? data : null;
active.value = enabled ? isReady.value : false;
```

❌ Avoid (nested/complex ternaries):

```ts
const v = a ? (b ? c : d) : e;
```

### Avoid “one-line at all costs”

❌ Avoid:

```ts
if (x) return void (a(), b());
```

✅ Prefer:

```ts
if (!x) return;
a();
b();
```

