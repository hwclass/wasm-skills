# C With wasi-sdk Example

Repository shape:

```text
Makefile
src/main.c
```

Build command:

```bash
/opt/wasi-sdk/bin/clang --target=wasm32-wasi -o app.wasm src/main.c
```

Validation command:

```bash
wasm-tools validate app.wasm
```

Expected artifact: WASI core module `app.wasm`.
