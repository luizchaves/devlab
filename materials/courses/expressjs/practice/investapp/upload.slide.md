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
title: "InvestApp: Upload de avatar"
description: "Décima etapa do InvestApp: upload de arquivo com multer para criar e atualizar o avatar do usuário autenticado."
---

<!-- _class: lead -->

# InvestApp: Upload de avatar

Décima etapa do InvestApp: upload de arquivo com multer para criar e atualizar o avatar do usuário autenticado.

---

## Objetivo

- Entender o papel de **InvestApp: Upload de avatar** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-upload`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US12 — Personalizar o perfil · RF06, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK11.1 · Instalar Multer e criar `src/config/multer.ts` (Configuração do upload), TK11.2 · Criar as rotas `POST` e `PUT /api/users/image`, TK11.3 · Criar `src/models/Image.ts` e ligar a imagem ao usuário
- **Executando**
- **Testando**
- **O diff que importa**
- **Conceitos abordados**

---

## Contexto da Aula

- Etapa 11 de 13 · Nível Avançado · TypeScript · Express.js · Multer · Multipart
- O perfil do usuário passa a ter avatar.
- Essa mudança força a API a receber `multipart/form-data`, validar tipo e tamanho do arquivo, gravar a imagem em disco e salvar o caminho associado ao...
- Manipulação de Mídia: veja Upload de Arquivos com Multer

---

## Requisitos, histórias e critérios

- Épico EP03 · Perfil e Notificações › Feature FT08 · Avatar do perfil

---

## Requisitos, histórias e critérios: Tabela

- RF06 Gestão de Perfil & Avatar: upload de imagem, associado ao usuário autenticado | atendido

---

## US12 — Personalizar o perfil · RF06

- Como investidor,
- quero enviar uma foto de perfil,
- para reconhecer a minha conta de relance.

---

## US12 — Personalizar o perfil · RF06: Exemplo

```txt
Cenário: CA12.1 - Upload exige autenticação
  Quando envio POST /api/users/image sem token
  Então recebo o status 401
Cenário: CA12.2 - Envio válido
  Dado que estou autenticado
  Quando envio uma imagem PNG de até 2 MB no campo "image"
  Então recebo o status 201
  E o corpo traz o caminho público da imagem
Cenário: CA12.3 - A imagem é servida
  Dado um avatar enviado
  Quando acesso o caminho devolvido pela API
  Então a imagem é exibida
```

---

## Tasks da etapa

- As tarefas abaixo implementam US12 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK11.1 · Instalar Multer e criar `src/config/multer.ts`: Destino, nome, limite de tamanho e filtro de tipo.
- TK11.2 · Criar as rotas `POST` e `PUT /api/users/image`: A cadeia com `multer(...).single('image')`.
- TK11.3 · Criar `src/models/Image.ts`: Persistência do caminho da imagem, ligada ao usuário.
- TK11.4 · Modificar `public/js/profile.js`: Envio de arquivo multipart através de `FormData` no front-end.

---

## Estrutura da aplicação

- O upload atravessa três camadas novas e uma pasta que não é código.
- O `config/multer.ts` define onde e como o arquivo é gravado, o `controllers/images.controller.ts` traduz o resultado em resposta HTTP, e o...

---

## O que muda nesta etapa?

- Até a etapa de e-mail, todas as rotas recebiam JSON.
- O upload cria uma exceção explícita: o corpo é `FormData`, o campo do arquivo se chama `image`, e o middleware do `multer` roda antes do handler na...
- Três middlewares em fila: autenticar, receber o arquivo multipart, e então executar o handler.

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK11.1 · Instalar Multer e criar `src/config/multer.ts`...

- A configuração responde a três perguntas, e cada uma é uma decisão de segurança.
- Onde gravar: a linha 7 resolve `public/imgs/profile` como destino, devolvido pelo `destination` da linha 12.
- É uma pasta dentro de `public/`, servida por `express.static`: por isso o caminho gravado no banco pode ir direto para o `src` de uma tag ``.
- Com que nome: o `filename` das linhas 13 a 17 é o trecho mais importante do arquivo.
- Ele prefixa o nome original com 16 bytes aleatórios em hexadecimal (linha 16), o que resolve dois problemas de uma vez: dois usuários que enviem...

---

## TK11.1 · Instalar Multer e criar `src/config/multer.ts`...: Exemplo

```bash
npm install multer
npm install -D @types/multer
```

---

## TK11.2 · Criar as rotas `POST` e `PUT /api/users/image`

- São duas rotas quase idênticas, e a cadeia de middlewares delas conta a história inteira.
- A linha 12 monta o middleware uma vez: `multer(uploadConfig).single('image')`.
- O `single` significa um arquivo, e `'image'` é o nome do campo do formulário: se o front enviar com outro nome, o Multer o ignora.
- Nas linhas 14 e 15, a ordem é `isAuthenticated`, depois `upload`, depois o controller.
- O arquivo pertence a quem está logado, e é o token que diz quem é.

---

## TK11.3 · Criar `src/models/Image.ts` e ligar a imagem ao usuário

- O que o banco guarda não é a imagem: é o caminho dela. O arquivo binário fica no disco, e a tabela `Image` fica com uma string.
- No schema, o `model Image` traz o detalhe que define o comportamento: o `userId` da linha 46 é `@unique`.
- Isso transforma a relação em um-para-um: cada usuário tem no máximo um avatar.
- O model tem só duas funções. O `create` da linha 8 grava o caminho e liga a imagem ao dono com o `connect` já conhecido.
- O `update` da linha 16 é o que se apoia no `@unique`: o `where: { userId }` da linha 17 encontra a imagem pelo dono, sem precisar saber o id dela.

---

## TK11.4 · Modificar `public/js/profile.js` (Submissão via...

- O front resolve, sozinho, a pergunta que separa `POST` de `PUT`.
- No `loadProfile` das linhas 10 a 36, a verificação `if (user.image)` da linha 15 define a variável `formMethod`: quem já tem avatar vai atualizar...
- A mesma verificação escolhe entre o caminho salvo e o `avatar.png` padrão da linha 20.
- No envio, a linha 41 é a mudança conceitual da etapa: `new FormData(form)` é passado inteiro para a API, sem `JSON.stringify`.
- As linhas 45 a 49 despacham para `API.create` ou `API.update` conforme o `formMethod`, e as linhas 51 e 53 trocam a imagem exibida pelo caminho que a...

---

## TK11.5 · Espalhar o avatar pelo resto da aplicação

- O upload não termina no `profile.html`.
- Três arquivos fora da tela de perfil mudam para que a imagem enviada apareça e para que uma falha de envio não vire erro 500.
- O tipo é o primeiro. A linha 15 acrescenta `image` ao `PublicUser`, e o tipo é `{ path: string }
- obriga o front a tratar a ausência em vez de assumir que sempre existe imagem.
- No cabeçalho, o `loadUser` do `home.js` ganha uma linha.

