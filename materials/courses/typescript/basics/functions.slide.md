---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Funções"
description: "Slides da aula de funções em TypeScript: parâmetros, opcionais e padrão, rest, tipos de função, tipagem contextual, void versus never e sobrecargas."


---



<!-- _class: lead -->

# TypeScript: Funções

Parâmetros e retorno, opcionais e rest, tipos de função, `void` versus `never` e sobrecargas.



---



## Objetivo

Tornar o contrato explícito na fronteira mais importante do sistema:

- Anotar parâmetros e decidir quando anotar o **retorno**.
- Usar parâmetros **opcionais**, com **valor padrão** e **rest**.
- Declarar **tipos de função** e aproveitar a tipagem contextual.
- Diferenciar `void`, `undefined` e `never`.
- Escrever **sobrecargas** quando a assinatura varia.



---

## Assinatura (Parte 1)

```ts
function applyDiscount(price: number, percentage: number): number {
  return price * (1 - percentage);
}

```

---

## Assinatura (Parte 2)

```ts
// Retorno inferido como number
function subtotal(price: number, quantity: number) {
  return price * quantity;
}
```

| Elemento | Anotar? |
| --- | --- |
| Parâmetro | **Sempre** |
| Retorno de função exportada | Sim |
| Retorno de função interna curta | Opcional |

---



## Opcionais, Padrão e Rest

```ts
function greet(name: string, title?: string): string { … }      // string | undefined
function connect(host: string, port: number = 5432): string { … } // continua number
function sum(...values: number[]): number { … }                  // sempre array
```

- Opcional e padrão vêm **depois** dos obrigatórios.
- `?` inclui `undefined` no tipo; valor padrão não.



---



## Armadilha do Padrão Mutável

```ts
function addItem(item: string, items: string[] = []) {
  items.push(item);
  return items;
}
```

- Em TypeScript o padrão é avaliado **a cada chamada** — diferente do Python.
- Mas o mesmo objeto compartilhado aparece em `const CACHE = []` no escopo do módulo.



---



## Tipos de Função

```ts
type Transformer = (value: string) => string;

type Handler = {
  (event: string): void;
  priority: number;
};

interface Comparator<T> {
  (a: T, b: T): number;
}
```



---



## Tipagem Contextual

```ts
const names = ["ana", "bia"];

names.map((name) => name.toUpperCase());   // name é string por contexto

function repeat(times: number, callback: (index: number) => void): void { … }

repeat(3, (index) => console.log(index));  // index é number
```

*Anotar o parâmetro do callback é redundante quando o contexto já define o tipo.*



---



## `void`, `undefined` e `never`

| Tipo | Significa |
| --- | --- |
| `void` | O retorno não deve ser usado |
| `undefined` | O retorno é literalmente `undefined` |
| `never` | A função **nunca** retorna |

```ts
// Um callback `() => void` aceita função que devolve qualquer coisa:
[1, 2, 3].forEach((value) => ids.push(value));   // push devolve number
```



---



## Sobrecargas

```ts
function parse(value: string): string[];
function parse(value: string, asNumber: true): number[];
function parse(value: string, asNumber?: boolean): string[] | number[] {
  const parts = value.split(",").map((part) => part.trim());
  return asNumber ? parts.map(Number) : parts;
}

const words = parse("a, b");          // string[]
const numbers = parse("1, 2", true);  // number[]
```

*Prefira união ou generic quando expressarem o mesmo contrato.*



---



## `this` Tipado

```ts
interface Button {
  label: string;
  onClick(this: Button, event: string): void;
}

class Counter {
  private count = 0;
  increment = (): number => ++this.count;   // arrow preserva o this
}
```

- O parâmetro `this` é apagado e não entra na chamada.



---



## Exercício

Crie `src/validators.ts`:

1. `type Validator = (value: string) => boolean`;
2. `isEmail`, `isPhone` e `minLength(size: number): Validator`;
3. `validate(value: string, ...validators: Validator[]): boolean`;
4. `describe(value, rules: Record<string, Validator>): string`;
5. Anote o retorno de todas as funções exportadas.



---



## Solução do Exercício

```ts
export type Validator = (value: string) => boolean;

export function minLength(size: number = 8): Validator {
  return (value) => value.length >= size;
}

export function validate(value: string, ...validators: Validator[]): boolean {
  return validators.every((validator) => validator(value));
}

console.log(validate("ana@devlab.dev", isEmail, minLength(5)));
```



---


## Resumo da Aula (Parte 1)

- Parâmetros **sempre** precisam de anotação; o retorno costuma ser inferido.
- Anote o retorno em funções exportadas para o erro aparecer dentro da função.
- `?` produz `string | undefined`; valor padrão mantém o tipo original.


---


## Resumo da Aula (Parte 2)

- Tipos de função descrevem callbacks; a tipagem contextual dispensa anotações.
- `void` significa "ignore o retorno" — diferente de `undefined`.
- Sobrecargas descrevem variações; use união ou generic quando possível.