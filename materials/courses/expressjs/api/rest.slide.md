---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: REST API"
description: "Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e versionamento."
---

<!-- _class: lead -->

# Express.js: REST API

Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e versionamento.

---

## Objetivo

- Ao final você saberá modelar caminhos a partir de recursos, escolher o verbo e o status corretos para cada operação, e explicar por que idempotência e...

---

## Mapa da Aula

- **Objetivo**
- **Recursos, não ações**
- **Os cinco verbos**: Segurança e idempotência, `PUT` ou `PATCH`?
- **Status codes**
- **Um ciclo completo**
- **Subrecursos e relações**
- **Versionamento**
- **Erros padronizados**

---

## Contexto da Aula

- REST é um conjunto de convenções para expor recursos por HTTP.
- Seguir essas convenções faz com que qualquer pessoa consiga usar a sua API sem ler documentação extensa: e faz com que caches, proxies e clientes se...

---

## Recursos, não ações

- O caminho identifica o quê; o método diz o que fazer. Toda a diferença está aí.
- Um verbo dentro do caminho duplica o que o método já diz, e multiplica os endpoints:
- Use substantivos no plural, em minúsculas, sem verbos e sem extensão de arquivo.
- Algumas ações não cabem em nenhum verbo: "enviar e-mail de recuperação", "recalcular saldo".
- A saída convencional é modelar a própria ação como recurso: `POST /password-resets` cria um pedido de redefinição.

---

## Recursos, não ações: Exemplo 1

```txt
/users            coleção de usuários
/users/1          um usuário
/users/1/posts    os posts daquele usuário
```

---

## Recursos, não ações: Exemplo 2

```txt
GET  /listarUsuarios      ✗   GET    /users
POST /criarUsuario        ✗   POST   /users
POST /deletarUsuario/1    ✗   DELETE /users/1
POST /usuario/1/ativar    ✗   PATCH  /users/1  { "active": true }
```

---

## Os cinco verbos

- O CRUD completo de um recurso cabe em cinco linhas de router:
- É exatamente o router do projeto em TypeScript:

---

## Segurança e idempotência

- Duas propriedades dos métodos definem o que um cliente pode fazer sem medo:
- Isso importa quando o cliente tem retentativa automática ou a conexão cai depois do envio: repetir um `PUT` leva ao mesmo estado final, mas dois `POST...
- Navegadores, proxies e pré-carregadores tratam `GET` como seguro e podem chamá-lo sem que o usuário peça.
- Um `GET /users/1/delete` pode ser disparado por um crawler.

---

## `PUT` ou `PATCH`?

- { "name": "Carla Souza", "email": "carla@example.com" }
- { "name": "Carla Souza" }
- Na prática, muita API implementa `PUT` com semântica de `PATCH`.
- Não é o fim do mundo, mas documente: o cliente que confia na substituição vai perder dados.

---

## Status codes

- O status é a resposta: ele diz ao cliente o que aconteceu antes de qualquer leitura do corpo.
- Os que aparecem em praticamente toda API:
- A aula de Autorização volta ao ponto.

---

## Um ciclo completo

- Criar devolve `201` com o recurso e o cabeçalho `Location` apontando para ele:
- { "name": "Carla", "email": "carla@example.com" }
- { "id": 3, "name": "Carla", "email": "carla@example.com" }
- Remover devolve `204`: e o cliente não deve tentar ler o corpo:
- E o conflito de estado tem status próprio, diferente de `400`:

---

## Subrecursos e relações

- Quando um recurso só existe dentro de outro, o caminho reflete isso:
- A convenção é aninhar apenas para listar e criar, e expor o recurso por id próprio para ler, atualizar e remover.

---

## Subrecursos e relações: Exemplo

```txt
GET  /users/1/investments        investimentos daquele usuário
POST /users/1/investments        cria um investimento para ele
GET  /investments/42             o mesmo recurso, por id próprio
```

---

## Versionamento

- Uma mudança que quebra clientes existentes: remover um campo, mudar o tipo, alterar o formato do erro: exige uma versão nova.
- O caminho é a forma mais simples e visível:
- Acrescentar um campo opcional não quebra ninguém e não exige versão nova. Remover ou renomear, sim.

---

## Versionamento: Exemplo

```ts
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

---

## Erros padronizados

- Uma API previsível responde erro sempre no mesmo formato: é o que o middleware de erro garante, venha a falha de onde vier:
- Erros `5xx` respondem uma mensagem genérica: stack traces e mensagens do banco vão para o log do servidor, nunca para o cliente.
- Uma mensagem de erro de SQL entrega o nome das tabelas a quem estiver sondando a API.

---

## Exercício

- Documente, em uma tabela, todos os endpoints do recurso produtos criado no exercício de MVC.
- Para cada um: método, caminho, corpo esperado, status de sucesso e todos os status de erro possíveis.
- Depois, responda para cada endpoint se ele é seguro e se é idempotente.
- O `400` de `/products/:id` cobre o id não numérico; o `409`, o nome já cadastrado.

---

## Exercício: Tabela

- GET: `/products` |: | `200` |: | sim | sim
- GET: `/products/:id` |: | `200` | `400`, `404` | sim | sim
- POST: `/products` | `{ name, price }` | `201` | `400`, `409`, `415` | não | não
- PUT: `/products/:id` | `{ name, price }` | `200` | `400`, `404`, `415` | não | sim
- DELETE: `/products/:id` |: | `204` | `400`, `404` | não | sim

---

## Desafio

- Modele os endpoints de um recurso que não é CRUD: "reenviar o e-mail de confirmação de uma conta".
- Proponha duas soluções: uma modelando a ação como recurso e outra com verbo no caminho: e justifique qual você escolheria e por quê.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Recursos e verbos

- Por que `GET /listarUsuarios` é pior que `GET /users`?
- Porque duplica no caminho a informação que o método já carrega, e multiplica os endpoints: cada operação passa a exigir um caminho novo em vez de...
- Qual a diferença prática entre `PUT` e `PATCH`?
- Implementar `PUT` com semântica de `PATCH` sem documentar surpreende quem confia na substituição.
- Por que `POST` não é idempotente?

---

## Status

- Quando usar `409` em vez de `400`?
- Quando a requisição está bem formada, mas conflita com o estado atual do servidor: um e-mail já cadastrado, por exemplo.
- Por que uma resposta `5xx` não deve conter a mensagem original do erro?
- Porque ela costuma revelar estrutura interna: nomes de tabelas, caminhos de arquivo, versões de biblioteca: que ajudam quem estiver sondando a API.
- O detalhe vai para o log; o cliente recebe uma mensagem genérica.

---

## Próxima aula

- Tratamento de Erros: como todo erro da aplicação vira uma resposta consistente.

---

## Arquivos-Chave da Aula

- **src/routes/user-router.ts**: `examples/courses/expressjs/projects/typescript/src/routes/user-router.ts`
- **src/middlewares/error-handler.ts**: `examples/courses/expressjs/projects/typescript/src/middlewares/error-handler.ts`

---

## Resumo da Aula

- **Express.js: REST API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
