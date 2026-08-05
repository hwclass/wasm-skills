# Contracts: wasm-build Agent Skill

## install.sh

**Command shape**: `./install.sh wasm-build --project`,
`./install.sh wasm-build --global`, or either command with `--force`.

**Supported skill names**:

- `wasm-build`

**Supported scopes**:

- `--project`: install to `./.agents/skills/wasm-build`
- `--global`: install to `~/.agents/skills/wasm-build`

**Overwrite contract**:

- Existing destination without `--force`: refuse and preserve destination.
- Existing destination with `--force`: replace only the target skill directory.
- Parent directories may be created when missing.

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
Usage: ./install.sh wasm-build (--project|--global) [--force]
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

**Output format**: JSON object.

```json
{
  "schemaVersion": "1.0",
  "root": "/absolute/project/path",
  "languages": ["rust", "javascript"],
  "buildFiles": [
    { "type": "cargo", "path": "Cargo.toml" },
    { "type": "package-json", "path": "package.json" }
  ],
  "wasmArtifacts": [
    { "path": "pkg/app_bg.wasm", "bytes": 12345 }
  ],
  "witFiles": ["wit/world.wit"],
  "runtimeConfig": [
    { "type": "spin", "path": "spin.toml" }
  ],
  "packageScripts": [
    { "name": "build:wasm", "command": "wasm-pack build" }
  ],
  "makefileHints": ["wasm32-wasip1"],
  "ciHints": [".github/workflows/ci.yml"],
  "dockerfiles": ["Dockerfile"],
  "likelyTargets": ["browser-wasm", "wasi-preview-1"],
  "warnings": []
}
```

## inspect-wasm-artifact

**Command example**:
`node skills/wasm-build/scripts/inspect-wasm-artifact.mjs fixtures/app.wasm`

**Mutation contract**: The script is read-only. It may call external validators
when present, but must not modify the artifact or install missing tools.

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
      "status": "passed",
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

**Format**: Markdown document created from `assets/build-plan.template.md`.

**Required fields**:

- repository
- request
- detected language/toolchain
- repository evidence
- intended execution environment
- target artifact type
- recommended build path
- build command
- validation command
- test command
- runtime command
- files likely to change
- known risks
- fallback path if first build fails
- documentation updates

**Determinism contract**: Given the same request and inspection evidence, the
same agent should produce equivalent plan decisions and commands unless the user
adds new constraints.

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
