# Product Requirements Document (PRD) — InvestApp

Documento completo de especificação de requisitos de produto e engenharia do **InvestApp**, estruturado em cinco épicos, quatorze features, quinze histórias de usuário, mais de oitenta critérios de aceitação e a relação exaustiva de todas as tasks técnicas das treze etapas.

---

## 1. Visão Geral e Objetivos do Produto

O **InvestApp** é uma plataforma web para gestão visual e acompanhamento de carteiras de investimentos pessoais. A aplicação permite que o investidor registre aportes, classifique ativos por categorias e corretoras, monitore rendimentos e personalize seu perfil de usuário.

### Público-Alvo e Personas
- **Investidores Pessoais**: Usuários que buscam uma interface limpa, intuitiva e sem complexidade para gerenciar seus investimentos e patrimônio.
- **Pessoas Desenvolvedoras e Mantenedoras**: Equipe que constrói a aplicação de forma incremental e modular (do protótipo estático ao backend robusto com banco relacional e autenticação).
- **Operação e DevOps**: Responsáveis pelo deploy conteinerizado, isolamento de dados e testes automatizados.

---

## 2. Arquitetura e Stack Tecnológica

- **Front-end**: HTML semântico, Tailwind CSS (via CDN e CLI), JavaScript vanilla estruturado em módulos e serviços de API.
- **Runtime & Back-end**: Node.js 22+, Express 5, TypeScript estrito com arquitetura em camadas (Rotas, Controllers, Models, Middlewares e Services).
- **Validação de Fronteira**: Zod para validação tipada de `body`, `query`, `params`, `headers` e `cookies`.
- **Documentação de API**: OpenAPI 3.0 e Swagger UI (`/api/docs` e `/api/openapi.json`).
- **Persistência de Dados**:
  - Em memória (etapas 1 e 2).
  - SQLite via driver nativo com consultas parametrizadas (etapa 6).
  - Prisma ORM com schema declarativo, migrações versionadas e relacionamentos `Category` / `Broker` / `User` (etapa 7 em diante).
- **Autenticação e Segurança**: Senhas em hash Argon2id com sal individual via `node:crypto`, autenticação stateless baseada em token JWT (HS256) e isolamento estrito de dados por investidor (`userId`).
- **Serviços Transacionais e Upload**: Nodemailer para e-mails de confirmação e Multer para upload multipart de avatares com validação de formato e tamanho.
- **Qualidade e Testes**: Biome (`lint`, `format`, `lint:fix`), Vitest / JSDOM no front, Supertest nas rotas e Playwright para testes end-to-end.
- **Infraestrutura**: Dockerfile multi-estágio e `docker compose` com volumes persistentes para banco e uploads.

---

## 3. Catálogo de Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01 · Gestão de Investimentos**: Cadastro, listagem, consulta, edição e exclusão de investimentos (`/api/investments`).
- **RF02 · Cadastro de Investidor**: Criação de conta com nome, e-mail único e confirmação de senha (`POST /api/users`).
- **RF03 · Autenticação e Sessão**: Login de usuários com emissão de token JWT (`POST /api/signin`) e recuperação de sessão.
- **RF04 · Isolamento de Carteira por Dono**: Cada investidor visualiza, atualiza e remove exclusivamente os seus próprios ativos.
- **RF05 · Confirmação por E-mail**: Envio assíncrono de mensagem de boas-vindas logo após o cadastro.
- **RF06 · Foto e Perfil do Usuário**: Upload multipart de imagem de perfil (até 2 MB) vinculada à conta.

### Requisitos Não-Funcionais (RNF)
- **RNF01 · Validação Estrita e Detalhada**: Detalhamento preciso de campos incorretos no payload via schemas Zod com status 400.
- **RNF02 · Segurança Criptográfica de Senhas**: Armazenamento exclusivo de senhas em hash `$argon2id$` com sal individual.
- **RNF03 · Persistência Confiável**: Preservação dos dados cadastrados após reinicialização do servidor e migrações versionadas.
- **RNF04 · Testabilidade Abrangente**: Suíte de testes automatizados cobrindo funções de domínio, endpoints de API, lógica de tela e fluxos E2E.
- **RNF05 · Portabilidade com Docker**: Execução completa da aplicação, banco e assets através de um comando único `docker compose up`.
- **RNF06 · Arquitetura em Camadas e Tipagem**: Desacoplamento estrito entre camadas com TypeScript e tratamento centralizado de erros (`HttpError`).
- **RNF07 · Documentação Autogerada**: Sincronia contínua entre contratos de rotas e interface Swagger.

