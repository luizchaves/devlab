# Product Requirements Document (PRD) — MonitorApp

Documento completo de especificação de requisitos de produto e engenharia do **MonitorApp**, estruturado em cinco épicos, quatorze features, quinze histórias de usuário, mais de oitenta critérios de aceitação e a relação exaustiva de todas as tasks técnicas das treze etapas.

---

## 1. Visão Geral e Objetivos do Produto

O **MonitorApp** é uma plataforma de observabilidade e monitoramento de infraestrutura em rede. A aplicação permite cadastrar servidores e serviços (hosts), medir latência de resposta em tempo real via ping nativo do sistema operacional, classificar equipamentos por tags, consultar séries temporais de disponibilidade e receber eventos ao vivo via Server-Sent Events (SSE).

### Público-Alvo e Personas
- **Responsáveis por Infraestrutura e Redes**: Profissionais que necessitam acompanhar o estado e a saúde operacional de seus equipamentos em um painel centralizado.
- **Engenheiros de Software e Mantenedores**: Desenvolvedores que constroem uma arquitetura de duas origens desacoplada (Front-end SPA e API RESTful independente).
- **Operação e SRE**: Equipes que executam testes automatizados e provisionam a aplicação em produção com múltiplos contêineres Docker e proxy reverso Nginx.

---

## 2. Arquitetura e Stack Tecnológica

- **Arquitetura de Duas Origens**: Desacoplamento estrito entre cliente web (`front/`) e servidor de aplicação (`back/`).
- **Front-end (`front/`)**: HTML semântico, Tailwind CSS, Vite (com servidor de desenvolvimento e proxy `/api` em dev), JavaScript modular e biblioteca de eventos SSE (`events.js`).
- **Back-end (`back/`)**: Node.js 22+, Express 5, TypeScript em camadas estritas (Rotas, Controllers, Models, Middlewares e Services).
- **Validação de Fronteira**: Zod para validação rigorosa de IPs, domínios, UUIDs, parâmetros de busca, cabeçalhos e cookies.
- **Documentação de API**: OpenAPI 3.0 e interface Swagger UI (`/api/docs` e `/api/openapi.json`).
- **Persistência de Dados**:
  - Em memória (etapas 1 e 2).
  - SQLite via driver nativo com consultas parametrizadas (etapa 6).
  - Prisma ORM com schema relacional (`Host`, `Ping`, `Tag`, `User`) e migrações versionadas (etapa 7 em diante).
- **Coleta de Métricas e Tempo Real**: Execução de comando de sistema isolado (`execFile('ping')`) sem shell, agendador periódico de coletas (`services/monitor.ts`) e barramento pub/sub com Server-Sent Events (`GET /api/events`).
- **Autenticação e Criptografia**: Hash Argon2id com sal individual via `node:crypto` e autenticação JWT (HS256) com isolamento estrito de hosts por usuário (`userId`).
- **Qualidade e Testes**: Biome (`lint`, `format`, `lint:fix`), Vitest com JSDOM no front, Supertest na API e Playwright para testes end-to-end.
- **Empacotamento e Deploy**: Docker multi-stage para API e Nginx servindo o front estático com proxy reverso sob `compose.yaml`.

---

## 3. Catálogo de Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01 · Gestão de Hosts**: Cadastro, listagem, consulta por ID, edição e exclusão de servidores e endpoints monitorados (`/api/hosts`).
- **RF02 · Classificação por Tags**: Rotulagem de hosts com tags (relação N-N) e filtragem dinâmica (`GET /api/hosts?tag=infra`).
- **RF03 · Histórico de Medições**: Registro de séries temporais de pings com latência em milissegundos e status de sucesso (`GET /api/hosts/:id/pings`).
- **RF04 · Coleta de Latência (Ping)**: Medição sob demanda (`POST /api/hosts/:id/pings`) e coletas automáticas periódicas com agendador.
- **RF05 · Cadastro de Usuário**: Registro de novos operadores de rede com e-mail único e hash seguro (`POST /api/users`).
- **RF06 · Autenticação e Sessão**: Emissão de token JWT para credenciais válidas (`POST /api/signin`).
- **RF07 · Isolamento de Hosts por Dono**: Cada conta gerencia e visualiza exclusivamente os seus próprios hosts cadastrados.
- **RF08 · Painel em Tempo Real**: Conexão SSE (`GET /api/events`) emitindo atualizações instantâneas de medições nos cartões de host.

