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
title: "InvestApp: Testes de software"
description: "Décima primeira etapa do InvestApp: testes de rotas com node:test e supertest, front-end com Vitest e mocks, e teste E2E com Playwright."
---

<!-- _class: lead -->

# InvestApp: Testes de software

Décima primeira etapa do InvestApp: testes de rotas com node:test e supertest, front-end com Vitest e mocks, e teste E2E com Playwright.

---

## Objetivo

- Entender o papel de **InvestApp: Testes de software** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-test`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US13 — Alterar sem quebrar o que já funciona · RNF04, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK12.1 · Instalar as suítes e criar os testes de unidade, TK12.2 · Criar `src/routes.test.ts` (Rotas com `supertest`), TK12.3 · Criar `public/js/services/api.test.js` (Front com Vitest e mocks)
- **Cobertura**
- **Executando**
- **O diff que importa**
- **Conceitos abordados**

---

## Contexto da Aula

- Etapa 12 de 13 · Nível Avançado · TypeScript · `node:test` · Supertest · Vitest · Playwright
- Esta etapa transforma o roteiro manual em suíte automatizada.
- O back cobre as rotas com `supertest`, o front testa a camada de `fetch` com Vitest e mocks, e o Playwright valida o fluxo real no navegador.
- Cada camada responde por um tipo de risco, e o custo cresce de cima para baixo: os oito testes de unidade rodam em 145 ms, os doze de rota em quase 800.
- Concentrar tudo em E2E deixaria a suíte lenta e instável; ficar só na unidade não provaria que API, banco e tela conversam:

---

## Requisitos, histórias e critérios

- Épico EP05 · Qualidade e Operação › Feature FT13 · Suíte de testes e cobertura
- Nenhum requisito funcional entra aqui: o comportamento não muda.
- O que entra é a garantia de que ele continua valendo depois da próxima alteração.

---

## Requisitos, histórias e critérios: Tabela

- RNF04 Qualidade & Testabilidade: testes de unidade, de rotas, de front com mock e E2E, além de cobertura | atendido

---

## US13 — Alterar sem quebrar o que já funciona · RNF04

- Como pessoa que mantém a aplicação,
- quero uma suíte que rode em segundos e cubra rotas, regras e fluxo de tela,
- para descobrir uma regressão antes de publicá-la.

---

## US13 — Alterar sem quebrar o que já funciona · RNF04: Exemplo

```txt
Cenário: CA13.1 - Testes de servidor sem infraestrutura
  Quando executo npm test
  Então unidade e rotas são executadas
  E nenhuma porta é aberta
  E nenhum e-mail é enviado
Cenário: CA13.2 - Testes de front sem navegador
  Quando executo npm run front:test
  Então os módulos do front são exercitados em JSDOM
  E fetch e localStorage são substituídos por dublês
Cenário: CA13.3 - A suíte pode repetir
  Quando executo npm test duas vezes seguidas
  Então as duas execuções passam