---

## 4. Matriz de Rastreabilidade do Backlog

| História de Usuário (US) | Critérios de Aceitação (CA) | Tasks de Implementação (TK) | Qtd. CA / TK | Sprint / Responsável |
| ------------------------ | --------------------------- | --------------------------- | ------------ | -------------------- |
| `US01` Conhecer o sistema antes de usá-lo | `CA01.1` a `CA01.5` | `TK01.1` a `TK01.5` | 5 CA / 5 TK | Sprint 1 · `luiz.chaves` |
| `US02` Manter a carteira pela aplicação | `CA02.1` a `CA02.8` | `TK02.1` a `TK02.6` | 8 CA / 6 TK | Sprint 1 · `luiz.chaves` |
| `US03` Mudar o código sem medo | `CA03.1` a `CA03.6` | `TK03.1` a `TK03.7` | 6 CA / 7 TK | Sprint 2 · `luiz.chaves` |
| `US04` Saber exatamente o que corrigir | `CA04.1` a `CA04.7` | `TK04.1` a `TK04.3` | 7 CA / 3 TK | Sprint 2 · `luiz.chaves` |
| `US05` Integrar sem ler o código | `CA05.1` a `CA05.5` | `TK05.1`, `TK05.2` | 5 CA / 2 TK | Sprint 3 · `luiz.chaves` |
| `US06` Não perder carteira ao fechar sistema | `CA06.1` a `CA06.5` | `TK06.1` a `TK06.3` | 5 CA / 3 TK | Sprint 3 · `luiz.chaves` |
| `US07` Enxergar distribuição do patrimônio | `CA07.1` a `CA07.5` | `TK07.1` a `TK07.6` | 5 CA / 6 TK | Sprint 3 · `luiz.chaves` |
| `US08` Ter uma carteira própria | `CA08.1` a `CA08.6` | `TK08.1` a `TK08.5` | 6 CA / 5 TK | Sprint 4 · `luiz.chaves` |
| `US09` Entrar no sistema | `CA09.1` a `CA09.6` | `TK09.1`, `TK09.2`, `TK09.4` a `TK09.6` | 6 CA / 5 TK | Sprint 4 · `luiz.chaves` |
| `US10` Ver apenas a minha carteira | `CA10.1` a `CA10.4` | `TK09.3` | 4 CA / 1 TK | Sprint 4 · `luiz.chaves` |
| `US11` Confirmar criação de conta | `CA11.1` a `CA11.6` | `TK10.1` a `TK10.4` | 6 CA / 4 TK | Sprint 5 · `luiz.chaves` |
| `US12` Personalizar foto do perfil | `CA12.1` a `CA12.7` | `TK11.1` a `TK11.5` | 7 CA / 5 TK | Sprint 5 · `luiz.chaves` |
| `US13` Alterar sem quebrar o existente | `CA13.1` a `CA13.7` | `TK12.1` a `TK12.6` | 7 CA / 6 TK | Sprint 6 · `luiz.chaves` |
| `US14` Subir aplicação em qualquer máquina | `CA14.1` a `CA14.7` | `TK13.1` a `TK13.4` | 7 CA / 4 TK | Sprint 6 · `luiz.chaves` |
| `US15` Solicitar recuperação de senha | `CA15.1` a `CA15.3` | `TK15.1` a `TK15.5` | 3 CA / 5 TK | Sprint 6 · `luiz.chaves` |

---

## 5. Decomposição do Backlog por Épicos e Features

### EP01 · Experiência e Carteira