### Requisitos Não-Funcionais (RNF)
- **RNF01 · Validação Estrita de Rede**: Rejeição de endereços inválidos (IPs malformados, URLs com protocolo) com status 400 e lista de issues Zod.
- **RNF02 · Segurança Criptográfica**: Senhas armazenadas exclusivamente em hash `$argon2id$` com parâmetros seguros e sal individual.
- **RNF03 · Integridade Relacional e Cascata**: Remoção de host exclui automaticamente histórico de medições (`onDelete: Cascade`).
- **RNF04 · Execução Segura de Comandos**: Execução de `ping` via `execFile` com argumentos em array, impedindo injeção de comandos de shell.
- **RNF05 · Arquitetura de Duas Origens**: Desacoplamento total entre front e API sem preflight de CORS em desenvolvimento (via proxy Vite) e produção (via Nginx).
- **RNF06 · Arquitetura em Camadas e Tipagem**: TypeScript estrito com desacoplamento absoluto entre rotas, controladores e modelos de dados.
- **RNF07 · Contrato de API Sincronizado**: Documentação Swagger derivada dinamicamente dos schemas Zod de validação.
- **RNF08 · Confiabilidade de Testes**: Suíte automatizada cobrindo cálculos puros de latência, rotas HTTP, DOM do front e fluxos E2E.
- **RNF09 · Empacotamento Multi-Serviço**: Orquestração completa de front, backend e volumes via Docker Compose.

---

## 4. Matriz de Rastreabilidade do Backlog

| História de Usuário (US) | Critérios de Aceitação (CA) | Tasks de Implementação (TK) | Qtd. CA / TK | Sprint / Responsável |
| ------------------------ | --------------------------- | --------------------------- | ------------ | -------------------- |
| `US01` Conhecer o sistema antes de usá-lo | `CA01.1` a `CA01.5` | `TK01.1` a `TK01.5` | 5 CA / 5 TK | Sprint 1 · `luiz.chaves` |
| `US02` Manter o inventário de hosts | `CA02.1` a `CA02.9` | `TK02.1` a `TK02.6` | 9 CA / 6 TK | Sprint 1 · `luiz.chaves` |
| `US03` Mudar o código sem medo | `CA03.1` a `CA03.6` | `TK03.1` a `TK03.7` | 6 CA / 7 TK | Sprint 2 · `luiz.chaves` |
| `US04` Saber exatamente o que corrigir | `CA04.1` a `CA04.8` | `TK04.1` a `TK04.4` | 8 CA / 4 TK | Sprint 2 · `luiz.chaves` |
| `US05` Integrar sem ler o código | `CA05.1` a `CA05.5` | `TK05.1`, `TK05.2` | 5 CA / 2 TK | Sprint 3 · `luiz.chaves` |
| `US06` Não perder o inventário ao fechar o sistema | `CA06.1` a `CA06.5` | `TK06.1` a `TK06.3` | 5 CA / 3 TK | Sprint 3 · `luiz.chaves` |
| `US07` Organizar e comparar os hosts | `CA07.1` a `CA07.6` | `TK07.1` a `TK07.5` | 6 CA / 5 TK | Sprint 3 · `luiz.chaves` |
| `US08` Saber se o host está no ar sem abrir o terminal | `CA08.1` a `CA08.6` | `TK08.1` a `TK08.4` | 6 CA / 4 TK | Sprint 4 · `luiz.chaves` |
| `US09` Ter um inventário próprio | `CA09.1` a `CA09.6` | `TK09.1` a `TK09.4` | 6 CA / 4 TK | Sprint 4 · `luiz.chaves` |
| `US10` Entrar no sistema | `CA10.1` a `CA10.6` | `TK10.1` a `TK10.3`, `TK10.5` a `TK10.7` | 6 CA / 6 TK | Sprint 4 · `luiz.chaves` |
| `US11` Ver apenas os meus hosts | `CA11.1` a `CA11.4` | `TK10.4` | 4 CA / 1 TK | Sprint 4 · `luiz.chaves` |
| `US12` Ver a rede mudando ao vivo | `CA12.1` a `CA12.6` | `TK11.1` a `TK11.4` | 6 CA / 4 TK | Sprint 5 · `luiz.chaves` |
| `US13` Alterar sem quebrar o existente | `CA13.1` a `CA13.7` | `TK12.1` a `TK12.6` | 7 CA / 6 TK | Sprint 5 · `luiz.chaves` |
| `US14` Subir a aplicação em qualquer máquina | `CA14.1` a `CA14.7` | `TK13.1` a `TK13.4` | 7 CA / 4 TK | Sprint 6 · `luiz.chaves` |
| `US15` Ser avisado quando um host cair | `CA15.1` a `CA15.3` | `TK15.1` a `TK15.5` | 3 CA / 5 TK | Sprint 6 · `luiz.chaves` |

