---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: BMI API"
description: "O mesmo cálculo de IMC exposto de três formas — query string, parâmetro de rota e corpo da requisição — para comparar as origens de dados de uma requisição."
---

<!-- _class: lead -->

# Projeto: BMI API

O mesmo cálculo de IMC exposto de três formas — query string, parâmetro de rota e corpo da requisição — para comparar as origens de dados de uma requisição.

---

## Objetivo

- Entender o papel de **Projeto: BMI API** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/bmi-query-param`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **O cálculo, isolado**
- **As três variantes**
- **Comparação**
- **Executando**
- **Exemplo**
- **Estrutura**
- **Conceitos abordados**
- **Desafio**

---

## Contexto da Aula

- Nível Iniciante · Node.js · Express.js
- Três projetos mínimos que calculam o mesmo índice de massa corporal, mudando apenas de onde os dados vêm.
- É o menor experimento possível para comparar `req.query`, `req.params` e `req.body`.

---

## O cálculo, isolado

- A função de domínio é a mesma nos três projetos: e não sabe que existe HTTP:

---

## As três variantes

- Os dados são opcionais por natureza e ficam visíveis na URL: bom para filtro e consulta.
- Os dados fazem parte do caminho, como se identificassem um recurso: o que aqui é forçado: peso e altura não são um recurso.
- Os dados vão no corpo, exigem `express.json()` e não aparecem em log de acesso: a forma correta para envio de dados.

---

## Comparação

- O caminho identifica qual recurso; a query modifica a consulta; o corpo envia dados.
- Peso e altura são dados de entrada: o `POST` com corpo é a modelagem mais honesta das três.
- Sem o `Number()`, a conta vira concatenação e o resultado é `NaN`: silenciosamente.

---

## Comparação: Tabela

- Query param: `req.query` | GET | `/bmi?weight=100&height=1.5` | sim
- Route param: `req.params` | GET | `/bmi/weight/100/height/1.5` | sim
- Body param: `req.body` | POST | `/bmi` | não

---

## Executando

- Entre em uma das variantes:
- Instale e suba:
- Teste pelo `requests.http` ou pelo `curl`:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/bmi-query-param
```

---

## Executando: Exemplo 2

```bash
   npm install && npm start
```

---

## Exemplo

- { "weight": 100, "height": 1.5, "bmi": 44.44 }
- { "weight": 100, "height": 1.5 }

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- O mesmo cálculo de IMC exposto de três formas: query string, parâmetro de rota e corpo da requisição: para comparar as origens de dados de uma requisição.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Conceitos abordados

- Conversão de string para número na entrada
- Separação entre a função de domínio e a camada HTTP
- A aula correspondente é Rotas.

---

## Desafio

- Reúna as três variantes em um único projeto e acrescente validação: responda `422` quando peso ou altura não forem números positivos, com uma mensagem...
- Compare o esforço de validar `req.query` e `req.body`: e por que o segundo é mais simples.

---

## Próximo projeto

- Express Router: separando as rotas em módulos.

---

## Arquivos-Chave da Aula

- **src/bmi.js**: `examples/courses/express/projects/bmi-query-param/src/bmi.js`
- **src/index.js**: `examples/courses/express/projects/bmi-query-param/src/index.js` (linhas marcadas `6-8`)
- **src/index.js**: `examples/courses/express/projects/bmi-route-param/src/index.js` (linhas marcadas `6-8`)
- **src/index.js**: `examples/courses/express/projects/bmi-body-param/src/index.js` (linhas marcadas `6,9`)

---

## Resumo da Aula

- **Projeto: BMI API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
