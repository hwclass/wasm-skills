# Implementation Evidence: wasm-build Hardening

## Baseline Validation

Baseline results are recorded in
`skills/wasm-build/evals/fixtures/integration-baseline.json`.

- `npm run validate`: passed
- `npm run test:install`: passed
- `npm run test:scripts`: passed
- `npm run test:evals`: passed
- Focused intent modes `intent-plan`, `intent-build`,
  `intent-build-missing-prerequisite`, `intent-repair`, and `intent-validate`:
  passed

NPM printed a local update-check warning about `/Users/temporaryadmin/.config`.
The warning did not affect command exit status and was not remediated because it
is outside this repository.

## Route Fixture Status

### Rust Browser

- Fixture: `skills/wasm-build/examples/rust-browser/`
- Status: runnable source fixture present
- Build result: `not-run`
- Validation result: `not-run`
- Evidence: `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`
- Reason: `wasm-pack` and `wasm-tools` are present, but the
  `wasm32-unknown-unknown` Rust target is not installed. Installing it is a
  global toolchain mutation and was not performed automatically.
- Generated output: no `target/` or `pkg/` output retained

### TinyGo WASI

- Fixture: `skills/wasm-build/examples/tinygo-minimal/`
- Status: runnable source fixture present
- Build result: `not-run`
- Validation result: `not-run`
- Evidence: `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`
- Reason: TinyGo is not installed. Installing it is an environment/toolchain
  mutation and was not performed automatically.
- Generated output: no `app.wasm`, `target/`, or temporary output retained

### JavaScript Component Model

- Fixture: `skills/wasm-build/examples/js-component-minimal/`
- Status: runnable source fixture present
- Build result: `passed`
- Validation result: `passed`
- Evidence: `skills/wasm-build/evals/fixtures/js-component-evidence.json`
- Commands run:
  - `PATH=/Users/temporaryadmin/.nvm/versions/node/v22.22.0/bin:$PATH jco componentize src/index.js --wit wit/world.wit --world-name app -o app.component.wasm`
  - `wasm-tools validate app.component.wasm`
  - `PATH=/Users/temporaryadmin/.nvm/versions/node/v22.22.0/bin:$PATH jco wit app.component.wasm`
  - `node ../../scripts/inspect-wasm-artifact.mjs app.component.wasm`
- Artifact inspection: reported `artifactForm: component`, WIT/WASI imports,
  export `add: func(left: s32, right: s32) -> s32`, and
  `memoryExportPresent: null`
- Generated output: `app.component.wasm` removed after evidence capture

## Missing-Prerequisite Approval Evidence

Evidence file:
`skills/wasm-build/evals/fixtures/missing-prerequisite-approval.json`.

The missing prerequisite is `wasm32-unknown-unknown Rust target`. The approval
boundary is `global-toolchain`. Approval was represented as requested but not
granted in this implementation session, so resume status is `blocked`. No Rust
target, TinyGo, `jco`, `wasm-tools`, wasi-sdk, Emscripten, system package, or
global Node package was installed automatically.

## Artifact Structural Inspection Evidence

Implemented in `skills/wasm-build/scripts/inspect-wasm-artifact.mjs` and
validated by `npm run test:scripts`.

Coverage includes:

- canonical report fields including `artifactForm`, `imports`, `exports`, and
  `memoryExportPresent`
- core module classification
- component classification
- invalid/malformed artifact classification
- import/export/memory parsing for a deterministic core module fixture
- missing optional validator handling
- timeout behavior
- output cap behavior
- paths with spaces and shell metacharacters
- directory, symlink, and non-regular input rejection
- `shell: false`
- no Wasm execution in inspection mode

## Failure Diagnosis Evidence

`skills/wasm-build/references/failure-diagnosis.md` contains complete entries
for the required classes:

