---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: Testes de software"
description: "Décima segunda etapa do MonitorApp: testes de unidade com node:test, testes de rotas com supertest, testes de front com Vitest e jsdom, e o fluxo completo em Playwright."
---

<!-- _class: lead -->

# MonitorApp: Testes de software

Décima segunda etapa do MonitorApp: testes de unidade com node:test, testes de rotas com supertest, testes de front com Vitest e jsdom, e o fluxo completo em Playwright.

---

## Objetivo

- Entender o papel de **MonitorApp: Testes de software** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/monitor-app-test`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US13 — Alterar sem quebrar o existente · RNF08, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK12.1 · Escrever os testes de unidade, TK12.2 · Escrever `src/routes.test.ts` (O contrato HTTP), TK12.3 · Escrever os testes de front (Vitest e jsdom)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 12 de 13 · Nível Avançado · `node:test` · `supertest` · Vitest · Playwright
- Onze etapas depois, o MonitorApp tem quatro entidades, dez rotas, uma chamada de sistema, um agendador e um fluxo de eventos.
- Mexer em qualquer uma dessas peças hoje é um ato de fé.
- Esta etapa troca a fé por evidência, em quatro níveis.
- E o critério para decidir o que testar em cada nível não é cobertura: é o que dói mais quando quebra.

---

## Requisitos, histórias e critérios

- Épico EP05 · Qualidade e Operação › Feature FT13 · Suíte de testes e cobertura

---

## Requisitos, histórias e critérios: Tabela

- RNF08 Qualidade & Testabilidade: unidade, rotas, front e E2E | atendido
- RF07 Isolamento por Dono: teste provando que uma conta não vê a outra | verificado
- RNF04 Segurança na Chamada de Sistema: teste provando que o endereço não vira comando | verificado

---

## US13 — Alterar sem quebrar o existente · RNF08

- Como pessoa desenvolvedora,
- quero uma suíte que exercite as regras e o contrato HTTP,
- para perceber uma regressão antes que ela chegue a quem usa.

---

## US13 — Alterar sem quebrar o existente · RNF08: Exemplo

```txt
Cenário: CA13.1 - A suíte roda sozinha
  Quando executo npm test na pasta back
  Então os testes rodam sem servidor de pé
  E sem o agendador disparando pings
Cenário: CA13.2 - O front é testado fora do navegador
  Quando executo npm test na pasta front
  Então os módulos rodam em jsdom
  E o fetch é substituído por um dublê
Cenário: CA13.3 - A suíte é repetível
  Quando executo npm test duas vezes seguidas
  Então nenhum teste falha por e-mail já cadastrado
