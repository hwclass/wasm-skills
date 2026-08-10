# Implementation Plan: wasm-build Hardening

**Branch**: `003-wasm-build-hardening` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-wasm-build-hardening/spec.md`

## Summary

Harden the existing `wasm-build` Agent Skill by proving three representative
real WebAssembly build routes and by improving safe artifact structural
inspection and evidence-driven failure diagnosis. This feature does not create a
new Agent Skill and does not turn `wasm-build` into a build system. It adds real
minimal fixtures, integration evidence records, focused eval coverage, and
reference/script refinements so maintainers can decide whether `wasm-build` is
ready to freeze before starting a specialized skill such as `wasm-component`.

## Technical Context

**Language/Version**: POSIX shell installer remains unchanged; Node.js ESM
helper/eval scripts; Markdown/JSON skill content; minimal route fixtures for
Rust browser, TinyGo WASI, and JavaScript Component Model.

**Primary Dependencies**: Existing repository validation uses Node.js and
standard macOS/Linux shell utilities. Optional external WebAssembly tools
include Rust toolchain targets, wasm-pack/wasm-bindgen, TinyGo, jco or
componentization tooling, wasm-tools, wasm-objdump, file, Wasmtime, and
route-specific validators. Optional tools are detected and reported; they are
not installed automatically.

**Storage**: Repository files only: skill references, helper scripts, eval JSON,
fixtures, example READMEs, integration evidence documents, and generated
verification artifacts only when explicitly justified. Generated build outputs
such as `target/`, `pkg/`, `dist/`, `node_modules/`, and temporary build
directories remain uncommitted.

**Testing**: `npm run validate`, `npm run test:install`, `npm run test:scripts`,
`npm run test:evals`, `git diff --check`, focused integration checks for the
three required routes where prerequisites are available, artifact structural
inspection fixtures, and manual missing-prerequisite/approval evidence.

**Target Platform**: macOS/Linux first, compatible coding agents discovering
`skills/wasm-build`, project-local `.agents/skills/wasm-build`, or global
`~/.agents/skills/wasm-build`.

**Project Type**: Existing Agent Skill hardening, validation helper update,
fixture/eval update, reference documentation update, release-readiness evidence.

**Performance Goals**: Inspection and validation helpers remain deterministic,
bounded, and capped using existing output/time limits. Fixture validation should
complete quickly when optional toolchains exist, and should degrade to
actionable prerequisite evidence when they do not.

**Constraints**: Read-only inspection; no hidden mutation; no automatic
toolchain installation; no arbitrary command execution; no Wasm execution in
inspection mode; explicit approval before environment/toolchain mutation;
BuildPlan before project-local mutation or build execution; deterministic output
and sorted machine-readable data.

**Scale/Scope**: Bounded to `skills/wasm-build/`, `fixtures/` if needed,
package validation scripts, existing docs/release artifacts, and this feature's
spec package. No new skill, no full language/environment Cartesian matrix, no
advanced component design, no optimizer/debugger/publisher, no Windows parity.

## Constitution Check

*GATE: Pass before Phase 0 research. Re-check after Phase 1 design.*

- **Agent Skills, Not Runtime Infrastructure**: Pass. The feature hardens the
  existing `wasm-build` Agent Skill and proves build workflows. It does not add a
  runtime, package manager, marketplace, MCP registry, hosted service, or new
  build system.
- **Progressive Disclosure Skill Format**: Pass. `SKILL.md` remains compact.
  Route details belong in `examples/`, `references/`, `scripts/`, `assets/`, and
  repository-owned `evals/`.
- **Plan Before Mutation**: Pass. Integration prompts and examples must require
  inspection plus Wasm Build Plan before project-local mutation/build execution.
  Explicit current build requests authorize only the requested project-local
  build/validation, not environment mutation.
- **Detect, Diagnose, Validate**: Pass. This feature directly targets real
  repository detection, prerequisite checks, structural artifact inspection,
  validation, failure classification, and safe continuation.
- **Simple Installation, Explicit Toolchains**: Pass. Existing installation and
  uninstall behavior must remain intact. Optional external toolchains are never
  installed automatically.
- **Repository Boundary and Scope Restraint**: Pass. The only new source shape is
  real fixtures/evidence under the existing `wasm-build` package and optional
  root fixtures. `wasm-component` and advanced component architecture remain out
  of scope.
- **Documentation, Acceptance, and Task Traceability**: Pass. The design adds
  acceptance, quickstart, contracts, and evidence models so future tasks can map
  directly to functional requirements and validation.

## Project Structure

### Documentation (this feature)

```text
specs/003-wasm-build-hardening/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts.md
├── acceptance.md
├── examples.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
README.md
CHANGELOG.md
docs/
  release-checklist.md
install.sh
package.json
fixtures/
skills/
└── wasm-build/
    ├── SKILL.md
    ├── README.md
    ├── references/
    │   ├── execution-intent.md
    │   ├── target-selection.md
    │   ├── language-recipes.md
    │   ├── failure-diagnosis.md
    │   └── runtime-validation.md
    ├── scripts/
    │   ├── inspect-wasm-project.mjs
    │   └── inspect-wasm-artifact.mjs
    ├── assets/
    │   ├── build-plan.template.md
    │   └── build-plan.examples.md
    ├── examples/
    │   ├── rust-browser/
    │   ├── tinygo-minimal/
    │   └── js-component-minimal/
    └── evals/
        ├── README.md
        ├── build-cases.json
        ├── build-matrix.json
        ├── trigger-queries.json
        └── validate.mjs
```

**Structure Decision**: Use the existing progressive-disclosure skill structure.
Promote three existing route examples from README recipes/manual fixture into
minimal runnable fixtures with evidence, while preserving generated-output
ignore rules. Keep proof data repository-owned; do not publish eval JSON as a
universal Agent Skills contract.

## Complexity Tracking

| Violation or Expansion | Why Needed | Simpler Alternative Rejected Because |
|------------------------|------------|-------------------------------------|
| None | N/A | N/A |

## Post-Design Constitution Check

- **Agent-skill scope**: Pass. Design proves existing `wasm-build`; no new
  skill or runtime abstraction is introduced.
- **Progressive disclosure**: Pass. Detailed route and failure content remains
  outside compact `SKILL.md`.
- **Plan before mutation**: Pass. Contracts require BuildPlan/evidence before
  mutation/build execution and separate approval for environment mutation.
- **Detect/diagnose/validate**: Pass. Design adds artifact structure reporting,
  integration fixtures, and evidence-driven diagnosis.
- **Installation safety**: Pass. Installer is preserved and revalidated.
- **Repository restraint**: Pass. Fixture/evidence additions are scoped to the
  existing `wasm-build` package and release evidence.
