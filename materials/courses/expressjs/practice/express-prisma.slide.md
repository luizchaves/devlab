---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express + Prisma"
description: "CRUD persistente com Express, Prisma ORM e SQLite."
---

<!-- _class: lead -->

# Projeto: Express + Prisma

CRUD persistente com Express, Prisma ORM e SQLite.

---

## Objetivo

- Entender o papel de **Projeto: Express + Prisma** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/prisma`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Estrutura**
- **Schema**
- **Código**
- **Executando**
- **Conceitos abordados**
- **Próximo projeto**

---

## Contexto da Aula

- Nível Avançado · Node.js · Express.js · Prisma · SQLite
- A mesma estrutura MVC do projeto anterior, com os dados em um banco de verdade.

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- CRUD persistente com Express, Prisma ORM e SQLite.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Schema

- Schema aparece como ponto central da aula, não apenas como item de índice.
- CRUD persistente com Express, Prisma ORM e SQLite.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- CRUD persistente com Express, Prisma ORM e SQLite.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- cd examples/courses/express/projects/prisma

---

## Executando: Exemplo

```txt
2. <PackageManagerTabs />
3. ```bash
   cp .env.example .env
```

---

## Conceitos abordados

- Schema declarativo e relacionamento `User` ↔ `Post`
- Instância única do `PrismaClient`
- Controllers assíncronos com tratamento de erro automático (Express 5)
- Seed de dados iniciais
- Só o `.env.example` é versionado. Rode `cp.env.example.env` depois de clonar.

---

## Próximo projeto

- Express Auth: cadastro, autenticação e autorização com `node:crypto`.

---

## Arquivos-Chave da Aula

- **prisma/schema.prisma**: `examples/courses/express/projects/prisma/prisma/schema.prisma`

---

## Resumo da Aula

- **Projeto: Express + Prisma** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
