---
title: 'InvestApp: Validação com Zod'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# InvestApp — Etapa 4: Validação

## Ideia Central

- **Projeto**: InvestApp (Etapa 4 de 13)
- **Objetivo**: Criar uma barreira de contrato estrita na entrada da API usando Zod
- **Resultado**: Controllers limpos de instruções `if` e respostas HTTP 400 amigáveis

## As 3 Camadas de Validação

- **Front-end (Navegador)**:
  - *Ferramentas*: HTML5 (`required`, `minlength`), DOM API (`checkValidity()`)
  - *Função*: Feedback imediato em tempo real ao usuário
  - *Segurança*: Zero (contornável por DevTools ou `curl`)
- **API (Servidor / Zod)**:
  - *Ferramentas*: Middleware Express + Zod Schemas
  - *Função*: Bloquear requisições malformadas antes da regra de negócio
  - *Segurança*: Total na entrada do servidor
- **Banco de Dados (SGBD)**:
  - *Ferramentas*: Constraints SQL e Mapeamento Prisma (`@id`, `@db.VarChar`, `@relation`, `UNIQUE`)
  - *Função*: Garantir integridade física persistida contra qualquer origem
  - *Proteção Extra*: Previne *race conditions* em checagem de unicidade

## Middleware de Validação (`validate.ts`)

- **Higher-Order Function**: Retorna middleware nativo Express `(req, res, next)`
- **Validação Unificada**: Agrupa `body`, `query` e `params` em um único objeto
- **Método Utilizado**: `schema.safeParseAsync(...)`
- **Fluxo de Erro**: Dispara `HttpError(400, msg, issues)` para o `errorHandler`

## Schemas Zod (`investment.schema.ts`)

- **O que é Zod**: Biblioteca TypeScript-first de validação com inferência de tipo (`z.infer`)
- **Schemas da Etapa**:
  - `createInvestmentSchema`: Valida `body` (`name`, `value` positivo)
  - `readInvestmentByIdSchema`: Valida `params` (`id` UUID)
  - `updateInvestmentSchema`: Compõe `body` parcial e `params`

## Requisitos & Critérios de Aceite (US04)

- **CA04.1**: HTTP 400 Bad Request se o corpo for inválido
- **CA04.2**: Resposta indica qual fonte (`body`, `query`, `params`) e campo falhou
- **CA04.3**: Rejeita ID que não seja UUID antes de consultar o armazenamento
- **CA04.4**: Rejeita formato com 400, e recurso ausente com 404
- **CA04.6**: Controllers 100% livres de código de validação manual
