# Target Selection

Runtime categories overlap. Browser and Node are host environments. WASI Preview
1 and WASI Preview 2 are target/interface categories. Component Model is an
artifact/interface model. Wasmtime and WasmEdge are runtimes that may execute
WASI modules or components. Spin and Extism impose host/plugin expectations.

## Browser

- `whenToChoose`: UI or web-worker use with JavaScript integration.
- `whenNotToChoose`: CLI, filesystem-heavy, socket-heavy, or plugin-host use.
- `supportedOrCommonLanguages`: Rust, C/C++ with Emscripten, AssemblyScript.
- `recommendedToolchains`: wasm-bindgen, wasm-pack, Emscripten.
- `artifactExpectation`: `js-bound-module` with JS glue or browser-loadable core module.
- `validationStrategy`: `wasm-tools validate`, browser smoke test, bundler test.
- `runtimeAssumptions`: DOM/Web APIs are host-provided through JavaScript.
- `knownPitfalls`: Missing JS glue, wrong memory export, browser-only APIs in non-browser targets.
- `negativeCase`: Do not choose browser when the requested runtime is Wasmtime CLI.

## Node

- `whenToChoose`: Node-hosted Wasm or generated JS wrapper execution.
- `whenNotToChoose`: Browser DOM behavior or standalone WASI CLI only.
- `supportedOrCommonLanguages`: Rust, JavaScript components, C/C++.
- `recommendedToolchains`: wasm-bindgen Node target, jco, Emscripten.
- `artifactExpectation`: `js-bound-module`, component-transpiled package, or core module.
- `validationStrategy`: Node smoke test plus static validation.
- `runtimeAssumptions`: Node imports provide required host functions.
- `knownPitfalls`: Browser glue used in Node, missing imports, incompatible module format.
- `negativeCase`: Do not choose Node for a Spin application request.

## WASI Preview 1

- `whenToChoose`: CLI-like command module with Preview 1 imports.
- `whenNotToChoose`: Component Model interfaces or browser JS glue.
- `supportedOrCommonLanguages`: Rust, TinyGo, C, C++, Zig.
- `recommendedToolchains`: Rust `wasm32-wasip1`, TinyGo `-target=wasi`, wasi-sdk.
- `artifactExpectation`: `wasi-command`.
- `validationStrategy`: `wasm-tools validate`; runtime smoke test with Wasmtime or WasmEdge after approval.
- `runtimeAssumptions`: Preview 1 filesystem, args, env, and stdio support if granted.
- `knownPitfalls`: Unsupported syscalls, missing target, wrong WASI preview.
- `negativeCase`: Do not choose Preview 1 when WIT/component bindings are required.

## WASI Preview 2

- `whenToChoose`: Component-oriented WASI interfaces or WIT worlds using Preview 2.
- `whenNotToChoose`: Simple Preview 1 CLI command.
- `supportedOrCommonLanguages`: Rust, JavaScript component workflows, emerging Python/Zig paths.
- `recommendedToolchains`: cargo-component, jco, wasm-tools.
- `artifactExpectation`: `component`.
- `validationStrategy`: `wasm-tools validate`, WIT inspection, component-aware runtime check.
- `runtimeAssumptions`: Host supports the selected WIT world and Preview 2 interfaces.
- `knownPitfalls`: WIT world mismatch, runtime lacks component support, Preview 1/2 confusion.
- `negativeCase`: Do not choose Preview 2 for a legacy Preview 1-only runtime.

## Component Model

- `whenToChoose`: WIT-defined interfaces, language interop, or component runtime targets.
- `whenNotToChoose`: Plain browser module without component tooling.
- `supportedOrCommonLanguages`: Rust, JavaScript, Python constrained, Zig constrained.
- `recommendedToolchains`: cargo-component, jco, wasm-tools.
- `artifactExpectation`: `component`.
- `validationStrategy`: `wasm-tools validate`, `jco wit`, WIT world comparison.
- `runtimeAssumptions`: Component-aware host and matching imports/exports.
- `knownPitfalls`: WIT world mismatch, missing imports, wrong export shape.
- `negativeCase`: Do not choose components when the host expects a raw core module.

## Wasmtime

- `whenToChoose`: Local CLI validation for WASI modules or components.
- `whenNotToChoose`: Browser-only JS glue artifacts.
- `supportedOrCommonLanguages`: Rust, TinyGo, C, C++, Zig, JavaScript components.
- `recommendedToolchains`: Wasmtime plus source language toolchain.
- `artifactExpectation`: `wasi-command`, `component`, or `core-module`.
- `validationStrategy`: `wasmtime run` only with explicit execution approval; static validation otherwise.
- `runtimeAssumptions`: Wasmtime supports the selected ABI and host permissions.
- `knownPitfalls`: Runtime does not support generated artifact or permissions.
- `negativeCase`: Do not use Wasmtime to validate DOM/browser behavior.

## WasmEdge

- `whenToChoose`: WasmEdge-targeted CLI, server, or plugin smoke tests.
- `whenNotToChoose`: Browser JS glue or Wasmtime-specific behavior.
- `supportedOrCommonLanguages`: Rust, TinyGo, C, C++, Zig.
- `recommendedToolchains`: WasmEdge plus source language toolchain.
- `artifactExpectation`: `wasi-command` or compatible core module.
- `validationStrategy`: Static validation plus WasmEdge smoke test after approval.
- `runtimeAssumptions`: WasmEdge supports the module imports and host APIs.
- `knownPitfalls`: Runtime-specific extension assumptions.
- `negativeCase`: Do not choose WasmEdge for a jco-transpiled Node package.

## Spin

- `whenToChoose`: Fermyon Spin application with `spin.toml`.
- `whenNotToChoose`: Generic CLI module without Spin host expectations.
- `supportedOrCommonLanguages`: Rust, JavaScript, TinyGo, C/C++ through compatible paths.
- `recommendedToolchains`: Spin SDK, language SDKs, component tooling.
- `artifactExpectation`: `component` or Spin-compatible Wasm module.
- `validationStrategy`: Spin configuration inspection and static validation; Spin smoke test after approval.
- `runtimeAssumptions`: Spin host provides HTTP, config, and component interfaces.
- `knownPitfalls`: Missing `spin.toml`, wrong trigger shape, unsupported host imports.
- `negativeCase`: Do not choose Spin just because a project has generic Wasm files.

## Extism

- `whenToChoose`: Plugin module intended for an Extism host.
- `whenNotToChoose`: Browser or standalone WASI CLI workflows.
- `supportedOrCommonLanguages`: Rust, Go/TinyGo, C/C++, JavaScript constrained.
- `recommendedToolchains`: Extism PDK for the chosen language.
- `artifactExpectation`: `core-module` with Extism-compatible exports/imports.
- `validationStrategy`: Static validation plus Extism host smoke test after approval.
- `runtimeAssumptions`: Host provides Extism imports and expects plugin ABI.
- `knownPitfalls`: Wrong export shape, missing memory export, unsupported imports.
- `negativeCase`: Do not choose Extism for WIT component interop unless the host requires it.

## Unknown

- `whenToChoose`: Repository evidence does not identify a runtime.
- `whenNotToChoose`: Evidence clearly indicates browser, WASI, component, Spin, or Extism.
- `supportedOrCommonLanguages`: Any detected language.
- `recommendedToolchains`: None until target is clarified.
- `artifactExpectation`: `unknown`.
- `validationStrategy`: Static inspection only; ask for target/runtime clarification.
- `runtimeAssumptions`: None.
- `knownPitfalls`: Guessing target from language alone.
- `negativeCase`: Do not emit build commands before clarifying runtime.
