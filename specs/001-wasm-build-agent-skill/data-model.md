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

**Fields**: `language`, `tier`, `supportedScope`, `useCase`, `whenToUse`,
`whenNotToUse`, `targetChoices`, `prerequisites`, `recommendedCommands`,
`artifactPaths`, `validationCommands`, `smokeTestCommand`, `knownGotchas`,
`failureClasses`, `negativeCase`, `unsupportedOrDeferredScenarios`.

**Relationships**: References Runtimes, Targets, FailureClasses, and
ValidationSteps.

**Constraints**: Tier 1 complete recipes are Rust, TinyGo, C, C++, and
JavaScript. Tier 2 constrained guidance entries are Python, Zig, and
AssemblyScript and must state that parity with Tier 1 is not claimed in v0.1.

## Runtime

**Fields**: `name`, `category`, `whenToChoose`, `whenNotToChoose`,
`supportedOrCommonLanguages`, `recommendedToolchains`, `artifactExpectation`,
`validationStrategy`, `runtimeAssumptions`, `knownPitfalls`, `negativeCase`,
`overlapNotes`.

**Relationships**: Has many Targets and ValidationSteps; used by Recipes and
BuildPlans.

**Constraints**: Required categories are Browser, Node, WASI Preview 1, WASI
Preview 2, Component Model, Wasmtime, WasmEdge, Spin, Extism, and Unknown
runtime. The model must allow overlap because runtimes, hosts, target/interface
categories, and artifact models are not mutually exclusive.

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

**Fields**: `schemaVersion`, `projectRoot`, `languages`, `manifestFiles`,
`buildFiles`, `witFiles`, `wasmArtifacts`, `runtimeConfigs`, `ciFiles`,
`dockerFiles`, `packageScripts`, `toolchainHints`, `warnings`, `truncated`.

**Relationships**: Input to BuildPlan.

**Constraints**: Must be produced without mutations, dependency installation, or
execution of project scripts. `projectRoot` is always present as a resolved
absolute-path string and is never omitted or `null`; discovered file paths are
project-relative POSIX-style paths; arrays are deduplicated and lexicographically
sorted; directory symlinks are not followed; ignored generated/cache directories
are skipped by default; traversal depth, traversed entry count, and output size
are capped; and warnings represent malformed manifests or unreadable
non-critical paths.

## BuildPlan

**Fields**: `schemaVersion`, `projectRoot`, `detectedFacts`,
`intendedEnvironment`, `runtime`, `target`, `artifactType`, `language`,
`toolchain`, `buildCommand`, `validationCommands`, `smokeTestCommand`,
`filesExpectedToChange`, `risks`, `fallbackPath`, `documentationUpdates`,
`approvalRequired`.

**Relationships**: Uses InspectionResult, Runtime, Target, Recipe,
FailureClasses, and ValidationSteps.

**Constraints**: Required before mutation; deterministic for unchanged request
and inspection evidence; field order is canonical; runtime and artifact type use
closed enums; arrays are sorted unless semantic execution order is required; no
timestamps or random identifiers are allowed.

## InstallationTarget

**Fields**: `operation`, `scope`, `destination`, `existsBeforeOperation`,
`force`, `modifiedDetection`, `exitCode`, `message`.

**Relationships**: Installs Skill.

**Constraints**: Supported operations are install and uninstall. Supported
scopes are project and global; project destination is
`.agents/skills/wasm-build`; global destination is
`~/.agents/skills/wasm-build`; overwrite requires `--force`; uninstall removes
only the exact managed skill directory and never removes parent directories.

## ArtifactValidationCommand

**Fields**: `tool`, `arguments`, `timeoutMs`, `stdoutLimitBytes`,
`stderrLimitBytes`, `available`, `status`, `exitCode`, `timedOut`, `stdout`,
`stderr`.

**Relationships**: Used by ValidationStep and Artifact inspection.

**Constraints**: Tool is one of `wasm-tools`, `wasmtime`, `wasm-objdump`, `jco`,
or `file`; commands are invoked without a shell; missing tools are skipped;
inspection mode does not execute the artifact.
