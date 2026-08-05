# Failure Diagnosis

Classify failures before changing commands, flags, dependencies, target triples,
or runtime configuration.

| Failure class | Symptoms | Likely causes | Inspection steps | Recommended next action | Unsafe action to avoid |
|---|---|---|---|---|---|
| missing target | compiler reports unknown or unavailable Wasm target | target not installed or wrong target spelling | inspect requested runtime and existing toolchain config | report missing target and ask/confirm install path | adding unrelated targets randomly |
| missing toolchain | command not found | Rust/TinyGo/wasi-sdk/Emscripten/Wasmtime/jco absent | check manifests and command availability | report prerequisite and documented install docs | installing toolchains automatically |
| unsupported syscall | runtime traps or linker errors for OS calls | code assumes filesystem/network/env not provided | inspect imports and runtime assumptions | choose compatible runtime or document limitation | switching targets without classifying host needs |
| wrong WASI preview | imports or runtime errors mention incompatible WASI namespace | Preview 1 artifact used with Preview 2 host or reverse | inspect WIT, imports, target triple, runtime docs | align target/interface category | mixing Preview 1 and components blindly |
| missing import | validation/runtime reports unresolved import | host does not provide required function/module | inspect imports and host config | add host binding guidance or change target after approval | stubbing imports without understanding ABI |
| wrong export shape | host cannot find expected export | artifact exports do not match host/plugin ABI | inspect exports and runtime docs | select recipe for expected export contract | renaming exports randomly |
| missing memory export | host/plugin reports memory missing | module generated with incompatible settings | inspect exports and toolchain defaults | choose toolchain flags required by host docs | toggling memory flags until it works |
| wasm-bindgen mismatch | JS glue fails to load Wasm | browser/node target mismatch or stale glue | inspect generated JS and package target | rebuild with matching wasm-bindgen target after approval | copying glue from another build |
| Emscripten/WASI confusion | JS glue expected in WASI or WASI imports expected in browser | wrong C/C++ toolchain path | inspect build command and artifact imports | choose Emscripten for browser or wasi-sdk for WASI | combining Emscripten and wasi-sdk outputs |
| Component Model validation failure | component validation fails | core module passed as component or invalid component | inspect WIT and component metadata | rebuild with component tooling after approval | treating components as plain core modules |
| WIT world mismatch | component imports/exports do not match world | wrong WIT world selected | inspect `wit/` and generated bindings | align selected world and bindings | editing WIT without approval |
| unsupported runtime artifact | runtime rejects module/component | artifact type not supported by runtime | inspect runtime category and artifact type | choose compatible target/runtime | forcing runtime execution repeatedly |
| browser-only API in non-browser target | runtime has missing DOM/web imports | code assumes browser APIs | inspect imports and source references | choose browser target or refactor after approval | polyfilling host APIs blindly |
| unsupported filesystem/network/env assumptions | runtime traps on fs/net/env access | host permissions absent or target lacks support | inspect runtime permissions and imports | document limitations or request permissions | granting broad permissions without user approval |
