---
title: 'JavaScript: Arrays e Métodos Funcionais'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Arrays e Métodos Funcionais

## Objetivo
- Reconhecer a estrutura de dados de Array em JavaScript, dominar técnicas de criação.

## Criação e Estrutura de Arrays
- Notação Literal: Forma mais comum e recomendada de criar arrays; `const items = [1, 2, 3];`
- Indexação: Elementos são acessados por índices inteiros a partir de 0; `items[0]` // `1`
- Heterogeneidade: Pode armazenar primitivos, objetos e até outros arrays; `[42, "texto", true, { id: 1 }]`
- Tipo de Dado: Internamente é um objeto especial; `typeof []` // `"object"`
- Verificação: Teste oficial para checar se um valor é array; `Array.isArray([])` // `true`
- Em JavaScript, um Array é uma lista ordenada de valores.

## Acesso, Modificação e Propriedade length
- Os elementos de um array são acessados e modificados usando colchetes e índices numéricos inteiros.
- O primeiro elemento fica no índice `0` e o último no índice `array.length - 1`.
### A Propriedade length e Arrays Esparsos
- A propriedade `length` indica o número de posições do array.
### O Operador delete
- O operador `delete` pode ser usado em arrays, mas deve ser evitado na maioria dos cenários.

## Operador Spread e Desestruturação (Destructuring)
### Operador Spread (`...`)
- O operador `...` permite espalhar os elementos de um array dentro de outro array ou como argumentos de uma função.
### Desestruturação de Arrays
- A desestruturação permite extrair valores de um array diretamente para variáveis de forma posicional.

## Iteração em Arrays
- Estrutura: Sintaxe; Uso Principal
- `for` tradicional: `for (let i = 0; i < arr.length; i++)`; Controle total sobre índices e passos
- `for...of`: `for (const item of arr)`; Percorrer valores de forma simples e legível
- `forEach()`: `arr.forEach((item, index) => ...)`; Executar uma função para cada elemento
- Os índices são convertidos para `string` (ex: `"0"`, `"1"`).
- A ordem de iteração não é garantidamente numérico-sequencial.

## Métodos do Objeto Array
- Mutadores: Alteram o array original (in-place).
- Não-Mutadores Modernos (ES2023): Alternativas imutáveis (Change Array by Copy) para alteração de elementos.
- Acessores / Consulta: Não alteram o array original e retornam um novo valor ou array.
### Métodos Mutadores (Modificam o Array Original)
- `push(...items)`: Adiciona um ou mais elementos ao final; Novo `length`
- `pop()`: Remove e retorna o último elemento; O elemento removido
- `unshift(...items)`: Adiciona um ou mais elementos no início; Novo `length`
- `shift()`: Remove e retorna o primeiro elemento; O elemento removido
- `splice(start, deleteCount, ...items)`: Adiciona/remove elementos em qualquer posição; Array com elementos removidos
### Métodos Não-Mutadores Modernos (ES2023)
- Método Mutador / Clássico: Equivalente Não-Mutador (ES2023); Descrição do Resultado
- `sort(compareFn)`: `toSorted(compareFn)`; Retorna um novo array ordenado
- `reverse()`: `toReversed()`; Retorna um novo array invertido
- `splice(start, deleteCount, ...items)`: `toSpliced(start, deleteCount, ...items)`.
- `arr[index] = newValue`: `with(index, newValue)`; Retorna um novo array substituindo a posição informada
### Métodos Acessores e de Consulta (Preservam o Array Original)
- `includes(value)`: Verifica se um valor existe no array; `boolean`
- `indexOf(value)`: Procura o primeiro índice do valor; Índice ou `-1` se não achar
- `lastIndexOf(value)`: Procura o último índice do valor; Índice ou `-1` se não achar
- `join(separator)`: Concatena todos os elementos em uma string; `string`
- Estes métodos não modificam o array original.
### Métodos de Iteração e Programação Funcional (Higher-Order Functions)
- `map(fn)`: O novo valor transformado; Novo array com valores transformados
- `filter(fn)`: `true` para manter o item, `false` para descartar; Novo array com itens filtrados
- `reduce(fn, init)`: O acumulador atualizado a cada iteração; Valor único acumulado
- `every(fn)`: `true` se o item atende à condição; `true` se todos atenderem
- `some(fn)`: `true` se o item atende à condição; `true` se ao menos um atender

## Resumo e Boas Práticas
- Use a notação literal `[]` para criar arrays.
- Teste se um valor é um array com `Array.isArray(valor)`.
- Evite o operador `delete`; prefira métodos mutadores ou imutáveis.
- Em aplicações modernas, dê preferência a métodos que não alteram o original (`map`, `filter`, `reduce`, `concat`.
- Para ordenação sem alterar o original, utilize os métodos imutáveis modernos como `.toSorted()`.
- Preferencialmente, declare referências de arrays com `const`. Isso impede a reassociação da variável.

## Gerando Intervalos e Sequências Numéricas (*Range*)
- Ao contrário de linguagens como Python (que possuem a função nativa `range()`).
- No entanto, é muito comum precisar gerar sequências numéricas para repetições ou iterações.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras

