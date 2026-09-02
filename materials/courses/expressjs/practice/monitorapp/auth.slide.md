---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: Autenticação"
description: "Décima etapa do MonitorApp: login com credenciais, JWT HS256 assinado com node:crypto, middleware de autorização e o inventário de hosts isolado por dono."
---

<!-- _class: lead -->

# MonitorApp: Autenticação

Décima etapa do MonitorApp: login com credenciais, JWT HS256 assinado com node:crypto, middleware de autorização e o inventário de hosts isolado por dono.

---

## Objetivo

- Entender o papel de **MonitorApp: Autenticação** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US10: Entrar no sistema · RF06, US11: Ver apenas os meus hosts · RF07, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK10.1 · Criar `src/utils/jwt.ts` (O token, sem biblioteca), TK10.2 · Criar `src/middlewares/isAuthenticated.ts`, TK10.3 · Criar a rota `POST /api/signin`
- **Testando**
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 10 de 13 · Nível Avançado · JWT HS256 · Autorização por dono
- A etapa 9 criou contas que ainda não servem para nada: o inventário continua global.
- Esta etapa fecha o ciclo com duas histórias que caminham juntas: entrar no sistema e ver apenas o que é seu.
- São dois problemas diferentes, e vale nomeá-los: *autenticação* é descobrir quem está chamando; *autorização* é decidir o que essa pessoa pode ver.
- O primeiro é resolvido por um token; o segundo, por um `WHERE`.

---

## Requisitos, histórias e critérios

- Épico EP03 · Identidade e Acesso › Feature FT08 · Login, sessão e isolamento

---

## Requisitos, histórias e critérios: Tabela

- RF06 Autenticação & Sessão: `POST /api/signin` e o token JWT | atendido
- RF07 Isolamento por Dono: `userId` em toda consulta de host | atendido
- RNF02 Criptografia & Segurança: assinatura HS256 com `node:crypto` | atendido

---

## US10 — Entrar no sistema · RF06

- Como usuário cadastrado,
- quero entrar com e-mail e senha e permanecer autenticado,
- para usar a aplicação sem me identificar a cada requisição.

---

## US10 — Entrar no sistema · RF06: Exemplo

```txt
Cenário: CA10.1 - Login com credenciais válidas
  Quando envio POST /api/signin com e-mail e senha corretos
  Então recebo o status 200
  E o corpo traz auth verdadeiro e um token
Cenário: CA10.2 - Credenciais inválidas
  Quando envio um e-mail que não existe
  Então recebo 401 com a mensagem "Invalid credentials"
  E quando envio a senha errada de um e-mail existente
  Então recebo exatamente a mesma resposta
Cenário: CA10.3 - Requisição sem token
  Quando envio GET /api/hosts sem o cabeçalho Authorization
  Então recebo o status 401
```

---

## US11 — Ver apenas os meus hosts · RF07

- Como usuário autenticado,
- quero que o sistema me mostre somente os hosts que eu cadastrei,
- para ter certeza de que o meu inventário não vaza para outra conta.

---

## US11 — Ver apenas os meus hosts · RF07: Exemplo

```txt
Cenário: CA11.1 - A lista é do dono
  Dadas duas contas com hosts cadastrados
  Quando a conta A envia GET /api/hosts
  Então recebe apenas os hosts que ela cadastrou
Cenário: CA11.2 - Host de outra conta
  Quando a conta A envia GET /api/hosts/{id} com o id de um host da conta B
  Então recebe o status 404
  E não 403
Cenário: CA11.3 - Histórico de outra conta
  Quando a conta A envia GET /api/hosts/{id}/pings com o id de um host da conta B
  Então recebe o status 404
```

---

## Tasks da etapa

- TK10.1 · Criar `src/utils/jwt.ts`: `signJwt` e `verifyJwt` com HMAC-SHA256.
- TK10.2 · Criar `src/middlewares/isAuthenticated.ts`: extrai o token e preenche `req.userId`.
- TK10.3 · Criar a rota `POST /api/signin`: controller, schema e roteador.
- TK10.4 · Escopar as consultas por `userId`: o model e os controllers de host e de ping.
- TK10.5 · Ligar o front: `lib/auth.js`, o `Bearer` em `api.js` e a tela de login.

