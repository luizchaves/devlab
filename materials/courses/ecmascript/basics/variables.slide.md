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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Variáveis, Escopo e Hoisting"
description: "Declaração de variáveis com var, let e const, escopo lexical e de bloco, hoisting, Temporal Dead Zone (TDZ) e imutabilidade de bindings em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Variáveis, Escopo e Hoisting

Declaração de variáveis com var, let e const, escopo lexical e de bloco, hoisting, Temporal Dead Zone (TDZ) e imutabilidade de bindings em JavaScript.

---

## Objetivo

- Compreender como o JavaScript gerencia variáveis na memória, diferenciando declarações com `var`, `let` e `const`.
- Dominar as regras de escopo (global, função e bloco), o comportamento de hoisting.

---

## Mapa da Aula

- Variáveis e Declaração de Identificadores
- Palavras-Chave de Declaração: `var`, `let` e `const`
- Reassociação e mutação
- Escopo Lexical e de Bloco
- Hoisting e a Zona Morta Temporal (TDZ)
- Case sensitive

---

## Variáveis e Declaração de Identificadores

- Sem variáveis, o mesmo valor precisa ser repetido no código, dificultando a manutenção e ocultando a intenção do programa.
- Ao declarar uma variável, um valor recebe um nome simbólico e pode ser reutilizado.

```txt
Pilha
┌──────────────────────────────┐
│ price = 79.9                 │ valor primitivo
│ user = 0x00A4                │ referência
└──────────────┬───────────────┘
               ▼
Heap: 0x00A4 ──► { name: 'Ana', age: 25 }
```

---

## Variáveis e Declaração de Identificadores (Exemplo)

```js
// Sem variável: valores soltos e sem semântica
console.log(79.9 * 0.9);
console.log(79.9 * 0.9 + 12);

// Com variável: significado claro e reutilização
const price = 79.9;
const discount = 0.9;
const shipping = 12;

const finalPrice = price * discount + shipping;
console.log(finalPrice);
```

---

## Por que variáveis existem

- Sem variáveis, o mesmo valor precisa ser repetido e o código perde intenção.
- Com uma variável, o valor ganha nome e pode ser reutilizado.
- Ao nomear os valores, o cálculo fica mais legível e cada parte passa a ter uma responsabilidade clara.
- Um bom nome reduz a necessidade de comentário.
- `total`, `price` e `shipping` explicam melhor o cálculo do que nomes como `x`, `y` e `z`.

---

## Por que variáveis existem (Exemplo)

```js
console.log(79.9 * 0.9);
console.log(79.9 * 0.9 + 12);
```

---

## Identificadores

- O nome da variável é chamado de identificador.
- Ele pode usar letras, dígitos, `_` e `$`, mas não pode começar com dígito nem usar palavras reservadas como nome.
- Os exemplos abaixo estão comentados porque representam erros de sintaxe; se forem descomentados, o arquivo deixa de executar.
- Nesta página aparecem erros de sintaxe, como `SyntaxError`, e erros em tempo de execução.
- Um `SyntaxError`, como em `const 2phase = "DW";`, impede o arquivo de ser interpretado.

---

## Identificadores (Exemplo)

```js
const _total = 10;
const $price = 19.9;
const fullName = "Fulano";

console.log(_total); // 10
console.log($price); // 19.9
console.log(fullName); // Fulano
```

---

## Convenções de Nomenclatura (Naming Conventions)

