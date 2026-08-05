# TinyGo Example

Repository shape:

```text
go.mod
main.go
```

Build command:

```bash
tinygo build -target=wasi -o app.wasm .
```

Validation command:

```bash
wasm-tools validate app.wasm
```

Expected artifact: WASI-compatible `app.wasm`.
