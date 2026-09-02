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
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: 'JavaScript: Objetos, Classes e Protótipos'
description: 'Criação, notação literal, encadear opcional, desestruturação, operador spread, classes ES6+ (construtor, herança, campos privados), métodos estáticos do Object e JSON em JavaScript.'
---

<!-- _class: lead -->

# JavaScript: Objetos, Classes e Protótipos

Notação literal, classes ES6+, encapsulamento (`#`), métodos de `Object` e JSON.

---

## Objetivo

Dominar a modelagem de dados, Programação Orientada a Objetos e manipulação de JSON em JavaScript.

- Criar objetos com **notação literal `{}`** e **Property Shorthand**.
- Acessar propriedades com **ponto**, **colchetes dinâmicos** e **Optional Chaining (`?.`)**.
- Inspecionar existência com o **operador `in`** e **`Object.hasOwn()`**.
- Aplicar **desestruturação** e o **operador spread (`...`)** para imutabilidade.
- Declarar e instanciar **classes ES6+** com construtores, herança (`extends`, `super()`), métodos estáticos e **campos privados (`#`)**.
- Iterar com **`Object.keys()`**, **`Object.values()`** e **`Object.entries()`**, e manipular dados com **`JSON.stringify()`** e **`JSON.parse()`**.

---

## Mapa da Aula

- Notação Literal e Property Shorthand
- Acesso a Propriedades (Ponto vs Colchetes)
- Verificação de Existência (`in` vs `Object.hasOwn`)
- Optional Chaining (`?.`) e Coalescência Nula (`??`)
- Desestruturação e Parâmetros de Funções
- Operador Spread (`...`) e `Object.freeze()`
- Classes ES6+: Construtores, Métodos e Protótipos
- Campos Privados (`#`) e Herança (`extends` / `super`)
- Métodos Estáticos e Iteração (`Object.entries`)
- Formato e Objeto Global JSON (`stringify` / `parse`)
- Exercício, Desafio e Revisão

---

## Criação de Objetos e Notação Literal

Um **objeto** é uma coleção dinâmica de pares **chave-valor**:

```js
const student = {
  id: 2026101,
  name: "Fulano de Tal",
  email: "fulano@ifpb.edu.br",
  courses: ["DW", "Redes"],
  // Método do objeto (sintaxe abreviada ES6)
  getSummary() {
    return `${this.name} (${this.email})`;
  },
};

console.log(student.name);        // "Fulano de Tal"
console.log(student.getSummary());// "Fulano de Tal (fulano@ifpb.edu.br)"
console.log(typeof student);      // "object"
```

- Objetos são armazenados na memória Heap e passados por **referência**.

---

## Property Shorthand (Propriedades Abreviadas)

Quando o nome da variável é idêntico à chave do objeto, omita a repetição:

```js
const name = "Alice";
const email = "alice@gmail.com";
const role = "admin";

// Forma tradicional:
// const user = { name: name, email: email, role: role };

// Forma moderna com Property Shorthand:
const user = { name, email, role };

console.log(user);
// { name: 'Alice', email: 'alice@gmail.com', role: 'admin' }
```

---

## Acesso: Ponto vs Colchetes

```js
const host = {
  hostname: "web-server-01",
  ip: "192.168.1.10",
  "content-type": "application/json", // Chave com hífen
  200: "OK",                         // Chave numérica
};

// 1. Notação de Ponto (mais comum e legível)
console.log(host.hostname); // "web-server-01"

// 2. Notação de Colchetes (obrigatória para caracteres especiais e números)
console.log(host["content-type"]); // "application/json"
console.log(host[200]);            // "OK"

// 3. Colchetes com Chaves Dinâmicas (variáveis)
const key = "ip";
console.log(host[key]); // "192.168.1.10"
```

---

## Modificação e Remoção de Propriedades

Objetos são dinâmicos e mutáveis por padrão:

```js
const config = { theme: "dark", timeout: 5000 };

// Adição de nova propriedade:
config.retries = 3;

// Modificação de propriedade existente:
config.timeout = 10000;

console.log(config); // { theme: 'dark', timeout: 10000, retries: 3 }

// Remoção com o operador delete:
delete config.retries;
console.log(config.retries); // undefined
```

- `const` protege a ligação da variável, mas **não impede** alteração de propriedades internas.

---

## Verificação de Existência: `in` vs `Object.hasOwn`

- **Operador `in`**: busca a propriedade no objeto e em toda a **cadeia de protótipos**.
- **`Object.hasOwn(obj, prop)`**: verifica **apenas propriedades próprias/diretas**.

