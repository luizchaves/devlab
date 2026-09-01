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
title: 'JavaScript: Variáveis, Escopo e Hoisting'
description: 'Slides completos da aula JavaScript: Variáveis, Escopo e Hoisting.'
---

<!-- _class: lead -->

# JavaScript: Variáveis, Escopo e Hoisting

`var`, `let`, `const`, escopo, _hoisting_ e TDZ.

---

## Objetivo

- Associar **nomes** a valores.
- Escolher entre `const`, `let` e `var`.
- Diferenciar reassociação de mutação.
- Ler escopos global, de função e de bloco.
- Explicar _hoisting_ e _Temporal Dead Zone_.

---

## Mapa da Aula

- Variáveis e identificadores.
- Declaração, inicialização e nomes.
- `var`, `let`, `const`, reassociação e mutação.
- Escopo lexical, blocos, funções e laços.
- _Hoisting_, TDZ e globais implícitas.
- Exercício, desafio e revisão.

---

## Variável é Nome

- Variável cria um **identificador**.
- O identificador aponta para um valor.
- O valor pode ser primitivo ou objeto.
- A palavra-chave define as regras do nome.

---

## Modelo de Memória

```txt
Pilha (stack)                 Heap
--------------                -----------------------------------
user  = 0x00A4  --ponteiro--> 0x00A4 -> { name: "Ana",  age: 25 }
price = 79.9

primitivo = valor direto      objeto = referência
```

- `user` guarda um endereço para a _heap_.
- O objeto vive fora da variável.
- `price` guarda um valor primitivo direto.
- Reassociar troca o endereço guardado.

---

## Valor Repetido

```js
console.log(79.9 * 0.9);
console.log(79.9 * 0.9 + 12);
```

- O cálculo funciona.
- A intenção fica escondida.
- Manutenção exige procurar literais repetidos.

---

## Valor Nomeado

```js
const price = 79.9;
const discountFactor = 0.9;
const shipping = 12;

const subtotal = price * discountFactor;
const total = subtotal + shipping;

console.log(subtotal); // 71.91
console.log(total); // 83.91
```

- Cada literal ganha um papel no cálculo.
- `subtotal` evita repetir a fórmula.
- `total` combina as etapas nomeadas.

---

## Bons Nomes

- `price` comunica o valor base.
- `discountFactor` explica a regra de desconto.
- `shipping` separa o frete.
- `subtotal` mostra a etapa intermediária.
- `total` entrega o resultado final.

---

## Identificadores

- Podem usar letras, dígitos, `_` e `$`.
- Não podem começar com dígito.
- Não podem ser palavras reservadas.
- Diferenciam maiúsculas e minúsculas.

---

## Identificadores Válidos

```js
const _total = 10;
const $price = 19.9;
const fullName = 'Fulano';

console.log(_total); // 10
console.log($price); // 19.9
console.log(fullName); // Fulano
```

- `_` e `$` são permitidos no início.
- `fullName` segue `camelCase`.
- Dígitos só podem aparecer depois do primeiro caractere.

---

## Identificadores Inválidos

```js
// SyntaxError: Invalid or unexpected token.
// const 2phase = "DW";

// SyntaxError: Identifier is a reserved word.
// const let = 10;

// "-" é subtração, não parte do nome.
// const full-name = "Fulano";
```

- O arquivo falha antes de executar.
- Palavras reservadas continuam proibidas.
- Use `kebab-case` apenas em nomes de arquivo.

---

## Sintaxe vs Execução

- `SyntaxError` impede a interpretação do arquivo.
- `TypeError` acontece durante a execução.
- Terminal e Console indicam tipo, arquivo e linha.

```js
const total = 1n + 1;
console.log(total);
```

---

## Erro em Execução

```txt
TypeError: Cannot mix BigInt and other types
```

- O código é sintaticamente válido.
- A falha acontece ao somar `bigint` e `number`.
- A mensagem aponta o tipo do problema.

---

## Convenções de Nomes

| Convenção          | Exemplo           | Uso comum           |
| ------------------ | ----------------- | ------------------- |
| `camelCase`        | `totalPrice`      | variáveis e funções |
| `UPPER_SNAKE_CASE` | `MAX_ATTEMPTS`    | constantes fixas    |
| `PascalCase`       | `UserProfile`     | classes e tipos     |
| `kebab-case`       | `user-service.js` | arquivos e rotas    |

---

## `const` Não Exige Caixa Alta

```js
const API_BASE_URL = 'https://api.exemplo.com';
const MAX_RETRY_COUNT = 3;

const userList = await fetchUsers();
const currentElement = document.querySelector('#main');
```

- Caixa alta: valor fixo de configuração.
- `camelCase`: valor calculado ou obtido em execução.

---

## Declaração e Inicialização

- Declarar é criar o nome.
- Inicializar é atribuir o primeiro valor.
- `let` pode começar sem valor.
- `const` precisa nascer com valor.

```js
let value;
console.log(value); // undefined

value = 100;
value += 50;
console.log(value); // 150
```

