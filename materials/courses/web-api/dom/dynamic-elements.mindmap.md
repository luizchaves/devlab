---
title: 'Web APIs: Elementos Dinâmicos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Elementos Dinâmicos

## Ideia Central
- **Papel**: criar, inserir, remover e otimizar nós HTML em tempo de execução
- **Contexto**: interfaces montam cartões, linhas, comentários e notificações a partir de dados
- **Ambiente**: navegador, JavaScript, DOM e ciclo de renderização

## Página Estática x Dinâmica
- **Estática**: conteúdo principal já chega no HTML
- **Dinâmica no cliente**: JavaScript altera partes da interface após o carregamento
- **Dinâmica com servidor**: back-end entrega dados ou marcação atualizada
- **Virada prática**: o DOM muda sem trocar o documento inteiro

## Criação e Inserção de Nós
### `createElement()` e `appendChild()`
- **Criação**: nó nasce desconectado da árvore visível
- **Conteúdo**: `textContent` preenche texto sem interpretar HTML
- **Inserção**: `appendChild()` coloca o nó no documento
### `insertAdjacentHTML()`
- **Posições**: `beforebegin`, `afterbegin`, `beforeend`, `afterend`
- **Uso adequado**: marcação controlada pelo próprio código
- **Risco**: dado externo em HTML abre caminho para XSS

## Performance com `DocumentFragment`
- **Problema**: inserções repetidas podem provocar muitos *reflows*
- **Estratégia**: montar elementos em memória antes de tocar o DOM visível
- **Inserção única**: filhos do fragmento são movidos para o destino
- **Ganho**: menos recálculos de layout em listas grandes

## Elemento `<template>`
- **Molde inerte**: HTML lido, mas não renderizado automaticamente
- **Clonagem**: `template.content.cloneNode(true)` copia a estrutura interna
- **Preenchimento**: `querySelector()` altera pontos do clone antes da inserção
- **Uso típico**: cartões, linhas e componentes repetidos

## Escolha da Técnica
- **Elemento único**: `createElement()` + `appendChild()`
- **Lista grande**: `DocumentFragment`
- **Estrutura repetida**: `<template>` + `cloneNode(true)`
- **Texto externo**: `textContent`
- **HTML controlado**: `insertAdjacentHTML()`

## Prática e Revisão
- **Execução**: Console do DevTools mostra a inserção imediatamente
- **Exercício**: criar link e inserir no início do `body`
- **Desafio**: renderizar tabela com `DocumentFragment`
- **Pergunta-chave**: quando uma interface passa de estática para dinâmica?

## Boas Práticas
- **Segurança**: evite `innerHTML` com dados externos
- **Performance**: agrupe atualizações repetidas
- **Semântica**: crie elementos HTML coerentes com o conteúdo
- **Manutenção**: use `<template>` para estruturas repetidas
