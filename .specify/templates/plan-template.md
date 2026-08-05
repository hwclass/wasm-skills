# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: which Agent Skill or repository boundary changes,
why it improves repeatable WebAssembly coding-agent workflows, and the technical
approach from research.]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with concrete technical
  details for this wasm-skills feature. Do not introduce generic app assumptions.
-->

**Language/Version**: [e.g., POSIX shell installer, Node.js ESM read-only helper,
Markdown/JSON skill content or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., standard macOS/Linux shell utilities, Node.js,
optional Wasm validators detected at runtime or NEEDS CLARIFICATION]

**Storage**: [repository files and installed skill directories only, or N/A]

**Testing**: [local validation commands, eval fixtures, installer scenarios,
script fixtures, contract/schema checks or NEEDS CLARIFICATION]

**Target Platform**: [macOS/Linux, compatible coding agents discovering
`.agents/skills/<skill>` or `~/.agents/skills/<skill>` or NEEDS CLARIFICATION]

**Project Type**: [agent skill, installer, validation helper, docs/reference
update, eval fixture update, distribution-readiness update or NEEDS CLARIFICATION]

**Performance Goals**: [deterministic inspection/runtime bounds, fixture size
targets, output caps, or NEEDS CLARIFICATION]

**Constraints**: [read-only inspection, no hidden mutation, no automatic
toolchain installation, no arbitrary command execution, explicit approval before
build execution, deterministic output, safe install/uninstall or NEEDS
CLARIFICATION]

**Scale/Scope**: [bounded Agent Skill surface: skill directories, references,
scripts, assets, examples, evals, installer, docs, release checklist or NEEDS
CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Agent Skills, Not Runtime Infrastructure**: Feature improves a repeatable,
  technically bounded WebAssembly coding-agent workflow. It does not turn the
  repository into a Wasm runtime, package manager, hosted marketplace, MCP
  registry, model-serving system, cloud platform, generic AI framework, or new
  build system.
- **Progressive Disclosure Skill Format**: Every installable skill remains a
  directory with required `SKILL.md`. `SKILL.md` stays compact and agent-facing;
  detailed guidance lives in `references/`, helpers in `scripts/`, templates in
  `assets/`, examples in `examples/`, and behavioral checks in `evals/`.
- **Plan Before Mutation**: Agent workflow requires a BuildPlan before project
  file changes, dependency installation, project build commands, or generated
  command execution. Plans include detected language/toolchain, intended
  environment, artifact type, build path, validation/test commands, risks, files
  likely to change, and fallback path.
- **Detect, Diagnose, Validate**: Plan covers repository evidence inspection
  before target selection, deterministic inspection output, failure-class
  diagnosis before command changes, artifact validation, missing-tool
  degradation, no project script execution during inspection, and no arbitrary
  command execution.
- **Simple Installation, Explicit Toolchains**: Install behavior preserves the
  distinction between source root and caller project root, supports project and
  global destinations, refuses overwrite without `--force`, reports exact
  destinations, avoids root permissions, avoids automatic toolchain
  installation, and uninstalls only exact managed skill directories.
- **Repository Boundary and Scope Restraint**: Changes fit the intentionally
  small repository shape or justify any expansion in Complexity Tracking. New
  skills, hosted services, registries, GUIs, runtime adapters, package managers,
  and broad speculative catalogs are out of scope unless separately specified.
- **Documentation, Acceptance, and Task Traceability**: Successful build paths,
  activation behavior, install/uninstall behavior, validation commands, changed
  recipes/scripts, negative trigger cases, and edge cases have acceptance
  criteria plus concrete tasks, tests, or evals appropriate to risk.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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

<!--
  ACTION REQUIRED: Replace or trim this tree to match the feature. Keep paths
  concrete. If new top-level directories are added, justify them below.
-->

```text
README.md
LICENSE
CONTRIBUTING.md
CHANGELOG.md
install.sh
package.json
docs/
fixtures/
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
    └── evals/
        ├── trigger-queries.json
        └── build-cases.json
```

**Structure Decision**: [Document the selected concrete structure and why it
preserves progressive disclosure, source-root versus project-local install
semantics, and repository shape restraint.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations or repository-shape expansion
> that must be justified**

| Violation or Expansion | Why Needed | Simpler Alternative Rejected Because |
|------------------------|------------|-------------------------------------|
| [e.g., new top-level docs/] | [release checklist or user-facing docs need] | [why existing README/skill docs were insufficient] |
