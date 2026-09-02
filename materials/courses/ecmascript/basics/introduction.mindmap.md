---
title: 'JavaScript: Introdução e Ecossistema'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Introdução e Ecossistema

## Objetivo
- Entender a origem do JavaScript, diferenciar JavaScript de ECMAScript, reconhecer o papel das Web APIs.

## Por Que JavaScript Importa?
- JavaScript se tornou uma das linguagens centrais da Web porque é suportada pelos navegadores.
- Quando uma página precisa reagir a cliques, validar um formulário, alterar elementos.
- Com Node.js, a linguagem também passou a ser usada fora do navegador.
- Isso permitiu usar JavaScript para escrever servidores, ferramentas de linha de comando, scripts de automação, testes.

## Origem e a História dos Nomes
- JavaScript foi criado em maio de 1995 por Brendan Eich enquanto trabalhava na Netscape.
### A Evolução dos Nomes da Linguagem
- Nome: Ano; Contexto e Motivação
- Mocha: Maio / 1995; Nome interno do projeto durante o desenvolvimento do protótipo por Brendan Eich.
- LiveScript: Setembro / 1995; Nome da primeira versão lançada comercialmente no Netscape Navigator 2.0.
- JavaScript: Dezembro / 1995; Parceria de marketing com a Sun Microsystems (marca hoje pertencente à Oracle).
- ECMAScript: 1996 - Presente; Especificação técnica oficial e padronizada pela Ecma International (ECMA-262).
### Padronização ECMA-262 e o TC39
- ECMAScript: especificação formal mantida pelo comitê TC39 (padrão ECMA-262)
- Motores de execução: V8 (Chrome/Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari)
- Pipeline do V8: Scanner/Parser (AST) -> Ignition (Bytecode) -> TurboFan (JIT nativo) -> Desotimização (Deopt)

## Evolução da Linguagem
- Estágios do TC39 (Stages 0 a 4) para amadurecimento de novas propostas
- Edições anuais da especificação (ES2015/ES6 até ES2024+)
- Disponibilidade em runtimes e navegadores

## JavaScript, ECMAScript e Web APIs
- ECMAScript: Define a linguagem base (variáveis, funções, objetos, arrays, classes, módulos, promises)
- JavaScript: Nome comum da linguagem usada pelos desenvolvedores nos arquivos `.js` ou `<script>`
- Web APIs: Recursos fornecidos pelo navegador (DOM, eventos, `fetch`, `localStorage`, timers, console)
- Node.js APIs: Recursos exclusivos do runtime no servidor (`process`, `Buffer`, `node:fs`, `node:http`, `node:path`)
- npm: Ecossistema de pacotes (Express, Vite, Prisma, bibliotecas de teste)

## Onde o Código Executa?
- O mesmo núcleo da linguagem pode aparecer em ambientes diferentes.
- Cada ambiente adiciona suas próprias APIs e restrições.

## O Que a Linguagem Oferece?
- Área: Exemplos; Por que importa
- Valores e tipos: `number`, `string`, `boolean`, `undefined`, `null`, objetos; Representar dados da aplicação
- Variáveis: `let`, `const`; Guardar valores e controlar escopo
- Expressões e operadores: `+`, `===`, `&&`, `??`, `?.`; Calcular, comparar e compor valores
- Controle de fluxo: `if`, `switch`, `for`, `while`; Decidir caminhos e repetir tarefas
- Funções: declarações, arrow functions, callbacks; Organizar comportamento reutilizável

## Características Importantes
- Alto nível: Gerenciamento automático de memória via Garbage Collector
- Execução JIT: Combina interpretação rápida e compilação nativa em tempo de execução
- Tipagem dinâmica: Tipos vinculados aos dados em memória e não às variáveis
- Tipagem fraca: Coerção implícita de tipos durante operações aritméticas e concatenações
- Multiparadigma: Estilos funcional e orientado a eventos no navegador (callbacks e escutadores)
- Protótipos: Herança direta entre objetos por meio da cadeia de protótipos (prototype chain)
- ASI: Inserção automática de ponto e vírgula (estilos com e sem ';' padronizados por linters e formatadores)

## Comentários em JavaScript
- Anotações no código ignoradas pelo motor de execução
- Linha Única (`//`): notas curtas que vão até o fim da linha
- Múltiplas Linhas (`/* ... */`): blocos de texto ou desativação temporária de código
- Documentação JSDoc (`/** ... */`): padrão oficial com tags @param e @returns para autocompletar e inteligência no editor

## Como Executar JavaScript
- Existem várias formas de executar um primeiro código JavaScript.
- Elas não são uma sequência obrigatória; são cenários diferentes.
- Escolha o ambiente conforme o que você quer testar.
### Runtimes fora do navegador
- Verifique a versão instalada
- Crie um arquivo JavaScript
- Execute o arquivo pelo terminal
- Modo Interativo (Node.js REPL)
- Teste TypeScript quando fizer sentido
### Console do navegador
- Abra o DevTools do navegador e use a aba Console para testar expressões rápidas.
### Arquivo carregado pelo navegador
- Crie a página HTML
- Crie o arquivo JavaScript
- Abra a página no navegador
- Nesse cenário, o JavaScript é carregado por uma página HTML.
- O output de `console.log()` não aparece no corpo da página; ele aparece no Console do DevTools.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