```

---

## Tasks da etapa

- As tarefas abaixo implementam US13 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK12.1 · Instalar as suítes e criar os testes de unidade: Funções puras: schemas do Zod e formatação: sem servidor nem banco.
- TK12.2 · Criar `src/routes.test.ts`: Testes das rotas HTTP com `node:test` e `supertest`.
- TK12.3 · Criar `public/js/services/api.test.js`: Testes do front com Vitest, JSDOM e mocks de `fetch` e `localStorage`.
- TK12.4 · Criar `tests/invest-app.spec.js`: Teste End-to-End do fluxo completo com Playwright.

---

## Estrutura da aplicação

- Os testes moram ao lado do que testam, com uma exceção: o E2E fica em `tests/`, porque o Playwright tem executor e configuração próprios.

---

## O que muda nesta etapa

- Comparando com a etapa anterior, o código da aplicação praticamente não muda: entram quatro arquivos de teste, a configuração do Playwright e cinco...

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK12.1 · Instalar as suítes e criar os testes de unidade

- A base da pirâmide são as funções que não dependem de nada: entra um valor, sai outro.
- Sem servidor, sem banco, sem navegador: e por isso rodam em milissegundos.
- O melhor candidato do servidor é o schema do Zod.
- Ele é uma função pura disfarçada: `safeParse` recebe um objeto e devolve `success` mais a lista de issues.
- Dá para testar as três fontes de dados da etapa 4 sem subir o Express uma única vez.

---

## TK12.1 · Instalar as suítes e criar os testes de unidade: Exemplo

```bash
npm install -D supertest @types/supertest vitest jsdom @playwright/test
```

---

## TK12.2 · Criar `src/routes.test.ts` (Rotas com `supertest`)

- O teste de rotas roda no executor nativo do Node (`node:test`, importado na linha 3) e usa o `supertest` para fazer requisições sem abrir porta nem...
- É para isso que o `src/index.ts` desta etapa passou a exportar o app e só chamar `listen` quando executado direto.
- As linhas 10 a 24 resolvem o problema mais chato de testar autenticação.
- O `createValidUser` gera um e-mail único a cada execução, com `randomBytes` na linha 11, para que rodar a suíte duas vezes não esbarre no `@unique` do...
- O `before` das linhas 31 a 43 monta o cenário uma vez: cria o usuário, pega o token e lê o id de uma categoria: tudo pela própria API, sem tocar no...

---

## TK12.2 · Criar `src/routes.test.ts` (Rotas com `supertest`): Exemplo

```bash
npm install -D supertest vitest jsdom @playwright/test
```

---

## TK12.3 · Criar `public/js/services/api.test.js` (Front com Vitest...

- O front é testado sem servidor, sem banco e sem navegador de verdade: o Vitest roda em JSDOM, e o que estiver fora do módulo sob teste é substituído...
- A linha 14 é o centro da técnica: `vi.spyOn(globalThis, 'fetch')` troca o `fetch` real por uma função controlada que devolve o que o teste mandar.
- A partir daí, o teste não verifica o que a API respondeu: verifica o que o front pediu.
- A asserção das linhas 22 a 29 confere a URL, o método, o corpo serializado e os cabeçalhos, um a um.
- O segundo teste, nas linhas 32 a 50, é a prova da regra aprendida na etapa 11: ao enviar `FormData`, o objeto `headers` esperado tem só...

---

## TK12.4 · Criar `tests/invest-app.spec.js` (Fluxo completo com...

- O E2E é o único teste que abre um navegador de verdade e percorre a aplicação como um usuário: um teste, cinco etapas, do cadastro à exclusão.
- O arquivo cobre a jornada inteira em blocos comentados: cadastro nas linhas 26 a 32, login nas linhas 35 a 39, criação de investimento nas linhas 42 a...
- Cada bloco termina em um `expect` sobre algo visível na tela: é isso que diferencia o E2E dos testes anteriores: ele valida o resultado pelos olhos do...
- Repare como os elementos são localizados: `page.getByRole('textbox', { name: 'Nome' })` na linha 27, `getByRole('button', { name: 'Cadastrar' })` na...
- Buscar por papel e nome acessível, e não por classe CSS, faz o teste sobreviver a mudanças de estilo: e, de quebra, cobra do HTML rótulos corretos.

---

## TK12.5 · Criar `playwright.config.js` e os scripts do `package.json`

- A configuração do Playwright define onde estão os testes e em que navegadores rodar.
- O `testDir` da linha 16 aponta para `./tests`, o `baseURL` da linha 32 é o que permite escrever `page.goto('/signup.html')` sem repetir o domínio, e o...
- O `trace: 'on-first-retry'` da linha 35 vale destacar: quando um teste falha e é repetido, o Playwright grava um rastro completo: capturas, DOM e rede:...
- É a diferença entre "falhou" e "falhou por isto".
- O `src/index.ts` também muda, e é o que torna a TK12.2 possível.

---

## Cobertura

- Cobertura responde a uma pergunta só: que linhas os testes executaram. Não diz que o código está certo: diz onde ninguém olhou.
- É um detector de pontos cegos, não uma nota.
- O servidor usa o medidor embutido no Node, sem instalar nada:
- Três detalhes desse comando importam.
- O `--test-coverage-exclude` tira os próprios arquivos de teste da conta, senão eles inflariam o número medindo a si mesmos.

---

## Cobertura: Exemplo 1

```txt
ℹ file                        | line % | branch % | funcs % | uncovered lines
ℹ  middlewares                |        |          |         |
ℹ   validate.ts               | 100.00 |   100.00 |  100.00 |
ℹ   isAuthenticated.ts        |  95.65 |    87.50 |  100.00 | 15
ℹ  models                     |        |          |         |
ℹ   Investment.ts             |  81.73 |    45.45 |   66.67 | 14-16 36-37 43-53 56-58
ℹ   Image.ts                  |  85.00 |   100.00 |   33.33 | 6-7 9
ℹ all files                   |  87.12 |    75.21 |   65.63 |
```

---

## Cobertura: Exemplo 2

```bash
npm install -D @vitest/coverage-v8
```

---

## Executando

- Entre no exemplo desta etapa:
- Rode os testes de unidade e de rotas:
- Rode os testes do front com Vitest: unidade e camada de API:
- Meça a cobertura dos dois lados:
- Suba a aplicação em um terminal e rode o E2E em outro: o Playwright precisa do

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-test
   npm install
```

