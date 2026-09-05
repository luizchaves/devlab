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
title: "Projeto: Express Auth"
description: "Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id — tudo usando apenas node:crypto."
---

<!-- _class: lead -->

# Projeto: Express Auth

Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id — tudo usando apenas node:crypto.

---

## Objetivo

- Entender o papel de **Projeto: Express Auth** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Estrutura**
- **As duas peças criptográficas**
- **Código**
- **Executando**
- **Rotas**
- **Exemplo**
- **Conceitos abordados**
- **Próximo projeto**

---

## Contexto da Aula

- Nível Avançado · Node.js · Express.js · TypeScript · `node:crypto`
- Cadastro, login e rotas protegidas sem `bcrypt` e sem `jsonwebtoken`: hash de senha com Argon2id e assinatura de JWT com HMAC-SHA256, ambos do módulo...

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id: tudo usando apenas node:crypto.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## As duas peças criptográficas

- O hash de senha usa `argon2Sync` e devolve o resultado no formato PHC: parâmetros e sal viajam junto do hash:
- A assinatura do token é um HMAC-SHA256 sobre `header.payload`:

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id: tudo usando apenas node:crypto.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- Entre no projeto:
- Instale as dependências:
- Crie o `.env` a partir do exemplo:
- Suba o servidor:
- Rode os testes das funções criptográficas:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/auth
```

---

## Executando: Exemplo 2

```bash
   cp .env.example .env
```

---

## Rotas

- Rotas aparece como ponto central da aula, não apenas como item de índice.
- Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id: tudo usando apenas node:crypto.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Rotas: Tabela

- POST: `/auth/signup` | pública | `201` | `409`, `422`
- POST: `/auth/signin` | pública | `200` | `401`
- GET: `/auth/me` | token | `200` | `401`
- GET: `/investments` | token (só os do dono) | `200` | `401`
- POST: `/investments` | token | `201` | `401`, `422`
- DELETE: `/investments/:id` | token + posse | `204` | `401`, `404`

---

## Exemplo

- Nesta seção, testamos os fluxos de autenticação por JWT e os controles de autorização por posse de recurso.
- O login devolve o token que autoriza as demais chamadas com status `200 OK`:
- { "email": "ana@example.com", "password": "senha-secreta" }
- { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTAyIiwibmFtZSI6IkFuYSJ9.qk3Xr6…" }
- Sem o cabeçalho Authorization, a rota protegida recusa o acesso antes de qualquer consulta no banco, retornando status `401 Unauthorized`:

---

## Exemplo: Exemplo 1

```txt
  ### Efetuar login e obter JWT
  POST http://localhost:3000/auth/signin
  Content-Type: application/json
  {
    "email": "ana@example.com",
    "password": "senha-secreta"
  }
```

---

## Exemplo: Exemplo 2

```txt
  ### Tentativa de acesso a rota protegida sem token JWT
  GET http://localhost:3000/investments
```

---

## Conceitos abordados

- Hash de senha com Argon2id e formato PHC, sem dependências
- Comparação em tempo constante com `timingSafeEqual`
- Assinatura e verificação de JWT HS256 com `createHmac`
- Middleware de autenticação (`401`) separado do de autorização (`403`/`404`)
- Autorização por posse do recurso e por papel

---

## Próximo projeto

- InvestApp: a mesma trilha aplicada a uma aplicação completa, etapa por etapa.

---

## Arquivos-Chave da Aula

- **src/utils/password.ts**: `examples/courses/expressjs/projects/auth/src/utils/password.ts`
- **src/utils/jwt.ts**: `examples/courses/expressjs/projects/auth/src/utils/jwt.ts`

---

## Resumo da Aula

- **Projeto: Express Auth** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
