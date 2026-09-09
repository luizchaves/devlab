# WebAssembly — JavaScript e `.wasm` lado a lado

Exemplo do tópico [Web APIs: WebAssembly](../../../../src/content/docs/courses/web-api/browser/webassembly.mdx).
A página carrega o módulo `math.wasm`, instancia as funções exportadas e compara o
mesmo algoritmo de Fibonacci escrito em JavaScript e compilado para WebAssembly.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `math.wat` | Fonte legível do módulo, no formato de texto do WebAssembly |
| `math.wasm` | Binário de 109 bytes carregado pelo navegador |
| `build-wasm.mjs` | Gera `math.wasm` sem depender de compilador instalado |
| `index.html` | Página que instancia o módulo e mede os dois tempos |

## Executando

O módulo precisa ser servido por HTTP: `WebAssembly.instantiateStreaming()` não
funciona a partir de `file://`.

```bash
npx serve .
```

Abra o endereço informado e clique em **Comparar**.

## Regerando o binário

```bash
node build-wasm.mjs math.wasm
```

O script escreve as seções do binário à mão, valida o resultado com
`WebAssembly.validate()` e confere `fib()` de 0 a 30 contra uma implementação
equivalente em JavaScript. Com o [wabt](https://github.com/WebAssembly/wabt)
instalado, `wat2wasm math.wat -o math.wasm` produz um binário equivalente a
partir do mesmo fonte.
