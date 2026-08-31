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
title: "JavaScript: Objetos, Classes e Protótipos"
description: "Criação, notação literal, encadear opcional, desestruturação, operador spread, classes ES6+ (construtor, herança, campos privados), métodos estáticos do Object e JSON em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Objetos, Classes e Protótipos

Criação, notação literal, encadear opcional, desestruturação, operador spread, classes ES6+ (construtor, herança, campos privados), métodos estáticos do Object e JSON em JavaScript.

---

## Objetivo

- Compreender a estrutura de dados de Objeto em JavaScript, dominar a criação por notação literal, diferenciar acesso por ponto.

---

## Mapa da Aula

- Criação de Objetos e Notação Literal
- Property Shorthand (Sintaxe Abreviada de Propriedades)
- Acesso, Modificação e Remoção de Propriedades
- Desestruturação de Objetos (Destructuring)
- Desestruturação em Parâmetros de Funções
- Operador Spread e Imutabilidade em Objetos

---

## Criação de Objetos e Notação Literal

- O valor de uma propriedade pode ser de qualquer tipo: primitivos, arrays, outros objetos ou funções (que recebem o nome de métodos).

```txt
Pilha                         Memória heap
┌───────────────┐             ┌──────────────────────────────┐
│ const student │ ─endereço─► │ { name, email, address, ... } │
└───────────────┘             └──────────────┬───────────────┘
                                             ▼
                                      Object.prototype
```

---

## Criação de Objetos e Notação Literal (Comparação)

| Elemento | Descrição | Exemplo |
| -------- | --------- | ------- |
| **Notação Literal** | Forma mais comum e legível de criar objetos com `{}` | `const user = { name: "Ana" };` |
| **Chave (Key)** | Identificador da propriedade (string ou Symbol) | `name`, `age`, `"end-point"` |
| **Valor (Value)** | Qualquer dado associado à chave | `"Ana"`, `28`, `true`, `[1, 2]` |
| **Método** | Uma função armazenada como valor de uma propriedade | `sayHello() { return "Olá!"; }` |
| **Tipo de Dado** | Tipo de dado não primitivo em JavaScript | `typeof {}` // `"object"` |

---

## Criação de Objetos e Notação Literal (Exemplo)

```js
// 1. Literal de Objeto (Recomendado)
const student = {
  id: 2026101,
  name: "Fulano de Tal",
  email: "fulano@ifpb.edu.br",
  active: true,
  courses: ["DW", "Redes"],
  // Método do objeto (sintaxe abreviada do ES6)
  getSummary() {
    return `${this.name} (${this.email})`;
  },
};
// ...
```

---

## Property Shorthand (Sintaxe Abreviada de Propriedades)

- Quando o nome da variável local é idêntico ao nome da chave do objeto que se deseja criar.
- Referência: Working with objects | MDN.

---

## Property Shorthand (Sintaxe Abreviada de Propriedades) (Exemplo)

```js
const name = "Alice";
const email = "alice@gmail.com";
const role = "admin";

// Forma tradicional (verbosa)
const userOld = { name: name, email: email, role: role };

// Forma moderna com Property Shorthand
const user = { name, email, role };

console.log(user); // { name: 'Alice', email: 'alice@gmail.com', role: 'admin' }
```

---

## Acesso, Modificação e Remoção de Propriedades

- O acesso às propriedades de um objeto pode ser feito por Notação de Ponto (`obj.prop`) ou por Notação de Colchetes (`obj["prop"]`).

---

## Notação de Ponto vs Notação de Colchetes

- As duas notações acessam a mesma propriedade, mas só uma delas aceita nomes calculados em tempo de execução

---

## Notação de Ponto vs Notação de Colchetes (Exemplo)

```js
const host = {
  hostname: "web-server-01",
  ip: "192.168.1.10",
  "content-type": "application/json", // Chave com hífen precisa de aspas!
  200: "OK",                         // Chave numérica
};

// 1. Notação de Ponto (mais comum)
console.log(host.hostname); // "web-server-01"
console.log(host.ip);       // "192.168.1.10"

// 2. Notação de Colchetes (obrigatória para chaves com hífens, espaços ou números)
// ...
```