---

## 5. Decomposição do Backlog por Épicos e Features

### EP01 · Inventário e Observação

#### FT01 · Telas do Sistema (Etapa 1)
- **US01**: *Como visitante ou pessoa desenvolvedora, quero navegar pelas telas de inventário, histórico, login e cadastro sobre um projeto estruturado com governança e automação, para entender o que a aplicação faz e ter uma base padronizada e confiável de desenvolvimento.*
  - **CA01.1**: Telas abrem diretamente com `npm run dev` no front sem necessidade de API ou banco.
  - **CA01.2**: Navegação entre `index.html`, `host.html`, `signin.html` e `signup.html` puramente estática.
  - **CA01.3**: Campos de formulário com atributos `name` (`name`, `address`, `tags`) já preparados para integração.
  - **CA01.4**: Nenhuma tag `script` de aplicação nos arquivos HTML.
  - **CA01.5**: Raiz contém `docs/PRD.md`, `AGENTS.md`, `README.md`, `biome.json`, subpastas `active/` e `archived/` em `specs/`, skill `.agents/skills/task-spec-generator/` e scripts `dev`, `build`, `preview`, `lint`, `format` e `lint:fix` no `front/package.json`.
  - **Tasks**:
    - `TK01.1`: Criar `index.html` e estrutura inicial (governança, qualidade, scripts e skill `.agents/skills/`).
    - `TK01.2`: Criar folha utilitária `css/tailwind.css`.
    - `TK01.3`: Criar tela de histórico de host `host.html`.
    - `TK01.4`: Criar telas de autenticação `signin.html` e `signup.html`.
    - `TK01.5`: Configurar build das 4 páginas em `vite.config.js`.

#### FT02 · CRUD de Hosts (Etapa 2)
- **US02**: *Como responsável pela rede, quero cadastrar, consultar, editar e remover endereços monitorados, para manter o inventário atualizado.*
  - **CA02.1**: `GET /api/hosts` responde 200 com array de hosts.
  - **CA02.2**: `GET /api/hosts?name=termo` filtra pelo nome.
  - **CA02.3**: `POST /api/hosts` responde 201 com ID gerado.
  - **CA02.4**: Payload sem `name` ou `address` responde 400.
  - **CA02.5**: IDs inexistentes respondem 404 em `GET`, `PUT` e `DELETE`.
  - **CA02.6**: `DELETE /api/hosts/{id}` responde 204 No Content.
  - **CA02.7**: Renderização dos cartões da interface via chamadas `fetch`.
  - **CA02.8**: Proxy `/api` configurado no Vite evitando preflight de CORS.
  - **CA02.9**: Armazenamento em memória preservado durante a execução.
  - **Tasks**:
    - `TK02.1`: Criar entrypoint Express `back/src/index.js` com Morgan e CORS.
    - `TK02.2`: Criar armazenamento em memória `back/src/data/hosts.js`.
    - `TK02.3`: Criar rotas em `back/src/routes.js` com `HttpError`.
    - `TK02.4`: Configurar proxy `/api` em `front/vite.config.js`.
    - `TK02.5`: Criar camada de serviços front `front/js/services/api.js` e `front/js/index.js`.
    - `TK02.6`: Criar requisições executáveis em `back/requests.http`.

