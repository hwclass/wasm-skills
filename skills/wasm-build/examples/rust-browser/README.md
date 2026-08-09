# Rust Browser Manual Integration Test

## Purpose

This example verifies the complete public workflow:

```text
GitHub wasm-build skill
-> installation through the Skills CLI
-> Codex skill discovery
-> project inspection
-> Wasm Build Plan
-> explicit authorization
-> creation of an improved after/ project
-> optional build and validation
```

The fixture is intentionally a manual integration test. This repository prepares
the starting project only; a separate fresh Codex session using the installed
`wasm-build` Agent Skill produces the generated result.

## Initial Structure

Before running the test, this directory intentionally contains:

```text
rust-browser/
├── README.md
└── before/
    ├── Cargo.toml
    ├── Cargo.lock
    ├── index.html
    └── src/
        └── lib.rs
```

`after/` MUST NOT exist yet.

`after/` is test output produced by the installed skill. It is not part of the
initial fixture.

## Install For Codex

Install the public `wasm-build` Agent Skill for Codex:

```bash
npx skills add hwclass/wasm-skills \
  --skill wasm-build \
  --agent codex \
  --global \
  -y
```

Verify the global Codex skill installation:

```bash
skills list --global --agent codex --json
```

## How To Run The Test

Open the starting project as the Codex workspace:

```bash
code skills/wasm-build/examples/rust-browser/before
```

Then start a fresh Codex session in that workspace.

## Exact Test Prompt

Copy and paste this prompt into the fresh Codex session:

```text
Use the installed `wasm-build` skill to inspect this Rust browser WebAssembly
project.

First, inspect the project read-only and produce a Wasm Build Plan.

The plan must determine:

- detected language
- intended environment
- WebAssembly target
- artifact type
- recommended toolchain
- build command
- validation commands
- expected artifacts
- reproducibility gaps
- risks
- fallback path
- documentation inconsistencies

Do not modify this `before/` project.

After presenting the plan, create an improved copy of this project at:

../after/

This prompt explicitly authorizes creation and modification of `../after/`.

Requirements:

- preserve `before/` unchanged
- copy only meaningful source/configuration files into `after/`
- do not copy generated `target/` or `pkg/` directories
- apply only improvements justified by the Wasm Build Plan
- keep the example minimal
- do not add unrelated frameworks or dependencies
- do not install Rust, wasm-pack, wasm-tools, or any other toolchain
  automatically

Valid improvements may include:

- correcting stale artifact names
- improving deterministic build commands
- adding an appropriate Rust toolchain pin when justified
- documenting wasm-pack and wasm-tools version expectations
- correcting build/validation documentation
- making browser runtime and artifact assumptions explicit

If required build tools are already installed:

- build `../after/`
- validate the resulting WebAssembly artifact
- report the results
- remove generated `target/` and `pkg/` directories afterward so only
  source/configuration changes remain in the fixture

If required tools are missing:

- do not install them
- report which tools are missing
- still create the justified `after/` source/configuration project

At completion report:

- Wasm Build Plan summary
- files created in `../after/`
- changes made and why
- whether build ran
- whether validation ran
- any remaining reproducibility gaps
```

Do not run this prompt while preparing the fixture. It is for the separate manual
integration-test session.

## Expected Behavior

Observable pass conditions:

1. `wasm-build` activates.
2. Rust is detected.
3. Browser is selected as the intended environment.
4. Browser Wasm is distinguished from WASI.
5. A browser-appropriate Rust/Wasm toolchain is selected.
6. A Wasm Build Plan is shown before mutation.
7. `before/` remains byte-for-byte unchanged.
8. `after/` is created by the agent.
9. Changes in `after/` correspond to findings in the plan.
10. No toolchains are installed automatically.
11. Generated build directories are not retained.
12. Validation occurs only when required tools already exist.

## Manual Verification

Compare the starting project with the generated result:

```bash
diff -ru before after
```

Expected outcome: the diff shows only source/configuration/documentation changes
that correspond to the Wasm Build Plan. It must not show generated `target/` or
`pkg/` content.

Verify that `before/` remains unchanged using Git:

```bash
git diff -- skills/wasm-build/examples/rust-browser/before
```

Expected outcome: no diff. Any diff under `before/` means the test failed because
the starting project was modified.

## Resetting The Test

Delete generated output to rerun the test:

```bash
rm -rf skills/wasm-build/examples/rust-browser/after
```

Do NOT delete `before/`.

## Result Policy

`after/` may either:

A. remain uncommitted as generated test output, or
B. be intentionally committed later as a reference result.

For this initial fixture, choose A: `after/` is generated test output and MUST
NOT be committed yet.
