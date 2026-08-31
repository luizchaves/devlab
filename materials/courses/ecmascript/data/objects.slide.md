---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Objetos, Classes e Protótipos"
description: "Slides completos da aula JavaScript: Objetos, Classes e Protótipos."
---

<!-- _class: lead -->

# JavaScript: Objetos, Classes e Protótipos

Criação, notação literal, encadear opcional, desestruturação, operador spread, classes ES6+ (construtor, herança, campos privados), métodos estáticos do Object e JSON em JavaScript.

---

## Objetivo

- Compreender a estrutura de dados de Objeto em JavaScript, dominar a criação por notação literal, diferenciar acesso por...

---

## Mapa da Aula

- Criação de Objetos e Notação Literal
- Property Shorthand (Sintaxe Abreviada de Propriedades)
- Acesso, Modificação e Remoção de Propriedades
- Desestruturação de Objetos (Destructuring)
- Desestruturação em Parâmetros de Funções
- Operador Spread e Imutabilidade em Objetos
- Congelando Objetos com Object.freeze()
- Classes em JavaScript (ES6+ e POO)

---

## Introdução

- Esta aula apresenta os Objetos e Classes em JavaScript
- como estruturar dados em pares chave-valor, utilizar notação literal e desestruturação, mesclar objetos com o operador...

---

## Criação de Objetos e Notação Literal

- Em JavaScript, um Objeto é uma coleção dinâmica de propriedades, onde cada propriedade é uma associação entre uma chave...
- O valor de uma propriedade pode ser de qualquer tipo
- primitivos, arrays, outros objetos ou funções (que recebem o nome de métodos)
- O diagrama a seguir ilustra a representação de um objeto literal na memória Heap e sua ligação com a cadeia de protótipos...
- Diagrama da página

---

## Criação de Objetos e Notação Literal: Comparação

| Elemento | Descrição | Exemplo |
| -------- | --------- | ------- |
| **Notação Literal** | Forma mais comum e legível de criar objetos com `{}` | `const user = { name: "Ana" };` |
| **Chave (Key)** | Identificador da propriedade (string ou Symbol) | `name`, `age`, `"end-point"` |
| **Valor (Value)** | Qualquer dado associado à chave | `"Ana"`, `28`, `true`, `[1, 2]` |
| **Método** | Uma função armazenada como valor de uma propriedade | `sayHello() { return "Olá!"; }` |
| **Tipo de Dado** | Tipo de dado não primitivo em JavaScript | `typeof {}` // `"object"` |

---

## Formas de criação de objetos

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
server.port = 8080;

console.log(student.name);        // "Fulano de Tal"
console.log(student.getSummary());// "Fulano de Tal (fulano@ifpb.edu.br)"
console.log(server.ip);           // "192.168.0.1"
```

---

## Property Shorthand (Sintaxe Abreviada de Propriedades)

- Quando o nome da variável local é idêntico ao nome da chave do objeto que se deseja criar, o JavaScript permite omitir a...
- A sintaxe abreviada ` ` é amplamente utilizada em código moderno para construir objetos de forma limpa a partir de...
- Working with objects | MDN

---

## Uso de Property Shorthand

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

- O acesso às propriedades de um objeto pode ser feito por Notação de Ponto (`obj.prop`) ou por Notação de Colchetes...

---

## Notação de Ponto vs Notação de Colchetes

- As duas notações acessam a mesma propriedade, mas só uma delas aceita nomes calculados em tempo de execução:

---

## Acessando e alterando propriedades

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
console.log(host["content-type"]); // "application/json"
console.log(host[200]);            // "OK"

// 3. Notação de Colchetes com Chaves Dinâmicas (variáveis)
const targetKey = "ip";
console.log(host[targetKey]); // "192.168.1.10" (equivale a host.ip)
```

---

## Adição, Alteração e Remoção

- Objetos em JavaScript são mutáveis por padrão
- Propriedades podem ser atribuídas ou removidas a qualquer momento

---

## Alterando a estrutura de um objeto

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

