---
title: 'JavaScript: Objetos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Objetos

## Ideia Central

- Coleção de pares chave-valor (*key-value*)
- Propriedades (dados) e Métodos (funções)
- Dinâmicos e mutáveis (mesmo com `const`)
- Tipo interno: `typeof {} === "object"`

## Acesso e Manipulação

- **Notação de Ponto**: `obj.prop` (chaves estáticas)
- **Notação de Colchetes**: `obj[var]` (chaves dinâmicas ou com caracteres especiais)
- **Adicionar/Modificar**: `obj.novaProp = valor`
- **Remover**: `delete obj.prop`
- **Acesso Seguro**: Encadeamento opcional (`?.`) e coalescência nula (`??`)
- **Checagem de Chaves**: `"prop" in obj` e `Object.hasOwn(obj, "prop")`

## Recursos Modernos (ES6+)

- **Property Shorthand**: `{ name, age }` em vez de `{ name: name, age: age }`
- **Method Shorthand**: `greet() {}` em vez de `greet: function() {}`
- **Computed Property Names**: `{ [chaveDinamica]: valor }`
- **Desestruturação (Destructuring)**:
  - Extração: `const { name, age } = user`
  - Renomeação: `const { name: userName } = user`
  - Valores Padrão: `const { role = "guest" } = user`
  - Rest Operator: `const { id, ...rest } = user`
- **Spread Operator (`...`)**: Mesclar e clonar objetos `{ ...a, ...b }`

## Métodos Estáticos de Inspeção

- **`Object.keys(obj)`**: Array com os nomes das chaves
- **`Object.values(obj)`**: Array com os valores
- **`Object.entries(obj)`**: Array de pares `[chave, valor]` (ótimo para `for...of`)

## Clonagem e Imutabilidade

- **Atribuição Simples**: Copia apenas a referência na memória (altera o original!)
- **Cópia Rasa (Shallow Copy)**: `{ ...obj }` ou `Object.assign({}, obj)` (preserva nível 1)
- **Cópia Profunda (Deep Copy)**: `structuredClone(obj)` (duplica todos os níveis aninhados)
- **Imutabilidade**: `Object.freeze(obj)` (impede alterações no nível 1)

## Contexto e Métodos (`this`)

- **Palavra-chave `this`**: Refere-se ao próprio objeto invocador
- **Arrow Functions**: NÃO possuem `this` próprio (não usar como métodos de objetos)

## Boas Práticas

- Prefira a notação de ponto por clareza e colchetes apenas para chaves dinâmicas
- Use `?.` e `??` para evitar crashes por `undefined`
- Utilize `structuredClone()` em vez de `JSON.parse/stringify` para clonar objetos profundos
- Mantenha funções puras e evite mutações diretas em objetos recebidos como parâmetros
