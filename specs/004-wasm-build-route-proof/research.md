# Research: wasm-build Route Proof

## Decision: Reuse Existing Route Evidence Files

**Decision**: Update the existing route evidence files:

- `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`
- `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`
- `skills/wasm-build/evals/fixtures/js-component-evidence.json`

**Rationale**: Feature `003-wasm-build-hardening` already established these
repository-owned proof artifacts and their schema. Reusing them preserves the
constitution requirement for bounded Agent Skill scope and avoids inventing a
second evidence framework.

**Alternatives considered**:

- Create a new route-proof evidence directory: rejected because it would
  duplicate existing evidence and weaken continuity with the prior audit.
- Treat JSON eval pass results as route proof: rejected because the spec
  requires real build-and-validation evidence.

## Decision: Add One Feature-Level Implementation Evidence Document

**Decision**: Create
`specs/004-wasm-build-route-proof/implementation-evidence.md` during
implementation.

**Rationale**: The route JSON files capture machine-checkable route facts, while
the feature evidence document can record AC-001 through AC-013, command results,
approval pauses, cleanup checks, and the final freeze decision in one audited
place.

**Alternatives considered**:

- Reuse `specs/003-wasm-build-hardening/implementation-evidence.md`: rejected
  because feature `004` needs its own final proof record.
- Put all evidence only in JSON: rejected because approval/resume narrative and
  final readiness rationale need human-readable context.

## Decision: Approval Boundaries Are Manual Implementation Stops

**Decision**: The implementation workflow must stop and request user approval
before running environment/toolchain mutation commands such as
`rustup target add wasm32-unknown-unknown` or TinyGo installation/activation.

**Rationale**: The constitution forbids automatic toolchain installation. The
user's explicit BUILD request authorizes project-local build/validation after
inspection and planning, but it does not grant blanket permission to mutate
external toolchains.

**Alternatives considered**:

- Model approval as an unattended eval: rejected because approval must be
  current and explicit.
- Install prerequisites silently when missing: rejected as a direct
  constitution violation.

## Decision: Rust Browser Uses Existing Fixture And Documented Route

**Decision**: Use `skills/wasm-build/examples/rust-browser/` without redesigning
the example.

**Rationale**: The prior hardening slice already established this route as a
runnable source fixture whose remaining blocker is the missing
`wasm32-unknown-unknown` target. The feature purpose is route execution proof,
not route redesign.

**Alternatives considered**:

- Create a simpler Rust fixture: rejected because it would dodge the already
  documented route.
- Add a different Rust target: rejected because the required proof route is Rust
  -> Browser WebAssembly.

## Decision: TinyGo WASI Uses Existing Fixture And Exact TinyGo Evidence

**Decision**: Use `skills/wasm-build/examples/tinygo-minimal/` and require
TinyGo detection from explicit TinyGo build evidence, not plain Go metadata.

**Rationale**: A plain `go.mod` cannot prove TinyGo support. The route needs
evidence that `wasm-build` distinguishes TinyGo WASI from ordinary Go projects
and records prerequisite state truthfully.

**Alternatives considered**:

- Treat any Go module as TinyGo-ready: rejected because this was previously
  identified as unsafe and misleading.
- Add unrelated Go/Wasm tooling: rejected as outside this proof slice.

## Decision: JavaScript Component Route Is Regression Only

**Decision**: Re-run the existing JavaScript Component Model fixture as
regression evidence and avoid redesign.

**Rationale**: This route already passed real build and validation in feature
`003`. Feature `004` should prove it remains intact while closing Rust/TinyGo
gaps.

**Alternatives considered**:

- Expand into `wasm-component`: rejected because a new specialized skill is out
  of scope.
- Skip the route: rejected because final proof requires all three
  representative routes.
