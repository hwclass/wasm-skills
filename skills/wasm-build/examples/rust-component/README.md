# Rust Component Example

Repository shape:

```text
Cargo.toml
wit/world.wit
src/lib.rs
```

Build command:

```bash
cargo component build
```

Validation command:

```bash
wasm-tools validate target/wasm32-wasip1/debug/app.wasm
```

Expected artifact: Component Model artifact compatible with the project WIT world.
