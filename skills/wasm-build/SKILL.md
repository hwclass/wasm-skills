---
name: wasm-build
description: Use when compiling to WebAssembly, choosing Wasm targets, target-selection, validation, WASI Preview 1, WASI Preview 2 / Component Model, browser Wasm, WIT, wasm-bindgen, Emscripten, wasi-sdk, Wasmtime, WasmEdge, Extism, Spin, jco, or diagnosing WebAssembly build failures.
---

# wasm-build

Use this skill to help plan, validate, diagnose, and document WebAssembly build
workflows, including build failure diagnosis. This skill is not a compiler,
build system, package manager, runtime adapter, or toolchain installer.

## Workflow

1. Inspect repository evidence before choosing a build path. Prefer
   `scripts/inspect-wasm-project.mjs` when a machine-readable report helps.
2. Produce a build plan from `assets/build-plan.template.md` before modifying
   project files or executing generated commands.
3. Use `references/target-selection.md` to choose the intended environment,
   runtime category, target, and artifact type.
4. Use `references/language-recipes.md` for language-specific commands and
   gotchas.
5. If a build fails, classify it with `references/failure-diagnosis.md` before
   changing commands, flags, dependency files, target triples, or runtime config.
6. Validate generated artifacts using `references/runtime-validation.md` and,
   when useful, `scripts/inspect-wasm-artifact.mjs`.
7. When a build path succeeds, recommend documentation updates for build command,
   validation command, runtime command, toolchain prerequisites, target
   assumptions, and known limitations.

## Approval Rule

You may inspect files and produce a build plan without approval. You must not
modify project files; install dependencies; invoke project build commands; or
execute generated commands unless the user explicitly requested execution in the
current instruction or you presented the build plan and then received explicit
approval.

Asking for help, diagnosis, guidance, or a plan does not authorize mutation or
execution. In those cases, you must not modify project files. Artifact
inspection of an already provided `.wasm` file is allowed only through the safe
allowlisted behavior of `scripts/inspect-wasm-artifact.mjs`.

## References

- `references/target-selection.md`
- `references/language-recipes.md`
- `references/failure-diagnosis.md`
- `references/runtime-validation.md`

Run helper scripts only when useful and safe. They must remain read-only and must
not execute project scripts or install dependencies.
