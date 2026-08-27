---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Objetos e Interfaces"
description: "Slides da aula de objetos: interface versus type, opcionais e readonly, index signatures, extensão, tipagem estrutural e excess property checks."

---


<!-- _class: lead -->

# TypeScript: Objetos e Interfaces

`interface` versus `type`, modificadores, extensão, tipagem estrutural e literais.


---


## Objetivo

Modelar a forma dos dados do domínio:

- Descrever objetos com **`interface`** e **`type`**, e escolher entre eles.
- Usar propriedades **opcionais**, **readonly** e **index signatures**.
- **Estender** e **compor** tipos.
- Explicar a **tipagem estrutural**.
- Entender a verificação extra dos **literais de objeto**.


---


## interface x type

| Recurso | `interface` | `type` |
| --- | --- | --- |
| Descrever objeto | Sim | Sim |
| Estender | `extends` | `&` |
| Declaration merging | **Sim** | Não |
| Uniões | Não | **Sim** |
| Tuplas e primitivos | Não | **Sim** |
| Mapeados e condicionais | Não | **Sim** |

*Regra prática: `interface` para objetos e contratos; `type` para o resto.*


---


## Modificadores

```ts
interface Config {
  readonly id: string;        // não pode ser reatribuída
  host: string;
  port?: number;              // number | undefined
  [key: string]: unknown;     // index signature
}
```

*`readonly` é **raso**: `readonly items: string[]` não impede `items.push()`.*


---


## Estendendo e Compondo

```ts
interface Entity { id: string; createdAt: Date }

interface Article extends Entity {
  title: string;
}

type ArticleType = Entity & { title: string };
```

- `extends` acrescenta campos a uma interface.
- Interseção `&` funde tipos — inclusive vários de uma vez.


---


## Tipagem Estrutural

```ts
interface Point { x: number; y: number }

const coordinates = { x: 3, y: 4, label: "origem" };
distance(coordinates);   // aceito: tem a forma exigida

class Vector { constructor(public x: number, public y: number) {} }
distance(new Vector(6, 8));   // classes também são estruturais
```

*Compatibilidade pela **forma**, não pelo nome. Não é preciso declarar `implements`.*


---


## Excess Property Checks

```ts
// Erro: literal atribuído diretamente
// const a: Options = { debug: true, timeuot: 30 };

// Sem erro: a variável já tem tipo próprio
const raw = { debug: true, timeuot: 30 };
const b: Options = raw;
```

- Literais "frescos" recebem verificação **extra**, para pegar erro de digitação.
- Variáveis passam só pela compatibilidade estrutural.


---

## Aceitando Extras de Propósito (Parte 1)

```ts
// 1. Index signature
interface OpenOptions {
  debug?: boolean;
  [key: string]: unknown;
}

```

---

## Aceitando Extras de Propósito (Parte 2)

```ts
// 2. Variável intermediária
const options = { debug: true, extra: 1 };
const used: OpenOptions = options;

// 3. Asserção — último recurso
const forced = { debug: true } as OpenOptions;
```

---


## Reaproveitando Partes

```ts
type CustomerId = Customer["id"];        // indexed access
type Keys = keyof Customer;              // união das chaves
type CustomerUpdate = Partial<Customer>;
type PublicCustomer = Omit<Customer, "id">;
```

*Uma fonte da verdade, várias projeções — o tema de Utility Types.*


---


## Exercício

Crie `src/catalog.ts`:

1. `interface Metadata` com `readonly slug` e `createdAt`;
2. `interface Course extends Metadata` com `title`, `hours`, `level` e `instructor?`;
3. `Record<string, Course>` indexado pelo slug;
4. `summary(course)` usando optional chaining e `??`;
5. Demonstre um erro de excess property check.


---

## Solução do Exercício (Parte 1)

```ts
interface Course extends Metadata {
  title: string;
  hours: number;
  level: Level;
  instructor?: Instructor;
}

```

---

## Solução do Exercício (Parte 2)

```ts
function summary(course: Course): string {
  const owner = course.instructor?.name ?? "a definir";
  return `${course.title.padEnd(22)}${String(course.hours).padStart(3)}h  ${owner}`;
}

// const errado: Course = { ...curso, horas: 10 };
// error TS2353: 'horas' does not exist in type 'Course'.
```

---

## Resumo da Aula (Parte 1)

- `interface` faz *declaration merging*; `type` faz uniões, tuplas e tipos derivados.
- `?` inclui `undefined`; `readonly` impede reatribuição — mas é **raso**.
- Index signature descreve chaves dinâmicas.

---

## Resumo da Aula (Parte 2)

- A compatibilidade é **estrutural**: quem tem a forma é aceito.
- Literais de objeto recebem verificação extra contra propriedades desconhecidas.
- `keyof` e `T["campo"]` reaproveitam partes de um tipo sem duplicar.