// Removendo propriedade com o operador delete
delete config.retries;
console.log(config); // { theme: 'dark', timeout: 10000 }
console.log(config.retries); // undefined
```

---

## Verificação de Existência de Propriedades (Operador `in` e `Object.hasOwn`)

- Operador `in`: Retorna `true` se a propriedade existir no objeto ou em qualquer nível da sua cadeia de protótipos...
- `Object.hasOwn(obj, prop)`: Retorna `true` apenas se a propriedade for direta/própria do objeto (*own property*),...

---

## Diferença entre o operador in e Object.hasOwn()

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

- Ao acessar propriedades encadeadas em objetos aninhados, tentar ler um atributo de um valor `null` ou `undefined` causa...
- O operador de Encadear Opcional (`?.`) permite acessar propriedades com segurança
- caso o alvo seja `null` ou `undefined`, a expressão interrompe a avaliação (*short-circuiting*) e retorna `undefined` sem...
- Declarar um objeto com `const` impede que a variável seja reassociada a um novo objeto na memória
- No entanto, as propriedades internas do objeto continuam mutáveis — elas podem ser alteradas, adicionadas ou deletadas...

---

## Acesso seguro com Optional Chaining

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
const theme = user?.settings?.theme;          // undefined (objeto 'settings' não existe)

// 💡 Combinando com Coalescência Nula (??) para definir valor padrão
const userCity = user?.profile?.address?.city ?? "Cidade não cadastrada";
const userTheme = user?.settings?.theme ?? "light";
```

---

## Encadear Opcional (Optional Chaining: `?.`)

```js
const server = { port: 8080 };
server.port = 9090; // PERMITIDO (altera propriedade interna)

// server = { port: 3000 }; // ERRO: TypeError (Assignment to constant variable)
```

---

## Desestruturação de Objetos (Destructuring)

- A desestruturação de objetos permite extrair propriedades de um objeto e atribuí-las diretamente a variáveis locais com...

---

## Desestruturação básica de Objetos

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
console.log(location); // "João Pessoa"

// Extraindo com valor padrão caso a propriedade não exista
const { role = "visitante" } = person;
console.log(role); // "visitante"
```

---

## Desestruturação em Parâmetros de Funções

- A desestruturação é extremamente útil em parâmetros de funções, permitindo receber objetos de opção com clareza
- Destructuring assignment | MDN

---

## Desestruturação no parâmetro da função

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

- O operador de espalhamento (`...`) permite copiar e mesclar propriedades de objetos de forma rasa (*shallow copy*)
- O diagrama a seguir ilustra o processo de cópia das propriedades do objeto base e a sobreposição de chaves especificadas
- Diagrama da página
- Cópia Rasa e Mesclagem de Propriedades com Operador Spread

---

## Operador Spread em Objetos

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

console.log(baseConfig); // { env: 'development', debug: true, port: 3000 }
console.log(prodConfig); // { env: 'production', debug: true, port: 8080 }
```

---

## Congelando Objetos com Object.freeze()

- Se você precisa impedir que um objeto tenha suas propriedades alteradas, adicionadas ou deletadas, pode utilizar...

---

## Imutabilidade com Object.freeze()

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

## Classes em JavaScript (ES6+ e POO)

