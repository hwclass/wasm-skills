# Feature Specification: wasm-build Route Proof

**Feature Branch**: `004-wasm-build-route-proof`

**Created**: 2026-08-10

**Status**: Draft

**Input**: User description: "Create a new feature specification named
004-wasm-build-route-proof. This feature is the final empirical proof slice for
the existing wasm-build Agent Skill. Do not create a new Agent Skill. Convert the
truthful blocked Rust Browser and TinyGo WASI routes from feature
003-wasm-build-hardening into real executed build-and-validation evidence while
preserving the already-proven JavaScript Component Model route as regression
coverage only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Rust Browser Route (Priority: P1)

As a user explicitly asking `wasm-build` to build a Rust project for the
browser, I want the skill to detect the missing `wasm32-unknown-unknown`
prerequisite, ask before modifying the Rust toolchain, resume the requested
build after approval, validate the artifact, record truthful evidence, and clean
generated output afterward.

**Why this priority**: Rust to browser Wasm is a representative first-class
route for `wasm-build` and remained intentionally blocked in the prior hardening
slice because the local Rust target was absent. Proving it closes a known
empirical evidence gap without changing skill scope.

**Independent Test**: From the Rust browser fixture, run the documented
`wasm-build` route with the `wasm32-unknown-unknown` target initially absent or
with absence reproduced in a controlled toolchain state. Verify exact
prerequisite detection, explicit approval before target installation, approved
installation of only the missing target, automatic resume of the original build,
successful artifact validation, evidence updates, and removal of generated
outputs before commit.

**Acceptance Scenarios**:

1. **Given** the Rust browser fixture and a missing `wasm32-unknown-unknown`
   target, **When** the user explicitly requests the Rust browser build and
   approves the prerequisite change, **Then** `wasm-build` identifies the exact
   missing target, installs only that approved target, resumes the original
   build without a redundant project-local approval prompt, produces the
   expected browser Wasm artifact, validates it, records the approval, commands,
   artifact path, build result, and validation result, and leaves no generated
   build output committed.
2. **Given** the Rust browser prerequisite change is not approved, **When** the
   user requests the build, **Then** `wasm-build` records a blocked/not-run route
   outcome, performs no environment mutation, and does not claim the Rust route
   is proven.
3. **Given** the Rust browser target is already installed before the route is
   run, **When** the user explicitly requests the build, **Then** `wasm-build`
   records that no prerequisite installation approval was needed, runs the
   documented project-local build and validation, and does not ask for redundant
   approval for the already-requested build.

---

### User Story 2 - Complete TinyGo WASI Route (Priority: P1)

As a user explicitly asking `wasm-build` to build a TinyGo project for WASI, I
want the skill to detect whether TinyGo exists, request approval before any
external toolchain installation or modification, resume the requested build
after approval when needed, generate the expected WASI artifact, validate it,
record truthful evidence, and clean generated output afterward.

**Why this priority**: TinyGo to WASI is the second known blocked representative
route from the prior slice. Proving it demonstrates that `wasm-build` handles a
non-Rust language/toolchain path with safe prerequisite boundaries and real
artifact evidence.

**Independent Test**: From the TinyGo WASI fixture, run the documented
`wasm-build` route with TinyGo absent or with absence reproduced in a controlled
environment. Verify TinyGo-specific detection rather than plain Go inference,
exact prerequisite reporting, explicit approval before any toolchain
installation or modification, approved installation or activation of only the
needed prerequisite by the safest documented method available for the current
environment, automatic resume of the original build, artifact validation,
evidence updates, and removal of generated outputs before commit.

**Acceptance Scenarios**:

1. **Given** the TinyGo WASI fixture and TinyGo unavailable, **When** the user
   explicitly requests the TinyGo WASI build and approves the prerequisite
   change, **Then** `wasm-build` identifies TinyGo as the exact missing
   prerequisite, installs or activates only the approved prerequisite using the
   safest documented method available for the current environment, resumes the
   original build without a redundant project-local approval prompt, produces
   the expected WASI Wasm artifact, validates it, records the approval,
   commands, artifact path, build result, and validation result, and leaves no
   generated build output committed.
