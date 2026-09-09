---
title: 'Web APIs: Objetos do Navegador'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Objetos do Navegador

## Ideia Central
- **Papel**: Browser Object Model (BOM): Window, Document, Location, History, Navigator e Console em JavaScript
- **Contexto**: Quando o JavaScript é executado dentro de um navegador web, ele ganha acesso a um conjunto de interfaces nativas chamadas Web APIs. O ponto central dessa infraestrutura é o Browser Object Model (BOM), que expõe o controle da janela, da URL, do histórico de navegação e do próprio documento HTML
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Browser Object Model (BOM)
- **Ideia**: O Browser Object Model representa o ambiente fornecido pelo navegador
- **Detalhe**: Ao contrário do ECMAScript puro (que trata apenas da linguagem), o BOM conecta o código JavaScript com a aba, a janela e o sistema do usuário

## Objeto Window
- **Ideia**: O objeto `window` representa a janela ou aba aberta no navegador
- **Detalhe**: Ele fornece dimensões de tela, controles de abertura de abas e diálogos nativos de interação
### Dimensões da Janela
- **Ideia**: As propriedades `innerWidth` e `innerHeight` retornam a largura e a altura da área útil de exibição da página (viewport), em pixels, excluindo barras de ferramentas do navegador:
### Diálogos Nativos
- **Ideia**: O navegador oferece três métodos síncronos para interagir diretamente com o usuário por meio de caixas de diálogo do sistema operacional: Diálogos nativos como `alert()`, `confirm()` e `prompt()` bloqueiam a execução de todo o código JavaScript e a renderização da página até que o usuário responda
### Abertura e Fechamento de Janelas
- **Ideia**: Você pode abrir novas abas ou janelas através do método `open()`: ---

## Objeto Location
- **Ideia**: O objeto `location` (ou `window
- **Detalhe**: location`) contém informações detalhadas sobre a URL da página atual e permite realizar redirecionamentos e recarregamentos
### Propriedades da URL
- **Ideia**: Considere a URL `https://exemplo
### Redirecionamento e Recarregamento
- **Ideia**: Para navegar programaticamente para uma nova página ou recarregar a página atual: ---

## Objeto History
- **Ideia**: O objeto `history` permite interagir com o histórico da aba atual, simulando os botões de avançar e voltar do navegador
- **Detalhe**: A History API moderna também fornece os métodos `history

## Objeto Navigator
- **Ideia**: O objeto `navigator` fornece informações sobre o navegador, a plataforma, o estado de conectividade e as permissões do dispositivo do usuário

## Objeto Console
- **Ideia**: O objeto `console` fornece acesso ao console de depuração do navegador
- **Detalhe**: Além do conhecido `console

## Executando
- **Ideia**: Siga os passos para inspecionar os objetos do BOM diretamente nas ferramentas do desenvolvedor: Abra qualquer página web no navegador Google Chrome ou Firefox
- **Detalhe**: Pressione F12 (ou clique com o botão direito e selecione Inspecionar)
- **Ponto**: Abra qualquer página web no navegador Google Chrome ou Firefox
- **Ponto**: Pressione F12 (ou clique com o botão direito e selecione Inspecionar)
- **Ponto**: Abra a aba Console
- **Ponto**: Digite `console.table(location)` e pressione Enter para inspecionar as propriedades da URL atual em formato de tabela

## Exercício
- **Ideia**: Responda aos itens a seguir aplicando os conceitos dos objetos do BOM: Qual a diferença prática entre redirecionar um usuário via `location
- **Detalhe**: href = url` e via `location
- **Ponto**: Qual a diferença prática entre redirecionar um usuário via `location.href = url` e via `location.replace(url)`?
- **Ponto**: Como obter os parâmetros de busca (`search`) de uma URL e ler o valor do parâmetro `categoria`?
- **Ponto**: Escreva um trecho de código que exiba um alerta caso o usuário esteja sem conexão com a internet (`navigator.onLine`)
- **Ponto**: O `location.href` (ou `location.assign`) adiciona a nova página no histórico da aba, permitindo que o usuário clique no botão "Voltar". O `location.replace` substitui a página atual no histórico, impedindo que o usuário volte para a página anterior

## Desafio
- **Ideia**: Crie uma função `medirTempoDeExecucao(fn)` que receba uma função qualquer como parâmetro, execute essa função e utilize os métodos `console
- **Detalhe**: time()` e `console

## Cuidados com Server-Side Rendering (SSR)
- **Ideia**: Em frameworks modernos de renderização no servidor (*Server-Side Rendering*) como Next
- **Detalhe**: js, Nuxt, SvelteKit e Astro, o código JavaScript da página executa primeiro no ambiente Node

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre a hierarquia de objetos globais do navegador e a BOM:
- **Ponto**: Por que variáveis declaradas com `var` no escopo global viram propriedades de `window`, mas variáveis declaradas com `let` ou `const` não?
- **Ponto**: Qual é o risco de utilizar diálogos nativos como `window.alert()` em aplicações em produção?
- **Ponto**: Qual propriedade do objeto `location` retorna apenas o caminho da URL após o nome do domínio?
- **Ponto**: Como funciona o método `history.go(-1)`?
### Objeto Window e BOM
- **Ideia**: As questões a seguir avaliam o papel do objeto global e os riscos de bloqueio da thread principal: Por que variáveis declaradas com `var` no escopo global viram propriedades de `window`, mas variáveis declaradas com `let` ou `const` não?
- **Ponto**: Por que variáveis declaradas com `var` no escopo global viram propriedades de `window`, mas variáveis declaradas com `let` ou `const` não?
- **Ponto**: Qual é o risco de utilizar diálogos nativos como `window.alert()` em aplicações em produção?
### Objeto Location e History
- **Ideia**: As questões a seguir avaliam a inspeção de URLs e o controle do histórico de navegação: Qual propriedade do objeto `location` retorna apenas o caminho da URL após o nome do domínio?
- **Ponto**: Qual propriedade do objeto `location` retorna apenas o caminho da URL após o nome do domínio?
- **Ponto**: Como funciona o método `history.go(-1)`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
