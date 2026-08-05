# Data Model: wasm-build Agent Skill

## Skill

**Fields**: `name`, `description`, `sourcePath`, `installablePath`,
`requiredFiles`, `optionalDirectories`, `activationTerms`.

**Relationships**: Has many References, Scripts, Examples, and Evaluation
fixtures.

**Constraints**: `name` is `wasm-build`; `sourcePath` is `skills/wasm-build`;
`SKILL.md` is required; activation terms include the constitution-required Wasm
targets, runtimes, and tools.

## Reference

**Fields**: `path`, `topic`, `audience`, `requiredSections`.

**Relationships**: Belongs to Skill; may reference Recipes, Runtimes,
FailureClasses, and ValidationSteps.

**Constraints**: Required reference files are `target-selection.md`,
`language-recipes.md`, `failure-diagnosis.md`, and `runtime-validation.md`.

## Recipe

**Fields**: `language`, `useCase`, `whenToUse`, `whenNotToUse`,
`installAssumptions`, `recommendedCommands`, `artifactLocation`,
`validationCommand`, `runtimeCommand`, `knownGotchas`, `failureClasses`.

**Relationships**: References Runtimes, Targets, FailureClasses, and
ValidationSteps.

**Constraints**: Required languages are Rust, TinyGo, C, C++, JavaScript,
Python, Zig, and AssemblyScript.

## Runtime

**Fields**: `name`, `category`, `supportedLanguages`, `recommendedToolchain`,
`validationStrategy`, `runtimeAssumptions`, `knownPitfalls`.

**Relationships**: Has many Targets and ValidationSteps; used by Recipes and
BuildPlans.

**Constraints**: Required categories are Browser, Node, WASI Preview 1, WASI
Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown
runtime.

## Target

**Fields**: `name`, `artifactType`, `abiExpectation`, `runtimeCompatibility`,
`commonTools`, `avoidWhen`.

**Relationships**: Belongs to one or more Runtimes; selected by BuildPlan.

**Constraints**: Target must distinguish browser Wasm, WASI Preview 1 core
module, WASI Preview 2 component, plugin artifact, edge/serverless artifact,
embedded-host artifact, Node-hosted artifact, browser plus JS glue, and WIT
component.

## FailureClass

**Fields**: `name`, `symptoms`, `likelyCauses`, `inspectionSteps`,
`recommendedNextAction`, `unsafeActionToAvoid`.

**Relationships**: Referenced by Recipes, Runtime guidance, and BuildPlan risks.

**Constraints**: Must include missing target, missing toolchain, unsupported
syscall, wrong WASI preview, missing import, wrong export shape, missing memory
export, wasm-bindgen mismatch, Emscripten/WASI confusion, Component Model
validation failure, WIT world mismatch, unsupported runtime artifact,
browser-only API in non-browser target, and unsupported filesystem/network/env
assumptions.

## ValidationStep

**Fields**: `name`, `tool`, `commandPattern`, `required`, `skipCondition`,
`successSignal`, `failureSignal`, `fallback`.

**Relationships**: Used by Runtime, Recipe, Artifact inspection, and BuildPlan.

**Constraints**: Missing optional tools produce skipped validation results with
actionable messages; missing artifacts or invalid paths are hard failures.

## InspectionResult

**Fields**: `schemaVersion`, `root`, `languages`, `buildFiles`,
`wasmArtifacts`, `witFiles`, `runtimeConfig`, `packageScripts`, `makefileHints`,
`ciHints`, `dockerfiles`, `likelyTargets`, `warnings`.

**Relationships**: Input to BuildPlan.

**Constraints**: Must be produced without mutations, dependency installation, or
execution of project scripts.

## BuildPlan

**Fields**: `repository`, `request`, `detectedLanguageToolchain`,
`repositoryEvidence`, `intendedExecutionEnvironment`, `targetArtifactType`,
`recommendedBuildPath`, `buildCommand`, `validationCommand`, `testCommand`,
`runtimeCommand`, `filesLikelyToChange`, `knownRisks`, `fallbackPath`,
`documentationUpdates`.

**Relationships**: Uses InspectionResult, Runtime, Target, Recipe,
FailureClasses, and ValidationSteps.

**Constraints**: Required before mutation; deterministic for unchanged request
and inspection evidence.

## InstallationTarget

**Fields**: `scope`, `destination`, `existsBeforeInstall`, `force`,
`exitCode`, `message`.

**Relationships**: Installs Skill.

**Constraints**: Supported scopes are project and global; project destination is
`.agents/skills/wasm-build`; global destination is
`~/.agents/skills/wasm-build`; overwrite requires `--force`.
