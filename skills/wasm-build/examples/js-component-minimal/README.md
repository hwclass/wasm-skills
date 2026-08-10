# JavaScript Component Model Minimal Fixture

This fixture proves JavaScript -> WebAssembly Component Model build-level
support for the general `wasm-build` decision model. It intentionally stops at
minimal componentization evidence and does not define advanced WIT architecture,
composition, canonical ABI design, adapter architecture, or linking workflows.

## Prerequisites

- `jco` componentization tooling
- A Node.js runtime compatible with the installed `jco`
- `wasm-tools` for static component validation when available

Missing external tools or incompatible runtime versions must be reported as
prerequisites. They must not be installed automatically, and global package
installation requires explicit approval.

Componentization tools and validators must not be installed automatically.

## Expected Build Command

```bash
jco componentize src/index.js --wit wit/world.wit --world-name app -o app.component.wasm
```

The equivalent fixture command is:

```bash
npm run build:component
```

## Expected Artifact

```text
app.component.wasm
```

## Validation Procedure

```bash
jco wit app.component.wasm
wasm-tools validate app.component.wasm
node ../../scripts/inspect-wasm-artifact.mjs app.component.wasm
```

Validation and inspection are static. Do not execute the component during
inspection.

## Reset Instructions

```bash
rm -f app.component.wasm
rm -rf dist node_modules tmp
```

Generated component artifacts, `dist/`, `node_modules/`, and temporary output
are ignored or removed after evidence capture unless intentionally committed as
reference evidence.
