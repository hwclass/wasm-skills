# Runtime Validation

Validation starts with static checks and only executes runtime smoke tests after
the user explicitly requested execution or approved the build plan.

## Generic Artifact Validation

- Use `file` to identify obvious non-Wasm inputs when available.
- Use `wasm-tools validate` for static validation when available.
- Use `wasm-objdump` to inspect sections/imports/exports when available.
- Missing optional tools are skipped with actionable messages.

## Browser

- Validate the `.wasm` statically.
- Confirm JS glue exists when the build path uses wasm-bindgen or Emscripten.
- Run browser or bundler smoke tests only after approval.

## Node.js

- Validate the `.wasm` or component statically.
- Confirm generated package/module format matches Node expectations.
- Run Node smoke tests only after approval.

## Wasmtime

- Use static validation first.
- Use `wasmtime run` only after explicit execution approval.
- Confirm WASI/component support matches the artifact.

## WasmEdge

- Use static validation first.
- Use WasmEdge smoke tests only after explicit execution approval.
- Confirm runtime-specific imports or extensions are supported.

## Spin

- Inspect `spin.toml`.
- Validate referenced Wasm artifacts statically.
- Run Spin commands only after approval.

## Extism

- Validate plugin artifact statically.
- Inspect exports/imports for Extism host expectations.
- Run Extism host smoke tests only after approval.

## jco / Transpiled Components

- Use `jco wit` to inspect component interfaces when available.
- Use `wasm-tools validate` for component validation.
- Run generated JavaScript package checks only after approval.
