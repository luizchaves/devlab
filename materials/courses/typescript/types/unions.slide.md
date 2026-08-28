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
title: "TypeScript: Uniões e Interseções"
description: "Slides da aula de uniões e interseções: tipos literais, uniões discriminadas, exaustividade, composição com & e modelagem de estados."

---


<!-- _class: lead -->

# TypeScript: Uniões e Interseções

Alternativas com `|`, composição com `&`, uniões discriminadas e modelagem de estados.


---


## Objetivo

Descrever alternativas e combinações entre formas:

- Escrever tipos **união** e **interseção**.
- Restringir valores com **tipos literais**.
- Modelar alternativas com **uniões discriminadas**.
- Garantir **exaustividade** com `never`.
- Eliminar **estados impossíveis** na modelagem.


---


## União

```ts
type Id = string | number;

function describe(id: Id): string {
  id.toString();          // só o que existe nos DOIS tipos

  if (typeof id === "string") return id.toUpperCase();
  return id.toFixed(0);
}
```

*Mais valores aceitos, menos operações disponíveis — até estreitar.*


---


## Tipos Literais

```ts
type Level = "debug" | "info" | "error";

const ROUTES = { home: "/", courses: "/courses" } as const;

type RouteName = keyof typeof ROUTES;          // "home" | "courses"
type RoutePath = (typeof ROUTES)[RouteName];   // "/" | "/courses"
```

- Conjunto fechado, com autocompletar e erro em valor inválido.
- Substitui `status: string` mais constante em outro arquivo.


---


## Uniões Discriminadas

```ts
type Payment =
  | { method: "card"; brand: string; installments: number }
  | { method: "pix"; key: string }
  | { method: "slip"; dueDate: Date };

switch (payment.method) {
  case "card": return `Cartão ${payment.brand}`;
  case "pix":  return `PIX para ${payment.key}`;
  case "slip": return `Boleto ${payment.dueDate.toLocaleDateString()}`;
}
```


---


## Anatomia do Padrão

| Elemento | Papel |
| --- | --- |
| Propriedade comum (`method`) | Existe em todas as variações |
| Tipo literal em cada uma | Permite distinguir |
| `switch` sobre ela | Ativa o narrowing |
| `never` no `default` | Prova exaustividade |

*Acessar `payment.key` no ramo do cartão é erro de compilação.*


---


## Exaustividade

```ts
default: {
  const exhaustive: never = shape;
  throw new Error(`forma não tratada`);
}
```

```txt
error TS2322: Type '{ kind: "triangle"; … }' is not assignable to type 'never'.
```

*O compilador entrega a lista completa de pontos a atualizar.*


---


## Interseção

```ts
type Entity = Identifiable & Timestamped;

type User = Entity & {
  name: string;
  email: string;
};
```

| Operador | Significado | Efeito |
| --- | --- | --- |
| `A \| B` | um **ou** outro | mais valores, menos operações |
| `A & B` | um **e** outro | menos valores, mais operações |


---


## Interseção Impossível

```ts
type Impossible = string & number;   // never

type A = { value: string };
type B = { value: number };
type AB = A & B;                     // value: never
```

*O erro não aparece na declaração — só na hora de criar o objeto.*


---


## Precedência

```ts
let mixed: (string | number)[] = ["a", 1];       // array misto
let separate: string[] | number[] = ["a", "b"];  // um OU outro

type Handler = (value: string | number) => void; // preferível
```

*Unir tipos de função torna os parâmetros uma interseção — quase sempre indesejável.*


---


## Estados Impossíveis

```ts
// Frouxo: 16 combinações, a maioria inválida
interface LooseState { loading: boolean; data?: string[]; error?: string }

// Por união: só os estados possíveis existem
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "failure"; error: string };
```


---


## Exercício

Crie `src/editor.ts`:

1. `type Command` com `insert`, `delete`, `move` e `undo`;
2. Cada variação carrega só os campos que fazem sentido;
3. `apply(text, command)` com `switch` sobre o discriminante;
4. Exaustividade com `never`;
5. `type AuditedCommand = Command & { at: Date; by: string }`.


---

## Solução do Exercício (Parte 1)

```ts
function apply(text: string, command: Command): string {
  switch (command.kind) {
    case "insert":
      return text.slice(0, command.position) + command.content + text.slice(command.position);
    case "delete":
      return text.slice(0, command.position) + text.slice(command.position + command.length);
    case "undo":
```

---

## Solução do Exercício (Parte 2)

```ts
      return history.pop() ?? text;
    default: {
      const exhaustive: never = command;
      throw new Error(`não tratado: ${JSON.stringify(exhaustive)}`);
    }
  }
}
```

---

## Resumo da Aula (Parte 1)

- União aceita mais valores e oferece só o que é comum, até o narrowing.
- União literal documenta as opções válidas na própria assinatura.
- O **discriminante** literal é o que permite estreitar objetos unidos.

---

## Resumo da Aula (Parte 2)

- `never` no `default` transforma variação nova em erro de compilação.
- Interseção combina exigências — e produz `never` em chaves conflitantes.
- Modelar por união elimina estados impossíveis por construção.