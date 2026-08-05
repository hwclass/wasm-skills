# Contributing

Contributions must preserve the project constitution in
`.specify/memory/constitution.md`.

For `wasm-build`:

- Keep `skills/wasm-build/SKILL.md` concise and activation-focused.
- Put detailed guidance in `skills/wasm-build/references/`.
- Keep helper scripts in `skills/wasm-build/scripts/` read-only.
- Add examples under `skills/wasm-build/examples/` only when they document a
  concrete WebAssembly build decision.
- Add or update eval fixtures under `skills/wasm-build/evals/` when activation,
  planning, diagnosis, or validation behavior changes.
- Do not add automatic toolchain installation, runtime adapters, MCP servers,
  hosted registries, package-manager behavior, or new skills without a separate
  approved specification.

Run `npm run validate` before submitting changes.
