---
title: 'Web APIs: Fetch API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Fetch API

## Ideia Central
- **Papel**: Requisições HTTP assíncronas nativas no navegador e Node.js com fetch, async/await, Response, JSON, tratamento de erros, CORS e integração com interface
- **Contexto**: A Fetch API é a interface padrão nativa do navegador (e disponível no Node.js a partir da versão 18) para realizar requisições HTTP assíncronas pela rede. Ela substituiu a antiga e verbosa API `XMLHttpRequest`, fornecendo uma abstração limpa baseada em Promises
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Natureza Assíncrona e Event Loop
- **Ideia**: A comunicação com servidores remotos via rede é uma operação de entrada e saída (*I/O*) não bloqueante
- **Detalhe**: O método `fetch()` não trava a execução da página nem paralisa a interface do usuário enquanto aguarda os dados do servidor

## A Função `fetch` e a Classe `Response`
- **Ideia**: A função `fetch()` aceita uma URL de destino e um objeto opcional de opções de configuração
- **Detalhe**: Ela retorna uma Promise que resolve em um objeto do tipo `Response`: O diagrama abaixo ilustra o fluxo de execução do `fetch()` e o momento da verificação de status: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Do Disparo até a Tela: Ciclo de Vida na Interface
- **Ideia**: Uma chamada de rede em uma interface gráfica não termina quando a resposta chega
- **Detalhe**: Ela passa por quatro momentos distintos, e cada um deles pode falhar de uma forma diferente: a requisição pode não sair por queda de conexão, o servidor pode responder com status de erro, o corpo pode não ser o JSON esperado e a renderização pode receber um valor ausente

