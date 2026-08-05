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
- **AC-009**: `./install.sh wasm-build --uninstall --project` removes only
  `.agents/skills/wasm-build`, never removes `.agents` or `.agents/skills`, and
  exits `0`.
- **AC-010**: `./install.sh wasm-build --uninstall --global` removes only
  `~/.agents/skills/wasm-build`, never removes `~/.agents` or
  `~/.agents/skills`, and exits `0`.
- **AC-011**: Uninstalling when the exact destination does not exist exits `0`
  and prints a concrete destination message such as
  `wasm-build is not installed at /tmp/project/.agents/skills/wasm-build`.
- **AC-012**: v0.1 uninstall warns that modified-install detection is not
  performed and removes only the exact managed skill directory.

## Skill Package

- **AC-013**: `skills/wasm-build/SKILL.md` contains activation frontmatter and
  names all required activation terms from the constitution.
- **AC-014**: `SKILL.md` requires a build plan before mutation and links to the
  four required reference files.
- **AC-015**: `README.md` explains installation, use cases, non-goals, supported
  language priorities, contribution rules, and eval execution.
- **AC-016**: The skill package contains `references/`, `scripts/`, `assets/`,
  `examples/`, and `evals/`.
- **AC-017**: For a request that only asks for help, guidance, diagnosis, or a
  build plan, the skill does not authorize project-file mutation, dependency
  installation, project build commands, or generated-command execution.
- **AC-018**: For a request that explicitly says to execute the approved build
  plan, the skill may proceed only after the plan exists and the instruction is
  in the current user request or follows explicit approval.
- **AC-019**: For a request to diagnose a build failure, the skill may inspect
  files and produce diagnosis, but must not run package scripts or build commands
  without explicit approval.
- **AC-020**: For a request to validate an already provided `.wasm` artifact,
  only the safe artifact-inspection script allowlist may be used in inspection
  mode.

## Inspection And Planning

- **AC-021**: Project inspection is read-only and does not create, modify, or
  delete files.
- **AC-022**: Project inspection detects Rust, TinyGo, Go, C, C++, Zig,
  JavaScript, Python, and AssemblyScript evidence.
- **AC-023**: Project inspection reports `Cargo.toml`, `go.mod`, `package.json`,
  `CMakeLists.txt`, `Makefile`, `wit/`, `.wasm` artifacts, `spin.toml`,
  Dockerfiles, and CI workflows when present.
- **AC-024**: Repository inspection does not follow directory symlinks outside
  the resolved project root.
- **AC-025**: Repository inspection ignores default generated/cache directories
  while still detecting known root-level build outputs.
- **AC-026**: Repository inspection returns byte-equivalent JSON on repeated runs
  against the same tree.
- **AC-027**: Repository inspection sets `truncated: true` when traversal or
  output limits are reached.
- **AC-028**: Malformed `package.json` and unreadable non-critical files produce
  warnings instead of failed inspection.
- **AC-029**: Every build-plan example includes all mandatory canonical BuildPlan
  fields in the required order.
- **AC-030**: Re-running planning against unchanged canonical inspection input
  produces byte-equivalent machine-checkable BuildPlan fields with no timestamps,
  random identifiers, or environment-specific absolute paths except explicitly
  requested `projectRoot`.

## Runtime, Recipes, Diagnosis, Validation

- **AC-031**: The runtime matrix covers Browser, Node, WASI Preview 1, WASI
  Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown
  runtime.
- **AC-032**: Every runtime matrix entry includes `whenToChoose`,
  `whenNotToChoose`, `supportedOrCommonLanguages`, `recommendedToolchains`,
  `artifactExpectation`, `validationStrategy`, `runtimeAssumptions`,
  `knownPitfalls`, and `negativeCase`.
- **AC-033**: Runtime guidance explicitly explains overlapping categories:
  Wasmtime/WasmEdge as runtimes, WASI previews as target/interface categories,
  Component Model as an artifact/interface model, Browser/Node as hosts, and
  Spin/Extism as host/plugin expectations.
- **AC-034**: Tier 1 language recipes cover Rust, TinyGo, C, C++, and
  JavaScript with all complete recipe fields.
- **AC-035**: Tier 2 language guidance covers Python, Zig, and AssemblyScript
  with constrained scope and an explicit no-parity statement for v0.1.
- **AC-036**: Failure diagnosis entries include symptoms, likely causes,
  inspection steps, recommended next action, and unsafe action to avoid.
- **AC-037**: Artifact inspection handles missing optional tools without
  non-zero failure unless the provided artifact path is invalid.
- **AC-038**: Artifact inspection rejects a missing or non-`.wasm` path with exit
  `2` and a clear message.
- **AC-039**: Artifact inspection invokes only `wasm-tools`, `wasmtime`,
  `wasm-objdump`, `jco`, or `file`, without a shell, with argument arrays,
  timeout handling, stdout/stderr caps, and separate exit/status capture.
- **AC-040**: Artifact inspection reports command-not-installed, timeout,
  oversized output, invalid artifact, and paths containing spaces or shell
  metacharacters without executing the artifact in inspection mode.

## Documentation And Evaluation

- **AC-041**: Successful-build guidance recommends README additions, CI command
  additions, toolchain prerequisites, runtime assumptions, and known limitations.
- **AC-042**: Evals contain at least 12 trigger queries, 8 non-trigger queries, 4
  false-positive cases, and 4 false-negative prevention cases.
- **AC-043**: Non-trigger evals include native non-Wasm compilation, general AI
  or LLM questions, non-Wasm package-manager usage, container/GPU model serving,
  generic CI configuration, runtime hosting without a Wasm build decision,
  ordinary JavaScript/browser debugging, generic Rust build failures with no Wasm
  target, and conceptual WebAssembly questions that do not require build
  planning.
- **AC-044**: Example documentation covers Rust browser, Rust WASI, Rust
  Component Model, TinyGo, C with wasi-sdk, and JavaScript component workflows.
- **AC-045**: The repository documents local validation commands for structure,
  Markdown/content, fixture/schema, installer, script, and evaluation checks.
