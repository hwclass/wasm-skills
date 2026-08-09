# Contracts: wasm-build Agent Skill

## install.sh

**Command shape**:

- `./install.sh wasm-build --project`
- `./install.sh wasm-build --global`
- `./install.sh wasm-build --project --force`
- `./install.sh wasm-build --global --force`
- `./install.sh wasm-build --uninstall --project`
- `./install.sh wasm-build --uninstall --global`
- `./install.sh wasm-build --uninstall --project --force`
- `./install.sh wasm-build --uninstall --global --force`

**Supported skill names**:

- `wasm-build`

**Supported scopes**:

- `--project`: install to `./.agents/skills/wasm-build`
- `--global`: install to `~/.agents/skills/wasm-build`

**Overwrite contract**:

- Existing destination without `--force`: refuse and preserve destination.
- Existing destination with `--force`: replace only the target skill directory.
- Parent directories may be created when missing.

**Uninstall contract**:

- Project uninstall removes only `./.agents/skills/wasm-build`.
- Global uninstall removes only `~/.agents/skills/wasm-build`.
- Missing destination exits `0` and prints
  `wasm-build is not installed at /absolute/path/to/.agents/skills/wasm-build`.
- Uninstall never removes `.agents`, `.agents/skills`, `~/.agents`, or
  `~/.agents/skills`.
- v0.1 does not perform modified-install detection. It prints a warning that the
  exact installed skill directory will be removed and removes only that exact
  directory.
- `--force` is accepted for uninstall for forward compatibility, but is not
  required in v0.1 because modified-install detection is not implemented.
- Re-running uninstall is idempotent and exits `0`.

**Exit codes**:

- `0`: success
- `1`: unexpected runtime failure
- `2`: invalid usage, unknown skill, or missing source skill
- `3`: destination exists and `--force` was not provided
- `4`: destination cannot be created or written

**Success output**:

```text
Installed wasm-build to /absolute/path/to/.agents/skills/wasm-build
Next: ask your coding agent for help building or validating a WebAssembly project.
```

**Failure output examples**:

```text
Unknown skill: rust-build
Usage: ./install.sh wasm-build [--uninstall] (--project|--global) [--force]
Destination already exists: /absolute/path/to/.agents/skills/wasm-build
Permission denied: /absolute/path/to/.agents/skills
Missing skill source: skills/wasm-build
```

## inspect-wasm-project

**Command forms**:

- `node skills/wasm-build/scripts/inspect-wasm-project.mjs`
- `node skills/wasm-build/scripts/inspect-wasm-project.mjs .`
- `node skills/wasm-build/scripts/inspect-wasm-project.mjs fixtures/rust-wasi`

**Default path**: current working directory.

**Mutation contract**: The script is read-only. It must not write files, install
dependencies, execute project scripts, or run build commands.

**Exit codes**:

- `0`: inspection completed
- `2`: invalid path or invalid arguments
- `4`: path cannot be read

**Output format**: Canonical JSON object with these required fields in this
order: `schemaVersion`, `projectRoot`, `languages`, `manifestFiles`,
`buildFiles`, `witFiles`, `wasmArtifacts`, `runtimeConfigs`, `ciFiles`,
`dockerFiles`, `packageScripts`, `toolchainHints`, `warnings`, `truncated`.

**Allowed language values**: `rust`, `tinygo`, `go`, `c`, `cpp`, `zig`,
`javascript`, `python`, `assemblyscript`.

**Normalization and safety rules**:

- `projectRoot` is always present, is a string, and is the resolved absolute path
  to the inspected project root.
- Project-relative POSIX path normalization applies to discovered file paths, not
  to `projectRoot`.
- Arrays are deduplicated and lexicographically sorted.
- The script does not follow directory symlinks.
- The script never inspects outside the resolved project root.
- Default ignored directories are `.git`, `node_modules`, `target`, `dist`,
  `build`, `.venv`, `venv`, `vendor`, `.cache`, `.next`, `.turbo`, and
  `coverage`.
- Known root-level build outputs may be detected without recursively traversing
  ignored trees.
- Traversal depth is capped at 8 directory levels.
- Traversed entries are capped at 10,000.
- Serialized output is capped at 1 MiB.
- If traversal or output limits are reached, `truncated` is `true` and a warning
  explains the limit.
- Unreadable non-critical paths produce warnings rather than failed inspection.
- Malformed manifests produce warnings and do not abort inspection.
- The script never executes package scripts, Make targets, build commands,
  repository binaries, or imports project JavaScript modules.

```json
{
  "schemaVersion": "1.0",
  "projectRoot": "/absolute/project/path",
  "languages": ["javascript", "rust"],
  "manifestFiles": [
    { "type": "cargo", "path": "Cargo.toml" },
    { "type": "package-json", "path": "package.json" }
  ],
  "buildFiles": ["Makefile"],
  "witFiles": ["wit/world.wit"],
  "wasmArtifacts": [
    { "path": "pkg/app_bg.wasm", "bytes": 12345 }
  ],
  "runtimeConfigs": [
    { "type": "spin", "path": "spin.toml" }
  ],
  "ciFiles": [".github/workflows/ci.yml"],
  "dockerFiles": ["Dockerfile"],
  "packageScripts": [
    { "name": "build:wasm", "command": "wasm-pack build" }
  ],
  "toolchainHints": ["wasm32-wasip1"],
  "warnings": [],
  "truncated": false
}
```

## inspect-wasm-artifact

**Command example**:
`node skills/wasm-build/scripts/inspect-wasm-artifact.mjs fixtures/app.wasm`

