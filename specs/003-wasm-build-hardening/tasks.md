# Tasks: wasm-build Hardening

**Input**: Design documents from `/specs/003-wasm-build-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts.md,
acceptance.md, examples.md, quickstart.md

**Tests**: Required for this feature because it changes behavior, script output,
fixture completeness, approval semantics, artifact contracts, and release
readiness evidence.

**Organization**: Tasks are grouped by user story so each route or capability
can be completed and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no
  dependency on another task.
- **[Story]**: User-story label for story phases only.
- Each task names concrete file paths and a completion condition.

## Phase 1: Setup And Baseline Gates

**Purpose**: Establish the current safety baseline before hardening changes.

- [X] T001 Run and record baseline `npm run validate` result in `skills/wasm-build/evals/fixtures/integration-baseline.json`
- [X] T002 Run and record baseline `npm run test:install` result for existing install/distribution behavior in `skills/wasm-build/evals/fixtures/integration-baseline.json`
- [X] T003 Run and record baseline `npm run test:scripts` result for existing read-only helper behavior in `skills/wasm-build/evals/fixtures/integration-baseline.json`
- [X] T004 Run and record baseline `npm run test:evals` result for repository-owned eval behavior in `skills/wasm-build/evals/fixtures/integration-baseline.json`
- [X] T005 Run focused baseline intent evals `intent-plan`, `intent-build`, `intent-build-missing-prerequisite`, `intent-repair`, and `intent-validate` with `skills/wasm-build/evals/validate.mjs`
- [X] T006 Identify starting-state gaps for `skills/wasm-build/examples/rust-browser/`, `skills/wasm-build/examples/tinygo-minimal/`, and `skills/wasm-build/examples/js-component-minimal/`, then record them in `skills/wasm-build/evals/fixtures/integration-baseline.json`
- [X] T007 [P] Confirm generated output directories are absent or ignored for required fixtures in `skills/wasm-build/examples/`

---

## Phase 2: Foundational Contracts And Validation Harness

**Purpose**: Add shared evidence and validation infrastructure needed by all
stories.

**CRITICAL**: Complete this phase before changing route fixtures or artifact
contracts.

- [X] T008 Define repository-owned integration evidence JSON conventions in `skills/wasm-build/evals/README.md`
- [X] T009 Add IntegrationRoute and BuildEvidence validation helpers in `skills/wasm-build/evals/validate.mjs`
- [X] T010 Add fixture completeness validation for README, source files, manifests, prerequisites, expected command, expected artifact, validation procedure, reset instructions, and generated-output policy in `skills/wasm-build/evals/validate.mjs`
- [X] T011 Add generated-output absence checks for `target/`, `pkg/`, `dist/`, `node_modules/`, and temporary directories in required fixtures to `skills/wasm-build/evals/validate.mjs`
- [X] T012 Add prerequisite approval semantics checks for explicit build authorization and environment/toolchain approval boundaries in `skills/wasm-build/evals/validate.mjs`
- [X] T013 Extend `skills/wasm-build/evals/build-matrix.json` only with supported meaningful hardening route metadata, avoiding a Cartesian product
- [X] T014 [P] Update `package.json` validation script surface only if focused integration or artifact-structure modes are added

**Checkpoint**: Shared validation can distinguish static/schema checks, evals,
runnable fixtures, real build evidence, and manual prerequisite evidence.

---

## Phase 3: User Story 1 - Prove Rust Browser Build Route (Priority: P1)

**Goal**: Make the Rust browser route genuinely runnable and evidenced while
preserving the before/after protocol.

**Independent Test**: Run the rust-browser fixture with `wasm-build` installed;
verify Rust/browser detection, BuildPlan-before-mutation, explicit build
authorization, artifact validation, prerequisite approval behavior, evidence
recording, and generated-output cleanup.

### Tests For User Story 1

- [X] T015 [US1] Add fixture completeness assertions for `skills/wasm-build/examples/rust-browser/` in `skills/wasm-build/evals/validate.mjs`
- [X] T016 [US1] Add Rust browser command/artifact-name consistency checks for `skills/wasm-build/examples/rust-browser/README.md` and evidence files in `skills/wasm-build/evals/validate.mjs`
- [X] T017 [US1] Add missing `wasm32-unknown-unknown` prerequisite approval-boundary eval case in `skills/wasm-build/evals/trigger-queries.json` or route evidence

### Implementation For User Story 1

- [X] T018 [US1] Complete minimal Rust browser starting fixture under `skills/wasm-build/examples/rust-browser/before/`
- [X] T019 [US1] Update `skills/wasm-build/examples/rust-browser/README.md` with prerequisite list, expected command, expected artifact, validation procedure, reset instructions, and evidence policy
- [X] T020 [US1] Create or update Rust browser route evidence file under `skills/wasm-build/examples/rust-browser/` or `skills/wasm-build/evals/fixtures/` with `buildResult` recorded as `passed`, `failed`, or `not-run`
- [X] T021 [US1] Manually run Rust browser build only when prerequisites already exist or after explicit approval, then record commands, result, artifact path, and validation outcome in the evidence file
- [X] T022 [US1] Remove generated `target/` and `pkg/` output from `skills/wasm-build/examples/rust-browser/` after evidence capture unless explicitly justified as reference evidence

**Checkpoint**: User Story 1 satisfies AC-001, AC-004, AC-005 or documented
not-run status, AC-006 if build succeeds, AC-007 if prerequisite flow is used,
AC-015, and AC-016.

---

## Phase 4: User Story 2 - Prove TinyGo WASI Build Route (Priority: P1)

**Goal**: Convert the TinyGo example into a runnable minimal WASI fixture with
truthful prerequisite and build evidence.

**Independent Test**: Run the TinyGo fixture with `wasm-build`; verify TinyGo is
detected separately from ordinary Go, WASI is selected, the documented command
and artifact are consistent, missing TinyGo is reported safely, and generated
outputs are cleaned.

### Tests For User Story 2

- [X] T023 [US2] Add TinyGo fixture completeness checks for `skills/wasm-build/examples/tinygo-minimal/` in `skills/wasm-build/evals/validate.mjs`
- [X] T024 [US2] Add TinyGo-vs-Go detection regression using `skills/wasm-build/scripts/inspect-wasm-project.mjs` fixtures in `skills/wasm-build/evals/validate.mjs`
- [X] T025 [US2] Add TinyGo WASI expected command and artifact consistency checks for `skills/wasm-build/examples/tinygo-minimal/README.md`
- [X] T026 [US2] Add missing TinyGo prerequisite behavior eval case in `skills/wasm-build/evals/trigger-queries.json` or route evidence

### Implementation For User Story 2

- [X] T027 [US2] Add minimal TinyGo source fixture files `skills/wasm-build/examples/tinygo-minimal/go.mod`, `skills/wasm-build/examples/tinygo-minimal/main.go`, and optional `skills/wasm-build/examples/tinygo-minimal/Makefile`
- [X] T028 [US2] Rewrite `skills/wasm-build/examples/tinygo-minimal/README.md` with prerequisites, expected command, expected `app.wasm`, validation procedure, reset instructions, and no automatic TinyGo install rule
- [X] T029 [US2] Create TinyGo WASI route evidence file under `skills/wasm-build/examples/tinygo-minimal/` or `skills/wasm-build/evals/fixtures/`
- [X] T030 [US2] Run TinyGo WASI build only when TinyGo prerequisites exist or after explicit approval, then record build/validation result truthfully in the evidence file
- [X] T031 [US2] Remove generated `app.wasm`, `target/`, or temporary output from `skills/wasm-build/examples/tinygo-minimal/` unless intentionally kept as reference evidence

**Checkpoint**: User Story 2 satisfies AC-002, AC-004, AC-005 or documented
not-run status, AC-006 if build succeeds, AC-007 when missing TinyGo is
demonstrated, AC-015, and AC-016.

---

## Phase 5: User Story 3 - Prove JavaScript Component Build Route (Priority: P1)

**Goal**: Convert the JavaScript component example into a runnable minimal
build-level Component Model fixture without expanding into `wasm-component`
responsibilities.

**Independent Test**: Run the JS component fixture with `wasm-build`; verify
JavaScript and WIT/component evidence, component route selection, expected
componentization command, component artifact validation or inspection, missing
tool behavior, and generated-output cleanup.

### Tests For User Story 3

- [X] T032 [US3] Add JS component fixture completeness checks for `skills/wasm-build/examples/js-component-minimal/` in `skills/wasm-build/evals/validate.mjs`
- [X] T033 [US3] Add component/WIT detection checks for `component.json`, `wit/world.wit`, `package.json`, and `src/index.js` in `skills/wasm-build/evals/validate.mjs`
- [X] T034 [US3] Add JS component command/artifact consistency checks for `skills/wasm-build/examples/js-component-minimal/README.md`
- [X] T035 [US3] Add missing componentization tool approval-boundary eval case in `skills/wasm-build/evals/trigger-queries.json` or route evidence

### Implementation For User Story 3

- [X] T036 [US3] Add minimal JS component source/configuration files `skills/wasm-build/examples/js-component-minimal/package.json`, `skills/wasm-build/examples/js-component-minimal/component.json`, `skills/wasm-build/examples/js-component-minimal/src/index.js`, and `skills/wasm-build/examples/js-component-minimal/wit/world.wit`
- [X] T037 [US3] Rewrite `skills/wasm-build/examples/js-component-minimal/README.md` with build-level Component Model scope, prerequisites, expected command, expected component artifact, validation/inspection procedure, reset instructions, and no global install rule
- [X] T038 [US3] Create JS component route evidence file under `skills/wasm-build/examples/js-component-minimal/` or `skills/wasm-build/evals/fixtures/`
- [X] T039 [US3] Run JS component build only when prerequisites exist or after explicit approval, then record build/validation result truthfully in the evidence file
- [X] T040 [US3] Remove generated `dist/`, `node_modules/`, component artifacts, and temporary output from `skills/wasm-build/examples/js-component-minimal/` unless intentionally kept as reference evidence

**Checkpoint**: User Story 3 satisfies AC-003, AC-004, AC-005 or documented
not-run status, AC-006 if build succeeds, AC-017, AC-015, and AC-016.

---

## Phase 6: User Story 4 - Diagnose Real Wasm Artifact Structure (Priority: P2)

**Goal**: Harden safe artifact inspection so diagnosis can use real structural
facts instead of file headers only.

**Independent Test**: Run artifact inspection fixtures for valid core module,
WASI module, component artifact, invalid input, missing optional tools, timeout,
oversized output, and shell-metacharacter paths. Verify deterministic imports,
exports, memory export presence, artifact form, warnings, and no execution.

### Tests For User Story 4

- [X] T041 [US4] Add artifact structure contract tests for canonical fields in `skills/wasm-build/evals/validate.mjs`
- [X] T042 [US4] Add import/export/memory detection fixture assertions in `skills/wasm-build/evals/validate.mjs`
- [X] T043 [US4] Add artifact form classification tests for `core-module`, `component`, `unknown`, and `invalid` in `skills/wasm-build/evals/validate.mjs`
- [X] T044 [US4] Add regression tests preserving missing-tool, timeout, output-cap, path-with-spaces, shell-metacharacter, non-regular input, no-shell, and no-execution behavior in `skills/wasm-build/evals/validate.mjs`

### Implementation For User Story 4

- [X] T045 [US4] Update `skills/wasm-build/scripts/inspect-wasm-artifact.mjs` to emit `artifactForm`, `imports`, `exports`, and `memoryExportPresent`
- [X] T046 [US4] Preserve existing allowlist, `shell: false`, timeout, output cap, minimal environment, skipped-tool behavior, and no Wasm execution in `skills/wasm-build/scripts/inspect-wasm-artifact.mjs`
- [X] T047 [US4] Add or update representative artifact fixtures under `fixtures/` or `skills/wasm-build/evals/fixtures/` without requiring optional validator availability
- [X] T048 [US4] Update `skills/wasm-build/references/runtime-validation.md` with structural inspection semantics and safe degradation behavior

**Checkpoint**: User Story 4 satisfies AC-009 through AC-012.

---

## Phase 7: User Story 5 - Recover From Prerequisites And Build Failures (Priority: P2)

**Goal**: Strengthen concrete failure diagnosis and prerequisite recovery
without random command changes or automatic environment mutation.

**Independent Test**: Run diagnosis and prerequisite fixtures/evals that map
observable evidence to required failure classes and safe next actions.

### Tests For User Story 5

- [X] T049 [US5] Add failure diagnosis completeness checks for all required classes from `specs/003-wasm-build-hardening/contracts.md` in `skills/wasm-build/evals/validate.mjs`
- [X] T050 [US5] Add evidence-driven diagnosis checks requiring symptom, likely cause, evidence to inspect, safe next action, and unsafe action in `skills/wasm-build/evals/validate.mjs`
- [X] T051 [US5] Add deterministic fixture or eval cases for missing toolchain, missing target, wrong WASI preview, missing import, incorrect export, missing memory export, wasm-bindgen mismatch, Emscripten/wasi-sdk confusion, WIT/world mismatch, component validation failure, runtime incompatibility, linker failure, and target-incompatible native dependency
- [X] T052 [US5] Add prerequisite approval/resume evidence validation in `skills/wasm-build/evals/validate.mjs`

### Implementation For User Story 5

- [X] T053 [US5] Update `skills/wasm-build/references/failure-diagnosis.md` with evidence-driven entries for all required failure classes
- [X] T054 [US5] Connect diagnosis entries to concrete fixture evidence, artifact structure signals, build output patterns, or validator output in `skills/wasm-build/references/failure-diagnosis.md`
- [X] T055 [US5] Create missing-prerequisite approval/resume evidence under `skills/wasm-build/evals/fixtures/` or the relevant example route directory
- [X] T056 [US5] Update `skills/wasm-build/references/execution-intent.md` only if prerequisite approval wording needs clarification after evidence is recorded

**Checkpoint**: User Story 5 satisfies AC-007, AC-013, AC-014, AC-015, and
AC-016.

---

## Phase 8: Polish And Cross-Cutting Verification

**Purpose**: Preserve portability, release readiness, traceability, and final
freeze decision quality.

- [X] T057 [P] Validate that all evidence records conform to the Integration Evidence contract in `specs/003-wasm-build-hardening/contracts.md`
- [X] T058 [P] Validate that repository-owned eval documentation in `skills/wasm-build/evals/README.md` still says eval schemas are not universal Agent Skills contracts
- [X] T059 [P] Validate `skills/wasm-build/SKILL.md` remains compact and references detailed guidance instead of embedding route tutorials
- [X] T060 [P] Validate no new Agent Skill, `wasm-component` files, optimizer/debugger/publisher scope, package registry behavior, or automatic toolchain installation was introduced
- [X] T061 [P] Update `CHANGELOG.md` with hardening-slice summary and fixture/evidence caveats
- [X] T062 [P] Update `docs/release-checklist.md` with any new freeze-readiness checks required by real integration evidence
- [X] T063 Evaluate every acceptance criterion AC-001 through AC-024 in `specs/003-wasm-build-hardening/acceptance.md` and record pass/fail evidence in `specs/003-wasm-build-hardening/implementation-evidence.md`
- [X] T064 Run `npm run validate`
- [X] T065 Run `npm run test:install`
- [X] T066 Run `npm run test:scripts`
- [X] T067 Run `npm run test:evals`
- [X] T068 Run `git diff --check`
- [X] T069 Record the final freeze-readiness decision in `specs/003-wasm-build-hardening/implementation-evidence.md`, choosing exactly `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` or `WASM-BUILD STILL REQUIRES ANOTHER HARDENING SLICE`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; must be recorded before behavior changes.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **US1, US2, US3**: Depend on Phase 2; can proceed in parallel after shared
  fixture/evidence validation exists.
- **US4**: Depends on Phase 2; can proceed in parallel with route work once
  artifact contract tests are defined.
- **US5**: Depends on Phase 2 and benefits from route/artifact evidence from
  US1-US4.
- **Phase 8 Polish**: Depends on all desired story checkpoints.

### Story Dependencies

- **US1 Rust Browser**: First suggested MVP route because it is the current
  strongest fixture and can produce the first real build evidence.
- **US2 TinyGo WASI**: Independent of US1 after foundational validation exists.
- **US3 JavaScript Component**: Independent of US1/US2 but must stay build-level
  and avoid advanced component-skill scope.
- **US4 Artifact Structure**: Shared capability for validation and diagnosis.
- **US5 Recovery/Diagnosis**: Uses evidence from route and artifact work.

### Parallel Opportunities

- T057-T062 can run in parallel after story checkpoints complete.

## Parallel Example: Route Fixture Tests

```text
Task: T057 Validate Integration Evidence contract conformance
Task: T058 Validate repository-owned eval documentation boundary
Task: T059 Validate compact progressive-disclosure SKILL.md
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete US1 Rust Browser as the first real build route.
3. Validate US1 independently and record truthful evidence.
4. Stop if no route can produce real build + validation evidence.

### Full Hardening Slice

1. Complete MVP First.
2. Complete US2 and US3 route fixtures and evidence.
3. Complete US4 artifact structure reporting.
4. Complete US5 prerequisite/failure recovery.
5. Run all validation commands.
6. Evaluate AC-001 through AC-024.
7. Produce freeze-readiness decision.

## Notes

- Optional-tool absence is not itself a failure; lying about route proof is a
  failure.
- Do not install Rust targets, TinyGo, wasm-pack, wasm-tools, jco, wasi-sdk,
  Emscripten, or system packages during unattended tests.
- Any real environment mutation must be explicitly approved and recorded.
- Do not commit generated `target/`, `pkg/`, `dist/`, `node_modules/`, or
  temporary build output unless explicitly justified as reference evidence.
- Do not create `wasm-component` or expand into advanced WIT/component
  architecture.
