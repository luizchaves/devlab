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
title: "InvestApp: Autenticação"
description: "Oitava etapa do InvestApp: login com JWT, middleware isAuthenticated, investimentos filtrados por dono e sessão no front-end com localStorage."
---

<!-- _class: lead -->

# InvestApp: Autenticação

Oitava etapa do InvestApp: login com JWT, middleware isAuthenticated, investimentos filtrados por dono e sessão no front-end com localStorage.

---

## Objetivo

- Entender o papel de **InvestApp: Autenticação** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US09: Entrar no sistema · RF03, US10: Ver apenas a minha carteira · RF04, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK09.1 · Criar `src/utils/jwt.ts` e `src/middlewares/isAuthenticated.ts`, TK09.2 · Criar a rota `POST /api/signin` (Login e emissão do token), TK09.3 · Modificar `src/models/Investment.ts` (Consultas escopadas pelo dono)
- **O fluxo**
- **Investimentos por dono**
- **Executando**
- **Testando**

---

## Contexto da Aula

- Etapa 9 de 13 · Nível Avançado · TypeScript · Express.js · Prisma · JWT com `node:crypto`
- Esta etapa fecha o ciclo: o usuário faz login, recebe um token, e cada investimento passa a pertencer a quem o criou.
- Autenticação e Autorização: veja Autenticação JWT e Autorização e Proteção de Rotas

---

## Requisitos, histórias e critérios

- Épico EP02 · Identidade e Acesso › Feature FT05 · Login, sessão e isolamento por dono

---

## Requisitos, histórias e critérios: Tabela

- RF03 Autenticação & Sessão: login por e-mail e senha, com emissão de token JWT | atendido
- RF04 Isolamento por Dono: toda consulta de investimento escopada pelo dono do token | atendido

---

## US09 — Entrar no sistema · RF03

- Como investidor cadastrado,
- quero entrar com o meu e-mail e a minha senha,
- para retomar a sessão e acessar a aplicação.

---

## US09 — Entrar no sistema · RF03: Exemplo

```txt
Cenário: CA09.1 - Login com credenciais válidas
  Dado um usuário cadastrado com "maria@email.com" e a senha "senha123"
  Quando envio POST /api/signin com essas credenciais
  Então recebo o status 200
  E o corpo traz "auth" verdadeiro e um token
Cenário: CA09.2 - Credenciais inválidas não distinguem a causa
  Quando envio POST /api/signin com a senha errada
  Então recebo o status 401
  Mas quando envio POST /api/signin com um e-mail inexistente
  Então recebo o mesmo status 401 e a mesma mensagem
Cenário: CA09.3 - Rota privada exige token
  Quando envio GET /api/investments sem o cabeçalho Authorization
```

---

## US10 — Ver apenas a minha carteira · RF04

- Como investidor autenticado,
- quero que a aplicação me mostre e deixe alterar apenas os meus investimentos,
- para que a minha carteira não seja exposta a outras contas.

---

## US10 — Ver apenas a minha carteira · RF04: Exemplo

```txt
Cenário: CA10.1 - Cada conta vê o seu
  Dado que Maria e João estão cadastrados
  E que cada um criou um investimento
  Quando Maria lista os investimentos
  Então ela vê apenas o investimento dela
Cenário: CA10.2 - Leitura cruzada não é permitida
  Quando João consulta pelo id o investimento de Maria
  Então ele recebe o status 404
  E não 403, para não confirmar que o recurso existe
Cenário: CA10.3 - Escrita cruzada não é permitida
  Quando João tenta apagar o investimento de Maria
  Então ele recebe o status 404
```

---

## Tasks da etapa

- As tarefas abaixo implementam US09 e US10 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK09.1 · Criar `src/utils/jwt.ts` e `src/middlewares/isAuthenticated.ts`: Assinatura HS256 com `node:crypto` e o middleware que verifica o token.
- TK09.2 · Criar a rota `POST /api/signin`: Verificação das credenciais e emissão do token JWT.
- TK09.3 · Modificar `src/models/Investment.ts`: Consultas escopadas pelo `userId` do dono.
- TK09.4 · Modificar o front: Token em `localStorage` e cabeçalho `Authorization` na camada de API.

---

## Estrutura da aplicação

- Os arquivos novos se dividem entre as duas histórias da etapa.
- O `types/express.d.ts` é a ponte entre os dois: é ele que declara o `req.userId` que o middleware preenche e o model consome.

