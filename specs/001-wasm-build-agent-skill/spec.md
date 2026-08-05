# Feature Specification: wasm-build Agent Skill

**Feature Branch**: `001-wasm-build-agent-skill`

**Created**: 2026-08-05

**Status**: Draft

**Input**: User description: "Implement the first installable Agent Skill, wasm-build, for WebAssembly build planning, validation, and diagnosis."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install and uninstall wasm-build (Priority: P1)

A repository maintainer installs or uninstalls `wasm-build` for the current
project or current user so coding agents discover only the intended installed
skill copy.

**Why this priority**: The first vertical slice is not usable until the skill can
be installed predictably without requiring users to understand skill directory
placement.

**Independent Test**: From a clean checkout, run project/global install and
uninstall commands. Verify that installs create only the expected skill
destination, uninstalls remove only the exact managed skill directory, missing
uninstalls are successful no-ops, no parent directories are removed, no root
permissions are requested, and `--force` controls overwrite behavior for
existing install destinations.

**Acceptance Scenarios**:

1. **Given** a checkout containing `skills/wasm-build`, **When** the user runs
   `./install.sh wasm-build --project`, **Then** the skill is copied to
   `.agents/skills/wasm-build` and the command exits `0`.
2. **Given** `~/.agents/skills/wasm-build` does not exist, **When** the user runs
   `./install.sh wasm-build --global`, **Then** the skill is copied there and the
   command exits `0`.
3. **Given** a destination already exists, **When** the user runs install without
   `--force`, **Then** the command refuses to overwrite, prints the destination,
   and exits `3`.
4. **Given** `.agents/skills/wasm-build` exists, **When** the user runs
   `./install.sh wasm-build --uninstall --project`, **Then** only
   `.agents/skills/wasm-build` is removed and `.agents/skills` remains.
5. **Given** `~/.agents/skills/wasm-build` exists, **When** the user runs
   `./install.sh wasm-build --uninstall --global`, **Then** only
   `~/.agents/skills/wasm-build` is removed and `~/.agents/skills` remains.
6. **Given** the selected install destination does not exist, **When** the user
   runs the matching uninstall command, **Then** the command exits `0` and prints
   that `wasm-build` is not installed at that destination.
7. **Given** the destination already exists, **When** the user runs install with
   `--force`, **Then** only the existing `wasm-build` destination is replaced.

---

### User Story 2 - Generate a build plan before mutation (Priority: P1)

A coding agent invokes the skill while working in a WebAssembly repository and
receives instructions to inspect the repository, infer the intended runtime, and
produce a deterministic build plan before changing files.

**Why this priority**: The central product value is better build decisions before
agents mutate project files or guess at target flags.

**Independent Test**: Present trigger queries for Rust browser, Rust WASI,
TinyGo, C with wasi-sdk, and JavaScript component workflows; verify the skill
requires a build plan containing all mandatory fields before file changes.

**Acceptance Scenarios**:

1. **Given** a Rust project with `Cargo.toml`, **When** the agent is asked to
   compile it to browser Wasm, **Then** the skill requires inspecting the
   repository and producing a build plan that identifies browser Wasm,
   wasm-bindgen assumptions, validation, tests, risks, changed files, and
   fallback path.
2. **Given** repository evidence points to WIT and a component workflow, **When**
   the agent prepares a build plan, **Then** the plan distinguishes WASI Preview
   2 / Component Model from WASI Preview 1 CLI output.

---

### User Story 3 - Diagnose and validate Wasm artifacts (Priority: P1)

A coding agent uses skill references and helper scripts to classify build
failures and validate generated artifacts with available tools.

**Why this priority**: Build success is not enough; agents must know whether the
artifact matches the intended runtime and how to respond to failures.

**Independent Test**: Run artifact inspection and diagnosis scenarios with
available and unavailable validation tools; verify outputs are read-only,
actionable, and explicit about missing tools.

**Acceptance Scenarios**:

1. **Given** a build fails with an unresolved WASI import, **When** the agent uses
   `failure-diagnosis.md`, **Then** it classifies the failure, names likely
   causes, inspects imports/runtime target, recommends a safe next action, and
   identifies unsafe random flag changes to avoid.
2. **Given** `wasm-tools` is not installed, **When** artifact inspection runs,
   **Then** the script reports the unavailable validation step and still returns
   the checks it can perform.

---

### User Story 4 - Document successful build workflows (Priority: P2)

After a build path succeeds, the coding agent recommends concrete documentation
updates so future maintainers can reproduce the workflow.

**Why this priority**: Reproducibility requires preserving the successful build,
validation, runtime, prerequisites, and limitations after the immediate build
task is complete.

**Independent Test**: Complete a simulated build-plan success and verify the
skill prompts for README, CI, toolchain, runtime, and limitations documentation.

**Acceptance Scenarios**:

1. **Given** a Wasmtime CLI build succeeds, **When** the agent finalizes the task,
   **Then** it recommends documenting build command, validation command, runtime
   command, toolchain prerequisites, target assumptions, and known limitations.

