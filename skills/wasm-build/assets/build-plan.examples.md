# Build Plan Examples

These examples are canonical BuildPlan data. They document recommended commands;
they do not authorize execution.

## Rust Browser

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "Cargo.toml" },
    { "kind": "source", "path": "src/lib.rs" }
  ],
  "intendedEnvironment": "Browser",
  "runtime": "browser",
  "target": "wasm32-unknown-unknown",
  "artifactType": "js-bound-module",
  "language": "rust",
  "toolchain": "wasm-pack",
  "buildCommand": "wasm-pack build --target web",
  "validationCommands": ["wasm-tools validate pkg/app_bg.wasm"],
  "smokeTestCommand": null,
  "filesExpectedToChange": [],
  "risks": [
    { "id": "wasm-bindgen-mismatch", "summary": "Generated JS glue must match browser target" }
  ],
  "fallbackPath": "Confirm browser host assumptions and wasm-bindgen target.",
  "documentationUpdates": ["README build command", "README validation command"],
  "approvalRequired": true
}
```

## Rust WASI

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "Cargo.toml" },
    { "kind": "source", "path": "src/main.rs" }
  ],
  "intendedEnvironment": "WASI CLI",
  "runtime": "wasi-preview1",
  "target": "wasm32-wasip1",
  "artifactType": "wasi-command",
  "language": "rust",
  "toolchain": "cargo",
  "buildCommand": "cargo build --target wasm32-wasip1",
  "validationCommands": [
    "wasm-tools validate target/wasm32-wasip1/debug/app.wasm",
    "wasmtime run target/wasm32-wasip1/debug/app.wasm"
  ],
  "smokeTestCommand": "wasmtime run target/wasm32-wasip1/debug/app.wasm",
  "filesExpectedToChange": [],
  "risks": [
    { "id": "missing-target", "summary": "Rust WASI target may not be installed" }
  ],
  "fallbackPath": "Confirm installed Rust targets and intended runtime.",
  "documentationUpdates": ["README build command", "README runtime assumptions", "README validation command"],
  "approvalRequired": true
}
```

## Rust Component

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "Cargo.toml" },
    { "kind": "wit", "path": "wit/world.wit" }
  ],
  "intendedEnvironment": "Component host",
  "runtime": "component-model",
  "target": "wasm32-wasip1-component",
  "artifactType": "component",
  "language": "rust",
  "toolchain": "cargo-component",
  "buildCommand": "cargo component build",
  "validationCommands": ["wasm-tools validate target/wasm32-wasip1/debug/app.wasm"],
  "smokeTestCommand": null,
  "filesExpectedToChange": [],
  "risks": [
    { "id": "wit-world-mismatch", "summary": "Selected WIT world may not match host" }
  ],
  "fallbackPath": "Inspect WIT world and host component support.",
  "documentationUpdates": ["README WIT world", "README validation command"],
  "approvalRequired": true
}
```

## TinyGo

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "go.mod" },
    { "kind": "source", "path": "main.go" }
  ],
  "intendedEnvironment": "WASI CLI",
  "runtime": "wasi-preview1",
  "target": "wasi",
  "artifactType": "wasi-command",
  "language": "tinygo",
  "toolchain": "tinygo",
  "buildCommand": "tinygo build -target=wasi -o app.wasm .",
  "validationCommands": ["wasm-tools validate app.wasm"],
  "smokeTestCommand": "wasmtime run app.wasm",
  "filesExpectedToChange": [],
  "risks": [
    { "id": "unsupported-syscall", "summary": "TinyGo target may not support all Go runtime behavior" }
  ],
  "fallbackPath": "Inspect imports and confirm WASI host support.",
  "documentationUpdates": ["README build command", "README toolchain prerequisites"],
  "approvalRequired": true
}
```

## C With wasi-sdk

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "build-file", "path": "Makefile" },
    { "kind": "source", "path": "src/main.c" }
  ],
  "intendedEnvironment": "WASI CLI",
  "runtime": "wasi-preview1",
  "target": "wasm32-wasi",
  "artifactType": "wasi-command",
  "language": "c",
  "toolchain": "wasi-sdk",
  "buildCommand": "/opt/wasi-sdk/bin/clang --target=wasm32-wasi -o app.wasm src/main.c",
  "validationCommands": ["wasm-tools validate app.wasm"],
  "smokeTestCommand": "wasmtime run app.wasm",
  "filesExpectedToChange": [],
  "risks": [
    { "id": "missing-toolchain", "summary": "wasi-sdk may not be installed" }
  ],
  "fallbackPath": "Confirm wasi-sdk path and C runtime assumptions.",
  "documentationUpdates": ["README build command", "README wasi-sdk prerequisite"],
  "approvalRequired": true
}
```

## JavaScript Component

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "component.json" },
    { "kind": "manifest", "path": "package.json" },
    { "kind": "wit", "path": "wit/world.wit" }
  ],
  "intendedEnvironment": "Component host",
  "runtime": "component-model",
  "target": "wit-component",
  "artifactType": "component",
  "language": "javascript",
  "toolchain": "jco",
  "buildCommand": "jco componentize src/index.js --wit wit/world.wit --out app.component.wasm",
  "validationCommands": ["jco wit app.component.wasm", "wasm-tools validate app.component.wasm"],
  "smokeTestCommand": null,
  "filesExpectedToChange": [],
  "risks": [
    { "id": "wit-world-mismatch", "summary": "JavaScript exports may not match WIT world" }
  ],
  "fallbackPath": "Inspect WIT world and jco componentization constraints.",
  "documentationUpdates": ["README WIT world", "README build command", "README validation command"],
  "approvalRequired": true
}
```
