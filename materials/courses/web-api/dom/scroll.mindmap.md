---
title: 'Web APIs: Rolagem e Posicionamento'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Rolagem e Posicionamento

## Ideia Central
- **Papel**: scrollIntoView, scrollTo, scrollY e scrollHeight, rolagem suave com scroll-behavior, pontos de parada com scroll-snap e seção ativa com IntersectionObserver
- **Contexto**: Rolagem é a interação mais frequente de uma página e a que mais gera código desnecessário. Boa parte do que se escreve em JavaScript para rolar, animar e destacar seções foi absorvida pelo CSS e pelos observadores. Este tópico separa o que ainda precisa de código do que já vem pronto
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O que se mede em uma rolagem?
- **Ideia**: Antes de mover a página, é preciso saber ler a posição dela
- **Detalhe**: Quatro medidas respondem a quase toda pergunta sobre rolagem, e confundi-las é a origem de barras de progresso que passam de 100% e de detecções de fim de página que nunca disparam

## Rolar por código
- **Ideia**: Quando o movimento parte de uma ação da interface, e não de um link, três métodos cobrem os casos
- **Detalhe**: Todos aceitam a opção `behavior`, que escolhe entre o salto imediato e a animação

## O que o CSS resolve sozinho?
- **Ideia**: Boa parte do comportamento de rolagem não precisa de JavaScript
- **Detalhe**: As três declarações abaixo cobrem os efeitos mais pedidos, e valem também para os links de âncora comuns, que o JavaScript nem chega a interceptar

## Saber onde o usuário está
- **Ideia**: O índice que destaca a seção em leitura é o caso mais comum de código de rolagem, e também o mais frequentemente escrito da forma cara: um ouvinte de `scroll` que percorre todas as seções e calcula posições a cada disparo, dezenas de vezes por segundo
- **Detalhe**: O `IntersectionObserver` faz o mesmo trabalho sendo avisado apenas quando uma seção entra ou sai de uma faixa da tela: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Quando usar, e quando não usar?
- **Ideia**: Rolagem é a área em que a diferença entre a solução antiga e a atual mais aparece
- **Detalhe**: A tabela contrapõe cada necessidade à alternativa que ainda circula em material antigo: As duas últimas linhas são as mais importantes

## Executando
- **Ideia**: Os passos abaixo percorrem os quatro comportamentos do exemplo, do CSS ao observador: Entre na pasta do exemplo, em `examples/courses/web-api/scroll/`, e sirva-a por HTTP: Clique nos links do índice
- **Detalhe**: A animação vem do CSS, e nenhum deles passa por JavaScript
- **Ponto**: Entre na pasta do exemplo, em `examples/courses/web-api/scroll/`, e sirva-a por HTTP:
- **Ponto**: Clique nos links do índice. A animação vem do CSS, e nenhum deles passa por JavaScript
- **Ponto**: Role a página devagar e observe a barra de progresso no topo acompanhando o percentual rolado
- **Ponto**: Continue rolando e veja o item do índice mudar de destaque ao cruzar o meio da tela

## Exercício
- **Ideia**: Os itens abaixo ampliam o exemplo e exercitam a escolha entre CSS, observador e ouvinte: Acrescente um botão "voltar ao topo" que apareça só depois de 400 pixels rolados
- **Detalhe**: Faça a galeria parar alinhada pela esquerda, e não pelo centro
- **Ponto**: Acrescente um botão "voltar ao topo" que apareça só depois de 400 pixels rolados
- **Ponto**: Faça a galeria parar alinhada pela esquerda, e não pelo centro
- **Ponto**: Acrescente uma quinta seção e confirme que o índice a reconhece sem alterar o JavaScript
- **Ponto**: Exiba, ao lado da barra, o percentual lido em número inteiro

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre coordenadas de tela, métodos de rolagem programática e acessibilidade:
- **Ponto**: Qual a diferença entre `window.scrollY` e `elemento.scrollTop`?
- **Ponto**: Como calcular o progresso de leitura de uma página?
- **Ponto**: Por que não se deve guardar o resultado de `getBoundingClientRect()`?
- **Ponto**: O que a opção `block: 'nearest'` de `scrollIntoView()` faz de diferente?
### Medidas e movimento
- **Ideia**: As questões a seguir avaliam o cálculo de distâncias, propriedades de rolagem e posicionamento: Qual a diferença entre `window
- **Ponto**: Qual a diferença entre `window.scrollY` e `elemento.scrollTop`?
- **Ponto**: Como calcular o progresso de leitura de uma página?
### Escolha da técnica
- **Ideia**: As questões a seguir avaliam a decisão entre CSS, ouvintes de rolagem e IntersectionObserver: Como compensar um cabeçalho fixo que cobre o título de destino?
- **Ponto**: Como compensar um cabeçalho fixo que cobre o título de destino?
- **Ponto**: Por que `IntersectionObserver` é preferível a um ouvinte de `scroll` para destacar a seção ativa?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
