# Language Recipes

Tier 1 recipes are complete in v0.1. Tier 2 entries are constrained guidance and
do not claim parity with Tier 1.

## Tier 1: Rust

- `whenToUse`: Rust crate targeting browser, WASI Preview 1, or components.
- `whenNotToUse`: Repository is not Rust or target is a non-Wasm native binary.
- `targetChoices`: browser, wasi-preview1, component-model.
- `prerequisites`: Rust toolchain and selected target/tooling already installed.
- `buildCommands`: `wasm-pack build --target web`; `cargo build --target wasm32-wasip1`; `cargo component build`.
- `artifactPaths`: `pkg/*_bg.wasm`; `target/wasm32-wasip1/*/*.wasm`.
- `validationCommands`: `wasm-tools validate`; `jco wit`; runtime smoke test after approval.
- `smokeTestCommand`: `wasmtime run target/wasm32-wasip1/debug/app.wasm`.
- `commonFailureClasses`: missing target, wasm-bindgen mismatch, wrong WASI preview, WIT world mismatch.
- `negativeCase`: Do not add random target triples without inspecting intended runtime.

## Tier 1: TinyGo

- `whenToUse`: Small Go/TinyGo program targeting WASI or plugin hosts.
- `whenNotToUse`: Standard Go runtime features are required but unsupported by TinyGo target.
- `targetChoices`: wasi-preview1, extism, embedded host.
- `prerequisites`: TinyGo installed; target support available.
- `buildCommands`: `tinygo build -target=wasi -o app.wasm .`.
- `artifactPaths`: `app.wasm`.
- `validationCommands`: `wasm-tools validate app.wasm`.
- `smokeTestCommand`: `wasmtime run app.wasm`.
- `commonFailureClasses`: missing toolchain, unsupported syscall, missing import.
- `negativeCase`: Do not silently switch to standard Go Wasm if TinyGo was requested.

## Tier 1: C

- `whenToUse`: C program targeting WASI through wasi-sdk.
- `whenNotToUse`: Browser APIs or Emscripten JS glue are required.
- `targetChoices`: wasi-preview1, embedded host.
- `prerequisites`: wasi-sdk installed.
- `buildCommands`: `/opt/wasi-sdk/bin/clang --target=wasm32-wasi -o app.wasm src/main.c`.
- `artifactPaths`: `app.wasm`.
- `validationCommands`: `wasm-tools validate app.wasm`.
- `smokeTestCommand`: `wasmtime run app.wasm`.
- `commonFailureClasses`: missing wasi-sdk, unsupported syscall, missing import.
- `negativeCase`: Do not use Emscripten when the requested target is WASI CLI.

## Tier 1: C++

- `whenToUse`: C++ project targeting browser with Emscripten or WASI with wasi-sdk.
- `whenNotToUse`: Host requires Component Model bindings not present in the project.
- `targetChoices`: browser, wasi-preview1.
- `prerequisites`: Emscripten or wasi-sdk installed.
- `buildCommands`: `emcc src/main.cpp -o public/app.js`; `/opt/wasi-sdk/bin/clang++ --target=wasm32-wasi -o app.wasm src/main.cpp`.
- `artifactPaths`: `public/app.wasm`, `public/app.js`, `app.wasm`.
- `validationCommands`: `wasm-tools validate app.wasm`; browser smoke test after approval.
- `smokeTestCommand`: `wasmtime run app.wasm`.
- `commonFailureClasses`: Emscripten versus WASI confusion, missing memory export, unsupported syscall.
- `negativeCase`: Do not mix Emscripten JS glue with a WASI-only runtime.

## Tier 1: JavaScript

- `whenToUse`: JavaScript needs componentization or jco/Javy-style packaging.
- `whenNotToUse`: Request is ordinary browser debugging with no Wasm build decision.
- `targetChoices`: component-model, node.
- `prerequisites`: jco or chosen componentization tool installed.
- `buildCommands`: `jco componentize src/index.js --wit wit/world.wit --out app.component.wasm`.
- `artifactPaths`: `app.component.wasm`.
- `validationCommands`: `jco wit app.component.wasm`; `wasm-tools validate app.component.wasm`.
- `smokeTestCommand`: Host-specific component smoke test after approval.
- `commonFailureClasses`: WIT world mismatch, missing import, runtime unsupported.
- `negativeCase`: Do not activate for package-manager tasks unrelated to Wasm.

## Tier 2: Python

- `currentlySupportedScope`: Constrained componentization guidance where credible project evidence exists.
- `knownConstraints`: Python-to-Wasm workflows are toolchain-specific and not Tier 1 in v0.1.
- `representativeWorkflow`: Inspect WIT/component config and document likely componentization path.
- `validationPath`: Static validation plus component metadata inspection.
- `unsupportedOrDeferredScenarios`: General Python package conversion or automatic runtime embedding.
- `noParityStatement`: v0.1 does not claim parity with Tier 1 recipes.

## Tier 2: Zig

- `currentlySupportedScope`: Target-selection guidance for Zig projects with explicit Wasm targets.
- `knownConstraints`: Exact commands depend on Zig version and target mode.
- `representativeWorkflow`: Confirm `build.zig`, target triple, and host runtime before recommending commands.
- `validationPath`: `wasm-tools validate` and runtime smoke test after approval.
- `unsupportedOrDeferredScenarios`: Deep Zig build-system migration.
- `noParityStatement`: v0.1 does not claim parity with Tier 1 recipes.

## Tier 2: AssemblyScript

- `currentlySupportedScope`: Browser or host-oriented AssemblyScript artifact guidance.
- `knownConstraints`: Runtime imports and loader expectations vary by project.
- `representativeWorkflow`: Inspect `package.json` scripts and AssemblyScript config without executing them.
- `validationPath`: Static validation of produced `.wasm` and host smoke test after approval.
- `unsupportedOrDeferredScenarios`: Rewriting TypeScript projects into AssemblyScript.
- `noParityStatement`: v0.1 does not claim parity with Tier 1 recipes.
