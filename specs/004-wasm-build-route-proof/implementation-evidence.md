# Implementation Evidence: wasm-build Route Proof

## Baseline Validation State

Checklist status:

- `specs/004-wasm-build-route-proof/checklists/requirements.md`: 22 total, 22
  complete, 0 incomplete

Pre-route baseline commands:

- `npm run validate`: passed
- `npm run test:install`: passed
- `npm run test:scripts`: passed
- `npm run test:evals`: passed
- `git diff --check`: passed

NPM printed the local update-check warning about
`/Users/temporaryadmin/.config`. The warning did not affect command exit status
and was not remediated because it is outside this repository.

## Shared Evidence And Safety Gates

Project-local build authorization:

- The current user explicitly requested implementation of
  `004-wasm-build-route-proof`.
- That explicit BUILD request authorizes the documented project-local route
  build and validation commands after inspection/planning.
- It does not authorize environment, global toolchain, system package, or
  user-level toolchain mutation.

Environment/toolchain approval boundaries:

- Rust target mutation, if needed, is limited to exactly
  `rustup target add wasm32-unknown-unknown` and requires explicit approval.
- TinyGo installation or activation, if needed, requires explicit approval for
  one exact selected prerequisite action.
- No blanket toolchain installation permission is inferred.

Canonical route evidence fields verified:

- `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`: canonical
  fields present
- `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`: canonical
  fields present
- `skills/wasm-build/evals/fixtures/js-component-evidence.json`: canonical
  fields present

Generated-output ignore coverage:

- `skills/wasm-build/examples/rust-browser/.gitignore`: `after/`, `target/`,
  `pkg/`
- `skills/wasm-build/examples/tinygo-minimal/.gitignore`: `app.wasm`,
  `target/`, `tmp/`
- `skills/wasm-build/examples/js-component-minimal/.gitignore`:
  `app.component.wasm`, `dist/`, `node_modules/`, `tmp/`

Cleanup checks to use after route runs:

- Rust Browser: verify no generated `skills/wasm-build/examples/rust-browser/target/`
  or `skills/wasm-build/examples/rust-browser/pkg/` remains.
- TinyGo WASI: verify no generated
  `skills/wasm-build/examples/tinygo-minimal/app.wasm`, `target/`, or `tmp/`
  remains.
- JavaScript Component: verify no generated
  `skills/wasm-build/examples/js-component-minimal/app.component.wasm`,
  `dist/`, `node_modules/`, or `tmp/` remains.

Scope check:

- No new `.agents/skills/wasm-component/`, `skills/wasm-component/`, or other
  new skill path exists or is planned.

## Rust Browser Route Proof

- Fixture: `skills/wasm-build/examples/rust-browser/before/`
- Initial prerequisite state: `wasm32-unknown-unknown` missing; installed targets
  were `wasm32-wasip1` and `x86_64-apple-darwin`.
- Available route tools before build: `rustup`, `cargo`, `wasm-pack`, and
  `wasm-tools`.
- Approval requested and granted for exact action:
  `rustup target add wasm32-unknown-unknown`.
- Environment mutation performed:
  `rustup target add wasm32-unknown-unknown` (succeeded).
- First resumed build command:
  `wasm-pack build --target web`.
- First resumed build result: failed after Rust compilation because the
  `wasm-bindgen` CLI was not on PATH and `wasm-pack` could not create its
  installation temp dir in the sandbox.
- Additional exact prerequisite identified: `wasm-bindgen-cli v0.2.127`.
- Approval requested and granted for exact action:
  `cargo install wasm-bindgen-cli --version 0.2.127`.
- Environment mutation performed:
  `cargo install wasm-bindgen-cli --version 0.2.127` (succeeded).
- Final resumed build command:
  `wasm-pack build --target web`.
- Final resumed build result: passed.
- Produced artifact: `skills/wasm-build/examples/rust-browser/before/pkg/rust_browser_bg.wasm`.
- Required validation command:
  `wasm-tools validate pkg/rust_browser_bg.wasm`.
- Required validation result: passed.
- Structural inspection command:
  `node ../../../scripts/inspect-wasm-artifact.mjs pkg/rust_browser_bg.wasm`.
- Structural inspection result: core module, `memoryExportPresent: true`,
  import `./rust_browser_bg.js.__wbindgen_init_externref_table:function`, export
  `greet:function:25`; optional `jco` rejected the core module under the default
  Node 14 path and was not used as the required browser Wasm validator.