```

---

## Tasks da etapa

- TK12.1 · Escrever os testes de unidade: `lib/ping.ts` e `schemas/host.schema.ts`.
- TK12.2 · Escrever `src/routes.test.ts`: o contrato HTTP inteiro com `supertest`.
- TK12.3 · Escrever os testes de front: `format.js` e `api.js` no Vitest.
- TK12.4 · Escrever o fluxo completo em `tests/monitor-app.spec.js`: Playwright.
- TK12.5 · Criar as configurações: `vitest.config.js`, `playwright.config.js` e os scripts.

---

## Estrutura da aplicação

- Os testes ficam ao lado do código que exercitam: `ping.test.ts` mora em `lib/`, `format.test.js` mora em `lib/` do front —, com duas exceções...
- Os quatro níveis não testam as mesmas coisas com granularidades diferentes: cada um protege algo que o anterior não alcança.
- O diagrama liga cada nível ao tipo de defeito que só ele pega.
- A ordem também é a do custo de diagnóstico.
- Um teste de unidade vermelho aponta a função; um E2E vermelho diz apenas que a jornada quebrou, e descobrir onde é trabalho manual.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Décima segunda etapa do MonitorApp: testes de unidade com node:test, testes de rotas com supertest, testes de front com Vitest e jsdom, e o fluxo...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- nenhum arquivo de teste: seis arquivos, em quatro níveis
- —: `supertest`, `vitest`, `jsdom` e `@playwright/test`

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Décima segunda etapa do MonitorApp: testes de unidade com node:test, testes de rotas com supertest, testes de front com Vitest e jsdom, e o fluxo...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK12.1 · Escrever os testes de unidade

- O teste de unidade cobre o que não passa por HTTP. No MonitorApp há dois lugares assim, e não por acaso são os dois de maior risco.
- O `ping.test.ts` protege a chamada de sistema. O segundo caso é o que mais importa: um endereço com `;` embutido não pode virar comando.
- Se alguém trocar `execFile` por `exec` em uma refatoração, este teste falha: e é a única barreira automática contra uma injeção de comando no projeto.
- O `host.schema.test.ts` protege a regra de endereço.
- Ela é uma expressão regular combinada com um validador de IP: o tipo de código que quebra silenciosamente quando alguém tenta "melhorar" o padrão.

---

## TK12.1 · Escrever os testes de unidade: Exemplo

```bash
npm install -D supertest @types/supertest @playwright/test
```

---

## TK12.2 · Escrever `src/routes.test.ts` (O contrato HTTP)

- O teste de rotas é o mais valioso da suíte: ele exercita router, middlewares, controller, model e banco de uma vez, verificando exatamente o que a...
- Para isso o `index.ts` precisou mudar. As linhas 39 a 46 passaram a chamar `listen` somente quando o arquivo é executado diretamente.
- Importado por um teste, o `app` é usado em memória pelo `supertest`: nenhuma porta é aberta, nenhum agendador dispara `ping` de verdade, e vários...
- O `createValidUser` das linhas 10 a 18 resolve o critério `CA13.3`.
- O e-mail é `@unique` no banco, então um valor fixo faria a segunda execução da suíte falhar com `409`.

---

## TK12.2 · Escrever `src/routes.test.ts` (O contrato HTTP): Exemplo

```bash
npm test
npm run coverage
```

---

## TK12.3 · Escrever os testes de front (Vitest e jsdom)

- O `format.test.js` cobre as duas funções puras do front.
- O caso mais instrutivo é o de `formatLatency(0)`: zero é uma medição válida e precisa virar `"0 ms"`, não `"—"`.
- Uma verificação escrita como `latency ? …: '—'` passaria despercebida na revisão e falharia aqui.
- O `api.test.js` testa a camada que monta as requisições: sem rede.
- O `beforeEach` substitui o `fetch` global por um dublê (`vi.fn`), e cada teste inspeciona o que teria sido enviado.

---

## TK12.3 · Escrever os testes de front (Vitest e jsdom): Exemplo

```bash
npm install -D vitest @vitest/coverage-v8 jsdom
```

---

## TK12.4 · Escrever o fluxo completo em Playwright

- O E2E não repete o que os níveis anteriores já cobrem.
- Ele testa o que só existe quando tudo está junto: as telas, a sessão no `localStorage`, o proxy do Vite e a API, em um navegador de verdade.
- O teste das linhas 22 a 55 percorre a jornada inteira em uma passada: cadastro, login, cadastro de host com tags, histórico, medição sob demanda e saída.
- Os seletores usam `getByRole`, que encontra elementos pelo papel de acessibilidade e pelo rótulo visível: o teste quebra se o botão sumir, mas não se a...
- O segundo teste, nas linhas 57 a 61, é o mais curto e prova o guarda do front: abrir a página privada sem token leva ao login.

---

## Executando

- Testes da API:
- Testes do front:
- E2E: precisa dos dois servidores no ar, em outros terminais:
- Um teste de unidade que valida o schema não percebe que a rota esqueceu de chamar o `validate`.
- Um teste de rota que passa não garante que o botão da tela chama a rota certa.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/monitor-app-test/back
   npm install
   npm run db:migrate
   npm test
   npm run coverage
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/express/projects/monitor-app-test/front
   npm install
   npm test
   npm run coverage
```

---

## Conceitos abordados

- Export condicional do `app` para permitir importação
- Dados únicos por execução como condição de repetibilidade
- Asserção de ausência para verificar isolamento por dono
- Dublê de `fetch` para testar a requisição sem rede
- Limite de cobertura como porta de qualidade

---

## Próxima etapa

- MonitorApp: Docker: duas imagens, Compose e o Nginx no lugar do proxy do Vite.

---

## Arquivos-Chave da Aula

- **back/src/lib/ping.test.ts**: `examples/courses/express/projects/monitor-app-test/back/src/lib/ping.test.ts` (linhas marcadas `14-20`)
- **back/src/schemas/host.schema.test.ts**: `examples/courses/express/projects/monitor-app-test/back/src/schemas/host.schema.test.ts` (linhas marcadas `11-25`)
- **back/src/index.ts**: `examples/courses/express/projects/monitor-app-test/back/src/index.ts` (linhas marcadas `37-48`)
- **back/src/routes.test.ts**: `examples/courses/express/projects/monitor-app-test/back/src/routes.test.ts` (linhas marcadas `10-18,33-49`)
- **back/src/routes.test.ts: o isolamento por dono**: `examples/courses/express/projects/monitor-app-test/back/src/routes.test.ts` (linhas marcadas `115-124`)
- **front/js/lib/format.test.js**: `examples/courses/express/projects/monitor-app-test/front/js/lib/format.test.js` (linhas marcadas `10-12`)

---

## Resumo da Aula

- **MonitorApp: Testes de software** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
