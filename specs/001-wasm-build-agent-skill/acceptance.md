# Acceptance Criteria: wasm-build Agent Skill

## Installation

- **AC-001**: `./install.sh wasm-build --project` creates
  `.agents/skills/wasm-build/SKILL.md` and exits `0`.
- **AC-002**: `./install.sh wasm-build --global` creates
  `~/.agents/skills/wasm-build/SKILL.md` and exits `0`.
- **AC-003**: Installing over an existing destination without `--force` exits
  `3`, preserves existing files, and prints the destination path.
- **AC-004**: Installing over an existing destination with `--force` replaces the
  previous skill directory and exits `0`.
- **AC-005**: Unknown skill names exit `2` with a message such as
  `Unknown skill: rust-build`.
- **AC-006**: Invalid flag combinations exit `2` and print usage.
- **AC-007**: Permission failures exit `4` and identify the path that could not
  be created or written.
- **AC-008**: Successful installation prints an absolute destination line such
  as `Installed wasm-build to /tmp/project/.agents/skills/wasm-build` and
  `Next: ask your coding agent for help building or validating a WebAssembly project.`

## Skill Package

- **AC-009**: `skills/wasm-build/SKILL.md` contains activation frontmatter and
  names all required activation terms from the constitution.
- **AC-010**: `SKILL.md` requires a build plan before mutation and links to the
  four required reference files.
- **AC-011**: `README.md` explains installation, use cases, non-goals, supported
  language priorities, contribution rules, and eval execution.
- **AC-012**: The skill package contains `references/`, `scripts/`, `assets/`,
  `examples/`, and `evals/`.

## Inspection And Planning

- **AC-013**: Project inspection is read-only and does not create, modify, or
  delete files.
- **AC-014**: Project inspection detects Rust, TinyGo, Go, C, C++, Zig,
  JavaScript, Python, and AssemblyScript evidence.
- **AC-015**: Project inspection reports `Cargo.toml`, `go.mod`, `package.json`,
  `CMakeLists.txt`, `Makefile`, `wit/`, `.wasm` artifacts, `spin.toml`,
  Dockerfiles, and CI workflows when present.
- **AC-016**: Every build-plan example includes all mandatory BuildPlan fields.
- **AC-017**: Re-running planning against unchanged inspection input produces
  equivalent BuildPlan content except timestamps or explicitly user-authored
  notes.

## Runtime, Recipes, Diagnosis, Validation

- **AC-018**: The runtime matrix covers Browser, Node, WASI Preview 1, WASI
  Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown
  runtime.
- **AC-019**: Language recipes cover Rust, TinyGo, C, C++, JavaScript, Python,
  Zig, and AssemblyScript with use/avoid guidance, commands, validation, and
  failure classes.
- **AC-020**: Failure diagnosis entries include symptoms, likely causes,
  inspection steps, recommended next action, and unsafe action to avoid.
- **AC-021**: Artifact inspection handles missing optional tools without
  non-zero failure unless the provided artifact path is invalid.
- **AC-022**: Artifact inspection rejects a missing or non-`.wasm` path with exit
  `2` and a clear message.

## Documentation And Evaluation

- **AC-023**: Successful-build guidance recommends README additions, CI command
  additions, toolchain prerequisites, runtime assumptions, and known limitations.
- **AC-024**: Evals contain at least 12 trigger queries, 8 non-trigger queries, 4
  false-positive cases, and 4 false-negative prevention cases.
- **AC-025**: Example documentation covers Rust browser, Rust WASI, Rust
  Component Model, TinyGo, C with wasi-sdk, and JavaScript component workflows.
