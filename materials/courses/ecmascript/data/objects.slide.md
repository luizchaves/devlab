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
description: 'Criação, notação literal, encadear opcional, desestruturação, operador spread, recursos estáticos do Object, classes ES6+ (construtor, herança, campos privados) e JSON em JavaScript.'
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
- Aplicar recursos estáticos de **`Object`** para inspeção, transformação e proteção.
- Declarar e instanciar **classes ES6+** com construtores, herança (`extends`, `super()`), métodos estáticos e **campos privados (`#`)**.
- Manipular dados com **`JSON.stringify()`** e **`JSON.parse()`**.

---

## Mapa do Tópico

- Notação Literal e Property Shorthand
- Acesso a Propriedades (Ponto vs Colchetes)
- Verificação de Existência (`in` vs `Object.hasOwn`)
- Optional Chaining (`?.`) e Coalescência Nula (`??`)
- Desestruturação e Parâmetros de Funções
- Operador Spread (`...`) e `structuredClone()`
- Recursos Estáticos de `Object`
- Classes ES6+: Construtores, Métodos e Protótipos
- Campos Privados (`#`) e Herança (`extends` / `super`)
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
- A palavra-chave **`this`** dentro do método referencia o próprio objeto (`student`).

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

Notação de ponto para chaves diretas; colchetes para dinâmicas ou caracteres especiais:

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

*Nota: `const` impede a reassociação da variável, mas não a mutação de propriedades internas.*

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

## Opcionalidade de Chaves: `undefined` vs Ausência

Propriedades são dinâmicas: ler chave inexistente devolve `undefined`:

```js
const account = { id: 101, nickname: undefined };

// 1. Ambas as leituras retornam undefined:
console.log(account.nickname); // undefined (chave existe)
console.log(account.avatar);   // undefined (chave inexistente)

// 2. Object.hasOwn revela a existência da chave:
console.log(Object.hasOwn(account, "nickname")); // true
console.log(Object.hasOwn(account, "avatar"));   // false

// 3. delete expurga a chave do objeto:
delete account.nickname;
console.log(Object.hasOwn(account, "nickname")); // false
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

## Padrão Clássico (`&&`) vs Optional Chaining (`?.`)

Antes do ES2020, usava-se o operador `&&` como guarda defensiva:

```js
// 1. Padrão clássico pré-ES2020 com operador lógico && (verboso):
const cityOld =
  user && user.profile && user.profile.address && user.profile.address.city;

// 2. Padrão moderno com Optional Chaining (?.):
const cityModern = user?.profile?.address?.city;

console.log(cityOld === cityModern); // true
```

- `&&` interrompe no primeiro valor *falsy*, mas pode falhar com `0`, `""` ou `false`.
- `?.` avalia estritamente contra `null` e `undefined` (*short-circuiting* seguro).

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

## Omissão Imutável com Rest (`...rest`)

Expurga propriedades sensíveis criando um novo objeto sem usar `delete`:

```js
const user = {
  id: 101,
  name: "Carlos",
  email: "carlos@devlab.org",
  passwordHash: "secret123",
};

// Isola o passwordHash e guarda o restante em publicUser
const { passwordHash: _password, ...publicUser } = user;
console.log(publicUser); // { id: 101, name: 'Carlos', email: 'carlos@devlab.org' }
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

*Dica: use spread `{ ...obj }` ou `structuredClone()` para evitar mutações acidentais.*

---

## Comparação de Objetos: Referência (`==` e `===`)

Tanto `==` quanto `===` comparam o **endereço de memória**, e não o conteúdo:

```js
const userA = { name: "Carlos", age: 28 };
const userB = { name: "Carlos", age: 28 };

// Mesmo conteúdo, mas endereços de memória distintos:
console.log(userA === userB); // false
console.log(userA == userB);  // false
console.log({} === {});       // false (cada {} aloca nova referência)
```

---

## Comparação Profunda de Objetos (Deep Equality)

Para comparar conteúdo estrutural recursivamente:

```js
function isDeepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || !a || typeof b !== "object" || !b) return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => Object.hasOwn(b, k) && isDeepEqual(a[k], b[k]));
}

const obj1 = { id: 1, info: { role: "admin" } };
const obj2 = { id: 1, info: { role: "admin" } };

console.log(obj1 === obj2);           // false (referências distintas)
console.log(isDeepEqual(obj1, obj2)); // true (conteúdo idêntico)
```

*Nota: `JSON.stringify(a) === JSON.stringify(b)` falha com ordem de chaves, `undefined` e `Date`.*

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

## Ordem de Precedência no Spread

A última propriedade declarada sempre tem a precedência:

