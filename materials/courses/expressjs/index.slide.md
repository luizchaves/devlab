---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Guia de Express.js"
description: "Guia de referência do Express.js: rotas, middlewares, TypeScript, APIs REST, arquitetura em camadas, persistência com SQLite e Prisma, autenticação nativa, segurança, observabilidade e projetos práticos."
---

<!-- _class: lead -->

# Guia de Express.js

Construção de APIs HTTP em Node.js: rotas, middlewares, arquitetura, persistência e segurança.

---

## Objetivo

Apresentar a estrutura completa do Guia de Express.js e sua metodologia de aprendizado.

- Dominar o ecossistema do **Express 5** e sua integração nativa com o **Node.js**.
- Aplicar o princípio **"Nativo primeiro, pacote depois"** em autenticação, validação e persistência.
- Compreender a separação entre **aulas de conceito** e **páginas de projeto executável**.
- Navegar pelas trilhas de **Fundamentos**, **Arquitetura**, **APIs HTTP**, **Persistência**, **Autenticação**, **Segurança** e **Recursos Avançados**.
- Conhecer as aplicações modelo do guia: **TaskAPI**, **InvestApp** e **MonitorApp**.

---

## Mapa do Guia

- Filosofia: "Nativo Primeiro, Pacote Depois"
- Estrutura: Páginas de Conceito vs Páginas de Projeto
- Trilha 1: Fundamentos e Migração para TypeScript
- Trilha 2: Arquitetura em Camadas (MVC) e Observabilidade
- Trilha 3: APIs RESTful, Validação e Tratamento de Erros
- Trilha 4: Persistência (SQL nativo com `node:sqlite` e Prisma)
- Trilha 5: Autenticação Segura com `node:crypto`
- Trilha 6: Segurança (CORS e Hardening) e Recursos Avançados
- As Aplicações Modelo: TaskAPI, InvestApp e MonitorApp
- Roteiro de Estudos: Por Onde Começar

---

## Filosofia: Nativo Primeiro, Pacote Depois

O guia prioriza soluções nativas do Node.js antes de adotar bibliotecas externas:

| Funcionalidade | Abordagem Nativa (Guia) | Pacote de Terceiros |
| :--- | :--- | :--- |
| **Hash de Senhas** | `node:crypto` (Argon2id / Scrypt) | `bcrypt` / `argon2` |
| **Assinatura JWT** | `node:crypto` (HMAC SHA-256) | `jsonwebtoken` |
| **Banco de Dados** | `node:sqlite` (Driver nativo) | `better-sqlite3` |
| **Variáveis de Ambiente** | `process.loadEnvFile()` (Node 20+) | `dotenv` |
| **Testes Automatizados** | `node:test` e `node:assert` | `jest` / `mocha` |

> *Escolher um pacote externo após dominar a solução nativa é uma decisão de engenharia consciente.*

---

## Organização: Conceito vs Projeto

O aprendizado é dividido em dois tipos de páginas complementares:

| Dimensão | Aula de Conceito | Página de Projeto (Na Prática) |
| :--- | :--- | :--- |
| **Foco** | O princípio, a mecânica e as armadilhas | A árvore real, a execução e a integração |
| **Código** | Trechos enxutos de 5 a 15 linhas | Arquivos completos do repositório executável |
| **Recurso** | Diagramas Mermaid e tabelas de decisão | Botões "Abrir no GitHub" e "Codespaces" |
| **Localização** | Categorias temáticas (`basics/`, `auth/`...) | Trilha `practice/` (`taskapi/`, `investapp/`) |

- Cada aula de conceito recorta código real da **TaskAPI** e aponta para o projeto correspondente.

---

## Trilhas de Aprendizado (Parte 1: Base e Arquitetura)

1. **Fundamentos**:
   - Do primeiro servidor com `node:http` até o Express.
   - Rotas, ciclo requisição/resposta (`req`/`res`) e cadeia de middlewares.
   - Migração progressiva para **TypeScript estrito**.

2. **Arquitetura**:
   - Separação em camadas com responsabilidade única (**MVC / Controller-Service**).
   - Configuração tipada por ambiente (`NODE_ENV`).
   - Registro de logs estruturados e métricas de observabilidade.

---

## Trilhas de Aprendizado (Parte 2: APIs e Persistência)

3. **APIs HTTP**:
   - Modelagem RESTful, verbos HTTP e códigos de status semânticos.
   - Formato padronizado de erros RFC 7807 (*Problem Details*).
   - Validação estrita de entradas (`body`, `query`, `params`) com **Zod**.
   - Paginação, ordenação, filtros e documentação interativa com **OpenAPI/Swagger**.

4. **Persistência de Dados**:
   - Do SQL puro com o driver nativo **`node:sqlite`**.
   - Modelagem de esquemas, migrations e relacionamentos (1:N, N:N) com **Prisma**.
   - Implementação de operações CRUD com integridade referencial.

---

## Trilhas de Aprendizado (Parte 3: Segurança e Produção)

5. **Autenticação e Autorização**:
   - Cadastro de usuários com hash seguro de senhas via `node:crypto`.
   - Autenticação stateless baseada em tokens **JWT** e cookies `HttpOnly`.
   - Controle de acesso baseado em papéis (*RBAC*).

6. **Segurança e Hardening**:
   - Compreensão profunda de **CORS** e cabeçalhos de segurança (Helmet).
   - Limitação de taxa de requisições (*Rate Limiting*) e sanitização.

7. **Recursos Avançados**:
   - Upload de arquivos, envio de e-mails transacionais, WebSockets e Deploy com Docker.

---

## As Três Aplicações do Guia

Projetos cumulativos que evoluem etapa a etapa:

| Aplicação | Proposta | Escopo |
| :--- | :--- | :--- |
| **TaskAPI** | API modelo das aulas | Apenas Back-end, TypeScript nativo, 12 etapas cumulativas. |
| **InvestApp** | Controle de Investimentos | Aplicação completa, front-end servido na mesma origem, 12 etapas. |
| **MonitorApp** | Monitoramento de Hosts | Front-end SPA separado, WebSockets, métricas de rede, 12 etapas. |

---

## Por Onde Começar?

- **Iniciantes em Back-end**:
  1. Comece por [Fundamentos](basics/introduction/) e siga a ordem da barra lateral.
  2. Suba o projeto `hello-express` e teste cada rota no terminal.

- **Desenvolvedores com Experiência**:
  1. Vá direto para [Tratamento de Erros](api/error-handling/) e [Validação](api/validation/).
  2. Estude [Senhas e Hash](auth/passwords/) com `node:crypto` e [Endurecimento](security/hardening/).

- **Foco em Projeto Prático**:
  - Acompanhe a construção do [InvestApp](practice/investapp/) ou do [MonitorApp](practice/monitorapp/).

---

## Resumo do Guia

- **Stack Moderna**: Express 5, TypeScript, Zod, Prisma e Node.js 22+.
- **Código Real e Testável**: todos os trechos derivam de projetos executáveis em `examples/`.
- **Independência de Pacotes**: compreensão profunda dos fundamentos nativos do Node.js.
- **Progressão Cumulativa**: do `Hello World` até microsserviços seguros em produção.
