---
title: 'InvestApp: Visão Geral'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# InvestApp: Visão Geral

## Visão Geral

- **Aplicação**: InvestApp
- **Etapa**: Visão Geral
- **Objetivo**: controle de investimentos em treze etapas cumulativas.

## Antes das etapas

- **Backlog do produto**: épicos, features, histórias, critérios e tasks
- **Especificação da API**: endpoints, status codes, erros e upload
- **Front estático**: primeira etapa prática e telas do produto

## Componentes Técnicos

- Front na mesma origem servido pelo Express
- API REST em camadas com TypeScript e Zod
- SQLite nativo na transição para Prisma ORM
- Upload, e-mail, testes e Docker no final da trilha

## Domínio

- `User`: investidor autenticado
- `Investment`: ativo da carteira
- `Category`: classificação visual
- `Broker`: corretora ou instituição

## Boas Práticas

- Use a visão geral como mapa, não como especificação completa
- Leia backlog e API spec antes de codificar
- Compare etapas para enxergar apenas o delta técnico
