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
title: "MonitorApp: Validação"
description: "Quarta etapa do MonitorApp: validação estrita de body, query e params com schemas Zod, incluindo a regra que define o que é um endereço de host válido."
---

<!-- _class: lead -->

# MonitorApp: Validação

Quarta etapa do MonitorApp: validação estrita de body, query e params com schemas Zod, incluindo a regra que define o que é um endereço de host válido.

---

## Objetivo

- Entender o papel de **MonitorApp: Validação** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-validation`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US04 — Saber exatamente o que corrigir · RNF01, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK04.1 · Criar `src/middlewares/validate.ts` (O middleware genérico), TK04.2 · Criar `src/schemas/host.schema.ts` (As regras do recurso), TK04.3 · Acrescentar `issues` ao `HttpError` e ao `errorHandler`
- **Testando**
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 4 de 13 · Nível Intermediário · Zod · Validação de entrada
- Até aqui o controller confiava no cliente.
- O `req.body as HostInput` da etapa 3 era uma promessa ao compilador, não uma verificação: em tempo de execução, qualquer JSON passava.
- Esta etapa substitui essa promessa por um schema que roda antes do handler.
- E o MonitorApp tem uma regra própria para validar, que nenhum tipo do TypeScript consegue expressar: o que é um endereço de host válido.

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT10 · Validação de entrada

---

## Requisitos, histórias e critérios: Tabela

- RNF01 Validação Estrita de Dados: schemas Zod para `body`, `query` e `params` | atendido
- RF01 Gestão de Hosts: a regra de formato do endereço | reforçado

---

## US04 — Saber exatamente o que corrigir · RNF01

- Como pessoa que integra com a API,
- quero que a resposta de erro diga qual campo está errado e por quê,
- para corrigir a requisição sem adivinhar.

---

## US04 — Saber exatamente o que corrigir · RNF01: Exemplo

```txt
Cenário: CA04.1 - A resposta de erro descreve o problema
  Quando envio POST /api/hosts com o nome vazio
  Então recebo o status 400
  E o corpo traz a lista issues com a mensagem do campo
Cenário: CA04.2 - Cada issue aponta a origem do dado
  Quando envio uma requisição inválida
  Então cada issue tem um path começando por body, params ou query
Cenário: CA04.3 - O endereço aceita IP e domínio
  Quando envio address igual a "8.8.8.8"
  Então recebo o status 201
  E quando envio address igual a "www.exemplo.com"
  Então também recebo o status 201
```

---

## Tasks da etapa

- TK04.1 · Criar `src/middlewares/validate.ts`: um middleware genérico que recebe qualquer schema.
- TK04.2 · Criar `src/schemas/host.schema.ts`: um schema por rota, composto de partes reutilizáveis.
- TK04.3 · Acrescentar `issues` ao `HttpError` e ao `errorHandler`: a lista de problemas chega ao cliente.

---

## Estrutura da aplicação

- Duas pastas mudam e duas nascem.
- O `middlewares/validate.ts` e o `schemas/host.schema.ts` são os arquivos novos; o `errors/HttpError.ts` e o `middlewares/errorHandlers.ts` ganham o...
- Models e controllers ficam intactos.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Quarta etapa do MonitorApp: validação estrita de body, query e params com schemas Zod, incluindo a regra que define o que é um endereço de host válido.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- erro genérico `"Unable to create host"`: `"Validation error"` com a lista `issues`
- id inexistente e id inválido, ambos `404`: id malformado responde `400`; id válido e ausente, `404`
- qualquer texto aceito em `address`: IPv4 ou nome de domínio, e nada mais

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Quarta etapa do MonitorApp: validação estrita de body, query e params com schemas Zod, incluindo a regra que define o que é um endereço de host válido.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK04.1 · Criar `src/middlewares/validate.ts` (O middleware genérico)

- Um middleware só, para todas as rotas.
- A função das linhas 11 a 23 recebe um schema e devolve o middleware: é o padrão de fábrica que permite escrever `validate(createHostSchema)` na rota.
- A decisão de projeto está nas linhas 12 a 16: o schema não valida apenas o corpo, valida as três fontes de uma vez, montando um objeto com `body`,...
- É isso que faz o `path` de cada issue começar pela origem do dado, e é isso que permite a uma rota como o `PUT` validar o parâmetro da URL e o corpo no...
- A linha 18 usa `safeParse`, e não `parse`: em vez de o Zod lançar a sua própria exceção, o resultado é inspecionado e convertido em `HttpError`: o...

---

## TK04.1 · Criar `src/middlewares/validate.ts` (O middleware genérico): Exemplo

```bash
npm install zod
```

---

## TK04.2 · Criar `src/schemas/host.schema.ts` (As regras do recurso)

- O arquivo tem duas metades. A primeira declara as três fontes possíveis; a segunda compõe, a partir delas, um schema por rota.
- O trecho destacado nas linhas 8 a 14 é o coração desta etapa: a regra que define o que é um endereço.
- Um host de rede é identificado por um IPv4 ou por um nome de domínio: nunca por uma URL completa, porque o `ping` opera sobre host, não sobre caminho HTTP.
- O `.refine()` da linha 11 aceita as duas formas: `z.ipv4()` cobre o endereço numérico, e a expressão regular da linha 12 cobre o nome de domínio,...
- Aceitar `https://exemplo.com` aqui adiaria o erro para o momento da medição, na etapa 8, quando ele seria muito mais difícil de explicar a quem...