---

## `const` Precisa de Valor

```js
const defaultChoice = 'const';
console.log(defaultChoice); // "const"

// SyntaxError: Missing initializer in const declaration.
// const missingValue;
```

- `defaultChoice` nasce com valor.
- `missingValue` nem chega a ser criada.
- O erro é de sintaxe, não de execução.

---

## `var`, `let` e `const`

| Palavra | Escopo        | Reassocia? | Redeclara? | Antes da linha |
| ------- | ------------- | ---------- | ---------- | -------------- |
| `var`   | função/global | sim        | sim        | `undefined`    |
| `let`   | bloco         | sim        | não        | TDZ            |
| `const` | bloco         | não        | não        | TDZ            |

---

## Escolha Prática

- Use `const` por padrão.
- Use `let` quando o valor mudar.
- Evite `var` em código novo.
- Leia `var` em código legado.

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

- `var` e `let` aceitam novo valor.
- `const` bloqueia a troca do valor associado.
- O erro só acontece se a linha comentada rodar.

---

## Mutação de Array

```js
const values = [];

values.push('A');
values.push('B');

console.log(values); // ["A", "B"]

// TypeError: Assignment to constant variable.
// values = [1, 2];
```

- `push()` muda o array.
- A atribuição troca a associação.

---

## Mutação de Objeto

```js
const user = { name: 'Alice' };

user.name = 'Bob';

console.log(user); // { name: "Bob" }

// TypeError: Assignment to constant variable.
// user = { name: "Carlos" };
```

- `user.name` muda o objeto existente.
- `user = {}` tentaria trocar a referência.
- Mutação e reassociação são operações diferentes.

---

## Referências Compartilhadas

| Momento              | `values`       | `alias`     | Comparação |
| -------------------- | -------------- | ----------- | ---------- |
| `let alias = values` | `[1, 2, 3]`    | mesmo array | `true`     |
| `alias.push(4)`      | `[1, 2, 3, 4]` | mesmo array | `true`     |
| `alias = [9, 9]`     | `[1, 2, 3, 4]` | novo array  | `false`    |

- Mutação muda o objeto compartilhado.
- Reassociação troca só um identificador.

---

## Alias em Código

```js
const values = [1, 2, 3];
let alias = values;

alias.push(4);
console.log(values); // [1, 2, 3, 4]
console.log(values === alias); // true

alias = [9, 9];
console.log(values); // [1, 2, 3, 4]
console.log(alias); // [9, 9]
console.log(values === alias); // false
```

---

## O Que Observar no Alias

- `alias` começa apontando para o mesmo array.
- `push()` altera o objeto compartilhado.
- `alias = [9, 9]` cria outro destino.
- `values === alias` mostra quando a referência mudou.

---

## Redeclaração

```js
var course = 'DW';
var course = 'Desenvolvimento Web';

console.log(course); // "Desenvolvimento Web"

// SyntaxError: Identifier 'semester' has already been declared.
// let semester = "2026.2";
// let semester = "2027.1";
```

- `var` aceita a segunda declaração.
- `let` bloqueia repetição no mesmo escopo.
- O bloqueio evita sobrescrita acidental.

---

## Escopo Lexical

- Escopo define onde o nome é visível.
- A busca depende da posição do código.
- JavaScript procura de dentro para fora.
- Nome ausente gera `ReferenceError`.

---

## Fronteiras de Escopo

```txt
global
`-- função
    `-- bloco { if / for / while }

busca: bloco -> função -> global -> ReferenceError
```

- `let` e `const` respeitam bloco.
- `var` fica no escopo da função.

---

## Escopo de Bloco

```js
if (true) {
  const blockScoped = 'só dentro do bloco';
  var functionScoped = 'vaza do bloco';

  console.log(blockScoped);
}

// ReferenceError: blockScoped is not defined.
// console.log(blockScoped);

console.log(functionScoped); // "vaza do bloco"
```

- `blockScoped` morre ao sair do bloco.
- `functionScoped` continua visível.
- Esse vazamento é uma surpresa comum do `var`.

---

## Escopo de Função

```js
function calculateTotal() {
  var internalTax = 0.15;
  return 100 * (1 + internalTax);
}

console.log(calculateTotal()); // 114.99999999999999

// ReferenceError: internalTax is not defined.
// console.log(internalTax);
```

- `internalTax` pertence à função.
- Fora da função, o nome não existe.
- O retorno entrega o valor calculado.

---

## Sombreamento

```js
let semester = '2026.2';

if (true) {
  let semester = 'inside block';
  const period = 'morning';

  console.log(semester); // "inside block"
  console.log(period); // "morning"
}

console.log(semester); // "2026.2"
```

- O `semester` interno sombreia o externo.
- O bloco cria um escopo próprio.
- Ao sair do bloco, volta o nome externo.

---

## Laços e Callbacks

