# Acceptance Criteria: wasm-build Hardening

## Route Fixtures

- **AC-001**: `skills/wasm-build/examples/rust-browser/` contains a runnable
  minimal Rust browser source fixture with README, prerequisites, expected build
  command, expected artifact, validation procedure, and reset instructions.
- **AC-002**: `skills/wasm-build/examples/tinygo-minimal/` contains a runnable
  minimal TinyGo WASI source fixture with README, prerequisites, expected build
  command, expected artifact, validation procedure, and reset instructions.
- **AC-003**: `skills/wasm-build/examples/js-component-minimal/` contains a
  runnable minimal JavaScript Component Model source fixture with README,
  prerequisites, expected build command, expected artifact, validation
  procedure, and reset instructions.
- **AC-004**: Generated output directories `target/`, `pkg/`, `dist/`,
  `node_modules/`, and temporary build directories are absent from commits
  unless explicitly justified as reference evidence.

## Real Integration Evidence

- **AC-005**: At least one required route records successful actual build
  evidence.
- **AC-006**: At least one generated `.wasm` artifact is validated successfully.
- **AC-007**: At least one missing-prerequisite approval/resume workflow is
  documented with exact prerequisite, approval boundary, and resumed outcome.
- **AC-008**: Evidence distinguishes static/schema validation, eval cases,
  runnable fixtures, actual build execution, and manual approval evidence.

## Artifact Inspection

- **AC-009**: Artifact inspection reports imports and exports when available
  from safe inspection.
- **AC-010**: Artifact inspection reports memory export presence as `true`,
  `false`, or `null`.
- **AC-011**: Artifact inspection reports `core-module`, `component`, `unknown`,
  or `invalid` artifact form when detectable.
- **AC-012**: Artifact inspection preserves allowlisted commands, no shell
  invocation, output caps, timeout behavior, missing-tool degradation, and no
  Wasm execution in inspection mode.

## Failure Diagnosis

- **AC-013**: Failure diagnosis contains complete evidence-driven entries for
  every required failure class in `contracts.md`.
- **AC-014**: Diagnosis entries name observable evidence to inspect and unsafe
  random actions to avoid.

## Approval And Scope

- **AC-015**: Explicit current build requests do not require redundant approval
  for project-local build/validation after inspection and planning.
- **AC-016**: Environment/toolchain mutations require explicit approval and are
  never performed automatically.
- **AC-017**: JavaScript Component Model coverage remains build-level proof and
  does not expand into advanced component design.
- **AC-018**: Existing Agent Skills portability, install, uninstall,
  `.agents/skills/wasm-build/` ignore behavior, and release documentation remain
  intact.

## Validation

- **AC-019**: `npm run validate` passes.
- **AC-020**: `npm run test:install` passes.
- **AC-021**: `npm run test:scripts` passes.
- **AC-022**: `npm run test:evals` passes.
- **AC-023**: `git diff --check` passes.
- **AC-024**: Final freeze decision chooses exactly one allowed outcome and is
  based on real integration evidence.