### Edge Cases

- The expected language toolchain is not installed.
- The repository contains multiple language markers or multiple plausible Wasm
  targets.
- The repository already contains `.wasm` artifacts whose runtime target is
  unclear.
- Optional validation tools such as `wasm-tools`, `wasmtime`, `wasm-objdump`, or
  `jco` are unavailable.
- An install destination exists and the user did not pass `--force`.
- A user requests automatic compilation, toolchain installation, or runtime
  adapter generation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST contain an installable skill at
  `skills/wasm-build/` with `SKILL.md`, `README.md`, `references/`, `scripts/`,
  `assets/`, `examples/`, and `evals/`.
- **FR-002**: `SKILL.md` MUST provide concise activation frontmatter, a short
  agent workflow, a required build-plan step, links to detailed references, a
  prohibition on random build-command mutation, safe script-use guidance, and
  documentation guidance for successful build paths.
- **FR-003**: `skills/wasm-build/README.md` MUST explain what the skill does,
  what it does not do, installation, activation, supported language priorities,
  recipe contribution rules, and evaluation execution.
- **FR-004**: `references/target-selection.md` MUST define runtime decision
  entries for Browser, Node, WASI Preview 1, WASI Preview 2, Component Model,
  Wasmtime, WasmEdge, Spin, Extism, and Unknown runtime. Each entry MUST include
  `whenToChoose`, `whenNotToChoose`, `supportedOrCommonLanguages`,
  `recommendedToolchains`, `artifactExpectation`, `validationStrategy`,
  `runtimeAssumptions`, `knownPitfalls`, and `negativeCase`, and the document
  MUST explain that these categories can overlap rather than being mutually
  exclusive.
- **FR-005**: `references/language-recipes.md` MUST define recipes for Rust,
  TinyGo, C, C++, JavaScript, Python, Zig, and AssemblyScript. Rust, TinyGo, C,
  C++, and JavaScript are Tier 1 complete recipes. Python, Zig, and
  AssemblyScript are Tier 2 constrained guidance and MUST NOT claim parity with
  Tier 1 in v0.1.
- **FR-006**: `references/failure-diagnosis.md` MUST classify failure classes
  with symptoms, likely causes, inspection steps, recommended next action, and
  unsafe action to avoid.
- **FR-007**: `references/runtime-validation.md` MUST define artifact validation
  flows using available validators and graceful degradation when validators are
  missing.
- **FR-008**: `assets/build-plan.template.md` MUST define the exact build-plan
  structure agents complete before modifying files.
- **FR-009**: `scripts/inspect-wasm-project.mjs` MUST scan the current
  repository read-only and report languages, known build files, likely Wasm
  targets, existing artifacts, WIT files, likely toolchains, Wasm-related package
  scripts, Makefile hints, Dockerfiles, and CI hints using the closed
  InspectionResult contract.
- **FR-010**: `scripts/inspect-wasm-artifact.mjs` MUST inspect a provided `.wasm`
  path, report basic file facts, optionally use available external validation
  tools from the defined allowlist, and degrade gracefully when tools are
  missing.
- **FR-011**: `install.sh wasm-build --project` MUST install to
  `./.agents/skills/wasm-build`.
- **FR-012**: `install.sh wasm-build --global` MUST install to
  `~/.agents/skills/wasm-build`.
- **FR-013**: Installation MUST fail clearly for an unknown skill name, missing
  skill source, missing destination permission, invalid flags, or existing
  destination without `--force`.
- **FR-014**: Installation MUST create destination directories as needed, refuse
  overwrite by default, allow overwrite only with `--force`, print exact install
  path, print a next-step message, avoid root permissions, and avoid installing
  external toolchains.
- **FR-015**: Evaluation fixtures MUST include trigger queries that activate the
  skill, non-trigger queries that do not activate it, false-positive cases, and
  false-negative prevention cases. Non-trigger coverage MUST include native
  non-Wasm compilation, general AI or LLM questions, non-Wasm package-manager
  usage, container or GPU model serving, generic CI configuration, runtime
  hosting without a Wasm build decision, ordinary JavaScript/browser debugging,
  generic Rust build failures with no Wasm target, and WebAssembly conceptual
  questions that do not require build planning.
- **FR-016**: Example specs MUST cover Rust browser, Rust WASI, Rust Component
  Model, TinyGo, C with wasi-sdk, and JavaScript component workflows, each with
  repository shape, build command, validation command, and expected artifact.
- **FR-017**: When a build succeeds, the skill MUST recommend documentation
  updates for README content, CI commands, toolchain prerequisites, runtime
  assumptions, and known limitations.
- **FR-018**: The first slice MUST NOT compile user projects automatically,
  replace language toolchains, become a build system, install heavy toolchains,
  add runtime adapters, expose MCP servers, provide OpenAI tool wrappers, create
  a hosted registry, create a marketplace, create a GUI, or implement CI.
