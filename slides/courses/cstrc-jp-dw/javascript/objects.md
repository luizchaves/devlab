---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Objetos"
description: "Slides completos da aula de Objetos em JavaScript (Notação literal, destructuring, spread, métodos estáticos, cópias e JSON)."
---

<!-- _class: lead -->

# JavaScript: Objetos

Criação literal, acesso por ponto e colchetes, desestruturação, operador *spread*, métodos estáticos (`keys`, `values`, `entries`), cópia rasa vs profunda, palavra-chave `this`, congelamento e formato JSON.

---

## Objetivo

Compreender o conceito e a manipulação de Objetos em JavaScript:

- Criar objetos usando notação literal `{}`.
- Dominar o acesso por ponto (`obj.prop`) e colchetes (`obj["prop"]`).
- Aplicar a sintaxe abreviada (*shorthand*) e nomes computados de propriedades.
- Extrair dados com **Desestruturação** e clonar/mesclar com **Spread** (`...`).
- Inspecionar objetos usando `Object.keys()`, `Object.values()` e `Object.entries()`.
- Compreender a diferença entre **Cópia por Referência**, **Cópia Rasa** (*Shallow Copy*) e **Cópia Profunda** (*Deep Copy* com `structuredClone`).
- Manipular dados no formato **JSON** com `JSON.stringify()` e `JSON.parse()`.

---

## O Que É Um Objeto?

Um **Objeto** é uma coleção dinâmica de pares **chave-valor** (*key-value pairs*).

- As **chaves** (propriedades ou atributos) são strings ou símbolos.
- Os **valores** podem ser de qualquer tipo: números, strings, booleans, arrays, outros objetos ou **funções** (chamadas de **métodos**).
- O tipo retornado pelo operador `typeof` é `"object"`.

---

## Estrutura de Um Objeto (Exemplo)

```js
const user = {
  name: "Ana Silva",
  age: 28,
  isAdmin: true,
  skills: ["JavaScript", "Node.js"],
  greet() {
    console.log(`Olá, meu nome é ${this.name}`);
  }
};

console.log(typeof user); // "object"
user.greet(); // "Olá, meu nome é Ana Silva"
```

---

## Acesso a Propriedades: Notações

Podemos acessar propriedades de duas formas principais:

| Notação | Sintaxe | Quando Utilizar |
| --- | --- | --- |
| **Notação de Ponto** | `user.name` | Chaves válidas sem caracteres especiais ou espaços (Mais comum) |
| **Notação de Colchetes** | `user["name"]` | Chaves com espaços, hífens ou **variáveis dinâmicas** |

---

## Acesso Estático vs. Acesso Dinâmico

```js
const person = {
  name: "Carlos",
  "data-criacao": "2026-08-26"
};

// 1. Notação de Ponto (Acesso direto estático)
console.log(person.name); // "Carlos"
// console.log(person.data-criacao); // Erro de sintaxe por causa do hífen!

// 2. Notação de Colchetes (Chaves especiais ou variáveis)
console.log(person["data-criacao"]); // "2026-08-26"

const key = "name";
console.log(person[key]); // "Carlos" (acesso dinâmico via variável!)
```

---

## Modificando, Adicionando e Removendo Propriedades

Objetos em JavaScript são **dinâmicos e mutáveis**, mesmo quando declarados com `const`.

> **Comportamento do `const`:**
> A declaração `const` impede a reatribuição da variável (ex: `car = {}`), mas **não impede a alteração, adição ou remoção de suas propriedades internas**.

---

## Operações com Propriedades (Código)

```js
const car = { brand: "Toyota", model: "Corolla" };

// 1. Alterando propriedade existente
car.model = "Civic";

// 2. Adicionando nova propriedade
car.year = 2024;

// 3. Removendo propriedade com o operador delete
delete car.brand;

console.log(car); // { model: 'Civic', year: 2024 }
```

---

## Verificação de Existência de Propriedades

Podemos verificar se uma propriedade existe em um objeto antes de acessá-la:

