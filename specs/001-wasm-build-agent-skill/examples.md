# Examples: wasm-build Agent Skill

## Rust Browser

**Repository shape**:

```text
Cargo.toml
src/lib.rs
index.html
```

**Build command**:

```bash
wasm-pack build --target web
```

**Validation command**:

```bash
wasm-tools validate pkg/*_bg.wasm
```

**Expected artifact**: Browser-oriented Wasm plus JavaScript glue in `pkg/`.

## Rust WASI

**Repository shape**:

```text
Cargo.toml
src/main.rs
```

**Build command**:

```bash
cargo build --target wasm32-wasip1
```

**Validation command**:

```bash
wasmtime run target/wasm32-wasip1/debug/app.wasm
```

**Expected artifact**: WASI Preview 1 core module under
`target/wasm32-wasip1/`.

## Rust Component Model

**Repository shape**:

```text
Cargo.toml
wit/world.wit
src/lib.rs
```

**Build command**:

```bash
cargo component build
```

**Validation command**:

```bash
wasm-tools validate target/wasm32-wasip1/debug/app.wasm
```

**Expected artifact**: Component-oriented Wasm artifact compatible with the WIT
world used by the project.

## TinyGo

**Repository shape**:

```text
go.mod
main.go
```

**Build command**:

```bash
tinygo build -target=wasi -o app.wasm .
```

**Validation command**:

```bash
wasmtime run app.wasm
```

**Expected artifact**: WASI-compatible `app.wasm`.

## C With wasi-sdk

**Repository shape**:

```text
Makefile
src/main.c
```

**Build command**:

```bash
/opt/wasi-sdk/bin/clang --target=wasm32-wasi -o app.wasm src/main.c
```

**Validation command**:

```bash
wasm-tools validate app.wasm
```

**Expected artifact**: WASI core module `app.wasm`.

## JavaScript Component Workflow

**Repository shape**:

```text
package.json
component.json
wit/world.wit
src/index.js
```

**Build command**:

```bash
jco componentize src/index.js --wit wit/world.wit --out app.component.wasm
```

**Validation command**:

```bash
jco wit app.component.wasm
```

**Expected artifact**: Component Model artifact `app.component.wasm`.