---

## Adição, Alteração e Remoção

- Objetos em JavaScript são mutáveis por padrão.
- Propriedades podem ser atribuídas ou removidas a qualquer momento.

---

## Adição, Alteração e Remoção (Exemplo)

```js
const config = {
  theme: "dark",
  timeout: 5000,
};

// Adicionando nova propriedade
config.retries = 3;

// Alterando valor de propriedade existente
config.timeout = 10000;

console.log(config); // { theme: 'dark', timeout: 10000, retries: 3 }
// ...
```

---

## Verificação de Existência de Propriedades (Operador `in` e `Object.hasOwn`)

- Operador `in`: Retorna `true` se a propriedade existir no objeto ou em qualquer nível da sua cadeia de protótipos (prototype chain).
- `Object.hasOwn(obj, prop)`: Retorna `true` apenas se a propriedade for direta/própria do objeto (own property).
- Para verificar se uma propriedade existe em um objeto, o JavaScript disponibiliza o operador `in` e o método estático `Object.

---

## Verificação de Existência de Propriedades (Operador `in` e `Object.hasOwn`) (Exemplo)

```js
const user = { name: "Bruno", age: 25 };

// 1. Verificando propriedades diretas do objeto:
console.log("name" in user);               // true
console.log(Object.hasOwn(user, "name")); // true

// 2. Propriedade inexistente:
console.log("email" in user);              // false
console.log(Object.hasOwn(user, "email"));// false

// 3. Propriedades herdadas do protótipo (ex: toString de Object.prototype):
console.log("toString" in user);               // true (encontrado na cadeia de protótipos)
console.log(Object.hasOwn(user, "toString")); // false (não é propriedade direta)
```

---

## Encadear Opcional (Optional Chaining: `?.`)

- O operador de Encadear Opcional (`?.`) permite acessar propriedades com segurança: caso o alvo seja `null` ou `undefined`.
- Declarar um objeto com `const` impede que a variável seja reassociada a um novo objeto na memória.
- No entanto, as propriedades internas do objeto continuam mutáveis — elas podem ser alteradas, adicionadas ou deletadas normalmente.

---

## Encadear Opcional (Optional Chaining: `?.`) (Exemplo)

```js
const user = {
  id: 1,
  name: "Carlos",
  profile: {
    address: {
      city: "João Pessoa"
    }
  }
};

// ❌ Sem Optional Chaining: se 'settings' for undefined, aceso gera TypeError
// const theme = user.settings.theme; // TypeError: Cannot read properties of undefined
// ...
```

---

## Desestruturação de Objetos (Destructuring) (Exemplo)

```js
const person = {
  firstName: "Maria",
  lastName: "Silva",
  age: 30,
  city: "João Pessoa",
};

// Extraindo propriedades com os mesmos nomes das chaves
const { firstName, age } = person;
console.log(firstName); // "Maria"
console.log(age);       // 30

// ...
```

---

## Desestruturação em Parâmetros de Funções

- A desestruturação é extremamente útil em parâmetros de funções, permitindo receber objetos de opção com clareza.
- Referência: Destructuring assignment | MDN.

---

## Desestruturação em Parâmetros de Funções (Exemplo)

```js
function displayServerInfo({ hostname, ip, port = 80 }) {
  console.log(`Servidor ${hostname} rodando em http://${ip}:${port}`);
}

const webServer = {
  hostname: "api-server",
  ip: "10.0.0.15",
  port: 3000,
};

displayServerInfo(webServer); // "Servidor api-server rodando em http://10.0.0.15:3000"
```

---

## Operador Spread e Imutabilidade em Objetos

- O operador de espalhamento (`...`) permite copiar e mesclar propriedades de objetos de forma rasa (shallow copy).
- O spread copia propriedades enumeráveis do objeto base e depois sobrescreve as chaves repetidas.

```txt
baseConfig              override
┌──────────────┐        ┌─────────────┐
│ env: dev     │        │ env: prod   │
│ debug: true  │  +     │ port: 8080  │
│ port: 3000   │        └─────────────┘
└──────────────┘              │
                              ▼
                      { env: prod, debug: true, port: 8080 }
