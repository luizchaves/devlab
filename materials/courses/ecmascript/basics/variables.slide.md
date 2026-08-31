---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Variáveis, Escopo e Hoisting"
description: "Slides completos da aula JavaScript: Variáveis, Escopo e Hoisting."
---

<!-- _class: lead -->

# JavaScript: Variáveis, Escopo e Hoisting

Declaração de variáveis com var, let e const, escopo lexical e de bloco, hoisting, Temporal Dead Zone (TDZ) e imutabilidade de bindings em JavaScript.

---

## Objetivo

- Compreender como o JavaScript gerencia variáveis na memória, diferenciando declarações com `var`, `let` e `const`
- Dominar as regras de escopo (global, função e bloco), o comportamento de *hoisting*, a Zona Morta Temporal (TDZ) e as...

---

## Mapa da Aula

- Variáveis e Declaração de Identificadores
- Palavras-Chave de Declaração: `var`, `let` e `const`
- Reassociação e mutação
- Escopo Lexical e de Bloco
- Hoisting e a Zona Morta Temporal (TDZ)
- Case sensitive
- Boas práticas
- Executando

---

## Introdução

- Esta aula apresenta as formas de declarar identificadores em JavaScript, detalhando as diferenças cruciais entre `var`,...

---

## Variáveis e Declaração de Identificadores

- Sem variáveis, o mesmo valor precisa ser repetido no código, dificultando a manutenção e ocultando a intenção do programa
- Ao declarar uma variável, um valor recebe um nome simbólico e pode ser reutilizado
- O diagrama a seguir ilustra o modelo de armazenamento da memória, diferenciando valores primitivos mantidos diretamente...
- Diagrama da página
- Armazenamento na Memória

---

## Valor repetido vs Identificador nomeado

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

- Sem variáveis, o mesmo valor precisa ser repetido e o código perde intenção
- Com uma variável, o valor ganha nome e pode ser reutilizado
- Ao nomear os valores, o cálculo fica mais legível e cada parte passa a ter uma responsabilidade clara
- Um bom nome reduz a necessidade de comentário
- `total`, `price` e `shipping` explicam melhor o cálculo do que nomes como `x`, `y` e `z`

---

## Valor repetido

```js
console.log(79.9 * 0.9);
console.log(79.9 * 0.9 + 12);
```

---

## Valor nomeado

```js
const price = 79.9;
const discountFactor = 0.9;
const shipping = 12;

const subtotal = price * discountFactor;
const total = subtotal + shipping;

console.log(subtotal); // 71.91
console.log(total); // 83.91
```

---

## Identificadores

- O nome da variável é chamado de identificador
- Ele pode usar letras, dígitos, `` e `$`, mas não pode começar com dígito nem usar palavras reservadas como nome
- Os exemplos abaixo estão comentados porque representam erros de sintaxe
- se forem descomentados, o arquivo deixa de executar
- Nesta página aparecem erros de sintaxe, como `SyntaxError`, e erros em tempo de execução

---

## Identificadores válidos

```js
const _total = 10;
const $price = 19.9;
const fullName = "Fulano";

console.log(_total); // 10
console.log($price); // 19.9
console.log(fullName); // Fulano
```

---

## Identificadores inválidos

```js
// SyntaxError: Invalid or unexpected token.
// const 2phase = "DW";

// SyntaxError: Identifier is a reserved word.
// const let = 10;

// O caractere - é operador de subtração, não parte do nome.
// const full-name = "Fulano";
```

---

## variables.js

```js
const total = 1n + 1;
console.log(total);
```

---

## Convenções de Nomenclatura (Naming Conventions)

- Use `SCREAMINGSNAKECASE` exclusivamente para valores fixos e imutáveis conhecidos antes da execução (hardcoded), como...
- Use `camelCase` para variáveis declaradas com `const` cujo valor é atribuído dinamicamente em tempo de execução...

---

## Convenções de Nomenclatura (Naming Conventions): Comparação