```js
const user = { name: "Bruno", age: 25 };

// Propriedades próprias diretas:
console.log("name" in user);               // true
console.log(Object.hasOwn(user, "name"));  // true

// Propriedades herdadas de Object.prototype:
console.log("toString" in user);              // true (está no protótipo)
console.log(Object.hasOwn(user, "toString")); // false (não é propriedade direta)
```

---

## Optional Chaining (`?.`) e Coalescência Nula (`??`)

Permite navegar em objetos aninhados com segurança, evitando `TypeError` se algum nível for `null` ou `undefined`:

```js
const user = {
  id: 1,
  name: "Carlos",
  profile: { address: { city: "João Pessoa" } },
};

// Acesso seguro:
const city = user?.profile?.address?.city; // "João Pessoa"
const zip = user?.profile?.address?.zip;   // undefined (sem erro)
const theme = user?.settings?.theme;       // undefined (settings não existe)

// Combinando com fallback via ??
const currentTheme = user?.settings?.theme ?? "light";
console.log(currentTheme); // "light"
```

---

## Desestruturação Básica de Objetos

Extrai propriedades por chave (a ordem das variáveis é livre):

```js
const person = {
  firstName: "Maria",
  age: 30,
  city: "João Pessoa",
};

// Extração por nome da chave (a ordem é irrelevante)
const { age, firstName } = person;
console.log(firstName, age); // "Maria" 30
```

---

## Desestruturação: Renomeação e Valores Padrão

Renomeie identificadores e defina valores de *fallback*:

```js
const person = {
  firstName: "Maria",
  city: "João Pessoa",
};

// 1. Renomeando variáveis locais (chave: novoNome)
const { city: location } = person;
console.log(location); // "João Pessoa"

// 2. Valor padrão para propriedade ausente ou undefined
const { role = "visitante" } = person;
console.log(role); // "visitante"
```

---

## Desestruturação em Parâmetros de Funções

Ideal para parâmetros nomeados e objetos de opções (ordem livre):

```js
function displayServer({ hostname, ip, port = 80 }) {
  console.log(`Servidor ${hostname} rodando em http://${ip}:${port}`);
}

// Propriedades enviadas em qualquer ordem
const server = {
  ip: "10.0.0.15",
  port: 3000,
  hostname: "api-server",
};

displayServer(server);
// "Servidor api-server rodando em http://10.0.0.15:3000"
```

---

## A Armadilha da Atribuição por Referência

Atribuir um objeto a outra variável copia apenas a referência na memória:

```js
const originalUser = { name: "Ana", role: "user" };

// Ambas apontam para o mesmo objeto na Heap
const aliasUser = originalUser;
aliasUser.role = "admin";

console.log(originalUser.role); // "admin" (original foi modificado!)
console.log(originalUser === aliasUser); // true (mesmo endereço)
```

- Para evitar esse efeito colateral, gere uma cópia com **Spread** ou **`structuredClone()`**.

---

## Comparação de Objetos: Referência vs Conteúdo

`===` compara o **endereço de memória**, e não o conteúdo estrutural:

```js
const userA = { name: "Carlos", age: 28 };
const userB = { name: "Carlos", age: 28 };

// Mesmo conteúdo, mas endereços de memória distintos:
console.log(userA === userB); // false
console.log({} === {});       // false (cada {} aloca nova referência)
```

- Para testar igualdade estrutural profunda, compare propriedade por propriedade.

---

## Operador Spread (`...`) e Imutabilidade

Copia propriedades de forma rasa (*shallow copy*) e permite mesclagens:

```js
const baseConfig = {
  env: "development",
  debug: true,
  port: 3000,
};

// Copia baseConfig e sobrescreve env e port
const prodConfig = {
  ...baseConfig,
  env: "production",
  port: 8080,
};

console.log(baseConfig.port); // 3000 (inalterado)
console.log(prodConfig.port); // 8080
```

---

## Cópia Rasa vs Cópia Profunda (`structuredClone`)

O spread copia apenas o 1º nível; use `structuredClone()` para aninhamentos:

```js
const user = { name: "Beatriz", address: { city: "João Pessoa" } };

// 1. Cópia rasa: address ainda é compartilhado!
const shallow = { ...user };
shallow.address.city = "Campina Grande"; // AFETA user.address.city!

// 2. Cópia profunda: 100% isolada e independente
const deep = structuredClone(user);
deep.address.city = "Cabedelo"; // user.address.city continua intacto
```

---

## Imutabilidade com `Object.freeze()`

Impede qualquer alteração, inclusão ou exclusão de propriedades de um objeto:

```js
const immutableConfig = Object.freeze({
  apiUrl: "https://api.devlab.org",
  version: "v1",
});

