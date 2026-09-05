---
title: 'JavaScript: Map, Set e Coleções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Map, Set e Coleções

## Ideia Central

- **Coleções ES6**: estruturas dedicadas para pares chave-valor e conjuntos únicos
- **Vantagem sobre objetos**: chaves de qualquer tipo e ordem estrita de inserção
- **Desempenho**: tabelas hash internas otimizadas para inserção e busca frequente

## Estrutura Map

### Características
- **Qualquer tipo como chave**: objetos, funções, números e booleanos
- **Referência de memória**: busca compara endereços em chaves de objeto
- **SameValueZero**: considera `NaN === NaN` e `+0 === -0`
- **Tamanho direto**: propriedade `.size` imediata

### Métodos Principais
- `set(chave, valor)`: insere ou atualiza entrada
- `get(chave)`: recupera valor associado ou `undefined`
- `has(chave)`: verifica existência retornando booleano
- `delete(chave)`: remove entrada específica
- `clear()`: remove todos os elementos da coleção

## Estrutura Set

### Características
- **Valores únicos**: duplicatas são descartadas automaticamente
- **Busca em tempo constante**: teste de existência em $O(1)$ amortizado
- **Deduplicação de array**: padrão idiomático `[...new Set(array)]`

### Métodos Principais
- `add(valor)`: adiciona novo elemento à coleção
- `has(valor)`: verifica presença de forma ultrarrápida
- `delete(valor)`: remove item específico
- `size`: número total de elementos únicos

## Operações de Conjuntos (ES2024)

### Operações Matemáticas
- `union(outro)`: combinação de todos os elementos ($A \cup B$)
- `intersection(outro)`: apenas elementos compartilhados ($A \cap B$)
- `difference(outro)`: exclusivos do primeiro conjunto ($A \setminus B$)
- `symmetricDifference(outro)`: presentes em um ou outro, mas não em ambos

### Comparações Booleanas
- `isSubsetOf(outro)`: valida se todos os itens estão no outro conjunto
- `isSupersetOf(outro)`: valida se contém todos os itens do outro
- `isDisjointFrom(outro)`: valida se não possuem nenhum item em comum
- **Imutabilidade**: todos os métodos geram novas instâncias de `Set`

## Iteração e Conversões

### Modos de Iteração
- `for...of`: desestrutura tuplas `[chave, valor]` no `Map`
- `keys()` / `values()`: iteradores específicos de chaves ou valores
- `forEach()`: iteração funcional preservando a ordem de inserção

### Conversões de Dados
- `new Map(Object.entries(obj))`: converte objeto literal em `Map`
- `Object.fromEntries(map)`: converte `Map` de volta em objeto para JSON
- `[...set]` / `Array.from(set)`: converte conjunto para array

## Coleções Fracas (WeakMap e WeakSet)

### Características
- **Apenas objetos como chave**: proíbe tipos primitivos
- **Referências fracas**: não impedem a atuação do Coletor de Lixo
- **Sem tamanho e não iteráveis**: tamanho dinâmico impede `.size` e laços
- **Sem vazamentos**: dados descartados quando o objeto-chave for liberado

### Aplicações Práticas
- `WeakMap`: armazenamento de metadados privados em instâncias de classes
- `WeakSet`: validação de marcas de instâncias autorizadas (*branding*)
- **Ciclo de vida no DOM**: vínculo de estado a nós HTML sem vazamentos

## Boas Práticas

- **Prefira Map para dados dinâmicos**: previne colisões com `[object Object]`
- **Use Set para buscas frequentes**: aproveita complexidade $O(1)$ contra $O(n)$
- **Mantenha imutabilidade no ES2024**: encadeie métodos sem mutações colaterais
- **Converta para objeto antes de JSON**: `JSON.stringify()` não serializa `Map` direto
- **Use WeakMap para dados efêmeros**: previne vazamentos de memória na aplicação