---

## Executando

- Entre no exemplo desta etapa:
- Configure o ambiente e o tipo de storage:
- Suba a API e abra o perfil:
- Use `http://localhost:3000/profile.html` depois de fazer login.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-upload
   npm install
```

---

## Executando: Exemplo 2

```bash
   cp .env.example .env
```

---

## Testando

- Nesta seção, testamos a rota de upload do avatar do perfil com Multer (`POST /api/users/image`).
- O envio de uma foto de perfil válida através de um formulário `multipart/form-data` grava o arquivo no diretório público, atualiza a imagem vinculada...
- { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "path": "/imgs/profile/9948180954ee1846a214c710ada7a2a5-avatar.png", "userId":...
- O teste manual deve cobrir três casos: imagem válida, arquivo maior que 2 MB e arquivo com MIME type fora de `image/jpeg`, `image/png` ou `image/gif`.

---

## Testando: Exemplo

```txt
  ### Testar upload de avatar com multipart/form-data
  POST http://localhost:3000/api/users/image
  Authorization: Bearer {{token}}
  Content-Type: multipart/form-data; boundary=Boundary
  --Boundary
  Content-Disposition: form-data; name="image"; filename="avatar.png"
  Content-Type: image/png
  < ./avatar.png
  --Boundary--
```

---

## O diff que importa

- Compare esta etapa com a anterior nos pontos que recebem arquivo:
- O diff relevante é curto e tem quatro entradas: o `src/config/multer.js`, o `model Image` no schema com o `src/models/Image.js`, as duas rotas de...
- O `multer` não deve aparecer em nenhum outro arquivo: se aparecer, a configuração vazou da camada que deveria contê-la.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-email \
  examples/courses/expressjs/projects/invest-app-upload || true
```

---

## Conceitos abordados

- Upload com `multer`
- Nome de arquivo gerado pelo servidor
- Limite de tamanho e filtro por MIME type
- Associação de avatar ao usuário autenticado
- A aula correspondente é Upload de Arquivo.

---

## Próxima etapa

- InvestApp: Testes de software: automatizar unidade, rotas, front e fluxo E2E.

---

## Arquivos-Chave da Aula

- **A cadeia de middlewares da rota de upload**: `examples/courses/expressjs/projects/invest-app-upload/src/routes/images.routes.ts` (linhas marcadas `14`)
- **src/config/multer.ts**: `examples/courses/expressjs/projects/invest-app-upload/src/config/multer.ts` (linhas marcadas `13-17,24-26,27-35`)
- **src/routes/images.routes.ts**: `examples/courses/expressjs/projects/invest-app-upload/src/routes/images.routes.ts` (linhas marcadas `12,14,15`)
- **src/controllers/images.controller.ts**: `examples/courses/expressjs/projects/invest-app-upload/src/controllers/images.controller.ts` (linhas marcadas `7-11,18,30`)
- **prisma/schema.prisma**: `examples/courses/expressjs/projects/invest-app-upload/prisma/schema.prisma` (linhas marcadas `46`)
- **src/models/Image.ts**: `examples/courses/expressjs/projects/invest-app-upload/src/models/Image.ts` (linhas marcadas `10,17`)

---

## Resumo da Aula

- **InvestApp: Upload de avatar** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
