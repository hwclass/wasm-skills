# Tasks: wasm-build Route Proof

**Input**: Design documents from `specs/004-wasm-build-route-proof/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts.md`, `quickstart.md`

**Tests**: This feature is an empirical proof slice. Tasks include real route
build/validation evidence, approval-boundary evidence, generated-output checks,
and existing repository validation.

**Organization**: Tasks are grouped by user story so each route can be proven
and audited independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no
  dependency on another task.
- **[Story]**: Which user story this task belongs to.
- Include exact file paths in descriptions.

## Phase 1: Setup (Shared Evidence Baseline)

**Purpose**: Establish the route-proof evidence workspace without changing skill
scope or executing route builds.

- [X] T001 Review `specs/004-wasm-build-route-proof/spec.md`, `specs/004-wasm-build-route-proof/plan.md`, `specs/004-wasm-build-route-proof/contracts.md`, and `specs/004-wasm-build-route-proof/quickstart.md` before any route execution.
- [X] T002 Create `specs/004-wasm-build-route-proof/implementation-evidence.md` with sections required by `specs/004-wasm-build-route-proof/contracts.md`.
- [X] T003 Record the pre-route baseline status for `npm run validate`, `npm run test:install`, `npm run test:scripts`, `npm run test:evals`, and `git diff --check` in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T004 Confirm that `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`, `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`, and `skills/wasm-build/evals/fixtures/js-component-evidence.json` retain the canonical fields from `specs/004-wasm-build-route-proof/contracts.md`.

---

## Phase 2: Foundational (Shared Safety Gates)

**Purpose**: Make the approval, evidence, and cleanup checks explicit before any
route attempts.

**CRITICAL**: No route build or environment/toolchain mutation can begin until
this phase is complete.

- [X] T005 Document the exact project-local build authorization basis for this explicit BUILD request in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T006 Document the environment/toolchain approval boundary rules for Rust target installation and TinyGo installation or activation in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T007 Verify generated-output ignore coverage for `skills/wasm-build/examples/rust-browser/.gitignore`, `skills/wasm-build/examples/tinygo-minimal/.gitignore`, and `skills/wasm-build/examples/js-component-minimal/.gitignore`.
- [X] T008 Record the concrete cleanup check commands or file checks for Rust `target/`/`pkg/`, TinyGo `app.wasm`, and JavaScript component output in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T009 Verify no task or planned command adds a new skill under `.agents/skills/wasm-component/`, `skills/wasm-component/`, or any other new skill path, and record the result in `specs/004-wasm-build-route-proof/implementation-evidence.md`.

---

## Phase 3: User Story 1 - Complete Rust Browser Route (Priority: P1)

**Goal**: Convert the Rust Browser route from blocked/not-run to truthful real
build-and-validation evidence.

**Independent Test**: From `skills/wasm-build/examples/rust-browser/`, prove
the Rust Browser build produces and validates the expected browser Wasm artifact
after exact-prerequisite approval when required.

### Implementation for User Story 1

- [X] T010 [US1] Inspect the Rust toolchain state for `wasm32-unknown-unknown` and record the prerequisite state in `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`.
- [X] T011 [US1] Record the Rust prerequisite state and AC-004 evidence in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T012 [US1] If `wasm32-unknown-unknown` is missing, request explicit user approval for only `rustup target add wasm32-unknown-unknown` and record the approval status in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T013 [US1] If approval is granted, run only the approved `rustup target add wasm32-unknown-unknown` action and record the exact result in `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`.
- [X] T014 [US1] Proceed only if `wasm32-unknown-unknown` was available at T010 or T012 recorded explicit approval and T013 completed successfully; then resume the documented Rust browser build from `skills/wasm-build/examples/rust-browser/` without requesting redundant project-local build approval.
- [X] T015 [US1] If T014 proceeded, validate the produced Rust Browser Wasm artifact using the documented validation path from `skills/wasm-build/examples/rust-browser/README.md`; if T014 was blocked, do not run validation and record `validationResult: not-run` in `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`.
- [X] T016 [US1] Update `skills/wasm-build/evals/fixtures/rust-browser-evidence.json` with ordered commands, build result, validation result, artifact path, generated-output policy, and remaining gaps; if approval was denied, interrupted, or not obtained while the target was missing, record a truthful blocked/not-run Rust route result and do not mark the route proven.
- [X] T017 [US1] If T014 proceeded, remove generated Rust Browser `target/` and `pkg/` output from `skills/wasm-build/examples/rust-browser/` after evidence capture; if T014 was blocked, verify no generated Rust Browser output exists. Verified again after final cleanup remediation.
- [X] T018 [US1] Record AC-001, AC-002, AC-003, AC-004, AC-010, AC-011, and Rust route proof summary in `specs/004-wasm-build-route-proof/implementation-evidence.md`; blocked/not-run evidence may be documented but must not satisfy AC-001 through AC-003.

