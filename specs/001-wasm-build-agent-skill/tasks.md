---
description: "Tasks for implementing the first wasm-build Agent Skill"
---

# Tasks: wasm-build Agent Skill

**Input**: Design documents from `/specs/001-wasm-build-agent-skill/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts.md,
acceptance.md, examples.md, quickstart.md

**Tests**: Required for installer behavior, inspection scripts, artifact script
failure handling, eval fixture shape, and required documentation presence.

**Organization**: Tasks are grouped by user story so each slice can be completed
and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no
  dependency on another task.
- **[Story]**: Which user story this task belongs to.
- Include exact file paths in descriptions.

## Phase 1: Setup (Shared Skill Structure)

**Purpose**: Establish the repository shape and shared project metadata.

- [ ] T001 Create root files README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE, package.json, and install.sh
- [ ] T002 Create skills/wasm-build/ directory tree with references/, scripts/, assets/, examples/, and evals/
- [ ] T003 [P] Add package.json commands for validating Markdown, JSON, installer scenarios, and script fixtures
- [ ] T004 [P] Add repository-level README overview naming `wasm-build` as the first installable skill

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the stable contracts that all user-story work depends on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create skills/wasm-build/assets/build-plan.template.md with all required BuildPlan fields
- [ ] T006 Create skills/wasm-build/SKILL.md with activation frontmatter, compact workflow, plan-before-mutation rule, reference links, safe script guidance, and documentation guidance
- [ ] T007 Create skills/wasm-build/README.md covering purpose, non-goals, install, activation, language priorities, contribution rules, and eval execution
- [ ] T008 Implement installer contract in install.sh for `wasm-build`, `--project`, `--global`, `--force`, exit codes, success output, and failure output
- [ ] T009 Add installer validation scenarios for success, existing destination without force, existing destination with force, unknown skill, invalid usage, and permission failure

**Checkpoint**: Skill can be installed and discovered, and agents can read the compact activation workflow.

---

## Phase 3: User Story 1 - Install wasm-build locally (Priority: P1)

**Goal**: Users install `wasm-build` project-locally or globally without knowing skill directory placement.

**Independent Test**: Run project and global install scenarios in temporary destinations.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add project-local install test fixture and assertions for `.agents/skills/wasm-build/SKILL.md`
- [ ] T011 [P] [US1] Add global install test fixture using isolated HOME and assertions for `.agents/skills/wasm-build/SKILL.md`
- [ ] T012 [P] [US1] Add overwrite refusal and `--force` replacement tests

### Implementation for User Story 1

- [ ] T013 [US1] Ensure install.sh creates destination parents and copies only skills/wasm-build/
- [ ] T014 [US1] Ensure install.sh prints exact absolute destination and next-step message on success
- [ ] T015 [US1] Ensure install.sh never requests root and never installs external toolchains
- [ ] T016 [US1] Document project, global, force, manual fallback, and uninstall flows in README.md and skills/wasm-build/README.md

**Checkpoint**: User Story 1 satisfies AC-001 through AC-008.

---

## Phase 4: User Story 2 - Generate a build plan before mutation (Priority: P1)

**Goal**: Agents inspect repositories and produce deterministic build plans before changing files.

**Independent Test**: Run eval cases and repository inspection fixtures for required languages and target hints.

### Tests for User Story 2

- [ ] T017 [P] [US2] Add inspection fixture cases for Rust, TinyGo, Go, C, C++, Zig, JavaScript, Python, and AssemblyScript
- [ ] T018 [P] [US2] Add eval trigger queries requiring build plans before mutation
- [ ] T019 [P] [US2] Add BuildPlan template completeness check for all required fields

### Implementation for User Story 2

- [ ] T020 [US2] Implement read-only repository evidence detection in skills/wasm-build/scripts/inspect-wasm-project.mjs
- [ ] T021 [US2] Add target decision matrix in skills/wasm-build/references/target-selection.md for Browser, Node, WASI Preview 1, WASI Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown runtime
- [ ] T022 [US2] Add required BuildPlan examples for Rust browser, Rust WASI, Rust Component Model, TinyGo, C with wasi-sdk, and JavaScript component workflows
- [ ] T023 [US2] Update SKILL.md workflow to require inspection evidence before target selection

**Checkpoint**: User Story 2 satisfies AC-013 through AC-018.

---

## Phase 5: User Story 3 - Diagnose and validate Wasm artifacts (Priority: P1)

**Goal**: Agents classify build failures and validate artifacts with graceful missing-tool handling.

**Independent Test**: Run artifact inspection fixtures with valid, missing, non-Wasm, and optional-tool-unavailable cases.

### Tests for User Story 3

- [ ] T024 [P] [US3] Add artifact inspection tests for valid `.wasm`, missing path, non-`.wasm` path, unreadable path, and missing optional validators
- [ ] T025 [P] [US3] Add failure diagnosis content checks for required fields in every failure class
- [ ] T026 [P] [US3] Add runtime validation content checks for generic validation and all required runtimes

### Implementation for User Story 3

- [ ] T027 [US3] Implement read-only artifact inspection in skills/wasm-build/scripts/inspect-wasm-artifact.mjs
- [ ] T028 [US3] Add failure classes to skills/wasm-build/references/failure-diagnosis.md
- [ ] T029 [US3] Add validation flows to skills/wasm-build/references/runtime-validation.md for browser, Node.js, Wasmtime, WasmEdge, Spin, Extism, jco/transpiled components, and generic artifacts
- [ ] T030 [US3] Add language recipes in skills/wasm-build/references/language-recipes.md for Rust, TinyGo, C, C++, JavaScript, Python, Zig, and AssemblyScript

**Checkpoint**: User Story 3 satisfies AC-019 through AC-022.

---

## Phase 6: User Story 4 - Document successful build workflows (Priority: P2)

**Goal**: Agents recommend reproducible documentation updates after successful build paths.

**Independent Test**: Review trigger queries and example workflows for documentation-update prompts.

### Tests for User Story 4

- [ ] T031 [P] [US4] Add eval cases that require README, CI, toolchain, runtime, and limitation documentation recommendations after successful builds
- [ ] T032 [P] [US4] Add content checks for all six required example workflow documents

### Implementation for User Story 4

- [ ] T033 [US4] Add README documentation guidance for successful build commands, validation, runtime, prerequisites, assumptions, and limitations
- [ ] T034 [US4] Create examples/rust-browser/ with repository shape, build command, validation command, and expected artifact
- [ ] T035 [US4] Create examples/rust-wasi/ with repository shape, build command, validation command, and expected artifact
- [ ] T036 [US4] Create examples/rust-component/ with repository shape, build command, validation command, and expected artifact
- [ ] T037 [US4] Create examples/tinygo-minimal/ with repository shape, build command, validation command, and expected artifact
- [ ] T038 [US4] Create examples/c-wasi-minimal/ with repository shape, build command, validation command, and expected artifact
- [ ] T039 [US4] Create examples/js-component-minimal/ with repository shape, build command, validation command, and expected artifact

**Checkpoint**: User Story 4 satisfies AC-023 through AC-025.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify completeness, consistency, and repo hygiene.

- [ ] T040 [P] Validate eval JSON files include at least 12 trigger, 8 non-trigger, 4 false-positive, and 4 false-negative prevention cases
- [ ] T041 [P] Validate no implementation guidance asks agents to install heavy toolchains automatically
- [ ] T042 [P] Validate scripts do not mutate files, run project scripts, or invoke package installers
- [ ] T043 Run install, script, docs, JSON, and eval validation commands from package.json
- [ ] T044 Run quickstart.md end-to-end in a temporary checkout path
- [ ] T045 Update CHANGELOG.md with first slice summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **US1 Install**: Depends on Foundational.
- **US2 Build Plan**: Depends on Foundational and can proceed in parallel with US1.
- **US3 Diagnosis/Validation**: Depends on Foundational and can proceed in parallel with US1/US2 after script contracts are stable.
- **US4 Documentation**: Depends on US2 and US3 guidance being drafted.
- **Polish**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories.
- **User Story 2 (P1)**: No dependency on other user stories.
- **User Story 3 (P1)**: Uses the same script contract established in Phase 2.
- **User Story 4 (P2)**: Depends on final build-plan, recipe, diagnosis, and validation guidance.

### Parallel Opportunities

- T003 and T004 can run in parallel.
- T010 through T012 can run in parallel.
- T017 through T019 can run in parallel.
- T024 through T026 can run in parallel.
- T034 through T039 can run in parallel after documentation pattern is established.
- T040 through T042 can run in parallel.

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete US1 install behavior.
3. Complete US2 build-plan workflow and project inspection.
4. Validate project-local install and one Rust WASI planning scenario.

### Full First Slice

1. Complete MVP First.
2. Complete US3 diagnosis and artifact validation.
3. Complete US4 documentation recommendations and examples.
4. Run all acceptance criteria and quickstart validation.

## Notes

- Keep `SKILL.md` compact; move tutorial material into references.
- Keep helper scripts read-only.
- Do not add new skills, hosted services, MCP servers, runtime adapters, GUI, or
  automatic toolchain installation.
