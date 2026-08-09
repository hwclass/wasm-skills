# wasm-build Evaluations

This directory is repository-owned evaluation infrastructure for
`wasm-skills`. It is not a universal Agent Skills schema.

Agent Skills require the installable skill format around `SKILL.md` and bundled
resources. The JSON files here are deterministic, machine-readable quality
checks used by this repository to protect `wasm-build` behavior across intent,
language/toolchain, environment, artifact type, runtime/host, and prerequisite
dimensions.

The fixtures intentionally encode representative supported combinations rather
than every possible language by environment Cartesian product.
