---
title: 'Web APIs: Ciclo de Vida da Página'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Ciclo de Vida da Página

## Ideia Central
- **Papel**: Carregamento do HTML, DOMContentLoaded, load, defer, type module, visibilitychange e eventos de navegação no navegador
- **Contexto**: Antes de manipular elementos com JavaScript, é preciso entender em que momento a página existe. O navegador baixa o HTML, interpreta as tags, constrói a árvore DOM, carrega arquivos externos, executa scripts e dispara eventos em uma ordem específica
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Caminho do HTML até a Página Interativa
- **Ideia**: Quando o navegador requisita um endereço na web, a página não surge instantaneamente pronta
- **Detalhe**: O navegador recebe um fluxo contínuo de bytes pela rede e realiza diversas tarefas em paralelo: analisa as tags HTML (*parsing*), constrói a árvore de elementos do DOM, dispara o download de recursos externos (folhas de estilo CSS, imagens, fontes e scripts JavaScript) e executa o código conforme as regras de bloqueio de cada tag
- **Ponto**: Recepção do Stream e Parsing Incremental: O navegador não aguarda o arquivo `.html` completo chegar pela rede para iniciar o processamento. Conforme os primeiros pacotes de bytes chegam, o parser converte o texto em tokens (``, ``, ``) e insere os nós correspondentes na árvore DOM
- **Ponto**: Preload Scanner e Downloads em Paralelo: Enquanto o parser principal analisa o documento sequencialmente, um processo em segundo plano (*Preload Scanner*) inspeciona o arquivo à procura de tags ``, `` e ``, solicitando o download desses recursos pela rede o mais cedo possível
- **Ponto**: Ponto Crítico de Bloqueio do Parser: Ao encontrar uma tag `` síncrona tradicional (sem `defer`, `async` ou `type="module"`), o parser interrompe a leitura do HTML, baixa o arquivo e o executa imediatamente. Já scripts com o atributo `async` baixam em paralelo sem travar o HTML, mas pausam o parser no instante exato em que o download termina para executar o código (sem ordem garantida). Somente scripts com `defer` ou `type="module"` eliminam totalmente o bloqueio durante a leitura do documento, postergando sua execução para depois que a árvore DOM estiver montada
- **Ponto**: Disparo do Evento `DOMContentLoaded`: Assim que o parser atinge a tag de fechamento `` e todos os scripts com `defer` ou módulos foram executados, o evento `DOMContentLoaded` é emitido. Neste estágio, a estrutura de elementos está completamente montada na memória
### O Processo de Carregamento Passo a Passo
- **Ideia**: O fluxo demonstrado na linha do tempo organiza-se em cinco etapas fundamentais: Recepção do Stream e Parsing Incremental: O navegador não aguarda o arquivo `
- **Ponto**: Recepção do Stream e Parsing Incremental: O navegador não aguarda o arquivo `.html` completo chegar pela rede para iniciar o processamento. Conforme os primeiros pacotes de bytes chegam, o parser converte o texto em tokens (``, ``, ``) e insere os nós correspondentes na árvore DOM
- **Ponto**: Preload Scanner e Downloads em Paralelo: Enquanto o parser principal analisa o documento sequencialmente, um processo em segundo plano (*Preload Scanner*) inspeciona o arquivo à procura de tags ``, `` e ``, solicitando o download desses recursos pela rede o mais cedo possível
### Impacto Prático no Código Front-end
- **Ideia**: Compreender essa cronologia evita os dois erros mais recorrentes no desenvolvimento front-end com JavaScript vanilla: Seleção de elementos inexistentes (`null`): Se um script for executado no `` sem atributos assíncronos, o parser ainda não terá chegado nas tags do ``
- **Ponto**: Seleção de elementos inexistentes (`null`): Se um script for executado no `` sem atributos assíncronos, o parser ainda não terá chegado nas tags do ``. Qualquer chamada a `document.querySelector('botao')` retornará `null`, gerando a clássica exceção `TypeError: Cannot read properties of null`
- **Ponto**: Medição de dimensões zeradas em imagens: No momento em que o evento `DOMContentLoaded` dispara, os nós `` já existem no DOM, mas os arquivos de imagem podem ainda estar em trânsito pela rede. Tentar ler propriedades dimensionais como `img.offsetWidth` ou `img.naturalHeight` nesse instante pode retornar `0`. Medições geométricas de mídia só são confiáveis após o evento `load` da própria imagem ou de `window`

## Formas de Integrar JavaScript ao HTML
- **Ideia**: No desenvolvimento web, o código JavaScript pode ser conectado ao HTML de múltiplas maneiras
- **Detalhe**: Cada formato define regras próprias de isolamento de escopo, ordem de execução e manutenção da aplicação
- **Ponto**: No `` sem atributos assíncronos (``): O parser do navegador é interrompido imediatamente antes de ler as tags visuais do ``. O usuário enxerga uma tela em branco até o arquivo ser baixado e executado. Como o DOM do corpo ainda não existe na memória, qualquer tentativa de selecionar elementos via `document.querySelector('btn-salvar')` retornará `null`, quebrando a inicialização da interface
- **Ponto**: No `` com `defer` ou `type="module"` (Padrão moderno recomendado): O navegador inicia o download do script em paralelo nos primeiros milissegundos de vida da página, sem pausar o parser do HTML. O código só é executado após a árvore de elementos estar totalmente construída, permitindo capturar qualquer nó com segurança e proporcionando a melhor performance de renderização
- **Ponto**: No final do `` (Imediatamente antes de ``): É a prática clássica mais adotada no desenvolvimento web tradicional para contornar o erro de seleção de nós inexistentes em scripts sem `defer`. Como todo o HTML anterior já foi lido e transformado em nós do DOM, os elementos estão disponíveis. A desvantagem é que o navegador só descobre a necessidade de baixar o arquivo quando o parser alcança o fim do documento, atrasando o momento em que a página se torna interativa
- **Ponto**: No meio do ``: O script bloqueia o parsing no ponto exato onde foi inserido. Ele consegue interagir com os elementos declarados antes dele, mas não com os elementos que vêm depois, além de pausar a renderização do restante do conteúdo
### 1. Script Embutido (Inline) vs Arquivo Externo
- **Ideia**: A tag `` pode conter o código diretamente em seu corpo ou apontar para um arquivo externo através do atributo `src`: Existe uma regra inviolável do elemento ``: a tag ou contém código interno entre `` e ``, ou utiliza o atributo `src`, mas nunca os dois ao mesmo tempo
### 2. Posicionamento da Tag: `` vs `` e suas Implicações
- **Ideia**: Além de escolher entre código embutido ou arquivo externo, o local físico onde a tag `` é inserida no documento HTML afeta diretamente o tempo de carregamento da página e a disponibilidade dos nós do DOM
- **Ponto**: No `` sem atributos assíncronos (``): O parser do navegador é interrompido imediatamente antes de ler as tags visuais do ``. O usuário enxerga uma tela em branco até o arquivo ser baixado e executado. Como o DOM do corpo ainda não existe na memória, qualquer tentativa de selecionar elementos via `document.querySelector('btn-salvar')` retornará `null`, quebrando a inicialização da interface
- **Ponto**: No `` com `defer` ou `type="module"` (Padrão moderno recomendado): O navegador inicia o download do script em paralelo nos primeiros milissegundos de vida da página, sem pausar o parser do HTML. O código só é executado após a árvore de elementos estar totalmente construída, permitindo capturar qualquer nó com segurança e proporcionando a melhor performance de renderização
### 3. Código em Atributos HTML (Manipuladores Inline e Pseudo-protocolos)
- **Ideia**: O HTML permite historicamente executar código JavaScript embutido diretamente dentro de atributos de tags, como manipuladores de eventos (`onclick`, `oninput`) e o pseudo-protocolo `javascript:` no atributo `href`: O pseudo-protocolo `javascript:` em links `` é outro recurso antigo que instrui o navegador a interpretar o restante da URL como uma instrução de código: Apesar de funcionarem por compatibilidade com versões antigas da web, essas abordagens são fortemente desencorajadas em projetos modernos: Mistura de responsabilidades: Dificulta a manutenção ao espalhar regras de negócio e lógica de controle dentro da estrutura visual da página
- **Ponto**: Mistura de responsabilidades: Dificulta a manutenção ao espalhar regras de negócio e lógica de controle dentro da estrutura visual da página
- **Ponto**: Escopo confuso: O código dentro de um `onclick` roda em uma cadeia de escopos oculta do navegador, o que gera comportamentos imprevisíveis ao tentar acessar variáveis do script principal
### 4. Escopo e Visibilidade entre Contextos de Execução
- **Ideia**: Quando você possui vários scripts na mesma página, a visibilidade de variáveis depende do tipo da tag `<script>` utilizada
- **Ponto**: Scripts Clássicos (`<script>`): Compartilham o escopo global. Declarações com `var` e `function` viram propriedades diretas de `window`. Variáveis `let` e `const` permanecem visíveis para scripts subsequentes
- **Ponto**: Módulos JavaScript (`<script type="module">`): Possuem escopo fechado por arquivo, sem poluir o escopo global
- **Ordem de Carregamento**: O hoisting não atravessa blocos `<script>` distintos; chamar bibliotecas ou funções antes da tag que as define gera `ReferenceError`
### 5. Tabela Comparativa de Integração
- **Ideia**: A tabela resume as opções de integração de código JavaScript no HTML: ---

## Tempo de Execução e Eventos da Página
- **Ideia**: Depois de escolher como o JavaScript entra no HTML, a próxima decisão é quando esse código deve executar
### Scripts Síncronos, `defer`, `async` e Módulos
- **Ideia**: A tag `<script src="...">` controla quando o arquivo é baixado e quando ele é executado
- **Ponto**: `defer` e `type="module"` baixam em paralelo e executam com o DOM pronto
- **Ponto**: `async` serve para scripts independentes, pois não preserva ordem relativa
### `DOMContentLoaded` vs `load`
- **Ideia**: `DOMContentLoaded` dispara quando o DOM está montado; `load` espera imagens, CSS, iframes e outros recursos externos
- **Ponto**: Inicialize interatividade com `DOMContentLoaded`
- **Ponto**: Use `load` quando a lógica depende das dimensões finais de recursos externos
### `document.readyState`
- **Ideia**: `document.readyState` informa se o documento está em `loading`, `interactive` ou `complete`
- **Ponto**: Bibliotecas reaproveitáveis podem decidir entre executar agora ou aguardar `DOMContentLoaded`
### Página Visível, Oculta ou Descartada
- **Ideia**: A página pode ficar invisível, voltar ao primeiro plano ou ser descartada pelo navegador
- **Ponto**: `visibilitychange` permite pausar animações, reduzir polling e salvar rascunhos
- **Ponto**: `beforeunload` deve ser usado com moderação para avisar sobre perda real de trabalho não salvo

## Quando usar, e quando não usar?
- **Ideia**: Escolher o momento de execução é uma decisão de uma linha, tomada no atributo da tag ou no nome do evento, e ela define se o script vê o DOM pronto, se ele atrasa a primeira pintura da página e se ele ainda roda quando o usuário troca de aba
- **Detalhe**: A tabela reúne as cinco situações mais frequentes e a alternativa que perde em cada uma: As duas últimas linhas costumam ser trocadas uma pela outra

## Erros Comuns
- **Ideia**: Três sintomas concentram quase todo problema de sincronização entre script e DOM

## Executando
- **Ideia**: Os passos abaixo usam o console do navegador para observar, na ordem real, cada marco do carregamento: Crie um arquivo `index
- **Detalhe**: html` com um botão `Testar`
- **Ponto**: Crie um arquivo `index.html` com um botão `Testar`
- **Ponto**: Carregue um arquivo `main.js` no `` com ``
- **Ponto**: No `main.js`, selecione o botão e registre um evento de clique
- **Ponto**: Abra a página no navegador e confirme que o botão funciona mesmo com o script declarado no ``

## Exercício
- **Ideia**: Os itens exercitam a escolha do momento de execução, que é a decisão central do tópico: Qual a diferença entre `DOMContentLoaded` e `load`?
- **Detalhe**: Por que `type="module"` costuma evitar o erro de acessar um elemento antes dele existir?
- **Ponto**: Qual a diferença entre `DOMContentLoaded` e `load`?
- **Ponto**: Por que `type="module"` costuma evitar o erro de acessar um elemento antes dele existir?
- **Ponto**: Quando faz sentido usar `visibilitychange`?
- **Ponto**: `DOMContentLoaded` dispara quando o DOM está pronto para manipulação. `load` dispara depois que

## Desafio
- **Ideia**: Crie uma função `inicializarQuandoPronto(callback)` que execute o `callback` imediatamente se o DOM já estiver pronto, ou registre `DOMContentLoaded` caso o documento ainda esteja em `loading`

## Perguntas de revisão
- **Ideia**: Qual atributo preserva a ordem dos scripts e evita bloquear o parser HTML?
- **Detalhe**: Possível resposta O atributo `defer`
- **Ponto**: Qual atributo preserva a ordem dos scripts e evita bloquear o parser HTML?
- **Ponto**: Por que `async` pode ser perigoso para scripts que dependem uns dos outros?
- **Ponto**: Qual propriedade indica se a aba atual está oculta?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
