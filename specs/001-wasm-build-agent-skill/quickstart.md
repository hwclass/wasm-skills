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
5. Avoids file mutation until the build plan is accepted or clearly implied by
   the user task.

## Expected Build Plan Shape

```markdown
# WebAssembly Build Plan

Repository:
Request:
Detected language/toolchain:
Repository evidence:
Intended execution environment:
Target artifact type:
Recommended build path:
Build command:
Validation command:
Test command:
Runtime command:
Files likely to change:
Known risks:
Fallback path if first build fails:
Documentation updates:
```

## Inspect A Repository

```bash
node skills/wasm-build/scripts/inspect-wasm-project.mjs .
```

Expected output: JSON containing detected languages, build files, Wasm artifacts,
runtime hints, likely targets, and warnings.

## Inspect An Artifact

```bash
node skills/wasm-build/scripts/inspect-wasm-artifact.mjs path/to/module.wasm
```

Expected output: JSON containing basic artifact facts and validation results.
Missing optional tools are reported as skipped validation steps.

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
rm -rf .agents/skills/wasm-build
```

Global:

```bash
rm -rf ~/.agents/skills/wasm-build
```
