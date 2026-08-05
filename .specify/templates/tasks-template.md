---
description: "Task list template for wasm-skills feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories),
research.md, data-model.md, contracts.md, acceptance.md, examples.md,
quickstart.md

**Tests**: Include tests or evals when behavior, script output, installation
semantics, activation descriptions, BuildPlan contracts, InspectionResult
contracts, recipes, validation guidance, release/discovery behavior, or approval
semantics change.

**Organization**: Tasks are grouped by user story so each slice can be completed
and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no
  dependency on another task.
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3).
- Include exact file paths in descriptions.
- Include requirement or acceptance references when a task exists only to prove
  traceability.

## Path Conventions

- **Skill source**: `skills/wasm-build/`
- **Skill activation**: `skills/wasm-build/SKILL.md`
- **Human docs**: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`,
  `skills/wasm-build/README.md`, `docs/`
- **References**: `skills/wasm-build/references/`
- **Scripts**: `skills/wasm-build/scripts/`
- **Templates/assets**: `skills/wasm-build/assets/`
- **Examples/fixtures**: `skills/wasm-build/examples/`, `fixtures/`
- **Behavioral checks**: `skills/wasm-build/evals/`
- **Installer**: `install.sh`
- **Generated local installs**: `.agents/skills/<skill-name>/` are destinations,
  not source. Do not edit or commit generated local install copies.
- **Project-local install root**: caller current project directory.
- **Source root**: checkout containing `install.sh` and `skills/wasm-build/`.

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Functional requirements and acceptance criteria
  - Contracts from contracts.md
  - Entities from data-model.md
  - Quickstart and example verification paths

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Validated through local deterministic commands or evals
  - Delivered as a vertical slice without broadening repository scope

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Skill Structure)

**Purpose**: Establish or update the intentionally small repository structure.

- [ ] T001 Create or update concrete files and directories specified in plan.md
- [ ] T002 Create or update package metadata and documented local validation
  commands in package.json or README.md
- [ ] T003 [P] Update ignore rules for generated local installs, caches, build
  outputs, and local environment files without hiding source material
- [ ] T004 [P] Add or update release/documentation files only when they are
  justified by the feature specification

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Stable contracts, safety rules, and discovery behavior that MUST be
complete before user-story implementation.

**CRITICAL**: No user story work can begin until this phase is complete.

Examples of foundational tasks (adjust based on the feature):

- [ ] T005 Define or update `SKILL.md` activation frontmatter in
  skills/wasm-build/SKILL.md with only supported metadata
- [ ] T006 [P] Add or update canonical BuildPlan template/examples in
  skills/wasm-build/assets/
- [ ] T007 [P] Add or update deterministic InspectionResult and BuildPlan schema
  validation in skills/wasm-build/evals/
- [ ] T008 [P] Add or update read-only project inspection behavior in
  skills/wasm-build/scripts/inspect-wasm-project.mjs
- [ ] T009 [P] Add or update safe artifact inspection behavior in
  skills/wasm-build/scripts/inspect-wasm-artifact.mjs
- [ ] T010 Add or update install/uninstall behavior in install.sh, preserving
  source-root versus project-local destination semantics
- [ ] T011 Document graceful missing-tool behavior, approval gating, and no
  automatic toolchain installation shared by scripts and recipes

**Checkpoint**: Foundation is discoverable, deterministic, read-only where
required, and safe to use for planning.

---

## Phase 3: User Story 1 - [Title] (Priority: P1)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 1

> Write behavior, contract, eval, or install tests before implementation when the
> story changes observable behavior.

- [ ] T012 [P] [US1] Add positive fixture/eval/test for [behavior] in [path]
- [ ] T013 [P] [US1] Add negative or edge-case fixture/eval/test for [behavior]
  in [path]

### Implementation for User Story 1

- [ ] T014 [P] [US1] Update compact agent workflow in
  skills/wasm-build/SKILL.md
- [ ] T015 [P] [US1] Update human-facing docs in README.md or
  skills/wasm-build/README.md
- [ ] T016 [US1] Add or update target-selection, recipe, validation, or
  diagnosis guidance in skills/wasm-build/references/[file].md
- [ ] T017 [US1] Add safe script, installer, asset, example, or eval behavior in
  [exact path]
- [ ] T018 [US1] Document successful commands, validation, runtime assumptions,
  toolchain prerequisites, and known limitations where applicable

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 2

- [ ] T019 [P] [US2] Add positive fixture/eval/test for [behavior] in [path]
- [ ] T020 [P] [US2] Add negative or edge-case fixture/eval/test for [behavior]
  in [path]

### Implementation for User Story 2

- [ ] T021 [P] [US2] Update skill instructions, reference guidance, examples, or
  release docs in [exact path]
- [ ] T022 [US2] Update safe helper script or installer behavior in [exact path]
- [ ] T023 [US2] Integrate with earlier story guidance without duplicating long
  tutorial content in SKILL.md

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 3

- [ ] T024 [P] [US3] Add positive fixture/eval/test for [behavior] in [path]
- [ ] T025 [P] [US3] Add negative or edge-case fixture/eval/test for [behavior]
  in [path]

### Implementation for User Story 3

- [ ] T026 [P] [US3] Update reference guidance in
  skills/wasm-build/references/[file].md
- [ ] T027 [US3] Update examples, fixtures, assets, or evals in [exact path]
- [ ] T028 [US3] Update docs with validation commands, runtime assumptions,
  approval requirements, and limitations

**Checkpoint**: All desired user stories work independently.

---

[Add more user story phases as needed, following the same pattern.]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Validation, traceability, and repo hygiene affecting multiple
stories.

- [ ] TXXX [P] Validate every functional requirement maps to at least one
  acceptance criterion and one task
- [ ] TXXX [P] Validate every acceptance criterion maps to implementation,
  validation, or eval evidence
- [ ] TXXX [P] Validate negative trigger and edge-case coverage for the changed
  skill behavior
- [ ] TXXX [P] Validate no guidance asks agents to install heavy toolchains,
  mutate files, execute project scripts, or run generated commands without
  explicit approval
- [ ] TXXX [P] Validate helper scripts remain read-only, deterministic, capped,
  and free of arbitrary shell execution
- [ ] TXXX [P] Validate installer/uninstaller behavior for project/global scope,
  external project directories, overwrite protection, `--force`, permission
  failure, missing destination, exact-directory-only removal, and destination
  reporting when those surfaces changed
- [ ] TXXX [P] Validate local skill discovery and release-readiness checks when
  distribution documentation changes
- [ ] TXXX Run all documented local validation commands
- [ ] TXXX Run quickstart.md end-to-end in a temporary checkout path when
  quickstart behavior changed
- [ ] TXXX Update CHANGELOG.md or release checklist if required by the feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user
  stories.
- **User Stories (Phase 3+)**: Depend on Foundational. Proceed in priority order
  unless tasks are explicitly independent and file paths do not conflict.
- **Polish (Final Phase)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational and must be independently
  testable.
- **User Story 2 (P2)**: Can start after Foundational; may integrate with US1 but
  must not require broad scope expansion.
- **User Story 3 (P3)**: Can start after Foundational; may integrate with prior
  stories but must remain independently verifiable.

### Within Each User Story

- Tests/evals before implementation when behavior, script output, install
  semantics, activation, contracts, or approval rules change.
- Skill activation before detailed references.
- BuildPlan and approval semantics before mutation-oriented instructions.
- Safe script behavior before examples that depend on scripts.
- Installer source-root/project-root semantics before install examples.
- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- Tasks marked [P] can run in parallel only when they touch different files or do
  not depend on each other.
- Avoid parallel edits to `SKILL.md`, installer contracts, schema examples, or
  shared validation harnesses unless coordination is explicit.
- Different user stories can proceed in parallel after Foundational only when
  their file paths and contracts do not conflict.

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete the highest-priority user story.
3. Validate it independently with local deterministic commands or evals.
4. Stop at the checkpoint if acceptance, contract, or constitution evidence is
   missing.

### Full First Slice

1. Complete MVP First.
2. Complete remaining desired user stories in priority order.
3. Run all acceptance, contract, installer, script, docs, JSON, eval, and
   quickstart validation required by the feature.
4. Confirm no new build-system, registry, toolchain-installer, hosted-service,
   runtime-adapter, GUI, or speculative skill scope was introduced.

## Notes

- Keep `SKILL.md` compact; move tutorial material into references.
- Keep helper scripts read-only and deterministic.
- Do not add new skills, hosted services, MCP servers, runtime adapters, GUIs,
  automatic toolchain installation, automatic project compilation, package
  manager behavior, arbitrary command execution, or marketplace/registry scope
  without an explicit approved spec.
- Do not edit generated `.agents/skills/<skill-name>/` install copies as source.