```

---

## Operador Spread e Imutabilidade em Objetos (Exemplo)

```js
const baseConfig = {
  env: "development",
  debug: true,
  port: 3000,
};

// Criando uma cópia e sobrescrevendo a propriedade 'env' e 'port'
const prodConfig = {
  ...baseConfig,
  env: "production",
  port: 8080,
};
// ...
```

---

## Congelando Objetos com Object.freeze()

- Se você precisa impedir que um objeto tenha suas propriedades alteradas, adicionadas ou deletadas, pode utilizar `Object.freeze()`.

---

## Congelando Objetos com Object.freeze() (Exemplo)

```js
const immutableConfig = Object.freeze({
  apiUrl: "https://api.devlab.org",
  version: "v1",
});

// Tentativa de alteração é ignorada em modo padrão (ou lança erro em strict mode)
immutableConfig.version = "v2";
immutableConfig.timeout = 5000;

console.log(immutableConfig); // { apiUrl: 'https://api.devlab.org', version: 'v1' }
```

---

## Declaração de Classes e o Construtor

- Uma classe é declarada com a palavra-chave `class`.
- O método especial `constructor()` é executado automaticamente quando um novo objeto é instanciado com o operador `new`.

---

## Declaração de Classes e o Construtor (Exemplo)

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Método de instância (armazenado no User.prototype)
  getProfile() {
    return `${this.name} (${this.email})`;
  }
}

const user1 = new User("Ana Silva", "ana@devlab.org");
console.log(user1.getProfile()); // "Ana Silva (ana@devlab.org)"
```

---

## Mapeamento entre Classes e a Cadeia de Protótipos

- Uma instância criada com `class` continua ligada a uma cadeia de protótipos.

```txt
const user1
    │
    ▼
Instância { name, email }
    │ __proto__
    ▼
User.prototype { getProfile() }
    │ __proto__
    ▼
Object.prototype
```

---

## Encapsulamento com Atributos Privados (`#`) e Getters/Setters

- No ES2022, o JavaScript introduziu os campos privados prefixados com `#`.
- Atributos e métodos privados não podem ser acessados diretamente de fora da classe, garantindo encapsulamento no tempo de execução.

---

## Encapsulamento com Atributos Privados (`#`) e Getters/Setters (Exemplo)

```js
class BankAccount {
  owner;
  // Atributo privado (ES2022+) - inacessível fora da classe
  #balance = 0;

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  // Getter para leitura controlada
  get balance() {
// ...
```

---

## Herança de Classes com `extends` e `super`

