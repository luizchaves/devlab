---
title: 'JavaScript: Async/Await'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Async/Await

## Ideia Central

- **Açúcar Sintático**: camada limpa sobre Promises introduzida no ES2017
- **Estrutura Sequencial**: código assíncrono com aparência síncrona
- **Pausa Não Bloqueante**: suspende a função e libera o Event Loop

## Declaração e Comportamento

### Modificador async
- **Retorno garantido**: envolve retorno em `Promise.resolve`
- **Exceções com throw**: converte erros em `Promise.reject`
- **Sintaxes variadas**: funções tradicionais, arrow functions e métodos de classe

### Operador await
- **Pausa local**: aguarda resolução antes de prosseguir
- **Operação exclusiva**: aceito apenas em funções `async` ou em *Top-Level Await*
- **Desempacotamento**: extrai o valor resolvido da Promise

## Tratamento de Erros

### Estrutura try...catch...finally
- `try`: encapsula chamadas `await` suscetíveis a falhas
- `catch(err)`: captura rejeições e exceções síncronas
- `finally`: limpeza de recursos garantida após liquidação

### Armadilha do Retorno
- `return promise`: sai do `try` e contorna o `catch` local
- `return await promise`: aguarda a resolução dentro do bloco `try`

## Execução Sequencial vs Paralela

### Sequencial (Gargalo)
- `await op1; await op2;`: soma o tempo das operações ($\sum t$)
- **Indicação**: apenas quando a segunda chamada depende do dado da primeira

### Paralela (Otimizada)
- `Promise.all([op1, op2])`: tempo limitado pela mais demorada ($\max t$)
- **Laços em arrays**: use `array.map()` com `Promise.all()`, nunca `forEach`

## Recursos Avançados

### Top-Level Await
- **Módulos ES**: uso de `await` na raiz do arquivo sem função envoltória
- **Inicialização**: conexões com banco de dados e carregamento de configurações

### Iteração Assíncrona
- `for await...of`: iteração sequencial sobre fluxos de promises e streams

## Integração com Express e Node.js

- **Controllers Assíncronos**: métodos de rota declarados como `async`
- **Express 5**: repasse automático de rejeições para o middleware global de erros
- **ORMs e Bancos**: compatibilidade total com Prisma, Sequelize e Node-SQLite

## Boas Práticas

- **Evite gargalos sequenciais**: use `Promise.all()` para tarefas independentes
- **Valide `response.ok` no fetch**: 404 e 500 não disparam o `catch` automaticamente
- **Use `return await` dentro de try**: garante a captura de erros locais
- **Centralize tratamento de erro**: aproveite o middleware de erro do Express 5