#### FT03 · Classificação e Histórico (Etapa 7)
- **US07**: *Como responsável pela rede, quero rotular hosts por finalidade e consultar histórico de pings, para comparar o comportamento das máquinas.*
  - **CA07.1**: `prisma migrate dev` inicializa tabelas `Host`, `Ping`, `Tag` e junção `_HostTags`.
  - **CA07.2**: `GET /api/hosts` inclui tags e medições mais recentes na mesma resposta.
  - **CA07.3**: Tags informadas no cadastro e ainda inexistentes são criadas dinamicamente.
  - **CA07.4**: `GET /api/hosts?tag=infra` filtra por tags associadas.
  - **CA07.5**: Exclusão de host remove medições vinculadas via `onDelete: Cascade`.
  - **CA07.6**: `POST /api/tags` com nome duplicado responde 409 Conflict.
  - **Tasks**:
    - `TK07.1`: Modelar `prisma/schema.prisma` com `Host`, `Ping`, `Tag` e relação N-N.
    - `TK07.2`: Criar client singleton em `database.ts` e script `seed.ts`.
    - `TK07.3`: Reescrever `Host` com Prisma e criar models `Tag` e `Ping`.
    - `TK07.4`: Criar rotas para tags e consulta de pings por host (`GET /api/hosts/:id/pings`).
    - `TK07.5`: Exibir tags nos cartões do front e integrar histórico em `host.html`.

---

### EP02 · Coleta e Tempo Real

#### FT04 · Coleta Automática e sob Demanda (Etapa 8)
- **US08**: *Como responsável pela rede, quero que o sistema meça hosts automaticamente e sob demanda, para detectar quedas sem abrir o terminal.*
  - **CA08.1**: `POST /api/hosts/:id/pings` executa medição manual e responde 201.
  - **CA08.2**: Resposta com sucesso grava `success: true` e latência em ms.
  - **CA08.3**: Host inacessível grava `success: false` com latência nula.
  - **CA08.4**: Endereço isolado em argumento: comandos maliciosos falham sem execução em shell.
  - **CA08.5**: Agendador executa rodada periódica a cada `MONITOR_INTERVAL` segundos.
  - **CA08.6**: Falha em um host não interrompe a coleta dos demais na mesma rodada.
  - **Tasks**:
    - `TK08.1`: Criar `lib/ping.ts` com `execFile`, argumentos por sistema e parser de latência.
    - `TK08.2`: Implementar `Ping.check` no model persistindo o resultado.
    - `TK08.3`: Criar agendador periódico `services/monitor.ts` com `Promise.allSettled`.
    - `TK08.4`: Adicionar botão de ação "Medir agora" em `host.html`.

#### FT05 · Painel ao Vivo (Etapa 11)
- **US12**: *Como responsável pela rede, quero que o painel atualize em tempo real a cada medição, para monitoramento contínuo.*
  - **CA12.1**: `GET /api/events` abre stream contínuo `text/event-stream`.
  - **CA12.2**: Cada ping gravado emite evento `event: ping` com `hostId`, `success` e `latency`.
  - **CA12.3**: Cartão do host atualiza cores e métricas sem recarregar a página.
  - **CA12.4**: Usuário recebe apenas eventos de seus próprios hosts cadastrados.
  - **CA12.5**: Fechamento de conexão remove listeners e encerra heartbeats no servidor.
  - **CA12.6**: Token JWT trafega no cabeçalho `Authorization`.
  - **Tasks**:
    - `TK11.1`: Criar barramento de eventos em memória `services/events.ts`.
    - `TK11.2`: Criar rota SSE com heartbeat e teardown em `routes/events.routes.ts`.
    - `TK11.3`: Emitir evento em `Ping.check` imediatamente após persistência.
    - `TK11.4`: Criar módulo front `front/js/lib/events.js` aplicando mutações no DOM.