**Checkpoint**: Rust Browser route has either real passed build/validation
evidence or an honestly blocked approval outcome that prevents claiming route
proof.

---

## Phase 4: User Story 2 - Complete TinyGo WASI Route (Priority: P1)

**Goal**: Convert the TinyGo WASI route from blocked/not-run to truthful real
build-and-validation evidence.

**Independent Test**: From `skills/wasm-build/examples/tinygo-minimal/`, prove
TinyGo is detected from explicit TinyGo evidence and the WASI build produces and
validates `app.wasm` after exact-prerequisite approval when required.

### Implementation for User Story 2

- [X] T019 [US2] Inspect TinyGo availability and explicit TinyGo fixture evidence in `skills/wasm-build/examples/tinygo-minimal/Makefile`.
- [X] T020 [US2] Confirm plain `go.mod` is not treated as sufficient TinyGo proof and record the result in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T021 [US2] Record the TinyGo prerequisite state in `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`.
- [X] T022 [US2] If TinyGo is missing, identify the safest documented TinyGo installation or activation method for the current environment and record it in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T023 [US2] If TinyGo is missing, request explicit user approval for only the selected TinyGo prerequisite action and record the approval status in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T024 [US2] If approval is granted, run only the approved TinyGo prerequisite action and record the exact result in `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`.
- [X] T025 [US2] Proceed only if TinyGo was available at T019/T021 or T023 recorded explicit approval and T024 completed successfully; then resume the documented TinyGo WASI build from `skills/wasm-build/examples/tinygo-minimal/` without requesting redundant project-local build approval.
- [X] T026 [US2] If T025 proceeded, validate `skills/wasm-build/examples/tinygo-minimal/app.wasm` using the documented validation path from `skills/wasm-build/examples/tinygo-minimal/README.md`; if T025 was blocked, do not run validation and record `validationResult: not-run` in `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`.
- [X] T027 [US2] Update `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json` with ordered commands, build result, validation result, artifact path, generated-output policy, and remaining gaps; if approval was denied, interrupted, or not obtained while TinyGo was missing, record a truthful blocked/not-run TinyGo route result and do not mark the route proven.
- [X] T028 [US2] If T025 proceeded, remove generated TinyGo WASI `app.wasm` and temporary output from `skills/wasm-build/examples/tinygo-minimal/` after evidence capture; if T025 was blocked, verify no generated TinyGo output exists.
- [X] T029 [US2] Record AC-005, AC-006, AC-007, AC-008, AC-010, AC-011, and TinyGo route proof summary in `specs/004-wasm-build-route-proof/implementation-evidence.md`; blocked/not-run evidence may be documented but must not satisfy AC-005 through AC-007.

**Checkpoint**: TinyGo WASI route has either real passed build/validation
evidence or an honestly blocked approval outcome that prevents claiming route
proof.

---

## Phase 5: User Story 3 - Preserve JavaScript Component Regression (Priority: P2)

**Goal**: Prove the already-successful JavaScript Component route remains passing
without redesign or new skill scope.

**Independent Test**: From `skills/wasm-build/examples/js-component-minimal/`,
re-run the existing build and validation route and confirm evidence remains
truthful.

### Implementation for User Story 3

- [X] T030 [US3] Re-run the documented JavaScript Component build from `skills/wasm-build/examples/js-component-minimal/`.
- [X] T031 [US3] Validate the produced JavaScript Component artifact using the documented validation path from `skills/wasm-build/examples/js-component-minimal/README.md`.
- [X] T032 [US3] Update `skills/wasm-build/evals/fixtures/js-component-evidence.json` with ordered commands, build result, validation result, artifact path, generated-output policy, and remaining gaps.
- [X] T033 [US3] Remove generated JavaScript Component output from `skills/wasm-build/examples/js-component-minimal/` after evidence capture.
- [X] T034 [US3] Record AC-009, AC-011, AC-013, and JavaScript regression summary in `specs/004-wasm-build-route-proof/implementation-evidence.md`.

