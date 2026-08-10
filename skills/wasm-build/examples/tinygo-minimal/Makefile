.PHONY: build validate clean

build:
	tinygo build -target=wasi -o app.wasm .

validate:
	wasm-tools validate app.wasm

clean:
	rm -f app.wasm