#### FT06 · Alertas de Indisponibilidade (Planejada / Backlog)
- **US15**: *Como responsável pela rede, quero receber alertas quando um host cair, para agir proativamente.*
  - **CA15.1**: Disparo de alerta configurável após N falhas consecutivas.
  - **CA15.2**: Supressão de notificações repetidas enquanto o host permanecer fora do ar.
  - **CA15.3**: Envio de notificação de recuperação quando o host restabelecer resposta.
  - **Tasks**:
    - `TK15.1`: Modelar entidade `Alert`.
    - `TK15.2`: Implementar detector de transição de estado no serviço de monitoramento.
    - `TK15.3`: Criar serviço de envio de notificações (e-mail ou webhook).
    - `TK15.4`: Criar interface de preferências de alerta por host.
    - `TK15.5`: Implementar testes unitários para a máquina de estados de alerta.

---

### EP03 · Identidade e Acesso

#### FT07 · Cadastro de Conta (Etapa 9)
- **US09**: *Como visitante, quero criar uma conta com nome, e-mail e senha, para manter um inventário próprio.*
  - **CA09.1**: `POST /api/users` responde 201 com dados públicos do usuário sem retornar a senha.
  - **CA09.2**: Tentativa de cadastro com e-mail duplicado responde 409 Conflict.
  - **CA09.3**: Incompatibilidade entre senha e confirmação responde 400.
  - **CA09.4**: Hash gerado no formato `$argon2id$` com sal individual.
  - **CA09.5**: Dois usuários com senhas iguais produzem hashes distintos.
  - **CA09.6**: Conclusão do formulário em `signup.html` redireciona para `signin.html`.
  - **Tasks**:
    - `TK09.1`: Adicionar model `User` no schema do Prisma e gerar migração.
    - `TK09.2`: Criar utilitário `utils/password.ts` com `hashPassword` e `verifyPassword`.
    - `TK09.3`: Criar rota `POST /api/users` com validação de cadastro.
    - `TK09.4`: Conectar formulário `front/js/signup.js` ao endpoint de criação de conta.

#### FT08 · Login, Sessão e Isolamento (Etapa 10)
- **US10**: *Como usuário cadastrado, quero autenticar com e-mail e senha, para permanecer conectado na plataforma.*
  - **CA10.1**: `POST /api/signin` com credenciais válidas responde 200 com token JWT assinado.
  - **CA10.2**: E-mail inexistente e senha incorreta produzem resposta 401 idêntica.
  - **CA10.3**: Requisições sem token para rotas protegidas respondem 401.
  - **CA10.4**: Token com assinatura adulterada ou expirado responde 401.
  - **CA10.5**: Front persiste token no `localStorage` e envia header `Authorization: Bearer <token>`.
  - **CA10.6**: Formato do cabeçalho validado pelo `bearerSchema` e descrito no OpenAPI.
  - **Tasks**:
    - `TK10.1`: Criar utilitário `utils/jwt.ts` (`signJwt`, `verifyJwt`).
    - `TK10.2`: Criar middleware `middlewares/isAuthenticated.ts` estendendo a tipagem de `Request`.
    - `TK10.3`: Criar rota `POST /api/signin` e controller de autenticação.
    - `TK10.5`: Criar `front/js/lib/auth.js` e injetar token nas requisições da camada de API.
    - `TK10.6`: Proteger rotas privadas e associar dados iniciais de seed a um proprietário.
    - `TK10.7`: Declarar `bearerSchema` e `cookieSessionSchema` em `schemas/auth.schema.ts`.