```js
const base = { name: "Tesouro Selic", value: 17476 };

// 1. Sobrescrita: chave após o spread sobrescreve o base
console.log({ ...base, name: "CDB XYZ" });
// { name: 'CDB XYZ', value: 17476 }

// 2. Precedência do spread: base sobrescreve a chave anterior
console.log({ name: "CDB XYZ", ...base });
// { name: 'Tesouro Selic', value: 17476 }
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

## Recursos Estáticos de `Object`

A API estática de `Object` complementa literal, spread e desestruturação:

| Papel | Métodos | Uso |
| :--- | :--- | :--- |
| **Inspeção** | `hasOwn`, `keys`, `values`, `entries` | Descobrir chaves, valores e pares. |
| **Transformação** | `fromEntries`, `assign` | Reconstruir ou mesclar objetos. |
| **Protótipos** | `create`, `getPrototypeOf`, `defineProperty` | Controlar herança e descritores. |
| **Proteção** | `freeze`, `seal`, `is` | Controlar mutabilidade e comparar casos especiais. |

---

## Inspeção e Iteração com `Object`

Objetos comuns não rodam em `for...of`; converta para chaves, valores ou pares:

```js
const scores = { Alice: 95, Bruno: 80, Carla: 90 };

console.log(Object.hasOwn(scores, "Bruno")); // true
console.log(Object.keys(scores));            // ['Alice', 'Bruno', 'Carla']
console.log(Object.values(scores));          // [95, 80, 90]
console.log(Object.entries(scores));
// [['Alice', 95], ['Bruno', 80], ['Carla', 90]]

for (const [student, score] of Object.entries(scores)) {
  console.log(`${student}: ${score}`);
}
```

---

## Transformação com `fromEntries` e `assign`

Use pares `[chave, valor]` para filtrar ou reconstruir objetos:

```js
const flags = { dashboard: true, legacyReport: false, notifications: true };

const enabledFlags = Object.fromEntries(
  Object.entries(flags).filter(([, enabled]) => enabled)
);

console.log(enabledFlags);
// { dashboard: true, notifications: true }

const defaults = { retries: 3, timeout: 1000 };
const options = Object.assign(defaults, { timeout: 5000 });
console.log(options); // { retries: 3, timeout: 5000 }
console.log(defaults === options); // true (mesmo alvo)
```

---

## Proteção com `Object.freeze()`

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

*Notas: `Object.freeze()` é raso. `Object.seal()` fixa a forma do objeto, mas ainda permite alterar valores existentes.*

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

## Métodos de `Object.prototype` e Coerção

Métodos herdados automaticamente por todas as instâncias e objetos:

| Método | Retorno | Descrição / Uso |
| :--- | :--- | :--- |
| **`toString()`** | `string` | Representação textual (`${obj}`, `String(obj)`). |
| **`valueOf()`** | `any` | Valor primitivo em operações matemáticas (`+`, `*`). |
| **`hasOwnProperty()`** | `boolean` | Checagem de propriedade direta (legado; use `Object.hasOwn`). |
| **`isPrototypeOf()`** | `boolean` | Testa se o objeto está na cadeia de protótipos de outro. |

```js
const item = { name: "Livro", price: 50, valueOf() { return this.price; } };
console.log(item + 10); // 60 (valueOf() invocado na coerção)
```

---

## Extensão de Protótipos e o `this`

Métodos de protótipo exigem `function` tradicional para vincular o `this`:

```js
// Correto: função tradicional, 'this' aponta para o array chamador
Array.prototype.last = function () {
  return this[this.length - 1];
};

console.log([10, 20, 30].last()); // 30

// Errado: arrow function não tem 'this' dinâmico, captura o léxico externo
// Array.prototype.lastArrow = () => this[this.length - 1]; // undefined
```

---

## Campos Privados (`#`) e Encapsulamento

Campos iniciados com `#` (ES2022+) são estritamente privados em tempo de execução:

```js
class BankAccount {
  #balance = 0; // Privado

  constructor(initial) { this.#balance = initial; }

  get balance() { return this.#balance; }

  deposit(amount) { this.#balance += amount; }
}

const account = new BankAccount(500);
account.deposit(200);
console.log(account.balance); // 700
// console.log(account.#balance); // SyntaxError (campo privado)
```

---

## Pilar da POO: Encapsulamento

- Proteger o estado interno e as regras de negócio contra mutações diretas.
- Expõe apenas interfaces públicas controladas e métodos de validação.
- No JS moderno (ES2022+): **campos privados com prefixo `#`** e métodos *get/set*.

---

## Herança com `extends` e `super()`

Uma subclasse herda métodos e construtor da classe base:

