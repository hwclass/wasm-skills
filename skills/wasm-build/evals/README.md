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

## Integration Evidence

Files under `fixtures/*-evidence.json` are repository-owned proof records for
this repository. They are not a universal Agent Skills schema.

Each route evidence record uses these fields in order:

```text
schemaVersion
routeId
planSummary
authorizationBasis
prerequisiteState
commandsRun
buildResult
validationResult
artifactsProduced
generatedOutputPolicy
remainingGaps
```

Rules:

- `buildResult` is limited to `passed`, `failed`, or `not-run`.
- `validationResult` is limited to `passed`, `failed`, `skipped`, or `not-run`.
- `commandsRun` preserves semantic execution order.
- `artifactsProduced` and `remainingGaps` are lexicographically sorted.
- JSON eval success does not prove route success. At least one route needs real
  build and validation evidence before freeze readiness can pass.
- Optional tool absence is recorded as missing-prerequisite evidence or skipped
  validation, not as route success.
