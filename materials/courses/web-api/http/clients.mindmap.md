---
title: 'Web APIs: Clientes HTTP e Ecossistema de Ferramentas'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Clientes HTTP e Ecossistema de Ferramentas

## Ideia Central
- **Papel**: Ferramentas de comunicação HTTP, clientes GUI/CLI/IDE, bibliotecas JS, protocolos de API (SOAP, REST, GraphQL, gRPC, WebSockets) e diretórios de APIs públicas
- **Contexto**: No desenvolvimento Web moderno, a comunicação entre a interface (front-end) e os servidores de banco de dados ou APIs é realizada através de clientes HTTP e ferramentas de teste. Existem diferentes ecossistemas disponíveis, variando desde soluções nativas do navegador até utilitários de linha de comando, extensões de IDE e plataformas completas com interface gráfica
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Panorama dos Protocolos de API
- **Ideia**: As APIs de comunicação entre sistemas evoluíram para atender a diferentes necessidades de desempenho, tipagem e tempo real: Para aprofundar na história e comparação arquitetural de cada protocolo, confira o guia The Evolving Landscape of API Protocols in 2023 (ByteByteGo)

## Ecossistema de Clientes HTTP
- **Ideia**: Um Cliente HTTP é a ferramenta ou código responsável por compor, enviar e receber respostas HTTP
- **Ponto**: Postman: Plataforma colaborativa completa com suporte a testes automatizados, coleções e documentação
- **Ponto**: Insomnia: Cliente REST e GraphQL leve, responsivo e focado na experiência do desenvolvedor
- **Ponto**: Bruno: Cliente 100% local e nativo do Git, que armazena coleções como arquivos em texto puro (`.bru`) no próprio repositório
- **Ponto**: Hoppscotch: Cliente web open-source leve e acessível diretamente pelo navegador
### Interface Gráfica (GUI)
- **Ideia**: Softwares com interface visual rica para construção visual de requisições, testes de cabeçalhos e inspeção de respostas: Postman: Plataforma colaborativa completa com suporte a testes automatizados, coleções e documentação
- **Ponto**: Postman: Plataforma colaborativa completa com suporte a testes automatizados, coleções e documentação
- **Ponto**: Insomnia: Cliente REST e GraphQL leve, responsivo e focado na experiência do desenvolvedor
### Linha de Comando (CLI)
- **Ideia**: Utilitários de terminal ideais para scripts automatizados, ambientes de servidor (CI/CD) e testes rápidos de rede: curl: A ferramenta universal padrão em sistemas UNIX e Windows para transferência de dados via URLs
- **Ponto**: curl: A ferramenta universal padrão em sistemas UNIX e Windows para transferência de dados via URLs
- **Ponto**: wget: Utilitário robusto de download de arquivos e navegação HTTP/FTP
### Integrados à IDE
- **Ideia**: Extensões que permitem disparar requisições HTTP diretamente de dentro do seu editor de código sem alternar de janela: VS Code REST Client: Executa chamadas a partir de arquivos `
- **Ponto**: VS Code REST Client: Executa chamadas a partir de arquivos `.http` ou `.rest` versionáveis no projeto
- **Ponto**: Thunder Client: Extensão leve com interface gráfica integrada diretamente no VS Code
### Bibliotecas JavaScript (Código)
- **Ideia**: APIs e pacotes utilizados dentro da aplicação para fazer chamadas assíncronas ao backend: Fetch API: API nativa moderna do navegador e do Node
- **Ponto**: Fetch API: API nativa moderna do navegador e do Node.js baseada em Promises
- **Ponto**: Axios: Cliente HTTP baseado em Promises para Node.js e navegador com parse automático de JSON e interceptores (disponível no Guia de Pacotes JavaScript)

## Tabela Comparativa de Bibliotecas no Código JS
- **Ideia**: A escolha entre as bibliotecas se resume a quanto do trabalho repetitivo você quer escrever à mão

## APIs Públicas para Testes e Aprendizado
- **Ideia**: Ao estudar ou prototipar aplicações, é comum utilizar APIs públicas gratuitas
- **Ponto**: ViaCEP: API brasileira de consulta gratuita de CEPs (ex: `https://viacep.com.br/ws/01001000/json/`)
- **Ponto**: GitHub REST API: API do GitHub para consultar usuários, repositórios e eventos públicos
- **Ponto**: public-apis / public-apis (GitHub): O maior catálogo de APIs públicas gratuitas organizadas por categoria
- **Ponto**: TonnyL / Awesome_APIs (GitHub): Coleção selecionada de APIs web e serviços
### Exemplos de APIs Gratuitas
- **Ideia**: As APIs abaixo aceitam requisições sem cadastro e sem chave, o que as torna adequadas para praticar antes de ter um back-end próprio: ViaCEP: API brasileira de consulta gratuita de CEPs (ex: `https://viacep
- **Ponto**: ViaCEP: API brasileira de consulta gratuita de CEPs (ex: `https://viacep.com.br/ws/01001000/json/`)
- **Ponto**: GitHub REST API: API do GitHub para consultar usuários, repositórios e eventos públicos
### Diretórios e Listas Curadas de APIs
- **Ideia**: Para encontrar APIs de notícias, clima, filmes, esportes e finanças, consulte os repositórios comunitários: public-apis / public-apis (GitHub): O maior catálogo de APIs públicas gratuitas organizadas por categoria
- **Ponto**: public-apis / public-apis (GitHub): O maior catálogo de APIs públicas gratuitas organizadas por categoria
- **Ponto**: TonnyL / Awesome_APIs (GitHub): Coleção selecionada de APIs web e serviços

## Arquitetura: A Camada de Serviços (*Service Layer*)
- **Ideia**: Independente do cliente HTTP escolhido (`fetch` ou `axios`), nunca insira chamadas de rede diretamente dentro do código dos seus componentes visuais ou handlers de botões
- **Detalhe**: A boa prática de arquitetura exige criar uma Camada de Serviço isolada que encapsule todas as URLs, cabeçalhos de autenticação e detalhes de comunicação HTTP: Se no futuro o projeto precisar trocar o `fetch` nativo pelo `axios` (ou vice-versa), você precisará alterar apenas o arquivo `src/services/api

## Quando usar, e quando não usar?
- **Ideia**: Este tópico apresenta um ecossistema, e a decisão prática é sempre a mesma: usar o que já existe no navegador, ou trazer uma ferramenta que resolve algo que ele não resolve
- **Detalhe**: A tabela indica a escolha por etapa do trabalho, da exploração da API até o código que vai para produção: A quarta e a quinta linhas são as que decidem se o projeto ganha uma dependência

## Executando
- **Ideia**: Os passos usam a mesma requisição em três clientes diferentes, para mostrar que a ferramenta muda e o protocolo não: Abra o console do navegador com F12
- **Detalhe**: Copie o serviço abstrato criado acima e cole no console
- **Ponto**: Abra o console do navegador com F12
- **Ponto**: Copie o serviço abstrato criado acima e cole no console
- **Ponto**: Teste o método executando: `await produtoService.listar()`

## Exercício
- **Ideia**: Os itens comparam as ferramentas do ecossistema e exercitam a separação em camada de serviços: Qual a principal diferença entre os clientes GUI (como Postman ou Bruno) e extensões de IDE (como VS Code REST Client)?
- **Detalhe**: Qual protocolo de API é mais indicado para comunicação full-duplex bidirecional em tempo real?
- **Ponto**: Qual a principal diferença entre os clientes GUI (como Postman ou Bruno) e extensões de IDE (como VS Code REST Client)?
- **Ponto**: Qual protocolo de API é mais indicado para comunicação full-duplex bidirecional em tempo real?
- **Ponto**: Clientes GUI oferecem uma interface gráfica dedicada e rica fora do editor. Extensões de IDE (como VS Code REST Client) permitem escrever chamadas HTTP em arquivos de texto (`.http`) dentro do próprio projeto, facilitando o versionamento no Git
- **Ponto**: A WebSockets API, pois mantém uma conexão TCP persistente aberta entre cliente e servidor com baixa latência

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre ferramentas de consumo HTTP, protocolos e organização da camada de serviços:
- **Ponto**: O que distingue REST de GraphQL do ponto de vista do cliente?
- **Ponto**: Em que situação o gRPC costuma ser preferido?
- **Ponto**: Qual a vantagem de um arquivo `.http` sobre uma coleção exportada de cliente gráfico?
- **Ponto**: Quando um cliente de linha de comando é mais prático que um gráfico?
### Protocolos e ferramentas
- **Ideia**: As questões a seguir avaliam o uso e a distinção entre ferramentas de teste e estilos de API: O que distingue REST de GraphQL do ponto de vista do cliente?
- **Ponto**: O que distingue REST de GraphQL do ponto de vista do cliente?
- **Ponto**: Em que situação o gRPC costuma ser preferido?
### Bibliotecas e camada de serviços
- **Ideia**: As questões a seguir avaliam bibliotecas HTTP e o encapsulamento de chamadas na arquitetura front-end: O que `axios` e `ky` fazem que a Fetch API não faz sozinha?
- **Ponto**: O que `axios` e `ky` fazem que a Fetch API não faz sozinha?
- **Ponto**: Por que uma camada de serviços costuma bastar no lugar de uma biblioteca?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