```js
class User {
  constructor(name, email) { this.name = name; this.email = email; }
  getProfile() { return `${this.name} (${this.email})`; }
}

class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email); // Invocação obrigatória do construtor pai
    this.permissions = permissions;
  }
  // Sobrescrita de método (Method Overriding)
  getProfile() {
    return `[ADMIN] ${super.getProfile()} (${this.permissions.join(", ")})`;
  }
}

const admin = new Admin("Beatriz", "beatriz@devlab.org", ["READ", "WRITE"]);
console.log(admin.getProfile());
// "[ADMIN] Beatriz (beatriz@devlab.org) (READ, WRITE)"
```

---

## Pilar da POO: Polimorfismo

- Múltiplas subclasses respondem à mesma interface de métodos com comportamentos especializados.
- Permite que o chamador invoque o mesmo método (`greet()`, `getProfile()`) sem precisar saber detalhes específicos da subclasse.
- No JS moderno: herança com `extends`, `super()` e sobrescrita de métodos.

---

## Sobrescrita (*Overriding*) vs Sobrecarga (*Overloading*)

- **Sobrescrita (*Overriding*)**: Subclasse redefine método do pai (`super.metodo()`).
- **Sobrecarga (*Overloading*)**: Múltiplos métodos de mesmo nome. **Não existe em JS** (o último substitui os anteriores).

```js
class Calculator {
  // Errado: o segundo add substitui o primeiro
  add(a) { return a + 10; }
  add(a, b) { return a + b; }

  // Correto: simulação idiomática com valor padrão
  sum(a, b = 10) { return a + b; }
}

const calc = new Calculator();
console.log(calc.add(5));     // NaN (5 + undefined)
console.log(calc.sum(5));     // 15 (usa b = 10)
console.log(calc.sum(5, 20)); // 25
```

---

## POO no TypeScript: O que a linguagem adiciona?

- **Interfaces e `implements`**: contratos estritos de tipos para polimorfismo robusto.
- **Classes Abstratas (`abstract class`)**: modelos base que não podem ser instanciados.
- **Modificadores de Acesso**: `public`, `private`, `protected` e `readonly`.
- **Parameter Properties**: declaração e atribuição simplificada no construtor.
- **Assinaturas de Sobrecarga**: múltiplas assinaturas checadas em tempo de compilação.

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

Conversão bidirecional entre objetos em memória e strings textuais JSON:

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
const user = { id: 1, name: "Carlos" };

// Saída compacta (padrão para tráfego na rede):
console.log(JSON.stringify(user));
// '{"id":1,"name":"Carlos"}'

// Saída formatada com 2 espaços (depuração):
console.log(JSON.stringify(user, null, 2));
// {
//   "id": 1,
//   "name": "Carlos"
// }
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

1. Crie o objeto `networkHost` com as propriedades:
   - `name`: `"Router-01"`, `ip`: `"192.168.1.1"`
   - `mask`: `"255.255.255.0"`, `active`: `true`
2. Adicione a propriedade `gateway = "192.168.1.254"`.
3. Remova a propriedade `active` com o operador `delete`.
4. Extraia `name`, `ip` e `gateway` usando desestruturação.
5. Imprima: `"Dispositivo: [NAME] | IP: [IP] | Gateway: [GATEWAY]"`.

---

## Solução do Exercício: Dispositivo de Rede

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

1. Crie uma string `jsonInput` com array de servidores (`id`, `hostname`, `ip`, `cpuUsage`, `online`).
2. Converta a string para array de objetos JS com `JSON.parse()`.
3. Filtre apenas os servidores `online === true`.
4. Mapeie para um relatório simplificado com `host` e `load` (`${cpuUsage}%`).
5. Imprima o resultado e converta para JSON formatado (`JSON.stringify(..., null, 2)`).

---

## Solução do Desafio: Relatório de Servidores em JSON

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
- Quando usar `Object.entries()` com `Object.fromEntries()`?
- Qual a diferença prática entre spread e `Object.assign()`?
- Para que serve o operador de *Optional Chaining* (`?.`)?
- O que é *shallow copy* e como realizá-la com o operador spread (`...`)?
- Como funcionam os campos privados (`#`) em classes ES6+?
- Quais são as principais diferenças e restrições de tipos entre um objeto JS e o padrão JSON?

---

## Resumo do Tópico

- **Objetos Literais**: pares chave-valor na Heap com sintaxe concisa (`{ prop }`).
- **Acesso Seguro**: notação de colchetes dinâmicos e *Optional Chaining* (`?.`).
- **Imutabilidade e Clonagem**: referências na Heap, `...spread` para cópias rasas e `structuredClone()` para cópias profundas.
- **Recursos de `Object`**: inspeção, transformação, protótipos e proteção.
- **Classes Modernas**: `class`, `constructor`, herança com `extends`/`super()` e campos `#`.
- **Intercâmbio de Dados**: formato JSON com `JSON.stringify()`, formatação com indentação e `JSON.parse()`.
