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
title: "InvestApp: Documentação da API"
description: "Quinta etapa do InvestApp: documentação OpenAPI gerada a partir dos schemas Zod e servida com Swagger UI, sem duplicar o contrato."
---

<!-- _class: lead -->

# InvestApp: Documentação da API

Quinta etapa do InvestApp: documentação OpenAPI gerada a partir dos schemas Zod e servida com Swagger UI, sem duplicar o contrato.

---

## Objetivo

- Entender o papel de **InvestApp: Documentação da API** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-swagger`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US05 — Integrar sem ler o código · RNF07, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK05.1 · Instalar o Swagger UI e criar `src/docs/openapi.ts`, TK05.2 · Criar `src/routes/docs.routes.ts` (A UI e o documento cru)
- **O que a documentação herda dos schemas**
- **Executando**
- **Testando**
- **O diff que importa**

---

## Contexto da Aula

- Etapa 5 de 13 · Nível Intermediário · TypeScript · Express.js · Zod · OpenAPI
- A etapa anterior transformou o contrato da API em código executável.
- Esta etapa faz esse mesmo contrato virar documentação navegável: sem escrevê-lo uma segunda vez.
- Documentação de API costuma nascer certa e envelhecer errada.
- O motivo é quase sempre o mesmo: ela é escrita em outro lugar que não o código.

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT11 · Documentação da API

---

## Requisitos, histórias e critérios: Tabela

- RNF07 Documentação da API: documento OpenAPI 3 gerado dos schemas e servido em interface web | atendido

---

## US05 — Integrar sem ler o código · RNF07

- Como pessoa desenvolvedora que vai consumir a API,
- quero uma referência navegável e sempre atualizada das rotas,
- para integrar sem ler o código-fonte nem perguntar a alguém.

---

## US05 — Integrar sem ler o código · RNF07: Exemplo

```txt
Cenário: CA05.1 - A documentação é navegável
  Quando acesso /api/docs
  Então vejo as cinco rotas de investimento
  E consigo expandir cada uma para ver corpo, parâmetros e respostas
Cenário: CA05.2 - O contrato é exportável
  Quando acesso /api/openapi.json
  Então recebo um documento OpenAPI 3 válido
  E consigo importá-lo em outra ferramenta
Cenário: CA05.3 - As regras vêm dos schemas
  Quando comparo o documento com investment.schema.ts
  Então minLength, format uuid e a lista de required são os mesmos
```

---

## Tasks da etapa

- As tarefas abaixo implementam US05 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK05.1 · Instalar o Swagger UI e criar `src/docs/openapi.ts`: Tradução dos schemas Zod para um documento OpenAPI 3.
- TK05.2 · Criar `src/routes/docs.routes.ts`: A interface navegável em `/api/docs` e o documento cru em `/api/openapi.json`.

---

## Estrutura da aplicação

- Duas pastas novas e uma linha no entrypoint. Nenhum arquivo das etapas anteriores é alterado.

---

## O que muda nesta etapa

- Comparando com a etapa anterior, entram dois módulos novos: `src/docs/openapi.ts` (conversão declarativa de schemas Zod para OpenAPI 3) e...
- Nenhuma regra ou schema pré-existente é alterado.

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK05.1 · Instalar o Swagger UI e criar `src/docs/openapi.ts`

- Só a interface precisa de dependência.
- A conversão do schema é feita pelo próprio Zod: desde a versão 4 ele traz `z.toJSONSchema()`, e não é preciso instalar nenhuma biblioteca de ponte.
- O `toSchema` da linha 13 é a tradução inteira.
- O parâmetro `{ target: 'openapi-3.0' }` importa: OpenAPI 3.0 usa um dialeto próprio de JSON Schema, e sem ele o documento sai em um formato que o...
- O `shapeOf` da linha 18 resolve o segundo detalhe.

---

## TK05.1 · Instalar o Swagger UI e criar `src/docs/openapi.ts`: Exemplo

```bash
npm install swagger-ui-express
npm install -D @types/swagger-ui-express
```

---

## TK05.2 · Criar `src/routes/docs.routes.ts` (A UI e o documento cru)

- O roteador expõe o mesmo documento em dois formatos, para dois públicos diferentes.
- A linha 9 devolve o JSON puro.
- É o que se importa no Insomnia ou no Postman, e o que geradores de client consomem para produzir código a partir do contrato.
- A linha 12 monta a interface navegável, em que cada rota pode ser expandida, lida e executada no navegador.
- No entrypoint, uma linha registra o roteador: e ela vem antes das rotas de investimento, para que `/api/docs` não seja confundido com um id.

---

## O que a documentação herda dos schemas

- Vale abrir o `/api/openapi.json` e comparar com o `investment.schema.ts`. As regras chegaram sozinhas:
- Nenhuma dessas linhas foi digitada duas vezes.
- Mude o mínimo de `name` para 5 na etapa 4 e recarregue o `/api/docs`: a documentação acompanha.
- O Zod descreve a forma dos dados, não a semântica da API.
- Os `summary`, as descrições e a lista de status possíveis continuam sendo texto escrito por você: e é bom que sejam: eles explicam a intenção, que...

---

## O que a documentação herda dos schemas: Tabela

- campo sem `.optional()`: entra em `required`

---

## Executando

- Entre no exemplo desta etapa:
- Abra a documentação navegável:
- Use o botão Try it out para disparar uma requisição real a partir da página, e o

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-swagger
   npm install
```

