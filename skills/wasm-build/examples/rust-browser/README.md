# Rust Browser Example

Repository shape:

```text
Cargo.toml
src/lib.rs
index.html
```

Build command:

```bash
wasm-pack build --target web
```

Validation command:

```bash
wasm-tools validate pkg/app_bg.wasm
```

Expected artifact: browser-oriented Wasm plus JavaScript glue in `pkg/`.
