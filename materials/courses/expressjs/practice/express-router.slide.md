---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express Router"
description: "Modularização de rotas com express.Router"
---

<!-- _class: lead -->

# Modularização com Express Router

Dividindo rotas de aplicações grandes em módulos isolados e reutilizáveis.

---

## O Problema do Arquivo Único

- À medida que a aplicação cresce, ter todas as rotas no `server.ts` inviabiliza a manutenção.
- **Solução**: Utilizar `express.Router()` para criar mini-aplicações de roteamento por domínio (ex: usuários, produtos).

---

## Criando um Roteador Modular

```typescript
// src/routes/user.routes.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { /* listar usuários */ });
router.post('/', (req, res) => { /* criar usuário */ });

export default router;
```

```typescript
// src/app.ts
import express from 'express';
import userRoutes from './routes/user.routes.ts';

const app = express();
app.use('/api/users', userRoutes);
```

---

## Vantagens da Modularização

- Prefixo centralizado de caminhos no `app.use('/api/recurso', router)`.
- Aplicação de middlewares específicos apenas para um conjunto determinado de rotas.
- Facilidade para realização de testes de integração por domínio funcional.
