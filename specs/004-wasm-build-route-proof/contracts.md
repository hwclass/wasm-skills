# Contracts: wasm-build Route Proof

## Evidence Contract

Feature `004` reuses the existing integration evidence contract from
`003-wasm-build-hardening`. Evidence files are repository-owned proof artifacts,
not universal Agent Skills contracts.

Canonical route evidence files:

```text
skills/wasm-build/evals/fixtures/rust-browser-evidence.json
skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json
skills/wasm-build/evals/fixtures/js-component-evidence.json
```

Required canonical fields:

```text
schemaVersion
routeId
planSummary
authorizationBasis
prerequisiteState
commandsRun
buildResult
validationResult
artifactsProduced
generatedOutputPolicy
remainingGaps
```

Rules:

- `schemaVersion` is `"1.0"`.
- `routeId` is one of `rust-browser`, `tinygo-wasi`, or `js-component`.
- `commandsRun` preserves semantic execution order.
- `artifactsProduced` and `remainingGaps` are lexicographically sorted.
- `buildResult` is one of `passed`, `failed`, or `not-run`.
- `validationResult` is one of `passed`, `failed`, `skipped`, or `not-run`.
- Route proof cannot be claimed from JSON eval success alone.
- Generated output directories and artifacts must not be committed unless an
  existing fixture explicitly documents intentional reference output.

## Prerequisite Approval Contract

Environment/toolchain mutation requires explicit current approval.

Required behavior:

- Missing prerequisite is identified by exact name.
- Reason is explained in terms of the selected route.
- No installation, activation, or environment mutation occurs automatically.
- Approval request is separate from the user's project-local BUILD request.
- Approval applies only to the exact prerequisite action named.
- After approval, only the approved prerequisite action is attempted.
- The original build and validation workflow resumes when the prerequisite
  becomes available.

Project-local BUILD execution:

- An explicit current request to build or validate authorizes the requested
  project-local build and validation commands after inspection and planning.
- No redundant approval is required for that same project-local build action.

Route-specific prerequisite boundaries:

- Rust Browser: `rustup target add wasm32-unknown-unknown` is allowed only after
  explicit approval and must not install unrelated Rust targets or toolchains.
- TinyGo WASI: TinyGo installation or activation is allowed only after explicit
  approval of the chosen safest documented method for the current environment
  and must not install unrelated Go/Wasm tooling.
- JavaScript Component: no new prerequisite installation is planned; the route
  is regression-only.

## Route Proof Contract

A route is proven only when all required evidence is present:

```text
prerequisite state before mutation
approval state where mutation was needed
exact mutation performed where approved
build command
build result
artifact path
validation command
validation result
cleanup result
```

Rules:

- `rust-browser` must produce and validate the expected browser Wasm artifact.
- `tinygo-wasi` must produce and validate `app.wasm`.
- `js-component` must preserve the existing Component Model build and
  validation regression.
- `buildResult: passed` requires a real command execution result.
- `validationResult: passed` requires validation of the artifact produced by
  the route proof run.
- A missing optional validator may be recorded, but optional-tool absence cannot
  be treated as route success when required validation did not run.

## Final Evidence Contract

The implementation must create:

```text
specs/004-wasm-build-route-proof/implementation-evidence.md
```

Required sections:

```text
Rust Browser Route Proof
TinyGo WASI Route Proof
JavaScript Component Regression Proof
Acceptance Criteria Evidence
Validation Command Results
Generated Output Check
Final Route-Proof Decision
```

Rules:

- Acceptance criteria evidence must cover `AC-001` through `AC-014`.
- Validation command results must include `npm run validate`,
  `npm run test:install`, `npm run test:scripts`, `npm run test:evals`, and
  `git diff --check`.
- The final decision must be exactly one of:

```text
FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL
WASM-BUILD STILL LACKS REAL ROUTE PROOF
```

- The freeze decision is valid only when Rust Browser, TinyGo WASI, and
  JavaScript Component Model all have real build-and-validation evidence and no
  generated route output is committed.
