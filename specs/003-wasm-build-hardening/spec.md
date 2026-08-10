# Feature Specification: wasm-build Hardening

**Feature Branch**: `003-wasm-build-hardening`

**Created**: 2026-08-09

**Status**: Draft

**Input**: User description: "Create a new feature specification for hardening
the existing `wasm-build` Agent Skill before development begins on any new
WebAssembly skill."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prove Rust Browser Build Route (Priority: P1)

As a developer using a coding agent with `wasm-build` installed, I want the agent
to inspect, build, validate, and diagnose a minimal Rust browser WebAssembly
project so that I know the skill works on an actual browser Wasm toolchain.

**Why this priority**: Rust browser Wasm is the current strongest documented
route and already has a manual before/after fixture shape. Proving it first gives
the hardening slice a real build baseline while preserving the general skill
scope.

**Independent Test**: Run the Rust browser integration fixture from its
documented starting state with `wasm-build` installed. Verify that the agent
produces a Wasm Build Plan, performs only authorized project-local changes,
builds when prerequisites are present or requests approval for missing
environment prerequisites, validates the generated artifact, and records the
outcome.

**Acceptance Scenarios**:

1. **Given** the Rust browser fixture starts from its committed baseline, **When**
   the user explicitly requests a full browser Wasm build, **Then** the agent
   detects Rust, selects browser WebAssembly, identifies the expected
   wasm-bindgen/wasm-pack route, shows the Wasm Build Plan before mutation, runs
   the build without redundant project-local approval when prerequisites exist,
   validates the generated artifact, and reports files changed plus evidence.
2. **Given** the Rust browser route lacks a required environment prerequisite,
   **When** the user explicitly requests the build, **Then** the agent identifies
   the exact missing prerequisite, does not install it automatically, asks for
   explicit approval, and resumes the original build and validation workflow only
   after approval.

---

### User Story 2 - Prove TinyGo WASI Build Route (Priority: P1)

As a developer, I want `wasm-build` to correctly detect TinyGo and produce or
build a WASI-targeted artifact so that TinyGo is proven as a real supported path
rather than only a documented recipe.

**Why this priority**: TinyGo / Go is a Tier 1 language family in `wasm-build`.
It exercises different detection evidence, toolchain assumptions, and WASI
target behavior than the Rust browser route.

**Independent Test**: Run the TinyGo WASI integration fixture. Verify TinyGo is
detected from explicit TinyGo evidence rather than plain Go, the WASI target is
selected, the build path and expected artifact are correct, and missing TinyGo
or target support produces safe prerequisite reporting.

**Acceptance Scenarios**:

1. **Given** a minimal TinyGo WASI source fixture with explicit TinyGo build
   evidence, **When** the user asks the agent to build and validate it, **Then**
   the agent selects the TinyGo WASI path, runs the build when tooling exists,
   validates the resulting artifact, and records the outcome.
2. **Given** TinyGo or required target support is unavailable, **When** the user
   requests the build, **Then** the agent reports the missing prerequisite,
   avoids automatic TinyGo installation, and provides a safe continuation path.

---

### User Story 3 - Prove JavaScript Component Build Route (Priority: P1)

As a JavaScript developer, I want `wasm-build` to guide and execute a minimal
JavaScript-to-Component-Model workflow so that Component Model support is proven
through the general build skill.

**Why this priority**: JavaScript componentization covers a different language,
artifact model, and validation path. It proves build-level Component Model
support without starting the future `wasm-component` skill.

**Independent Test**: Run the JavaScript Component Model fixture. Verify
JavaScript detection, Component Model selection, required interface inputs,
componentization tooling selection, artifact generation when prerequisites
exist, component validation/inspection, and no global package or tool
installation without approval.

**Acceptance Scenarios**:

1. **Given** a minimal JavaScript component fixture with source, configuration,
   and WIT/interface inputs, **When** the user asks for a complete build and
   validation, **Then** the agent selects a componentization path, builds when
   prerequisites exist, validates or inspects the component artifact, and records
   build evidence.