---

## O que muda nesta etapa

- A etapa acrescenta a camada de autenticação stateless por JWT (`src/utils/jwt.ts`), o middleware de proteção `isAuthenticated.ts`, o controller...
- As consultas a investimentos passam a ser escopadas estritamente pelo `userId` do investidor logado.

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK09.1 · Criar `src/utils/jwt.ts` e...

- Também aqui não entra dependência: um JWT é simples o bastante para ser escrito com `node:crypto`, e escrevê-lo é a melhor forma de entender o que ele...
- Um token é literalmente três pedaços separados por ponto:
- O `sign` da linha 39 é o coração: um HMAC-SHA256 sobre as duas primeiras partes, usando o `JWT_SECRET`.
- O `signJwt` da linha 44 monta o cabeçalho, acrescenta `iat` e `exp` ao payload e cola as três partes.
- A verificação, recolhida acima, faz três conferências em ordem: recalcula a assinatura e a compara com `timingSafeEqual`; confere que o cabeçalho...

---

## TK09.1 · Criar `src/utils/jwt.ts` e...: Exemplo

```txt
base64url(cabeçalho) . base64url(payload) . base64url(HMAC-SHA256(cabeçalho.payload, segredo))
```

---

## TK09.2 · Criar a rota `POST /api/signin` (Login e emissão do token)

- Este é o único ponto de toda a aplicação que ainda toca em senha, e três linhas resumem o login.
- A linha 12 busca o usuário por `readByEmailWithPassword`: a função que a etapa 8 criou justamente como exceção, a única que devolve o hash.
- A linha 16 é a comparação.
- O `verifyPassword` não desfaz o hash: lê os parâmetros de custo e o salt de dentro da própria string PHC, refaz o cálculo com a senha digitada e...
- Batendo, a linha 20 assina o token com `sub`, `name` e `email`. Nada além de identificação: nada que o servidor não possa reconferir depois.

---

## TK09.3 · Modificar `src/models/Investment.ts` (Consultas escopadas...

- Autenticar não basta: sem o filtro por dono, qualquer conta válida enxergaria a carteira de todo mundo. É essa a mudança do model.
- O `create` passa a exigir `userId` (linhas 20 e 22) e liga o investimento ao dono pelo `connect` da linha 33, no mesmo formato já usado para `category`.
- O `read` das linhas 41 a 49 é o coração do isolamento: o `userId` entra no objeto `filters` (linha 44) que vai para o `where` da consulta.
- O filtro acontece no banco, e não depois: filtrar em JavaScript sobre um resultado já completo seria mais lento e muito mais fácil de esquecer.
- O `readById` das linhas 51 a 60 cobre o outro caminho de vazamento.

---

## TK09.4 · Modificar o front (Sessão e token no cliente)

- O `signin.js` repete a forma do `signup.js` da etapa anterior, com uma diferença: o terceiro argumento `false` diz ao `API.create` para não enviar o...
- Faz sentido: quem está entrando ainda não tem token para enviar. Se a resposta trouxer `auth: true`, o `Auth.signin(token)` inicia a sessão.
- Toda a sessão do lado do cliente mora no `lib/auth.js`, e são quatro funções curtas: `signin` grava o token em `localStorage` sob a chave...
- Por fim, o `services/api.js` passa a anexar o token sozinho, e trata o caminho oposto: uma resposta `401` significa token expirado ou revogado, e o...
- O `create` está aberto e as outras três funções, recolhidas, porque as quatro repetem o mesmo par: montar o `Authorization` a partir de...

---

## TK09.5 · Proteger as rotas e expor `GET /api/users/me`

- O middleware da TK09.1 não protege nada sozinho: ele precisa ser registrado rota a rota.
- É essa a mudança mais espalhada da etapa: quatro roteadores passam a exigir o token, e um deles ganha uma rota nova.
- O padrão é sempre o mesmo, e a ordem importa: `isAuthenticated` vem antes do `validate`.
- Não faz sentido validar o corpo de uma requisição que nem deveria chegar ao controller, e devolver `400` antes de `401` entrega ao cliente anônimo...
- As rotas de categoria e de corretora recebem o mesmo tratamento: a carteira inteira passa a ser território de quem está autenticado.

---

## O fluxo

- O fluxo aparece como ponto central da aula, não apenas como item de índice.
- Oitava etapa do InvestApp: login com JWT, middleware isAuthenticated, investimentos filtrados por dono e sessão no front-end com localStorage.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Investimentos por dono

