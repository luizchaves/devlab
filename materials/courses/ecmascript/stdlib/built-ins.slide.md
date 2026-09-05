---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Objetos Globais e Nativos"
description: "Slides completos do tópico JavaScript: Objetos Globais e Nativos."
---

<!-- _class: lead -->

# JavaScript: Objetos Globais e Nativos

Os objetos globais restantes do ECMAScript: protocolos de iteração e Iterator Helpers, metaprogramação com Proxy e Reflect, dados binários, referências fracas, a família Intl e os recursos globais de apoio da linguagem.

---

## Objetivo

Completar o mapa da biblioteca padrão do JavaScript:

- Localizar qualquer objeto ou função global e o tópico em que é estudado
- Implementar `Symbol.iterator` e encadear os *Iterator Helpers* do ES2025
- Interceptar operações de objetos com `Proxy`, delegando a `Reflect`
- Manipular memória bruta com `ArrayBuffer`, `TypedArray` e `DataView`
- Empregar `WeakRef` e `FinalizationRegistry` sem depender do Coletor de Lixo
- Formatar texto por idioma com `Intl` e aplicar os globais de apoio

---

## Mapa do Tópico

- O Catálogo de Objetos Globais do ECMAScript
- Protocolos de Iteração e Iterator Helpers (ES2025)
- Metaprogramação com Proxy e Reflect
- Dados Binários: ArrayBuffer, TypedArray e DataView
- Referências Fracas: WeakRef e FinalizationRegistry
- Internacionalização com a Família Intl
- Recursos Globais de Apoio da Linguagem
- Resumo e Boas Práticas

---

## O Catálogo de Objetos Globais

- A **ECMA-262** define um conjunto **fechado** de objetos globais
- São a biblioteca padrão: acessíveis por nome, sem qualquer importação
- Fora dessa lista está o **ambiente hospedeiro** (navegador ou Node.js)
- `fetch()`, `setTimeout()` e `structuredClone()` **não** são ECMAScript
- A `Intl` é o caso particular: pertence à norma irmã **ECMA-402**

---

## Onde Cada Objeto é Estudado no Guia

| Objeto global | Tópico |
| :--- | :--- |
| `String`, `Symbol` | Strings e Template Literals |
| `Number`, `BigInt`, `Math` | Numbers, BigInt e Math |
| `Array` | Arrays e Métodos Funcionais |
| `Object`, `JSON` | Objetos, Classes e Protótipos |
| `Function` | Funções e Closures |
| `Error`, `Promise` | Tratamento de Erros e Promises |
| `Date`, `RegExp` | Date e Expressões Regulares |
| `Map`, `Set`, `WeakMap`, `WeakSet` | Map, Set e Coleções |

---

## Os Objetos Reunidos Neste Tópico

| Objeto ou função | Problema que resolve | Versão |
| :--- | :--- | :--- |
| `Iterator` | Transformação preguiçosa de sequências | ES2025 |
| `Proxy` / `Reflect` | Interceptar e executar operações internas | ES2015 |
| `ArrayBuffer` / `TypedArray` / `DataView` | Memória bruta e protocolos binários | ES2015 |
| `SharedArrayBuffer` / `Atomics` | Memória entre threads | ES2017 |
| `WeakRef` / `FinalizationRegistry` | Referência que não impede a coleta | ES2021 |
| `globalThis` | Objeto global com nome único | ES2020 |
| `encodeURIComponent()` / `eval()` | Escape de URL e avaliação dinâmica | ES3 / ES1 |
| `Intl` | Formatação e comparação por idioma | ECMA-402 |

---

## O Protocolo Iterável

- **Iterável**: objeto com o método `[Symbol.iterator]()`
- **Iterador**: o objeto devolvido, com `next()` produzindo `{ value, done }`
- A separação permite percorrer o mesmo iterável várias vezes

```js
const range = {
  start: 1,
  end: 4,

  *[Symbol.iterator]() {
    for (let value = this.start; value <= this.end; value++) {
      yield value;
    }
  },
};

console.log([...range]); // [ 1, 2, 3, 4 ]
```

---

## Iterator Helpers (ES2025)

- Métodos de `Array` são **ansiosos**: materializam um array por chamada
- Os *Iterator Helpers* são **preguiçosos**: um elemento por vez na cadeia
- O método `take(n)` é o que torna sequências infinitas utilizáveis

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

const oddSquares = naturals()
  .map((n) => n * n)
  .filter((square) => square % 2 === 1)
  .take(4)
  .toArray();

