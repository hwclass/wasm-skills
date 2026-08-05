# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., agent skill, install script, validation helper, docs/reference update or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Agent-skill scope**: Feature improves a repeatable WebAssembly coding-agent
  workflow and does not turn the repo into runtime infrastructure, a package
  manager, marketplace, MCP registry, or broad speculative skill catalog.
- **Repository boundary**: Changes fit the intentional initial shape centered on
  `skills/wasm-build/`; any new top-level structure or new skill is justified in
  Complexity Tracking.
- **Progressive disclosure**: `SKILL.md` remains compact and agent-facing;
  detailed guidance, scripts, assets, examples, and evals live in their expected
  subdirectories.
- **Plan before mutation**: Agent workflow requires a build plan before changing
  project files, including target, runtime, validation, risks, changed files, and
  fallback path.
- **Detect/diagnose/validate**: Plan covers repository inspection, failure-class
  diagnosis, artifact validation, and graceful degradation when external tools
  are unavailable.
- **Installation safety**: Install behavior avoids root permissions, destructive
  commands, overwrites without `--force`, automatic heavy toolchain installation,
  and ambiguous destination reporting.
- **Documentation and evals**: Successful build paths, activation behavior,
  install commands, validation commands, and changed recipes/scripts have docs
  and tests or evals appropriate to risk.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
README.md
LICENSE
CONTRIBUTING.md
CHANGELOG.md
install.sh
package.json
skills/
└── wasm-build/
    ├── SKILL.md
    ├── README.md
    ├── references/
    ├── scripts/
    ├── assets/
    ├── examples/
    └── evals/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