- O middleware sozinho não isola nada: ele só diz quem está chamando. O isolamento acontece quando esse `userId` entra na consulta.
- No roteador, o `isAuthenticated` passa a abrir a cadeia de todas as rotas do recurso, antes até da validação.
- E o controller repassa `req.userId` ao model em todas as operações: nunca lê o dono do corpo da requisição.
- Aceitar um `userId` enviado em `req.body` permitiria a qualquer conta autenticada criar e ler investimentos em nome de outra pessoa.
- O único lugar confiável é o payload do token, que foi assinado pelo servidor e verificado pelo `jwt.verify`.

---

## Executando

- Entre na pasta desta etapa e instale:
- Recrie o banco e popule as categorias:
- Suba o servidor:
- Crie uma conta em http://localhost:3000/signup.html e entre com ela em
- O seed carrega apenas as categorias. O usuário é criado pela própria tela de cadastro da etapa 8: ou pelo primeiro bloco do `requests.http`.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-auth
   npm install
   cp .env.example .env
```

---

## Executando: Exemplo 2

```bash
   npx prisma migrate dev
   npx prisma db seed
```

---

## Testando

- Nesta seção, testamos a autenticação via JWT e a proteção das rotas privadas no InvestApp.
- O login do usuário (`POST /api/signin`) valida as credenciais enviadas e retorna o token JWT assinado com status `200 OK`:
- { "email": "maria@email.com", "password": "senha123" }
- { "auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" }
- Requisições a rotas privadas (`GET /api/investments`) sem o cabeçalho `Authorization: Bearer ` são bloqueadas pelo middleware de autenticação com...

---

## Testando: Exemplo 1

```txt
  ### Efetuar login no InvestApp (Obter JWT)
  POST http://localhost:3000/api/signin
  Content-Type: application/json
  {
    "email": "maria@email.com",
    "password": "senha123"
  }
```

---

## Testando: Exemplo 2

```txt
  ### Tentativa de acesso sem token JWT
  GET http://localhost:3000/api/investments
```

---

## O diff que importa

- Aparecem o `src/middleware/auth.js`, a rota `POST /api/signin`, a sessão no front: e, o mais importante, o filtro por `userId` em todas as consultas de...
- Autenticar sem esse filtro deixaria a API aberta a qualquer pessoa que tivesse uma conta.
- O padrão da alteração é sempre o mesmo par: o middleware entra na rota, e o `userId` entra no filtro.
- Compare a leitura de investimentos nas duas etapas.
- Uma linha: a 44: é o que separa uma API multiusuário de um vazamento de dados.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-prismajs-user \
  examples/courses/expressjs/projects/invest-app-auth || true
```

---

## Conceitos abordados

- Verificação de senha em tempo constante, sem desfazer o hash
- JWT HS256 assinado e verificado com `node:crypto`, sem dependência externa
- Middleware de autenticação populando `req.userId`
- Filtro por dono aplicado na consulta, e não depois dela
- Sessão no front-end com `localStorage` e `401` derrubando o token

---

## Próxima etapa

- InvestApp: E-mail: confirmar por mensagem que a conta foi criada.

---

## Arquivos-Chave da Aula

- **src/utils/jwt.ts**: `examples/courses/expressjs/projects/invest-app-auth/src/utils/jwt.ts` (linhas marcadas `11,39-41,44-56`)
- **src/middlewares/isAuthenticated.ts**: `examples/courses/expressjs/projects/invest-app-auth/src/middlewares/isAuthenticated.ts` (linhas marcadas `7,10,14,17,22`)
- **src/types/express.d.ts**: `examples/courses/expressjs/projects/invest-app-auth/src/types/express.d.ts` (linhas marcadas `6`)
- **src/controllers/auth.controller.ts**: `examples/courses/expressjs/projects/invest-app-auth/src/controllers/auth.controller.ts` (linhas marcadas `12,16,20,26`)
- **src/models/Investment.ts**: `examples/courses/expressjs/projects/invest-app-auth/src/models/Investment.ts` (linhas marcadas `20-22,33,41-49,59`)
- **public/js/signin.js**: `examples/courses/expressjs/projects/invest-app-auth/public/js/signin.js` (linhas marcadas `13,16`)

---

## Resumo da Aula

- **InvestApp: Autenticação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