2. **Given** TinyGo installation or activation is not approved, **When** the
   user requests the build, **Then** `wasm-build` records a blocked/not-run route
   outcome, performs no environment mutation, and does not claim the TinyGo route
   is proven.
3. **Given** TinyGo is already available before the route is run, **When** the
   user explicitly requests the build, **Then** `wasm-build` records that no
   prerequisite installation approval was needed, detects TinyGo from explicit
   TinyGo build evidence, runs the documented project-local build and
   validation, and does not treat a plain `go.mod` as sufficient TinyGo proof.

---

### User Story 3 - Preserve JavaScript Component Regression (Priority: P2)

As a maintainer of the existing `wasm-build` Agent Skill, I want the already
proven JavaScript to WebAssembly Component Model route to remain passing as
regression evidence so that the final proof slice does not break the prior
successful route while completing the blocked ones.

**Why this priority**: The JavaScript Component Model route already has real
successful build and validation evidence. This feature should preserve that
evidence as a regression guard, not redesign the route or expand into a new
component-specialized skill.

**Independent Test**: Re-run the existing JavaScript Component Model fixture and
validation workflow from the prior hardening slice. Verify the build and
validation remain passing, the artifact evidence remains truthful, and no
advanced `wasm-component` scope or unrelated build capability is introduced.

**Acceptance Scenarios**:

1. **Given** the existing JavaScript Component Model fixture, **When** the
   regression route is run during final proof, **Then** it completes the same
   documented build and validation path, records passing evidence, and removes
   generated output before commit.
2. **Given** a proposed change would redesign the JavaScript route, add a new
   `wasm-component` skill, or introduce advanced component architecture, **When**
   the feature is reviewed, **Then** the change is rejected as out of scope for
   this execution-proof slice.

### Edge Cases

- A prerequisite is already present, so the route must record that no
  environment mutation was needed rather than fabricating an approval event.
- A prerequisite is missing and approval is denied, unavailable, or interrupted,
  so the route must remain honestly blocked and unproven.
- The Rust target installation command would modify more than the single
  approved `wasm32-unknown-unknown` target.
- TinyGo has multiple documented installation methods for the environment; the
  chosen method must be justified as the safest documented method available and
  approved before use.
- TinyGo evidence is ambiguous because a fixture contains `go.mod` but no
  explicit TinyGo build evidence.
- A build succeeds but artifact validation fails, times out, or cannot run
  because an optional validator is missing.
- Generated outputs such as Rust `target/`, browser package output,
  `app.wasm`, JavaScript component artifacts, or temporary build directories
  remain after evidence capture.
- Evidence claims success based only on JSON/static evals instead of actual
  build and artifact validation commands.
- Approval for an environment/toolchain change is confused with approval for
  the already-requested project-local build.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The feature MUST harden only the existing `wasm-build` Agent Skill
  and MUST NOT create a new Agent Skill, including `wasm-component`.
- **FR-002**: The feature MUST update the existing route evidence and
  implementation evidence from `003-wasm-build-hardening` rather than inventing
  a new evidence system.
- **FR-003**: The Rust Browser route MUST complete a real documented browser
  Wasm build from the existing Rust browser fixture.
- **FR-004**: The Rust Browser route MUST produce the expected browser Wasm
  artifact and record its normalized artifact path.
- **FR-005**: The Rust Browser route MUST validate the produced Wasm artifact
  with the documented validation path and record the validation result.
- **FR-006**: The Rust Browser route MUST demonstrate missing
  `wasm32-unknown-unknown` detection and approval/resume behavior when that
  prerequisite is initially absent.
- **FR-007**: The Rust Browser prerequisite workflow MUST install only the
  approved `wasm32-unknown-unknown` target and MUST NOT require redundant
  approval for the already-requested project-local build.
