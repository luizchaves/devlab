---
title: 'Web APIs: Local Storage e Web Storage'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Local Storage e Web Storage

## Ideia Central
- **Papel**: Persistência de dados no cliente com localStorage, sessionStorage, serialização JSON e sincronização entre abas
- **Contexto**: Diferente das requisições HTTP tradicionais que armazenam dados no servidor, as Web Storage APIs (`localStorage` e `sessionStorage`) permitem que as aplicações mantenham informações salvas diretamente no navegador do usuário de forma persistente e síncrona
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Comparativo de Armazenamento no Navegador
- **Ideia**: O navegador oferece diferentes opções para salvar dados no cliente, cada uma adequada a um caso de uso específico: ---

## A Web Storage API
- **Ideia**: Os objetos `localStorage` e `sessionStorage` compartilham exatamente a mesma interface de métodos e propriedades
- **Detalhe**: A única diferença é a persistência: enquanto o `sessionStorage` é limpo quando a aba é fechada, o `localStorage` permanece armazenado por tempo indeterminado

## Comportamento de Conversão e Valores Ausentes
- **Ideia**: O Web Storage armazena estritamente pares de texto (strings)
- **Detalhe**: Duas regras determinam o tratamento correto de leitura e gravação no dia a dia: Tudo vira string: números e booleanos são convertidos em seus literais textuais, e objetos gravados sem serialização viram o texto inútil `"[object Object]"`
- **Ponto**: Tudo vira string: números e booleanos são convertidos em seus literais textuais, e objetos gravados sem serialização viram o texto inútil `"[object Object]"`
- **Ponto**: Chaves inexistentes devolvem `null`: o método `getItem()` devolve `null` quando a chave nunca foi criada, exigindo valor padrão para não quebrar chamadas subsequentes

## Serialização de Objetos com JSON
- **Ideia**: Para armazenar estruturas de dados complexas (arrays e objetos), devemos serializá-las para JSON na gravação e desserializá-las na leitura: Tentar gravar dados além do limite de cota (~5MB) disparará a exceção `QuotaExceededError`
- **Detalhe**: Envolva sempre operações de `setItem` em blocos `try/catch` quando lidar com dados volumosos

## Exemplo Prático com Interface
- **Ideia**: O preview interativo abaixo demonstra uma interface que lê, grava e remove dados do `localStorage` com tratamento de listas e atualização em tempo real: Prévia HTML interativa disponível na página do tópico
- **Detalhe**: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Módulo de Armazenamento Reutilizável
- **Ideia**: Em aplicações reais, abstraímos as chamadas do `localStorage` em um serviço centralizado para evitar duplicação de `JSON
- **Detalhe**: stringify` e `JSON

## O Evento `storage`
- **Ideia**: Quando um valor no `localStorage` é alterado, o navegador dispara o evento `storage` em todas as outras abas ativas do mesmo domínio: Para ver a implementação completa de um CRUD persistente com interface gráfica e modularização em JavaScript, acesse as páginas de projetos práticos: MonitorApp (DOM e Storage) InvestApp (Fetch e API) ---
- **Ponto**: MonitorApp (DOM e Storage)
- **Ponto**: InvestApp (Fetch e API)

## Quando usar, e quando não usar?
- **Ideia**: O Web Storage é síncrono, guarda apenas strings e tem cota de poucos megabytes por origem
- **Detalhe**: Essas três características definem sozinhas os limites do que faz sentido colocar nele

## Executando
- **Ideia**: Os passos exercitam gravação, leitura e sincronização entre abas, que é o comportamento mais difícil de observar sem um roteiro: Abra o navegador com F12 e clique na aba Aplicação (ou Storage no Firefox)
- **Detalhe**: Expanda o menu Local Storage e clique na URL do domínio atual
- **Ponto**: Abra o navegador com F12 e clique na aba Aplicação (ou Storage no Firefox)
- **Ponto**: Expanda o menu Local Storage e clique na URL do domínio atual
- **Ponto**: No console, execute: `localStorage.setItem('usuario', JSON.stringify({ nome: 'DevLab' }));`
- **Ponto**: Observe a nova chave `usuario` aparecer instantaneamente no painel visual da aba Aplicação

## Exercício
- **Ideia**: Os itens abaixo exercitam serialização, valor ausente e o limite de cota do armazenamento: Qual a diferença fundamental de persistência entre `localStorage` e `sessionStorage`?
- **Detalhe**: Por que a chamada `localStorage
- **Ponto**: Qual a diferença fundamental de persistência entre `localStorage` e `sessionStorage`?
- **Ponto**: Por que a chamada `localStorage.setItem('usuario', { nome: 'Ana' })` resulta em um erro de gravação sem utilidade? Como corrigir?
- **Ponto**: O evento `storage` é disparado na mesma aba onde a alteração foi realizada?
- **Ponto**: O `localStorage` mantém os dados gravados no disco do usuário indefinidamente, mesmo após fechar o navegador. O `sessionStorage` apaga os dados assim que a aba ou janela correspondente for fechada

## Desafio
- **Ideia**: Crie uma função `salvarHistoricoBusca(termo)` que mantenha um array dos últimos 5 termos pesquisados no `localStorage` sob a chave `@app:historico_buscas`, garantindo que não haja termos duplicados e que a lista não exceda 5 itens

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre persistência client-side, limitações e ciclo de vida do Web Storage:
- **Ponto**: Qual exceção é lançada pelo navegador quando o limite de cota do `localStorage` é ultrapassado?
- **Ponto**: Como verificar quantas chaves estão atualmente gravadas no `localStorage`?
- **Ponto**: Por que é obrigatório serializar objetos JavaScript com `JSON.stringify()` antes de gravá-los no `localStorage`?
- **Ponto**: Em quais janelas o evento `'storage'` é disparado quando um dado é gravado no `localStorage`?
### Capacidade e Exceções
- **Ideia**: As questões a seguir avaliam o comportamento de cota e inspeção de chaves gravadas: Qual exceção é lançada pelo navegador quando o limite de cota do `localStorage` é ultrapassado?
- **Ponto**: Qual exceção é lançada pelo navegador quando o limite de cota do `localStorage` é ultrapassado?
- **Ponto**: Como verificar quantas chaves estão atualmente gravadas no `localStorage`?
### Serialização e Eventos
- **Ideia**: As questões a seguir avaliam o armazenamento de estruturas complexas e a sincronização entre abas: Por que é obrigatório serializar objetos JavaScript com `JSON
- **Ponto**: Por que é obrigatório serializar objetos JavaScript com `JSON.stringify()` antes de gravá-los no `localStorage`?
- **Ponto**: Em quais janelas o evento `'storage'` é disparado quando um dado é gravado no `localStorage`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
