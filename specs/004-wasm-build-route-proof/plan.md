# Implementation Plan: wasm-build Route Proof

**Branch**: `004-wasm-build-route-proof` | **Date**: 2026-08-10 |
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from
`specs/004-wasm-build-route-proof/spec.md`

## Summary

This feature is the final empirical proof slice for the existing `wasm-build`
Agent Skill. It converts the two remaining truthfully blocked representative
routes, Rust -> Browser WebAssembly and TinyGo -> WASI, into real executed
build-and-validation evidence while preserving the already-proven JavaScript ->
Component Model route as regression coverage only.

The technical approach is intentionally small: reuse the existing runnable
fixtures, evidence JSON files, validation scripts, and implementation evidence
conventions from `003-wasm-build-hardening`; add only the feature-level final
evidence document at
`specs/004-wasm-build-route-proof/implementation-evidence.md`; stop at explicit
approval boundaries for environment/toolchain mutation; and resume the original
project-local build workflow only after the exact prerequisite is approved.

## Technical Context

**Language/Version**: Markdown and JSON evidence updates; existing Node.js ESM
eval/inspection scripts; existing fixture projects for Rust, TinyGo, and
JavaScript.

**Primary Dependencies**: Existing repository tooling plus route prerequisites
detected at implementation time: Rust toolchain with `rustup`,
`wasm32-unknown-unknown`, `wasm-pack`, TinyGo, `wasm-tools`, Node.js, and `jco`.
No new dependency family is introduced by this plan.

**Storage**: Repository files only. Route proof evidence remains in existing
`skills/wasm-build/evals/fixtures/*-evidence.json` files plus final feature
evidence in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
Generated build output must be removed or ignored and must not be committed.

**Testing**: Existing validation commands plus focused route-proof commands:
`npm run validate`, `npm run test:install`, `npm run test:scripts`,
`npm run test:evals`, `git diff --check`, focused Rust Browser build and
validation, focused TinyGo WASI build and validation, JavaScript Component
regression build and validation, generated-output absence checks, and evidence
consistency checks.

**Target Platform**: Current maintainer environment on macOS/Linux-class shell
tooling. Windows parity, package manager abstraction, and cross-platform
installer redesign are out of scope.

**Project Type**: Existing Agent Skill evidence/proof slice. This is not a new
build system, new Agent Skill, installer feature, artifact-inspector redesign,
or eval architecture redesign.

**Performance Goals**: Route proof commands only need deterministic evidence and
bounded generated output cleanup. Existing artifact inspection timeout/output
limits remain authoritative and are not redesigned here.

**Constraints**: No environment/toolchain mutation without explicit current user
approval; approval is exact-prerequisite scoped; explicit BUILD intent
authorizes the requested project-local build/validation after inspection and
planning; no redundant project-local build approval; no automatic toolchain
installation; no arbitrary command execution; JSON eval success cannot count as
real route proof.

**Scale/Scope**: Three representative routes only: Rust Browser, TinyGo WASI,
and JavaScript Component regression. No new languages, environments, skills,
Component Model architecture work, optimizer/debugger/publisher behavior,
Windows parity, generalized toolchain installer, installer redesign, failure
diagnosis redesign, artifact inspector redesign, or broad matrix expansion.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Agent Skills, Not Runtime Infrastructure**: PASS. The feature improves the
  existing `wasm-build` coding-agent workflow by proving documented routes. It
  does not create runtime infrastructure, a package manager, a marketplace, MCP
  registry, hosted service, generic framework, new build system, or new skill.
- **Progressive Disclosure Skill Format**: PASS. `SKILL.md` remains compact.
  Route proof belongs in existing examples, eval fixtures, and evidence
  artifacts. No tutorial expansion or knowledge dump is planned.
- **Plan Before Mutation**: PASS. Build execution happens only for explicit
  BUILD intent after inspection/planning. Rust target installation and TinyGo
  installation/activation stop for explicit approval before mutation.
- **Detect, Diagnose, Validate**: PASS. The plan records prerequisite state,
  commands, artifacts, validation results, and cleanup. Existing safe inspection
  and validation behavior remains in force.
- **Simple Installation, Explicit Toolchains**: PASS. Installer behavior is not
  changed. Toolchains are detected and reported; external mutation requires
  approval and is never silent.
- **Repository Boundary and Scope Restraint**: PASS. Changes stay within
  existing `skills/wasm-build/` evidence/fixture surfaces and this feature's
  spec directory.
