---
title: 'Guia de Express.js'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Guia de Express.js

## Filosofia e Metodologia

- **Nativo Primeiro, Pacote Depois**: preferência por `node:crypto`, `node:sqlite` e `node:test`.
- **Conceito vs Projeto**: teoria com trechos concisos vinculada a projetos executáveis no Codespaces.
- **Stack Tecnológica**: Express 5, TypeScript nativo, Zod, Prisma e Node.js 22+.

## Trilhas de Aprendizado

- **Fundamentos**:
  - Do primeiro servidor com `node:http` ao Express.
  - Rotas, ciclo de requisição e resposta (`req` / `res`).
  - Cadeia de middlewares e migração para TypeScript.
- **Arquitetura**:
  - Separação em camadas com padrão MVC e Services.
  - Variáveis de ambiente tipadas e configurações por estágio (`NODE_ENV`).
  - Logs estruturados e métricas de observabilidade.
- **APIs HTTP**:
  - Design RESTful semântico e status codes corretos.
  - Validação estrita de contratos com Zod.
  - Tratamento padronizado de erros (RFC 7807).
  - Paginação, filtros e documentação OpenAPI / Swagger.
- **Persistência de Dados**:
  - SQL direto com driver nativo `node:sqlite`.
  - Modelagem relacional e migrations com Prisma ORM.
  - Operações CRUD e relações 1:N e N:N.
- **Autenticação e Segurança**:
  - Hash de senhas seguro com `node:crypto` (Argon2id).
  - Autenticação JWT stateless com cookies seguros.
  - Autorização baseada em papéis (RBAC).
  - Política de CORS, rate limiting e hardening de headers.
- **Recursos Avançados**:
  - Upload de arquivos no servidor.
  - Envio de e-mails transacionais.
  - Comunicação bidirecional em tempo real com WebSockets.
  - Empacotamento em containers Docker e estratégias de deploy.

## Aplicações Modelo

- **TaskAPI**: API de referência para recorte de código dos tópicos teóricos (12 etapas).
- **InvestApp**: Aplicação completa de gestão de investimentos com front-end integrado.
- **MonitorApp**: Sistema de monitoramento distribuído com SPA, WebSockets e métricas.
