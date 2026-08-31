---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Hello Express"
description: "Primeiro servidor HTTP construído com Express.js"
---

<!-- _class: lead -->

# Hello Express

Construção do primeiro servidor HTTP em Node.js com a biblioteca Express.js.

---

## Visão Geral do Projeto

- **Objetivo**: Inicializar uma aplicação Node.js, configurar o Express e expor requisições HTTP básicas.
- **Conceitos Chave**:
  - Instalação de dependências (`express`).
  - Instanciação da aplicação (`const app = express()`).
  - Escuta de portas com `app.listen(port, callback)`.
  - Retorno de respostas JSON com `res.json()`.
- **Repositório**: `examples/courses/express/projects/hello-express`

---

## Estrutura Mínima do Servidor

```typescript
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## Fluxo da Requisição HTTP

```txt
[Cliente HTTP] ──> [GET /api/health] ──> [Express app.get] ──> [res.json()] ──> [Cliente 200 OK]
```

---

## Resposta HTTP e Status Codes

- **HTTP 200 OK**: Retornado por padrão quando o manipulador de rota responde com sucesso.
- **Cabeçalho Content-Type**: O Express define automaticamente `application/json; charset=utf-8` ao usar `res.json()`.
- **Script de Execução**: `npm run dev` utilizando `tsx` para recompilação instantânea.

---

## Resumo e Boas Práticas

- Mantenha rotas separadas por responsabilidades funcionais.
- Utilize variáveis de ambiente para a porta do servidor.
- Teste seus endpoints via arquivo `requests.http` ou utilitários CLI (`curl`).
