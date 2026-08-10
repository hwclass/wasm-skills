# Quickstart: wasm-build Hardening

This quickstart describes how maintainers verify the hardening slice once it is
implemented. It does not install missing external toolchains automatically.

## 1. Validate Repository Baseline

```bash
npm run validate
npm run test:install
npm run test:scripts
npm run test:evals
git diff --check
```

Expected result: all commands pass. NPM may print local cache warnings that do
not affect exit status.

## 2. Verify Required Fixtures

Confirm these routes contain real source fixtures, not README-only recipes:

```text
skills/wasm-build/examples/rust-browser/
skills/wasm-build/examples/tinygo-minimal/
skills/wasm-build/examples/js-component-minimal/
```

Each fixture README must name prerequisites, expected build command, expected
artifact, validation procedure, reset instructions, and generated-output policy.

## 3. Run Real Integration Routes

Run each fixture only when prerequisites are already available or after explicit
approval to install the exact missing prerequisite.

Required routes:

1. Rust Browser
2. TinyGo WASI
3. JavaScript Component Model

At least one route must complete actual build and artifact validation before the
feature can be marked complete.

## 4. Verify Missing-Prerequisite Workflow

Use one fixture or controlled environment where a required tool or target is
missing.

Expected flow:

```text
requested build
-> prerequisite missing
-> exact prerequisite identified
-> environment mutation not executed automatically
-> explicit approval requested
-> approved prerequisite change only
-> original build resumes
-> artifact validation follows
```

## 5. Verify Artifact Structure Inspection

Run artifact inspection against representative artifacts:

```bash
node skills/wasm-build/scripts/inspect-wasm-artifact.mjs fixtures/app.wasm
```

Expected report fields:

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

Inspection mode must not execute the artifact.

## 6. Verify Failure Diagnosis

Review `skills/wasm-build/references/failure-diagnosis.md` and any route
evidence. Every required failure class must include symptom, likely cause,
evidence to inspect, safe next action, and unsafe/random action to avoid.

## 7. Make Freeze Decision

At completion, document exactly one outcome:

```text
FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL
WASM-BUILD STILL REQUIRES ANOTHER HARDENING SLICE
```

The decision must cite real integration evidence. JSON evals alone are not
sufficient proof.