- **Documentation, Acceptance, and Task Traceability**: PASS. `AC-001` through
  `AC-014` are explicit in the spec and will map to focused proof/evidence tasks
  in the task phase.

## Project Structure

### Documentation (this feature)

```text
specs/004-wasm-build-route-proof/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts.md
├── quickstart.md
├── implementation-evidence.md   # created during implementation
└── checklists/
    └── requirements.md
```

### Source and Evidence Surfaces

```text
skills/
└── wasm-build/
    ├── examples/
    │   ├── rust-browser/
    │   ├── tinygo-minimal/
    │   └── js-component-minimal/
    ├── evals/
    │   └── fixtures/
    │       ├── rust-browser-evidence.json
    │       ├── tinygo-wasi-evidence.json
    │       └── js-component-evidence.json
    └── scripts/
        └── inspect-wasm-artifact.mjs
```

**Structure Decision**: Reuse the existing fixture/evidence locations created by
prior `wasm-build` slices. Add only
`specs/004-wasm-build-route-proof/implementation-evidence.md` during
implementation for AC-level proof and the final decision. This preserves
progressive disclosure and avoids a new evidence framework.

## Route Plan

### Rust Browser Proof

1. Inspect the current Rust toolchain state and record whether
   `wasm32-unknown-unknown` is present.
2. If missing, record the missing prerequisite in
   `skills/wasm-build/evals/fixtures/rust-browser-evidence.json` and stop for
   explicit approval before running `rustup target add wasm32-unknown-unknown`.
3. After approval, run only the approved target installation.
4. Resume the documented Rust browser build from
   `skills/wasm-build/examples/rust-browser/` without requesting redundant
   approval for the already-requested project-local build.
5. Run the documented browser Wasm build and artifact validation.
6. Record commands, build result, validation result, artifact path, prerequisite
   approval, and cleanup result.
7. Remove generated `target/` and `pkg/` output after evidence capture.

### TinyGo WASI Proof

1. Inspect TinyGo availability and record whether TinyGo is present.
2. If TinyGo is missing, determine the safest documented installation or
   activation method available for the current environment and stop for explicit
   approval before using it.
3. After approval, run only the approved TinyGo prerequisite action.
4. Resume the documented TinyGo WASI build from
   `skills/wasm-build/examples/tinygo-minimal/`.
5. Produce the expected `app.wasm` artifact and validate it.
6. Record commands, build result, validation result, artifact path,
   prerequisite approval, and cleanup result.
7. Remove `app.wasm` and any temporary generated output after evidence capture.

### JavaScript Component Regression

1. Re-run the existing JavaScript Component Model fixture only as regression
   coverage.
2. Confirm the real build and Wasm/component validation still pass where
   prerequisites remain available.
3. Record regression evidence without redesigning the route, adding
   `wasm-component`, or introducing advanced component architecture.
4. Remove generated component output after evidence capture.

## Phase 0 Research

Research is complete in [research.md](./research.md). No unresolved technical
clarifications remain.

## Phase 1 Design

Design artifacts generated:

- [data-model.md](./data-model.md)
- [contracts.md](./contracts.md)
- [quickstart.md](./quickstart.md)

Post-design Constitution Check: PASS. The design still uses existing
`wasm-build` evidence surfaces, preserves exact-prerequisite approval, avoids
automatic toolchain installation, keeps generated outputs uncommitted, and does
not broaden skill scope.

## Validation Plan

Required final commands:

```bash
npm run validate
npm run test:install
npm run test:scripts
npm run test:evals
git diff --check
```

Focused route validation during implementation:

- Rust Browser: record Rust target state, approved target installation if
  needed, documented build command, artifact validation, evidence update, and
  `target/`/`pkg/` cleanup.
- TinyGo WASI: record TinyGo state, approved TinyGo prerequisite action if
  needed, documented build command, artifact validation, evidence update, and
  `app.wasm` cleanup.
- JavaScript Component: re-run existing build/validation regression, update
  evidence truthfully, and clean generated component output.

## Final Decision

The implementation evidence must end with exactly one:

```text
FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL
WASM-BUILD STILL LACKS REAL ROUTE PROOF
```

The first decision is allowed only if Rust Browser, TinyGo WASI, and JavaScript
Component Model all have truthful real build-and-validation evidence and all
required validation commands pass.

## Complexity Tracking

No constitution violations or repository-shape expansions are planned.
