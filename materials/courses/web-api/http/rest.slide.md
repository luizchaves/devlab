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
title: "Web APIs: REST API"
description: "Slides completos do tópico Web APIs: REST API."
---

<!-- _class: lead -->

# Web APIs: REST API

Princípios da Arquitetura REST · Mapeamento de Verbos HTTP e Operações CRUD · Códigos de Status HTTP (*HTTP Status Codes*) · Ferramentas de Teste e Consumo de APIs

---

## Objetivo

- Enunciar os princípios do REST, com destaque para recursos identificados por URI e para a ausência de estado no servidor.
- Mapear as operações CRUD nos verbos HTTP `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.
- Interpretar as famílias de códigos de status e escolher o código correto para cada resposta.
- Diferenciar `PUT` de `PATCH` pelo que cada um faz com os campos não enviados.
- Testar uma API REST com um cliente HTTP antes de escrever a chamada no front-end.

---

## Mapa do Tópico

- **Princípios da Arquitetura REST**.
- **Mapeamento de Verbos HTTP e Operações CRUD**.
- **Códigos de Status HTTP (*HTTP Status Codes*)**.
- **Ferramentas de Teste e Consumo de APIs**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Princípios da Arquitetura REST

Uma API é considerada RESTful quando segue as restrições arquiteturais estabelecidas pelo protocolo HTTP.

- Recursos identificados por URLs: Cada entidade do sistema (ex: usuários, produtos, pedidos) possui um identificador único (URI).
- Uso semântico dos Verbos HTTP: Operações de leitura, criação, atualização e exclusão utilizam os métodos nativos do protocolo.
- Comunicação Sem Estado (*Stateless*): Cada requisição feita ao servidor deve conter todas as informações necessárias para ser processada.
- Representações padronizadas: Os dados são transmitidos em formatos leves e padronizados, predominantemente JSON.

---

## Mapeamento de Verbos HTTP e Operações CRUD

Em REST, a URL nomeia o recurso no plural (ex: `/produtos`), enquanto o verbo HTTP define a ação a ser realizada sobre ele.

- **`GET`**: Sim.
- **`GET`**: Sim.
- **`POST`**: Não.
- **`PUT`**: Sim.
- **`PATCH`**: Não.

---

## Códigos de Status HTTP (*HTTP Status Codes*)

Os códigos de status HTTP são códigos numéricos de três dígitos retornados pelo servidor para indicar o resultado de uma solicitação HTTP.

- **`200`**: Solicitação gerada com sucesso.
- **`201`**: Solicitação gerada com sucesso e novo recurso foi criado.
- **`204`**: Solicitação gerada com sucesso e sem conteúdo para enviar.
- **`400`**: Solicitação não compreendida por motivos de erro.
- **`401`**: Solicitação bloqueada sem credenciais de autenticação válidas.

---

## Ferramentas de Teste e Consumo de APIs

Para testar e documentar rotas REST antes ou durante a integração do front-end, utilizam-se clientes HTTP dedicados.

- Clientes GUI: Postman, Insomnia, Bruno, Hoppscotch.
- Clientes de Linha de Comando (CLI): `curl`, `httpie`.
- Extensões de IDE: *REST Client* para VS Code (arquivos `.http` ou `.rest`).

---

## Quando usar, e quando não usar?

REST é o padrão de fato para APIs de aplicação, e a decisão relevante acontece em uma escala menor.

- **Substituir um recurso por completo**: `PATCH`, que sugere alteração parcial.
- **Alterar um campo isolado**: `PUT`, que apaga os campos não enviados.
- **Criação bem-sucedida de um recurso**: `200 OK`, que não informa onde o recurso ficou.
- **Requisição com corpo inválido**: `500`, que atribui ao servidor um erro do cliente.
- **Busca com filtros, ordenação e paginação**: `POST` com filtros no corpo, que perde cache e histórico.

---

## Executando

1. Abra a ferramenta de linha de comando (terminal) ou o console do navegador.
2. Execute o comando `curl` a seguir para consultar um post da API pública JSONPlaceholder.
3. Observe os cabeçalhos de resposta HTTP, como `HTTP/1.1 200 OK` e `content-type: application/json`, seguidos pelo corpo em JSON.

---

## Executando: Comando

```bash
curl -i https://jsonplaceholder.typicode.com/posts/1
```

---

## Exercício Prático

1. O que diferencia um endpoint REST bem projetado (ex: `/usuarios`) de um estilo antigo RPC (ex: `/criarUsuario` ou `/excluirUsuario`)?
2. Qual o código de status HTTP correto para indicar que uma requisição POST criou um novo registro com sucesso?
3. O que significa um método HTTP ser idempotente?
4. Em REST, as URLs nomeiam apenas recursos no plural (`/usuarios`), e a ação é definida pelo verbo HTTP (`GET`, `POST`, `DELETE`).
5. O código de status `201 Created`.

---

## Perguntas de revisão

1. Qual a diferença entre os métodos `PUT` e `PATCH`?
2. Por que os métodos `GET`, `PUT` e `DELETE` são considerados idempotentes, enquanto o `POST` não é?

---

## Resumo do Tópico

- **Princípios da Arquitetura REST**: revise o papel desse eixo no uso da API.
- **Mapeamento de Verbos HTTP e Operações CRUD**: revise o papel desse eixo no uso da API.
- **Códigos de Status HTTP (*HTTP Status Codes*)**: revise o papel desse eixo no uso da API.
- **Ferramentas de Teste e Consumo de APIs**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
