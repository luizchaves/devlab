---
title: 'Web APIs: Manipulação do DOM'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Manipulação do DOM

## Ideia Central
- **Papel**: Árvore DOM, seleção de elementos, alteração de conteúdo, manipulação de classes, atributos e estilos com JavaScript
- **Contexto**: O Document Object Model (DOM) é uma interface de programação que representa um documento HTML estruturado como uma árvore de objetos. Através do DOM, o JavaScript consegue acessar, modificar, criar ou remover dinamicamente qualquer elemento, estilo ou atributo da página em tempo de execução
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## A Árvore DOM
- **Ideia**: Quando o navegador carrega um arquivo HTML, o motor de renderização analisa a marcação e constrói uma representação hierárquica na memória
- **Detalhe**: Cada tag, texto e atributo torna-se um nó (*Node*) na árvore DOM
- **Sequência didática**: primeiro leia o HTML de entrada, depois observe sua representação em árvore
- **Representação completa**: inclui elementos, atributos (`class`, `href`) e textos (`DevLab`, `Manipulação do DOM`, frase do parágrafo, `MDN` e ponto final)
- **Ponto**: `Document`: O nó raiz de todo o documento HTML
- **Ponto**: `Element`: Representa qualquer tag HTML (``, ``, ``)
- **Ponto**: `Text`: O conteúdo de texto dentro ou entre as tags
- **Ponto**: `Attr`: Os atributos associados aos elementos (ex: `href`, `class`)

## Seleção de Elementos
- **Ideia**: Antes de alterar qualquer elemento da página, é necessário obtê-lo através dos métodos de consulta do objeto `document`
### Métodos Modernos de Seleção (`querySelector`)
- **Ideia**: Os métodos `querySelector` e `querySelectorAll` utilizam a mesma sintaxe de seletores CSS:
### Métodos Tradicionais de Seleção
- **Ideia**: Antes dos seletores CSS, cada critério de busca tinha um método próprio

## Conteúdo de Elementos
- **Ideia**: Existem três propriedades principais para ler ou alterar o conteúdo de um elemento HTML: Nunca atribua entradas não confiáveis do usuário diretamente ao `innerHTML`
- **Detalhe**: Isso expõe sua aplicação a ataques de Cross-Site Scripting (XSS)

## Alteração de Estilos e Classes
- **Ideia**: A melhor prática para alterar o visual de um elemento é manipular suas classes CSS através da propriedade `classList`
- **CSSOM**: DOM guarda elementos e atributos; CSSOM guarda regras CSS; a renderização combina ambos
- **Decisão**: `classList` para estados visuais, `style` para valores calculados dinamicamente
### A propriedade `classList`
- **Ideia**: O objeto `classList` fornece métodos convenientes para alterar o estado visual sem sobrescrever outras classes:
### Estilos Inline (`style`)
- **Ideia**: Caso seja necessário aplicar estilos dinâmicos diretos (ex: posições calculadas em pixels): ---

## Manipulação de Atributos
- **Ideia**: É possível ler, definir ou remover atributos HTML de qualquer elemento através da interface de atributos: ---

## Propriedades de Formulários
- **Ideia**: Elementos de entrada de formulários (``, ``, ``) possuem propriedades dedicadas para capturar dados digitados pelo usuário: ---

## Quando usar, e quando não usar?
- **Ideia**: As APIs de manipulação se sobrepõem bastante, e quase toda alteração pode ser escrita de três formas diferentes
- **Detalhe**: A escolha errada raramente quebra a página; ela cobra depois, em desempenho, em acessibilidade ou em segurança

## Executando
- **Ideia**: Siga os passos abaixo no console do desenvolvedor para manipular elementos em tempo real: Pressione F12 em qualquer página web para abrir as ferramentas do desenvolvedor
- **Detalhe**: Selecione a aba Console
- **Ponto**: Pressione F12 em qualquer página web para abrir as ferramentas do desenvolvedor
- **Ponto**: Selecione a aba Console
- **Ponto**: Altere o título principal da página atual executando: `document.querySelector('h1').textContent = 'DevLab - DOM Alterado!';`
- **Ponto**: Mude a cor de fundo da página digitando: `document.body.style.backgroundColor = 'f0fdf4';`

## Exercício
- **Ideia**: Os itens abaixo exercitam seleção, alteração de conteúdo e a escolha entre `textContent` e `innerHTML`: Qual a diferença conceitual e de segurança entre utilizar `element
- **Detalhe**: textContent` e `element
- **Ponto**: Qual a diferença conceitual e de segurança entre utilizar `element.textContent` e `element.innerHTML`?
- **Ponto**: Como alternar a classe `ativo` em um elemento com ID `menu` ao clicar nele?
- **Ponto**: Dado o HTML `Perfil`, como ler o ID do usuário via JavaScript?
- **Ponto**: `textContent` trata todo o valor atribuído como texto puro, neutralizando qualquer tag HTML e evitando falhas de segurança XSS. O `innerHTML` interpreta e compila strings como marcação HTML, o que permite injeção de scripts maliciosos se a string contiver dados do usuário

## Desafio
- **Ideia**: Crie uma função `destacarLinksExternos()` que selecione todos os links `` da página e adicione a classe CSS `link-externo` e o atributo `target="_blank"` apenas naqueles cujo atributo `href` comece com `"http"`

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre seleção de nós, manipulação de atributos e estilos no DOM:
- **Ponto**: Por que a chamada `document.querySelector('.invalido')` retorna `null` caso o seletor não encontre nenhum elemento?
- **Ponto**: Como converter uma `NodeList` estática em um Array nativo do JavaScript?
- **Ponto**: Por que é preferível usar `classList.add()` em vez de modificar `element.className` diretamente?
### Seleção e Árvore DOM
- **Ideia**: As questões a seguir avaliam o comportamento de seletores e coleções de nós: Por que a chamada `document
- **Ponto**: Por que a chamada `document.querySelector('.invalido')` retorna `null` caso o seletor não encontre nenhum elemento?
- **Ponto**: Como converter uma `NodeList` estática em um Array nativo do JavaScript?
### Alteração de Atributos e Estilos
- **Ideia**: As questões a seguir avaliam a manipulação segura de classes e propriedades visuais: Por que é preferível usar `classList
- **Ponto**: Por que é preferível usar `classList.add()` em vez de modificar `element.className` diretamente?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