- Cleanup result: generated `target/` and `pkg/` output under
  `skills/wasm-build/examples/rust-browser/before/` removed after evidence
  capture.
- Route evidence:
  `skills/wasm-build/evals/fixtures/rust-browser-evidence.json`.

## TinyGo WASI Route Proof

- Fixture: `skills/wasm-build/examples/tinygo-minimal/`
- Explicit TinyGo evidence: `skills/wasm-build/examples/tinygo-minimal/Makefile`
  contains `tinygo build -target=wasi -o app.wasm .`.
- Plain `go.mod` handling: `go.mod` was inspected but was not treated as
  sufficient TinyGo proof.
- Initial prerequisite state: TinyGo unavailable (`which tinygo` failed and
  `tinygo version` was not found).
- Documented macOS install path identified from TinyGo official documentation:
  `brew tap tinygo-org/tools` and `brew install tinygo`.
- Approval requested and granted for exact action:
  `brew tap tinygo-org/tools`.
- Environment mutation performed:
  `brew tap tinygo-org/tools` (succeeded).
- Approval requested and granted for exact action:
  `brew install tinygo`.
- Environment mutation attempted:
  `brew install tinygo` (failed without installing TinyGo because Homebrew
  refused to load the untrusted third-party formula).
- Additional trust-policy action:
  `brew trust --formula tinygo-org/tools/tinygo` was identified but rejected by
  approval review as too broad/persistent; it was not executed.
- Safer documented alternative selected: official TinyGo v0.41.1 macOS Intel
  tarball extracted under `/tmp` for non-persistent route use.
- Approval requested and granted for exact action:
  `curl -L -o /tmp/tinygo0.41.1.darwin-amd64.tar.gz https://github.com/tinygo-org/tinygo/releases/download/v0.41.1/tinygo0.41.1.darwin-amd64.tar.gz`.
- Environment/toolchain activation performed:
  `tar -xzf /tmp/tinygo0.41.1.darwin-amd64.tar.gz -C /tmp/wasm-route-proof-tinygo`.
- Activated TinyGo version:
  `tinygo version 0.41.1 darwin/amd64 (using go version go1.25.3 and LLVM version 20.1.1)`.
- First resumed fixture command:
  `PATH=/tmp/wasm-route-proof-tinygo/tinygo/bin:$PATH make build`.
- First resumed fixture result: failed because TinyGo attempted to create
  `/Users/temporaryadmin/Library/Caches/tinygo` and sandbox permissions blocked
  that user-cache mutation.
- Approval requested and granted for exact resumed build action allowing TinyGo
  to create/use `~/Library/Caches/tinygo`.
- Final build command:
  `PATH=/tmp/wasm-route-proof-tinygo/tinygo/bin:$PATH tinygo build -target=wasi -o app.wasm .`.
- Final build result: passed.
- Produced artifact:
  `skills/wasm-build/examples/tinygo-minimal/app.wasm` (603057 bytes).
- Required validation command:
  `wasm-tools validate app.wasm`.
- Required validation result: passed.
- Structural inspection command:
  `node ../../scripts/inspect-wasm-artifact.mjs app.wasm`.
- Structural inspection result: core module, WASI Preview 1 imports,
  `memoryExportPresent: true`, export `_start:function:90`; optional `jco`
  rejected the core module under the default Node 14 path and was not used as
  the required WASI validator.
- Cleanup result: `make clean` removed generated `app.wasm`.
- Route evidence:
  `skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json`.

## JavaScript Component Regression Proof

- Fixture: `skills/wasm-build/examples/js-component-minimal/`
- Prerequisite state: existing `jco` on default PATH uses Node v14.17.6 and
  fails with `Unexpected token '??='`; existing Node v22.22.0 and jco 1.16.1
  are available at `/Users/temporaryadmin/.nvm/versions/node/v22.22.0/bin`.
- Build command:
  `PATH=/Users/temporaryadmin/.nvm/versions/node/v22.22.0/bin:$PATH jco componentize src/index.js --wit wit/world.wit --world-name app -o app.component.wasm`.
- Build result: passed.
- Produced artifact:
  `skills/wasm-build/examples/js-component-minimal/app.component.wasm`
  (11580987 bytes).
- Validation commands:
  - `PATH=/Users/temporaryadmin/.nvm/versions/node/v22.22.0/bin:$PATH jco wit app.component.wasm`
  - `wasm-tools validate app.component.wasm`
  - `node ../../scripts/inspect-wasm-artifact.mjs app.component.wasm`
