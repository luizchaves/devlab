---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: Cadastro de usuário"
description: "Nona etapa do MonitorApp: entidade User, hash de senha com Argon2id usando apenas node:crypto, rota de cadastro e o formulário de signup ligado à API."
---

<!-- _class: lead -->

# MonitorApp: Cadastro de usuário

Nona etapa do MonitorApp: entidade User, hash de senha com Argon2id usando apenas node:crypto, rota de cadastro e o formulário de signup ligado à API.

---

## Objetivo

- Entender o papel de **MonitorApp: Cadastro de usuário** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/monitor-app-user`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US09 — Ter um inventário próprio · RF05, RNF02, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK09.1 · Acrescentar `User` ao schema e gerar a migration, TK09.2 · Criar `src/utils/password.ts` (Argon2id sem dependência), TK09.3 · Criar a rota `POST /api/users`
- **Testando**
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 9 de 13 · Nível Avançado · Argon2id · `node:crypto`
- O inventário do MonitorApp é global até aqui: qualquer pessoa que abra o front vê todos os hosts.
- As duas próximas etapas mudam isso: esta cria a conta, e a etapa 10 faz o inventário pertencer a ela.
- O tema central é o armazenamento de senha. A regra é simples de enunciar e fácil de errar: a senha nunca é gravada, nem criptografada.
- O que se guarda é o resultado de uma função de derivação que não tem volta.

---

## Requisitos, histórias e critérios

- Épico EP03 · Identidade e Acesso › Feature FT07 · Cadastro de conta

---

## Requisitos, histórias e critérios: Tabela

- RF05 Cadastro de Usuários: `POST /api/users` e a tela de signup | atendido
- RNF02 Criptografia & Segurança: hash Argon2id com salt por registro | parcial: falta a sessão

---

## US09 — Ter um inventário próprio · RF05, RNF02

- Como visitante,
- quero criar uma conta com nome, e-mail e senha,
- para ter um inventário de hosts que é só meu.

---

## US09 — Ter um inventário próprio · RF05, RNF02: Exemplo

```txt
Cenário: CA09.1 - Criar a conta
  Quando envio POST /api/users com nome, e-mail e senha válidos
  Então recebo o status 201
  E o corpo traz id, name e email
  E não traz a senha, nem em texto nem como hash
Cenário: CA09.2 - E-mail já cadastrado
  Dado um e-mail já usado por outra conta
  Quando envio POST /api/users com esse e-mail
  Então recebo o status 409
Cenário: CA09.3 - Confirmação de senha
  Quando envio password e confirmationPassword diferentes
  Então recebo o status 400
```

---

## Tasks da etapa

- TK09.1 · Acrescentar `User` ao schema e gerar a migration: a entidade e a chave estrangeira em `Host`.
- TK09.2 · Criar `src/utils/password.ts`: `hashPassword` e `verifyPassword` com `node:crypto`.
- TK09.3 · Criar a rota `POST /api/users`: model, schema, controller e roteador.
- TK09.4 · Ligar `signup.html` à API: `front/js/signup.js`.

---

## Estrutura da aplicação

- O `User` repete o mesmo conjunto de camadas das entidades da etapa 7: tipo, model, schema, controller e rota —, e acrescenta uma pasta que ainda não...
- É lá que mora o hash de senha, e é lá que o JWT da etapa 10 vai entrar.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Nona etapa do MonitorApp: entidade User, hash de senha com Argon2id usando apenas node:crypto, rota de cadastro e o formulário de signup ligado à API.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- três entidades: quatro: `User` entra
- nenhuma senha no sistema: hash Argon2id em `utils/password.ts`
- três recursos na API: quatro: `users` entra

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Nona etapa do MonitorApp: entidade User, hash de senha com Argon2id usando apenas node:crypto, rota de cadastro e o formulário de signup ligado à API.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK09.1 · Acrescentar `User` ao schema e gerar a migration

- O `model User` das linhas 11 a 18 tem quatro campos e uma relação.
- O `@unique` do `email` na linha 14 é o que faz a API responder `409`: a garantia está no banco, não em uma consulta prévia da aplicação, que teria uma...
- O `Host` ganha o par das linhas 26 e 27. Repare nas interrogações: `User?` e `String?`, ambos opcionais nesta etapa.
- É uma decisão de migração: os hosts que já existem no banco não têm dono, e uma coluna obrigatória quebraria a aplicação de imediato.
- A etapa 10 aperta essa regra com uma segunda migration, agora que já existirá um usuário para atribuir.

---

## TK09.1 · Acrescentar `User` ao schema e gerar a migration: Exemplo

```bash
npm run db:migrate
```

---

## TK09.2 · Criar `src/utils/password.ts` (Argon2id sem dependência)

- Nenhum `npm install`. O `node:crypto` expõe `argon2Sync` nativamente, e é ele que este arquivo embrulha.
- O bloco das linhas 14 a 23 são os parâmetros de custo, e cada um tem um papel:
- O `hashPassword` das linhas 33 a 47 gera um sal novo a cada chamada (linha 34).
- É por isso que duas contas com a mesma senha produzem hashes diferentes: e é o que inutiliza tabelas pré-computadas.
- O formato de saída merece atenção. A string devolvida não é só o hash: é o PHC string format, o mesmo que a biblioteca `argon2` produz.

---

## TK09.2 · Criar `src/utils/password.ts` (Argon2id sem dependência): Exemplo

```txt
$argon2id$v=19$m=65536,t=3,p=4$c2FsdGVzdGVzYWx0$aGFzaGVzdGVoYXNoZXN0ZWhhc2hlc3Rl
 └──┬───┘ └─┬─┘ └──────┬─────┘ └──────┬───────┘ └──────────────┬───────────────┘
 algoritmo versão   parâmetros        sal                     hash
