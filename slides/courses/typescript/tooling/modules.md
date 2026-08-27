---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Módulos e Declarações"
description: "Slides da aula de módulos: ESM e CommonJS, import type, resolução, arquivos .d.ts, @types e declaration merging."
---

<!-- _class: lead -->

# TypeScript: Módulos e Declarações

ESM e CommonJS, `import type`, resolução de tipos e arquivos `.d.ts`.

---

## Objetivo

Entender o que circula entre módulos — código **e** tipos:

- Exportar e importar valores e tipos.
- Usar `import type` com consciência do que é apagado.
- Compreender a **resolução** de módulos e tipos.
- Escrever arquivos **`.d.ts`**.
- Tipar bibliotecas sem tipos e estender declarações.

---

## Exportando e Importando

```ts
export interface Course { id: string; title: string }
export type Level = "iniciante" | "avançado";
export const DEFAULT_HOURS = 20;
export default class CourseService {}
```

```ts
import CourseService, { DEFAULT_HOURS, type Course } from "./domain.js";
```

*A extensão `.js` não é erro: o import aponta para o arquivo **emitido**.*

---

## `import type`

| Situação | Use |
| --- | --- |
| Só tipos | `import type { … }` |
| Tipos e valores | `import { valor, type Tipo }` |
| Reexportar tipo | `export type { Tipo }` |
| Com `isolatedModules` | Sempre marcar explicitamente |

*`verbatimModuleSyntax` emite exatamente o que foi escrito.*

---

## ESM x CommonJS

| Aspecto | ESM | CommonJS |
| --- | --- | --- |
| Sintaxe | `import`/`export` | `require` |
| Extensão no import | Exigida | Não |
| `package.json` | `"type": "module"` | padrão |
| Extensões explícitas | `.mts` | `.cts` |
| Top-level `await` | Sim | Não |

*`ERR_REQUIRE_ESM` e `ERR_MODULE_NOT_FOUND` são erros de **runtime**.*

---

## Resolução de Tipos

```txt
import "lodash"
   │
   ├─▶ o pacote publica types?      ──▶ usa os .d.ts dele
   ├─▶ existe @types/lodash?        ──▶ usa o pacote da comunidade
   ├─▶ existe declaração local?     ──▶ usa a do projeto
   └─▶ nada                         ──▶ TS7016: implicitly has an 'any' type
```

```bash
pnpm exec tsc --traceResolution | grep lodash
```

---

## Arquivos `.d.ts`

```ts
export interface Course { id: string }
export declare function describe(course: Course): string;
```

| Situação | Origem |
| --- | --- |
| Lib com tipos | Gerado por `declaration: true` |
| Lib sem tipos, com comunidade | `@types/nome` |
| Sem tipos nenhum | Escrito por você |

---

## Tipando Lib Sem Tipos

```ts
// 1. Escape rápido, sem verificação
declare module "legacy-lib";

// 2. Declaração mínima do que você usa
declare module "legacy-lib" {
  export function connect(url: string): Promise<void>;
  export const version: string;
}

export {};
```

*Sem `export {}`, o `.d.ts` vira script **global** e vaza para todo o projeto.*

---

## Estendendo Declarações

```ts
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

declare global {
  interface Window {
    analytics?: { track(event: string): void };
  }
}
```

*O *declaration merging* de interfaces é o que torna isso possível.*

---

## Exercício

Crie o pacote `format-lib/`:

1. `package.json` com `"type": "module"` e campo `exports`;
2. `src/index.ts` exportando funções e uma interface;
3. `declaration` e `declarationMap` ligados;
4. `types/legacy-chart.d.ts` declarando um módulo fictício;
5. Importe o módulo fictício e comprove a assinatura no editor.

---

## Solução do Exercício

```json
{
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  }
}
```

```ts
declare module "legacy-chart" {
  export interface ChartOptions { width: number; height: number }
  export function render(data: number[], options: ChartOptions): string;
}
```

---

## Resumo da Aula

- Com `NodeNext`, o import precisa da extensão `.js` — é o arquivo emitido.
- `import type` desaparece do JavaScript; import comum permanece.
- O formato do módulo vem do `type` no `package.json` e das extensões `.mts`/`.cts`.
- A busca de tipos vai do pacote → `@types` → declaração local → erro TS7016.
- `.d.ts` só contém tipos e não gera JavaScript.
- `export {}` transforma o `.d.ts` em módulo e evita vazamento global.