- **Operador `in`**: Verifica se a chave existe no próprio objeto ou na sua cadeia de protótipos.
- **`Object.hasOwn(obj, prop)`**: Verifica se a chave pertence **diretamente** ao próprio objeto (substituto moderno e seguro para `hasOwnProperty`).

```js
const user = { name: "Bruno", address: { city: "João Pessoa" } };

console.log("name" in user);              // true (propriedade existe)
console.log("age" in user);               // false
console.log(Object.hasOwn(user, "name")); // true (propriedade própria)
```

---

## Encadeamento Opcional (`?.`) e Coalescência Nula (`??`)

Evitam exceções de runtime (`TypeError: Cannot read properties of undefined`):

```js
const user = {
  name: "Bruno",
  address: { city: "João Pessoa" }
};

// Encadeamento opcional (?.) interrompe a avaliação se o valor for null/undefined
const zipcode = user.address?.zipcode ?? "Não informado";
console.log(zipcode); // "Não informado" (usou o valor padrão do ??)

// Acesso seguro a propriedade inexistente sem causar crash
const phone = user.contact?.phone;
console.log(phone); // undefined (em vez de lançar TypeError!)
```

---

## Sintaxe Abreviada: Property Shorthand

Quando a variável tem o mesmo nome da chave do objeto, podemos omitir a repetição (ES6+):

```js
const name = "Mariana";
const role = "Desenvolvedora";

// Sintaxe Tradicional (repetitiva)
const userOld = { name: name, role: role };

// ES6 Property Shorthand (Recomendado!)
const userNew = { name, role };

console.log(userNew); // { name: 'Mariana', role: 'Desenvolvedora' }
```

---

## Sintaxe Abreviada: Method Shorthand

Permite definir métodos em objetos de forma mais enxuta, sem a palavra-chave `function`:

```js
const calculator = {
  // Tradicional: sum: function(a, b) { return a + b; }
  
  // ES6 Method Shorthand (Recomendado!)
  sum(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};

console.log(calculator.sum(10, 5));      // 15
console.log(calculator.subtract(10, 5)); // 5
```

---

## Nomes Computados de Propriedades (*Computed Property Names*)

Permite definir a chave de um objeto dinamicamente usando a sintaxe `[expressão]`:

```js
const prefix = "user_";
const id = 101;

const dynamicObject = {
  [`${prefix}${id}`]: "Dados do usuário 101",
  [1 + 2]: "Valor da chave 3"
};

console.log(dynamicObject);
// { user_101: 'Dados do usuário 101', '3': 'Valor da chave 3' }
```

---

## Desestruturação: Extração e Renomeação

A **Desestruturação** (*Object Destructuring*) extrai propriedades de objetos diretamente para variáveis locais de forma clara:

```js
const product = {
  id: 1,
  title: "Teclado Mecânico",
  price: 250,
  category: "Periféricos"
};

// 1. Extração simples (cria variáveis com os mesmos nomes das chaves)
const { title, price } = product;
console.log(title, price); // "Teclado Mecânico" 250

// 2. Renomeando variáveis extraídas (chave: novoNome)
const { title: productName } = product;
console.log(productName); // "Teclado Mecânico"
```

---

## Desestruturação: Valores Padrão e Rest Operator

```js
const product = {
  id: 1,
  title: "Teclado Mecânico",
  price: 250
};

// 1. Atribuindo valor padrão caso a propriedade seja undefined
const { discount = 0 } = product;
console.log(discount); // 0

// 2. Rest Operator (...) para agrupar as propriedades restantes em um novo objeto
const { id, ...details } = product;
console.log(details); // { title: 'Teclado Mecânico', price: 250 }
```

---

## Operador Spread (`...`) em Objetos

O operador *Spread* permite clonar e mesclar objetos de maneira simples e declarativa:

```js
const baseUser = { id: 1, role: "member", active: true };
const userProfile = { name: "Lucas", email: "lucas@example.com" };

// Mesclando objetos (propriedades repetidas à direita sobrescrevem as anteriores)
const fullUser = {
  ...baseUser,
  ...userProfile,
  role: "admin" // Sobrescreve a propriedade role de baseUser!
};

console.log(fullUser);
// { id: 1, role: 'admin', active: true, name: 'Lucas', email: 'lucas@example.com' }
```

