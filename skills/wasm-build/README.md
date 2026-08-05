# wasm-build

`wasm-build` is an Agent Skill for coding agents working on WebAssembly build
tasks. It guides target selection, build planning, validation, diagnosis, and
documentation before project files are changed.

It does not compile projects automatically, replace language toolchains, install
dependencies, or become another build system.

## Install

From the `wasm-skills` repository:

```bash
./install.sh wasm-build --project
./install.sh wasm-build --global
```

Use `--force` to replace an existing installed copy. Use uninstall commands to
remove only the exact installed skill directory:

```bash
./install.sh wasm-build --uninstall --project
./install.sh wasm-build --uninstall --global
```

Manual fallback:

```bash
mkdir -p .agents/skills
cp -R skills/wasm-build .agents/skills/wasm-build
```

## When Agents Should Use It

Use this skill for WebAssembly build planning, target selection, validation, and
failure diagnosis across Rust, TinyGo, Go, C, C++, JavaScript, Python, Zig, and
AssemblyScript workflows.

Do not use it for native non-Wasm compilation, general AI questions, non-Wasm
package-manager tasks, generic CI setup, container/GPU model serving, runtime
hosting without a build decision, or conceptual WebAssembly questions that do not
require build planning.

## Language Priorities

Tier 1 complete recipes: Rust, TinyGo, C, C++, JavaScript.

Tier 2 constrained guidance: Python, Zig, AssemblyScript. v0.1 does not claim
Tier 1 parity for Tier 2 languages.

## Contributing Recipes

Recipes must include use/avoid guidance, target choices, prerequisites, build
commands, artifact paths, validation commands, smoke-test command, common failure
classes, and a negative case. Keep commands reproducible and avoid hidden
toolchain installation.

## Evaluations

Run:

```bash
npm run test:evals
npm run validate
```
