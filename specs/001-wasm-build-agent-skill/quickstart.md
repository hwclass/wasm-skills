# Quickstart: wasm-build Agent Skill

## Clone

Clone the published `wasm-skills` repository into a directory named
`wasm-skills`, then enter the checkout:

```bash
cd wasm-skills
```

## Install Project-Locally

```bash
./install.sh wasm-build --project
```

Expected output:

```text
Installed wasm-build to /absolute/path/to/wasm-skills/.agents/skills/wasm-build
Next: ask your coding agent for help building or validating a WebAssembly project.
```

Verify:

```bash
test -f .agents/skills/wasm-build/SKILL.md
```

## Install Globally

```bash
./install.sh wasm-build --global
```

Expected output:

```text
Installed wasm-build to /home/user/.agents/skills/wasm-build
Next: ask your coding agent for help building or validating a WebAssembly project.
```

Verify:

```bash
test -f ~/.agents/skills/wasm-build/SKILL.md
```

## Verify Skill Package

```bash
test -f skills/wasm-build/SKILL.md
test -f skills/wasm-build/references/target-selection.md
test -f skills/wasm-build/references/language-recipes.md
test -f skills/wasm-build/references/failure-diagnosis.md
test -f skills/wasm-build/references/runtime-validation.md
test -f skills/wasm-build/assets/build-plan.template.md
test -f skills/wasm-build/scripts/inspect-wasm-project.mjs
test -f skills/wasm-build/scripts/inspect-wasm-artifact.mjs
```

## Run Local Validation

The repository exposes documented local validation commands for:

- structure validation
- Markdown/content checks
- fixture/schema checks
- installer tests
- script tests
- evaluation checks

The implementation may choose the exact test runner, but each command must be
documented in the repository README or package metadata before the first slice is
complete.

## Example Invocation

Ask a compatible coding agent:

```text
Use wasm-build to inspect this repository and make a build plan for a Rust WASI CLI module.
```

Expected agent behavior:

1. Activates `wasm-build`.
2. Inspects repository evidence before deciding.
3. Produces a build plan using the required fields.
4. Recommends build, validation, test, and runtime commands.
5. Avoids file mutation, dependency installation, project build commands, and
   generated-command execution unless the user explicitly requested execution in
   the current instruction or approves the presented build plan.

## Expected Build Plan Shape

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [
    { "kind": "manifest", "path": "Cargo.toml" },
    { "kind": "source", "path": "src/main.rs" }
  ],
  "intendedEnvironment": "WASI CLI",
  "runtime": "wasi-preview1",
  "target": "wasm32-wasip1",
  "artifactType": "wasi-command",
  "language": "rust",
  "toolchain": "cargo",
  "buildCommand": "cargo build --target wasm32-wasip1",
  "validationCommands": [
    "wasm-tools validate target/wasm32-wasip1/debug/app.wasm",
    "wasmtime run target/wasm32-wasip1/debug/app.wasm"
  ],
  "smokeTestCommand": "wasmtime run target/wasm32-wasip1/debug/app.wasm",
  "filesExpectedToChange": [],
  "risks": [
    { "id": "missing-target", "summary": "Rust WASI target may not be installed" }
  ],
  "fallbackPath": "Confirm installed Rust targets and choose browser or component target if WASI CLI is not intended.",
  "documentationUpdates": [
    "README build command",
    "README runtime assumptions",
    "README validation command"
  ],
  "approvalRequired": true
}
```

## Inspect A Repository

```bash
node skills/wasm-build/scripts/inspect-wasm-project.mjs .
```

Expected output: JSON containing detected languages, build files, Wasm artifacts,
runtime hints, likely targets, and warnings.

## Inspect An Artifact

```bash
node skills/wasm-build/scripts/inspect-wasm-artifact.mjs fixtures/app.wasm
```

Expected output: JSON containing basic artifact facts and validation results.
Missing optional tools are reported as skipped validation steps. Inspection mode
does not execute the artifact.

## Manual Installation Fallback

```bash
mkdir -p .agents/skills
cp -R skills/wasm-build .agents/skills/wasm-build
```

Manual installation is a fallback for environments where `install.sh` cannot be
used.

## Uninstall

Project-local:

```bash
./install.sh wasm-build --uninstall --project
```

Expected output when installed:

```text
Removed wasm-build from /absolute/path/to/wasm-skills/.agents/skills/wasm-build
```

Expected output when missing:

```text
wasm-build is not installed at /absolute/path/to/wasm-skills/.agents/skills/wasm-build
```

Global:

```bash
./install.sh wasm-build --uninstall --global
```

Expected output when installed:

```text
Removed wasm-build from /home/user/.agents/skills/wasm-build
```

Uninstall removes only the exact `wasm-build` destination directory. It never
removes `.agents`, `.agents/skills`, `~/.agents`, or `~/.agents/skills`. v0.1
does not detect locally modified installed files; users who need to preserve
local edits should copy those edits before uninstalling.