- missing toolchain
- missing target
- wrong WASI preview
- missing imports
- incorrect exports
- missing memory export where relevant
- wasm-bindgen compatibility problems
- Emscripten versus wasi-sdk confusion
- WIT/world mismatch
- component validation failure
- runtime incompatibility
- linker failures
- target-incompatible native dependencies

Each entry includes symptoms, likely causes, inspection steps, recommended next
action, and unsafe action to avoid.

## Acceptance Criteria

- AC-001: PASS. Rust browser fixture contains runnable minimal source,
  prerequisites, expected route, validation procedure, and reset guidance.
- AC-002: PASS. TinyGo WASI fixture contains source, `go.mod`, `Makefile`,
  prerequisites, expected command, expected `app.wasm`, validation, and reset.
- AC-003: PASS. JS Component fixture contains source, `package.json`,
  `component.json`, WIT, prerequisites, expected component command/artifact,
  validation, and reset.
- AC-004: PASS. Generated route outputs are absent after evidence capture.
- AC-005: PASS. JS Component route records successful actual build evidence.
- AC-006: PASS. `app.component.wasm` was validated successfully by
  `wasm-tools validate`.
- AC-007: PASS. Missing-prerequisite evidence identifies the exact
  `wasm32-unknown-unknown` prerequisite, approval boundary, and blocked resume
  outcome without automatic mutation.
- AC-008: PASS. Evidence distinguishes baseline static checks, eval cases,
  runnable fixtures, actual JS build execution, and missing-prerequisite
  approval evidence.
- AC-009: PASS. Artifact inspection reports imports and exports when safe
  inspection supports them.
- AC-010: PASS. Artifact inspection reports memory export presence as `true`,
  `false`, or `null`.
- AC-011: PASS. Artifact inspection reports `core-module`, `component`,
  `unknown`, or `invalid`.
- AC-012: PASS. Artifact inspection preserves allowlisting, no shell invocation,
  output caps, timeout behavior, missing-tool degradation, and no Wasm execution.
- AC-013: PASS. Failure diagnosis covers every required class in `contracts.md`.
- AC-014: PASS. Diagnosis entries name evidence to inspect and unsafe random
  actions to avoid.
- AC-015: PASS. BUILD intent preserves project-local build authorization after
  inspection/planning and avoids redundant approval.
- AC-016: PASS. Environment/toolchain mutations require explicit approval and
  were not performed automatically.
- AC-017: PASS. JS Component Model coverage remains build-level proof and does
  not add `wasm-component` or advanced component architecture.
- AC-018: PASS. Portability, install/uninstall, generated product-skill ignore
  behavior, and release docs remain intact.
- AC-019: PASS. `npm run validate` passed.
- AC-020: PASS. `npm run test:install` passed.
- AC-021: PASS. `npm run test:scripts` passed.
- AC-022: PASS. `npm run test:evals` passed.
- AC-023: PASS. `git diff --check` passed.
- AC-024: PASS. Final decision below chooses exactly one allowed outcome and is
  based on real integration evidence.

## Final Validation Commands

- `npm run validate`: passed
- `npm run test:install`: passed
- `npm run test:scripts`: passed
- `npm run test:evals`: passed
- `git diff --check`: passed

## Remaining Gaps

- Rust browser did not complete a real build in this environment because
  `wasm32-unknown-unknown` is missing.
- TinyGo WASI did not complete a real build in this environment because TinyGo
  is missing.
- The default `jco` executable resolves through Node v14.17.6 and fails; the JS
  Component route succeeded by using an already-installed Node v22.22.0 first in
  `PATH`.

## Final Freeze-Readiness Decision

WASM-BUILD STILL REQUIRES ANOTHER HARDENING SLICE

Rationale: The hardening slice produced one real successful build and validation
path for JavaScript Component Model and substantially improved fixture,
artifact-inspection, approval, and diagnosis coverage. However, Rust browser and
TinyGo WASI remain blocked by missing environment/toolchain prerequisites in
this implementation environment, so freezing `wasm-build` before another
evidence pass would overstate route readiness.