- **US11**: *Como usuário autenticado, quero ver apenas os meus hosts, para isolamento seguro do inventário.*
  - **CA11.1**: `GET /api/hosts` retorna apenas registros pertencentes ao usuário do token.
  - **CA11.2**: Consulta a ID de host de outra conta responde 404 Not Found.
  - **CA11.3**: Consulta ao histórico de pings de host de outro dono responde 404.
  - **CA11.4**: Campo `userId` é extraído do token e não pode ser sobrescrito pelo corpo.
  - **Tasks**:
    - `TK10.4`: Escopar queries (`read`, `readById`, `update`, `remove`) pelo par `id` + `userId`.

---

### EP04 · Fundação Técnica

#### FT09 · Arquitetura em Camadas e Tipos (Etapa 3)
- **US03**: *Como mantenedor, quero TypeScript e divisão em camadas, para alterar regras com segurança.*
  - **CA03.1**: Checagem de tipos `npm run typecheck` finaliza com 0 erros.
  - **CA03.2**: Migração total de arquivos de `back/src/` para TypeScript.
  - **CA03.3**: Roteadores declaram apenas método, rota, middlewares e handler.
  - **CA03.4**: Model desacoplado de objetos HTTP (`Request` e `Response`).
  - **CA03.5**: Erros tratados exclusivamente pelo `errorHandler` central.
  - **CA03.6**: Preservação total de contratos e status codes da etapa anterior.
  - **Tasks**:
    - `TK03.1`: Configurar `tsconfig.json` com `strict` e alias `@/*`.
    - `TK03.2`: Migrar entrypoint para `src/index.ts`.
    - `TK03.3`: Declarar tipos `Host` e `HostInput` em `types/`.
    - `TK03.4`: Criar model assíncrono `models/Host.ts`.
    - `TK03.5`: Criar controller HTTP `controllers/hosts.controller.ts`.
    - `TK03.6`: Criar classe `errors/HttpError.ts` e middlewares de erro.
    - `TK03.7`: Criar roteador modular `routes/hosts.routes.ts`.

#### FT10 · Validação de Entrada (Etapa 4)
- **US04**: *Como integrador, quero mensagens de erro com indicação precisa de campos inválidos.*
  - **CA04.1**: Erro de validação responde 400 com lista de issues estruturadas pelo Zod.
  - **CA04.2**: Cada issue explicita a fonte (`body`, `params`, `query`) e a propriedade.
  - **CA04.3**: Campo `address` aceita IPv4 válido ou nome de domínio RFC 1035.
  - **CA04.4**: Endereço contendo protocolo (`http://...`) responde 400.
  - **CA04.5**: Parâmetro `:id` não compatível com UUID responde 400.
  - **CA04.6**: Filtro de busca vazio (`?name=`) responde 400.
  - **CA04.7**: Controllers livres de condicionais manuais de validação de entrada.
  - **CA04.8**: Validação extensível para headers e cookies via `parseCookies`.
  - **Tasks**:
    - `TK04.1`: Criar middleware genérico `middlewares/validate.ts`.
    - `TK04.2`: Criar schemas de rota em `schemas/host.schema.ts`.
    - `TK04.3`: Tratar `issues` no `HttpError` e no manipulador de erros.
    - `TK04.4`: Criar utilitário `utils/cookies.ts`.

#### FT11 · Documentação da API (Etapa 5)
- **US05**: *Como consumidor da API, quero documentação Swagger navegável derivada dos schemas de validação.*
  - **CA05.1**: Interface Swagger UI acessível em `/api/docs`.
  - **CA05.2**: Especificação bruta OpenAPI 3 disponível em `/api/openapi.json`.
  - **CA05.3**: Formatos e restrições espelhados automaticamente dos schemas Zod.
  - **CA05.4**: Modificações nos schemas atualizam a documentação sem retrabalho.
  - **CA05.5**: Zero duplicação de regras entre código e documentação.
  - **Tasks**:
    - `TK05.1`: Criar conversor OpenAPI em `docs/openapi.ts` via `z.toJSONSchema`.
    - `TK05.2`: Criar rotas de documentação em `routes/docs.routes.ts`.

