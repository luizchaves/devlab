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
title: "Web APIs: Clientes HTTP e Ecossistema de Ferramentas"
description: "Slides completos do tópico Web APIs: Clientes HTTP e Ecossistema de Ferramentas."
---

<!-- _class: lead -->

# Web APIs: Clientes HTTP e Ecossistema de Ferramentas

Panorama dos Protocolos de API · Ecossistema de Clientes HTTP · Tabela Comparativa de Bibliotecas no Código JS · APIs Públicas para Testes e Aprendizado

---

## Objetivo

- Comparar os protocolos de API mais usados (SOAP, REST, GraphQL, gRPC e WebSockets) pelo problema que cada um resolve.
- Escolher entre clientes GUI, CLI e de IDE para testar um endpoint durante o desenvolvimento.
- Comparar `fetch`, `axios` e `ky` por dependência, ergonomia e tratamento de erro.
- Localizar APIs públicas confiáveis para praticar integração.
- Isolar o acesso HTTP em uma camada de serviços (*service layer*) em vez de espalhar `fetch()` pela interface.

---

## Mapa do Tópico

- **Panorama dos Protocolos de API**.
- **Ecossistema de Clientes HTTP**.
- **Tabela Comparativa de Bibliotecas no Código JS**.
- **APIs Públicas para Testes e Aprendizado**.
- **Arquitetura: A Camada de Serviços (*Service Layer*)**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Panorama dos Protocolos de API

As APIs de comunicação entre sistemas evoluíram para atender a diferentes necessidades de desempenho, tipagem e tempo real.

- **REST**: Padrão dominante da Web para aplicações web e móveis.
- **GraphQL**: Front-ends complexos que precisam buscar dados sob medida.
- **gRPC**: Comunicação microsserviço-a-microsserviço de alta performance.
- **WebSockets**: Chat, notificações em tempo real, dashboards ao vivo.
- **SOAP**: Sistemas corporativos legados, bancos e setor governamental.

---

## Ecossistema de Clientes HTTP

Um Cliente HTTP é a ferramenta ou código responsável por compor, enviar e receber respostas HTTP.

- Postman: Plataforma colaborativa completa com suporte a testes automatizados, coleções e documentação.
- Insomnia: Cliente REST e GraphQL leve, responsivo e focado na experiência do desenvolvedor.
- Bruno: Cliente 100% local e nativo do Git, que armazena coleções como arquivos em texto puro (`.bru`) no próprio repositório.
- Hoppscotch: Cliente web open-source leve e acessível diretamente pelo navegador.

---

## Ecossistema de Clientes HTTP: Casos

- **Interface Gráfica (GUI)**: Softwares com interface visual rica para construção visual de requisições.
- **Linha de Comando (CLI)**: Utilitários de terminal ideais para scripts automatizados, ambientes de servidor (CI/CD).
- **Integrados à IDE**: Extensões que permitem disparar requisições HTTP diretamente de dentro do seu editor de código.
- **Bibliotecas JavaScript (Código)**: APIs e pacotes utilizados dentro da aplicação para fazer chamadas assíncronas ao backend.

---

## Tabela Comparativa de Bibliotecas no Código JS

A escolha entre as bibliotecas se resume a quanto do trabalho repetitivo você quer escrever à mão.

- **Status**: Biblioteca Externa (npm).
- **Sintaxe**: Baseado em Promises.
- **Parse de JSON**: Automático (`res.data`).
- **Erros 4xx/5xx**: Rejeita a Promise.
- **Cancelamento**: `AbortController` / CancelToken.

---

## APIs Públicas para Testes e Aprendizado

Ao estudar ou prototipar aplicações, é comum utilizar APIs públicas gratuitas.

- ViaCEP: API brasileira de consulta gratuita de CEPs (ex: `https://viacep.com.br/ws/01001000/json/`).
- GitHub REST API: API do GitHub para consultar usuários, repositórios e eventos públicos.
- public-apis / public-apis (GitHub): O maior catálogo de APIs públicas gratuitas organizadas por categoria.
- TonnyL / Awesome_APIs (GitHub): Coleção selecionada de APIs web e serviços.

---

## Arquitetura: A Camada de Serviços (*Service Layer*)

Independente do cliente HTTP escolhido (`fetch` ou `axios`), nunca insira chamadas de rede diretamente dentro do código dos seus componentes.

- A boa prática de arquitetura exige criar uma Camada de Serviço isolada que encapsule todas as URLs.
- <Aside type="tip" title="Benefício da Abstração"> Se no futuro o projeto precisar trocar o `fetch` nativo pelo `axios` (ou vice-versa).
- js.

---

## Quando usar, e quando não usar?

Este tópico apresenta um ecossistema, e a decisão prática é sempre a mesma: usar o que já existe no navegador.

- **Explorar uma API desconhecida**: Escrever `fetch()` para descobrir o formato da resposta.
- **Documentar as requisições junto do código**: Coleção exportada, que fica fora do controle de versão.
- **Conferir cabeçalhos e status rapidamente**: Abrir um cliente gráfico para uma chamada só.
- **Código de produção com poucas chamadas**: Biblioteca externa, que acrescenta dependência sem ganho.
- **Muitas chamadas com a mesma configuração**: `axios` só para ter uma URL base.

---

## Executando

1. Abra o console do navegador com <kbd>F12</kbd>.
2. Copie o serviço abstrato criado acima e cole no console.
3. Teste o método executando: `await produtoService.listar()`.

---

## Exercício Prático

1. Qual a principal diferença entre os clientes GUI (como Postman ou Bruno) e extensões de IDE (como VS Code REST Client)?
2. Qual protocolo de API é mais indicado para comunicação full-duplex bidirecional em tempo real?
3. Clientes GUI oferecem uma interface gráfica dedicada e rica fora do editor.
4. A WebSockets API, pois mantém uma conexão TCP persistente aberta entre cliente e servidor com baixa latência.

---

## Perguntas de revisão

1. O que distingue REST de GraphQL do ponto de vista do cliente?
2. Em que situação o gRPC costuma ser preferido?
3. Qual a vantagem de um arquivo `.http` sobre uma coleção exportada de cliente gráfico?
4. Quando um cliente de linha de comando é mais prático que um gráfico?
5. O que `axios` e `ky` fazem que a Fetch API não faz sozinha?

---

## Resumo do Tópico

- **Panorama dos Protocolos de API**: revise o papel desse eixo no uso da API.
- **Ecossistema de Clientes HTTP**: revise o papel desse eixo no uso da API.
- **Tabela Comparativa de Bibliotecas no Código JS**: revise o papel desse eixo no uso da API.
- **APIs Públicas para Testes e Aprendizado**: revise o papel desse eixo no uso da API.
- **Arquitetura: A Camada de Serviços (*Service Layer*)**: revise o papel desse eixo no uso da API.
