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
- **Existência e Opcionalidade de Chaves**:
  - Natureza dinâmica: chaves não definidas retornam `undefined`.
  - Operador `in`: busca no objeto e na cadeia de protótipos.
  - `Object.hasOwn(obj, prop)`: detecta propriedades próprias mesmo com valor `undefined`.
  - Operador `delete`: remoção efetiva da chave.
- **Optional Chaining (`?.`)**: navegação segura contra `null` e `undefined` (substitui o padrão clássico com `&&`).

## Desestruturação e Imutabilidade

- **Identidade e Referência**:
  - Objetos operam por endereço na *Heap*; `==` e `===` comparam referências (`{} === {}` é `false`).
  - Atribuição simples copia o ponteiro, propagando mutações para a origem.
- **Comparação Profunda (*Deep Equality*)**:
  - Inspeção recursiva de chaves e valores.
  - Limitações de `JSON.stringify` (ordem de chaves, `undefined`, datas).
  - Utilitários: `assert.deepStrictEqual` de `node:assert` e asserções em testes.
- **Desestruturação**: `const { name, age, role = 'user' } = person`.
- **Renomeação**: `const { city: location } = person`.
- **Omissão com Rest**: `const { password: _p, ...publicUser } = user` (remoção imutável).
- **Em Funções**: `function setup({ host, port = 80 } = {})`.
- **Operador Spread (`...`)**:
  - Cópia rasa (*shallow copy*) e sobreposição declarativa.
  - Ordem de precedência: chaves após o spread sobrescrevem chaves anteriores.
- **`structuredClone(obj)`**: clonagem profunda (*deep copy*) isolada para objetos aninhados.

## Recursos Estáticos de Object

- **Inspeção e Iteração**:
  - `Object.hasOwn(obj, prop)`: propriedade própria, sem subir no protótipo.
  - `Object.keys(obj)`: chaves próprias enumeráveis.
  - `Object.values(obj)`: valores das propriedades.
  - `Object.entries(obj)`: pares `[chave, valor]` para `for...of`, `map` e `filter`.
  - `for...in`: chaves enumeráveis do objeto e da cadeia de protótipos.
- **Transformação e Mesclagem**:
  - `Object.fromEntries(pairs)`: reconstrói objeto a partir de pares.
  - `Object.assign(target, ...sources)`: copia propriedades para um alvo mutável.
- **Protótipos e Descritores**:
  - `Object.create(proto)`: cria objeto com protótipo explícito.
  - `Object.getPrototypeOf(obj)`: lê o protótipo efetivo.
  - `Object.defineProperty(obj, prop, descriptor)`: controla escrita, enumeração e configuração.
- **Proteção e Comparação**:
  - `Object.freeze(obj)`: bloqueia alterações, inclusões e exclusões.
  - `Object.seal(obj)`: bloqueia inclusões e exclusões, mas permite alterar valores existentes.
  - `Object.is(a, b)`: compara valores com tratamento específico para `NaN`, `+0` e `-0`.

## Classes ES6+ e Encapsulamento

- **Declaração**: `class User { constructor(name) { this.name = name; } }`.
- **Cadeia de Protótipos**:
  - Métodos de classe residem em `User.prototype`.
  - Raiz em `Object.prototype` (`toString()`, `valueOf()`, `hasOwnProperty()`, `isPrototypeOf()`).
- **Extensão de Protótipos**: requer `function` tradicional para binding dinâmico de `this`.
- **Campos Privados (`#`)**: atributos verdadeiramente encapsulados (ES2022+).
- **Getters e Setters**: interfaces de leitura e validação controlada (`get prop()`, `set prop()`).
- **Herança**: `class Admin extends User` com chamada obrigatória de `super()`.
- **Sobrescrita (*Overriding*)**: redefinição de métodos herdados com `super.metodo()`.
- **Ausência de Sobrecarga (*Overloading*)**:
  - JavaScript não suporta sobrecarga nativa por assinatura (última substitui anterior).
  - Simulação via parâmetros padrão, checagem de tipos ou objetos de opções.
- **Membros Estáticos (`static`)**: métodos utilitários atrelados à função construtora.

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
- **Prefira `Object.hasOwn`** sobre o método legado `hasOwnProperty`.
- **Agrupe recursos de Object por intenção**: inspeção, transformação, protótipos e proteção.
- **Gerenciamento de Imutabilidade**: spread para cópia rasa, `structuredClone` para aninhamentos e `Object.freeze` para dados estáticos.
- **POO Moderna**: campos privados `#` para encapsulamento e `extends`/`super()` para polimorfismo.
- **Intercâmbio Seguro**: utilize `JSON.stringify` e `JSON.parse` para serialização de payloads.
