# Research: wasm-build Agent Skill

## Decision: Use Agent Skills As The Product Unit

**Decision**: Deliver `wasm-build` as an Agent Skill directory with `SKILL.md`
as the activation surface.

**Rationale**: The repository exists to improve coding-agent behavior during
WebAssembly work. Agent Skills match that goal because they provide procedural
instructions, progressive references, assets, scripts, examples, and evals
without requiring a hosted service or runtime integration.

**Rejected alternatives**:

- Runtime adapter: would solve execution integration, not agent build planning.
- Package manager: would broaden scope before one useful skill exists.
- MCP server or OpenAI tool wrapper: would add infrastructure before the
  procedural skill proves value.

## Decision: Start With wasm-build

**Decision**: The first vertical slice implements only `wasm-build`.

**Rationale**: WebAssembly build failures are often caused by incorrect target
selection, missing toolchain assumptions, runtime mismatch, or invalid artifacts.
An agent-facing build workflow is a narrow, high-value first wedge.

**Rejected alternatives**:

- Multiple first-release skills: would dilute examples, evals, and maintenance.
- Broad AI plus Wasm catalog: would create speculative categories without
  working value.

## Decision: Progressive Disclosure

**Decision**: Keep `SKILL.md` compact and move detailed target, recipe,
diagnosis, and validation guidance into `references/`.

**Rationale**: Coding agents need a quick activation path first, then deeper
material only when the request requires it. Compact instructions reduce trigger
noise and keep future updates reviewable.

**Rejected alternatives**:

- One giant `SKILL.md`: would be harder to scan, harder to maintain, and more
  likely to overload unrelated agent tasks.
- Deep documentation tree: would create navigation cost before the first release
  needs it.

## Decision: Provide install.sh First

**Decision**: Provide `./install.sh wasm-build --project` and
`./install.sh wasm-build --global` in the first slice.

**Rationale**: Users should not need to know exact skill directory placement.
The script can provide predictable project-local and global installs while
manual copy remains documented as a fallback.

**Rejected alternatives**:

- Package runner first: useful later, but unnecessary for the first slice.
- Manual copy only: too much directory-placement burden for the primary path.

## Decision: Do Not Install Toolchains Automatically

**Decision**: The skill and scripts detect missing toolchains and report next
steps, but do not install Rust targets, TinyGo, wasi-sdk, Emscripten, Wasmtime,
WasmEdge, jco, or similar tools.

**Rationale**: Toolchain installation is platform-specific, potentially heavy,
and can mutate user machines in surprising ways. The repository value is better
agent decision-making, not hidden dependency management.

**Rejected alternatives**:

- Auto-install toolchains: would increase risk, require permissions, and violate
  repository boundaries.
- Containerized all-in-one build environment: would become a build system.

## Decision: Inspect Before Planning

**Decision**: Agents must inspect repository evidence before selecting a target
or recommending commands.

**Rationale**: Wasm workflows are target-sensitive. `Cargo.toml`, `go.mod`,
`package.json`, WIT files, Spin config, CI workflows, and existing artifacts
often encode the intended runtime and safer command choices.

**Rejected alternatives**:

- Ask the user for every detail first: slower and unnecessary when evidence is
  available.
- Guess from language alone: unreliable because one language can target browser,
  WASI, components, plugins, embedded hosts, or Node.

## Decision: Deterministic Build Plans

**Decision**: Build plans must follow a fixed field structure and be
deterministic for unchanged request and inspection input.

**Rationale**: Deterministic plans make agent behavior reviewable, comparable,
and testable. They also prevent random flag churn after failures.

**Rejected alternatives**:

- Free-form plan prose: harder to evaluate and easier to omit required risk or
  validation fields.
- Direct command mutation: defeats the core safety value of the skill.
