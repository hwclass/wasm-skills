# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories must be prioritized and independently testable.
  For this repository, the primary users are coding agents using Agent Skills
  and maintainers installing, validating, or publishing those skills.
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe the coding-agent or maintainer journey in plain language.]

**Why this priority**: [Explain the value for repeatable WebAssembly agent
workflows and why it is the first vertical slice.]

**Independent Test**: [Describe the exact local command, eval, fixture, or manual
verification that proves this story works without relying on other stories.]

**Acceptance Scenarios**:

1. **Given** [repository/skill/install state], **When** [agent or maintainer
   action], **Then** [observable deterministic outcome]
2. **Given** [negative/edge condition], **When** [action], **Then** [safe
   failure or no-mutation outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this journey in plain language.]

**Why this priority**: [Explain ordering and value.]

**Independent Test**: [Describe independent verification.]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this journey in plain language.]

**Why this priority**: [Explain ordering and value.]

**Independent Test**: [Describe independent verification.]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority.]

### Edge Cases

<!--
  ACTION REQUIRED: Replace with feature-specific edge cases. Keep cases
  testable, especially when scripts, installers, activation behavior, or
  approval semantics change.
-->

- What happens when the expected language toolchain or optional validator is not
  installed?
- What happens when repository evidence points to multiple possible Wasm
  targets, runtimes, or artifact types?
- How does the skill avoid project-file mutation, dependency installation,
  project build commands, and generated-command execution without explicit
  current approval?
- How do helper scripts remain read-only and avoid arbitrary command execution?
- How are deterministic inspection output, sorted arrays, output caps, malformed
  manifests, unreadable paths, symlink escapes, and ignored directories handled?
- How does install or uninstall behave for project-local versus global scopes,
  external caller directories, existing destinations, `--force`, missing
  destinations, permission failures, and parent-directory preservation?
- What negative trigger cases prove the skill remains decision-oriented rather
  than becoming an automatic build system?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: Requirements must be precise, testable, and traceable to
  acceptance criteria and tasks. Use MUST for normative behavior. Do not add
  generic application requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability for a bounded WebAssembly
  Agent Skill workflow or repository boundary change].
- **FR-002**: System MUST [skill layout or progressive-disclosure behavior,
  including exact file paths if changed].
- **FR-003**: System MUST [activation, BuildPlan, target-selection, diagnosis,
  validation, documentation, or release-readiness behavior].
- **FR-004**: System MUST [read-only inspection behavior, deterministic output,
  safe validator invocation, or closed contract behavior if changed].
- **FR-005**: System MUST [installer/uninstaller behavior, including
  project-local versus global destination semantics if changed].
- **FR-006**: System MUST [negative trigger, approval-before-mutation, no
  automatic compilation, no automatic toolchain installation, or no arbitrary
  command execution behavior].

*Example of marking unclear requirements:*

- **FR-XXX**: System MUST support [NEEDS CLARIFICATION: intended Wasm runtime not
  specified - browser, Node, WASI Preview 1, WASI Preview 2 / Component Model,
  plugin runtime, edge/serverless runtime, embedded host?]
- **FR-XXX**: System MUST validate artifacts with [NEEDS CLARIFICATION:
  validation tool, static check, smoke-test command, or missing-tool behavior not
  specified]
- **FR-XXX**: `install.sh --project` MUST install to [NEEDS CLARIFICATION:
  caller project root or installer source root?]

### Constitution Alignment *(mandatory)*

- **Skill Scope**: [Which Agent Skill or repository boundary changes, and why
  this improves repeatable WebAssembly coding-agent workflows.]
- **Progressive Disclosure**: [How `SKILL.md` stays compact and which guidance
  belongs in `references/`, `scripts/`, `assets/`, `examples/`, or `evals/`.]
- **Plan Before Mutation**: [How the feature preserves explicit approval before
  file mutation, dependency installation, project build commands, or generated
  command execution.]
- **Detect/Diagnose/Validate**: [Which repository evidence, failure classes,
  validation flows, deterministic contracts, and graceful missing-tool behavior
  are required.]
- **Installation Safety**: [Whether project/global install, uninstall, `--force`,
  destination reporting, source-root versus project-root behavior, or no-root
  behavior changes.]
- **Non-Goals Preserved**: [Runtime infrastructure, package manager behavior,
  hosted marketplace/registry behavior, MCP servers, GUI surfaces, automatic
  toolchain installation, automatic compilation, runtime adapters, and
  speculative skill expansion remain out of scope unless separately justified.]

### Key Entities *(include if feature involves data/contracts)*

- **Skill**: [Installable directory with `SKILL.md`, optional references,
  scripts, assets, examples, evals, and activation metadata.]
- **BuildPlan**: [Agent-facing decision record containing detected toolchain,
  target artifact, runtime, validation/test commands, risks, files likely to
  change, fallback path, and approval requirement.]
- **InspectionResult**: [Read-only repository or artifact facts with stable
  field order, deterministic sorting, normalized paths, warnings, and caps.]
- **ValidationStep**: [Static or runtime check with allowlisted tool, arguments,
  timeout/output limits, status enum, skip behavior, and no artifact execution
  in inspection mode.]
- **InstallationTarget**: [Project-local or global destination, source root,
  caller project root, force flag, exit code, and exact removal behavior.]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable outcomes. Prefer local deterministic checks,
  eval pass rates, schema validation, command exit codes, and acceptance criteria
  over business metrics.
-->

### Measurable Outcomes

- **SC-001**: [100% of relevant trigger scenarios require a BuildPlan before
  project-file mutation.]
- **SC-002**: [Inspection fixtures produce deterministic output and detect the
  required repository evidence within the defined performance bounds.]
- **SC-003**: [Installer/uninstaller scenarios pass for project/global,
  external-directory, overwrite, permission, missing destination, and exact
  parent-preservation cases.]
- **SC-004**: [Artifact validation reports actionable results for valid, invalid,
  missing-tool, timeout, oversized-output, path-with-spaces, shell-metacharacter,
  directory, and non-regular inputs without arbitrary execution.]
- **SC-005**: [Negative trigger and approval evals prevent automatic compilation,
  automatic toolchain installation, project script execution, and mutation for
  help-only, diagnosis-only, guidance-only, or plan-only requests.]
- **SC-006**: [Every functional requirement maps to at least one acceptance
  criterion and one task; every acceptance criterion maps to validation,
  evaluation, or implementation tasks.]

## Assumptions

<!--
  ACTION REQUIRED: Replace or remove assumptions. They must preserve the
  constitution and should not smuggle in new infrastructure or build-system
  scope.
-->

- Coding agents are the primary user of `SKILL.md`; humans use README,
  release, and contribution docs.
- Installable skills are discovered from canonical skill directories such as
  `skills/<skill-name>/`, project-local `.agents/skills/<skill-name>/`, or
  global `~/.agents/skills/<skill-name>/` depending on the workflow.
- Missing external Wasm tools are reported clearly; they are not installed
  automatically.
- Build commands and runtime smoke tests are recommended by plans but are not
  executed unless the current user explicitly requests execution or approves the
  presented plan.
- New infrastructure, new skills, hosted services, registries, MCP servers,
  runtime adapters, GUIs, package-management behavior, or automatic build-system
  behavior require an explicit spec and constitution check.
