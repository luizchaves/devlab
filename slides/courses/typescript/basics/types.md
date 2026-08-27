---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Tipos Básicos"
description: "Slides da aula de tipos básicos em TypeScript: primitivos, inferência, arrays, tuplas, any, unknown, never, literais e asserções."
---

<!-- _class: lead -->

# TypeScript: Tipos Básicos

Primitivos, inferência, arrays e tuplas, `any` versus `unknown`, tipos literais e asserções.

---

## Objetivo

Descrever valores com precisão, sem ruído:

- Anotar com os **tipos primitivos** corretos.
- Entender a **inferência** e quando a anotação é necessária.
- Usar **arrays** e **tuplas**.
- Diferenciar `any`, `unknown` e `never`.
- Aplicar **tipos literais** e asserções com consciência do risco.

---

## Primitivos

| Tipo | Exemplo |
| --- | --- |
| `string` | `"DevLab"` |
| `number` | `42`, `3.14`, `NaN` |
| `boolean` | `true` |
| `bigint` | `9007199254740993n` |
| `symbol` | `Symbol("id")` |
| `null` / `undefined` | ausência de valor |

*Sempre minúsculo: `String` e `Number` são os objetos empacotadores, não os tipos.*

---

## Inferência

```ts
let name = "DevLab";      // string
const rate = 0.15;        // 0.15 — tipo literal!
let mutable = 0.15;       // number

const user = { name: "Ana", age: 32 };   // { name: string; age: number }
const values = [1, 2, 3];                // number[]
```

- `const` guarda o **literal**; `let` alarga para o tipo base.
- Anotar o que já é inferido só acrescenta ruído.

---

## Quando Anotar

| Situação | Anotar? |
| --- | --- |
| Variável inicializada | Não |
| Parâmetro de função | **Sim** |
| Retorno de função exportada | Sim |
| Variável sem valor inicial | Sim |
| Dado do domínio | Sim (`interface`/`type`) |

*Regra: anote nas fronteiras, deixe inferir no meio.*

---

## Arrays e Tuplas

```ts
const languages: string[] = ["TypeScript", "Go"];
const matrix: number[][] = [[1, 2], [3, 4]];
const readonlyList: readonly string[] = ["a", "b"];

let pair: [string, number] = ["Ana", 32];
type HttpResult = [status: number, body: string];
type Command = [name: string, ...args: string[]];
```

*A tupla fixa quantidade e tipo por posição — é o que faz `useState` funcionar.*

---

## `any` Desliga o Compilador

```ts
let value: any = "texto";

value.toFixed(2);        // compila; explode em runtime
value.qualquerCoisa();   // compila; explode em runtime
```

- Diz "confie em mim, não verifique".
- **Propaga**: tudo que deriva de `any` também vira `any`.

---

## `unknown` Exige Verificação

```ts
let value: unknown = JSON.parse('{"name":"Ana"}');

// value.name;   // erro: 'value' is of type 'unknown'

if (typeof value === "object" && value !== null && "name" in value) {
  console.log(value.name);   // agora é seguro
}
```

| | `any` | `unknown` |
| --- | --- | --- |
| Qualquer operação | Sim | **Não** |
| Exige estreitar | Não | **Sim** |
| Propaga | Sim | Não |

---

## `never` É o Impossível

```ts
function fail(message: string): never {
  throw new Error(message);
}

// Uso mais valioso: exaustividade
default: {
  const exhaustive: never = shape;   // erro se surgir caso novo
  return exhaustive;
}
```

---

## Tipos Literais

```ts
type Status = "rascunho" | "publicado" | "arquivado";
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

let article: Status = "rascunho";
// article = "removido";   // erro
```

- Conjunto **fechado** de valores válidos.
- Autocompletar no editor e erro de compilação em valor inválido.

---

## Literal x enum x as const

| Abordagem | Runtime | Iterável | Recomendação |
| --- | --- | --- | --- |
| União literal | Não | Não | Padrão |
| `enum` de string | Sim | Sim | Quando precisa listar |
| `enum` numérico | Sim | Sim | Evitar |
| `as const` | Sim | Sim | Alternativa moderna |

```ts
const LEVELS = { Info: "INFO", Error: "ERROR" } as const;
type Level = (typeof LEVELS)[keyof typeof LEVELS];
```

---

## Asserções

```ts
const input = document.querySelector("#email") as HTMLInputElement;

const palette = {
  primary: "#42a5f5",
} satisfies Record<string, string>;
```

| Recurso | Risco |
| --- | --- |
| `as Tipo` | **Alto**: mente para o compilador |
| `as const` | Nenhum |
| `satisfies` | Nenhum |
| `!` non-null | **Alto** |

---

## Exercício

Crie `src/inventory.ts`:

1. `type Category` como união literal com quatro categorias;
2. `interface Item` com `sku`, `name`, `price`, `category`, `tags` e `discount?`;
3. `type Summary = [total: number, count: number]`;
4. `summarize(items: Item[]): Summary` aplicando o desconto;
5. Objeto de categorias com `as const`, derivando o tipo dele.

---

## Solução do Exercício

```ts
const CATEGORIES = { Peripheral: "periferico", Video: "video" } as const;
type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

interface Item {
  sku: string;
  price: number;
  category: Category;
  discount?: number;
}

type Summary = [total: number, count: number];

function summarize(list: Item[]): Summary {
  const total = list.reduce((sum, item) => sum + item.price * (1 - (item.discount ?? 0)), 0);
  return [Number(total.toFixed(2)), list.length];
}
```

---

## Resumo da Aula

- Tipos primitivos são sempre em **minúsculas**.
- A inferência resolve a maior parte: anote nas **fronteiras**.
- `const` guarda o tipo **literal**; `let` alarga.
- Tupla fixa quantidade e tipo por posição; `readonly` bloqueia mutação.
- `any` desliga a verificação e propaga; `unknown` obriga a estreitar.
- União literal é preferível a `enum`; `satisfies` verifica sem alargar.