#### FT12 · Persistência de Dados com SQLite (Etapa 6)
- **US06**: *Como operador de rede, quero que os dados persistam após reinicialização do servidor.*
  - **CA06.1**: Script `npm run db:load` inicializa tabela e registros de semente.
  - **CA06.2**: Hosts persistem no banco relacional SQLite local.
  - **CA06.3**: Consultas executadas com parâmetros posicionais seguros (`?`).
  - **CA06.4**: Chaves primárias mantidas no padrão UUID v4.
  - **CA06.5**: Assinaturas e contratos de controladores preservados.
  - **Tasks**:
    - `TK06.1`: Criar conexão singleton `database/database.ts` sobre `node:sqlite`.
    - `TK06.2`: Criar scripts `migration.ts`, `seeders.ts` e `load.ts`.
    - `TK06.3`: Reescrever `models/Host.ts` com consultas SQL parametrizadas.

---

### EP05 · Qualidade e Operação

#### FT13 · Suíte de Testes e Cobertura (Etapa 12)
- **US13**: *Como pessoa desenvolvedora, quero suíte de testes automatizada para prevenir regressões.*
  - **CA13.1**: `npm test` executa testes unitários e de integração sem servidor de rede ativo.
  - **CA13.2**: Testes do front executados no JSDOM com mocks de `fetch`.
  - **CA13.3**: Execuções repetidas mantêm determinismo e idempotência.
  - **CA13.4**: Verificação de piso de cobertura de código falha sob métricas insuficientes.
  - **CA13.5**: Testes automatizados validam isolamento de hosts entre usuários.
  - **CA13.6**: Entrypoint `src/index.ts` exporta `app` sem abrir socket durante testes.
  - **CA13.7**: Teste de cabeçalho malformado e teste unitário de `parseCookies`.
  - **Tasks**:
    - `TK12.1`: Criar testes de unidade para `lib/ping.ts` e schemas de validação.
    - `TK12.2`: Criar testes de endpoints HTTP com Supertest em `src/routes.test.ts`.
    - `TK12.3`: Criar testes do front-end com Vitest e JSDOM (`format.js`, `api.js`).
    - `TK12.4`: Criar suíte de testes E2E com Playwright em `tests/monitor-app.spec.js`.
    - `TK12.5`: Configurar `vitest.config.js`, `playwright.config.js` e scripts de teste.
    - `TK12.6`: Criar testes de cookies e cabeçalhos malformados.

#### FT14 · Empacotamento e Deploy (Etapa 13)
- **US14**: *Como operador de deploy, quero empacotar front e back em contêineres Docker independentes orquestrados via Compose.*
  - **CA14.1**: `docker compose up --build` sobe simultaneamente API e front-end.
  - **CA14.2**: Migrações relacionais aplicadas automaticamente na inicialização.
  - **CA14.3**: Segredos e configurações injetados via variáveis de ambiente no Compose.
  - **CA14.4**: Processo da API executado sob usuário de baixa permissão (`node`).
  - **CA14.5**: Banco de dados SQLite persistido em volume nomeado Docker.
  - **CA14.6**: Imagem da API contém binário nativo `ping` instalado.
  - **CA14.7**: Servidor Nginx no front atua como proxy reverso para `/api`.
  - **Tasks**:
    - `TK13.1`: Criar `Dockerfile` multi-estágio da API.
    - `TK13.2`: Criar `Dockerfile` e `nginx.conf` para o front.
    - `TK13.3`: Configurar `.dockerignore` para ambos os projetos.
    - `TK13.4`: Criar `compose.yaml` com definição de serviços, rede e volume persistente.
