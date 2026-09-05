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
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "TypeScript: Evolução e Versões"
description: "Slides sobre a evolução do TypeScript: ciclo de lançamentos, histórico da 1.0 à 5.x, a transição do 6.0 e o compilador nativo em Go do 7.0."

---


<!-- _class: lead -->

# TypeScript: Evolução e Versões

Da primeira anotação de tipo em 2012 ao compilador nativo em Go.


---


## Objetivo

Situar cada recurso da linguagem na sua versão:

- Entender **como** o TypeScript evolui, e por quem.
- Percorrer o histórico da **1.0 até a 5.x**.
- Saber o que muda no **6.0**, a versão de transição.
- Conhecer o **7.0**, o compilador reescrito em Go.


---


## Como o TypeScript Evolui?

- Produto da **Microsoft**, não de um comitê internacional.
- Ciclo aproximadamente **trimestral**: beta, RC, estável.
- `major.minor`, mas **não é SemVer estrito**.

*Uma versão minor pode introduzir erros novos: verificação mais precisa é correção, não quebra.*


---


## Três Objetivos de Projeto

| Objetivo | Consequência prática |
| :--- | :--- |
| Alinhamento com o ECMAScript | Sintaxe de execução vem do TC39 |
| Apagamento completo dos tipos | Sem verificação em runtime |
| Solidez pragmática | Algumas brechas são conscientes |

*Exceção histórica: `enum` e `namespace`, criados antes de o JS ter módulos.*


---


## Linha do Tempo (Parte 1)

| Versão | Ano | Destaques |
| :--- | :--- | :--- |
| **1.0** | 2014 | Anotações, `interface`, generics, `.d.ts` |
| **2.0** | 2016 | `strictNullChecks`, uniões discriminadas, `never` |
| **2.8** | 2018 | Tipos condicionais, `infer` |
| **3.0** | 2018 | `unknown`, tuplas em rest |
| **3.7** | 2019 | `?.`, `??`, funções de asserção |


---


## Linha do Tempo (Parte 2)

| Versão | Ano | Destaques |
| :--- | :--- | :--- |
| **4.0** | 2020 | Tuplas variádicas, `catch` com `unknown` |
| **4.1** | 2020 | Template literal types |
| **5.0** | 2023 | Decorators ECMAScript, `satisfies`, `const` |
| **5.2** | 2023 | `using` e `await using` |
| **5.5** | 2024 | Predicados de tipo inferidos |
| **5.8** | 2025 | `erasableSyntaxOnly` |
| **6.0 / 7.0** | — | Transição e compilador nativo |


---


## 1.x — A Fundação

```ts
interface User {
  id: number;
  name: string;
}

function first<T>(list: T[]): T {
  return list[0];
}
```

*Isso compilaria em 2014 e continua válido hoje.*


---


## 2.0 — `strictNullChecks`

```ts
function upper(text: string): string {
  return text.toUpperCase();
}

upper(null);
// Sem strictNullChecks: compila e quebra em runtime
// Com strictNullChecks: erro de compilação
```

- Antes dele, `null` e `undefined` pertenciam a **todos** os tipos.
- É o divisor de águas do sistema de tipos.


---


## 2.8 — Tipos Condicionais e `infer`

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;

type Names = ElementOf<string[]>; // string
```

*Sem esse recurso, `Partial`, `Pick` e `ReturnType` não existiriam.*


---


## 3.0 — `unknown`

```ts
const data: unknown = JSON.parse('{"name":"Ana"}');

// data.name;  // erro: é preciso estreitar antes

if (typeof data === "object" && data !== null && "name" in data) {
  console.log(data.name);
}
```

*A alternativa segura ao `any`, para tudo que vem de fora.*


---


## 4.1 — Template Literal Types

```ts
type Event = "click" | "focus";
type Handler = `on${Capitalize<Event>}`;
// "onClick" | "onFocus"
```

- A partir daqui, tipos viram uma pequena linguagem de programação.
- Poder que vicia: saiba **quando parar**.


---


## 5.0 — `satisfies`

```ts
const palette = {
  primary: "#42a5f5",
  danger: "#e53935",
} satisfies Record<string, string>;

palette.primary.toUpperCase();
// continua string literal, não string
```

*Verifica a compatibilidade sem alargar o tipo inferido.*


---


## 5.5 — Predicados Inferidos

```ts
const values = [1, undefined, 3];

// Antes do 5.5: (v): v is number => v !== undefined
const numbers = values.filter((v) => v !== undefined);
// number[], sem anotação
```

*O compilador passou a entender o código que já era escrito.*


---


## 6.0 — Mudanças de Padrão

| Opção | Até o 5.9 | No 6.0 |
| :--- | :--- | :--- |
| `strict` | `false` | **`true`** |
| `module` | `commonjs` | `esnext` |
| `target` | `es5` | ES do ano corrente |
| `noUncheckedSideEffectImports` | `false` | `true` |
| `libReplacement` | `true` | `false` |


---


## 6.0 — Depreciações

- **`target: es5`**: alvo mínimo passa a ser `es2015`.
- **`downlevelIteration`**: só servia para a emissão ES5.
- **`moduleResolution: node`**: migrar para `nodenext` ou `bundler`.
- **`module`: `amd`, `umd`, `systemjs`, `none`**: anteriores ao ESM.

*`"ignoreDeprecations": "6.0"` é um prazo, não uma solução: o 7.0 remove tudo.*


---


## 7.0 — O Compilador em Go

- Reescrita nativa do compilador, `tsgo` durante o desenvolvimento.
- Objetivo declarado: **desempenho** em bases grandes.

| O que muda | O que não muda |
| :--- | :--- |
| O programa que verifica | A linguagem que você escreve |
| A API de compilador | Tipos, sintaxe e semântica |
| As opções depreciadas somem | O resultado da verificação |


---


## Quem Executa e Quem Verifica?

| Ambiente | Executa `.ts`? | Verifica os tipos? |
| :--- | :--- | :--- |
| Navegador | Não | Não |
| Node.js 22+ | Sim, removendo tipos | **Não** |
| Deno | Sim | Sim |
| Bun | Sim | **Não** |
| `tsx` e bundlers | Sim | **Não** |
| `tsc --noEmit` | Não executa | **Sim** |

*Executar é rápido porque ninguém verifica. A verificação é passo separado, e vai no CI.*


---

## Resumo (Parte 1)

- O TypeScript é um produto com ciclo próprio, alinhado ao TC39.
- `strictNullChecks` (2.0) e `infer` (2.8) sustentam tudo que veio depois.
- `unknown` (3.0) e template literals (4.1) mudaram o dia a dia.

---

## Resumo (Parte 2)

- `satisfies` (5.0) e predicados inferidos (5.5) reduzem anotação manual.
- O 6.0 liga `strict` por padrão e aposenta o alvo ES5.
- O 7.0 troca o compilador, não a linguagem.