2. **Given** componentization tooling is missing, **When** the user requests the
   build, **Then** the agent reports the missing tool, does not install global
   packages automatically, and asks before any environment-level change.

---

### User Story 4 - Diagnose Real Wasm Artifact Structure (Priority: P2)

As a developer with an existing `.wasm` artifact, I want `wasm-build` to inspect
its actual structure so that build failures can be diagnosed from imports,
exports, memory shape, and artifact model rather than only file headers.

**Why this priority**: Artifact validation is already safe, but structural
diagnosis is too shallow to support several promised failure classes. Improving
this strengthens all build routes without turning the skill into a runtime.

**Independent Test**: Validate representative artifacts or fixtures for core
module, WASI module, Component Model artifact, invalid/corrupted input, and
unknown artifact. Confirm deterministic reports include imports, exports, memory
export presence, likely artifact form when detectable, validator status, and
warnings without executing the artifact.

**Acceptance Scenarios**:

1. **Given** an existing valid Wasm artifact and available safe inspection tools,
   **When** the user asks for validation, **Then** the artifact report includes
   structural facts such as imports, exports, memory export presence, likely
   artifact form when detectable, and validation results.
2. **Given** optional validators are unavailable or the artifact is invalid,
   **When** the user asks for validation, **Then** inspection degrades
   gracefully, reports actionable warnings, and never executes the artifact.

---

### User Story 5 - Recover From Prerequisites And Build Failures (Priority: P2)

As a developer asking the skill to build or repair a project, I want missing
prerequisites and build failures to produce a safe continuation path rather than
random command changes.

**Why this priority**: The core promise of `wasm-build` is decision-oriented
build guidance. Real prerequisite and failure recovery evidence is required
before freezing the skill.

**Independent Test**: Run at least one missing-prerequisite workflow and at least
one real failure-diagnosis workflow from a fixture or recorded integration run.
Verify the agent identifies evidence, requests approval before environment
mutation, resumes the original build after approval, validates when possible, and
documents the final result.

**Acceptance Scenarios**:

1. **Given** a user explicitly requests a build and a required environment
   prerequisite is missing, **When** the agent inspects the project, **Then** it
   identifies the exact prerequisite, does not mutate the environment, asks for
   explicit approval, applies only the approved change after approval, resumes
   the original build, and validates the artifact.
2. **Given** a build or validation failure occurs, **When** the agent diagnoses
   it, **Then** the diagnosis maps observable evidence to a failure class, names
   a safe next action, and avoids random changes to commands, flags,
   dependencies, target triples, or runtime configuration.

### Edge Cases

- Required external toolchain is missing, including Rust targets, TinyGo,
  componentization tooling, validators, or SDKs.
- Required external toolchain is present but too old or incompatible for the
  fixture route.
- Repository evidence points to multiple possible Wasm environments, runtimes,
  artifact models, or build commands.
- A fixture has multiple Wasm artifacts or stale generated output from a prior
  run.
- Artifact validators are unavailable, time out, produce oversized output, or
  disagree about artifact validity.
- Artifacts contain imports/exports that suggest a different target than the
  selected build route.
- Generated outputs such as `target/`, `pkg/`, `dist/`, `node_modules/`, or
  temporary build directories appear after a run.
- A build request is explicit enough to authorize project-local build execution
  but not environment/toolchain mutation.
- A repair request authorizes project-local changes but not global tool or
  system package installation.
- A JavaScript Component Model fixture risks expanding into deep WIT/interface
  architecture beyond build-level proof.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The feature MUST harden the existing `wasm-build` Agent Skill only;
  it MUST NOT create a new Agent Skill or begin `wasm-component`.
- **FR-002**: The feature MUST provide runnable minimal source fixtures for Rust
  browser Wasm, TinyGo WASI, and JavaScript Component Model routes.
- **FR-003**: Each integration fixture MUST include source files, relevant
  manifests or configuration, README guidance, prerequisites, expected build
  command, expected artifact, validation procedure, and reset instructions.
