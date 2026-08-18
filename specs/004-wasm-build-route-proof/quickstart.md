# Quickstart: wasm-build Route Proof

This quickstart is for the implementation phase. It describes the intended proof
workflow without performing installation or build actions during planning.

## Baseline

Start by confirming repository checks are healthy before route proof changes:

```bash
npm run validate
npm run test:install
npm run test:scripts
npm run test:evals
git diff --check
```

## Rust Browser Route

1. Inspect the Rust toolchain state and record whether
   `wasm32-unknown-unknown` is installed.
2. If the target is missing, stop and request explicit approval before running:

```bash
rustup target add wasm32-unknown-unknown
```

3. After approval, run only that approved target installation.
4. Resume the documented Rust browser fixture build from:

```text
skills/wasm-build/examples/rust-browser/
```

5. Validate the produced Wasm artifact using the documented route validation.
6. Update:

```text
skills/wasm-build/evals/fixtures/rust-browser-evidence.json
specs/004-wasm-build-route-proof/implementation-evidence.md
```

7. Remove generated `target/` and `pkg/` output before commit.

## TinyGo WASI Route

1. Inspect TinyGo availability and record the prerequisite state.
2. If TinyGo is missing, determine the safest documented installation or
   activation method available for the current environment.
3. Stop and request explicit approval before any TinyGo installation or
   activation.
4. After approval, run only the approved prerequisite action.
5. Resume the documented TinyGo WASI fixture build from:

```text
skills/wasm-build/examples/tinygo-minimal/
```

6. Produce and validate:

```text
app.wasm
```

7. Update:

```text
skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json
specs/004-wasm-build-route-proof/implementation-evidence.md
```

8. Remove `app.wasm` and any temporary generated output before commit.

## JavaScript Component Regression

1. Re-run the existing JavaScript Component Model fixture from:

```text
skills/wasm-build/examples/js-component-minimal/
```

2. Confirm build and validation still pass using the documented route.
3. Update:

```text
skills/wasm-build/evals/fixtures/js-component-evidence.json
specs/004-wasm-build-route-proof/implementation-evidence.md
```

4. Remove generated component output before commit.

## Final Evidence

Record `AC-001` through `AC-014`, route summaries, validation command results,
generated-output checks, and exactly one final decision in:

```text
specs/004-wasm-build-route-proof/implementation-evidence.md
```

Allowed final decisions:

```text
FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL
WASM-BUILD STILL LACKS REAL ROUTE PROOF
```

## Final Validation

Run:

```bash
npm run validate
npm run test:install
npm run test:scripts
npm run test:evals
git diff --check
```

Generated route artifacts must be absent from the committed repository.
