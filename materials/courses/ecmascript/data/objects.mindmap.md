---
title: 'JavaScript: Objetos, Classes e Protótipos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Objetos, Classes e Protótipos

## Ideia Central

- **Coleção Chave-Valor**: dados heterogêneos estruturados na memória Heap.
- **POO no JavaScript**: fundamentada na cadeia de protótipos (*prototype chain*).

## Criação e Acesso

- **Notação Literal**: `{ key: value, method() {} }` (padrão recomendado).
- **Property Shorthand**: `{ name, age }` ao criar objetos a partir de variáveis locais.
- **Ponto vs Colchetes**:
  - `obj.prop`: simples e direto.
  - `obj["prop"]` e `obj[var]`: para chaves dinâmicas, numéricas ou com caracteres especiais.
- **Existência de Propriedades**:
  - Operador `in`: busca no objeto e na cadeia de protótipos.
  - `Object.hasOwn(obj, prop)`: restringe a busca a propriedades próprias diretas.
- **Optional Chaining (`?.`)**: navegação segura contra `null` e `undefined`.

## Desestruturação e Imutabilidade

- **Identidade e Referência**:
  - Objetos operam por endereço na *Heap*; `===` compara referências (`{} === {}` é `false`).
  - Atribuição simples copia o ponteiro, propagando mutações para a origem.
- **Desestruturação**: `const { name, age, role = 'user' } = person`.
- **Renomeação**: `const { city: location } = person`.
- **Omissão com Rest**: `const { password: _p, ...publicUser } = user` (remoção imutável).
- **Em Funções**: `function setup({ host, port = 80 } = {})`.
- **Operador Spread (`...`)**:
  - Cópia rasa (*shallow copy*) e sobreposição declarativa.
  - Ordem de precedência: chaves após o spread sobrescrevem chaves anteriores.
- **`structuredClone(obj)`**: clonagem profunda (*deep copy*) isolada para objetos aninhados.
- **`Object.freeze()`**: congelamento raso para impedir adições, exclusões e alterações.

## Classes ES6+ e Encapsulamento

- **Declaração**: `class User { constructor(name) { this.name = name; } }`.
- **Protótipos**: métodos de classe residem em `User.prototype`.
- **Extensão de Protótipos**: requer `function` tradicional para binding dinâmico de `this`.
- **Campos Privados (`#`)**: atributos verdadeiramente encapsulados (ES2022+).
- **Getters e Setters**: interfaces de leitura e validação controlada (`get prop()`, `set prop()`).
- **Herança**: `class Admin extends User` com chamada obrigatória de `super()`.
- **Membros Estáticos (`static`)**: métodos utilitários atrelados à função construtora.

## Iteração sobre Objetos

- **`Object.keys(obj)`**: lista com todas as chaves próprias enumeráveis.
- **`Object.values(obj)`**: lista com os valores das propriedades.
- **`Object.entries(obj)`**: pares `[chave, valor]` ideais para desestruturação em `for...of`.
- **Laço `for...in`**: itera sobre chaves enumeráveis do objeto e protótipo.

## Formato e Manipulação de JSON

- **Regras Estritas do Formato**:
  - Chaves e strings obrigatoriamente com aspas duplas (`"chave": "valor"`).
  - Sem vírgula final (*trailing comma*).
  - Não aceita funções, `undefined` ou `Symbol`.
- **Restrições de Tipos**:
  - `Date` vira string ISO 8601; `undefined` e funções são omitidos; `NaN`/`Infinity` viram `null`.
- **Serialização e Depuração**:
  - `JSON.stringify(obj)`: converte objetos em strings JSON compactas.
  - `JSON.stringify(obj, null, 2)`: saída formatada com indentação (*pretty-print*).
- **Desserialização**: `JSON.parse(string)` converte strings JSON em objetos JS.

## Boas Práticas

- **Use Property Shorthand e Desestruturação** para código limpo e idiomático.
- **Combine `?.` com `??`** para evitar erros de leitura em dados aninhados de APIs.
- **Lembre-se da referência de `const`**: use `Object.freeze()` quando a imutabilidade for estrita.
- **Prefira `Object.hasOwn`** sobre o método legado `hasOwnProperty`.
