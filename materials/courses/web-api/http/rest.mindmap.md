---
title: 'Web APIs: REST API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: REST API

## Ideia Central
- **Papel**: Arquitetura REST, recursos, verbos HTTP semânticos, códigos de status e boas práticas de integração front-end
- **Contexto**: O modelo REST (Representational State Transfer) é a arquitetura padrão mais utilizada na Web para a construção de APIs. Em um sistema RESTful, os dados e funcionalidades da aplicação são organizados e expostos como Recursos acessíveis via URLs padronizadas e manipulados através dos métodos semânticos do protocolo HTTP
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Princípios da Arquitetura REST
- **Ideia**: Uma API é considerada RESTful quando segue as restrições arquiteturais estabelecidas pelo protocolo HTTP: Recursos identificados por URLs: Cada entidade do sistema (ex: usuários, produtos, pedidos) possui um identificador único (URI)
- **Detalhe**: Uso semântico dos Verbos HTTP: Operações de leitura, criação, atualização e exclusão utilizam os métodos nativos do protocolo (`GET`, `POST`, `PUT`, `DELETE`)
- **Ponto**: Recursos identificados por URLs: Cada entidade do sistema (ex: usuários, produtos, pedidos) possui um identificador único (URI)
- **Ponto**: Uso semântico dos Verbos HTTP: Operações de leitura, criação, atualização e exclusão utilizam os métodos nativos do protocolo (`GET`, `POST`, `PUT`, `DELETE`)
- **Ponto**: Comunicação Sem Estado (*Stateless*): Cada requisição feita ao servidor deve conter todas as informações necessárias para ser processada, sem depender de sessões salvas na memória do servidor
- **Ponto**: Representações padronizadas: Os dados são transmitidos em formatos leves e padronizados, predominantemente JSON

## Mapeamento de Verbos HTTP e Operações CRUD
- **Ideia**: Em REST, a URL nomeia o recurso no plural (ex: `/produtos`), enquanto o verbo HTTP define a ação a ser realizada sobre ele: ---

## Códigos de Status HTTP (*HTTP Status Codes*)
- **Ideia**: Os códigos de status HTTP são códigos numéricos de três dígitos retornados pelo servidor para indicar o resultado de uma solicitação HTTP
- **Detalhe**: Eles são divididos em cinco categorias principais: 1xx (Informacional): Respostas de informação indicando que a requisição foi recebida e está em processamento
- **Ponto**: 1xx (Informacional): Respostas de informação indicando que a requisição foi recebida e está em processamento
- **Ponto**: 2xx (Sucesso): Respostas de sucesso indicando que a requisição foi aceita e processada com êxito
- **Ponto**: 3xx (Redirecionamento): Respostas de redirecionamento indicando que o cliente precisa tomar ações adicionais para concluir a solicitação
- **Ponto**: 4xx (Erro do Cliente): Respostas de erro do cliente indicando sintaxe incorreta, falta de autenticação ou recurso inexistente

## Ferramentas de Teste e Consumo de APIs
- **Ideia**: Para testar e documentar rotas REST antes ou durante a integração do front-end, utilizam-se clientes HTTP dedicados: Clientes GUI: Postman, Insomnia, Bruno, Hoppscotch
- **Detalhe**: Clientes de Linha de Comando (CLI): `curl`, `httpie`
- **Ponto**: Clientes GUI: Postman, Insomnia, Bruno, Hoppscotch
- **Ponto**: Clientes de Linha de Comando (CLI): `curl`, `httpie`
- **Ponto**: Extensões de IDE: *REST Client* para VS Code (arquivos `.http` ou `.rest`)
### Listar todos os posts
- **Ideia**: GET {{baseUrl}}/posts
### Criar um novo post
- **Ideia**: POST {{baseUrl}}/posts Content-Type: application/json { "title": "Novo artigo DevLab", "body": "Conteúdo sobre arquitetura REST", "userId": 1 } ``` ---

## Quando usar, e quando não usar?
- **Ideia**: REST é o padrão de fato para APIs de aplicação, e a decisão relevante acontece em uma escala menor: qual verbo e qual código de status usar em cada operação
- **Detalhe**: Errar aí produz uma API que funciona e mente sobre o que fez

## Executando
- **Ideia**: Os passos percorrem as quatro operações CRUD contra a mesma API, conferindo o código de status devolvido em cada uma: Abra a ferramenta de linha de comando (terminal) ou o console do navegador
- **Detalhe**: Execute o comando `curl` a seguir para consultar um post da API pública JSONPlaceholder: Observe os cabeçalhos de resposta HTTP, como `HTTP/1
- **Ponto**: Abra a ferramenta de linha de comando (terminal) ou o console do navegador
- **Ponto**: Execute o comando `curl` a seguir para consultar um post da API pública JSONPlaceholder:
- **Ponto**: Observe os cabeçalhos de resposta HTTP, como `HTTP/1.1 200 OK` e `content-type: application/json`, seguidos pelo corpo em JSON

## Exercício
- **Ideia**: Os itens exercitam a escolha do verbo e do código de status, que é onde a maior parte dos erros de projeto aparece: O que diferencia um endpoint REST bem projetado (ex: `/usuarios`) de um estilo antigo RPC (ex: `/criarUsuario` ou `/excluirUsuario`)?
- **Detalhe**: Qual o código de status HTTP correto para indicar que uma requisição POST criou um novo registro com sucesso?
- **Ponto**: O que diferencia um endpoint REST bem projetado (ex: `/usuarios`) de um estilo antigo RPC (ex: `/criarUsuario` ou `/excluirUsuario`)?
- **Ponto**: Qual o código de status HTTP correto para indicar que uma requisição POST criou um novo registro com sucesso?
- **Ponto**: O que significa um método HTTP ser idempotente?
- **Ponto**: Em REST, as URLs nomeiam apenas recursos no plural (`/usuarios`), e a ação é definida pelo verbo HTTP (`GET`, `POST`, `DELETE`). No estilo RPC, o verbo da ação é colocado na própria URL (`/criarUsuario`), o que viola o princípio de identificação de recursos

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre modelagem de recursos, métodos HTTP e convenções da arquitetura REST: Qual a diferença entre os métodos `PUT` e `PATCH`?
- **Detalhe**: Possível resposta O `PUT` é utilizado para substituir o recurso por completo (se um campo for omitido, ele será apagado ou resetado)
- **Ponto**: Qual a diferença entre os métodos `PUT` e `PATCH`?
- **Ponto**: Por que os métodos `GET`, `PUT` e `DELETE` são considerados idempotentes, enquanto o `POST` não é?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