- **FR-004**: Generated outputs such as `target/`, `pkg/`, `dist/`,
  `node_modules/`, and temporary build directories MUST NOT be committed unless
  explicitly justified as reference evidence.
- **FR-005**: At least one route MUST complete an actual build and artifact
  validation during feature verification.
- **FR-006**: The feature MUST distinguish static/schema validation,
  repository-owned eval cases, runnable source fixtures, actual build execution
  evidence, and manual missing-prerequisite/approval evidence.
- **FR-007**: The Rust browser route MUST verify Rust detection, browser
  environment selection, browser Wasm artifact expectations, wasm-bindgen or
  wasm-pack path selection, explicit-build execution behavior, artifact
  validation, and missing prerequisite handling.
- **FR-008**: The TinyGo WASI route MUST verify TinyGo detection distinct from
  ordinary Go, WASI target selection, correct TinyGo build path, artifact
  validation, and safe missing-prerequisite reporting.
- **FR-009**: The JavaScript Component Model route MUST verify JavaScript
  detection, Component Model selection, required interface inputs, component
  artifact generation when prerequisites exist, and component inspection or
  validation.
- **FR-010**: JavaScript Component Model coverage MUST remain build-level proof
  and MUST NOT expand into deep WIT design, component composition architecture,
  canonical ABI design, adapter architecture, or advanced linking workflows.
- **FR-011**: Artifact inspection MUST preserve command allowlisting, no shell
  interpolation, no arbitrary command execution, no Wasm execution in inspection
  mode, graceful missing-tool behavior, deterministic output, and stable result
  semantics.
- **FR-012**: Artifact inspection MUST report imports, exports, memory export
  presence, and likely core-module versus Component Model artifact form when
  detectable by available safe inspection.
- **FR-013**: Failure diagnosis MUST contain evidence-driven guidance for
  missing toolchain, missing target, wrong WASI preview, missing imports,
  incorrect exports, missing memory export where relevant, wasm-bindgen
  compatibility problems, Emscripten versus wasi-sdk confusion, WIT/world
  mismatch, component validation failure, runtime incompatibility, linker
  failures, and target-incompatible native dependencies.
- **FR-014**: Each diagnosis entry strengthened by this feature MUST define
  symptom, likely cause, evidence to inspect, safe next action, and
  unsafe/random action to avoid.
- **FR-015**: Explicit build requests MUST NOT require redundant approval for the
  requested project-local build and validation commands after inspection and
  planning.
- **FR-016**: Environment or toolchain mutations MUST require explicit approval
  and MUST NOT occur automatically.
- **FR-017**: Repository-owned evals MAY be extended for fixture completeness,
  metadata consistency, target routing, prerequisite approval boundaries,
  artifact structural inspection, and failure classification, but MUST NOT be
  presented as a universal Agent Skills schema.
- **FR-018**: The feature MUST preserve existing Agent Skills portability,
  progressive-disclosure layout, installation behavior, uninstall behavior, and
  distribution readiness.
- **FR-019**: The feature MUST provide enough real integration evidence for a
  freeze decision between freezing `wasm-build` and doing another hardening
  slice.

### Constitution Alignment *(mandatory)*

- **Skill Scope**: This feature changes only the existing `wasm-build` skill and
  its proof artifacts. It strengthens repeatable WebAssembly build workflows for
  coding agents before any new specialized skill begins.
- **Progressive Disclosure**: `SKILL.md` remains compact. Detailed route
  evidence belongs in examples, references, scripts, assets, and repository-owned
  evals rather than in a giant tutorial.
- **Plan Before Mutation**: Every build or repair flow still requires inspection
  and a Wasm Build Plan before project-local mutation or command execution.
  Explicit current build/repair requests authorize only the requested
  project-local action, not environment mutation.
- **Detect/Diagnose/Validate**: The hardening slice exists to prove real
  detection, build execution, artifact validation, structural inspection,
  evidence-driven failure diagnosis, and safe continuation behavior.