**Mutation contract**: The script is read-only. It may call external validators
when present, but must not modify the artifact or install missing tools.

**External-command allowlist**:

- `wasm-tools`
- `wasmtime`
- `wasm-objdump`
- `jco`
- `file`

**Invocation contract**:

- Commands are invoked without a shell.
- Arguments are passed as arrays.
- User input is never interpolated into a shell command.
- Timeout is 5 seconds per command.
- Captured stdout is capped at 64 KiB per command.
- Captured stderr is capped at 64 KiB per command.
- Each command result captures `available`, `status`, `exitCode`, `timedOut`,
  `stdout`, and `stderr` separately.
- Allowed status values are `available`, `skipped`, `valid`, `invalid`, `error`,
  and `timeout`.
- Missing optional tools are `skipped`, not fatal.
- Inspection mode never executes the inspected artifact. `wasmtime run` is not
  used unless a future separate execution mode exists and the user has approved
  execution.
- No network resources are loaded.
- The environment is limited to `PATH`, `HOME`, `TMPDIR`, and locale variables.
- Artifact paths may contain spaces or shell metacharacters because no shell is
  used.
- Directories, symlinks, devices, and non-regular files are rejected.

**Exit codes**:

- `0`: artifact inspected
- `2`: missing argument, invalid path, or non-`.wasm` path
- `4`: artifact cannot be read

**Output format**: JSON object.

```json
{
  "schemaVersion": "1.0",
  "artifact": "/absolute/path/module.wasm",
  "bytes": 12345,
  "magic": "0061736d",
  "wasmHeaderValid": true,
  "availableTools": {
    "wasm-tools": false,
    "wasmtime": true,
    "wasm-objdump": false,
    "jco": false,
    "file": true
  },
  "validation": [
    {
      "name": "wasmtime",
      "status": "valid",
      "summary": "Runtime accepted module validation"
    },
    {
      "name": "wasm-tools",
      "status": "skipped",
      "summary": "Tool not found"
    }
  ],
  "imports": [],
  "exports": [],
  "warnings": []
}
```

## Generated BuildPlan

**Format**: Canonical JSON-compatible data embedded in or rendered from
`assets/build-plan.template.md`.

**Required field order**:

- `schemaVersion`
- `projectRoot`
- `detectedFacts`
- `intendedEnvironment`
- `runtime`
- `target`
- `artifactType`
- `language`
- `toolchain`
- `buildCommand`
- `validationCommands`
- `smokeTestCommand`
- `filesExpectedToChange`
- `risks`
- `fallbackPath`
- `documentationUpdates`
- `approvalRequired`

**Runtime enum**: `browser`, `node`, `wasi-preview1`, `wasi-preview2`,
`component-model`, `wasmtime`, `wasmedge`, `spin`, `extism`, `unknown`.

**ArtifactType enum**: `core-module`, `wasi-command`, `component`,
`js-bound-module`, `unknown`.

**ApprovalRequired enum**: `true`, `false`.

**Normalization rules**:

- Paths are project-relative POSIX-style paths unless `projectRoot` is explicitly
  requested.
- Arrays are lexicographically sorted unless semantic execution order is
  required.
- `validationCommands` preserve execution order.
- `risks` are sorted by stable risk identifier.
- Absent optional scalar values use `null`.
- Absent collections use empty arrays.
- Timestamps are forbidden.
- Random identifiers are forbidden.
- Environment-specific absolute paths are forbidden except `projectRoot` when
  explicitly requested.
- Command strings use POSIX shell quoting in documentation, but execution tasks
  must pass argument arrays when scripts invoke external commands.
- Generated prose is excluded from machine-level determinism checks unless
  represented by a stable identifier.

**Machine-verifiable example**:

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

**Approval contract**: `approvalRequired` is `true` for any plan that would
modify files, install dependencies, invoke project build commands, or execute
generated commands. The approval boundary may already be satisfied by an
explicit current user instruction to build, compile, repair, modify, or validate
within the requested project scope; otherwise the agent must ask after
presenting the plan. Environment-level changes such as installing Rust targets,
global tools, or system packages always require separate explicit approval. It
is `false` only for read-only inspection and planning.

## Evaluation Fixtures

**Files**:

- `evals/trigger-queries.json`
- `evals/build-cases.json`

**trigger-queries.json contract**:

```json
{
  "schemaVersion": "1.0",
  "shouldActivate": [
    { "id": "rust-browser", "query": "Build this Rust crate for browser Wasm" }
  ],
  "shouldNotActivate": [
    { "id": "native-rust", "query": "Build this Rust CLI for Linux" }
  ],
  "falsePositiveCases": [],
  "falseNegativePrevention": []
}
```

`shouldNotActivate` MUST include at least one case for each category:

- native non-Wasm compilation
- general AI or LLM questions
- package-manager usage unrelated to Wasm
- container or GPU model serving
- generic CI configuration
- runtime hosting without a Wasm build decision
- ordinary JavaScript/browser debugging
- generic Rust build failures with no Wasm target
- WebAssembly conceptual questions that do not require build planning

**build-cases.json contract**:

```json
{
  "schemaVersion": "1.0",
  "cases": [
    {
      "id": "rust-wasi-preview-1",
      "repositoryShape": ["Cargo.toml", "src/main.rs"],
      "request": "Compile as a WASI CLI module",
      "expectedRuntime": "WASI Preview 1",
      "expectedArtifactType": "core wasm module",
      "expectedValidation": ["wasm-tools validate", "wasmtime run"]
    }
  ]
}
```