console.log(oddSquares); // [ 1, 9, 25, 49 ]
```

---

## Encadeáveis, Terminais e Construção

| Categoria | Métodos | Comportamento |
| :--- | :--- | :--- |
| **Encadeáveis** | `map`, `filter`, `take`, `drop`, `flatMap` | Devolvem novo iterador preguiçoso |
| **Terminais** | `toArray`, `reduce`, `some`, `every`, `find` | Consomem a sequência e devolvem valor |
| **Construção** | `Iterator.from(iterável)` | Adapta qualquer iterável |

```js
const catalog = new Map([["Notebook", 4500], ["Monitor", 1200], ["Teclado", 350]]);

const premiumTotal = catalog.values()
  .filter((price) => price > 1000)
  .reduce((total, price) => total + price, 0);

console.log(premiumTotal); // 5700
```

**Atenção**: um iterador é consumido **uma única vez**.

---

## Iteração Assíncrona

- `[Symbol.asyncIterator]()` devolve um iterador cujo `next()` produz `Promise`
- O laço `for await...of` aguarda cada elemento antes de entregá-lo
- É o protocolo por trás dos *streams* do Node.js e de APIs paginadas

```js
const pageFetcher = {
  async *[Symbol.asyncIterator]() {
    for (let page = 1; page <= 3; page++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      yield { page, items: [`item_${page}a`, `item_${page}b`] };
    }
  },
};

for await (const chunk of pageFetcher) {
  console.log(`Página ${chunk.page}:`, chunk.items);
}
```

---

## Metaprogramação: o Objeto Proxy

- **Metaprogramação**: código que observa ou altera o comportamento de código
- `new Proxy(target, handler)`: alvo real e manipulador de interceptações
- Cada método do manipulador é uma **armadilha** (*trap*)
- Armadilhas ausentes seguem direto para o alvo, sem alteração

```js
const audited = new Proxy({ name: "Ana" }, {
  get(obj, prop, receiver) {
    console.log(`Leitura da propriedade: ${String(prop)}`);
    return Reflect.get(obj, prop, receiver);
  },
});

console.log(audited.name); // "Leitura da propriedade: name" / "Ana"
```

---

## Armadilhas Mais Utilizadas

| Armadilha | Operação interceptada | Uso típico |
| :--- | :--- | :--- |
| `get` | `proxy.prop` | Valores padrão, registro de leitura |
| `set` | `proxy.prop = value` | Validação de tipo, reatividade |
| `has` | `prop in proxy` | Ocultar propriedades privadas |
| `deleteProperty` | `delete proxy.prop` | Proteger chaves obrigatórias |
| `apply` | `proxy(...args)` | Medir tempo, memoização |
| `construct` | `new proxy(...args)` | Controlar criação de instâncias |

**Limite importante**: quem retém a referência do alvo ignora todas as armadilhas.

---

## O Objeto Reflect

- Expõe os **métodos internos** da linguagem como funções comuns
- Cada armadilha de `Proxy` tem um `Reflect` de assinatura idêntica
- Sinaliza falha por **retorno booleano**, onde `Object` lança `TypeError`

```js
console.log(Reflect.has({ name: "Carlos" }, "name")); // true
console.log(Reflect.ownKeys({ a: 1, [Symbol("id")]: 2 })); // [ 'a', Symbol(id) ]

