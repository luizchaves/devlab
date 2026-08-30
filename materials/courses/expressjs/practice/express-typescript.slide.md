---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express com TypeScript"
description: "Tipagem estrita e desenvolvimento seguro no Express.js"
---

<!-- _class: lead -->

# Express.js com TypeScript

Adicionando checagem estática de tipos e autocompletar profissional em APIs Node.js.

---

## Tipos Fundamentais do Express

- Importe os tipos nativos do pacote `@types/express`:
  - `Request`: Representa a requisição HTTP.
  - `Response`: Representa a resposta HTTP.
  - `NextFunction`: Função para encadeamento de middlewares.

```typescript
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
```

---

## Configuração do `tsconfig.json`

- `strict: true`: Habilita verificações estritas de nulidade.
- `target: ES2022`: Recursos modernos de JavaScript.
- `moduleResolution: node16` / `nodenext`: Suporte a módulos ECMAScript.
- Execução rápida em ambiente de desenvolvimento via `tsx`.
