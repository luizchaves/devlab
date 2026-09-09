---
title: 'Web APIs: Observadores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Observadores

## Ideia Central
- **Papel**: IntersectionObserver, ResizeObserver e MutationObserver para reagir a visibilidade, tamanho e mudanças no DOM sem depender de loops manuais
- **Contexto**: Nas versões clássicas do JavaScript para o navegador, verificar se um elemento estava visível, mudou de tamanho ou recebeu novos nós exigia escutar eventos globais como `scroll` e `resize` ou fazer consultas repetidas no DOM
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Modelo de observação
- **Ideia**: Todo observador segue a mesma ideia: criar uma instância, informar uma função de callback, escolher opções de monitoramento e chamar `observe()` para registrar um elemento alvo
- **Detalhe**: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## IntersectionObserver
- **Ideia**: O `IntersectionObserver` detecta quando um elemento entra, sai ou cruza um limite de visibilidade em relação à viewport ou a um container ancestral
- **Detalhe**: Ele é indicado para *lazy loading*, rolagem infinita, animações sob demanda e leitura da seção atual

## ResizeObserver
- **Ideia**: O `ResizeObserver` observa o tamanho de um elemento específico
- **Detalhe**: Ele é diferente de `window

## Comparando os observadores
- **Ideia**: A escolha correta depende do tipo de mudança que interessa ao código

## Quando usar, e quando não usar?
- **Ideia**: Os três observadores resolvem o mesmo problema estrutural, reagir a uma mudança sem perguntar por ela o tempo todo, mas nenhum deles é a resposta certa quando a informação já está disponível de outra forma
- **Detalhe**: A tabela mostra quando cada observador vence e qual alternativa mais simples deve ser preferida fora desses casos: As duas últimas linhas são as mais esquecidas

## Executando
- **Ideia**: Use o console do navegador para observar uma seção da página atual e entender o formato dos dados recebidos pelo callback: Abra uma página com várias seções e pressione F12
- **Detalhe**: Cole o exemplo de `IntersectionObserver` no console
- **Ponto**: Abra uma página com várias seções e pressione F12
- **Ponto**: Cole o exemplo de `IntersectionObserver` no console
- **Ponto**: Role a página até o elemento observado entrar na viewport
- **Ponto**: Troque `threshold` para `0`, `0.5` e `1` e compare quando o callback dispara

## Exercício
- **Ideia**: Os itens exercitam os três observadores no mesmo documento, incluindo o encerramento da observação: Crie um `IntersectionObserver` que adicione a classe `ativo` ao primeiro `` visível
- **Detalhe**: Crie um `ResizeObserver` que troque um card para modo compacto quando sua largura ficar abaixo de `360px`
- **Ponto**: Crie um `IntersectionObserver` que adicione a classe `ativo` ao primeiro `` visível
- **Ponto**: Crie um `ResizeObserver` que troque um card para modo compacto quando sua largura ficar abaixo de `360px`
- **Ponto**: Crie um `MutationObserver` que conte quantos `` foram adicionados a uma lista

## Perguntas de revisão
- **Ideia**: Por que `IntersectionObserver` costuma ser melhor que escutar `scroll` continuamente?
- **Detalhe**: Possível resposta Porque o navegador faz o monitoramento de interseção de forma otimizada e entrega notificações assíncronas, sem obrigar o código a medir posições a cada evento de rolagem
- **Ponto**: Por que `IntersectionObserver` costuma ser melhor que escutar `scroll` continuamente?
- **Ponto**: Qual a diferença entre `ResizeObserver` e `window.onresize`?
- **Ponto**: Quando `MutationObserver` deve ser desconectado?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
