# Implementation Plan: wasm-build Agent Skill

**Branch**: `001-wasm-build-agent-skill` | **Date**: 2026-08-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-wasm-build-agent-skill/spec.md`

## Summary

Create the first installable `wasm-build` Agent Skill. The slice adds the skill
package, read-only inspection scripts, build-plan asset, target/runtime
references, language recipes, failure diagnosis, artifact validation guidance,
examples, eval fixtures, human documentation, and safe project/global
installation.

## Technical Context

**Language/Version**: POSIX shell for installer; Node.js ESM for read-only helper
scripts; Markdown and JSON for skill content and evals.

**Primary Dependencies**: Standard shell utilities available on macOS/Linux;
Node.js runtime for `.mjs` helper scripts; optional external Wasm validators
detected at runtime.

**Storage**: Files in repository and installed skill directories only.

**Testing**: Local validation commands for structure, Markdown/content,
fixture/schema, installer scenarios, script fixtures, and evaluation checks. The
specific internal test framework remains an implementation choice.

**Target Platform**: macOS and Linux first; compatible coding agents discovering
`.agents/skills/wasm-build` or `~/.agents/skills/wasm-build`.

**Project Type**: Agent skill, install script, validation helper, docs/reference
update.

**Performance Goals**: Repository inspection completes in under 5 seconds for
fixture repositories with fewer than 2,000 files.

**Constraints**: Read-only inspection, no hidden file mutation, no hidden
dependency installation, no root permissions, deterministic build-plan structure.

**Scale/Scope**: One first-class skill, one installer, two helper scripts, four
reference files, one build-plan asset, six required examples, two eval files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Agent-skill scope**: Pass. The feature creates only `wasm-build` and
  improves repeatable WebAssembly coding-agent workflows.
- **Repository boundary**: Pass. The work fits the initial repository shape
  centered on `skills/wasm-build/`.
- **Progressive disclosure**: Pass. `SKILL.md` remains compact; detailed content
  goes to references, scripts, assets, examples, and evals.
- **Plan before mutation**: Pass. The build-plan asset and skill workflow require
  planning before project-file changes.
- **Detect/diagnose/validate**: Pass. The feature includes project inspection,
  failure classes, runtime validation, and graceful missing-tool behavior.
- **Installation safety**: Pass. Installer rules avoid root, destructive
  commands, implicit overwrite, and toolchain installation.
- **Documentation and evals**: Pass. README, references, examples, and evals are
  first-slice deliverables.

## Project Structure

### Documentation (this feature)

```text
specs/001-wasm-build-agent-skill/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts.md
├── acceptance.md
├── examples.md
├── quickstart.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
README.md
LICENSE
CONTRIBUTING.md
CHANGELOG.md
install.sh
package.json
fixtures/
└── app.wasm
skills/
└── wasm-build/
    ├── SKILL.md
    ├── README.md
    ├── references/
    │   ├── target-selection.md
    │   ├── language-recipes.md
    │   ├── failure-diagnosis.md
    │   └── runtime-validation.md
    ├── scripts/
    │   ├── inspect-wasm-project.mjs
    │   └── inspect-wasm-artifact.mjs
    ├── assets/
    │   ├── build-plan.template.md
    │   └── build-plan.examples.md
    ├── examples/
    │   ├── rust-browser/
    │   ├── rust-wasi/
    │   ├── rust-component/
    │   ├── tinygo-minimal/
    │   ├── c-wasi-minimal/
    │   └── js-component-minimal/
    └── evals/
        ├── trigger-queries.json
        └── build-cases.json
```

**Structure Decision**: Use the constitution-defined skill package and a compact
root tool/documentation set. The examples expand the constitution's minimal
example names into `rust-browser`, `rust-wasi`, and `rust-component` so Rust
target differences are explicit, while retaining `tinygo-minimal`,
`c-wasi-minimal`, and `js-component-minimal`. No hosted registry, MCP server,
runtime adapter, or new skill is included.

## Complexity Tracking

No constitution violations are required for this slice.

## Phase 0 Research

Research decisions are captured in [research.md](research.md).

## Phase 1 Design

Contracts are captured in [contracts.md](contracts.md). Data models are captured
in [data-model.md](data-model.md). User verification is captured in
[quickstart.md](quickstart.md) and [acceptance.md](acceptance.md).

## Post-Design Constitution Check

- **Agent-skill scope**: Pass after design.
- **Repository boundary**: Pass after design.
- **Progressive disclosure**: Pass after design.
- **Plan before mutation**: Pass after design.
- **Detect/diagnose/validate**: Pass after design.
- **Installation safety**: Pass after design.
- **Documentation and evals**: Pass after design.
