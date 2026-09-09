---
title: 'Web APIs: Web Workers'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Web Workers

## Ideia Central
- **Papel**: Execução em segundo plano no navegador com Web Workers, postMessage, transferência de dados e limites de acesso ao DOM
- **Contexto**: JavaScript no navegador roda, em grande parte, na thread principal. Essa mesma thread cuida de eventos, renderização, layout, pintura da tela e execução do código da aplicação. Se um cálculo pesado ocupa essa thread por muito tempo, a interface congela
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Thread Principal vs Worker
- **Ideia**: O navegador desenha a interface e executa o JavaScript da página na mesma linha de execução
- **Detalhe**: O diagrama mostra o que essa divisão implica: enquanto um cálculo ocupa a thread principal, nenhum clique é atendido e nenhum quadro é pintado: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão
- **Ponto**: `async/await` organiza tarefas assíncronas, como rede e timers
- **Ponto**: `Worker` move processamento pesado para outra thread

## Criando um Worker
- **Ideia**: Crie um arquivo separado para o código executado em segundo plano
- **Detalhe**: O valor enviado por `postMessage()` é copiado para o worker usando o algoritmo de structured clone

## Worker com Módulos
- **Ideia**: Em projetos modernos, é comum criar workers como módulos, usando `import` dentro do worker: Esse formato funciona bem com empacotadores como Vite, porque o build consegue descobrir e processar o arquivo do worker

## O Worker Não Acessa o DOM
- **Ideia**: Um worker não possui acesso a `document`, `window`, `querySelector()` ou elementos HTML
- **Detalhe**: Isso é intencional

## Tratamento de Erros
- **Ideia**: Erros dentro do worker devem ser monitorados pela thread principal: Dentro do worker, também é possível capturar exceções e responder com um objeto de erro controlado: ---

## Encerrando um Worker
- **Ideia**: Workers continuam vivos enquanto a página existir ou até serem encerrados
- **Detalhe**: Quando não forem mais necessários, finalize-os com `terminate()`

## Transferindo Dados Grandes
- **Ideia**: Por padrão, mensagens são copiadas
- **Detalhe**: Para buffers grandes, é possível transferir a posse do dado para evitar cópia

## Quando usar, e quando não usar?
- **Ideia**: Um worker custa uma thread, um arquivo separado e a serialização de tudo que atravessa o `postMessage()`
- **Detalhe**: Esse preço se paga quando a tarefa ocupa a CPU por tempo suficiente para travar a tela, e não se paga em nada que já era rápido

## Executando
- **Ideia**: Os passos abaixo comparam a interface travada pelo cálculo na thread principal com a mesma interface após a mudança para o worker: Crie `index
- **Detalhe**: html`, `main
- **Ponto**: Crie `index.html`, `main.js` e `worker.js` na mesma pasta
- **Ponto**: Em `index.html`, carregue `main.js` com ``
- **Ponto**: No `worker.js`, escute `message`, execute um cálculo e responda com `self.postMessage()`
- **Ponto**: No `main.js`, crie `new Worker('./worker.js')` e registre o evento `message`

## Exercício
- **Ideia**: Os itens exercitam a divisão de responsabilidade entre a thread principal e o worker: Por que um cálculo pesado pode travar a interface?
- **Detalhe**: O worker pode acessar `document
- **Ponto**: Por que um cálculo pesado pode travar a interface?
- **Ponto**: O worker pode acessar `document.querySelector()`?
- **Ponto**: Qual método é usado para enviar mensagens entre a thread principal e o worker?
- **Ponto**: Porque a thread principal do navegador executa JavaScript e também processa eventos, layout e

## Desafio
- **Ideia**: Crie um worker que receba um array de números e retorne: menor valor; maior valor; média aritmética; quantidade de itens
- **Ponto**: menor valor;
- **Ponto**: maior valor;
- **Ponto**: média aritmética;
- **Ponto**: quantidade de itens

## Perguntas de revisão
- **Ideia**: Qual é a principal vantagem de usar Web Worker?
- **Detalhe**: Possível resposta Executar processamento pesado sem bloquear a thread principal e sem congelar a interface
- **Ponto**: Qual é a principal vantagem de usar Web Worker?
- **Ponto**: Por que dados grandes podem ser transferidos em vez de copiados?
- **Ponto**: Quando `terminate()` deve ser chamado?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