**Checkpoint**: JavaScript Component route remains a regression proof only and
does not introduce `wasm-component` or unrelated capability.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Prove traceability, command health, generated-output absence, and
the final route-proof decision.

- [X] T035 Validate every `AC-001` through `AC-014` has corresponding evidence in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T036 Validate every `FR-001` through `FR-022` maps to at least one completed task in `specs/004-wasm-build-route-proof/tasks.md`.
- [X] T037 Validate route evidence in `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`, `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`, and `skills/wasm-build/evals/fixtures/js-component-evidence.json` follows `specs/004-wasm-build-route-proof/contracts.md`.
- [X] T038 Verify generated Rust, TinyGo, and JavaScript route outputs are absent from `skills/wasm-build/examples/rust-browser/`, `skills/wasm-build/examples/tinygo-minimal/`, and `skills/wasm-build/examples/js-component-minimal/` after final cleanup remediation.
- [X] T039 Run `npm run validate` for AC-012 and record the fresh post-cleanup result in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T040 Run `npm run test:install`, `npm run test:scripts`, and `npm run test:evals` for AC-012 and record the results in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T041 Run `git diff --check` and record the result in `specs/004-wasm-build-route-proof/implementation-evidence.md`.
- [X] T042 Write exactly one final route-proof decision for AC-014 in `specs/004-wasm-build-route-proof/implementation-evidence.md`: `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` only if Rust Browser and TinyGo WASI both have real successful build and validation evidence, JavaScript Component regression remains passing, generated route output is absent, and final validation passes; otherwise write `WASM-BUILD STILL LACKS REAL ROUTE PROOF`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks route
  attempts.
- **Rust Browser (Phase 3)**: Depends on Foundational.
- **TinyGo WASI (Phase 4)**: Depends on Foundational and may run after Rust
  evidence setup, but approval/toolchain actions must remain route-specific.
- **JavaScript Component Regression (Phase 5)**: Depends on Foundational and can
  run independently of Rust/TinyGo environment mutations.
- **Polish (Phase 6)**: Depends on desired route phases.

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational.
- **User Story 2 (P1)**: Independent after Foundational.
- **User Story 3 (P2)**: Independent regression after Foundational.

### Approval Dependencies

- T013 depends on explicit approval recorded by T012 when the Rust target is
  missing.
- T014 through T018 may continue as Rust proof work only if
  `wasm32-unknown-unknown` was already available at T010 or T012 recorded
  explicit approval and T013 completed the approved prerequisite action
  successfully.
- If Rust approval is denied, interrupted, or not obtained while the target is
  missing, do not execute T014 through T017 as build/validation work; complete
  only the evidence/reporting portions needed to record a truthful
  blocked/not-run Rust result, and do not mark the Rust route as proven.
- T024 depends on explicit approval recorded by T023 when TinyGo is missing.
- T025 through T029 may continue as TinyGo proof work only if TinyGo was already
  available at T019/T021 or T023 recorded explicit approval and T024 completed
  the approved prerequisite action successfully.
- If TinyGo approval is denied, interrupted, or not obtained while TinyGo is
  missing, do not execute T025 through T028 as build/validation work; complete
  only the evidence/reporting portions needed to record a truthful
  blocked/not-run TinyGo result, and do not mark the TinyGo route as proven.

## Parallel Execution Examples

No route mutation task is marked `[P]` because this proof slice updates shared
evidence files and may touch shared toolchain state. The safest parallelism is
read-only review before execution, such as one agent reviewing
`skills/wasm-build/examples/rust-browser/README.md` while another reviews
`skills/wasm-build/examples/js-component-minimal/README.md`, with final evidence
updates serialized.

## Implementation Strategy

### MVP First

Complete Phase 1, Phase 2, and User Story 1 to prove or honestly block the Rust
Browser route.

### Incremental Delivery

1. Complete Rust Browser route proof.
2. Complete TinyGo WASI route proof.
3. Re-run JavaScript Component regression.
4. Run cross-cutting validation and write the final decision.

### Scope Guardrails

- Do not create a new Agent Skill.
- Do not redesign examples, artifact inspection, failure diagnosis, installer
  behavior, or eval architecture.
- Do not install toolchains without explicit current approval.
- Do not claim route proof from JSON/static evals alone.
- Do not commit generated build output.
