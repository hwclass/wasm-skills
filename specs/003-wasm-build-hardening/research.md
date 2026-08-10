# Research: wasm-build Hardening

## Decision: Prove three representative real routes, not full matrix coverage

**Rationale**: The core freeze gap is lack of real integration evidence. Rust
browser, TinyGo WASI, and JavaScript Component Model cover different languages,
toolchain families, artifact models, and validation paths without attempting an
unbounded language/environment Cartesian product.

**Alternatives considered**:
- Full language/environment matrix: rejected as too broad for the first
  hardening slice and explicitly out of scope.
- Rust-only proof: rejected because it would not validate general first-line
  skill claims.
- Documentation-only proof: rejected because the audit identified lack of real
  build evidence as the blocking gap.

## Decision: Keep toolchain installation manual and approval-gated

**Rationale**: The constitution forbids automatic heavy toolchain installation.
The feature should prove missing-prerequisite detection, approval request, and
resume behavior without silently modifying the user's environment.

**Alternatives considered**:
- Automatically install missing targets/tools: rejected by constitution and
  safety policy.
- Skip missing-prerequisite cases: rejected because safe continuation is a
  central acceptance criterion.

## Decision: Store evidence as repository-owned proof artifacts

**Rationale**: Maintainers need to distinguish static checks, eval cases,
runnable fixtures, actual build execution, and manual approval evidence. Evidence
records should be deterministic, concise, and scoped to this repository.

**Alternatives considered**:
- Treat eval JSON as an Agent Skills standard: rejected; evals are
  repository-owned infrastructure.
- Commit generated build outputs as proof by default: rejected because generated
  `target/`, `pkg/`, `dist/`, and `node_modules/` outputs should remain out of
  commits unless explicitly justified.

## Decision: Harden artifact inspection without requiring one external tool

**Rationale**: Artifact inspection must remain safe and degrade gracefully when
optional validators are missing. Imports/exports and artifact form should be
reported when available, but the script must not become a runtime or require a
specific external validator for all users.

**Alternatives considered**:
- Require `wasm-tools` for all structural inspection: rejected because optional
  validators should degrade gracefully.
- Execute artifacts with Wasmtime for structure: rejected; inspection mode must
  never execute Wasm.

## Decision: Strengthen failure diagnosis using observable evidence

**Rationale**: The existing failure table names the right classes but must be
grounded in concrete signals from builds, validators, artifact structure, or
tool output. This preserves `wasm-build` as decision-oriented guidance rather
than random command mutation.

**Alternatives considered**:
- Grow a larger generic error list: rejected because it does not improve
  actionable diagnosis.
- Move diagnosis into a future skill: rejected because failure diagnosis is a
  constitutional responsibility of `wasm-build`.

## Decision: Preserve installer/distribution surfaces

**Rationale**: This hardening slice is about proof and safety, not installer
redesign. Existing install/uninstall, `.agents/skills/wasm-build/` ignore
behavior, and public Skills CLI documentation must keep passing.

**Alternatives considered**:
- Add new distribution mechanism: rejected as unrelated scope.
- Ignore installer tests: rejected because Agent Skills portability remains a
  freeze criterion.