const frozen = Object.freeze({ status: "ativo" });
console.log(Reflect.set(frozen, "status", "inativo")); // false
console.log(frozen.status); // "ativo"
```

---

## Validação de Escrita com Proxy e Reflect

O `receiver` deve ser repassado para que *getters* herdados resolvam o `this`:

```js
function createValidatedProduct(initial) {
  return new Proxy({ ...initial }, {
    set(target, prop, value, receiver) {
      if (prop === "price" && (typeof value !== "number" || value < 0)) {
        throw new TypeError("O preço deve ser um número não negativo.");
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

const product = createValidatedProduct({ name: "Mouse", price: 120 });
product.price = 150; // aceito
product.price = -10; // TypeError
```

Esse é o mecanismo da reatividade em frameworks modernos.

---

## Dados Binários: Três Camadas

- `ArrayBuffer`: bloco de memória **bruta**, sem tipo e sem acesso direto
- `TypedArray`: visão **homogênea**, números de um único tipo
- `DataView`: visão **heterogênea**, tipos distintos por deslocamento
- Várias visões podem apontar para o mesmo buffer, **sem cópia**

```js
const buffer = new ArrayBuffer(8);

const bytes = new Uint8Array(buffer); // 8 posições de 1 byte
const words = new Uint16Array(buffer); // 4 posições de 2 bytes

bytes[0] = 255;
console.log(words[0]); // 255 (a escrita é imediatamente visível)
```

---

## Construtores de TypedArray

| Construtor | Bytes | Faixa de valores |
| :--- | :--- | :--- |
| `Int8Array` | 1 | $-128$ a $127$ |
| `Uint8Array` | 1 | $0$ a $255$ |
| `Uint8ClampedArray` | 1 | $0$ a $255$, com saturação |
| `Int16Array` / `Uint16Array` | 2 | $-32768$ a $32767$ / $0$ a $65535$ |
| `Int32Array` / `Uint32Array` | 4 | Inteiros de 32 bits |
| `Float32Array` | 4 | Ponto flutuante simples |
| `Float64Array` | 8 | Precisão dupla, igual a `Number` |

O tipo define ao mesmo tempo o consumo de memória e a faixa representável.

---

## Estouro Silencioso em Visões Tipadas

- Valores fora da faixa sofrem truncamento **sem erro nem aviso**
- Não são arrays: `Array.isArray()` devolve `false` e não existe `push()`
- Os métodos funcionais (`map`, `filter`, `reduce`) estão disponíveis

```js
const scores = new Int16Array([120, -80, 340]);
console.log(scores.map((score) => score * 2)); // Int16Array [ 240, -160, 680 ]
console.log(Array.isArray(scores)); // false

const bytes = new Uint8Array(2);
bytes[0] = 255; // valor máximo
bytes[1] = 256; // ultrapassa a faixa e reinicia em zero
console.log(bytes); // Uint8Array(2) [ 255, 0 ]
```

---

## DataView e Endianness

- Protocolos reais misturam tipos: `Uint32`, `Uint16` e `Float32` no mesmo pacote
- Métodos `get*` e `set*` recebem o **deslocamento em bytes**
- Segundo argumento: `false` para *big-endian*, `true` para *little-endian*
- Rede usa *big-endian*; processadores x86 e ARM usam *little-endian*

```js
const view = new DataView(new ArrayBuffer(4));
view.setInt32(0, 1_234_567, false); // escrita em big-endian

console.log(view.getInt32(0, false)); // 1234567 (correto)
console.log(view.getInt32(0, true)); // -2016013824 (bytes invertidos)
```

Ler com a ordem errada **não** lança exceção: devolve outro número.

---

## Memória Compartilhada: SharedArrayBuffer e Atomics

- `SharedArrayBuffer` é referenciado por várias threads, **sem cópia**
- Isso reintroduz a **condição de corrida** clássica da concorrência
- `Atomics` fornece operações **indivisíveis** sobre a memória compartilhada

```js
const counter = new Int32Array(new SharedArrayBuffer(4));

Atomics.add(counter, 0, 5);
Atomics.add(counter, 0, 3);
console.log(Atomics.load(counter, 0)); // 8

console.log(Atomics.compareExchange(counter, 0, 8, 20)); // 8 (valor anterior)
```

No navegador exige isolamento por cabeçalhos `COOP` e `COEP`.

---

## Referências Fracas: WeakRef

- Completa `WeakMap` e `WeakSet` para um **único objeto**
- `deref()` devolve o objeto **ou** `undefined` após a coleta
- Uso legítimo: **cache oportunista**, que aceita perder o valor guardado
- A verificação do retorno é obrigatória em toda leitura

```js
let report = { id: "rel_2026", rows: new Array(1000).fill("linha") };
const cachedReport = new WeakRef(report);

const current = cachedReport.deref();
console.log(current ? `Relatório ${current.id} em memória` : "Já coletado");

report = null; // a partir daqui, deref() pode devolver undefined
```

---

## Referências Fracas: FinalizationRegistry

- Executa uma limpeza **depois** que o objeto registrado for coletado
- O segundo argumento é um **rótulo**, nunca o próprio objeto
- Passar o objeto criaria referência forte e impediria a coleta observada

```js
const registry = new FinalizationRegistry((label) => {
  console.log(`Recurso liberado: ${label}`);
});

let connection = { host: "db.local", socket: 42 };
registry.register(connection, "conexão db.local");

connection = null; // a função pode ser chamada muito depois, ou nunca
```

**A especificação não garante a execução**: use `try...finally` para liberar recursos.

---

## A Família Intl

| Construtor | Finalidade | Erro que evita |
| :--- | :--- | :--- |
| `Intl.Collator` | Comparar e ordenar strings | Acentos ordenados pelo código Unicode |
| `Intl.PluralRules` | Escolher a forma plural | `if (n === 1)` quebrando fora do português |
| `Intl.ListFormat` | Unir itens em enumeração | Concatenação manual com conjunção fixa |
| `Intl.DisplayNames` | Traduzir códigos padronizados | Dicionários mantidos à mão |
| `Intl.Segmenter` | Dividir em palavras e grafemas | `.length` incorreto com emoji |

`Intl.NumberFormat` e `Intl.DateTimeFormat` foram vistos em Numbers e Date.

---

## Ordenação com Intl.Collator

- `sort()` sem argumentos compara **pontos de código Unicode**
- Letras acentuadas ficam acima de `A-Z` e vão para o fim da lista

```js
const names = ["Ana", "álvaro", "Zoe", "Ácaro"];

console.log([...names].sort());
// [ 'Ana', 'Zoe', 'Ácaro', 'álvaro' ]  (incorreto em português)

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
console.log([...names].sort(collator.compare));
// [ 'Ácaro', 'álvaro', 'Ana', 'Zoe' ]  (correto)

console.log(new Intl.Collator("pt-BR", { numeric: true }).compare("item2", "item10"));
// -1 (item2 vem antes de item10)
```

---

## Pluralização com Intl.PluralRules

- Devolve a **categoria** gramatical: `zero`, `one`, `two`, `few`, `many`, `other`
- Cada idioma usa apenas um subconjunto dessas categorias

```js
const ptRules = new Intl.PluralRules("pt-BR");
console.log(ptRules.select(0), ptRules.select(1), ptRules.select(2));
// one one other

const messages = { one: "mensagem nova", other: "mensagens novas" };
const describe = (count) => `${count} ${messages[ptRules.select(count)]}`;

console.log(describe(1)); // "1 mensagem nova"
console.log(describe(5)); // "5 mensagens novas"
```

---

## Listas, Nomes e Segmentação

```js
const andList = new Intl.ListFormat("pt-BR", { type: "conjunction" });
console.log(andList.format(["HTML", "CSS", "JavaScript"])); // "HTML, CSS e JavaScript"

const orList = new Intl.ListFormat("pt-BR", { type: "disjunction" });
console.log(orList.format(["pix", "cartão"])); // "pix ou cartão"

console.log(new Intl.DisplayNames(["pt-BR"], { type: "region" }).of("BR")); // "Brasil"
console.log(new Intl.DisplayNames(["pt-BR"], { type: "currency" }).of("BRL")); // "Real brasileiro"

const text = "família 👨‍👩‍👧";
console.log(text.length); // 16 (unidades UTF-16)
const graphemes = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
console.log([...graphemes.segment(text)].length); // 9 (símbolos visíveis)
```

---

## globalThis

- Antes: `window` no navegador, `self` em Workers, `global` no Node.js
- O **ES2020** padronizou um nome único para o objeto global
- É a forma correta de detectar recursos sem provocar `ReferenceError`

```js
console.log(typeof globalThis); // "object"
console.log(globalThis === global); // true (no Node.js)

const isBrowser = typeof globalThis.window !== "undefined";
console.log(isBrowser); // false no Node.js

console.log(typeof globalThis.Proxy); // "function"
```

---

## Codificação de URI

| Função | Entrada esperada | Trata `&`, `=`, `/`, `?` |
| :--- | :--- | :--- |
| `encodeURI()` | URL completa, já montada | Não, preserva a estrutura |
| `encodeURIComponent()` | Um único valor | Sim, escapa tudo |

```js
const term = "café & bar 100%";

// Correto: escapa apenas o valor
console.log(`https://api.dev/busca?q=${encodeURIComponent(term)}`);
// "https://api.dev/busca?q=caf%C3%A9%20%26%20bar%20100%25"

// Incorreto: o '&' sobrevive e o servidor lê dois parâmetros
console.log(encodeURI(`https://api.dev/busca?q=${term}`));
```

Sequência percentual malformada lança `URIError`.

---

## A Função eval()

- Interpreta uma string como código-fonte e devolve a última expressão
- **Segurança**: texto externo avaliado é execução remota de código
- **Desempenho**: impede otimizações, pois o código só existe na chamada
- `new Function(...)` carrega exatamente o mesmo risco

```js
console.log(eval("2 + 3 * 4")); // 14

// Alternativas corretas:
console.log(JSON.parse('{"total": 42}').total); // 42 (texto em dados)

const settings = { theme: "dark" };
const key = "theme";
console.log(settings[key]); // "dark" (propriedade dinâmica)
```

---

## Resumo e Boas Práticas

| Prática | Motivo técnico |
| :--- | :--- |
| Preferir geradoras a iteradores manuais | Dispensa o controle de `{ value, done }` |
| Usar Iterator Helpers em fontes longas | Evita arrays intermediários; `take(n)` encerra |
| Chamar `Reflect` em toda armadilha | Preserva o `receiver` e *getters* herdados |
| Manter o alvo do `Proxy` fora de alcance | Quem tem o *target* ignora as armadilhas |
| Escolher `TypedArray` pela faixa | O estouro é silencioso: `256` vira `0` |
| Declarar a *endianness* no `DataView` | Omitir assume *little-endian*, oposto da rede |
| Não depender de `WeakRef` para correção | A coleta é não determinística |
| Delegar idioma ao `Intl` | `sort()` puro e condicionais de plural falham |
| Trocar `eval()` por `JSON.parse()` | Avaliar texto externo é execução remota |

---

## Executando: Demonstração no Terminal

1. Crie o arquivo `builtins-demo.js`:
```js
function* readings() {
  let sensor = 1;
  while (true) yield { sensor: sensor++, celsius: 18 + (sensor % 12) };
}

const alerts = readings()
  .filter((reading) => reading.celsius > 26)
  .take(3)
  .toArray();

console.log("Alertas:", alerts.length);
console.log(new Intl.ListFormat("pt-BR").format(["norte", "sul", "leste"]));
```
2. Execute no terminal:
```bash
$ node builtins-demo.js
Alertas: 3
norte, sul e leste
```

---

## Exercício Prático: Configuração Blindada

Crie o arquivo `protected-config.js`:

1. Escreva `createProtectedConfig(defaults)` devolvendo um `Proxy` sobre uma cópia
2. Na armadilha `get`, lance `ReferenceError` para chave inexistente
3. Ainda em `get`, conte as leituras de cada chave em um `Map` interno
4. Na armadilha `set`, rejeite chaves não declaradas e tipos divergentes
5. Na armadilha `deleteProperty`, impeça a remoção com `TypeError`
6. Teste com `port`, `host` e `debug`, imprimindo o mapa de leituras

---

## Desafio: Protocolo Binário de Telemetria

Crie o arquivo `sensor-packet.js`:

1. Defina `RECORD_SIZE` com 12 bytes: `Uint32`, `Uint16`, `Float32`, `Uint8` e alinhamento
2. Escreva `encodePackets(readings)` gravando cada campo com `DataView` em *big-endian*
3. Escreva a geradora `decodePackets(buffer)` percorrendo o buffer registro a registro
4. Encadeie *Iterator Helpers* para filtrar os registros com status `1`
5. Calcule a média e apresente o relatório com `Intl.NumberFormat` e `Intl.ListFormat`

---

## Perguntas de Revisão: Iteração e Metaprogramação

1. Qual é a diferença entre um objeto iterável e um iterador?
2. Por que os *Iterator Helpers* funcionam sobre sequências infinitas?
3. O que acontece ao percorrer duas vezes o mesmo iterador?
4. Quando usar `Symbol.asyncIterator` em vez de `Symbol.iterator`?
5. O que é uma armadilha de `Proxy` e o que ocorre quando ela não é definida?
6. Por que usar `Reflect` dentro das armadilhas de um `Proxy`?
7. Qual é a diferença de tratamento de falhas entre `Object` e `Reflect`?
8. Envolver um objeto em `Proxy` impede que ele seja alterado por outro trecho?

---

## Perguntas de Revisão: Binários, Coleta e Intl

9. Qual é a diferença de papel entre `ArrayBuffer`, `TypedArray` e `DataView`?
10. O que ocorre ao atribuir `256` a uma posição de um `Uint8Array`?
11. Por que os métodos de `DataView` recebem um argumento de *endianness*?
12. Por que `WeakRef` e finalizadores não devem sustentar lógica essencial?
13. Por que ordenar nomes em português com `array.sort()` é incorreto?
14. Qual problema `Intl.Segmenter` resolve que `.length` não resolve?
15. Qual é a diferença entre `encodeURI()` e `encodeURIComponent()`?
16. Por que `eval()` é desaconselhado e o que usar no lugar?

---

## Síntese do Tópico

- **Catálogo fechado**: a ECMA-262 delimita o que é linguagem e o que é ambiente
- **Iteração**: um contrato de dois níveis, agora com helpers preguiçosos no ES2025
- **Proxy e Reflect**: interceptação e execução das operações internas do motor
- **Binários**: buffer bruto, visão homogênea e visão heterogênea com *endianness*
- **Referências fracas**: úteis para cache, jamais para correção
- **Intl e globais de apoio**: idioma, ambiente e escape de URL resolvidos pelo padrão