- Use `SCREAMING_SNAKE_CASE` exclusivamente para valores fixos e imutáveis conhecidos antes da execução (hardcoded).
- Use `camelCase` para variáveis declaradas com `const` cujo valor é atribuído dinamicamente em tempo de execução (runtime).
- A tabela a seguir apresenta os padrões de nomenclatura dominantes no desenvolvimento JavaScript moderno
- Nem toda declaração com a palavra-chave `const` deve ser grafada em `SCREAMING_SNAKE_CASE`!
- No ecossistema JS/Node.js, prioriza-se `kebab-case` para arquivos e pastas porque diferentes sistemas operacionais (Windows.

---

## Convenções de Nomenclatura (Naming Conventions) (Comparação)

| Convenção | Padrão | Exemplo | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **`camelCase`** | primeira palavra em minúscula, subsequentes com inicial maiúscula | `userName`, `totalPrice`, `calculateTax()` | Variáveis comuns (`let`/`const`), parâmetros, propriedades de objetos e funções. |
| **`SCREAMING_SNAKE_CASE`** *(ou `UPPER_SNAKE_CASE`)* | todas as letras em maiúsculas separadas por underline `_` | `API_URL`, `MAX_ATTEMPTS`, `DEFAULT_TIMEOUT` | Constantes imutáveis de configuração global e "valores mágicos" conhecidos em tempo de código. |
| **`PascalCase`** | inicial de cada palavra em maiúscula | `UserProfile`, `OrderController`, `Button` | Classes, funções construtoras, interfaces/tipos e Componentes de UI (React, Vue, Svelte). |
| **`kebab-case`** | todas as letras minúsculas separadas por hífen `-` | `user-service.js`, `array-utils.js`, `syntax-cascade.mdx` | Nomes de arquivos de código, scripts, arquivos de estilo, pastas de módulos e rotas Web. |

---

## Inicialização

- Declarar é criar o nome.
- Inicializar é atribuir o primeiro valor.
- `const` precisa ser inicializada na declaração.

---

## Inicialização (Exemplo)

```js
let value;

console.log(value); // undefined
console.log(typeof value); // "undefined"

value = 100;
value += 50;

console.log(value); // 150
```

---

## Palavras-Chave de Declaração: `var`, `let` e `const`

- O ECMAScript oferece três palavras-chave para criar variáveis, cada uma com regras de escopo e reatribuição distintas
- A instrução `const` impede que o identificador seja reassociado a outro objeto ou valor na memória.
- No entanto, o conteúdo interno de objetos e arrays declarados com `const` pode ser modificado (mutação)

---

## Palavras-Chave de Declaração: `var`, `let` e `const` (Comparação)

| Palavra-Chave | Escopo | Reatribuição | Redeclaração no mesmo escopo | Hoisting |
| :--- | :--- | :--- | :--- | :--- |
| `var` | Função ou Global | Permitida | Permitida | Inicializada como `undefined` |
| `let` | Bloco | Permitida | Proibida (SyntaxError) | Não inicializada (TDZ) |
| `const` | Bloco | Proibida (TypeError) | Proibida (SyntaxError) | Não inicializada (TDZ) |

---

## Palavras-Chave de Declaração: `var`, `let` e `const` (Exemplo)

```js
// const exige valor inicial e impede reassociação do identificador
const birthYear = 1995;
// birthYear = 1996; // TypeError: Assignment to constant variable.

// let permite alteração posterior do valor
let currentAge = 28;
currentAge = 29; // OK

// var permite reatribuição e redeclaração (Evitar em código moderno)
var userRole = "admin";
var userRole = "super-admin"; // Sem erro, substitui a declaração anterior
```

---

## Panorama da declaração

- Em JavaScript moderno, as declarações mais usadas são `const` e `let`.
- `var` ainda aparece em códigos antigos, bibliotecas e materiais legados, mas deve ser evitado como padrão em novos arquivos.
- Declara uma associação que não pode ser trocada por outro valor.
- Use como padrão quando não houver reassociação.
- Declara uma variável que pode receber outro valor depois.

---

## Panorama da declaração (Comparação)

| Palavra-chave | Pode reassociar? | Escopo principal | Uso recomendado |
| -------------- | ---------------- | ---------------- | --------------- |
| `const` | Não | Bloco | Valor que não será trocado |
| `let` | Sim | Bloco | Valor que muda durante a execução |
| `var` | Sim | Função | Código legado |

---

## Panorama da declaração (Exemplo)

```js
var declaredWithVar = 10;
let declaredWithLet = 20;
const declaredWithConst = 30;

console.log(declaredWithVar); // 10
console.log(declaredWithLet); // 20
console.log(declaredWithConst); // 30
```

---

## Redeclaração

- `var` permite declarar novamente o mesmo nome no mesmo escopo.
- `let` e `const` evitam isso.
- Com `let` e `const`, a tentativa de repetir o mesmo nome no mesmo escopo é bloqueada antes da execução.

---

## Redeclaração (Exemplo)

```js
var course = "DW";
var course = "Desenvolvimento Web";

console.log(course); // "Desenvolvimento Web"
```

---

## Reassociação e mutação

- Reassociar é fazer a variável apontar para outro valor.
- `var` e `let` permitem isso; `const` não permite.
- `const` impede a troca da associação, mas não transforma objetos e arrays em valores imutáveis.
- O conteúdo interno ainda pode mudar.
- O mesmo vale para objetos: a variável continua apontando para o mesmo objeto, mas uma propriedade interna pode ser modificada.

---

## Reassociação e mutação (Exemplo)

```js
var declaredWithVar = 10;
let declaredWithLet = 20;
const declaredWithConst = 30;

declaredWithVar = 100;
declaredWithLet = 200;

console.log(declaredWithVar); // 100
console.log(declaredWithLet); // 200

// TypeError: Assignment to constant variable.
// declaredWithConst = 300;
```

---

## Escopo Lexical e de Bloco

- Escopo determina em quais partes do código um determinado identificador está visível e pode ser acessado.
- A busca por identificadores começa no escopo atual e sobe pela cadeia de escopos.

```txt
Bloco interno
   │ procura
   ▼
Escopo da função
   │ se não encontrar
   ▼
Escopo global
```

---

## Escopo de Bloco (`let` e `const`)

- Um bloco é delimitado por chaves `{}` em `if`, `for`, `while` ou blocos autônomos.
- Identificadores criados com `let` e `const` dentro de um bloco existem apenas naquele contexto.

---

## Escopo de Bloco (`let` e `const`) (Exemplo)

```js
if (true) {
  const blockScoped = "Visível apenas dentro do bloco";
  var functionScoped = "Vaza para fora do bloco!";
  console.log(blockScoped); // "Visível apenas dentro do bloco"
}

// console.log(blockScoped); // ReferenceError: blockScoped is not defined
console.log(functionScoped); // "Vaza para fora do bloco!" (Comportamento do var)
```

---

## Escopo de Função e Global

- Variáveis declaradas fora de qualquer função ou bloco pertencem ao escopo global.
- Variáveis declaradas com `var` dentro de uma função pertencem exclusivamente àquela função.

---

## Escopo de Função e Global (Exemplo)

```js
function calculateTotal() {
  var internalTax = 0.15;
  return 100 * (1 + internalTax);
}

calculateTotal();
// console.log(internalTax); // ReferenceError: internalTax is not defined
```

---

## Panorama do escopo

- Escopo define onde uma variável pode ser acessada.
- `let` e `const` respeitam escopo de bloco, ou seja, o trecho entre `{` e `}`.
- `var` tem escopo de função.
- Por isso, uma variável declarada dentro de um bloco pode continuar acessível fora dele quando está na mesma função.
- Fora da função, ela não fica disponível.

---

## Panorama do escopo (Exemplo)

```js
let semester = "2026.2";
console.log(semester); // "2026.2"

if (true) {
  let semester = "inside block";
  const period = "morning";

  console.log(semester); // "inside block"
  console.log(period); // "morning"
}

console.log(semester); // "2026.2"
```

---

## Escopo em laços

- `let` cria uma nova associação por iteração em laços `for`.
- `var`, por ter escopo de função, compartilha a mesma variável entre as iterações.

---

## Escopo em laços (Exemplo)

```js
const callbacksWithVar = [];
const callbacksWithLet = [];

for (var i = 0; i < 3; i++) {
  callbacksWithVar.push(() => i);
}

for (let j = 0; j < 3; j++) {
  callbacksWithLet.push(() => j);
}

console.log(callbacksWithVar.map((callback) => callback())); // [3, 3, 3]
console.log(callbacksWithLet.map((callback) => callback())); // [0, 1, 2]
```

---

## Hoisting com `var`

- Declarações com `var` são elevadas ao topo de seu escopo e inicializadas com `undefined`.

---

## Hoisting com `var` (Exemplo)

```js
console.log(userName); // undefined (Não lança erro de referência!)
var userName = "Beatriz";

// O código acima é interpretado pelo V8 como:
// var userName;
// console.log(userName);
// userName = "Beatriz";
```

---

## Hoisting com `let` e `const` (TDZ)

- Use camelCase para variáveis e funções (`totalAmount`, `getUserProfile`).
- Use UPPER_SNAKE_CASE para constantes verdadeiras de tempo de compilação/configuração (`MAX_RETRY_COUNT`, `API_BASE_URL`).
- Prefira nomes descritivos em vez de abreviações genéricas (`customerAddress` em vez de `cAddr`).
- Variáveis declaradas com `let` e `const` também sofrem hoisting, mas não são inicializadas.
- A região do código entre o início do bloco e a linha da declaração é chamada de Zona Morta Temporal (Temporal Dead Zone - TDZ).

---

## Hoisting com `let` e `const` (TDZ) (Exemplo)

```js
// Início do escopo do bloco
// console.log(product); // ReferenceError: Cannot access 'product' before initialization (TDZ!)

let product = "Notebook"; // Fim da TDZ para 'product'
console.log(product); // "Notebook"
```

---

## Panorama do hoisting

- Declarações são processadas antes da execução do código, comportamento chamado de hoisting.
- Com `var`, a variável existe antes da linha de declaração, mas começa como `undefined`.
- Com `let` e `const`, acessar a variável antes da declaração gera erro por causa da Temporal Dead Zone.
- Mesmo conhecendo hoisting, escreva o código na ordem de leitura: declare a variável antes de acessar seu valor.

---

## Panorama do hoisting (Exemplo)

```js
console.log(hoistedVar); // undefined

var hoistedVar = 10;

console.log(hoistedVar); // 10
```

---

## Globais implícitas

- Quando uma atribuição é feita sem declaração, JavaScript pode criar uma variável global implícita em scripts não estritos.
- Esse comportamento é perigoso porque espalha estado pelo programa.
- Use `const`, `let` ou, ao ler código antigo, `var`.
- Não dependa de globais implícitas.

---

## Globais implícitas (Exemplo)

```js
function createImplicitGlobal() {
  implicitTotal = 100;
  return implicitTotal;
}

console.log(createImplicitGlobal()); // 100
console.log(globalThis.implicitTotal); // 100
delete globalThis.implicitTotal;

// Com "use strict" ou dentro de ES modules:
// ReferenceError: implicitTotal is not defined.
```

---

## Case sensitive

- JavaScript diferencia letras maiúsculas e minúsculas.
- Portanto, `number`, `Number` e `NUMBER` são nomes diferentes.

---

## Case sensitive (Exemplo)

```js
const number = 8;
const Number = 80;
const NUMBER = 800;

console.log(number); // 8
console.log(Number); // 80
console.log(NUMBER); // 800
```

---

## Boas práticas

- A tabela final concentra escolhas que ajudam a reduzir surpresa em programas pequenos e também em projetos maiores.
- Este resumo mostra a regra mais comum em código moderno: `const` por padrão e `let` quando o valor muda.

---

## Boas práticas (Comparação)

| Prática | Motivo |
| ------- | ------ |
| Prefira `const` | A maior parte dos nomes não precisa ser reassociada |
| Use `let` quando houver mudança | Deixa explícito que o valor varia com o tempo |
| Evite `var` em código novo | Reduz surpresas de escopo, redeclaração e *hoisting* |
| Declare sempre | Evita globais implícitas |
| Use nomes descritivos | Facilita leitura, revisão e depuração |

---

## Boas práticas (Exemplo)

```js
const defaultChoice = "const";
let changesOverTime = 0;

changesOverTime += 1;

console.log(defaultChoice); // "const"
console.log(changesOverTime); // 1
```

---

## Variáveis e Escopo

- Qual é a diferença prática entre `let` e `const`?
- `let` permite reassociar a variável a outro valor.
- `const` não permite reassociação, devendo ser usada para identificadores que não recebem novo valor.
- Por que `const` não torna um objeto imutável?
- Porque `const` protege o binding do identificador na memória, não as propriedades do objeto apontado.

---

## Executando

- Crie um arquivo chamado `variables.js`
- Execute o arquivo via Node.js no terminal
- Observe a saída gerada
- Execute com Node.js
- Se preferir usar o navegador, crie uma página HTML carregando o arquivo

---

## Exercício

- Tente reatribuir `courseName` e observe a exceção gerada no terminal;
- Atualize `studentCount` somando 5 novos alunos e imprima o novo valor;
- Demonstre a Zona Morta Temporal (TDZ) tentando acessar uma variável `let` antes de sua linha de declaração em um bloco `if`.
- Declare `name`, `price`, `quantity` e `discount`;
- Calcule `subtotal` usando preço e quantidade;

---

## Desafio

- Adicione um novo produto com `push()`;
- Altere o preço de um produto;
- Calcule o total do carrinho;
- Explique por que essas mudanças são possíveis mesmo quando `cart` foi declarado
- Inclua um caso com `0.1 + 0.2` e registre o que acontece.

---

## Resumo da Aula

- **Declarações**: `const` por padrão (imutabilidade de ligação), `let` para valores reatribuíveis e evitar `var` (legado).
- **Escopos**: `let` e `const` respeitam escopo de bloco `{}`; `var` possui escopo de função ou global e vaza de laços/condicionais.
- **Hoisting**: Funções declaradas sobem completamente; `var` sobe com valor `undefined`; `let`/`const` sofrem elevação mas ficam na TDZ.
- **Temporal Dead Zone (TDZ)**: Intervalo entre a entrada no bloco e a inicialização da variável onde qualquer acesso dispara `ReferenceError`.
- **Mutabilidade com const**: `const` impede reatribuição de referência, mas propriedades internas de objetos e arrays continuam mutáveis.
