---
title: 'Guia de Web APIs'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Guia de Web APIs

## Ideia Central
- **Papel**: Guia completo das Web APIs do navegador: ciclo de vida da página, DOM, eventos, armazenamento, rede HTTP, WebSockets, APIs de dispositivo, observadores e execução em segundo plano
- **Contexto**: O Guia de Web APIs estuda as interfaces nativas que o navegador disponibiliza para que o JavaScript interaja com a página, a rede, o armazenamento e os recursos do sistema operacional
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Página Estática x Dinâmica
- **Estática**: HTML, CSS e assets chegam prontos ao navegador
- **Dinâmica no cliente**: JavaScript altera DOM, reage a eventos e busca dados
- **Dinâmica com servidor**: back-end monta ou entrega dados por REST, GraphQL ou SSR
- **Virada prática**: interface muda sem trocar o documento inteiro

## Trilhas de Aprendizado
- **Ideia**: O guia está organizado em trilhas de aprendizado, agrupadas pelo tipo de recurso que cada API expõe
- **Detalhe**: Os cartões abaixo listam as páginas de cada trilha: Conheça o ciclo de vida da página, o modelo de objetos do navegador (BOM), roteamento SPA com a History API e a visão geral do catálogo

## Os Três Sentidos da Palavra API
- **Ideia**: O termo API (*Application Programming Interface*) é amplamente utilizado no desenvolvimento de software, mas pode se referir a três níveis de abstração completamente distintos
- **Detalhe**: Desfazer essa ambiguidade cedo evita a confusão mais comum de quem estuda o desenvolvimento web: API da Linguagem (Standard Library do ECMAScript): São os tipos, objetos e métodos utilitários padronizados pela especificação da linguagem JavaScript
- **Ponto**: API da Linguagem (Standard Library do ECMAScript): São os tipos, objetos e métodos utilitários padronizados pela especificação da linguagem JavaScript. Exemplos incluem a API de manipulação de strings (`String.prototype.includes()`, `slice()`), de arrays (`map()`, `filter()`, `reduce()`), e utilitários como `Math`, `JSON` e `Promise`. Essas funções rodam de forma idêntica em qualquer ambiente (navegador, Node.js, Deno ou Bun) porque pertencem ao próprio JavaScript
- **Ponto**: Web API (Interface do Navegador / Host): São as interfaces que o navegador expõe para permitir que o JavaScript acesse a página, a tela, a persistência e o hardware (`document`, `window`, `localStorage`, `fetch()`, `WebSocket`, `navigator.geolocation`). Elas não pertencem ao padrão ECMAScript, mas sim às especificações da W3C e WHATWG implementadas pelo navegador
- **Ponto**: API Web (Serviço Remoto HTTP): São os serviços de back-end acessíveis através da rede por requisições HTTP. Arquiteturas como REST e GraphQL definem como o servidor organiza suas rotas e payloads; elas não são métodos que você executa no JavaScript, mas contratos de comunicação que você consome via `fetch()`

## Roteiro Sugerido de Estudos
- **Ideia**: Se esta é a sua primeira passagem pelo guia, comece por O que uma Aplicação Front-end Faz?
- **Detalhe**: : a página liga cada funcionalidade recorrente de uma aplicação vanilla à Web API que a resolve, e serve de índice por problema para tudo o que vem depois
- **Ponto**: Fundamentos do Ambiente: Comece por Ciclo de Vida da Página e Objetos do Navegador para entender quando o código é executado e quais objetos globais existem
- **Ponto**: DOM e Interatividade: Domine a Manipulação do DOM, Eventos, Elementos Dinâmicos, Formulários e Validação e Rolagem e Posicionamento
- **Ponto**: Armazenamento de Dados: Estude Local Storage e Cookies para gerenciar estados e sessões no cliente
- **Ponto**: Rede e Comunicação: Consuma dados assíncronos com a Fetch API, receba eventos em streaming com Server-Sent Events, comunique-se em tempo real com a WebSockets API, entenda CORS e Segurança, REST API, GraphQL e renderização no servidor com Server-Side Rendering (SSR)

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