---

## Métodos Estáticos de Inspeção: `keys()`, `values()` e `entries()`

O objeto global `Object` oferece métodos estáticos para converter propriedades em arrays:

```js
const score = { html: 90, css: 85, js: 95 };

// 1. Object.keys() -> Array contendo as chaves do objeto
console.log(Object.keys(score)); // ['html', 'css', 'js']

// 2. Object.values() -> Array contendo os valores das propriedades
console.log(Object.values(score)); // [90, 85, 95]

// 3. Object.entries() -> Array de pares [chave, valor]
console.log(Object.entries(score));
// [ ['html', 90], ['css', 85], ['js', 95] ]
```

---

## Iterando sobre Objetos com `Object.entries()` e `for...of`

Combinando `Object.entries()` com a desestruturação no laço `for...of`:

```js
const score = { html: 90, css: 85, js: 95 };

for (const [subject, note] of Object.entries(score)) {
  console.log(`Nota em ${subject.toUpperCase()}: ${note}`);
}

// Saída:
// Nota em HTML: 90
// Nota em CSS: 85
// Nota em JS: 95
```

---

## Referência vs Clonagem: Cópia Rasa (*Shallow Copy*)

Atribuir um objeto a outra variável **não cria uma nova cópia**, apenas atribui a mesma referência de memória:

```js
const original = { a: 1, details: { b: 2 } };

// Atribuição copia apenas a REFERÊNCIA na memória!
const refCopy = original;
refCopy.a = 99;
console.log(original.a); // 99 (O objeto original foi alterado!)

// Cópia Rasa (Shallow Copy) com Spread ou Object.assign()
const shallowCopy = { ...original };
shallowCopy.a = 42;
console.log(original.a); // 99 (O nível 1 do original foi preservado!)
```

---

## A Armadilha da Cópia Rasa em Níveis Aninhados

Na **Cópia Rasa**, propriedades de nível 1 são clonadas, mas subobjetos no nível 2+ continuam compartilhando a mesma referência na memória:

```js
const original = { a: 1, details: { b: 2 } };
const shallowCopy = { ...original };

// Alterando o objeto interno (nível 2) na cópia rasa:
shallowCopy.details.b = 888;

// ATENÇÃO: O subobjeto original TAMBÉM foi modificado!
console.log(original.details.b); // 888
```

---

## Cópia Profunda (*Deep Copy*): `structuredClone()`

Para duplicar completamente todos os níveis aninhados de um objeto sem compartilhar nenhuma referência, utilize `structuredClone()` (ES2022+):

```js
const complexObject = {
  user: "Daniel",
  settings: { theme: "dark", notifications: true }
};

// Cópia Profunda NATIVA e segura
const deepCopy = structuredClone(complexObject);

// Modificando o nível 2 na cópia profunda:
deepCopy.settings.theme = "light";

console.log(complexObject.settings.theme); // "dark" (Original TOTALMENTE intacto!)
console.log(deepCopy.settings.theme);      // "light"
```

---

## A Palavra-chave `this` em Métodos

Em métodos declarados tradicionalmente, a palavra-chave `this` refere-se ao objeto que chamou o método:

```js
const account = {
  owner: "Fernanda",
  balance: 1000,
  deposit(amount) {
    this.balance += amount;
    console.log(`Novo saldo de ${this.owner}: R$ ${this.balance}`);
  }
};

account.deposit(500); // "Novo saldo de Fernanda: R$ 1500"
```

---

## A Armadilha das Arrow Functions com `this`

> **Regra Importante:** **Arrow Functions não possuem seu próprio `this`**.

Se você usar uma *arrow function* como método de um objeto, o `this` capturará o escopo externo (geralmente o objeto global ou `undefined` em strict mode):

```js
const badUser = {
  name: "Lucas",
  // ERRO: Arrow function herda o `this` do escopo pai/global
  greet: () => {
    console.log(`Olá, meu nome é ${this.name}`);
  }
};

badUser.greet(); // "Olá, meu nome é undefined"
```

---

## Congelando e Selando Objetos: Comparativo