---

## Estrutura da aplicação

- Os arquivos novos se dividem entre as duas histórias da etapa.
- O `types/express.d.ts` é a ponte entre os dois: é ele que declara o `req.userId` que o middleware preenche e o model consome.
- O diagrama mostra os dois passos na ordem em que acontecem dentro de uma requisição.
- Repare que eles não são intercambiáveis: o primeiro pode recusar a requisição inteira com `401`, e o segundo nunca recusa: ele apenas estreita o...
- É por isso que um host de outra conta responde `404`, e não `403`: quando a requisição chega ao model, ela já é legítima.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Décima etapa do MonitorApp: login com credenciais, JWT HS256 assinado com node:crypto, middleware de autorização e o inventário de hosts isolado por dono.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- todas as rotas públicas: só `POST /api/users` e `POST /api/signin` continuam públicas
- front sem sessão: token no `localStorage`, `Bearer` em toda chamada
- —: `req.userId` disponível em qualquer rota protegida

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Décima etapa do MonitorApp: login com credenciais, JWT HS256 assinado com node:crypto, middleware de autorização e o inventário de hosts isolado por dono.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK10.1 · Criar `src/utils/jwt.ts` (O token, sem biblioteca)

- Nenhuma dependência: `node:crypto` já tem tudo. Um JWT é mais simples do que costuma parecer: três partes em Base64URL separadas por ponto:
- O `sign` da linha 37 é a função que sustenta tudo: um HMAC-SHA256 do texto `header.payload` com o segredo do servidor.
- O `signJwt` das linhas 42 a 55 monta as duas primeiras partes, acrescenta `iat` e `exp`, e concatena com a assinatura.
- O `verifyJwt` das linhas 57 a 85 faz o caminho inverso, e a ordem das checagens é deliberada: primeiro a assinatura (linha 68), depois o cabeçalho,...
- Verificar a validade do conteúdo antes de conferir a assinatura seria confiar em dados que ainda não se sabe se foram adulterados.

---

## TK10.1 · Criar `src/utils/jwt.ts` (O token, sem biblioteca): Exemplo

```txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YjFkZWI0ZCIsImV4cCI6MTc3Mn0.Xr2mQ...
└──────────────┬──────────────────┘ └──────────────┬───────────────────────┘ └──┬──┘
        header (alg, typ)                  payload (sub, iat, exp)          assinatura
```

---

## TK10.2 · Criar `src/middlewares/isAuthenticated.ts`

- Vinte e três linhas que fazem três coisas.
- A linha 7 extrai o token do cabeçalho `Authorization: Bearer ` com uma desestruturação que descarta a primeira parte. A linha 14 verifica.
- E a linha 17 grava o `sub` em `req.userId`.
- Essa última linha é o ponto do arquivo: a partir daqui, qualquer rota sabe quem está chamando sem reler o cabeçalho nem repetir a verificação.
- Os controllers das próximas tarefas só leem `req.userId`.

---

## TK10.3 · Criar a rota `POST /api/signin`

- O controller é curto, e cada linha carrega uma decisão de segurança.
- A linha 12 usa a única função do model que devolve o hash: `readByEmailWithPassword`, escrita na etapa 9 exatamente para este consumidor.
- A linha 16 chama `verifyPassword`, que não desfaz o hash: refaz o cálculo com os parâmetros gravados e compara em tempo constante.
- O `catch` da linha 23 é o detalhe mais importante do arquivo.
- Ele engloba os dois caminhos de falha: e-mail inexistente e senha errada: e responde a mesma coisa.

---

## TK10.4 · Escopar as consultas por `userId`

- Aqui a autenticação vira autorização. A mudança é pequena em número de linhas e grande em consequência.
- No schema, o `userId` deixa de ser opcional, e a migration `20260303000000_host_owner` faz a transição.
- No model, o parâmetro `where` do `read` (linha 38) deixou de ser opcional: não existe mais uma forma de listar hosts sem dizer de quem.
- A linha 40 escreve `userId` como o primeiro filtro, antes dos opcionais.
- O `readById` da linha 49 traz a mudança mais sutil de toda a etapa: `findFirst` no lugar de `findUnique`.

---

