# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with edge cases relevant to WebAssembly agent-skill workflows.
-->

- What happens when the expected language toolchain is not installed?
- What happens when repository evidence points to multiple possible Wasm targets?
- How does the skill avoid unsafe mutation or random build-flag changes?
- How does validation degrade when optional tools are unavailable?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability for a bounded WebAssembly agent-skill workflow]
- **FR-002**: System MUST [repository evidence the agent inspects before choosing a path]
- **FR-003**: System MUST [build-plan, target-selection, diagnosis, validation, or documentation behavior]
- **FR-004**: System MUST [installation or file-layout behavior, if changed]
- **FR-005**: System MUST [safe failure/degradation behavior for missing tools or invalid inputs]

*Example of marking unclear requirements:*

- **FR-006**: System MUST support [NEEDS CLARIFICATION: target environment not specified - browser, WASI Preview 1, WASI Preview 2 / Component Model, plugin runtime, edge runtime?]
- **FR-007**: System MUST validate artifacts with [NEEDS CLARIFICATION: validation tool or runtime not specified]

### Constitution Alignment *(mandatory)*

- **Skill Scope**: [Which skill or repository boundary changes, and why this improves repeatable WebAssembly agent workflows]
- **Non-Goals Preserved**: [Runtime infrastructure, package manager, marketplace, MCP registry, automatic heavy toolchain installation, and speculative skill expansion remain out of scope unless explicitly justified]
- **Install Impact**: [Whether `./install.sh wasm-build --project`, `./install.sh wasm-build --global`, or manual fallback behavior changes]
- **Validation Impact**: [Artifact validation, script output, docs, examples, or evals required by this feature]

### Key Entities *(include if feature involves data)*

- **Skill**: [Installable directory with `SKILL.md`, optional references/scripts/assets/examples/evals, and activation metadata]
- **Build Plan**: [Agent-facing plan containing detected toolchain, target artifact, runtime, validation, risks, files likely to change, and fallback path]
- **Validation Result**: [Outcome from static artifact checks, runtime smoke tests, or graceful missing-tool reporting]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Agents produce a complete build plan before file mutation in tested trigger scenarios]
- **SC-002**: [Agents choose the intended Wasm target/runtime for representative repositories]
- **SC-003**: [Validation or diagnosis reports identify actionable next steps without installing heavy toolchains automatically]
- **SC-004**: [Install or documentation workflow succeeds on macOS and Linux paths covered by the feature]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- Coding agents are the primary user of `SKILL.md`; humans use README and contribution docs.
- The first-class installable unit is `skills/wasm-build/`.
- Missing external Wasm tools are reported clearly; they are not installed automatically.
- New infrastructure or new skills require an explicit spec and constitution check.