- Validation result: passed.
- Structural inspection result: `artifactForm: component`, WIT/WASI imports,
  export `add: func(left: s32, right: s32) -> s32`, and
  `memoryExportPresent: null`.
- Scope result: regression-only; no `wasm-component` skill or advanced
  component architecture was added.
- Cleanup result: generated `app.component.wasm`, `dist/`, `node_modules/`, and
  `tmp/` output absent after cleanup.
- Route evidence:
  `skills/wasm-build/evals/fixtures/js-component-evidence.json`.

## Acceptance Criteria Evidence

- AC-001: PASS. Rust Browser completed a real `wasm-pack build --target web`
  after exact prerequisite approvals.
- AC-002: PASS. Rust Browser produced
  `skills/wasm-build/examples/rust-browser/before/pkg/rust_browser_bg.wasm`.
- AC-003: PASS. `wasm-tools validate pkg/rust_browser_bg.wasm` passed.
- AC-004: PASS. Missing `wasm32-unknown-unknown` was detected, exact approval
  was requested and granted, only the approved target action was run, and the
  original build resumed without redundant project-local build approval.
- AC-005: PASS. TinyGo WASI completed a real
  `tinygo build -target=wasi -o app.wasm .` build.
- AC-006: PASS. TinyGo WASI produced
  `skills/wasm-build/examples/tinygo-minimal/app.wasm`.
- AC-007: PASS. `wasm-tools validate app.wasm` passed.
- AC-008: PASS. TinyGo was initially unavailable; exact approval was requested
  before approved prerequisite actions, the Homebrew trust-policy path was not
  executed after rejection, the safer approved `/tmp` tarball activation was
  used, and the build resumed.
- AC-009: PASS. JavaScript Component regression build and validation remained
  passing using existing Node v22.22.0 and jco 1.16.1.
- AC-010: PASS. Rust target,
  `wasm-bindgen-cli`, TinyGo tap/download/extract, and TinyGo cache use occurred
  only after exact explicit approval. The Homebrew trust-policy action was
  rejected and not executed.
- AC-011: PASS. A stale generated Rust
  `skills/wasm-build/examples/rust-browser/before/target/` directory was removed
  during the final blocking-correction pass. Fresh generated-output checks now
  show no Rust `target/` or `pkg/`, no TinyGo `app.wasm`, `target/`, or `tmp/`,
  and no JavaScript `app.component.wasm`, `dist/`, `node_modules/`, or `tmp/`
  output remains.
- AC-012: PASS. Fresh final `npm run validate`, `npm run test:install`,
  `npm run test:scripts`, `npm run test:evals`, and `git diff --check` passed
  after the stale Rust output was removed.
- AC-013: PASS. No new skill or unrelated build capability was added; JavaScript
  route remained regression-only.
- AC-014: PASS. Final evidence contains exactly one route-proof decision:
  `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL`. This is allowed
  because Rust Browser has real successful build and validation evidence,
  TinyGo WASI has real successful build and validation evidence, JavaScript
  Component regression remains passing, generated output is absent after the
  final cleanup recheck, and final repository validation passed.

## Validation Command Results

- `npm run validate`: passed after final cleanup remediation
- `npm run test:install`: passed
- `npm run test:scripts`: passed
- `npm run test:evals`: passed
- `git diff --check`: passed

NPM printed the same local update-check warning about
`/Users/temporaryadmin/.config` during the npm commands. The warning did not
affect command exit status and was not remediated because it is outside this
repository.

## Generated Output Check

- Rust Browser: stale generated
  `skills/wasm-build/examples/rust-browser/before/target/` output was removed;
  no generated `target/` or `pkg/` remains under
  `skills/wasm-build/examples/rust-browser/`.
- TinyGo WASI: no generated `app.wasm`, `target/`, or `tmp/` under
  `skills/wasm-build/examples/tinygo-minimal/`.
- JavaScript Component: no generated `app.component.wasm`, `dist/`,
  `node_modules/`, or `tmp/` under
  `skills/wasm-build/examples/js-component-minimal/`.

## Final Route-Proof Decision

FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL

Rationale: Rust Browser, TinyGo WASI, and JavaScript Component Model all have
real successful build and validation evidence. Environment/toolchain mutations
were exact and approval-gated, generated route outputs are absent after the final
cleanup recheck, JSON/static evals were not counted as route proof, and
repository validation passed after cleanup.