## TK10.5 · Ligar o front (sessão no navegador)

- O `lib/auth.js` concentra tudo que o front sabe sobre sessão: onde o token mora, como se entra e como se sai.
- O `isAuthenticated` da linha 4 é a porta das páginas privadas: sem token, ele redireciona para o login antes de qualquer `fetch`.
- O `services/api.js` foi reorganizado em torno de duas funções auxiliares.
- O `headers` da linha 9 monta os cabeçalhos em um lugar só: é a promessa que a etapa 2 fez, quando disse que acrescentar `Authorization` mexeria em um...
- O `handleUnauthorized` da linha 17 trata o `401` como fim de sessão: token expirado derruba o usuário para a tela de login, em vez de deixar a tela...

---

## TK10.6 · Proteger as rotas e dar um dono aos dados iniciais

- O `isAuthenticated` da TK10.2 precisa ser registrado rota a rota, e é a mudança mais espalhada da etapa.
- As três famílias de rota recebem o mesmo tratamento, sempre antes do `validate`: não faz sentido validar o corpo de uma requisição que nem deveria...
- O roteador de autenticação é o único que fica de fora da proteção: é a porta de entrada de quem ainda não tem token.
- E o `auth.schema.ts` valida só e-mail e senha, sem `minlength`: conferir o tamanho da senha no login apenas diria ao atacante quando ele acertou o formato.
- O `Host.d.ts` acompanha, com o `userId` obrigatório na linha 9 e o opcional na 19: o comentário ali registra a regra que a TK10.4 impõe: o dono vem do...

---

## Testando

- Nesta seção, testamos a autenticação por token JWT e o controle de acesso ao inventário de hosts no MonitorApp.
- O login (`POST /api/signin`) valida o e-mail e a senha do usuário, devolvendo o token assinado e status `200 OK`:
- { "email": "ana@exemplo.com", "password": "senha-secreta" }
- { "auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YjFkZWI0ZCJ9.Xr2..." }
- Qualquer tentativa de consultar os hosts (`GET /api/hosts`) sem fornecer o token no cabeçalho `Authorization` é rejeitada pelo middleware com status...

---

## Testando: Exemplo 1

```txt
  ### Efetuar login no MonitorApp (Obter JWT)
  POST http://localhost:3000/api/signin
  Content-Type: application/json
  {
    "email": "ana@exemplo.com",
    "password": "senha-secreta"
  }
```

---

## Testando: Exemplo 2

```txt
  ### Tentativa de acesso sem token JWT
  GET http://localhost:3000/api/hosts
```

---

## Executando

- Aplique a migration, semeie e suba a API:
- O seed cria a conta `ana@exemplo.com` com a senha `senha-secreta` e os hosts pertencentes a ela.
- Suba o front:
- Abra http://localhost:5173. Sem token, você é levado direto para o login.
- Crie uma segunda conta em `signup.html`, entre com ela e confirme: o inventário está vazio,

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-auth/back
   npm install
   cp .env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-auth/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- JWT HS256 assinado e verificado com `node:crypto`
- Codificação Base64URL não é criptografia
- Middleware que preenche `req.userId` para as camadas seguintes
- *Declaration merging* para ampliar o `Request` do Express
- Resposta única para credenciais inválidas

---

## Próxima etapa

- MonitorApp: Tempo real: o painel deixa de ser uma fotografia e passa a se atualizar sozinho.

---

## Arquivos-Chave da Aula

- **back/src/utils/jwt.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/utils/jwt.ts` (linhas marcadas `37-39,57-72`)
- **back/src/middlewares/isAuthenticated.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/middlewares/isAuthenticated.ts` (linhas marcadas `7,14-19`)
- **back/src/types/express.d.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/types/express.d.ts`
- **back/src/controllers/auth.controller.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/controllers/auth.controller.ts` (linhas marcadas `12-20,23-27`)
- **back/src/models/Host.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/models/Host.ts` (linhas marcadas `38-47,49-58`)
- **back/src/controllers/hosts.controller.ts**: `examples/courses/expressjs/projects/monitor-app-auth/back/src/controllers/hosts.controller.ts` (linhas marcadas `7-19,33-45`)

---

## Resumo da Aula

- **MonitorApp: Autenticação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