// Alterações são bloqueadas silenciosamente (ou disparam erro no strict mode):
immutableConfig.version = "v2";
immutableConfig.timeout = 5000;

console.log(immutableConfig);
// { apiUrl: 'https://api.devlab.org', version: 'v1' }
```

- Nota: `Object.freeze` realiza congelamento raso (*shallow freeze*).

---

## Classes ES6+ e Construtores

Sintaxe orientada a objetos sobre a cadeia de protótipos do JavaScript:

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Método de instância (compartilhado via User.prototype)
  getProfile() {
    return `${this.name} (${this.email})`;
  }
}

const user1 = new User("Ana Silva", "ana@devlab.org");
console.log(user1.getProfile()); // "Ana Silva (ana@devlab.org)"
```

---

## Campos Privados (`#`) e Encapsulamento

Campos iniciados com `#` (ES2022+) são estritamente privados em tempo de execução:

```js
class BankAccount {
  owner;
  #balance = 0; // Campo privado inacessível fora da classe

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  get balance() { return this.#balance; }

  deposit(amount) {
    if (amount <= 0) throw new Error("Valor deve ser positivo.");
    this.#balance += amount;
  }
}

const account = new BankAccount("Carlos", 500);
account.deposit(200);
console.log(account.balance); // 700
// console.log(account.#balance); // SyntaxError!
```

---

## Herança com `extends` e `super()`

Uma subclasse herda métodos e construtor da classe base:

```js
class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email); // Invocação obrigatória do construtor pai
    this.permissions = permissions;
  }

  // Sobrescrita de método (Method Overriding)
  getProfile() {
    return `[ADMIN] ${super.getProfile()} - Permissões: ${this.permissions.join(", ")}`;
  }
}

const admin = new Admin("Beatriz", "beatriz@devlab.org", ["READ", "WRITE"]);
console.log(admin.getProfile());
// "[ADMIN] Beatriz (beatriz@devlab.org) - Permissões: READ, WRITE"
```

---

## Membros Estáticos (`static`)

Atributos e métodos estáticos pertencem à **própria classe**, e não às instâncias:

```js
class MathUtils {
  static PI = 3.14159;

  static calculateCircleArea(radius) {
    return this.PI * radius * radius;
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.calculateCircleArea(5)); // 78.53975

// Instâncias não possuem métodos estáticos:
// const m = new MathUtils();
// m.calculateCircleArea(5); // TypeError: m.calculateCircleArea is not a function
```

---

## Iteração sobre Objetos

```js
const scores = { Alice: 95, Bruno: 80, Carla: 90 };

// 1. Object.keys() -> Array de chaves
console.log(Object.keys(scores)); // ['Alice', 'Bruno', 'Carla']

// 2. Object.values() -> Array de valores
console.log(Object.values(scores)); // [95, 80, 90]

// 3. Object.entries() -> Array de pares [chave, valor]
console.log(Object.entries(scores)); 
// [['Alice', 95], ['Bruno', 80], ['Carla', 90]]

// Iterando com for...of e desestruturação:
for (const [student, score] of Object.entries(scores)) {
  console.log(`${student}: ${score}`);
}
```

---

## Objeto vs Formato JSON

**JSON** (*JavaScript Object Notation*) é um padrão textual rigoroso para transmissão de dados:

| Regra | Objeto JavaScript | Formato JSON |
| :--- | :--- | :--- |
| **Aspas nas chaves** | Opcionais (`name: "Ana"`) | **Obrigatórias com aspas duplas** (`"name": "Ana"`) |
| **Aspas nas strings** | Aspas simples, duplas ou crases | **Apenas aspas duplas** (`"..."`) |
| **Tipos aceitos** | Primitivos, arrays, objetos, **funções** | Primitivos, arrays e objetos (sem funções) |
| **Vírgula final** | Permitida (`{ a: 1, }`) | **Proibida** (`{ "a": 1 }`) |

---

## Objeto Global JSON: `stringify` e `parse`

```js
const user = {
  id: 1,
  name: "Carlos",
  email: "carlos@gmail.com",
};

// 1. Serialização: Objeto JS -> String JSON
const jsonString = JSON.stringify(user);
console.log(typeof jsonString); // "string"
console.log(jsonString); // '{"id":1,"name":"Carlos","email":"carlos@gmail.com"}'

// 2. Desserialização: String JSON -> Objeto JS
const parsedUser = JSON.parse(jsonString);
console.log(typeof parsedUser); // "object"
console.log(parsedUser.name);   // "Carlos"
```