| Convenção | Padrão | Exemplo | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **`camelCase`** | primeira palavra em minúscula, subsequentes com inicial maiúscula | `userName`, `totalPrice`, `calculateTax()` | Variáveis comuns (`let`/`const`), parâmetros, propriedades de objetos e funções. |
| **`SCREAMING_SNAKE_CASE`** *(ou `UPPER_SNAKE_CASE`)* | todas as letras em maiúsculas separadas por underline `_` | `API_URL`, `MAX_ATTEMPTS`, `DEFAULT_TIMEOUT` | Constantes imutáveis de configuração global e "valores mágicos" conhecidos em tempo de código. |
| **`PascalCase`** | inicial de cada palavra em maiúscula | `UserProfile`, `OrderController`, `Button` | Classes, funções construtoras, interfaces/tipos e Componentes de UI (React, Vue, Svelte). |
| **`kebab-case`** | todas as letras minúsculas separadas por hífen `-` | `user-service.js`, `array-utils.js`, `syntax-cascade.mdx` | Nomes de arquivos de código, scripts, arquivos de estilo, pastas de módulos e rotas Web. |

---

## Inicialização

- Declarar é criar o nome
- Inicializar é atribuir o primeiro valor
- `const` precisa ser inicializada na declaração

---

## Declaração sem inicialização

```js
let value;

console.log(value); // undefined
console.log(typeof value); // "undefined"

value = 100;
value += 50;

console.log(value); // 150
```

---

## const precisa de valor inicial

```js
const defaultChoice = "const";
console.log(defaultChoice); // "const"

// SyntaxError: Missing initializer in const declaration.
// const missingValue;
```

---

## Palavras-Chave de Declaração: `var`, `let` e `const`

- O ECMAScript oferece três palavras-chave para criar variáveis, cada uma com regras de escopo e reatribuição distintas
- A instrução `const` impede que o identificador seja reassociado a outro objeto ou valor na memória
- No entanto, o conteúdo interno de objetos e arrays declarados com `const` pode ser modificado (mutação):

---

## Palavras-Chave de Declaração: `var`, `let` e `const`: Comparação

| Palavra-Chave | Escopo | Reatribuição | Redeclaração no mesmo escopo | Hoisting |
| :--- | :--- | :--- | :--- | :--- |
| `var` | Função ou Global | Permitida | Permitida | Inicializada como `undefined` |
| `let` | Bloco | Permitida | Proibida (SyntaxError) | Não inicializada (TDZ) |
| `const` | Bloco | Proibida (TypeError) | Proibida (SyntaxError) | Não inicializada (TDZ) |

---

## Comportamento de reatribuição

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

## Palavras-Chave de Declaração: `var`, `let` e `const`

```js
const user = { name: "Ana", age: 25 };
user.age = 26; // Permitido! Mutação da propriedade interna.
// user = { name: "Carlos" }; // Erro! Reatribuição do identificador.
```

---

## Panorama da declaração

- Em JavaScript moderno, as declarações mais usadas são `const` e `let`
- `var` ainda aparece em códigos antigos, bibliotecas e materiais legados, mas deve ser evitado como padrão em novos arquivos
- Declara uma associação que não pode ser trocada por outro valor
- Use como padrão quando não houver reassociação
- Declara uma variável que pode receber outro valor depois

---

## Panorama da declaração: Comparação

| Palavra-chave | Pode reassociar? | Escopo principal | Uso recomendado |
| -------------- | ---------------- | ---------------- | --------------- |
| `const` | Não | Bloco | Valor que não será trocado |
| `let` | Sim | Bloco | Valor que muda durante a execução |
| `var` | Sim | Função | Código legado |

---

## Declarações

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

- `var` permite declarar novamente o mesmo nome no mesmo escopo
- `let` e `const` evitam isso
- Com `let` e `const`, a tentativa de repetir o mesmo nome no mesmo escopo é bloqueada antes da execução

---

## Redeclaração com var

```js
var course = "DW";
var course = "Desenvolvimento Web";

console.log(course); // "Desenvolvimento Web"
```

---

## Redeclaração bloqueada

```js
// SyntaxError: Identifier 'semester' has already been declared.
// let semester = "2026.2";
// let semester = "2027.1";

// SyntaxError: Identifier 'number' has already been declared.
// let number = 10;
// var number = 20;
```

---

## Reassociação e mutação

