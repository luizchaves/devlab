---
title: 'JavaScript: Promises'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Promises

## Ideia Central

- **Contrato Assíncrono**: representa valor disponível no presente, futuro ou nunca
- **Single-Thread**: I/O não bloqueante gerenciado pelo Event Loop
- **Superação de Callbacks**: encadeamento linear contra o *Callback Hell*

## Estados e Ciclo de Vida

### Três Estados Mutuamente Exclusivos
- **Pending**: estado inicial aguardando término da operação
- **Fulfilled**: concluída com sucesso, retornando valor
- **Rejected**: falha na execução, retornando razão de erro

### Imutabilidade
- **Transição única**: muda de estado uma única vez
- **Valor fixo**: após liquidada (*settled*), resultado não pode ser alterado

## Criação e Instanciação

### Construtor Tradicional
- `new Promise((resolve, reject) => ...)`: função executora síncrona
- **Execução imediata**: o executor roda antes de qualquer `.then()`

### Construtores Estáticos
- `Promise.resolve(val)`: cria instância já resolvida
- `Promise.reject(motivo)`: cria instância já rejeitada

### Recurso ES2024
- `Promise.withResolvers()`: expõe `{ promise, resolve, reject }` sem executor aninhado

## Consumo e Encadeamento

### Métodos Principais
- `.then(onFulfilled)`: recebe valor resolvido e retorna nova Promise
- `.catch(onRejected)`: captura falhas em qualquer elo anterior
- `.finally(onFinally)`: limpeza final, não recebe nem altera valor

### Encadeamento Plano
- **Valor comum**: encapsulado automaticamente em `Promise.resolve`
- **Nova Promise**: encadeamento aguarda liquidação antes do próximo `.then`

## Combinadores de Promises

### Modos Concorrentes
- `Promise.all([p1, p2])`: todas com sucesso ou falha rápida (*fail-fast*)
- `Promise.allSettled([p1, p2])`: aguarda todas, retorna status individual
- `Promise.race([p1, p2])`: primeira a liquidar define o resultado
- `Promise.any([p1, p2])`: primeira com sucesso; rejeita se todas falharem

## Event Loop e Microtasks

### Hierarquia de Filas
- **Call Stack**: execução síncrona LIFO na thread principal
- **Microtask Queue**: callbacks de Promises drenados 100% a cada ciclo
- **Macrotask Queue**: temporizadores e I/O com 1 tarefa por ciclo

### Fluxo de Execução
- **1. Disparo de I/O**: Call Stack delega para APIs do ambiente
- **2. Enfileiramento**: Promises vão para Microtasks, timers para Macrotasks
- **3. Monitoramento**: Event Loop aguarda esvaziamento da Call Stack
- **4. Drenagem de Microtasks**: esvazia todas as Promises pendentes
- **5. Processamento de Macrotask**: move uma única tarefa por vez

## Boas Práticas e Tratamento

### Práticas Recomendadas
- **Catch final obrigatório**: previne `unhandledRejection` no Node.js
- **Fetch API**: validar `response.ok`, pois 404 e 500 resolvem com sucesso
- **Flat Chain**: evite aninhar `.then()` dentro de outro `.then()`
- **Resiliência**: utilize `Promise.allSettled()` para tolerância a falhas parciais
