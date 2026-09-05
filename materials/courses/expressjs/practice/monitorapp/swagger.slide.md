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
title: "MonitorApp: Documentação da API"
description: "Quinta etapa do MonitorApp: documento OpenAPI 3 gerado a partir dos mesmos schemas Zod que validam as requisições, servido pelo Swagger UI."
---

<!-- _class: lead -->

# MonitorApp: Documentação da API

Quinta etapa do MonitorApp: documento OpenAPI 3 gerado a partir dos mesmos schemas Zod que validam as requisições, servido pelo Swagger UI.

---

## Objetivo

- Entender o papel de **MonitorApp: Documentação da API** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-swagger`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US05 — Integrar sem ler o código · RNF07, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK05.1 · Criar `src/docs/openapi.ts` (O documento derivado), TK05.2 · Criar `src/routes/docs.routes.ts` (As duas portas de entrada)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 5 de 13 · Nível Intermediário · OpenAPI 3 · Swagger UI
- A etapa 4 escreveu as regras da API em schemas Zod.
- Essas mesmas regras já são, na prática, a documentação do contrato: só estão em um formato que só o servidor lê. Esta etapa as publica.
- A escolha central aqui não é qual biblioteca usar: é não escrever o contrato duas vezes.
- Um documento OpenAPI mantido à mão desatualiza no primeiro dia corrido.

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT11 · Documentação da API

---

## Requisitos, histórias e critérios: Tabela

- RNF07 Documentação da API: OpenAPI 3 derivado dos schemas e Swagger UI | atendido

---

## US05 — Integrar sem ler o código · RNF07

- Como pessoa que consome a API,
- quero um documento navegável com todos os endpoints e formatos,
- para integrar sem abrir o repositório do servidor.

---

## US05 — Integrar sem ler o código · RNF07: Exemplo

```txt
Cenário: CA05.1 - A interface navegável
  Quando abro http://localhost:3000/api/docs
  Então vejo os endpoints do recurso hosts com os corpos e status codes
Cenário: CA05.2 - O documento cru
  Quando envio GET /api/openapi.json
  Então recebo um documento OpenAPI 3 válido
Cenário: CA05.3 - Documentação e validação concordam
  Dado que o schema exige nome com no mínimo 3 caracteres
  Então o documento OpenAPI declara minLength 3 para o mesmo campo
Cenário: CA05.4 - Mudar o schema muda a documentação
  Quando altero uma regra em host.schema.ts
```

---

## Tasks da etapa

- TK05.1 · Criar `src/docs/openapi.ts`: converter os schemas Zod em JSON Schema e montar o documento.
- TK05.2 · Criar `src/routes/docs.routes.ts`: servir o JSON cru e a interface do Swagger UI.

---

## Estrutura da aplicação

- Esta é a etapa com o menor delta do trilho: duas pastas novas, `docs/` e mais um arquivo em `routes/`, e nenhuma linha alterada em `schemas/`,...
- O tamanho da mudança é o próprio argumento da etapa: documentar não deveria custar reescrever o contrato.
- O desenho abaixo é o que justifica essa economia.
- O `host.schema.ts` da etapa 4 continua sendo o único lugar onde as regras existem, e agora alimenta dois consumidores: o middleware que recusa...
- Repare que as duas pontas da direita nunca voltam para o schema: nada do que é publicado pode divergir do que valida, porque não existe caminho de...

---

## O que muda nesta etapa?

- Nada em `schemas/`, `models/`, `controllers/` ou `routes/hosts.routes.ts` foi tocado.
- É o indicador de que a documentação foi derivada, e não duplicada.

---

## O que muda nesta etapa?: Tabela

- o contrato existe só no código: o contrato é publicado em `/api/docs`
- o `requests.http` como única referência externa: o `requests.http` e o documento OpenAPI
- dois roteadores registrados no app: três: `docsRoutes` entra antes de `hostRoutes`
- —: `swagger-ui-express` nas dependências

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Quinta etapa do MonitorApp: documento OpenAPI 3 gerado a partir dos mesmos schemas Zod que validam as requisições, servido pelo Swagger UI.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK05.1 · Criar `src/docs/openapi.ts` (O documento derivado)

- O arquivo tem três partes. A primeira, nas linhas 9 a 18, são as duas funções que fazem a conversão.
- A `toSchema` da linha 9 usa `z.toJSONSchema()`: desde o Zod 4 essa conversão é nativa, sem biblioteca auxiliar.
- O parâmetro `target: 'openapi-3.0'` importa: o OpenAPI 3.0 usa um dialeto próprio de JSON Schema, e sem ele campos como `nullable` sairiam no formato...
- A `shapeOf` da linha 14 resolve um detalhe da nossa modelagem: como cada schema de rota envelopa as fontes (`{ body }`, `{ params }`, `{ query }`), é...
- A segunda parte, nas linhas 20 a 58, monta os blocos reutilizáveis.

---

## TK05.1 · Criar `src/docs/openapi.ts` (O documento derivado): Exemplo

```bash
npm install swagger-ui-express
npm install -D @types/swagger-ui-express
```

---

## TK05.2 · Criar `src/routes/docs.routes.ts` (As duas portas de entrada)

- O roteador é curto e serve dois públicos diferentes.
- A linha 9 devolve o documento cru em `GET /api/openapi.json`: é o que ferramentas consomem: Insomnia e Postman importam esse arquivo, e geradores de...
- A linha 12 monta a interface navegável em `GET /api/docs`, que é o que uma pessoa abre.
- No `index.ts`, o `docsRoutes` é registrado antes do `hostRoutes`.
- A ordem não muda nada hoje, porque os caminhos não colidem, mas mantém a documentação fora do alcance de qualquer rota curinga que venha a existir depois.

---

## Executando

- Instale a dependência nova e suba a API:
- Abra a documentação navegável em http://localhost:3000/api/docs.
- Baixe o documento cru:
- O documento OpenAPI descreve formatos: tipos, obrigatoriedade, status codes.
- Ele não descreve decisões: por que um host de outra conta responde `404` e não `403`, ou por que uma medição com falha responde `201`.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-swagger/back
   npm install
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   curl http://localhost:3000/api/openapi.json | head -40
```

---

## Conceitos abordados

- Uma fonte da verdade para validar e para documentar
- Documento cru para ferramentas, interface navegável para pessoas
- Blocos reutilizáveis (`idParameter`, `jsonBody`, `validationError`) dentro do documento
- Documentação que acompanha a mudança de schema sem edição manual

---

## Próxima etapa

- MonitorApp: SQLite nativo: o array em memória sai e o banco relacional entra, ainda sem ORM.

---

## Arquivos-Chave da Aula

- **back/src/docs/openapi.ts**: `examples/courses/expressjs/projects/monitor-app-swagger/back/src/docs/openapi.ts` (linhas marcadas `9-18`)
- **back/src/routes/docs.routes.ts**: `examples/courses/expressjs/projects/monitor-app-swagger/back/src/routes/docs.routes.ts` (linhas marcadas `9,12`)
- **back/src/index.ts**: `examples/courses/expressjs/projects/monitor-app-swagger/back/src/index.ts` (linhas marcadas `17-18`)

---

## Resumo da Aula

- **MonitorApp: Documentação da API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
