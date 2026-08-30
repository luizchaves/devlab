---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express + Prisma ORM"
description: "Persistência com Prisma ORM no Express.js"
---

<!-- _class: lead -->

# Express.js + Prisma ORM

Integração de persistência tipada em banco de dados relacional.

---

## O que é o Prisma ORM?

- Ferramenta de mapeamento objeto-relacional com suporte total a TypeScript.
- **Componentes**:
  - `schema.prisma`: Definição de modelos e fonte de dados.
  - `PrismaClient`: Cliente tipado autogerado para consultas SQL.
  - **Prisma Migrate**: Gerenciamento de alterações na estrutura do banco.

---

## Instanciação e Uso nas Rotas

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
```

---

## Boas Práticas de Persistência

- Reutilize a mesma instância do `PrismaClient` (Padrão Singleton).
- Trate erros de violação de chave única (`P2002`) retornando HTTP 409 Conflict.
- Utilize migrations (`npx prisma migrate dev`) para sincronizar a base.
