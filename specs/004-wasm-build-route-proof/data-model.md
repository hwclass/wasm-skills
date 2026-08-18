# Data Model: wasm-build Route Proof

## RouteProofRun

**Purpose**: Records one empirical proof attempt for a representative
`wasm-build` route.

**Fields**:

- `routeId`: `rust-browser`, `tinygo-wasi`, or `js-component`.
- `fixturePath`: Project-relative fixture root.
- `prerequisiteStateBefore`: `available` or `missing`.
- `approval`: Link or embedded `PrerequisiteApproval` details.
- `buildCommand`: Project-local build command actually run, or `null` when not
  run.
- `buildResult`: `passed`, `failed`, or `not-run`.
- `artifactPath`: Project-relative path to the produced artifact, or `null`
  when no artifact was produced.
- `validationCommand`: Validation command actually run, or `null` when not run.
- `validationResult`: `passed`, `failed`, `skipped`, or `not-run`.
- `cleanupResult`: `passed`, `failed`, or `not-run`.
- `evidenceFile`: Project-relative evidence file updated for the route.

**Validation rules**:

- A route is proven only when `buildResult` and `validationResult` are both
  `passed`.
- `artifactPath` is required when `buildResult` is `passed`.
- Commands preserve semantic execution order in the route evidence file.
- JSON/static eval success must not be represented as a passed build.

## PrerequisiteApproval

**Purpose**: Captures an exact approval boundary for environment or toolchain
mutation.

**Fields**:

- `routeId`: Route requiring the prerequisite.
- `missingPrerequisite`: Exact prerequisite name.
- `mutationScope`: `environment`, `global-toolchain`, or `system`.
- `requestedAction`: Exact proposed installation or activation action.
- `approvalStatus`: `not-required`, `requested`, `approved`, `denied`, or
  `interrupted`.
- `approvedActionRun`: Exact action run after approval, or `null`.
- `resumeStatus`: `resumed`, `blocked`, or `not-applicable`.

**Validation rules**:

- Environment, global-toolchain, and system mutations require explicit current
  approval.
- Approval applies only to `requestedAction`; blanket installation permission is
  invalid.
- When approval is denied or interrupted, `resumeStatus` is `blocked` and the
  route cannot be marked proven.
- Project-local build/validation after explicit BUILD intent does not require a
  redundant approval entry.

## BuildEvidence

**Purpose**: Existing machine-readable route evidence maintained under
`skills/wasm-build/evals/fixtures/`.

**Fields**:

- `schemaVersion`: `"1.0"`.
- `routeId`: Stable route identifier.
- `planSummary`: Route summary.
- `authorizationBasis`: User request and approval basis.
- `prerequisiteState`: `available`, `missing`, `approved-installed`, or
  `blocked`.
- `commandsRun`: Ordered commands actually run.
- `buildResult`: `passed`, `failed`, or `not-run`.
- `validationResult`: `passed`, `failed`, `skipped`, or `not-run`.
- `artifactsProduced`: Sorted artifact paths.
- `generatedOutputPolicy`: Cleanup/ignore result.
- `remainingGaps`: Sorted unresolved limitations.

**Validation rules**:

- `buildResult` remains limited to `passed`, `failed`, or `not-run`.
- `remainingGaps` must be empty or non-blocking for a route claimed as proven.
- `commandsRun` must not include unapproved environment mutation.
- Generated output policy must state that generated route output was removed or
  remains ignored and uncommitted.

## ValidationEvidence

**Purpose**: Records the validation proof for a produced Wasm artifact.

**Fields**:

- `routeId`: Route whose artifact was validated.
- `artifactPath`: Project-relative artifact path.
- `validationCommands`: Ordered validation commands.
- `validationResult`: `passed`, `failed`, `skipped`, or `not-run`.
- `validatorAvailability`: Available, missing optional, or unavailable blocker.
- `notes`: Relevant validator output summary.

**Validation rules**:

- Validation cannot pass without an artifact produced by the same route proof
  run.
- Missing optional validators may be recorded, but they cannot be used to claim
  passed validation if the required validation path did not run.
- Artifact inspection remains non-executing and follows existing script safety
  contracts.

## FinalRouteProofDecision

**Purpose**: Human-readable final decision recorded in
`specs/004-wasm-build-route-proof/implementation-evidence.md`.

**Fields**:

- `decision`: Exact final decision string.
- `routeSummary`: Rust, TinyGo, and JavaScript route proof status.
- `validationSummary`: Required command results.
- `blockingGaps`: Remaining blockers, if any.

**Validation rules**:

- `decision` is exactly one of:
  - `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL`
  - `WASM-BUILD STILL LACKS REAL ROUTE PROOF`
- The freeze decision is valid only when all three representative routes have
  real build-and-validation evidence and required repository validation passes.
