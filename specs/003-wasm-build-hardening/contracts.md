# Contracts: wasm-build Hardening

## Integration Evidence Contract

Evidence files are repository-owned proof artifacts. They are not universal Agent
Skills contracts.

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
- `routeId` matches a known `IntegrationRoute`.
- `commandsRun` preserves semantic execution order.
- `artifactsProduced` and `remainingGaps` are lexicographically sorted.
- `buildResult` is one of `passed`, `failed`, `not-run`.
- `validationResult` is one of `passed`, `failed`, `skipped`, `not-run`.
- `BuildEvidence.buildResult` is distinct from
  `IntegrationRoute.evidenceStatus`; route-level states such as
  `blocked-missing-prereq` must not be added to the build result enum.
- Generated output directories must not be committed unless
  `generatedOutputPolicy` explains why reference output is intentionally kept.

## Fixture Contract

Each required route fixture MUST contain:

```text
README.md
source files
manifest/configuration files
prerequisite list
expected build command
expected artifact path or pattern
validation procedure
reset instructions
generated-output ignore behavior
```

Rules:
- README-only recipes do not satisfy runnable fixture requirements.
- Fixture source must be minimal and route-specific.
- Fixture READMEs must state that missing external tools are not installed
  automatically.
- `target/`, `pkg/`, `dist/`, `node_modules/`, and temporary build directories
  are ignored or removed unless intentionally committed as reference evidence.

## ArtifactStructureReport Contract

The artifact inspector MUST emit deterministic JSON with these canonical fields:

```text
schemaVersion
artifact
bytes
magic
wasmHeaderValid
artifactForm
availableTools
validation
imports
exports
memoryExportPresent
warnings
```

Rules:
- `artifactForm` is one of `core-module`, `component`, `unknown`, `invalid`.
- `imports` and `exports` are arrays sorted lexicographically by stable display
  key when detectable.
- `memoryExportPresent` is `true`, `false`, or `null` when unavailable.
- `validation` preserves validator execution order.
- Validator statuses remain `available`, `skipped`, `valid`, `invalid`,
  `error`, or `timeout` where applicable to the existing validator model.
- Inspection mode never executes the artifact.
- The script must not invoke a shell and must preserve the existing allowlist.
- Missing optional validators produce skipped/tool-unavailable results, not a
  failed inspection, unless the input path itself is invalid.

## Prerequisite Approval Contract

Environment/toolchain mutation requires explicit approval.

Required behavior:
- Missing prerequisite is identified by exact name.
- Reason is explained in terms of the selected route.
- No installation or environment mutation occurs automatically.
- Approval request is separate from the user's project-local build request.
- After approval, only the approved prerequisite change is attempted.
- The original build and validation workflow resumes when the prerequisite
  becomes available.

Project-local build execution:
- An explicit current request to build, compile, test, repair, or validate
  authorizes the requested project-local action after inspection and planning.
- No redundant approval is required for that same project-local build action.

## Failure Diagnosis Contract

Each required failure class MUST include:

```text
failureClass
symptom
likelyCause
evidenceToInspect
safeNextAction
unsafeActionToAvoid
```

Required classes:
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

Rules:
- Diagnosis must be tied to observable build output, validator output, artifact
  structure, or repository evidence.
- Diagnosis must classify before suggesting command changes.
- Diagnosis must not recommend random target triples, broad dependency changes,
  or unapproved environment mutation.

## Freeze Decision Contract

The final hardening review MUST choose exactly one:

```text
FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL
WASM-BUILD STILL REQUIRES ANOTHER HARDENING SLICE
```

Rules:
- Decision must cite real integration evidence.
- Repository-owned evals and schema checks may support the decision but cannot
  alone prove route readiness.
- Any remaining blocker must be classified and assigned to the next slice.