- **FR-008**: The TinyGo WASI route MUST detect TinyGo availability from
  explicit TinyGo evidence and MUST NOT treat a plain `go.mod` as sufficient
  TinyGo proof.
- **FR-009**: The TinyGo WASI route MUST complete a real documented WASI build
  from the existing TinyGo fixture.
- **FR-010**: The TinyGo WASI route MUST produce the expected WASI Wasm artifact
  and record its normalized artifact path.
- **FR-011**: The TinyGo WASI route MUST validate the produced Wasm artifact
  with the documented validation path and record the validation result.
- **FR-012**: The TinyGo WASI route MUST demonstrate explicit approval/resume
  behavior before installing or modifying TinyGo when TinyGo is initially
  unavailable.
- **FR-013**: The TinyGo prerequisite workflow MUST use only the approved
  prerequisite installation or activation step and MUST NOT silently install
  TinyGo.
- **FR-014**: The JavaScript Component Model route MUST remain passing as
  regression build and validation evidence and MUST NOT be redesigned by this
  feature.
- **FR-015**: The feature MUST record actual commands, prerequisite approvals,
  build results, artifact paths, validation commands, validation results, cleanup
  results, and any blocked/not-run route states in existing evidence artifacts.
- **FR-016**: JSON eval success, static schema checks, or documentation review
  MUST NOT be treated as equivalent to real build-and-validation evidence.
- **FR-017**: No environment or toolchain mutation MUST occur without explicit
  current user approval.
- **FR-018**: Explicit project-local BUILD requests MUST NOT require redundant
  approval after inspection/planning for the requested build and validation
  commands.
- **FR-019**: Generated build output from Rust Browser, TinyGo WASI, and
  JavaScript Component Model route proof MUST NOT be committed.
- **FR-020**: Existing `wasm-build` repository validation, install, script, and
  eval checks MUST remain passing after route proof evidence is updated.
- **FR-021**: The feature MUST NOT add new languages, new environments,
  optimizer/debugger/publisher behavior, Windows parity, installer redesign,
  artifact-inspector redesign, failure-diagnosis redesign, arbitrary command
  execution, automatic unapproved toolchain installation, or a new eval
  architecture.
- **FR-022**: The completed evidence MUST end with exactly one final decision:
  `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` or
  `WASM-BUILD STILL LACKS REAL ROUTE PROOF`.

### Constitution Alignment *(mandatory)*

- **Skill Scope**: This feature changes only evidence and narrowly necessary
  route-proof behavior for the existing `wasm-build` Agent Skill. It improves
  repeatable WebAssembly coding-agent workflows by proving representative Rust
  Browser, TinyGo WASI, and JavaScript Component Model routes with real build
  and validation evidence.
- **Progressive Disclosure**: The feature must keep `SKILL.md` compact. Route
  proof belongs in existing examples, eval fixtures, and evidence files; detailed
  instructions remain in references, examples, scripts, and evals as already
  structured.
- **Plan Before Mutation**: Project-local build execution is allowed only for an
  explicit BUILD request after inspection/planning. Environment or toolchain
  changes, including Rust target installation and TinyGo installation or
  activation, require explicit approval before mutation.
- **Detect/Diagnose/Validate**: The feature must record repository evidence,
  actual build commands, artifact paths, validation commands, validator results,
  blocked states, and cleanup outcomes. Static evals may support confidence but
  cannot replace real build-and-validation proof.
- **Installation Safety**: Installer behavior is not changed. No root
  requirement, installer redesign, product-skill installation behavior, or
  package-runner distribution behavior is in scope.
- **Non-Goals Preserved**: This feature does not add a new skill, runtime
  infrastructure, package manager behavior, hosted services, MCP servers, GUI
  surfaces, automatic unapproved toolchain installation, arbitrary command
  execution, Windows parity, optimizer/debugger/publisher scope, or a broad
  language/environment matrix.

### Key Entities *(include if feature involves data/contracts)*

- **RouteProofRun**: A recorded proof attempt for one representative route,
  including route name, fixture path, prerequisite state, approval state, build
  command, build result, artifact path, validation command, validation result,
  cleanup result, and evidence timestamp.
