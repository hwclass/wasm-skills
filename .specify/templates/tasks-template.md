---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include tests or evals when behavior, script output, installation
semantics, activation descriptions, recipes, or validation guidance changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Skill source**: `skills/wasm-build/`
- **Skill activation**: `skills/wasm-build/SKILL.md`
- **Human docs**: `README.md`, `CONTRIBUTING.md`, `skills/wasm-build/README.md`
- **References**: `skills/wasm-build/references/`
- **Scripts**: `skills/wasm-build/scripts/`
- **Templates/assets**: `skills/wasm-build/assets/`
- **Examples/fixtures**: `skills/wasm-build/examples/`
- **Behavioral checks**: `skills/wasm-build/evals/`
- **Installer**: `install.sh`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Skill Structure)

**Purpose**: Establish or update the intentionally small repository structure

- [ ] T001 Create or update directories specified in the implementation plan
- [ ] T002 Create or update package metadata and local commands in package.json
- [ ] T003 [P] Configure formatting or linting for Markdown and Node.js scripts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define or update `wasm-build` activation frontmatter in skills/wasm-build/SKILL.md
- [ ] T005 [P] Add or update build-plan template in skills/wasm-build/assets/build-plan.template.md
- [ ] T006 [P] Add safe project inspection behavior in skills/wasm-build/scripts/inspect-wasm-project.mjs
- [ ] T007 [P] Add safe artifact inspection behavior in skills/wasm-build/scripts/inspect-wasm-artifact.mjs
- [ ] T008 Add install behavior in install.sh with project/global destinations and `--force`
- [ ] T009 Document graceful missing-tool behavior shared by scripts and recipes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Eval case for [agent trigger/build scenario] in skills/wasm-build/evals/[file].json
- [ ] T011 [P] [US1] Script or install test for [behavior] in [test path]

### Implementation for User Story 1

- [ ] T012 [P] [US1] Update agent workflow in skills/wasm-build/SKILL.md
- [ ] T013 [P] [US1] Update human-facing docs in skills/wasm-build/README.md
- [ ] T014 [US1] Add target-selection or recipe guidance in skills/wasm-build/references/[file].md
- [ ] T015 [US1] Add validation or diagnosis guidance in skills/wasm-build/references/[file].md
- [ ] T016 [US1] Add safe failure handling for user story 1
- [ ] T017 [US1] Document successful commands, target assumptions, and known limitations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Eval case for [agent trigger/build scenario] in skills/wasm-build/evals/[file].json
- [ ] T019 [P] [US2] Script or install test for [behavior] in [test path]

### Implementation for User Story 2

- [ ] T020 [P] [US2] Update skill instructions in skills/wasm-build/SKILL.md
- [ ] T021 [US2] Update relevant reference or recipe file in skills/wasm-build/references/[file].md
- [ ] T022 [US2] Update safe helper script behavior in skills/wasm-build/scripts/[file].mjs
- [ ] T023 [US2] Integrate with User Story 1 guidance without duplicating tutorial content

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Eval case for [agent trigger/build scenario] in skills/wasm-build/evals/[file].json
- [ ] T025 [P] [US3] Script or install test for [behavior] in [test path]

### Implementation for User Story 3

- [ ] T026 [P] [US3] Update reference guidance in skills/wasm-build/references/[file].md
- [ ] T027 [US3] Update examples or fixtures in skills/wasm-build/examples/[example]/
- [ ] T028 [US3] Update docs with validation commands and runtime assumptions

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in README.md, CONTRIBUTING.md, or skills/wasm-build/README.md
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Remove duplicated tutorial detail from SKILL.md and move it to references/
- [ ] TXXX [P] Additional evals for target selection, diagnosis, validation, or install behavior
- [ ] TXXX Installation safety hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Skill activation before detailed references
- Build-plan behavior before mutation-oriented instructions
- Safe script behavior before examples that depend on scripts
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