---

## Executando: Exemplo 2

```bash
   npm test
```

---

## O diff que importa

- Compare a etapa de upload com a etapa de testes olhando scripts e diretórios novos:
- Na revisão, o diff deve ser quase todo de arquivos novos.
- Os sinais a procurar são os quatro arquivos da tabela acima, mais os quatro scripts do `package.json`: e uma única alteração em código de produção: o...
- Se aparecer mudança dentro de `src/controllers/` ou `src/models/`, vale desconfiar: testar uma aplicação não deveria exigir reescrevê-la.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-upload \
  examples/courses/expressjs/projects/invest-app-test || true
```

---

## Conceitos abordados

- Testes de unidade sobre funções puras: schemas do Zod e formatação
- Testes de rotas com `node:test` e `supertest`, sem abrir porta
- Dados de teste isolados por execução com e-mails aleatórios
- Front-end com Vitest, JSDOM e mocks de `fetch` e `localStorage`
- Teste E2E com Playwright e localizadores por papel acessível

---

## Próxima etapa

- InvestApp: Docker: empacotar a aplicação final em uma imagem reproduzível.

---

## Arquivos-Chave da Aula

- **src/schemas/investment.schema.test.ts**: `examples/courses/expressjs/projects/invest-app-test/src/schemas/investment.schema.test.ts` (linhas marcadas `24-56`)
- **public/js/lib/format.test.js**: `examples/courses/expressjs/projects/invest-app-test/public/js/lib/format.test.js` (linhas marcadas `7-9,23-28`)
- **src/routes.test.ts**: `examples/courses/expressjs/projects/invest-app-test/src/routes.test.ts` (linhas marcadas `3,7,10-24,31-43`)
- **src/routes.test.ts: o teste de isolamento**: `examples/courses/expressjs/projects/invest-app-test/src/routes.test.ts`
- **public/js/services/api.test.js**: `examples/courses/expressjs/projects/invest-app-test/public/js/services/api.test.js` (linhas marcadas `7-10,14,22-29,46-48,62`)
- **tests/invest-app.spec.js**: `examples/courses/expressjs/projects/invest-app-test/tests/invest-app.spec.js` (linhas marcadas `26-32,35-39,42-52`)

---

## Resumo da Aula

- **InvestApp: Testes de software** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
