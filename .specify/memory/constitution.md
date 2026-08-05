<!--
Sync Impact Report
Version change: initial template -> 1.0.0
Modified principles:
- Placeholder principle 1 -> I. Agent Skills, Not Runtime Infrastructure
- Placeholder principle 2 -> II. Progressive Disclosure Skill Format
- Placeholder principle 3 -> III. Plan Before Mutation
- Placeholder principle 4 -> IV. Detect, Diagnose, Validate
- Placeholder principle 5 -> V. Simple Installation, Explicit Toolchains
Added sections:
- Product Scope and Repository Boundaries
- Contribution Rules and Quality Gates
Removed sections:
- Placeholder SECTION_2_NAME
- Placeholder SECTION_3_NAME
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/spec-template.md
- Updated: .specify/templates/tasks-template.md
- Pending: .specify/templates/commands/*.md unavailable in this checkout
- Updated: AGENTS.md
Follow-up TODOs: None
-->
# wasm-skills Constitution

## Core Principles

### I. Agent Skills, Not Runtime Infrastructure
`wasm-skills` is a curated repository of AI Agent Skills for WebAssembly workflows.
Each skill MUST help coding agents perform a repeatable, technically bounded
WebAssembly-related task. The repository is not primarily a Wasm runtime,
package manager, model-serving system, cloud platform, hosted marketplace, MCP
registry, or general AI agent framework. Its value is procedural and operational:
make coding agents better at Wasm tasks, reduce build confusion, reduce incorrect
target selection, reduce random dependency installation, reduce broken artifacts,
improve reproducibility, improve error diagnosis, and improve project
documentation.

The first and only first-class skill at ratification is `wasm-build`.
`wasm-build` MUST help coding agents choose the right WebAssembly target,
language toolchain, build command, validation command, runtime expectation, and
failure-diagnosis path before modifying project files. It is not a magical
compiler and MUST NOT hide real toolchains behind fake abstraction.

### II. Progressive Disclosure Skill Format
Every installable skill MUST be a directory containing a required `SKILL.md`.
`SKILL.md` MUST be compact, agent-facing, and include frontmatter with a clear
activation description. Detailed guidance belongs in `references/`, executable
helpers in `scripts/`, templates in `assets/`, sample projects or fixtures in
`examples/`, and behavioral checks in `evals/`.

For `wasm-build`, the `SKILL.md` description MUST mention compiling to
WebAssembly, choosing Wasm targets, WASI Preview 1, WASI Preview 2 / Component
Model, browser Wasm, WIT, wasm-bindgen, Emscripten, wasi-sdk, Wasmtime,
WasmEdge, Extism, Spin, jco, and build failure diagnosis. The file MUST NOT
become a long tutorial or a giant dump of WebAssembly knowledge.

### III. Plan Before Mutation
Coding agents using `wasm-build` MUST produce a build plan before changing
project files. The build plan MUST include the detected language/toolchain,
intended execution environment, target artifact type, recommended build path,
validation command, test command, known risks, files likely to change, and
fallback path if the first build fails.

Agents MUST NOT randomly mutate build commands, dependency files, target triples,
or runtime configuration. A change is acceptable only when it follows from the
build plan, repository evidence, or a classified failure.

### IV. Detect, Diagnose, Validate
Skills MUST instruct agents to inspect the repository before choosing a build
path. For `wasm-build`, detection MUST check relevant evidence such as
`Cargo.toml`, `go.mod`, `package.json`, `Makefile`, `CMakeLists.txt`, `wit/`,
existing `.wasm` files, `spin.toml`, `component.json`, wasm-bindgen output,
jco-related configuration, Dockerfiles, and CI files that encode build
assumptions.

When a build fails, the agent MUST classify the failure before changing
commands. Failure classes include missing target, missing toolchain, unsupported
syscall, wrong WASI preview, missing import, wrong export shape, missing memory
export, wasm-bindgen mismatch, Emscripten versus WASI confusion, Component Model
validation failure, WIT world mismatch, unsupported runtime artifact, browser-only
API usage in a non-browser target, and filesystem/network/environment assumptions
not supported by the target.

Every successful build path MUST include artifact validation. Validation MAY use
available tools such as `wasm-tools validate`, `wasmtime run`, `wasm-objdump`,
`jco wit`, `file`, and runtime-specific smoke tests. Helper scripts MUST degrade
gracefully when tools are not installed, MUST NOT mutate files, MUST NOT install
dependencies, and MUST NOT execute arbitrary project scripts.

### V. Simple Installation, Explicit Toolchains
Users SHOULD be able to install `wasm-build` directly with a simple command.
Manual copying into `.agents/skills/` MUST be supported as a fallback, but it
MUST NOT be the main recommended experience. The first repository slice MUST
provide:

```bash
./install.sh wasm-build --project
./install.sh wasm-build --global
```

Project-local installation MUST install to `./.agents/skills/wasm-build`.
Global installation MUST install to `~/.agents/skills/wasm-build`. Compatible
clients MAY discover the skill from either location.

The install script MUST fail clearly if the skill name does not exist, create
destination directories if needed, refuse to overwrite by default unless
`--force` is provided, print exactly where the skill was installed, print a short
next-step message, avoid root permissions, support macOS and Linux first, avoid
destructive commands, and avoid installing toolchains automatically. Future
package-runner installation such as `npx wasm-skills add wasm-build --project`
or `pnpm dlx wasm-skills add wasm-build --project` MAY be added after the first
slice, but it is not required for v1.

## Product Scope and Repository Boundaries

The initial repository shape is intentionally small and MUST NOT be expanded
without a clear feature specification:

```text
wasm-skills/
  README.md
  LICENSE
  CONTRIBUTING.md
  CHANGELOG.md
  install.sh
  package.json
  skills/
    wasm-build/
      SKILL.md
      README.md
      references/
        target-selection.md
        language-recipes.md
        failure-diagnosis.md
        runtime-validation.md
      scripts/
        inspect-wasm-project.mjs
        inspect-wasm-artifact.mjs
      assets/
        build-plan.template.md
      examples/
        rust-minimal/
        tinygo-minimal/
        c-wasi-minimal/
        js-component-minimal/
      evals/
        trigger-queries.json
        build-cases.json
```

`wasm-build` MUST support coding-agent use cases for Rust to browser Wasm, WASI
Preview 1, WASI Preview 2, and Component Model outputs; TinyGo / Go compatible
Wasm targets; C/C++ through Emscripten or wasi-sdk; JavaScript-to-Wasm-component
workflows such as jco/Javy-style packaging; Python componentization constraints
where relevant; and Zig and AssemblyScript as secondary or later paths.

`references/target-selection.md` MUST include decision tables for browser Wasm,
WASI Preview 1 CLI modules, WASI Preview 2 / Component Model, plugin runtimes,
edge/serverless runtimes, embedded hosts, Node.js-hosted Wasm, browser plus JS
glue, and components with WIT interfaces. Each entry MUST state when to choose
it, when not to choose it, common languages, common tools, validation command,
runtime assumptions, and common failure patterns.

`references/language-recipes.md` MUST include practical recipes for Rust,
TinyGo / Go, C with wasi-sdk, C/C++ with Emscripten, JavaScript
componentization, Python componentization, Zig, and AssemblyScript. Each recipe
MUST include use case, install assumptions, build command, artifact location,
validation command, runtime command, common gotchas, and when to avoid the path.
Rust, TinyGo, C/C++, and JavaScript are first-priority; Python, Zig, and
AssemblyScript MAY be concise in the first version.

`references/failure-diagnosis.md` MUST include diagnostic entries with symptom,
likely cause, what to inspect, safe next action, and unsafe/random action to
avoid. `references/runtime-validation.md` MUST cover browser, Node.js,
Wasmtime, WasmEdge, Spin, Extism, jco/transpiled components, and generic artifact
validation.

The repository MUST NOT initially attempt to compile every language to Wasm
automatically, install Rust, TinyGo, wasi-sdk, Emscripten, Wasmtime, WasmEdge,
jco, or any heavy toolchain automatically, become a Wasm package manager, become
a hosted skill marketplace, become an MCP registry, serve LLMs through Wasm,
replace containers for GPU inference, solve every Wasm runtime problem, create a
broad speculative skill catalog before `wasm-build` works, or generate one giant
`SKILL.md` containing all WebAssembly knowledge.

The first release succeeds only if coding agents become better at choosing,
running, validating, and diagnosing Wasm build workflows.

## Contribution Rules and Quality Gates

Every feature specification MUST state which skill or repository boundary it
changes, why that change improves repeatable WebAssembly agent workflows, and
which non-goals remain out of scope. Specs that add infrastructure beyond the
initial repository shape MUST justify the expansion with working value from
`wasm-build`.

Every implementation plan MUST pass a Constitution Check before research and
again after design. The check MUST verify agent-skill scope, compact skill
format, build-plan-before-mutation behavior, detection and diagnosis coverage,
artifact validation, installation safety, documentation updates, and repository
shape restraint.

Task lists MUST include concrete file paths and must cover documentation,
installation behavior, validation scripts, references, examples, and evals when
the feature changes those surfaces. Tests or evals are required when behavior,
script output, installation semantics, or activation descriptions change.

When a build path succeeds, agent guidance MUST update or suggest updating
project documentation with the build command, validation command, runtime
command, toolchain prerequisites, target assumptions, and known limitations.

Contributions MUST preserve the initial installation philosophy: scripts may
detect missing tools and report next steps, but they MUST NOT install heavy
toolchains automatically or require root permissions.

## Governance

This constitution supersedes conflicting repository practices, generated plans,
and task lists. Pull requests and generated implementation plans MUST document
constitution compliance before code changes are accepted. Any intentional
violation MUST be recorded in the plan complexity table with a reason and the
simpler alternative that was rejected.

Amendments require an explicit constitution update that includes a Sync Impact
Report, a semantic version bump, and propagation to affected templates and
runtime guidance. MAJOR versions apply to backward-incompatible governance or
principle removals/redefinitions. MINOR versions apply to new principles,
sections, or materially expanded guidance. PATCH versions apply to clarifications
and non-semantic wording changes.

The ratification date is the date this initial constitution is adopted. The last
amended date MUST be updated whenever the constitution changes.

**Version**: 1.0.0 | **Ratified**: 2026-08-05 | **Last Amended**: 2026-08-05