- **FR-019**: The skill MAY inspect files and produce a build plan without
  approval, but MUST NOT modify project files, install dependencies, invoke
  project build commands, or execute generated commands unless the user
  explicitly requested execution in the current instruction or the agent
  presented the build plan and then received explicit approval. Asking for help,
  diagnosis, guidance, or a plan does not authorize mutation or execution.
- **FR-020**: `install.sh` MUST support `./install.sh wasm-build --uninstall --project`
  and `./install.sh wasm-build --uninstall --global`, remove only the exact
  managed `wasm-build` skill directory, never remove parent `.agents` or
  `.agents/skills` directories, treat missing destinations as successful
  no-ops with a clear message, and document whether modified installed files are
  removed or require `--force`.
- **FR-021**: The repository MUST expose documented local validation commands for
  structure validation, Markdown/content checks, fixture/schema checks, installer
  tests, script tests, and evaluation checks. The exact internal tooling remains
  an implementation choice.

### Constitution Alignment *(mandatory)*

- **Skill Scope**: This feature creates the first first-class Agent Skill,
  `wasm-build`, and improves repeatable WebAssembly coding-agent workflows.
- **Non-Goals Preserved**: Runtime infrastructure, package manager behavior,
  marketplaces, MCP registries, automatic heavy toolchain installation, GUI
  surfaces, CI implementation, and speculative skills remain out of scope.
- **Install Impact**: Adds `./install.sh wasm-build --project`,
  `./install.sh wasm-build --global`, project/global uninstall, `--force`, clear
  exit codes, and manual fallback documentation.
- **Validation Impact**: Adds read-only inspection scripts, artifact validation
  guidance, example workflows, and activation evals.

### Key Entities *(include if feature involves data)*

- **Skill**: Installable directory containing `SKILL.md`, human docs, references,
  scripts, assets, examples, and evals.
- **Reference**: A detailed guidance document used by the skill via progressive
  disclosure.
- **Recipe**: A language-specific build path with applicability, commands,
  validation, and failure classes.
- **Runtime**: Intended execution environment category for a Wasm artifact.
- **Target**: Artifact type and ABI expectation selected for a build.
- **FailureClass**: Diagnostic category with symptoms, causes, inspection steps,
  safe next action, and unsafe action to avoid.
- **ValidationStep**: A static or runtime check with tool availability rules and
  expected result.
- **InspectionResult**: Read-only repository or artifact facts used to choose a
  build plan.
- **BuildPlan**: Agent-facing decision record completed before mutation.
- **InstallationTarget**: Project-local or global skill destination with
  overwrite and permission constraints.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of evaluated trigger scenarios, the skill requires a build
  plan before project-file mutation.
- **SC-002**: Repository inspection reports relevant evidence for all required
  language/build markers in under 5 seconds for fixture repositories containing
  fewer than 2,000 files.
- **SC-003**: Installation succeeds for project-local and global destinations on
  macOS and Linux without root permissions.
- **SC-004**: Existing install destinations are preserved unless `--force` is
  provided, with exit code `3` and a message naming the destination.
- **SC-005**: Artifact validation reports actionable results even when all
  optional external validation tools are missing.
- **SC-006**: Evaluation fixtures include at least 12 activation queries, 8
  non-activation queries, 4 false-positive cases, and 4 false-negative prevention
  cases.
- **SC-007**: The first implementation includes complete examples for all six
  required workflows and each example names repository shape, build command,
  validation command, and expected artifact.
- **SC-008**: In 100% of negative approval evals, help-only, diagnosis-only, and
  plan-only requests do not authorize project-file mutation, dependency
  installation, project build commands, or generated-command execution.
- **SC-009**: Project and global uninstall commands are idempotent and preserve
  parent skill directories in 100% of installer tests.
- **SC-010**: Canonical BuildPlan validation rejects missing fields, fields out
  of order, invalid enum values, timestamps, random identifiers, unsorted
  unordered arrays, and environment-specific absolute paths not explicitly
  requested.
- **SC-011**: Repository inspection returns byte-equivalent JSON on repeated runs
  over unchanged fixtures, including fixtures for symlink escape, ignored
  directories, malformed manifests, unreadable files, and traversal truncation.
- **SC-012**: Artifact inspection tests verify no-shell invocation, allowlisted
  commands only, timeout handling, output caps, missing-tool skips, invalid
  artifact reporting, shell-metacharacter paths, and no artifact execution in
  inspection mode.

## Assumptions

- Coding agents are the primary consumers of `SKILL.md`; human contributors use
  README, examples, and references.
- Node.js is acceptable for read-only helper scripts because the requested script
  filenames use `.mjs`.
- External Wasm tools are optional validators; absence of a tool is a reportable
  condition, not a reason to mutate or install dependencies.
- Manual installation remains documented as a fallback, while the install script
  is the recommended path.
- v0.1 uninstall does not attempt modified-install detection; it removes only the
  exact managed skill directory and warns users before documenting the command.