```

---

## TK09.3 · Criar a rota `POST /api/users`

- O `User.ts` tem uma decisão em cada uma das primeiras vinte linhas.
- O `select` da linha 9 é a mais importante: ele lista os campos públicos e omite o hash.
- Como todas as leituras do model usam esse mesmo objeto, a senha nunca sai do banco por acidente: nenhuma rota precisa lembrar de apagá-la antes de...
- A linha 18 deriva o hash dentro do model, e não no controller.
- Assim qualquer origem que crie usuário: a rota, um seeder, um script de importação: passa obrigatoriamente por esse caminho.

---

## TK09.4 · Ligar `signup.html` à API

- O `signup.js` é curto e mostra o caminho de volta do erro de validação até a tela.
- A função `firstIssue` lê a lista `issues` que o `errorHandler` da etapa 4 produz e devolve a primeira mensagem: o suficiente para orientar quem está...
- Concluído o cadastro, a linha final leva para `signin.html`. É onde a etapa 10 continua.
- A tela ganha os três ganchos que esse script procura: o `id="signup-form"` na linha 21, o botão que passa de `type="button"` para `type="submit"` na...
- O `User.d.ts` guarda a distinção que sustenta a etapa.

---

## Testando

- Nesta seção, testamos a rota de cadastro de usuários com hash Argon2id no MonitorApp.
- O cadastro com confirmação de senha idêntica e e-mail inédito cria o registro no banco com hash seguro e retorna o usuário sem a senha com status `201...
- { "name": "Ana Souza", "email": "ana@exemplo.com", "password": "senha-secreta", "confirmationPassword": "senha-secreta" }
- { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "name": "Ana Souza", "email": "ana@exemplo.com" }
- { "name": "Ana Souza", "email": "outra@exemplo.com", "password": "senha-secreta", "confirmationPassword": "senha-errada" }

---

## Testando: Exemplo

```txt
  ### Cadastrar novo usuário no MonitorApp
  POST http://localhost:3000/api/users
  Content-Type: application/json
  {
    "name": "Ana Souza",
    "email": "ana@exemplo.com",
    "password": "senha-secreta",
    "confirmationPassword": "senha-secreta"
  }
```

---

## Executando

- Aplique a migration e suba a API:
- Suba o front e abra `signup.html`:
- Confira o hash gravado:
- Crie duas contas com a mesma senha e compare os dois valores da coluna `password`. Eles são diferentes, e é o sal que faz isso.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/monitor-app-user/back
   npm install
   npm run db:migrate
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/express/projects/monitor-app-user/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- Argon2id nativo em `node:crypto`, sem dependência externa
- PHC string format: parâmetros e sal viajam junto do hash
- Sal por registro e o que ele inutiliza
- Regra entre dois campos com `.refine()` e `path`
- Migration que evolui um banco existente

---

## Próxima etapa

- MonitorApp: Autenticação: login, JWT nativo e o inventário isolado por dono.

---

## Arquivos-Chave da Aula

- **back/prisma/schema.prisma**: `examples/courses/express/projects/monitor-app-user/back/prisma/schema.prisma` (linhas marcadas `11-18,26-27`)
- **back/src/utils/password.ts**: `examples/courses/express/projects/monitor-app-user/back/src/utils/password.ts` (linhas marcadas `33-47,75`)
- **back/src/models/User.ts**: `examples/courses/express/projects/monitor-app-user/back/src/models/User.ts` (linhas marcadas `9,18`)
- **back/src/schemas/user.schema.ts**: `examples/courses/express/projects/monitor-app-user/back/src/schemas/user.schema.ts` (linhas marcadas `11-17`)
- **back/src/controllers/users.controller.ts**: `examples/courses/express/projects/monitor-app-user/back/src/controllers/users.controller.ts` (linhas marcadas `8-10,17-19`)
- **back/src/routes/users.routes.ts**: `examples/courses/express/projects/monitor-app-user/back/src/routes/users.routes.ts` (linhas marcadas `10-11`)

---

## Resumo da Aula

- **MonitorApp: Cadastro de usuário** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