#### FT01 · Telas do Sistema (Etapa 1)
- **US01**: *Como visitante ou pessoa desenvolvedora, quero navegar pelas telas de carteira, cadastro, login e perfil sobre um projeto estruturado com governança e automação, para entender o que a aplicação faz e ter uma base padronizada e confiável de desenvolvimento.*
  - **CA01.1**: Telas abrem diretamente do arquivo, sem servidor e sem instalação obrigatória.
  - **CA01.2**: Cabeçalho interliga `index.html`, `signin.html`, `signup.html` e `profile.html` sem dependência de JavaScript.
  - **CA01.3**: Campos de formulário declaram atributos `name` (`name`, `value`, `interest`) para consumo na etapa seguinte.
  - **CA01.4**: Inexistência de scripts JavaScript de aplicação nas telas.
  - **CA01.5**: Raiz contém `docs/PRD.md`, `AGENTS.md`, `README.md`, `biome.json`, subpastas `active/` e `archived/` em `specs/`, skill `.agents/skills/task-spec-generator/` e scripts `dev`, `build`, `preview`, `lint`, `format` e `lint:fix`.
  - **Tasks**:
    - `TK01.1`: Criar `index.html` e estrutura inicial (governança, qualidade, scripts e `.agents/skills/`).
    - `TK01.2`: Carregar Tailwind pelo Play CDN e criar `css/components.css`.
    - `TK01.3`: Criar tela visual de cadastro `signup.html`.
    - `TK01.4`: Criar tela visual de login `signin.html`.
    - `TK01.5`: Criar painel de perfil `profile.html` e avatar padrão.

#### FT02 · CRUD de Investimentos (Etapa 2)
- **US02**: *Como investidor, quero cadastrar, consultar, editar e remover meus investimentos, para manter a carteira atualizada.*
  - **CA02.1**: `GET /api/investments` retorna 200 com array de investimentos.
  - **CA02.2**: `GET /api/investments?name=termo` filtra pelo nome informado.
  - **CA02.3**: `POST /api/investments` responde 201 com id gerado pelo servidor.
  - **CA02.4**: Payload sem o campo `value` responde 400 Bad Request.
  - **CA02.5**: Identificador inexistente responde 404 em `GET`, `PUT` e `DELETE`.
  - **CA02.6**: `DELETE /api/investments/{id}` responde 204 No Content.
  - **CA02.7**: Renderização dinâmica dos cartões da interface via chamadas `fetch`.
  - **CA02.8**: Dados mantidos em memória durante a execução do processo.
  - **Tasks**:
    - `TK02.1`: Configurar servidor Express com Morgan e servir estáticos em `src/index.js`.
    - `TK02.2`: Criar array de dados em memória `src/data/investments.js`.
    - `TK02.3`: Criar rotas CRUD em `src/routes.js`.
    - `TK02.4`: Criar camada de integração do front `public/js/services/api.js` e `public/js/index.js`.
    - `TK02.5`: Criar requisições executáveis em `requests.http`.
    - `TK02.6`: Configurar compilação do CSS via Tailwind CLI.

#### FT03 · Classificação por Categoria e Corretora (Etapa 7)
- **US07**: *Como investidor, quero classificar cada ativo por categoria e corretora, para enxergar a distribuição do patrimônio.*
  - **CA07.1**: `npx prisma migrate deploy` executa migrações relacionais no banco.
  - **CA07.2**: Listagem de investimentos traz dados aninhados de `category` e `broker` via `include`.
  - **CA07.3**: Criação com corretora nova registra e vincula o registro automaticamente.
  - **CA07.4**: Cadastro com `categoryId` inexistente responde 400.
  - **CA07.5**: Migrações versionadas no Git e banco `dev.db` ignorado.
  - **Tasks**:
    - `TK07.1`: Modelar `prisma/schema.prisma` com `Investment`, `Category` e `Broker`.
    - `TK07.2`: Criar singleton do `PrismaClient` em `src/database/database.js`.
    - `TK07.3`: Atualizar `src/models/Investment.js` com chamadas do Prisma.
    - `TK07.4`: Remover camada manual de migrações e seeders SQL.
    - `TK07.5`: Implementar recursos completos para `Category` e `Broker`.
    - `TK07.6`: Adaptar front-end para exibir categorias, corretoras e campos no formulário.

---

### EP02 · Identidade e Acesso

