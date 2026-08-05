---
description: "Tasks for implementing the first wasm-build Agent Skill"
---

# Tasks: wasm-build Agent Skill

**Input**: Design documents from `/specs/001-wasm-build-agent-skill/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts.md,
acceptance.md, examples.md, quickstart.md

**Tests**: Required for approval semantics, installer and uninstall behavior,
inspection schemas, artifact script failure handling, eval fixture shape,
runtime/recipe completeness, local validation commands, and required
documentation presence.

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
- [ ] T003 [P] Add repository-level README overview naming `wasm-build` as the first installable skill
- [ ] T004 [P] Add documented local validation command surface in package.json or equivalent project docs for structure, Markdown/content, fixture/schema, installer, script, and evaluation checks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the stable contracts that all user-story work depends on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create skills/wasm-build/assets/build-plan.template.md with canonical BuildPlan fields in required order
- [ ] T006 Create skills/wasm-build/SKILL.md with activation frontmatter, compact workflow, approval semantics, plan-before-mutation rule, reference links, safe script guidance, and documentation guidance
- [ ] T007 Create skills/wasm-build/README.md covering purpose, non-goals, install, uninstall, activation, language priorities, contribution rules, and eval execution
- [ ] T008 Implement installer contract in install.sh for `wasm-build`, `--project`, `--global`, `--force`, exit codes, success output, and failure output
- [ ] T009 Add installer validation scenarios for success, existing destination without force, existing destination with force, unknown skill, invalid usage, and permission failure
- [ ] T010 Add uninstall command behavior in install.sh for `--uninstall --project`, `--uninstall --global`, exact-directory-only removal, missing destination success, parent-directory preservation, idempotency, and v0.1 modified-install warning
- [ ] T011 Add project/global uninstall validation scenarios for installed and missing destinations, parent preservation, idempotency, and exact managed directory removal

**Checkpoint**: Skill can be installed, uninstalled, discovered, and read by agents.

---

## Phase 3: User Story 1 - Install wasm-build locally (Priority: P1)

**Goal**: Users install or uninstall `wasm-build` project-locally or globally without knowing skill directory placement.

**Independent Test**: Run project/global install and uninstall scenarios in temporary destinations.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add project-local install test fixture and assertions for `.agents/skills/wasm-build/SKILL.md`
- [ ] T013 [P] [US1] Add global install test fixture using isolated HOME and assertions for `.agents/skills/wasm-build/SKILL.md`
- [ ] T014 [P] [US1] Add overwrite refusal and `--force` replacement tests
- [ ] T015 [P] [US1] Add project/global uninstall tests for installed and missing destinations, exact-directory removal, parent-directory preservation, idempotency, and v0.1 modified-install warning

### Implementation for User Story 1

- [ ] T016 [US1] Ensure install.sh creates destination parents and copies only skills/wasm-build/
- [ ] T017 [US1] Ensure install.sh prints exact absolute destination and next-step message on success
- [ ] T018 [US1] Ensure install.sh never requests root and never installs external toolchains
- [ ] T019 [US1] Ensure uninstall removes only exact managed skill directories and never removes `.agents`, `.agents/skills`, `~/.agents`, or `~/.agents/skills`
- [ ] T020 [US1] Document project, global, force, manual fallback, uninstall, idempotent missing uninstall, and modified-install warning flows in README.md and skills/wasm-build/README.md

**Checkpoint**: User Story 1 satisfies AC-001 through AC-012.

---

## Phase 4: User Story 2 - Generate a build plan before mutation (Priority: P1)

**Goal**: Agents inspect repositories and produce deterministic build plans before changing files or executing commands.

**Independent Test**: Run eval cases and repository inspection fixtures for required languages, approval semantics, and target hints.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add inspection fixture cases for Rust, TinyGo, Go, C, C++, Zig, JavaScript, Python, and AssemblyScript
- [ ] T022 [P] [US2] Add positive approval eval case and negative eval cases for help-only, diagnosis-only, and plan-only requests that must not authorize mutation or execution
- [ ] T023 [P] [US2] Add canonical BuildPlan validation for field order, closed enum values, sorted arrays, ordered validation commands, no timestamps, no random identifiers, stable risk IDs, and machine-verifiable example
- [ ] T024 [P] [US2] Add InspectionResult schema tests for symlink escape, ignored directories, stable ordering, traversal truncation, malformed package.json, unreadable file warnings, and byte-equivalent repeated JSON

### Implementation for User Story 2

- [ ] T025 [US2] Implement read-only repository evidence detection in skills/wasm-build/scripts/inspect-wasm-project.mjs
- [ ] T026 [US2] Implement InspectionResult output normalization, ignore rules, traversal depth, file-count and output-size caps, symlink policy, hidden-directory policy, warning behavior, and `truncated` reporting
- [ ] T027 [US2] Add target decision matrix in skills/wasm-build/references/target-selection.md for Browser, Node, WASI Preview 1, WASI Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown runtime
- [ ] T028 [US2] Update SKILL.md and build-plan template with exact approval semantics and canonical BuildPlan fields
- [ ] T029 [US2] Add required BuildPlan examples for Rust browser, Rust WASI, Rust Component Model, TinyGo, C with wasi-sdk, and JavaScript component workflows

**Checkpoint**: User Story 2 satisfies AC-013 through AC-033.

---

## Phase 5: User Story 3 - Diagnose and validate Wasm artifacts (Priority: P1)

**Goal**: Agents classify build failures and validate artifacts with graceful missing-tool handling and safe allowlisted validator invocation.

**Independent Test**: Run artifact inspection fixtures with valid, missing, non-Wasm, unsafe path, timeout, oversized output, and optional-tool-unavailable cases.

### Tests for User Story 3

- [ ] T030 [P] [US3] Add artifact inspection tests for valid `.wasm`, missing path, non-`.wasm` path, unreadable path, missing optional validators, non-regular paths, and paths containing spaces or shell metacharacters
- [ ] T031 [P] [US3] Add artifact validator tests for allowlisted commands, no-shell invocation, argument arrays, timeout, stdout/stderr caps, oversized output, invalid artifact, minimal environment, and no artifact execution in inspection mode
- [ ] T032 [P] [US3] Add failure diagnosis content checks for required fields in every failure class
- [ ] T033 [P] [US3] Add runtime validation content checks for generic validation and all required runtimes
- [ ] T034 [P] [US3] Add runtime matrix completeness check requiring all fields for every runtime category and overlap notes
- [ ] T035 [P] [US3] Add language tier completeness checks for Tier 1 complete recipes and Tier 2 constrained guidance no-parity statements

### Implementation for User Story 3

- [ ] T036 [US3] Implement read-only artifact inspection in skills/wasm-build/scripts/inspect-wasm-artifact.mjs
- [ ] T037 [US3] Implement artifact validator allowlist, timeout, output caps, minimal environment, regular-file validation, skipped missing tools, and inspection-mode no-execution rule
- [ ] T038 [US3] Add failure classes to skills/wasm-build/references/failure-diagnosis.md
- [ ] T039 [US3] Add validation flows to skills/wasm-build/references/runtime-validation.md for browser, Node.js, Wasmtime, WasmEdge, Spin, Extism, jco/transpiled components, and generic artifacts
- [ ] T040 [US3] Split language guidance into Tier 1 complete recipes and Tier 2 constrained guidance in skills/wasm-build/references/language-recipes.md
- [ ] T041 [US3] Expand runtime matrix entries with required fields and overlap explanations in skills/wasm-build/references/target-selection.md

**Checkpoint**: User Story 3 satisfies AC-034 through AC-040.

---

## Phase 6: User Story 4 - Document successful build workflows (Priority: P2)

**Goal**: Agents recommend reproducible documentation updates after successful build paths.

**Independent Test**: Review trigger queries and example workflows for documentation-update prompts and negative trigger boundaries.

### Tests for User Story 4

- [ ] T042 [P] [US4] Add eval cases that require README, CI, toolchain, runtime, and limitation documentation recommendations after successful builds
- [ ] T043 [P] [US4] Add non-trigger eval coverage for native non-Wasm compilation, general AI questions, non-Wasm package-manager usage, container/GPU model serving, generic CI, runtime hosting without build decisions, ordinary JavaScript/browser debugging, generic Rust non-Wasm failures, and conceptual WebAssembly questions
- [ ] T044 [P] [US4] Add content checks for all six required example workflow documents

### Implementation for User Story 4

- [ ] T045 [US4] Add README documentation guidance for successful build commands, validation, runtime, prerequisites, assumptions, and limitations
- [ ] T046 [US4] Create examples/rust-browser/ with repository shape, build command, validation command, and expected artifact
- [ ] T047 [US4] Create examples/rust-wasi/ with repository shape, build command, validation command, and expected artifact
- [ ] T048 [US4] Create examples/rust-component/ with repository shape, build command, validation command, and expected artifact
- [ ] T049 [US4] Create examples/tinygo-minimal/ with repository shape, build command, validation command, and expected artifact
- [ ] T050 [US4] Create examples/c-wasi-minimal/ with repository shape, build command, validation command, and expected artifact
- [ ] T051 [US4] Create examples/js-component-minimal/ with repository shape, build command, validation command, and expected artifact
- [ ] T052 [US4] Add examples note that documented build commands are recommendations and are not executed automatically by the skill

**Checkpoint**: User Story 4 satisfies AC-041 through AC-045.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify completeness, consistency, and repo hygiene.

- [ ] T053 [P] Validate eval JSON files include at least 12 trigger, 8 non-trigger, 4 false-positive, and 4 false-negative prevention cases
- [ ] T054 [P] Validate no implementation guidance asks agents to install heavy toolchains automatically
- [ ] T055 [P] Validate scripts do not mutate files, run project scripts, invoke package installers, import project modules, or execute artifacts in inspection mode
- [ ] T056 [P] Validate every functional requirement maps to at least one acceptance criterion and one task
- [ ] T057 [P] Validate every acceptance criterion maps to at least one validation, evaluation, or implementation task
- [ ] T058 Run install, uninstall, script, docs, JSON, and eval validation commands from the documented local validation surface
- [ ] T059 Run quickstart.md end-to-end in a temporary checkout path
- [ ] T060 Update CHANGELOG.md with first slice summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **US1 Install/Uninstall**: Depends on Foundational.
- **US2 Build Plan**: Depends on Foundational and can proceed in parallel with US1.
- **US3 Diagnosis/Validation**: Depends on Foundational and can proceed in parallel with US1/US2 after script contracts are stable.
- **US4 Documentation**: Depends on US2 and US3 guidance being drafted.
- **Polish**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories after Foundational.
- **User Story 2 (P1)**: No dependency on other user stories after Foundational.
- **User Story 3 (P1)**: Uses the script contract established in Phase 2 and can proceed after T005/T006.
- **User Story 4 (P2)**: Depends on final build-plan, recipe, diagnosis, and validation guidance.

### Parallel Opportunities

- T003 and T004 can run in parallel.
- T012 through T015 can run in parallel.
- T021 through T024 can run in parallel.
- T030 through T035 can run in parallel.
- T046 through T051 can run in parallel after examples pattern is established.
- T053 through T057 can run in parallel.

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete US1 install/uninstall behavior.
3. Complete US2 build-plan workflow and project inspection.
4. Validate project-local install, uninstall, approval semantics, and one Rust WASI planning scenario.

### Full First Slice

1. Complete MVP First.
2. Complete US3 diagnosis and artifact validation.
3. Complete US4 documentation recommendations and examples.
4. Run all acceptance criteria and quickstart validation.

## Notes

- Keep `SKILL.md` compact; move tutorial material into references.
- Keep helper scripts read-only.
- Do not add new skills, hosted services, MCP servers, runtime adapters, GUI,
  automatic toolchain installation, automatic project compilation, or arbitrary
  command execution.
