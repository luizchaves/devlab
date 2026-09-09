---
title: 'Web APIs: Dialog API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Dialog API

## Ideia Central
- **Papel**: Modais nativos com HTMLDialogElement, showModal, close, formulários method=dialog, foco, backdrop e returnValue
- **Contexto**: A Dialog API usa o elemento HTML `` e a interface `HTMLDialogElement` para criar diálogos controlados pelo navegador. Ela evita boa parte do modal artesanal porque o navegador já cuida de foco, camada de fundo, fechamento e estado de abertura
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O que o navegador resolve por você?
- **Ideia**: Antes do ``, um modal era uma `div` posicionada por CSS, com um fundo escuro desenhado à mão e um bom número de detalhes que quase ninguém implementava até o fim: prender o foco dentro da janela, impedir a rolagem do que está atrás, fechar com `Esc` e devolver o foco ao botão de origem
- **Detalhe**: O elemento nativo entrega esse conjunto pronto

## Modelo da API
- **Ideia**: O diálogo faz parte do HTML, mas ganha comportamento por JavaScript
- **Detalhe**: Em vez de esconder e mostrar uma `div`, o código chama métodos próprios do elemento

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra abertura, fechamento e manipulação do conteúdo de um diálogo nativo
- **Detalhe**: Prévia HTML interativa disponível na página do tópico
- **Comparação**: botões de `alert()`, `confirm()` e `prompt()` contrastam com o modal em `<dialog>`

## Cuidados práticos
- **Ideia**: Nem todo modal precisa ser modal de verdade
- **Detalhe**: Se o usuário precisa consultar o resto da página para preencher algo, `show()` ou uma tela comum podem ser melhores do que `showModal()`

## Quando usar, e quando não usar?
- **Ideia**: Um modal interrompe o que o usuário estava fazendo, e essa interrupção só se justifica quando a decisão é curta e não depende do conteúdo que ficou atrás da janela
- **Detalhe**: A tabela separa os casos em que `` ajuda daqueles em que ele atrapalha: As duas últimas linhas explicam por que tantos formulários acabam voltando de modal para página

## Executando
- **Ideia**: Percorra os passos observando as três formas de fechar o diálogo, porque cada uma deixa um `returnValue` diferente: Abra o preview ou o arquivo `dom
- **Detalhe**: html` em uma aba própria
- **Ponto**: Abra o preview ou o arquivo `dom.html` em uma aba própria
- **Ponto**: Clique no botão que abre o diálogo
- **Ponto**: Feche o diálogo pelo botão principal, pelo botão de cancelar e pelo teclado
- **Ponto**: Observe no código onde `showModal()`, `close()` e os listeners são registrados

## Exercício
- **Ideia**: Os itens abaixo exercitam o valor de retorno e a interceptação do fechamento: Adicione um segundo botão que abra o mesmo diálogo com uma mensagem diferente
- **Detalhe**: Registre no console o valor final de `dialog
- **Ponto**: Adicione um segundo botão que abra o mesmo diálogo com uma mensagem diferente
- **Ponto**: Registre no console o valor final de `dialog.returnValue`
- **Ponto**: Crie uma validação que impeça o fechamento quando uma escolha obrigatória estiver vazia

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre modais nativos, controle de foco e eventos com o elemento Dialog:
- **Ponto**: Qual a diferença entre `show()` e `showModal()`?
- **Ponto**: Como um formulário dentro do diálogo o fecha sem JavaScript?
- **Ponto**: De onde vem o valor lido em `dialog.returnValue`?
- **Ponto**: Como impedir que `Esc` feche o diálogo em um estado específico?
### Abertura e fechamento
- **Ideia**: As questões a seguir avaliam métodos de exibição, submissão com `method="dialog"` e interrupção do teclado: Qual a diferença entre `show()` e `showModal()`?
- **Ponto**: Qual a diferença entre `show()` e `showModal()`?
- **Ponto**: Como um formulário dentro do diálogo o fecha sem JavaScript?
### Acessibilidade e alternativas
- **Ideia**: As questões a seguir avaliam a camada superior do navegador (*top layer*) e o gerenciamento de foco: O que o `` entrega de acessibilidade que uma `div` posicionada não entrega?
- **Ponto**: O que o `` entrega de acessibilidade que uma `div` posicionada não entrega?
- **Ponto**: Por que `z-index` deixa de ser problema com `showModal()`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
