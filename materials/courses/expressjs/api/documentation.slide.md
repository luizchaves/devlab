---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Documentação de API"
description: "Descrição do contrato de uma API Express: arquivos .http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que documentar além dos endpoints."
---

<!-- _class: lead -->

# Express.js: Documentação de API

Descrição do contrato de uma API Express: arquivos .http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que documentar além dos endpoints.

---

## Objetivo

- Ao final você saberá manter um arquivo `.http` executável junto do código, descrever a API em OpenAPI, publicar essa descrição com o Swagger UI e...

---

## Mapa da Aula

- **Objetivo**
- **Documentação que apodrece**
- **Arquivos `.http`**: Login — guarda o token para as próximas requisições, Lista os investimentos do usuário autenticado, Sem token (401)
- **OpenAPI**
- **Publicando com Swagger UI**
- **Gerando a partir dos schemas**
- **O que documentar além dos endpoints**
- **Exercício**

---

## Contexto da Aula

- Uma API sem documentação obriga quem a consome a ler o código do servidor: ou a adivinhar.
- Esta aula trata das duas formas de documentar que sobrevivem ao tempo: a que é executável e a que é lida por máquina.

---

## Documentação que apodrece

- Toda documentação escrita à mão em um `README` diverge do código na primeira alteração que alguém esquece de refletir.
- As formas que resistem têm uma característica em comum: são verificáveis.
- Um exemplo que ninguém executa não avisa quando fica errado.
- Prefira formas em que a divergência entre documentação e código produza uma falha visível.

---

## Documentação que apodrece: Tabela

- Tabela no `README`: não: ninguém percebe se divergiu | baixo, mas apodrece rápido
- Arquivo `.http`: sim: é executado | baixo
- OpenAPI escrito à mão: parcial: validável, não executado | médio
- OpenAPI gerado do schema: sim: sai da mesma fonte do código | baixo depois de configurado
- Testes de integração: sim: quebram quando o contrato muda | médio

---

## Arquivos `.http`

- Um arquivo `requests.http` versionado junto do projeto é a documentação mais barata que existe: descreve cada endpoint e roda dentro do editor com a...

---

## Login — guarda o token para as próximas requisições

- # @name signin POST {{server}}/auth/signin Content-Type: application/json
- { "email": "ana@example.com", "password": "senha-secreta" }

---

## Lista os investimentos do usuário autenticado

- GET {{server}}/investments Authorization: Bearer {{token}}

---

## Sem token (401)

- GET {{server}}/investments

---

## OpenAPI

- O OpenAPI é um formato: YAML ou JSON: para descrever uma API HTTP de modo que ferramentas consigam ler: gerar cliente, gerar documentação navegável,...
- A estrutura mínima cobre servidor, caminhos e componentes reutilizáveis:

---

## OpenAPI: Exemplo

```txt
openapi: 3.1.0
info:
  title: Investment API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /investments:
    get:
      summary: Lista os investimentos do usuário autenticado
      security:
        - bearerAuth: []
      parameters:
```

---

## Publicando com Swagger UI

- O `swagger-ui-express` serve a documentação navegável a partir do arquivo, dentro da própria aplicação:
- Instale os pacotes:
- Carregue a especificação e monte a rota:
- Abra http://localhost:3000/docs e experimente as rotas pela interface.
- Em uma API interna, `/docs` entrega a lista completa de endpoints e formatos a quem encontrar a URL.

---

## Publicando com Swagger UI: Exemplo

```ts
   import { readFileSync } from 'node:fs';
   import swaggerUi from 'swagger-ui-express';
   import { parse } from 'yaml';
   const openapi = parse(readFileSync('openapi.yaml', 'utf8'));
   app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
```

---

## Gerando a partir dos schemas

- Manter `openapi.yaml` e os schemas de validação em paralelo é manter duas verdades.
- Quando a validação já usa Zod, a especificação pode sair dela:

---

