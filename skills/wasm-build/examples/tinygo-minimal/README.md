# TinyGo WASI Minimal Fixture

This fixture proves the TinyGo -> WASI route for the general `wasm-build`
decision model. It is intentionally small and is not a generic Go example:
TinyGo is detected from the explicit `tinygo build -target=wasi` command.

## Prerequisites

- TinyGo
- `wasm-tools` for static artifact validation

Missing external tools must be reported as prerequisites. They must not be
installed automatically.

TinyGo and validators must not be installed automatically.

## Expected Build Command

```bash
tinygo build -target=wasi -o app.wasm .
```

The equivalent fixture command is:

```bash
make build
```

## Expected Artifact

```text
app.wasm
```

## Validation Procedure

```bash
wasm-tools validate app.wasm
node ../../scripts/inspect-wasm-artifact.mjs app.wasm
```

Validation is static. Do not execute `app.wasm` during inspection.

## Reset Instructions

```bash
make clean
```

Generated `app.wasm`, `target/`, and temporary output are ignored or removed
after evidence capture unless intentionally committed as reference evidence.
