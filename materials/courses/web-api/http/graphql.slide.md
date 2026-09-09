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
title: "Web APIs: GraphQL"
description: "Slides completos do tópico Web APIs: GraphQL."
---

<!-- _class: lead -->

# Web APIs: GraphQL

REST vs GraphQL · Formato de uma Query GraphQL · Quando usar, e quando não usar? · Executando Queries GraphQL via Fetch API

---

## Objetivo

- Contrastar REST e GraphQL quanto a número de rotas, *over-fetching* e *under-fetching*.
- Ler a anatomia de uma *query*, com operação, campos aninhados e variáveis.
- Diferenciar *query* de *mutation* pelo efeito sobre os dados.
- Enviar uma operação GraphQL por `fetch()`, com `POST` e corpo JSON.
- Interpretar a resposta, na qual o campo `errors` pode vir preenchido junto de um status 200.

---

## Mapa do Tópico

- **REST vs GraphQL**.
- **Formato de uma Query GraphQL**.
- **Quando usar, e quando não usar?**.
- **Executando Queries GraphQL via Fetch API**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## REST vs GraphQL

Enquanto uma API REST possui múltiplos endpoints fixos (ex: `/users`, `/posts`), o GraphQL expõe um único endpoint (geralmente `/graphql`).

- **Endpoints**: Único (`/graphql`).
- **Seleção de Campos**: Cliente escolhe os campos exatos.
- **Over-fetching (trazer dados demais)**: Eliminado (retorna apenas o solicitado).
- **Under-fetching (requisições demais)**: Resolvido em uma única query aninhada.

---

## Formato de uma Query GraphQL

No GraphQL, as consultas são escritas em uma sintaxe declarativa semelhante a objetos JSON sem valores.

- Resposta retornada pelo servidor.
- ---.

---

## Formato de uma Query GraphQL: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
{
  "data": {
    "user": {
      "name": "Ana Silva",
      "email": "ana@exemplo.com"
    }
  }
}
```

---

## Quando usar, e quando não usar?

GraphQL resolve um problema específico, o de clientes que precisam de recortes diferentes dos mesmos dados.

- **Telas diferentes consomem recortes distintos**: O cliente pede só os campos que vai exibir.
- **Uma tela precisa de dados de três recursos relac**: Uma requisição substitui três idas ao servidor.
- **CRUD direto sobre poucos recursos**: O ganho não paga o *schema*, os *resolvers* e a camada extra.
- **Upload de arquivos e respostas binárias**: GraphQL trafega JSON e precisa de especificação adicional.
- **Cache de rede e CDN na frente da API**: O `POST` único do GraphQL não é cacheável por URL.

---

## Executando Queries GraphQL via Fetch API

Embora existam bibliotecas clientes avançadas (como *Apollo Client* e *Relay*).

- <Aside type="tip" title="Mutations em GraphQL"> Operações de criação, edição ou exclusão no GraphQL são chamadas de Mutations.
- Elas seguem o mesmo formato de envio via HTTP `POST`, substituindo a palavra-chave `query` por `mutation`.
- ---.

---

## Executando

1. Abra o navegador com <kbd>F12</kbd> e clique na aba Console.
2. Cole o código a seguir e pressione <kbd>Enter</kbd>.
3. Observe o objeto retornado no console com o nome do país ("Brazil"), capital ("Brasília") e moeda ("BRL").

---

## Executando: Comando

```js
const res = await fetch('https://countries.trevorblades.com/', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       query: '{ country(code: "BR") { name capital currency } }'
     })
   });
   const dados = await res.json();
   console.log(dados.data.country);
```

---

## Exercício Prático

1. O que são os problemas de *over-fetching* e *under-fetching* e como o GraphQL os soluciona?
2. Qual método HTTP e formato de corpo são utilizados para enviar consultas GraphQL usando o `fetch` nativo?
3. *Over-fetching* ocorre quando a API retorna mais dados do que o necessário (ex: baixar 50 campos de um usuário quando só precisamos do nome).
4. Utiliza-se o método HTTP `POST`, enviando no corpo da requisição um JSON com a propriedade `query` contendo a string de consulta.

---

## Perguntas de revisão

1. Qual a diferença entre uma `Query` e uma `Mutation` no GraphQL?

---

## Resumo do Tópico

- **REST vs GraphQL**: revise o papel desse eixo no uso da API.
- **Formato de uma Query GraphQL**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
- **Executando Queries GraphQL via Fetch API**: revise o papel desse eixo no uso da API.