- **Installation Safety**: Existing project/global install, uninstall,
  `--force`, destination reporting, non-root behavior, and generated
  `.agents/skills/wasm-build/` handling must remain intact.
- **Non-Goals Preserved**: New skills, runtime infrastructure, package managers,
  hosted registries, MCP servers, GUI surfaces, automatic toolchain
  installation, optimization systems, debugging systems, package publication,
  full Windows parity, and full language/environment Cartesian coverage remain
  out of scope.

### Key Entities *(include if feature involves data/contracts)*

- **IntegrationRoute**: A representative real build route with source language,
  target environment, artifact type, expected toolchain family, expected
  artifact, validation path, prerequisite behavior, and evidence status.
- **RunnableFixture**: Minimal source project used to exercise an integration
  route, including source files, manifests/configuration, README, expected
  commands, validation procedure, and reset rules.
- **BuildEvidence**: Verifiable record that a route was attempted or completed,
  including plan summary, command authorization basis, prerequisite state, build
  result, validation result, generated artifacts, and remaining gaps.
- **PrerequisiteDecision**: Record of missing environment or toolchain
  prerequisites, why they are needed, whether approval was requested or granted,
  and whether the original workflow resumed.
- **ArtifactStructureReport**: Safe deterministic artifact inspection result
  including validation status, imports, exports, memory export presence, likely
  artifact form, warnings, and skipped-tool information.
- **FailureDiagnosisRule**: Evidence-driven mapping from observed symptom and
  inspected evidence to likely cause, safe next action, and unsafe/random action
  to avoid.
- **FreezeDecision**: Final feature outcome choosing whether `wasm-build` is
  ready to freeze or needs another hardening slice, based on real integration
  evidence rather than JSON evals alone.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the three required routes have runnable minimal source
  fixtures with README, prerequisites, expected build command, expected artifact,
  validation procedure, and reset instructions.
- **SC-002**: At least one required route completes an actual build and produces
  verifiable build evidence.
- **SC-003**: At least one generated Wasm artifact is validated successfully by
  the feature's verification process.
- **SC-004**: At least one missing-prerequisite approval/resume workflow is
  demonstrated without automatic environment mutation.
- **SC-005**: Artifact inspection reports non-empty imports or exports for at
  least one representative artifact when safe inspection tooling or fixture data
  supports it.
- **SC-006**: Artifact inspection classifies or reports likely core-module versus
  Component Model artifact form when detectable, and reports unknown form without
  guessing when not detectable.
- **SC-007**: 100% of required failure-diagnosis classes include symptom, likely
  cause, evidence to inspect, safe next action, and unsafe/random action to
  avoid.
- **SC-008**: 100% of explicit-build integration prompts avoid redundant approval
  for the requested project-local build while preserving approval for
  environment/toolchain mutation.
- **SC-009**: 100% of inspection-mode artifact validation paths avoid Wasm
  execution and arbitrary command execution.
- **SC-010**: Repository validation commands `npm run validate`,
  `npm run test:install`, `npm run test:scripts`, `npm run test:evals`, and
  `git diff --check` pass before the feature is considered complete.
- **SC-011**: Final release-readiness review produces one documented decision:
  freeze `wasm-build` and start the next specialized skill, or perform another
  `wasm-build` hardening slice.

## Assumptions

- Coding agents remain the primary users of `wasm-build`; maintainers use the
  fixtures and evidence to decide whether the skill can be frozen.
- External toolchains may or may not be installed in a contributor's local
  environment. Missing tools are acceptable only when the fixture, prerequisite
  detection, and approval behavior are verified and documented.
- At least one route must be buildable in the verification environment or a
  comparable maintained environment before freeze.
- Repository-owned eval schemas may change to support this feature, but they do
  not become part of the universal Agent Skills directory contract.
- The JavaScript Component Model route proves build-level support only; deeper
  component design belongs to a future specialized skill.
- Windows parity is not required for this hardening slice.