- Reassociar é fazer a variável apontar para outro valor
- `var` e `let` permitem isso
- `const` não permite
- `const` impede a troca da associação, mas não transforma objetos e arrays em valores imutáveis
- O conteúdo interno ainda pode mudar

---

## Reassociação

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

## Mutação de array declarado com const

```js
const values = [];

values.push("A");
values.push("B");

console.log(values); // ["A", "B"]

// TypeError: Assignment to constant variable.
// values = [1, 2];
```

---

## Mutação de objeto declarado com const

```js
const user = { name: "Alice" };

user.name = "Bob";

console.log(user); // { name: "Bob" }
```

---

## Escopo Lexical e de Bloco

- Escopo determina em quais partes do código um determinado identificador está visível e pode ser acessado
- O JavaScript utiliza Escopo Lexical, o que significa que o acesso às variáveis é determinado pela posição onde o código...
- O diagrama a seguir ilustra as fronteiras de escopo (Global, Função e Bloco) e a cadeia de busca (*Scope Chain*),...
- Diagrama da página
- Fronteiras de Escopo e Cadeia de Busca (Scope Chain)

---

## Escopo de Bloco (`let` e `const`)

- Um bloco é delimitado por chaves ` ` (como em instruções `if`, `for`, `while` ou blocos autônomos)
- Identificadores criados com `let` e `const` dentro de um bloco existem apenas naquele contexto

---

## Isolamento de bloco

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

- Variáveis declaradas fora de qualquer função ou bloco pertencem ao escopo global
- Variáveis declaradas com `var` dentro de uma função pertencem exclusivamente àquela função

---

## Escopo de Função

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

- Escopo define onde uma variável pode ser acessada
- `let` e `const` respeitam escopo de bloco, ou seja, o trecho entre ``
- `var` tem escopo de função
- Por isso, uma variável declarada dentro de um bloco pode continuar acessível fora dele quando está na mesma função
- Fora da função, ela não fica disponível

---

## Escopo de bloco

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

## Escopo de função com var

```js
function testBlockScope() {
if (true) {
 var functionScoped = 1;
 let blockScoped = 2;

 console.log(blockScoped); // 2
}

console.log(functionScoped); // 1

// ReferenceError: blockScoped is not defined.
// console.log(blockScoped);
}

testBlockScope();

// ReferenceError: functionScoped is not defined.
// console.log(functionScoped);
```

---

## Escopo de função

```js
function greeting() {
const message = "Hello";
console.log(message); // "Hello"
}

greeting();

// ReferenceError: message is not defined.
// console.log(message);
```

---

## Escopo em laços

- `let` cria uma nova associação por iteração em laços `for`
- `var`, por ter escopo de função, compartilha a mesma variável entre as iterações

---

## var e let em callbacks

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

## Hoisting e a Zona Morta Temporal (TDZ)

- *Hoisting* (Elevação) é o mecanismo do mecanismo JS que processa as declarações de variáveis e funções antes de executar...

---

## Hoisting com `var`

- Declarações com `var` são elevadas ao topo de seu escopo e inicializadas com `undefined`

---

## Elevação de var

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
- Use UPPERSNAKECASE para constantes verdadeiras de tempo de compilação/configuração (`MAXRETRYCOUNT`, `APIBASEURL`).
- Prefira nomes descritivos em vez de abreviações genéricas (`customerAddress` em vez de `cAddr`).

---

## Acessando variável na TDZ

```js
// Início do escopo do bloco
// console.log(product); // ReferenceError: Cannot access 'product' before initialization (TDZ!)

let product = "Notebook"; // Fim da TDZ para 'product'
console.log(product); // "Notebook"
```

---

## Panorama do hoisting

- Declarações são processadas antes da execução do código, comportamento chamado de *hoisting*
- Com `var`, a variável existe antes da linha de declaração, mas começa como `undefined`
- Com `let` e `const`, acessar a variável antes da declaração gera erro por causa da *Temporal Dead Zone*
- Mesmo conhecendo *hoisting*, escreva o código na ordem de leitura
- declare a variável antes de acessar seu valor

---

## Hoisting com var