---

## TK04.3 · Acrescentar `issues` ao `HttpError` e ao `errorHandler`

- O `HttpError` ganha um terceiro campo, opcional.
- A lista vem direto do Zod e é repassada sem transformação: o formato dele já é bom o suficiente para um cliente destacar campos de formulário.
- No manipulador de erros, o trecho das linhas 14 a 18 acrescenta `issues` à resposta apenas quando ela existe.
- O espalhamento condicional evita uma chave `issues: undefined` em toda resposta de erro comum, mantendo o corpo do `404` tão enxuto quanto era antes.

---

## Testando

- Nesta seção, testamos a validação de endereços IP/domínio e identificadores UUID no MonitorApp.
- Envie um endereço no formato incorreto de URL com protocolo (`https://exemplo.com/status`).
- A API valida o campo via Zod e responde com status `400 Bad Request`:
- { "name": "Portal", "address": "https://exemplo.com/status" }
- { "error": "Validation error", "issues": [ { "code": "custom", "path": ["body", "address"], "message": "O endereço deve ser um IPv4 ou um nome de...

---

## Testando: Exemplo 1

```txt
  ### Testar validação de endereço inválido (URL em vez de IP/domínio)
  POST http://localhost:3000/api/hosts
  Content-Type: application/json
  {
    "name": "Portal",
    "address": "https://exemplo.com/status"
  }
```

---

## Testando: Exemplo 2

```txt
  ### Testar ID inválido na rota
  GET http://localhost:3000/api/hosts/abc
```

---

## Executando

- Instale o Zod e suba a API:
- Suba o front, que não mudou:
- Rode o `requests.http`: os blocos de erro agora respondem com `issues`.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-validation/back
   npm install
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-validation/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- Middleware de fábrica: uma função que recebe schema e devolve middleware
- Validar `body`, `query` e `params` na mesma passada
- Campo opcional que não pode ser vazio

---

## Próxima etapa

- MonitorApp: Documentação da API: o mesmo schema que valida passa a documentar.

---

## Arquivos-Chave da Aula

- **back/src/middlewares/validate.ts**: `examples/courses/expressjs/projects/monitor-app-validation/back/src/middlewares/validate.ts` (linhas marcadas `11-20`)
- **back/src/schemas/host.schema.ts**: `examples/courses/expressjs/projects/monitor-app-validation/back/src/schemas/host.schema.ts` (linhas marcadas `8-14`)
- **back/src/routes/hosts.routes.ts**: `examples/courses/expressjs/projects/monitor-app-validation/back/src/routes/hosts.routes.ts` (linhas marcadas `16-20`)
- **back/src/errors/HttpError.ts**: `examples/courses/expressjs/projects/monitor-app-validation/back/src/errors/HttpError.ts` (linhas marcadas `3,8`)
- **back/src/middlewares/errorHandlers.ts**: `examples/courses/expressjs/projects/monitor-app-validation/back/src/middlewares/errorHandlers.ts` (linhas marcadas `14-18`)

---

## Resumo da Aula

- **MonitorApp: Validação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
