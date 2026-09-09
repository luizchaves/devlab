---
title: 'Web APIs: Canvas API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Canvas API

## Ideia Central
- **Papel**: Desenho em bitmap com canvas, contexto 2D, formas, texto, coordenadas, animação e diferença entre DOM e pixels
- **Contexto**: A Canvas API fornece uma área de desenho em bitmap. O HTML cria a superfície com ``, e o JavaScript desenha pixels usando um contexto, como `2d`
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Pixels em vez de elementos
- **Ideia**: Todo o resto deste guia trata de elementos: nós que o navegador guarda, redesenha quando mudam e entrega ao leitor de tela
- **Detalhe**: O `` funciona pelo princípio oposto

## Modelo da API
- **Ideia**: Canvas não cria botões, parágrafos ou elementos clicáveis por desenho
- **Detalhe**: Depois que uma linha é desenhada, ela vira pixel; se o estado mudar, o programa precisa redesenhar

## Exemplo com preview e código
- **Ideia**: O exemplo importado demonstra formas, linhas, cores e texto renderizados diretamente no canvas
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: O tamanho visual do canvas em CSS pode ser diferente da resolução do bitmap
- **Detalhe**: Quando isso acontece, o desenho pode ficar esticado ou borrado

## Quando usar, e quando não usar?
- **Ideia**: Canvas é a ferramenta certa para muitos elementos que mudam a cada quadro, e a errada para poucos elementos que precisam ser lidos, clicados ou encontrados por busca
- **Detalhe**: A tabela contrapõe as três formas de desenhar na web pelo que cada uma entrega ao usuário: A terceira e a quinta linhas são as que mais custam quando ignoradas

## Executando
- **Ideia**: Percorra os passos com o preview aberto para relacionar cada comando de desenho ao que aparece na tela: Abra o preview e observe que a imagem não é composta por elementos HTML separados
- **Detalhe**: Altere uma cor ou coordenada no arquivo `canva
- **Ponto**: Abra o preview e observe que a imagem não é composta por elementos HTML separados
- **Ponto**: Altere uma cor ou coordenada no arquivo `canva.html`
- **Ponto**: Recarregue a página e veja como o desenho muda
- **Ponto**: Inspecione o DOM e confirme que as formas não aparecem como nós individuais

## Exercício
- **Ideia**: Os itens abaixo acrescentam formas e movimento ao exemplo, exercitando o ciclo limpar e redesenhar: Desenhe um retângulo adicional com cor diferente
- **Detalhe**: Adicione um texto no canto inferior do canvas
- **Ponto**: Desenhe um retângulo adicional com cor diferente
- **Ponto**: Adicione um texto no canto inferior do canvas
- **Ponto**: Crie uma função `desenharCena()` que agrupe todos os comandos de desenho

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre renderização 2D em bitmap, resolução e animação com o elemento Canvas:
- **Ponto**: Por que não é possível "mover" uma forma já desenhada no canvas?
- **Ponto**: O que `canvas.getContext('2d')` devolve, e o que acontece se o mesmo contexto for pedido duas vezes?
- **Ponto**: Qual a diferença entre os atributos `width`/`height` da tag e as dimensões definidas por CSS?
- **Ponto**: Onde fica a origem do sistema de coordenadas do canvas?
### Modelo de desenho
- **Ideia**: As questões a seguir avaliam o funcionamento do contexto de renderização, coordenadas e resolução: Por que não é possível "mover" uma forma já desenhada no canvas?
- **Ponto**: Por que não é possível "mover" uma forma já desenhada no canvas?
- **Ponto**: O que `canvas.getContext('2d')` devolve, e o que acontece se o mesmo contexto for pedido duas vezes?
### Animação e escolha da ferramenta
- **Ideia**: As questões a seguir avaliam o ciclo de renderização e as diferenças entre Canvas e SVG: Por que `requestAnimationFrame()` é preferível a `setInterval()` para animar?
- **Ponto**: Por que `requestAnimationFrame()` é preferível a `setInterval()` para animar?
- **Ponto**: Quando um gráfico deve ser feito em SVG e não em canvas?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