#### FT04 · Cadastro de Investidor (Etapa 8)
- **US08**: *Como visitante, quero criar uma conta com nome, e-mail e senha, para ter uma carteira privada.*
  - **CA08.1**: `POST /api/users` responde 201 com id, nome e e-mail (omitindo a senha).
  - **CA08.2**: E-mail duplicado responde 409 Conflict.
  - **CA08.3**: Divergência na confirmação de senha responde 400.
  - **CA08.4**: Senha armazenada em formato PHC `$argon2id$` no banco.
  - **CA08.5**: Sal individual gerado para cada usuário via `node:crypto`.
  - **CA08.6**: Submissão bem-sucedida de `signup.html` redireciona para a tela de login.
  - **Tasks**:
    - `TK08.1`: Atualizar `schema.prisma` com modelo `User` e relação com `Investment`.
    - `TK08.2`: Criar utilitário `src/utils/password.ts` e model `src/models/User.ts`.
    - `TK08.3`: Criar rota `POST /api/users` com controller e schema.
    - `TK08.4`: Integrar formulário `public/js/signup.js` ao endpoint.
    - `TK08.5`: Vincular obrigatoriamente `userId` a cada investimento cadastrado.

#### FT05 · Login, Sessão e Isolamento por Dono (Etapa 9)
- **US09**: *Como investidor cadastrado, quero entrar com e-mail e senha, para acessar minha conta.*
  - **CA09.1**: `POST /api/signin` responde 200 com flag de autenticação e token JWT.
  - **CA09.2**: Credenciais inválidas respondem 401 unificado.
  - **CA09.3**: Acesso sem token a rotas protegidas responde 401.
  - **CA09.4**: Token adulterado ou expirado responde 401.
  - **CA09.5**: Front armazena token no `localStorage` e envia header `Authorization: Bearer <token>`.
  - **CA09.6**: Formato do cabeçalho validado pelo `bearerSchema` e descrito no OpenAPI.
  - **Tasks**:
    - `TK09.1`: Criar utilitário `src/utils/jwt.ts` e middleware `src/middlewares/isAuthenticated.ts`.
    - `TK09.2`: Criar rota `POST /api/signin`.
    - `TK09.4`: Atualizar front-end com persistência do token e headers de requisição.
    - `TK09.5`: Proteger rotas da carteira e expor endpoint `/api/users/me`.
    - `TK09.6`: Declarar `bearerSchema` e `cookieSessionSchema` em `src/schemas/auth.schema.ts`.
- **US10**: *Como investidor autenticado, quero acessar apenas os meus investimentos, para proteger meus dados.*
  - **CA10.1**: Listagem filtra exclusivamente registros vinculados ao `userId` do token.
  - **CA10.2**: Tentativa de acesso ou exclusão de ativo de terceiro responde 404 Not Found.
  - **CA10.4**: Campo `userId` no body é sobrescrito pelo identificador do token autenticado.
  - **Tasks**:
    - `TK09.3`: Atualizar queries de `src/models/Investment.ts` escopadas por `userId`.

#### FT06 · Recuperação de Senha (Planejada / Backlog)
- **US15**: *Como usuário cadastrado, quero solicitar recuperação de senha, para reaver acesso à conta.*
  - **CA15.1**: Formulário para inserção do e-mail cadastrado.
  - **CA15.2**: Envio de mensagem com link e token seguro de recuperação.
  - **CA15.3**: Token com expiração temporária estrita.
  - **Tasks**:
    - `TK15.1`: Criar endpoint `POST /password-reset`.
    - `TK15.2`: Criar mailer de recuperação via serviço `SendMail`.
    - `TK15.3`: Modelar tabela e geração de tokens temporários.
    - `TK15.4`: Criar interface web para redefinição de senha.
    - `TK15.5`: Implementar testes automatizados do fluxo.

---

### EP03 · Perfil e Notificações

#### FT07 · E-mail de Boas-Vindas (Etapa 10)
- **US11**: *Como novo usuário, quero receber e-mail após o cadastro, para confirmação de conta.*
  - **CA11.1**: Cadastro com sucesso dispara e-mail de boas-vindas assincronamente.
  - **CA11.2**: Falhas por duplicidade de e-mail (409) não disparam mensagens.
  - **CA11.3**: Em ambiente de desenvolvimento, log exibe URL de preview (Ethereal).
  - **CA11.4**: E-mails gerados em formato duplo (HTML e texto plano).
  - **CA11.5**: Indisponibilidade de servidor SMTP não bloqueia a criação do usuário.
  - **CA11.6**: Módulo Nodemailer isolado na camada de serviços.
  - **Tasks**:
    - `TK10.1`: Criar serviço `src/services/SendMail.ts` com Nodemailer.
    - `TK10.2`: Configurar parâmetros SMTP em `src/config/mail.ts`.
    - `TK10.3`: Acionar envio no controller de criação de usuário.
    - `TK10.4`: Atualizar feedback visual no front (`public/js/signup.js`).

