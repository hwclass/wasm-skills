---
name: wasm-build
description: Use when compiling to WebAssembly, choosing Wasm targets, target-selection, validation, WASI Preview 1, WASI Preview 2 / Component Model, browser Wasm, WIT, wasm-bindgen, Emscripten, wasi-sdk, Wasmtime, WasmEdge, Extism, Spin, jco, or diagnosing WebAssembly build failures.
---

# wasm-build

Use this skill to help plan, build, repair, validate, diagnose, and document
WebAssembly workflows across supported languages, environments, artifact models,
and runtimes, including build failure diagnosis. This skill is not a compiler,
build system, package manager, runtime adapter, or toolchain installer.

## Workflow

1. Classify the current user intent as PLAN, BUILD, REPAIR, or VALIDATE using
   `references/execution-intent.md`.
2. Inspect repository evidence before choosing a build path. Prefer
   `scripts/inspect-wasm-project.mjs` when a machine-readable report helps.
3. Detect the source language, toolchain hints, and existing build metadata.
4. Identify or clarify the intended execution environment, artifact type, and
   runtime/host. Treat these as separate dimensions; categories can overlap.
5. Choose a compatible toolchain and check available prerequisites.
6. Produce a Wasm Build Plan from `assets/build-plan.template.md` before
   modifying project files or executing generated commands.
7. Execute according to intent and the approval boundary.
8. Validate generated or existing artifacts using `references/runtime-validation.md`
   and, when useful, `scripts/inspect-wasm-artifact.mjs`.
9. If a build fails, classify it with `references/failure-diagnosis.md` before
   changing commands, flags, dependency files, target triples, or runtime config.
10. When a build path succeeds, recommend documentation updates for build
   command, validation command, runtime command, toolchain prerequisites, target
   assumptions, and known limitations.

Use `references/target-selection.md` for environment, artifact, runtime, and
host decisions. Use `references/language-recipes.md` for language-specific
commands and gotchas.

## Intent Modes

- **PLAN**: Inspect and produce a Wasm Build Plan. Do not modify files, run
  builds, or install tools.
- **BUILD**: When the current user asks to build, compile, or test Wasm, inspect
  first, plan, then run project-local build and validation commands if existing
  prerequisites are available.
- **REPAIR**: When the current user asks to fix or make the project
  reproducible, inspect first, plan, then modify only project files justified by
  the plan.
- **VALIDATE**: Inspect existing `.wasm` artifacts with the allowlisted
  validator behavior. Do not rebuild unless the user explicitly asks.

## Approval Rule

You may inspect files and produce a build plan without approval. Explicit
current user instructions to build, compile, repair, modify, validate, or
otherwise perform explicitly requested execution authorize the requested
project-local action after inspection and planning. Do not ask for redundant
approval for that same project-local action.

Asking for help, diagnosis, guidance, or a plan does not authorize mutation or
execution. In those cases, you must not modify project files. Installing
project-external prerequisites, global tools, system packages, source-language
targets, or modifying anything outside the requested project still requires
explicit approval. Artifact inspection of an already provided `.wasm` file is
allowed only through the safe allowlisted behavior of
`scripts/inspect-wasm-artifact.mjs`.

## References

- `references/execution-intent.md`
- `references/target-selection.md`
- `references/language-recipes.md`
- `references/failure-diagnosis.md`
- `references/runtime-validation.md`

Run helper scripts only when useful and safe. They must remain read-only and must
not execute project scripts or install dependencies.