```js
console.log(hoistedVar); // undefined

var hoistedVar = 10;

console.log(hoistedVar); // 10
```

---

## Temporal Dead Zone

```js
// ReferenceError: Cannot access 'tdzLet' before initialization.
// console.log(tdzLet);
// let tdzLet = 10;

// ReferenceError: Cannot access 'tdzConst' before initialization.
// console.log(tdzConst);
// const tdzConst = 10;
```

---

## Globais implícitas

- Quando uma atribuição é feita sem declaração, JavaScript pode criar uma variável global implícita em scripts não estritos
- Esse comportamento é perigoso porque espalha estado pelo programa
- Use `const`, `let` ou, ao ler código antigo, `var`
- Não dependa de globais implícitas

---

## Global implícita

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

- JavaScript diferencia letras maiúsculas e minúsculas
- Portanto, `number`, `Number` e `NUMBER` são nomes diferentes

---

## Case sensitive

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

- A tabela final concentra escolhas que ajudam a reduzir surpresa em programas pequenos e também em projetos maiores
- Este resumo mostra a regra mais comum em código moderno
- `const` por padrão e `let` quando o valor muda

---

## Boas práticas: Comparação

| Prática | Motivo |
| ------- | ------ |
| Prefira `const` | A maior parte dos nomes não precisa ser reassociada |
| Use `let` quando houver mudança | Deixa explícito que o valor varia com o tempo |
| Evite `var` em código novo | Reduz surpresas de escopo, redeclaração e *hoisting* |
| Declare sempre | Evita globais implícitas |
| Use nomes descritivos | Facilita leitura, revisão e depuração |
| Converta explicitamente quando necessário | Reduz resultados inesperados |

---

## Resumo prático

```js
const defaultChoice = "const";
let changesOverTime = 0;

changesOverTime += 1;

console.log(defaultChoice); // "const"
console.log(changesOverTime); // 1
```

---

## Executando

- Crie um arquivo chamado `variables.js`:
- Execute o arquivo via Node.js no terminal:
- Observe a saída gerada:
- Execute com Node.js:
- Se preferir usar o navegador, crie uma página HTML carregando o arquivo:

---

## variables.js

```js
const appName = "DevLab";
let activeUsers = 100;

if (true) {
  let sessionToken = "abc-123";
  console.log(`[${appName}] Usuários: ${activeUsers}, Token: ${sessionToken}`);
}
```

---

## Terminal

```bash
node variables.js
```

---

## Output

```txt
[DevLab] Usuários: 100, Token: abc-123
```

---

## Exercício

- Declare uma constante `courseName` com o nome de uma disciplina e uma variável reatribuível `studentCount` com o número...
- Tente reatribuir `courseName` e observe a exceção gerada no terminal;
- Atualize `studentCount` somando 5 novos alunos e imprima o novo valor;
- Demonstre a Zona Morta Temporal (TDZ) tentando acessar uma variável `let` antes de sua linha de declaração em um bloco `if`.
- Declare `name`, `price`, `quantity` e `discount`;

---

## Desafio

- Adicione um novo produto com `push()`;
- Altere o preço de um produto;
- Calcule o total do carrinho;
- Explique por que essas mudanças são possíveis mesmo quando `cart` foi declarado
- Inclua um caso com `0.1 + 0.2` e registre o que acontece.

---

## Variáveis e Escopo

- Qual é a diferença prática entre `let` e `const`
- Por que `const` não torna um objeto imutável
- Por que evitar `var` em código JS moderno
- O que é a Zona Morta Temporal (TDZ)
- Por que evitar `var` em código novo

---

## Próxima aula

- Após dominar a criação de identificadores, escopo e hoisting, o próximo passo é entender a natureza dos dados armazenados...
- Tipos de Dados e Coerção
- Tipos primitivos, typeof, coerção implícita e explícita, undefined vs null e igualdade estrita

---

## Resumo da Aula

- Revise variáveis e Declaração de Identificadores
- Revise palavras-Chave de Declaração: `var`, `let` e `const`
- Revise reassociação e mutação
- Revise escopo Lexical e de Bloco
- Revise hoisting e a Zona Morta Temporal (TDZ)
- Revise case sensitive
- Revise boas práticas