- Introduzidas no ES2015 (ES6), as Classes oferecem uma sintaxe moderna baseada em protótipos (*prototype-based...

---

## Declaração de Classes e o Construtor

- Uma classe é declarada com a palavra-chave `class`
- O método especial `constructor()` é executado automaticamente quando um novo objeto é instanciado com o operador `new`

---

## Declaração básica de uma Classe

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

- No JavaScript, a instrução `class` é apenas um açúcar sintático (*syntactic sugar*) construído sobre a cadeia de...
- O diagrama a seguir ilustra a estrutura de memória de uma instância criada via `class` e sua vinculação com...
- Diagrama da página
- Instanciação de Classe e Mapeamento com a Cadeia de Protótipos

---

## Encapsulamento com Atributos Privados (`#`) e Getters/Setters

- No ES2022, o JavaScript introduziu os campos privados prefixados com `#`
- Atributos e métodos privados não podem ser acessados diretamente de fora da classe, garantindo encapsulamento no tempo de...

---

## Atributos privados e métodos de acesso get/set

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
account.deposit(200);
console.log(account.balance); // 700

// ❌ Tentativa de acesso direto gera erro de sintaxe:
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

---

## Herança de Classes com `extends` e `super`

- Uma classe pode herdar propriedades e métodos de outra classe utilizando a palavra-chave `extends`
- No construtor da subclasse, a função `super()` deve ser obrigatoriamente chamada antes de utilizar a referência `this`
- O diagrama a seguir ilustra a relação de herança entre a classe base `User` e a subclasse `Admin`
- Diagrama da página
- Diagrama de Classes (UML / POO)

---

## Herança com extends e invocação de super()

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

const admin = new Admin("Beatriz", "beatriz@devlab.org", ["CREATE", "DELETE"]);
console.log(admin.getProfile());
// "[ADMIN] Beatriz (beatriz@devlab.org) - Permissões: CREATE, DELETE"
```

---

## Métodos e Campos Estáticos (`static`)

- Métodos e propriedades marcados com a palavra-chave `static` pertencem à própria classe, e não às instâncias criadas a...

---

## Uso de métodos e atributos estáticos

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

- Diferente de arrays, objetos comuns não são diretamente iteráveis com `for...of`
- JavaScript oferece o laço `for...in` e métodos estáticos auxiliares no objeto `Object` para inspecionar chaves e valores
- Object.entries() | MDN

---

## Iteração sobre Objetos: Comparação

| Método / Estrutura | Retorno | Descrição |
| ------------------ | ------- | --------- |
| `for...in` | Chaves (`string`) | Laço que percorre as chaves enumeráveis do objeto |
| `Object.keys(obj)` | `Array<string>` | Retorna um array com os nomes das chaves do objeto |
| `Object.values(obj)` | `Array<any>` | Retorna um array com os valores de todas as propriedades |
| `Object.entries(obj)` | `Array<[string, any]>` | Retorna um array de pares `[chave, valor]` |

---

## Iterando sobre objetos com Object.keys, values e entries

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

// Iterando com for...of sobre Object.entries() usando desestruturação
for (const [student, score] of Object.entries(scores)) {
console.log(`Estudante: ${student} | Nota: ${score}`);
}
```

---

## O Formato e Objeto JSON

- JSON (*JavaScript Object Notation*) é um formato leve e estritamente textual para troca de dados entre sistemas (por...
- Apesar de derivar da sintaxe de objetos do JavaScript, o formato JSON possui regras estritas:

---

## O Formato e Objeto JSON: Comparação

| Característica | Objeto JavaScript | Formato JSON |
| -------------- | ----------------- | ------------ |
| **Nomes de Chaves** | Podem ser sem aspas (`name: "Ana"`) | **Devem** estar entre aspas duplas (`"name": "Ana"`) |
| **Strings** | Aspas simples, duplas ou crases | **Devem** usar apenas aspas duplas (`"..."`) |
| **Tipos de Dados Aceitos** | Primitivos, arrays, objetos e **funções** | Apenas primitivos (número, string, boolean, null), arrays e objetos |
| **Vírgula Final (Trailing Comma)** | Permitida (`{ a: 1, }`) | **Proibida** (`{ "a": 1 }`) |

---

## Exemplo de arquivo ou payload JSON válido

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

---

## Uso de JSON.stringify() e JSON.parse()

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
const parsedObject = JSON.parse(jsonString);
console.log(typeof parsedObject); // "object"
console.log(parsedObject.name);   // "Carlos"
```

---

## Resumo e Boas Práticas

- Use notação literal ` ` para declarar objetos.
- Utilize Property Shorthand (` `) para simplificar a criação a partir de variáveis.
- Prefira desestruturação para extrair propriedades de objetos.
- Utilize `Object.keys()`, `Object.values()` e `Object.entries()` para iterar sobre objetos de forma funcional.
- Lembre-se de que JSON requer chaves com aspas duplas e não aceita funções nem `undefined`.

---

## Executando

- Crie um arquivo chamado `object-demo.js`:
- Execute o arquivo com Node.js no terminal:
- Modifique as propriedades do objeto e teste a desserialização com `JSON.parse()`.

---

## object-demo.js

```js
const serverConfig = {
  hostname: "api.devlab.org",
  port: 8080,
  ssl: true,
  endpoints: ["/users", "/products"],
};

// Desestruturação e operador Spread
const { hostname, port } = serverConfig;
const updatedConfig = { ...serverConfig, port: 443, env: "production" };

// Conversão para JSON
const jsonPayload = JSON.stringify(updatedConfig, null, 2);

console.log("Host original:", `${hostname}:${port}`);
console.log("Configuração atualizada:", updatedConfig);
console.log("Payload JSON formatado:\n", jsonPayload);
```

---

## Terminal

```bash
node object-demo.js
```

---

## Output

```txt
Host original: api.devlab.org:8080
Configuração atualizada: {
  hostname: 'api.devlab.org',
  port: 443,
  ssl: true,
  endpoints: [ '/users', '/products' ],
  env: 'production'
}
Payload JSON formatado:
 {
  // ...
  ],
  "env": "production"
}
```

---

## Exercício

- Crie um objeto `networkHost` com as propriedades `name` (`"Router-01"`), `ip` (`"192.168.1.1"`), `mask`...
- Adicione uma nova propriedade `gateway` com o valor `"192.168.1.254"`;
- Remova a propriedade `active` usando o operador `delete`;
- Utilize a desestruturação para extrair `name`, `ip` e `gateway` em variáveis locais;
- Imprima no console uma string formatada no padrão: `"Dispositivo: [NAME] | IP: [IP] | Gateway: [GATEWAY]"`.

---

## Desafio

- Crie uma string JSON chamada `jsonInput` contendo um array de objetos de servidores com as chaves `"id"`, `"hostname"`,...
- Converta a string JSON para um array de objetos JavaScript usando `JSON.parse()`;
- Utilize `filter` para selecionar apenas os servidores que estão `"online"`;
- Utilize `Object.entries()` ou `map` para extrair um relatório contendo apenas o `hostname` e o status da CPU em formato...
- Imprima o resultado final no console e converta o relatório de servidores online de volta para uma string JSON com...

---

## Criação e Acesso

- Qual é a diferença entre Notação de Ponto (`obj.prop`) e Notação de Colchetes (`obj["prop"]`)
- O que acontece ao tentar acessar uma propriedade que não existe em um objeto
- O que é Property Shorthand e quando podemos utilizá-lo

---

## Desestruturação e Imutabilidade

- Como funciona a atribuição por desestruturação em objetos e como renomear uma variável durante a extração
- Declarar um objeto com `const` impede a alteração de suas propriedades internas
- Como o operador Spread (`...`) auxilia na atualização imutável de um objeto

---

## Métodos do Object e JSON

- Quais são as diferenças entre os métodos `Object.keys()`, `Object.values()` e `Object.entries()`
- Quais são as principais diferenças entre um Objeto JavaScript e uma string no formato JSON
- Para que servem os métodos `JSON.stringify()` e `JSON.parse()`
- O que acontece com propriedades de valor `undefined` ou funções ao executar `JSON.stringify()`

---

## Classes e Orientação a Objetos

- Qual é a relação entre a sintaxe de `class` no ES6+ e a cadeia de protótipos em JavaScript
- Como funcionam os campos privados (`#`) e qual a diferença em relação a atributos convenções comuns
- Para que servem a palavra-chave `extends` e a função `super()` em subclasses

---

## Próxima aula

- Map, Set e Coleções
- Coleções chave-valor com Map, conjuntos de valores únicos com Set e versões de referência fraca com WeakMap e WeakSet

---

## Resumo da Aula

- Revise criação de Objetos e Notação Literal
- Revise property Shorthand (Sintaxe Abreviada de Propriedades)
- Revise acesso, Modificação e Remoção de Propriedades
- Revise desestruturação de Objetos (Destructuring)
- Revise desestruturação em Parâmetros de Funções
- Revise operador Spread e Imutabilidade em Objetos
- Revise congelando Objetos com Object.freeze()
