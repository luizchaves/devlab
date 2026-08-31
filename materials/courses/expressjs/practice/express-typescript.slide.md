---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express TypeScript"
description: "API de usuários em TypeScript executada nativamente pelo Node, com camadas, tipos do domínio e erros centralizados."
---

<!-- _class: lead -->

# Projeto: Express TypeScript

API de usuários em TypeScript executada nativamente pelo Node, com camadas, tipos do domínio e erros centralizados.

---

## Objetivo

- Entender o papel de **Projeto: Express TypeScript** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/typescript`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Estrutura**
- **Configuração**
- **Código**
- **Executando**
- **Rotas**
- **Exemplo**
- **Conceitos abordados**
- **Próximo projeto**

---

## Contexto da Aula

- Nível Intermediário · Node.js · Express.js · TypeScript
- O mesmo CRUD do projeto MVC, migrado para TypeScript: sem passo de build, sem `tsx` e sem bundler.

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- API de usuários em TypeScript executada nativamente pelo Node, com camadas, tipos do domínio e erros centralizados.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Configuração

- O `tsconfig.json` é ajustado para o Node executar `.ts` diretamente: `noEmit`, extensão `.ts` nos imports e recusa de sintaxe não apagável:
- O alias `#` é declarado no `package.json`, e não no `tsconfig.json`: assim o Node também o entende, sem loader nem bundler.

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- API de usuários em TypeScript executada nativamente pelo Node, com camadas, tipos do domínio e erros centralizados.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- Entre no projeto:
- Instale as dependências:
- Suba o servidor em modo watch:
- Verifique os tipos: é o `tsc` que faz isso, não o Node:

---

## Executando: Exemplo

```bash
   cd examples/courses/express/projects/typescript
```

---

## Rotas

- Rotas aparece como ponto central da aula, não apenas como item de índice.
- API de usuários em TypeScript executada nativamente pelo Node, com camadas, tipos do domínio e erros centralizados.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Rotas: Tabela

- GET: `/users` |: | `200` | —
- GET: `/users/:id` |: | `200` | `400`, `404`
- POST: `/users` | `{ name, email }` | `201` | `400`, `409`, `415`
- PUT: `/users/:id` | `{ name, email }` | `200` | `400`, `404`, `415`
- DELETE: `/users/:id` |: | `204` | `400`, `404`

---

## Exemplo

- Nesta seção, testamos o comportamento do servidor TypeScript com verificação de tipo de mídia (`requireJson`) e respostas de erro estruturadas.
- O middleware `requireJson` intercepta requisições `POST` sem o cabeçalho `Content-Type: application/json` antes de chegar ao controller, rejeitando-as...
- { "error": { "status": 415, "message": "Content-Type precisa ser application/json" } }
- Ao tentar cadastrar um usuário com e-mail já existente no banco (`ana@example.com`), o model lança um `HttpError` de conflito, retornando status `409...
- { "name": "Ana de novo", "email": "ana@example.com" }

---

## Exemplo: Exemplo 1

```txt
  ### Testar erro de Content-Type incompativel (415)
  POST http://localhost:3000/users
  Content-Type: text/plain
  "corpo em texto puro"
```

---

## Exemplo: Exemplo 2

```txt
  ### Testar conflito de e-mail duplicado (409)
  POST http://localhost:3000/users
  Content-Type: application/json
  {
    "name": "Ana de novo",
    "email": "ana@example.com"
  }
```

---

## Conceitos abordados

- Execução nativa de `.ts` pelo Node (*type stripping*)
- *Subpath imports* (`#`) declarados no `package.json`
- Tipagem de `Request`, `Response` e `NextFunction`
- Separação entre o tipo que entra (`UserInput`) e o que sai (`User`)
- As aulas correspondentes são TypeScript no Express e MVC.

---

## Próximo projeto

- Express + Prisma: trocando a memória por um banco de dados.

---

## Arquivos-Chave da Aula

- **tsconfig.json**: `examples/courses/express/projects/typescript/tsconfig.json` (linhas marcadas `4,10-13`)
- **package.json**: `examples/courses/express/projects/typescript/package.json` (linhas marcadas `7-14`)

---

## Resumo da Aula

- **Projeto: Express TypeScript** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