- Uma classe pode herdar propriedades e métodos de outra classe utilizando a palavra-chave `extends`.
- No construtor da subclasse, a função `super()` deve ser obrigatoriamente chamada antes de utilizar a referência `this`.
- O diagrama a seguir ilustra a relação de herança entre a classe base `User` e a subclasse `Admin`
- classDiagram class User { +String name +String email +getProfile() String
- class Admin { +Array permissions +getProfile() String

---

## Herança de Classes com `extends` e `super` (Exemplo)

```js
class Admin extends User {
  constructor(name, email, permissions) {
    // Chama o construtor da classe pai (User)
    super(name, email);
    this.permissions = permissions;
  }

  // Sobrescrita de método (Method Overriding)
  getProfile() {
    return `[ADMIN] ${super.getProfile()} - Permissões: ${this.permissions.join(", ")}`;
  }
}
// ...
```

---

## Métodos e Campos Estáticos (`static`)

- Métodos e propriedades marcados com a palavra-chave `static` pertencem à própria classe, e não às instâncias criadas a partir dela.

---

## Métodos e Campos Estáticos (`static`) (Exemplo)

```js
class MathUtils {
  static PI = 3.14159;

  static calculateCircleArea(radius) {
    return this.PI * radius * radius;
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.calculateCircleArea(5)); // 78.53975
```

---

## Iteração sobre Objetos

- Diferente de arrays, objetos comuns não são diretamente iteráveis com `for...of`.
- JavaScript oferece o laço `for...in` e métodos estáticos auxiliares no objeto `Object` para inspecionar chaves e valores.
- Referência: Object.entries() | MDN.

---

## Iteração sobre Objetos (Comparação)

| Método / Estrutura | Retorno | Descrição |
| ------------------ | ------- | --------- |
| `for...in` | Chaves (`string`) | Laço que percorre as chaves enumeráveis do objeto |
| `Object.keys(obj)` | `Array<string>` | Retorna um array com os nomes das chaves do objeto |
| `Object.values(obj)` | `Array<any>` | Retorna um array com os valores de todas as propriedades |
| `Object.entries(obj)` | `Array<[string, any]>` | Retorna um array de pares `[chave, valor]` |

---

## Iteração sobre Objetos (Exemplo)

```js
const scores = {
  Alice: 95,
  Bruno: 80,
  Carla: 90,
};

// 1. Object.keys() - Obtendo lista de chaves
const names = Object.keys(scores);
console.log(names); // [ 'Alice', 'Bruno', 'Carla' ]

// 2. Object.values() - Obtendo lista de valores
const points = Object.values(scores);
// ...
```

---

## O Formato e Objeto JSON

- JSON (JavaScript Object Notation) é um formato leve e estritamente textual para troca de dados entre sistemas (por exemplo.
- Apesar de derivar da sintaxe de objetos do JavaScript, o formato JSON possui regras estritas

---

## O Formato e Objeto JSON (Comparação)

| Característica | Objeto JavaScript | Formato JSON |
| -------------- | ----------------- | ------------ |
| **Nomes de Chaves** | Podem ser sem aspas (`name: "Ana"`) | **Devem** estar entre aspas duplas (`"name": "Ana"`) |
| **Strings** | Aspas simples, duplas ou crases | **Devem** usar apenas aspas duplas (`"..."`) |
| **Tipos de Dados Aceitos** | Primitivos, arrays, objetos e **funções** | Apenas primitivos (número, string, boolean, null), arrays e objetos |
| **Vírgula Final (Trailing Comma)** | Permitida (`{ a: 1, }`) | **Proibida** (`{ "a": 1 }`) |

---

## O Formato e Objeto JSON (Exemplo)

```json
{
  "id": 101,
  "name": "Servidor Principal",
  "active": true,
  "tags": ["web", "production"],
  "specs": {
    "cpu": 4,
    "ram": "16GB"
  }
}
```

---

## O Objeto Global JSON (stringify e parse)

- `JSON.stringify(obj)`: Converte um objeto/valor JavaScript em uma string no formato JSON.
- `JSON.parse(jsonString)`: Converte uma string JSON em um objeto/valor JavaScript.
- Em JavaScript, o objeto global `JSON` oferece dois métodos essenciais para conversão
- O fluxo é bidirecional entre dados em memória e representação textual para transmissão.

```txt
Objeto em memória ──JSON.stringify()──► texto JSON
Objeto em memória ◄──JSON.parse()────── texto JSON
```

---

## O Objeto Global JSON (stringify e parse) (Exemplo)

```js
const userObject = {
  id: 1,
  name: "Carlos",
  email: "carlos@gmail.com",
};

// 1. Serialização (Objeto JS -> String JSON)
const jsonString = JSON.stringify(userObject);
console.log(typeof jsonString); // "string"
console.log(jsonString);        // '{"id":1,"name":"Carlos","email":"carlos@gmail.com"}'

// 2. Deserialização (String JSON -> Objeto JS)
// ...
```

---

## Resumo e Boas Práticas

- Use notação literal `{}` para declarar objetos.
- Utilize Property Shorthand (`{ name, age }`) para simplificar a criação a partir de variáveis.
- Prefira desestruturação para extrair propriedades de objetos.
- Utilize `Object.keys()`, `Object.values()` e `Object.entries()` para iterar sobre objetos de forma funcional.
- Lembre-se de que JSON requer chaves com aspas duplas e não aceita funções nem `undefined`.

---

## Criação e Acesso

- Qual é a diferença entre Notação de Ponto (`obj.prop`) e Notação de Colchetes (`obj["prop"]`)?
- A notação de ponto é mais simples e legível, mas exige que a chave seja um identificador válido sem espaços ou hifens.
- A notação de colchetes permite usar chaves arbitrárias (com hífens.
- O que acontece ao tentar acessar uma propriedade que não existe em um objeto?
- O que é Property Shorthand e quando podemos utilizá-lo?

---

## Desestruturação e Imutabilidade

- Como funciona a atribuição por desestruturação em objetos e como renomear uma variável durante a extração?
- A desestruturação extrai valores de chaves de um objeto para variáveis com o mesmo nome (`const { name } = user`).
- Para renomear a variável extraída, utiliza-se a sintaxe `chave: novoNome` (ex: `const { name: fullName } = user`).
- Declarar um objeto com `const` impede a alteração de suas propriedades internas?
- A palavra-chave `const` impede apenas a reassociação da variável a outro objeto na memória.

---

## Métodos do Object e JSON

- Quais são as diferenças entre os métodos `Object.keys()`, `Object.values()` e `Object.entries()`?
- `Object.keys()` retorna um array com os nomes das chaves.
- `Object.values()` retorna um array com os valores das propriedades.
- `Object.entries()` retorna um array de pares `[chave, valor]`.
- Quais são as principais diferenças entre um Objeto JavaScript e uma string no formato JSON?

---

## Classes e Orientação a Objetos

- Qual é a relação entre a sintaxe de `class` no ES6+ e a cadeia de protótipos em JavaScript?
- Métodos definidos dentro da classe são armazenados no protótipo (`User.prototype`) e compartilhados por todas as instâncias.
- Como funcionam os campos privados (`#`) e qual a diferença em relação a atributos convenções comuns?
- Campos iniciados com `#` (ES2022) são verdadeiramente privados e inacessíveis fora do corpo da classe no tempo de execução.
- Para que servem a palavra-chave `extends` e a função `super()` em subclasses?

---

## Executando

- Crie um arquivo chamado `object-demo.js`
- Execute o arquivo com Node.js no terminal
- Modifique as propriedades do objeto e teste a desserialização com `JSON.parse()`.
- Os conceitos de manipulação de Objetos e JSON podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Crie um objeto `networkHost` com as propriedades `name` (`"Router-01"`), `ip` (`"192.168.1.1"`).
- Adicione uma nova propriedade `gateway` com o valor `"192.168.1.254"`;
- Remova a propriedade `active` usando o operador `delete`;
- Utilize a desestruturação para extrair `name`, `ip` e `gateway` em variáveis locais;
- Imprima no console uma string formatada no padrão: `"Dispositivo: [NAME] | IP: [IP] | Gateway: [GATEWAY]"`.

---

## Desafio

- Crie uma string JSON chamada `jsonInput` contendo um array de objetos de servidores com as chaves `"id"`, `"hostname"`, `"ip"`.
- Converta a string JSON para um array de objetos JavaScript usando `JSON.parse()`;
- Utilize `filter` para selecionar apenas os servidores que estão `"online"`;
- Utilize `Object.entries()` ou `map` para extrair um relatório contendo apenas o `hostname` e o status da CPU em formato formatado;
- Imprima o resultado final no console e converta o relatório de servidores online de volta para uma string JSON com `JSON.stringify()`.

---

## Resumo da Aula

- **Criação & Acesso**: Literais `{}` com Property Shorthand (`{ name, age }`); acesso por ponto (`obj.prop`) ou colchetes (`obj[key]`) para chaves dinâmicas.
- **Mutabilidade & Imutabilidade**: Objetos são passados por referência; `Object.freeze()` impede mutações rasas; o spread `...` permite cópia rasa e mesclagem.
- **Desestruturação & Verificação**: `{ prop } = obj` para extração limpa; `in` verifica propriedades próprias e herdadas, enquanto `Object.hasOwn()` restringe a próprias.
- **Classes & Protótipos**: Sintaxe `class` com `constructor`, herança via `extends`/`super` e encapsulamento com campos privados `#privado`.
- **JSON**: Formato estrito (aspas duplas obrigatórias nas chaves, sem funções); serialização com `JSON.stringify()` e desserialização com `JSON.parse()`.
