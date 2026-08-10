# Data Model: wasm-build Hardening

## IntegrationRoute

**Purpose**: Represents a real build route that `wasm-build` must prove.

**Fields**:
- `id`: Stable route identifier, e.g. `rust-browser`, `tinygo-wasi`,
  `js-component`.
- `language`: Source language or language family.
- `environment`: Intended execution environment or host/interface category.
- `artifactType`: Expected artifact model.
- `toolchainFamily`: Expected toolchain family.
- `fixturePath`: Project-relative path to the runnable fixture.
- `expectedBuildCommand`: Documented build command or command family.
- `expectedArtifact`: Project-relative expected artifact path or pattern.
- `validationProcedure`: Static and optional runtime validation path.
- `evidenceStatus`: `not-run`, `passed`, `failed`, `blocked-missing-prereq`.

**Validation rules**:
- Route IDs are stable, lowercase, and unique.
- Required routes are exactly Rust browser, TinyGo WASI, and JavaScript
  Component Model for this feature.
- A route cannot be marked `passed` without build and validation evidence.
- `evidenceStatus` is route-level metadata. It is distinct from
  `BuildEvidence.buildResult` and may describe planning states such as a route
  being blocked by a missing prerequisite.

## RunnableFixture

**Purpose**: Minimal source project that exercises one integration route.

**Fields**:
- `path`: Project-relative fixture root.
- `sourceFiles`: Sorted list of meaningful source files.
- `manifests`: Sorted list of manifest/configuration files.
- `readme`: Fixture README path.
- `prerequisites`: Toolchains/validators required or optional for the route.
- `resetInstructions`: How to remove generated output and rerun.
- `generatedOutputsIgnored`: List of ignored generated directories or files.

**Validation rules**:
- Must include actual source/configuration files, not README-only recipes.
- Must document prerequisites, build command, expected artifact, validation, and
  reset.
- Must not commit generated build directories unless explicitly justified.

## BuildEvidence

**Purpose**: Records what was actually attempted or completed for a route.

**Fields**:
- `routeId`: Links to `IntegrationRoute.id`.
- `planSummary`: Wasm Build Plan summary or link to evidence.
- `authorizationBasis`: Explicit user instruction or approval record.
- `prerequisiteState`: `available`, `missing`, `approved-installed`,
  `blocked`.
- `commandsRun`: Ordered list of project-local commands actually run.
- `buildResult`: `passed`, `failed`, or `not-run`.
- `validationResult`: `passed`, `failed`, `skipped`, or `not-run`.
- `artifactsProduced`: Sorted list of artifact paths or patterns.
- `generatedOutputPolicy`: What was removed, ignored, or intentionally kept.
- `remainingGaps`: Sorted list of unresolved limitations.

**Validation rules**:
- At least one route must have `buildResult: passed` and
  `validationResult: passed`.
- Evidence must not imply JSON evals alone prove real build success.
- Commands must preserve semantic execution order.
- `buildResult` remains limited to `passed`, `failed`, or `not-run`; route-level
  states such as `blocked-missing-prereq` are not valid build results.

## PrerequisiteDecision

**Purpose**: Captures safe handling of missing environment/toolchain
prerequisites.

**Fields**:
- `routeId`: Related route.
- `missingPrerequisite`: Exact missing target, tool, SDK, validator, or package.
- `whyNeeded`: Reason the route requires it.
- `mutationScope`: `project-local`, `environment`, `global-toolchain`,
  `system`.
- `approvalRequired`: Boolean.
- `approvalStatus`: `not-required`, `requested`, `approved`, `denied`,
  `not-run`.
- `resumeStatus`: `resumed`, `blocked`, or `not-applicable`.

**Validation rules**:
- Environment, global-toolchain, and system mutations always require approval.
- No automatic external installation is permitted.
- At least one approval/resume workflow must be demonstrated or explicitly
  blocked with evidence.

## ArtifactStructureReport

**Purpose**: Deterministic safe report from `.wasm` artifact inspection.

**Fields**:
- `schemaVersion`: Report schema version.
- `artifact`: Inspected artifact path.
- `bytes`: Artifact size.
- `wasmHeaderValid`: Boolean.
- `artifactForm`: `core-module`, `component`, `unknown`, or `invalid`.
- `imports`: Sorted list of imported modules/functions when detectable.
- `exports`: Sorted list of exports when detectable.
- `memoryExportPresent`: Boolean or `null` when unknown.
- `validation`: Ordered validator results.
- `warnings`: Sorted warnings.

**Validation rules**:
- Inspection mode never executes the artifact.
- Optional tools degrade to skipped/tool-unavailable results.
- Output is deterministic for unchanged input and environment.

## FailureDiagnosisRule

**Purpose**: Evidence-driven mapping from observed failure to safe next action.

**Fields**:
- `failureClass`: Stable class name.
- `symptom`: Observable error or validator/build output.
- `likelyCause`: Probable cause.
- `evidenceToInspect`: Files, artifact facts, imports/exports, commands, or
  tool output to check.
- `safeNextAction`: Bounded next action.
- `unsafeActionToAvoid`: Random or high-risk action to avoid.

**Validation rules**:
- Required failure classes from the spec must all have complete rules.
- Rules must name evidence, not just generic advice.

## FreezeDecision

**Purpose**: Final readiness outcome after hardening.

**Fields**:
- `decision`: `freeze-wasm-build` or `another-hardening-slice`.
- `evidenceSummary`: Route/evidence summary.
- `blockingGaps`: Remaining freeze blockers.
- `nonBlockingImprovements`: Follow-up improvements.

**Validation rules**:
- Decision must be based on real integration evidence plus validation results.
- Decision cannot cite repository-owned evals alone as proof of build readiness.