```js
const callbacksWithVar = [];
const callbacksWithLet = [];

for (var i = 0; i < 3; i++) {
  callbacksWithVar.push(() => i);
}

for (let j = 0; j < 3; j++) {
  callbacksWithLet.push(() => j);
}

const resultVar = callbacksWithVar.map((callback) => callback());
const resultLet = callbacksWithLet.map((callback) => callback());

console.log(resultVar); // [3, 3, 3]
console.log(resultLet); // [0, 1, 2]
```

---

## Por Que o Laço Muda?

- `var i` compartilha uma variável.
- Os callbacks leem `i` depois do laço.
- No fim, `i` vale `3`.
- `let j` cria uma associação por iteração.

---

## Hoisting

- Declarações são processadas antes da execução.
- `var` começa como `undefined`.
- `let` e `const` entram na TDZ.
- Declare antes de usar.

---

## Hoisting com `var`

```js
console.log(userName); // undefined

var userName = 'Beatriz';

console.log(userName); // "Beatriz"
```

- A leitura antes da declaração não falha.
- O valor inicial é `undefined`.
- A atribuição acontece depois.

---

## Modelo Mental do `var`

```js
var userName;
console.log(userName); // undefined
userName = 'Beatriz';
```

- A declaração sobe.
- A atribuição continua no lugar.
- Por isso a primeira leitura recebe `undefined`.

---

## Temporal Dead Zone (TDZ)

- **Definição**: Intervalo entre a entrada no escopo e a inicialização da variável.
- `let` e `const` são elevados (*hoisted*), mas ficam **não inicializados**.
- Qualquer acesso durante a TDZ lança `ReferenceError`.

```js
// Início do escopo (TDZ ativa para product)
// console.log(product); // ReferenceError: Cannot access 'product' before initialization

let product = 'Notebook'; // Fim da TDZ (inicialização)

console.log(product); // "Notebook"
```

---

## TDZ com `let` e `const`

```js
// console.log(tdzLet);   // ReferenceError: Cannot access 'tdzLet' before initialization
let tdzLet = 10;

// console.log(tdzConst); // ReferenceError: Cannot access 'tdzConst' before initialization
const tdzConst = 10;
```

- O nome existe no escopo desde o início.
- O acesso falha antes da linha de inicialização.
- A inicialização formal encerra a TDZ.

---

## Globais Implícitas

```js
function createImplicitGlobal() {
  implicitTotal = 100;
  return implicitTotal;
}

console.log(createImplicitGlobal()); // 100
console.log(globalThis.implicitTotal); // 100

delete globalThis.implicitTotal;

// Com "use strict" ou ES modules:
// ReferenceError: implicitTotal is not defined.
```

- A falta de `const`, `let` ou `var` cria o risco.
- Em modo estrito, a atribuição vira erro.
- Declare sempre para limitar o escopo.

---

## Case Sensitive

```js
const number = 8;
const Number = 80;
const NUMBER = 800;

console.log(number); // 8
console.log(Number); // 80
console.log(NUMBER); // 800
```

- `number`, `Number` e `NUMBER` são nomes diferentes.
- Evite nomes que dependem só de caixa.

---

## Boas Práticas

| Prática                | Motivo                       |
| ---------------------- | ---------------------------- |
| Prefira `const`        | reduz reassociação acidental |
| Use `let` quando mudar | deixa variação explícita     |
| Evite `var`            | reduz surpresa de escopo     |
| Declare sempre         | evita global implícita       |
| Nomeie bem             | facilita revisão             |

---

## Executando

```js
const appName = 'DevLab';
let activeUsers = 100;

if (true) {
  let sessionToken = 'abc-123';
  console.log(`[${appName}] Usuários: ${activeUsers}`);
  console.log(`Token: ${sessionToken}`);
}
```

- `appName` permanece estável.
- `activeUsers` poderia mudar durante a execução.
- `sessionToken` só existe dentro do bloco.

---

## Terminal e Saída

```bash
node variables.js
```

```txt
[DevLab] Usuários: 100
Token: abc-123
```

---

## Exercício

1. Declare `courseName` com `const`.
2. Declare `studentCount` com `let`.
3. Some 5 em `studentCount`.
4. Tente reatribuir `courseName`.
5. Demonstre uma TDZ em bloco `if`.

---

## Desafio

1. Crie um array `cart` com produtos.
2. Adicione um produto com `push()`.
3. Altere o preço de um produto.
4. Calcule o total do carrinho.
5. Explique por que `const cart` permite mutação.

---

## Perguntas de Revisão

- Qual é a diferença entre `let` e `const`?
- Por que `const` não torna objeto imutável?
- Por que evitar `var` em código moderno?
- O que é a _Temporal Dead Zone_?
- O que muda entre `var` e `let` em callbacks?
- Por que globais implícitas são perigosas?

---

## Resumo da Aula

- Variáveis dão nomes a valores.
- `const` protege a associação.
- Objetos e arrays ainda podem sofrer mutação.
- `let` e `const` têm escopo de bloco.
- `var` tem escopo de função e _hoisting_ antigo.
- TDZ bloqueia acesso antecipado a `let` e `const`.
