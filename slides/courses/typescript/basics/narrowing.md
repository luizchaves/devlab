---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Narrowing"
description: "Slides da aula de narrowing: análise de fluxo, typeof, in, instanceof, type predicates, funções de asserção e exaustividade com never."
---

<!-- _class: lead -->

# TypeScript: Narrowing

Análise de fluxo, `typeof`, `in`, `instanceof`, type predicates e exaustividade.

---

## Objetivo

Convencer o compilador de qual variação está em uso:

- Entender a **análise de fluxo de controle**.
- Estreitar com `typeof`, `in`, `instanceof` e igualdade.
- Escrever **type predicates** e funções de **asserção**.
- Garantir **exaustividade** com `never`.
- Tratar `null` e `undefined` sob `strictNullChecks`.

---

## Análise de Fluxo

```ts
function describe(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();   // aqui é string
  }
  return value.toFixed(2);        // aqui só pode ser number
}
```

*O compilador lê o mesmo `if` que você escreveria de qualquer forma.*

---

## `typeof` e a Armadilha do `null`

| `typeof` devolve | Estreita para |
| --- | --- |
| `"string"` / `"number"` / `"boolean"` | o primitivo |
| `"function"` | `Function` |
| `"object"` | objeto **ou `null`** |

```ts
if (typeof value === "object") {
  // value ainda pode ser null!
}

if (value !== null) { … }   // forma correta
```

---

## Veracidade e Igualdade

```ts
if (!name) { … }          // captura "", 0, null, undefined
if (value === undefined) { … }   // explícito

if (value == null) { … }  // null E undefined — único uso legítimo de ==
```

*Cuidado: `if (!quantidade)` troca `0` por padrão sem querer.*

---

## `in` e `instanceof`

```ts
if ("permissions" in user) {
  user.permissions.length;   // é Admin
}

if (value instanceof Date) {
  value.toLocaleDateString("pt-BR");
}
```

- `in`: presença de propriedade — funciona com interfaces.
- `instanceof`: cadeia de protótipos — **só com classes**.

---

## Type Predicates

```ts
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

if (isUser(data)) {
  data.name.toUpperCase();   // data é User aqui
}

const clean: string[] = values.filter(isNotNull);
```

*O compilador **acredita** no predicate: ele merece teste.*

---

## Funções de Asserção

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new TypeError("esperava string");
}

assertIsString(input);
input.trim();   // a partir daqui é string
```

| Recurso | Estreita | Se falhar |
| --- | --- | --- |
| `value is T` | dentro do `if` | segue o `else` |
| `asserts value is T` | do ponto em diante | lança exceção |

---

## Uniões Discriminadas

```ts
type Result =
  | { status: "sucesso"; data: string[] }
  | { status: "erro"; message: string };

switch (result.status) {
  case "sucesso": return `${result.data.length} itens`;
  case "erro":    return `Falhou: ${result.message}`;
}
```

*Acessar `result.data` no ramo do erro é erro de compilação.*

---

## Exaustividade

```ts
default: {
  const exhaustive: never = result;
  throw new Error(`não tratado: ${JSON.stringify(exhaustive)}`);
}
```

- Ao acrescentar uma variação, o compilador aponta **todos** os `switch` incompletos.
- Refatoração deixa de depender de memória.

---

## `null`, `undefined` e Operadores

```ts
const value = profile.address?.city;   // optional chaining
return value ?? "não informado";       // nullish coalescing
```

- `||` substitui qualquer *falsy* — troca `0` e `""` por engano.
- `??` só entra em ação com `null` e `undefined`.

---

## Exercício

Crie `src/form.ts` sem nenhuma asserção `as`:

1. `type Field = { name: string; value: string | number | boolean | null }`;
2. `format(field: Field): string` tratando cada tipo com `typeof`;
3. `isFilled(field)` usando `== null`;
4. Type predicate `isTextField(field): field is Field & { value: string }`;
5. Use o predicate em um `filter`.

---

## Solução do Exercício

```ts
function format(field: Field): string {
  const { value } = field;

  if (value === null) return "(vazio)";
  if (typeof value === "boolean") return value ? "sim" : "não";
  if (typeof value === "number") return value.toFixed(2);
  return value.trim() || "(em branco)";
}

function isTextField(field: Field): field is Field & { value: string } {
  return typeof field.value === "string";
}

const texts = fields.filter(isTextField);
```

---

## Resumo da Aula

- O compilador acompanha o fluxo e sabe, em cada linha, o que a variável pode ser.
- `typeof null === "object"`: combine sempre com `value !== null`.
- `if (!value)` captura `0` e `""` — compare explicitamente quando importarem.
- `in` funciona com interfaces; `instanceof` só com classes.
- `value is T` estreita dentro do `if`; `asserts value is T`, dali em diante.
- União discriminada + `never` no `default` dá refatoração verificada.