- **PrerequisiteApproval**: A record of an environment/toolchain mutation
  boundary, including the exact missing prerequisite, requested action, approval
  decision, approved command or method, denied/interrupted state when relevant,
  and resume status.
- **BuildEvidence**: The existing evidence record for an actual or blocked route
  build, including `passed`, `failed`, or `not-run` build result semantics and
  enough command/artifact detail to distinguish real execution from static eval
  success.
- **ValidationEvidence**: The existing evidence record for artifact validation,
  including validation command, validator availability, validation result,
  artifact path, and failure or skip reason when validation does not pass.
- **FinalRouteProofDecision**: The final freeze-readiness decision that must use
  exactly one of the two specified decision strings and must be justified by the
  recorded route evidence.

## Acceptance Criteria

- **AC-001**: Rust Browser completes a real build.
- **AC-002**: Rust Browser produces the expected Wasm artifact.
- **AC-003**: Rust Browser artifact validation passes.
- **AC-004**: The missing Rust target approval/resume workflow is demonstrated
  when the target was initially unavailable.
- **AC-005**: TinyGo WASI completes a real build.
- **AC-006**: TinyGo WASI produces the expected Wasm artifact.
- **AC-007**: TinyGo WASI artifact validation passes.
- **AC-008**: The TinyGo prerequisite approval/resume workflow is demonstrated
  if TinyGo was initially unavailable.
- **AC-009**: JavaScript Component build and validation regression remains
  passing.
- **AC-010**: No environment/toolchain mutation occurs without explicit
  approval.
- **AC-011**: Generated build output is not committed.
- **AC-012**: Existing `wasm-build` tests remain green.
- **AC-013**: No new skill or unrelated build capability is added.
- **AC-014**: The final evidence artifact contains exactly one route-proof
  decision. `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` is allowed
  only if Rust Browser has real successful build and validation evidence,
  TinyGo WASI has real successful build and validation evidence, and JavaScript
  Component regression remains passing; otherwise the decision must be
  `WASM-BUILD STILL LACKS REAL ROUTE PROOF`.

Traceability: `FR-022` maps explicitly to `AC-014`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Rust Browser evidence shows `buildResult: passed`,
  `validationResult: passed`, a concrete produced artifact path, the exact
  `wasm32-unknown-unknown` prerequisite workflow when applicable, and successful
  cleanup of generated output.
- **SC-002**: TinyGo WASI evidence shows `buildResult: passed`,
  `validationResult: passed`, a concrete produced artifact path, explicit TinyGo
  prerequisite approval/resume workflow when applicable, and successful cleanup
  of generated output.
- **SC-003**: JavaScript Component Model regression evidence remains
  `buildResult: passed` and `validationResult: passed` without route redesign or
  new specialized skill scope.
- **SC-004**: 100% of environment/toolchain mutations performed during the proof
  have explicit current approval records naming the exact approved prerequisite
  action.
- **SC-005**: 0 generated route outputs are present in the committed repository
  after the proof slice.
- **SC-006**: Existing repository validation commands for `wasm-build`,
  including validation, install, script, and eval checks, pass after evidence is
  updated.
- **SC-007**: The final evidence ends with exactly one allowed decision:
  `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` or
  `WASM-BUILD STILL LACKS REAL ROUTE PROOF`.

## Assumptions

- The maintainer can grant or deny explicit approval for environment/toolchain
  changes during implementation of this proof slice.
- The implementation environment may initially lack the Rust target and TinyGo;
  if either prerequisite is already present, evidence must state that no
  prerequisite installation was needed.
- The existing JavaScript Component Model fixture and evidence from
  `003-wasm-build-hardening` are the baseline regression route.
- If approval is denied, unavailable, or interrupted for a missing prerequisite,
  the affected route remains honestly blocked and the feature cannot claim final
  route proof.
- Existing artifact inspection and failure-diagnosis behavior remain in force
  unless a narrowly necessary route-proof correction is specified later during
  planning.
