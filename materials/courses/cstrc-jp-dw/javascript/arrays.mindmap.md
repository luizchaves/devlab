---
title: 'JavaScript: Arrays'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Arrays

## Ideia Central

- Coleção ordenada de valores
- Listas dinâmicas e heterogêneas
- Tipo interno: `typeof [] === "object"`
- Verificação segura: `Array.isArray(arr)`

## Criação e Estrutura

- **Literal `[...]`**: `const a = [1, 2, 3]`
- **Construtor**: `new Array(10, 20)`
- **Array de Posições Vazias**: `new Array(5)`
- **`Array.from()`**: `Array.from("123")` -> `["1", "2", "3"]`

## Acesso e Propriedades

- **Índice Inteiro**: `arr[0]` a `arr[length - 1]`
- **Método `.at()`**: `arr.at(-1)` (aceita índices negativos do final)
- **Propriedade `length`**: Mutável (redimensiona/trunca o array)
- **Operador `delete`**: Remove valor mas preserva o espaço (`empty slot`)

## Operações Modernas (ES6+)

- **Spread (`...`)**: Espalha elementos (`[...a, ...b]`) ou passa argumentos
- **Desestruturação (Destructuring)**: Extrai variáveis (`const [first, ...rest] = arr`)
- **Valores Padrão**: `const [x = 10] = arr`

## Iteração

- **`for...of`**: Percorre os valores diretamente (Recomendado)
- **`for...in`**: Percorre os índices como string (Cuidado com propriedades herdadas)
- **`forEach()`**: Executa callback para efeito colateral (retorna `undefined`)

## Categorias de Métodos

### Métodos Mutadores (Modificam o Original)

- **Inserção/Remoção**: `push()`, `pop()`, `shift()`, `unshift()`
- **Manipulação Geral**: `splice(start, deleteCount, ...items)`
- **Reordenação**: `reverse()`, `sort((a, b) => a - b)` (padrão é lexicográfico)

### Métodos Acessores (Preservam o Original)

- **Fatiamento**: `slice(start, end)` (retorna cópia do trecho)
- **Junção**: `concat()`, `join(separator)`
- **Busca de Valor/Índice**: `indexOf()`, `includes()`

### Higher-Order Functions (HOFs)

- **`map()`**: Transforma cada elemento e retorna novo array
- **`filter()`**: Retorna novo array com elementos que satisfazem o predicado
- **`reduce()`**: Acumula valores em um resultado final único
- **`find()` / `findIndex()`**: Retorna o primeiro elemento/índice que passa no teste
- **`every()` / `some()`**: Validações booleanas em lote

## Boas Práticas

- Prefira métodos imutáveis (`map`, `filter`, `slice`) aos mutadores
- Sempre forneça função de comparação em `.sort()` para números
- Use `for...of` em vez de `for...in` para iterar arrays
- Use `Array.isArray()` em vez de `typeof` para checar arrays
