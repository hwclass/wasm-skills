# Rust WASI Example

Repository shape:

```text
Cargo.toml
src/main.rs
```

Build command:

```bash
cargo build --target wasm32-wasip1
```

Validation command:

```bash
wasm-tools validate target/wasm32-wasip1/debug/app.wasm
```

Expected artifact: WASI Preview 1 command module under `target/wasm32-wasip1/`.
