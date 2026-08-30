---
title: 'Projeto: Express + Prisma ORM'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express + Prisma ORM

## Componentes do Prisma

- Modelagem em `schema.prisma`
- Gerador de cliente tipado `PrismaClient`
- Controle de versão com Prisma Migrate

## Integração no Express

- Padrão Singleton para conexão
- Tratamento de códigos de erro do Prisma (ex: P2002)