## Operações CRUD com `fetch`
- **Ideia**: A Fetch API suporta todos os verbos e operações do ciclo CRUD (*Create, Read, Update, Delete*) através da configuração do objeto de opções
- **Ponto**: `method: 'POST'`
- **Ponto**: `headers: { 'Content-Type': 'application/json' }`
- **Ponto**: `body: JSON.stringify(dados)`
### Leitura de Dados (GET)
- **Ideia**: A requisição do tipo GET é o padrão do `fetch` caso nenhum segundo parâmetro seja fornecido: Uma Promise retornada pelo `fetch()` NÃO é rejeitada em caso de erro HTTP como `404 Not Found` ou `500 Internal Server Error`
### Envio de Dados (POST)
- **Ideia**: Para enviar dados em formato JSON para uma API, três configurações no objeto de opções são obrigatórias: `method: 'POST'` `headers: { 'Content-Type': 'application/json' }` `body: JSON
- **Ponto**: `method: 'POST'`
- **Ponto**: `headers: { 'Content-Type': 'application/json' }`
### Atualização (PUT e PATCH) e Remoção (DELETE)
- **Ideia**: As operações de alteração e exclusão seguem o mesmo padrão de configuração do `POST`, ajustando o verbo semântico e o corpo da mensagem: --- A omissão mais frequente em código de `fetch()` gerado por assistentes de IA é a ausência do `if (!

## Montando Query Strings com `URLSearchParams`
- **Ideia**: Evite concatenar strings manualmente para passar parâmetros de filtro e paginação na URL

## Entendendo o CORS (Cross-Origin Resource Sharing)
- **Ideia**: O CORS é um mecanismo de segurança implementado pelos navegadores que restringe requisições HTTP feitas via scripts para um domínio (origem) diferente daquele que serviu a página atual
- **Detalhe**: O diagrama abaixo apresenta a validação de cabeçalhos efetuada pelo navegador: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Cancelando Requisições com `AbortController`
- **Ideia**: Em buscas dinâmicas com digitação ou ao trocar rapidamente de página, requisições antigas que ainda estão em trânsito devem ser canceladas para evitar concorrência desordenada (*race conditions*) ou desperdício de banda

## Exemplo Interativo com Interface HTML
- **Ideia**: O exemplo interativo abaixo demonstra uma aplicação web completa consumindo endpoints `GET` e `POST`, manipulando estados de carregamento e renderizando a resposta na interface: Prévia HTML interativa disponível na página do tópico
- **Detalhe**: O código-fonte integral do exemplo ilustra o tratamento de eventos e a manipulação do DOM: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Quando usar, e quando não usar?
- **Ideia**: A Fetch API é nativa, não adiciona dependências ao projeto e atende à grande maioria das necessidades de comunicação cliente-servidor
- **Detalhe**: A decisão prática consiste em identificar quando a aplicação demanda recursos arquiteturais mais avançados

## Executando
- **Ideia**: Siga os passos abaixo para consultar uma API pública de CEP diretamente no console: Abra o navegador com F12 e acesse a aba Console
- **Detalhe**: Cole o código a seguir e pressione Enter: Veja o objeto com os dados de endereço formatados no console
- **Ponto**: Abra o navegador com F12 e acesse a aba Console
- **Ponto**: Cole o código a seguir e pressione Enter:
- **Ponto**: Veja o objeto com os dados de endereço formatados no console

## Exercício
- **Ideia**: Os itens exercitam as quatro operações CRUD e o tratamento de erro que a API não faz sozinha: Por que uma requisição `fetch()` que retorna o código de status HTTP `404 Not Found` não cai no bloco `catch` de um `try/catch`?
- **Detalhe**: Quais são as três configurações fundamentais necessárias para enviar dados em formato JSON utilizando o método `POST` no `fetch`?
- **Ponto**: Por que uma requisição `fetch()` que retorna o código de status HTTP `404 Not Found` não cai no bloco `catch` de um `try/catch`?
- **Ponto**: Quais são as três configurações fundamentais necessárias para enviar dados em formato JSON utilizando o método `POST` no `fetch`?
- **Ponto**: O que é e para que serve o `AbortController`?
- **Ponto**: Porque a Fetch API considera como "rejeição" apenas falhas físicas de rede (sem conexão, falha de DNS ou erro de CORS). Respostas HTTP válidas retornadas pelo servidor (mesmo com erros 4xx ou 5xx) resolvem a Promise normalmente

## Desafio
- **Ideia**: Escreva uma função `buscarComRetry(url, tentativas)` que tente realizar um `fetch(url)` até o número máximo de tentativas especificado
- **Detalhe**: Se a resposta não for `

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o funcionamento assíncrono, a classe `Response` e o tratamento de requisições com a Fetch API:
- **Ponto**: Qual propriedade da interface `Response` retorna `true` apenas se o código de status HTTP estiver na faixa de `200` a `299`?
- **Ponto**: O que acontece ao chamar o método `response.json()` em uma resposta com código HTTP `204 No Content`?
- **Ponto**: Por que `response.json()` retorna uma Promise em vez de devolver o objeto JavaScript imediatamente?
- **Ponto**: Como cancelar uma requisição `fetch()` em andamento caso a ação do usuário seja interrompida?
### Resposta e Erros HTTP
- **Ideia**: As questões a seguir avaliam a interpretação de códigos de status e respostas do servidor: Qual propriedade da interface `Response` retorna `true` apenas se o código de status HTTP estiver na faixa de `200` a `299`?
- **Ponto**: Qual propriedade da interface `Response` retorna `true` apenas se o código de status HTTP estiver na faixa de `200` a `299`?
- **Ponto**: O que acontece ao chamar o método `response.json()` em uma resposta com código HTTP `204 No Content`?
### Cancelamento e Interface
- **Ideia**: As questões a seguir avaliam o controle de fluxo, cancelamento de requisições e estados de tela: Como cancelar uma requisição `fetch()` em andamento caso a ação do usuário seja interrompida?
- **Ponto**: Como cancelar uma requisição `fetch()` em andamento caso a ação do usuário seja interrompida?
- **Ponto**: Quais são os três estados visuais fundamentais que uma interface deve representar durante uma chamada assíncrona?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
