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
title: "Projeto: Express MVC"
description: "Aplicação Express organizada em MVC, com CRUD completo e tratamento de erros centralizado."
---

<!-- _class: lead -->

# Projeto: Express MVC

Aplicação Express organizada em MVC, com CRUD completo e tratamento de erros centralizado.

---

## Objetivo

- Entender o papel de **Projeto: Express MVC** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/mvc`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Estrutura**
- **Código**
- **Executando**
- **Rotas**
- **Exemplo**
- **Conceitos abordados**
- **Próximo projeto**

---

## Contexto da Aula

- Nível Intermediário · Node.js · Express.js · MVC
- CRUD completo de usuários, com cada responsabilidade em seu lugar.

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- Aplicação Express organizada em MVC, com CRUD completo e tratamento de erros centralizado.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- Aplicação Express organizada em MVC, com CRUD completo e tratamento de erros centralizado.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- cd examples/courses/expressjs/projects/mvc

---

## Rotas

- Rotas aparece como ponto central da aula, não apenas como item de índice.
- Aplicação Express organizada em MVC, com CRUD completo e tratamento de erros centralizado.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Rotas: Tabela

- GET: `/users` | `200` | —
- GET: `/users/:id` | `200` | `404`
- POST: `/users` | `201` | `400`
- PUT: `/users/:id` | `200` | `404`
- DELETE: `/users/:id` | `204` | `404`

---

## Exemplo

- Nesta seção, testamos a criação de recursos na API estruturada sob o padrão MVC.
- A requisição `POST /users` envia um objeto JSON contendo nome e e-mail.
- O controller valida o payload, chama a camada de model para persistir e retorna o usuário criado com seu novo `id` e status `201 Created`:
- { "name": "Carla", "email": "carla@example.com" }
- { "id": 3, "name": "Carla", "email": "carla@example.com" }

---

## Exemplo: Exemplo

```txt
  ### Criar usuário na estrutura MVC
  POST http://localhost:3000/users
  Content-Type: application/json
  {
    "name": "Carla",
    "email": "carla@example.com"
  }
```

---

## Conceitos abordados

- Separação em models, controllers, routes e middlewares
- Erros com status HTTP (`HttpError`) e handler centralizado
- Middleware de 404 e middleware de erro com quatro parâmetros
- CRUD completo sobre um model em memória
- A aula correspondente é Express.js → MVC.

---

## Próximo projeto

- Express TypeScript: as mesmas camadas, agora tipadas.

---

## Resumo da Aula

- **Projeto: Express MVC** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