#### FT08 · Avatar do Perfil (Etapa 11)
- **US12**: *Como investidor, quero enviar foto de perfil, para personalização da conta.*
  - **CA12.1**: Rota `POST /api/users/image` exige autenticação prévia (401).
  - **CA12.2**: Upload de PNG/JPG/GIF de até 2 MB responde 201 com URL pública do arquivo.
  - **CA12.3**: Avatar servido e renderizado no cabeçalho e perfil.
  - **CA12.4**: Arquivo superior a 2 MB responde 400.
  - **CA12.5**: Formato fora da lista permitida responde 400 sem salvar no disco.
  - **CA12.6**: Nomes de arquivo gerados como UUID único sem colisões.
  - **CA12.7**: Novo upload substitui o avatar anterior do investidor.
  - **Tasks**:
    - `TK11.1`: Configurar Multer em `src/config/multer.ts`.
    - `TK11.2`: Criar rotas `POST` e `PUT /api/users/image`.
    - `TK11.3`: Criar model `src/models/Image.ts` associado ao usuário.
    - `TK11.4`: Implementar envio multipart em `public/js/profile.js`.
    - `TK11.5`: Atualizar exibição do avatar no cabeçalho e views da aplicação.

---

### EP04 · Fundação Técnica

#### FT09 · Arquitetura em Camadas e Tipos (Etapa 3)
- **US03**: *Como mantenedor, quero tipagem estrita e arquitetura em camadas, para segurança e manutenibilidade.*
  - **CA03.1**: Checagem de tipos `npm run typecheck` finaliza com 0 erros.
  - **CA03.2**: Código do backend 100% migrado para TypeScript em `src/`.
  - **CA03.3**: Arquivo de rotas apenas conecta caminhos aos controllers.
  - **CA03.4**: Camada de model desacoplada de requisição/resposta HTTP.
  - **CA03.5**: Erros gerados com `HttpError` e tratados exclusivamente por middleware central.
  - **CA03.6**: Contratos e comportamentos HTTP da etapa anterior preservados.
  - **Tasks**:
    - `TK03.1`: Configurar `tsconfig.json` e aliases.
    - `TK03.2`: Reestruturar `src/index.ts` com tipagem.
    - `TK03.3`: Declarar interfaces em `src/types/Investment.d.ts`.
    - `TK03.4`: Criar model assíncrono `src/models/Investment.ts`.
    - `TK03.5`: Criar controller HTTP `src/controllers/investments.controller.ts`.
    - `TK03.6`: Criar classe de erro `src/errors/HttpError.ts`.
    - `TK03.7`: Criar roteador modular `src/routes/investments.routes.ts`.

#### FT10 · Validação de Entrada (Etapa 4)
- **US04**: *Como investidor, quero mensagens claras sobre erros de entrada nos formulários e requisições.*
  - **CA04.1**: Payloads incorretos retornam status 400 com lista de issues detalhadas.
  - **CA04.2**: Cada issue indica o caminho e a fonte (`body`, `params`, `query`).
  - **CA04.3**: IDs inválidos na rota respondem 400 antes da execução do model.
  - **CA04.4**: UUID válido mas inexistente responde 404.
  - **CA04.5**: Query parameters inválidos respondem 400.
  - **CA04.6**: Controllers sem lógica condicional de validação de formato.
  - **CA04.7**: Validação estendida para cabeçalhos e cookies via `parseCookies`.
  - **Tasks**:
    - `TK04.1`: Criar middleware genérico `src/middlewares/validate.ts`.
    - `TK04.2`: Criar schemas Zod em `src/schemas/investment.schema.ts`.
    - `TK04.3`: Criar utilitário `src/utils/cookies.ts`.