Podemos restringir a mutabilidade de um objeto com `Object.freeze()` e `Object.seal()`:

| Método | Adiciona Novas? | Remove Existentes? | Altera Valores Existentes? |
| --- | --- | --- | --- |
| **`Object.seal(obj)`** | Não | Não | **Sim** |
| **`Object.freeze(obj)`** | Não | Não | **Não** (Torna o nível 1 imutável) |

---

## Imutabilidade com `Object.freeze()` (Código)

```js
const config = Object.freeze({
  apiBaseUrl: "https://api.example.com",
  timeout: 5000
});

// Tentativa de alteração:
config.timeout = 10000;

console.log(config.timeout); // 5000 (Valor preservado!)

// Em 'use strict', tentar alterar um objeto congelado lança um TypeError.
```

---

## Formato JSON (*JavaScript Object Notation*)

O **JSON** é um formato de texto leve para troca de dados entre sistemas (ex: APIs Web).

### Diferenças entre Objeto JS e JSON:
- Em JSON, **todas as chaves devem estar entre aspas duplas** (`"chave": valor`).
- Valores válidos em JSON: strings, números, booleans, `null`, arrays e objetos.
- **Não permite funções/métodos**, `undefined` ou comentários.

```json
{
  "name": "Carlos",
  "age": 30,
  "skills": ["JS", "Node"]
}
```

---

## Conversão JSON: `JSON.stringify()` e `JSON.parse()`

O objeto global `JSON` provê dois métodos fundamentais:

```js
const user = { name: "Ana", age: 25, active: true };

// 1. JSON.stringify(obj) -> Converte Objeto JS em String JSON
const jsonString = JSON.stringify(user);
console.log(typeof jsonString); // "string"
console.log(jsonString);        // '{"name":"Ana","age":25,"active":true}'

// 2. JSON.parse(jsonString) -> Converte String JSON em Objeto JS
const parsedUser = JSON.parse(jsonString);
console.log(typeof parsedUser); // "object"
console.log(parsedUser.name);    // "Ana"
```

---

## Exercício Prático: Mapeamento de Usuário

Dada a resposta de uma API abaixo:

```js
const apiResponse = {
  id: 404,
  name: "Gabriel Santos",
  email: "gabriel@dev.com",
  address: { street: "Rua A", city: "Campina Grande" }
};
```

Crie uma função `formatUserProfile(apiData)` que:
1. Extraia `name`, `email` e a cidade `address.city` usando desestruturação.
2. Retorne um novo objeto no formato `{ name, email, city, active: true }`.

---

## Solução do Exercício

```js
const apiResponse = {
  id: 404,
  name: "Gabriel Santos",
  email: "gabriel@dev.com",
  address: { street: "Rua A", city: "Campina Grande" }
};

function formatUserProfile({ name, email, address: { city } }) {
  return { name, email, city, active: true };
}

console.log(formatUserProfile(apiResponse));
// { name: 'Gabriel Santos', email: 'gabriel@dev.com', city: 'Campina Grande', active: true }
```

---

## Resumo da Aula (Parte 1)

- Objetos são coleções de pares **chave-valor** dinâmicos e mutáveis.
- Use **notação de ponto** (`obj.prop`) por padrão e **colchetes** (`obj[var]`) para chaves dinâmicas ou especiais.
- Evite erros de runtime com **encadeamento opcional** (`?.`) e **coalescência nula** (`??`).
- Facilite a criação com *Property Shorthand* `{ name, age }` e extraia dados com **Desestruturação** `{ name } = obj`.

---

## Resumo da Aula (Parte 2)

- Clone e mescle objetos de forma declarativa com o **Operador Spread** `{ ...obj1, ...obj2 }` (cópia rasa).
- Use `structuredClone(obj)` para criar **cópias profundas** de objetos com níveis aninhados.
- Lembre-se de que *Arrow Functions* não devem ser usadas como métodos de objetos que dependem de `this`.
- Restrinja alterações com `Object.freeze()` e `Object.seal()`.
- Converta objetos para texto de API usando `JSON.stringify()` e recupere objetos com `JSON.parse()`.
