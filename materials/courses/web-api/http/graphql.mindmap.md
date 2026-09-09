---
title: 'Web APIs: GraphQL'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: GraphQL

## Ideia Central
- **Papel**: Consultas declarativas no client-side com GraphQL, eliminando over-fetching e solicitando apenas os campos necessários
- **Contexto**: O GraphQL é uma linguagem de consulta (*query language*) para APIs e um ambiente de execução (*runtime*) no servidor para responder a essas consultas. Criado pelo Facebook, o GraphQL oferece uma alternativa às APIs REST tradicionais, permitindo que o cliente declare na requisição a estrutura exata dos dados que deseja receber
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## REST vs GraphQL
- **Ideia**: Enquanto uma API REST possui múltiplos endpoints fixos (ex: `/users`, `/posts`), o GraphQL expõe um único endpoint (geralmente `/graphql`), aceitando requisições HTTP POST contendo a consulta desejada
- **Detalhe**: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Formato de uma Query GraphQL
- **Ideia**: No GraphQL, as consultas são escritas em uma sintaxe declarativa semelhante a objetos JSON sem valores: Resposta retornada pelo servidor: ---

## Quando usar, e quando não usar?
- **Ideia**: GraphQL resolve um problema específico, o de clientes que precisam de recortes diferentes dos mesmos dados, e cobra por isso em complexidade de servidor, de cache e de observabilidade
- **Detalhe**: Adotá-lo fora desse cenário troca um problema pequeno por um maior

## Executando Queries GraphQL via Fetch API
- **Ideia**: Embora existam bibliotecas clientes avançadas (como *Apollo Client* e *Relay*), é totalmente possível consumir APIs GraphQL no front-end utilizando apenas a `Fetch API` nativa, enviando uma requisição `POST` com um payload JSON contendo a propriedade `query`: Operações de criação, edição ou exclusão no GraphQL são chamadas de Mutations
- **Detalhe**: Elas seguem o mesmo formato de envio via HTTP `POST`, substituindo a palavra-chave `query` por `mutation`

## Executando
- **Ideia**: Siga os passos para executar uma consulta GraphQL real diretamente no console do seu navegador: Abra o navegador com F12 e clique na aba Console
- **Detalhe**: Cole o código a seguir e pressione Enter: Observe o objeto retornado no console com o nome do país ("Brazil"), capital ("Brasília") e moeda ("BRL")
- **Ponto**: Abra o navegador com F12 e clique na aba Console
- **Ponto**: Cole o código a seguir e pressione Enter:
- **Ponto**: Observe o objeto retornado no console com o nome do país ("Brazil"), capital ("Brasília") e moeda ("BRL")

## Exercício
- **Ideia**: Os itens abaixo exercitam a escrita de *queries* e a leitura da resposta, na qual `errors` pode vir preenchido com status 200: O que são os problemas de *over-fetching* e *under-fetching* e como o GraphQL os soluciona?
- **Detalhe**: Qual método HTTP e formato de corpo são utilizados para enviar consultas GraphQL usando o `fetch` nativo?
- **Ponto**: O que são os problemas de *over-fetching* e *under-fetching* e como o GraphQL os soluciona?
- **Ponto**: Qual método HTTP e formato de corpo são utilizados para enviar consultas GraphQL usando o `fetch` nativo?
- **Ponto**: *Over-fetching* ocorre quando a API retorna mais dados do que o necessário (ex: baixar 50 campos de um usuário quando só precisamos do nome). *Under-fetching* ocorre quando um endpoint não traz dados suficientes, exigindo que o front-end faça várias requisições adicionais. O GraphQL soluciona ambos permitindo que o cliente solicite exatamente os campos necessários em uma única requisição
- **Ponto**: Utiliza-se o método HTTP `POST`, enviando no corpo da requisição um JSON com a propriedade `query` contendo a string de consulta: `{ "query": "{ ... }" }`

## Perguntas de revisão
- **Ideia**: Qual a diferença entre uma `Query` e uma `Mutation` no GraphQL?
- **Detalhe**: Possível resposta Uma `Query` é usada para leitura de dados (equivalente ao GET)
- **Ponto**: Qual a diferença entre uma `Query` e uma `Mutation` no GraphQL?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
