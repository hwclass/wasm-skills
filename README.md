# wasm-skills

`wasm-skills` is a curated repository of AI Agent Skills for WebAssembly
workflows. The first installable skill is `wasm-build`, which helps coding
agents inspect projects, select WebAssembly targets, produce build plans,
diagnose failures, validate artifacts, and document successful build paths.

This repository is not a WebAssembly runtime, package manager, hosted registry,
MCP server, marketplace, or build system. It does not install Rust, TinyGo,
wasi-sdk, Emscripten, Wasmtime, WasmEdge, jco, or other heavy toolchains.

## Install

Primary ecosystem installation:

```bash
npx skills add hwclass/wasm-skills --skill wasm-build
```

`hwclass/wasm-skills` is the public Agent Skills ecosystem path for installing
the canonical `skills/wasm-build/SKILL.md` package.

Direct clone/development installation:

```bash
./install.sh wasm-build --project
./install.sh wasm-build --global
```

The `install.sh` commands install the same canonical skill contents from a local
checkout. Use them for development, local testing, or direct-clone workflows.

Use `--force` to replace an existing installed copy:

```bash
./install.sh wasm-build --project --force
```

## Uninstall

Project-local uninstall:

```bash
./install.sh wasm-build --uninstall --project
```

Global uninstall:

```bash
./install.sh wasm-build --uninstall --global
```

Uninstall removes only the exact `wasm-build` skill directory. It never removes
`.agents`, `.agents/skills`, `~/.agents`, or `~/.agents/skills`. v0.1 does not
detect local edits inside an installed copy; save those edits before uninstalling.

## Manual Fallback

```bash
mkdir -p .agents/skills
cp -R skills/wasm-build .agents/skills/wasm-build
```

Manual copying is supported as a fallback. The install script is the recommended
path because it handles destinations and overwrite rules consistently.

## Local Validation

```bash
npm run validate:structure
npm run validate:content
npm run validate:fixtures
npm run test:install
npm run test:scripts
npm run test:evals
npm run validate
```

These commands use only local files and standard Node.js or shell behavior. They
do not install toolchains or execute repository build commands.

## Contributing

Keep `SKILL.md` compact and agent-facing. Add detailed target, language,
diagnosis, and validation guidance under `skills/wasm-build/references/`. Helper
scripts must remain read-only and must never execute project scripts, install
dependencies, or mutate inspected repositories.
