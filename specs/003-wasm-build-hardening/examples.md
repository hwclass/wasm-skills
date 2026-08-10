# Examples: wasm-build Hardening

These examples define the required integration routes for this hardening slice.
They are proof fixtures for `wasm-build`, not a complete language/environment
matrix.

## Rust Browser

**Intent**: Prove Rust + Browser + JS-bound Wasm build behavior.

**Minimum fixture**:

```text
skills/wasm-build/examples/rust-browser/
├── README.md
├── before/
│   ├── Cargo.toml
│   ├── Cargo.lock
│   ├── index.html
│   └── src/lib.rs
└── after/      # generated or reference evidence only if intentionally kept
```

**Expected route**: Inspect Rust project, select browser environment, choose
wasm-bindgen/wasm-pack route, build when prerequisites exist, validate generated
Wasm, remove generated build directories unless intentionally kept.

## TinyGo WASI

**Intent**: Prove TinyGo + WASI command behavior distinct from plain Go.

**Minimum fixture**:

```text
skills/wasm-build/examples/tinygo-minimal/
├── README.md
├── go.mod
├── main.go
└── Makefile or documented command evidence
```

**Expected route**: Detect TinyGo from explicit TinyGo evidence, select WASI,
run `tinygo build -target=wasi -o app.wasm .` or the documented equivalent when
prerequisites exist, validate `app.wasm`, and report missing TinyGo safely when
unavailable.

## JavaScript Component Model

**Intent**: Prove JavaScript + Component Model build-level support without
becoming the future `wasm-component` skill.

**Minimum fixture**:

```text
skills/wasm-build/examples/js-component-minimal/
├── README.md
├── package.json
├── component.json
├── src/index.js
└── wit/world.wit
```

**Expected route**: Detect JavaScript and component/WIT evidence, select
Component Model, choose jco/componentization path when prerequisites exist,
generate or inspect a component artifact, validate or inspect component
interfaces, and avoid global package installation without approval.

## Evidence Example

```json
{
  "schemaVersion": "1.0",
  "routeId": "rust-browser",
  "planSummary": "Rust browser Wasm route using wasm-pack and wasm-bindgen.",
  "authorizationBasis": "Current user explicitly requested build and validation.",
  "prerequisiteState": "available",
  "commandsRun": [
    "wasm-pack build --target web",
    "wasm-tools validate pkg/rust_browser_bg.wasm"
  ],
  "buildResult": "passed",
  "validationResult": "passed",
  "artifactsProduced": [
    "pkg/rust_browser_bg.wasm"
  ],
  "generatedOutputPolicy": "Generated pkg/ removed after evidence capture.",
  "remainingGaps": []
}
```