#### FT11 · Documentação da API (Etapa 5)
- **US05**: *Como desenvolvedor consumidor, quero documentação Swagger interativa gerada automaticamente.*
  - **CA05.1**: Interface Swagger UI funcional sob `/api/docs`.
  - **CA05.2**: Especificação bruta disponível em `/api/openapi.json`.
  - **CA05.3**: Tipos, limites e campos obrigatórios espelhados dos schemas Zod.
  - **CA05.4**: Atualizações em schemas propagam diretamente para a documentação.
  - **CA05.5**: Zero alterações no comportamento das rotas existentes.
  - **Tasks**:
    - `TK05.1`: Criar conversor OpenAPI em `src/docs/openapi.ts`.
    - `TK05.2`: Criar rotas de documentação em `src/routes/docs.routes.ts`.

#### FT12 · Persistência de Dados com SQLite (Etapa 6)
- **US06**: *Como investidor, quero que meus dados persistam em disco após reiniciar a aplicação.*
  - **CA06.1**: Script `npm run db:load` inicializa tabela e sementes de dados.
  - **CA06.2**: Investimentos persistem em arquivo SQLite local.
  - **CA06.3**: Queries SQL executadas com parâmetros protegidos (`?`).
  - **CA06.4**: IDs mantidos como UUID v4.
  - **CA06.5**: Assinatura dos controllers preservada sem alterações de contrato.
  - **Tasks**:
    - `TK06.1`: Criar conexão `src/database/database.js` com driver SQLite.
    - `TK06.2`: Criar scripts de DDL e seed `src/database/migration.js` e `seeders.js`.
    - `TK06.3`: Atualizar `src/models/Investment.js` com SQL parametrizado.

---

### EP05 · Qualidade e Operação

#### FT13 · Suíte de Testes e Cobertura (Etapa 12)
- **US13**: *Como mantenedor, quero testes automatizados cobrindo front, back e fluxos E2E para evitar regressões.*
  - **CA13.1**: `npm test` executa testes unitários e de integração sem abrir portas.
  - **CA13.2**: `npm run front:test` valida módulos do front no JSDOM com mocks.
  - **CA13.3**: Testes garantem idempotência em execuções sucessivas.
  - **CA13.4**: Script `npm run coverage` valida piso mínimo de cobertura de código.
  - **CA13.5**: Teste automatizado comprova isolamento de carteira por usuário.
  - **CA13.6**: Entrypoint `index.ts` desacoplado exportando `app`.
  - **CA13.7**: Testes de cabeçalhos de autenticação e utilitário `parseCookies`.
  - **Tasks**:
    - `TK12.1`: Implementar testes unitários de funções puras.
    - `TK12.2`: Criar testes de rotas HTTP com Supertest em `src/routes.test.ts`.
    - `TK12.3`: Criar testes de front com Vitest e JSDOM em `public/js/services/api.test.js`.
    - `TK12.4`: Criar suíte E2E com Playwright em `tests/invest-app.spec.js`.
    - `TK12.5`: Configurar `playwright.config.js` e scripts de teste no `package.json`.
    - `TK12.6`: Criar testes de cookies e cabeçalhos malformados.

#### FT14 · Empacotamento e Deploy (Etapa 13)
- **US14**: *Como operador de deploy, quero contêiner Docker reproduzível com banco e uploads persistentes.*
  - **CA14.1**: `docker compose up --build` sobe aplicação completa na porta 3000.
  - **CA14.2**: Migrações do Prisma executadas automaticamente no startup.
  - **CA14.3**: Variáveis de ambiente injetadas via Compose sem expor segredos na imagem.
  - **CA14.4**: Processo executado sob usuário sem privilégios (`node`).
  - **CA14.5**: Volumes nomeados preservam banco SQLite e arquivos de avatares.
  - **CA14.6**: `docker compose down --volumes` limpa completamente os dados.
  - **CA14.7**: Zero alterações no código-fonte da aplicação para suportar Docker.
  - **Tasks**:
    - `TK13.1`: Criar `Dockerfile` multi-stage otimizado.
    - `TK13.2`: Criar `.dockerignore`.
    - `TK13.3`: Configurar serviços e portas em `compose.yaml`.
    - `TK13.4`: Configurar volumes persistentes para SQLite e avatares.
