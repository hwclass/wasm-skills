# Rust Browser Manual Integration Test

## Purpose

This example verifies the public `wasm-build` Agent Skill workflow:

```text
GitHub wasm-build skill
-> installation through the Skills CLI
-> Codex skill discovery
-> project inspection
-> Wasm Build Plan
-> intent-aware authorization
-> optional project transformation
-> optional build and validation
```

The fixture is intentionally manual. Use a separate fresh Codex session with the
installed `wasm-build` Agent Skill to produce or exercise generated results.
This fixture tests one route through the general `wasm-build` decision model:
Rust + Browser + PLAN/REPAIR/BUILD. It must not be treated as the normative
shape for other languages, environments, artifact types, or runtimes.

## Initial Structure

Before Test A runs, this directory intentionally contains:

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

`before/` is the immutable starting project.

`after/` is generated test output. It may be absent before Test A. If present,
it should contain only meaningful source/configuration/documentation files
created by the installed skill, not generated `target/` or `pkg/` directories.

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

## Test A - Planning And Transformation

This flow demonstrates:

```text
inspect
-> Wasm Build Plan
-> authorized project changes
-> after/ creation
```

Open the starting project as the Codex workspace:

```bash
code skills/wasm-build/examples/rust-browser/before
```

Then start a fresh Codex session in that workspace.

### Test A Prompt

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

## Test B - Complete Build Execution

This flow runs from the generated `after/` project. Run Test A first, or provide
an intentional reference `after/` project later.

Open the generated project as the Codex workspace:

```bash
code skills/wasm-build/examples/rust-browser/after
```

Then start a fresh Codex session in that workspace.

### Test B Prompt

Copy and paste this prompt:

```text
Use the installed wasm-build skill to build and validate this project completely.

You are authorized to run the required project build and validation commands.

If an environment or toolchain prerequisite is missing, identify the exact
prerequisite and ask me before installing or modifying anything outside this
project.
```

Expected behavior:

1. If existing build prerequisites are installed, the agent inspects, plans,
   builds immediately, and validates the produced artifact.
2. If a project-external prerequisite is missing, such as a Rust target,
   `wasm-pack`, or `wasm-tools`, the agent identifies the exact missing
   prerequisite and asks before installing or modifying anything outside the
   project.
3. After approval for a missing project-external prerequisite, the agent installs
   only the approved prerequisite, resumes the build, and validates the artifact.
4. The agent does not ask for a redundant second approval for the build already
   requested in the current prompt.

Do not record a successful Test B result unless the build and validation
actually succeeded in the local environment.

## Expected Behavior

Observable pass conditions:

1. `wasm-build` activates.
2. Rust is detected.
3. Browser is selected as the intended environment.
4. Browser Wasm is distinguished from WASI.
5. A browser-appropriate Rust/Wasm toolchain is selected.
6. A Wasm Build Plan is shown before mutation.
7. `before/` remains byte-for-byte unchanged.
8. Test A creates `after/` when transformation is authorized.
9. Changes in `after/` correspond to findings in the plan.
10. No toolchains are installed automatically.
11. Generated build directories are not retained.
12. Validation occurs only when required tools already exist or after explicit
    approval for missing project-external prerequisites.
13. Test B treats the explicit build request as build authorization and does not
    require a redundant second approval for project-local build commands.

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

Expected outcome: no diff after `before/` has been committed as the baseline.
Any later diff under `before/` means the test failed because the starting project
was modified.

## Resetting The Test

Delete generated output to rerun Test A:

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