## Gerando a partir dos schemas: Tabela

- YAML à mão: controle total sobre a descrição | diverge do código com o tempo
- Gerado dos schemas: uma fonte de verdade | menos controle sobre exemplos e textos
- Anotações no código: fica ao lado da rota | polui o arquivo e depende do gerador

---

## Gerando a partir dos schemas: Exemplo 1

```ts
    import { z } from 'zod';
    export const investmentSchema = z.object({
      id: z.string(),
      name: z.string().min(2),
      amount: z.int().positive(),
    });
    // O mesmo schema valida a requisição e descreve o contrato.
    export const investmentJsonSchema = z.toJSONSchema(investmentSchema);
```

---

## Gerando a partir dos schemas: Exemplo 2

```ts
    // src/schemas/investment.ts  — usado na validação
    // openapi.yaml               — escrito à mão, diverge no primeiro campo novo
```

---

## O que documentar além dos endpoints

- A lista de rotas é a parte fácil. O que costuma faltar: e é o que gera perguntas: é o contexto:
- Ele não deve repetir a lista de endpoints: isso é trabalho do OpenAPI.
- Ele deve responder "como subo isso na minha máquina em cinco minutos": pré-requisitos, `cp.env.example.env`, comandos de banco, usuário de teste e o...

---

## O que documentar além dos endpoints: Tabela

- Autenticação: como obtenho um token e por quanto tempo ele vale?
- Formato de erro: o que vem no corpo quando falha?
- Paginação: quais parâmetros, qual o teto, qual o padrão?
- Limites de requisição: quantas chamadas por minuto antes de `429`?
- Versionamento: o que muda entre `/v1` e `/v2`, e até quando o `v1` vive?
- Ambientes: qual a URL de homologação e de produção?

---

## Exercício

- No projeto `express-auth`:
- Complete o `requests.http` com um caso de erro para cada rota.
- Escreva `openapi.yaml` descrevendo `POST /auth/signup`, `POST /auth/signin` e
- Publique em `/docs` com `swagger-ui-express`, apenas fora de produção.
- Acrescente ao `README.md` a seção "Como rodar em cinco minutos".

---

## Exercício: Exemplo

```ts
  import { config } from '#config.ts';
  // A documentação fica disponível apenas em desenvolvimento.
  if (!config.isProduction) {
    const openapi = parse(readFileSync('openapi.yaml', 'utf8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
  }
```

---

## Desafio

- Escreva um teste de contrato: leia `openapi.yaml`, extraia o schema da resposta de `GET /investments` e valide contra ele a resposta real da aplicação.
- Faça o teste falhar propositalmente removendo um campo do controller e confirme que a divergência é detectada.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Descrição do contrato de uma API Express: arquivos.http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Formas de documentar

- Por que um arquivo `.http` envelhece melhor que uma tabela no `README`?
- Porque ele é executado: quando o contrato muda, a requisição falha e alguém corrige. A tabela diverge em silêncio.
- O que se ganha ao descrever a API em OpenAPI em vez de em prosa?
- Ferramentas passam a ler o contrato: documentação navegável, geração de cliente, validação de requisição e testes de contrato saem da mesma descrição.
- Por que gerar a especificação a partir dos schemas de validação?

---

## Conteúdo

- Por que expor `/docs` publicamente pode ser um problema?
- Porque entrega a superfície de ataque completa: endpoints, parâmetros, formatos: a qualquer pessoa que encontre a URL.
- Em API interna, a rota deve ser protegida ou restrita a ambientes de desenvolvimento.
- O que o `README` deve conter que o OpenAPI não cobre?
- O caminho para rodar o projeto: pré-requisitos, configuração do `.env`, comandos de banco, usuário de teste e onde encontrar a documentação.

---

## Próxima aula

- Construção de API: do requisito ao endpoint, e a integração com o front-end.

---

## Resumo da Aula

- **Express.js: Documentação de API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
