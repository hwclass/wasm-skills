# WebAssembly Build Plan

```json
{
  "schemaVersion": "1.0",
  "projectRoot": null,
  "detectedFacts": [],
  "intendedEnvironment": null,
  "runtime": "unknown",
  "target": null,
  "artifactType": "unknown",
  "language": null,
  "toolchain": null,
  "buildCommand": null,
  "validationCommands": [],
  "smokeTestCommand": null,
  "filesExpectedToChange": [],
  "risks": [],
  "fallbackPath": null,
  "documentationUpdates": [],
  "approvalRequired": false
}
```

Use the exact field order. Runtime must be one of `browser`, `node`,
`wasi-preview1`, `wasi-preview2`, `component-model`, `wasmtime`, `wasmedge`,
`spin`, `extism`, or `unknown`. Artifact type must be one of `core-module`,
`wasi-command`, `component`, `js-bound-module`, or `unknown`.

Set `approvalRequired` to `true` for any plan that would modify files, install
dependencies, invoke project build commands, or execute generated commands.
