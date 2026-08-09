# Execution Intent

Use this reference after activation to decide whether the user is asking for
planning, building, repairing, or validating. These are language-independent and
environment-independent behavior categories, not public APIs. Apply them across
Rust, TinyGo/Go, C, C++, JavaScript, and constrained Tier 2 guidance for Python,
Zig, and AssemblyScript.

Keep these dimensions separate when deciding what to do:

1. user intent
2. source language/toolchain
3. target environment
4. artifact type
5. runtime/host
6. available prerequisites

## PLAN

Typical requests:

- "How should I compile this to Wasm?"
- "Inspect this project and prepare a build plan."
- "Which Wasm target should I use?"

Behavior:

1. Inspect project evidence.
2. Detect source language and existing build metadata.
3. Identify or clarify the intended execution environment.
4. Determine artifact type, runtime/host expectations, and compatible toolchain.
5. Report ambiguity instead of guessing when the environment is unclear.
6. Produce a Wasm Build Plan.
7. Do not modify project files.
8. Do not run build commands.
9. Do not install toolchains or dependencies.

## BUILD

Typical requests:

- "Build this project for browser Wasm."
- "Compile this to WASI and validate it."
- "Build and test the Wasm output."

Behavior:

1. Inspect project evidence first.
2. Produce or internally determine the Wasm Build Plan.
3. Treat the current explicit build, compile, or test request as authorization
   for project-local build and validation commands.
4. Do not ask for redundant approval for the requested build itself.
5. Run the build when required prerequisites already exist.
6. Validate produced artifacts when the build succeeds.
7. Diagnose build failures before changing commands, flags, dependencies, target
   triples, or runtime configuration.

If the intended environment cannot be established safely, ask for clarification
or report ambiguity before building. Do not silently select browser Wasm, WASI,
Component Model, or a runtime based only on language.

If a missing prerequisite would modify the user's environment, stop and ask
first. Project-external or environment-level mutations include adding language
targets, installing build tools, installing validators, installing SDKs such as
wasi-sdk or Emscripten, installing TinyGo, installing jco globally, installing
system packages, or changing user-level runtime/toolchain configuration.
Identify the exact prerequisite, explain why it is needed, ask for explicit
approval, then install only the approved prerequisite before resuming the
original build and validation workflow.

## REPAIR

Typical requests:

- "Fix this project so it builds as Wasm."
- "Make this WebAssembly project reproducible."

Behavior:

1. Inspect project evidence first.
2. Produce or internally determine the Wasm Build Plan.
3. Treat the current explicit fix, repair, or reproducibility request as
   authorization for project-local file changes justified by the plan.
4. Modify only project files required by the repair.
5. Do not install global tools, system packages, language targets, SDKs,
   validators, or user-level toolchain prerequisites without explicit approval.
6. Validate after repair when existing prerequisites allow it.

## VALIDATE

Typical requests:

- "Validate this Wasm artifact."
- "Check whether this component is valid."
- "Inspect this generated .wasm."

Behavior:

1. Inspect and validate existing artifacts.
2. Use only the allowlisted validator behavior in
   `scripts/inspect-wasm-artifact.mjs` unless the user explicitly asks for a
   separate runtime smoke test.
3. Do not rebuild unless validation genuinely requires a build and the user
   explicitly asks for it.
4. Do not execute Wasm artifacts in inspection mode.

## Negative Boundaries

- "How do I build this?" is PLAN intent, not BUILD intent.
- Mentioning `wasm-pack`, `cargo component`, `tinygo`, `wasi-sdk`,
  `Emscripten`, `jco`, `wasm-tools`, or another tool does not authorize
  execution.
- Missing language targets must not be silently installed.
- Missing build tools, validators, SDKs, or global componentization tools must
  not be silently installed.
- Missing system packages must not be silently installed.
- Validation of an existing artifact must not turn into a rebuild.