---

## JSON: Indentação para Depuração

O 3º argumento de `JSON.stringify(valor, replacer, espaço)` indenta a saída:

```js
const user = { id: 1, name: "Carlos", roles: ["admin", "editor"] };

// Saída compacta (padrão de rede):
console.log(JSON.stringify(user));
// '{"id":1,"name":"Carlos","roles":["admin","editor"]}'

// Saída indentada com 2 espaços (depuração/logs):
console.log(JSON.stringify(user, null, 2));
```

---

## JSON: Restrições de Tipos e Incompatibilidades

Nem todos os valores do JavaScript sobrevivem à serialização:

- **`Date`**: vira string ISO 8601 (não volta como `Date` no `JSON.parse()`).
- **`undefined`, funções e `Symbol`**: omitidos em objetos; viram `null` em arrays.
- **`NaN`, `Infinity`**: convertidos para `null`.
- **`BigInt`**: lança erro de execução (`TypeError`).
- **`Map`, `Set`, `RegExp`**: serializados como objetos vazios `{}`.
- **Referências circulares**: lançam `TypeError`.

---

## Exercício Prático: Dispositivo de Rede

1. Crie o objeto `networkHost` com `name`, `ip`, `mask` e `active`.
2. Adicione a propriedade `gateway = "192.168.1.254"`.
3. Remova a propriedade `active` com o operador `delete`.
4. Extraia `name`, `ip` e `gateway` usando desestruturação e exiba formatado.

```js
const networkHost = {
  name: "Router-01",
  ip: "192.168.1.1",
  mask: "255.255.255.0",
  active: true,
};

networkHost.gateway = "192.168.1.254";
delete networkHost.active;

const { name, ip, gateway } = networkHost;
console.log(`Dispositivo: ${name} | IP: ${ip} | Gateway: ${gateway}`);
// "Dispositivo: Router-01 | IP: 192.168.1.1 | Gateway: 192.168.1.254"
```

---

## Desafio: Relatório de Servidores em JSON

```js
const jsonInput = `[
  { "id": 1, "hostname": "web-01", "ip": "10.0.0.1", "cpuUsage": 45, "online": true },
  { "id": 2, "hostname": "db-01", "ip": "10.0.0.2", "cpuUsage": 88, "online": true },
  { "id": 3, "hostname": "cache-01", "ip": "10.0.0.3", "cpuUsage": 12, "online": false }
]`;

const servers = JSON.parse(jsonInput);
const onlineServers = servers.filter((s) => s.online);

const report = onlineServers.map(({ hostname, cpuUsage }) => ({
  host: hostname,
  load: `${cpuUsage}%`,
}));

console.log(report);
// [ { host: 'web-01', load: '45%' }, { host: 'db-01', load: '88%' } ]

console.log(JSON.stringify(report, null, 2));
// [
//   { "host": "web-01", "load": "45%" },
//   { "host": "db-01", "load": "88%" }
// ]
```

---

## Perguntas de Revisão

- Qual a diferença entre notação de ponto (`obj.prop`) e notação de colchetes (`obj["prop"]`)?
- O que é *Property Shorthand* e quando podemos utilizá-lo?
- Declarar um objeto com `const` impede a alteração de suas propriedades internas?
- Por que `{ a: 1 } === { a: 1 }` é `false` e como clonar objetos aninhados com `structuredClone()`?
- Qual a diferença entre o operador `in` e o método `Object.hasOwn()`?
- Para que serve o operador de *Optional Chaining* (`?.`)?
- O que é *shallow copy* e como realizá-la com o operador spread (`...`)?
- Como funcionam os campos privados (`#`) em classes ES6+?
- Quais são as principais diferenças e restrições de tipos entre um objeto JS e o padrão JSON?

---

## Resumo da Aula

- **Objetos Literais**: pares chave-valor na Heap com sintaxe concisa (`{ prop }`).
- **Acesso Seguro**: notação de colchetes dinâmicos e *Optional Chaining* (`?.`).
- **Imutabilidade e Clonagem**: referências na Heap, `...spread` para cópias rasas e `structuredClone()` para cópias profundas.
- **Classes Modernas**: `class`, `constructor`, herança com `extends`/`super()` e campos `#`.
- **Iteração**: `Object.keys()`, `Object.values()` e `Object.entries()`.
- **Intercâmbio de Dados**: formato JSON com `JSON.stringify()`, formatação com indentação e `JSON.parse()`.