---

## Executando: Exemplo 2

```bash
   npm run dev
```

---

## Testando

- O melhor teste desta etapa é provocar uma divergência de propósito.
- Abra o `src/schemas/investment.schema.ts`, troque o mínimo do `name` de 3 para 5, salve e recarregue a página `/api/docs`.
- Duas coisas mudam ao mesmo tempo: o `minLength` que a documentação exibe, e o `400` que a rota passa a devolver para nomes de quatro letras.
- É a demonstração de que não existem duas fontes para desalinhar.

---

## O diff que importa

- O diff deve ter exatamente três entradas: os dois arquivos novos e a linha do `index.ts`.
- Se aparecer alteração em `schemas/`, `controllers/` ou `models/`, algo saiu do lugar: documentar uma API não deveria exigir mudá-la.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-validation/src \
  examples/courses/expressjs/projects/invest-app-swagger/src || true
```

---

## Conceitos abordados

- OpenAPI 3 como formato de contrato de API
- Uma fonte de verdade para validar e para documentar
- Swagger UI para pessoas, `openapi.json` para ferramentas
- O limite do que se gera e o que ainda se escreve

---

## O documento acompanha o trilho

- O `openapi.ts` não fica parado nesta etapa.
- Como ele lê os schemas, os campos que as etapas seguintes acrescentam ao investimento: `interest`, `categoryId`, `broker` na etapa 7: aparecem na...
- O que não se propaga sozinho são as rotas novas.
- Quando a etapa 9 fecha a API atrás de token, o documento passa a declarar isso explicitamente:
- Essas seis linhas fazem duas coisas: colocam o botão Authorize no topo da página, onde se cola o token do `POST /api/signin`, e passam a enviar o...

---

## O documento acompanha o trilho: Exemplo

```ts
components: {
  securitySchemes: {
    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  },
},
security: [{ bearerAuth: [] }],
```

---

## Próxima etapa

- InvestApp: SQLite nativo: persistência explícita com SQL e dados que sobrevivem ao reinício.

---

## Arquivos-Chave da Aula

- **src/docs/openapi.ts**: `examples/courses/expressjs/projects/invest-app-swagger/src/docs/openapi.ts` (linhas marcadas `1,13-15,18-20,22-24`)
- **src/docs/openapi.ts: as rotas**: `examples/courses/expressjs/projects/invest-app-swagger/src/docs/openapi.ts` (linhas marcadas `72-73,87-94`)
- **src/routes/docs.routes.ts**: `examples/courses/expressjs/projects/invest-app-swagger/src/routes/docs.routes.ts` (linhas marcadas `9,12`)
- **src/index.ts**: `examples/courses/expressjs/projects/invest-app-swagger/src/index.ts` (linhas marcadas `5,19`)

---

## Resumo da Aula

- **InvestApp: Documentação da API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
