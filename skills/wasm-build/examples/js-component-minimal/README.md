# JavaScript Component Example

Repository shape:

```text
package.json
component.json
wit/world.wit
src/index.js
```

Build command:

```bash
jco componentize src/index.js --wit wit/world.wit --out app.component.wasm
```

Validation command:

```bash
jco wit app.component.wasm
```

Expected artifact: Component Model artifact `app.component.wasm`.
