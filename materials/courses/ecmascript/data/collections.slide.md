---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Map, Set e Coleções"
description: "Slides completos do tópico JavaScript: Map, Set e Coleções."
---

<!-- _class: lead -->

# JavaScript: Map, Set e Coleções

Coleções estruturadas em JavaScript: dicionários chave-valor com Map, conjuntos únicos com Set, operações matemáticas do ES2024 e coleções fracas com WeakMap e WeakSet.

---

## Objetivo

Dominar as coleções estruturadas `Map`, `Set`, `WeakMap` e `WeakSet` em JavaScript:

- Escolher entre `Map` e objetos literais considerando tipos de chave e mutabilidade
- Compreender a igualdade de chaves e o algoritmo *SameValueZero*
- Converter dados entre `Map` e objetos literais via `Object.entries` e `Object.fromEntries`
- Utilizar `Set` para buscas $O(1)$ e deduplicação de listas
- Aplicar as operações de conjuntos nativas do ES2024
- Gerenciar metadados sem vazamentos de memória usando `WeakMap` e `WeakSet`

---

## Mapa do Tópico

- O Objeto Map e Comparativo com Objetos Literais
- Chaves por Referência e Algoritmo SameValueZero
- Conversão Bidirecional entre Map e Objeto
- O Objeto Set e Complexidade Algorítmica $O(1)$
- Operações Matemáticas de Conjuntos (ES2024)
- Iteração e Desestruturação sobre Coleções
- Coleções Fracas (WeakMap e WeakSet)
- Resumo e Boas Práticas

---

## O Objeto Map

- Coleção ordenada de pares chave-valor introduzida no ES6
- **Qualquer valor** pode atuar como chave: objetos, funções, números ou booleanos
- Mantém rigorosamente a ordem de inserção dos elementos
- Fornece propriedade direta `.size` para consulta imediata de volume

---

## Comparativo: Map versus Objeto Literal

| Característica | Objeto Literal (`{}`) | Estrutura `Map` |
| :--- | :--- | :--- |
| **Tipos de Chaves** | Apenas `String` ou `Symbol` | **Qualquer tipo ou objeto** |
| **Ordem de Inserção** | Imprevisível com chaves numéricas | **Garantida estritamente** |
| **Tamanho** | Manual: `Object.keys(o).length` | Direto: **`.size`** |
| **Desempenho** | Otimizado para registros estáticos | Otimizado para **adições e remoções** |
| **Iteração** | Exige funções utilitárias | **Iterável nativo** (`for...of`) |
| **Protótipo** | Possui chaves herdadas padrão | Apenas chaves explicitamente inseridas |

---

## Métodos Principais do Map

```js
const userRoles = new Map();

const userAna = { name: "Ana" };
const userCarlos = { name: "Carlos" };

// 1. Inserção com .set(chave, valor)
userRoles.set(userAna, "Admin");
userRoles.set(userCarlos, "Editor");
userRoles.set(100, "ID_Numeric");

// 2. Leitura com .get(chave) e verificação com .has(chave)
console.log(userRoles.get(userAna)); // "Admin"
console.log(userRoles.has(userCarlos)); // true
console.log(userRoles.size); // 3

// 3. Remoção com .delete(chave)
userRoles.delete(userCarlos);
console.log(userRoles.size); // 2
```

---

## Chaves por Referência de Memória

- A busca por chaves baseadas em objetos compara **endereços de memória**
- Instanciar um novo objeto literal na consulta resulta em `undefined`:

```js
const productMap = new Map();

// TENTATIVA INCORRETA: objeto solto perde o endereço de referência
productMap.set({ id: 1 }, "Mouse Sem Fio");
console.log(productMap.get({ id: 1 })); // undefined

// FORMA CORRETA: reter a referência da variável
const keyRef = { id: 1 };
productMap.set(keyRef, "Mouse Sem Fio");
console.log(productMap.get(keyRef)); // "Mouse Sem Fio"
```

---

## O Algoritmo SameValueZero

O `Map` compara chaves utilizando o algoritmo formal **SameValueZero**:

- Semelhante ao operador de estrita igualdade (`===`), porém:
  - `NaN` é considerado idêntico a `NaN`
  - `+0` e `-0` compartilham a mesma entrada

```js
const map = new Map();

map.set(Number.NaN, "Dado Especial");
console.log(map.get(Number.NaN)); // "Dado Especial"

map.set(+0, "Zero Positivo");
map.set(-0, "Zero Negativo"); // Sobrescreve a chave anterior
console.log(map.get(0)); // "Zero Negativo"
```

---

## Conversão entre Map e Objeto Literal

Ponte essencial para serialização em JSON e integração com APIs REST:

```js
// 1. Objeto literal para Map (Object.entries)
const configObj = { theme: "dark", autoSave: true };
const configMap = new Map(Object.entries(configObj));

console.log(configMap.get("theme")); // "dark"

// 2. Map para Objeto literal (Object.fromEntries)
configMap.set("language", "pt-BR");
const exportedObj = Object.fromEntries(configMap);

console.log(exportedObj);
// { theme: "dark", autoSave: true, language: "pt-BR" }
```

---

## O Objeto Set

- Coleção ordenada de valores estritamente **únicos**
- Duplicatas são descartadas automaticamente pelo motor
- Métodos essenciais: `.add()`, `.has()`, `.delete()`, `.clear()` e `.size`

```js
const tags = new Set(["node", "web", "node"]);
console.log(tags.size); // 2 ("node" duplicado foi descartado)

tags.add("react");
tags.add("web"); // Ignorado silenciosamente pois já existe
console.log(tags.size); // 3

console.log(tags.has("react")); // true
tags.delete("web");
console.log(tags.size); // 2
```

---

## Complexidade Algorítmica: Set versus Array

- **`Array.prototype.includes()`**: complexidade linear **$O(n)$**
  - Percorre item por item até encontrar ou esgotar a lista
- **`Set.prototype.has()`**: complexidade constante amortizada **$O(1)$**
  - Localiza o elemento instantaneamente via tabela hash interna

```js
const arrayData = Array.from({ length: 100_000 }, (_, i) => `item_${i}`);
const setData = new Set(arrayData);

// No Array: O(n) percorre até 100.000 iterações
console.log(arrayData.includes("item_99999")); // true

// No Set: O(1) com hashing imediato
console.log(setData.has("item_99999")); // true
```

---

## Deduplicação de Arrays com Spread

Padrão conciso e idiomático para remover elementos repetidos em uma linha:

```js
const rawNumbers = [10, 20, 10, 30, 40, 20, 50, 40];

// Array -> Set (elimina duplicatas) -> Array descompactado
const uniqueNumbers = [...new Set(rawNumbers)];

console.log(uniqueNumbers); // [10, 20, 30, 40, 50]
```

*Nota: Em listas contendo objetos, a deduplicação avalia referência de memória.*

---

## Operações de Conjuntos no Set (ES2024)

A especificação ES2024 introduziu métodos matemáticos nativos e imutáveis:

| Método | Operação | Resultado |
| :--- | :--- | :--- |
| `a.union(b)` | $A \cup B$ | Elementos presentes em $A$ ou em $B$ |
| `a.intersection(b)` | $A \cap B$ | Elementos presentes simultaneamente em ambos |
| `a.difference(b)` | $A \setminus B$ | Elementos em $A$ que não estão em $B$ |
| `a.symmetricDifference(b)`| $A \Delta B$ | Presentes em $A$ ou $B$, mas não em ambos |

*Todos os métodos retornam um novo `Set` sem alterar os conjuntos originais.*

---

## Exemplo: Operações de Conjuntos na Prática

```js
const admin = new Set(["read", "write", "delete", "audit"]);
const editor = new Set(["read", "write", "publish"]);

// 1. União: consolidação total de permissões
const all = admin.union(editor);
console.log([...all]); // ["read", "write", "delete", "audit", "publish"]

// 2. Interseção: privilégios compartilhados
const common = admin.intersection(editor);
console.log([...common]); // ["read", "write"]

// 3. Diferença: exclusivos de administrador
const adminOnly = admin.difference(editor);
console.log([...adminOnly]); // ["delete", "audit"]
```

---

## Métodos Relacionais Booleanos (ES2024)

Comparações matemáticas retornando `true` ou `false`:

```js
const guest = new Set(["read"]);
const admin = new Set(["read", "write", "delete"]);
const external = new Set(["billing", "support"]);

// Valida se todos os itens de 'guest' estão em 'admin'
console.log(guest.isSubsetOf(admin)); // true

// Valida se 'admin' contém todos os privilégios de 'guest'
console.log(admin.isSupersetOf(guest)); // true

// Valida se 'admin' e 'external' não possuem itens em comum
console.log(admin.isDisjointFrom(external)); // true
```

---

## Iteração sobre Map e Set

Ambas as coleções implementam o protocolo `Iterable`:

```js
const map = new Map([["A", 1], ["B", 2]]);

// Desestruturação de tupla [chave, valor] no laço for...of
for (const [key, value] of map) {
  console.log(`${key} = ${value}`);
}

// Iteradores específicos de chaves ou valores
for (const key of map.keys()) { console.log(key); }
for (const val of map.values()) { console.log(val); }

// Iteração direta no Set
const set = new Set(["red", "blue"]);
for (const color of set) { console.log(color); }
```

---

## Coleções Fracas: WeakMap e WeakSet

O termo *Weak* refere-se a referências que não impedem o Coletor de Lixo (*GC*):

| Característica | `Map` / `Set` | `WeakMap` / `WeakSet` |
| :--- | :--- | :--- |
| **Tipos Permitidos** | Qualquer tipo ou objeto | **Apenas Objetos** |
| **Coleta de Lixo** | Mantém referência forte | **Referência Fraca** (permite liberação) |
| **Propriedade `.size`** | Presente | **Ausente** (não determinístico) |
| **Iteração** | `for...of`, `.keys()` | **Não iterável** |
| **Método `.clear()`** | Suportado | **Ausente** |

---

## Caso de Uso: Metadados Privados com WeakMap

Permite vincular dados confidenciais a instâncias sem riscos de *memory leaks*:

```js
const privateStore = new WeakMap();

class UserAccount {
  constructor(name, token) {
    this.name = name;
    privateStore.set(this, { token });
  }

  getToken() {
    return privateStore.get(this).token;
  }
}

let user = new UserAccount("Lucas", "SECRET_KEY_99");
console.log(user.getToken()); // "SECRET_KEY_99"

user = null; // Instância e token são descartados automaticamente pelo GC!
```

---

## Caso de Uso: Marcação de Instâncias com WeakSet

Validação segura de instâncias legítimas (*branding*):

```js
const authorizedWidgets = new WeakSet();

class Widget {
  constructor(name) {
    this.name = name;
    authorizedWidgets.add(this);
  }

  render() {
    if (!authorizedWidgets.has(this)) {
      throw new Error("Objeto não autorizado.");
    }
    return `Widget: ${this.name}`;
  }
}

const w = new Widget("Card");
console.log(w.render()); // "Widget: Card"
```

---

## Resumo e Boas Práticas

| Prática Recomendada | Motivo Técnico |
| :--- | :--- |
| **Usar `Map` para chaves complexas** | Evita coerção para `[object Object]` de objetos comuns |
| **Usar `Set.has()` para consultas** | Complexidade $O(1)$ amortizada contra $O(n)$ de arrays |
| **Converter antes de gerar JSON** | `JSON.stringify()` não serializa `Map` diretamente |
| **Utilizar operações ES2024** | Métodos nativos imutáveis e otimizados pelo motor |
| **Empregar `WeakMap` para metadados** | Libera memória automaticamente ao destruir a chave |

---

## Resumo Prático Consolidado

```js
// 1. Deduplicação
const rawRoles = ["editor", "author", "editor", "subscriber"];
const userRoles = new Set(rawRoles);

// 2. Operação de conjuntos nativa
const required = new Set(["editor", "admin"]);
const hasAccess = userRoles.intersection(required).size > 0;

// 3. Mapeamento e conversão de exportação
const userMap = new Map([["user_1", { roles: [...userRoles] }]]);
const jsonReady = Object.fromEntries(userMap);

console.log({ hasAccess, total: userRoles.size });
```

---

## Executando: Demonstração no Terminal

1. Crie o arquivo `collections-demo.js`:
```js
const tags = new Set(["node", "express", "node", "javascript"]);
console.log("Tags:", [...tags]);

const cache = new Map();
cache.set("status", 200);
console.log(`Cache size: ${cache.size}`);
```
2. Execute no terminal:
```bash
$ node collections-demo.js
Tags: [ 'node', 'express', 'javascript' ]
Cache size: 1
```

---

## Exercício Prático: Controle de Acesso

Crie o arquivo `access-control.js`:

1. Crie a classe `AccessController` com mapa interno `userPermissions`
2. Crie o método `grant(userId, permissionsList)` para associar permissões em um `Set`
3. Se o usuário já possuir permissões, mescle a lista sem duplicar privilégios
4. Crie o método `hasAccess(userId, permission)` com busca rápida via `.has()`
5. Instancie o controlador e teste com múltiplos usuários e permissões

---

## Desafio: Relatório de Participação (ES2024)

Crie o arquivo `event-comparator.js`:

1. Defina dois conjuntos `workshopA` e `workshopB` contendo listas de e-mails
2. Calcule o total de participantes únicos com `.union()`
3. Identifique os presentes em ambos com `.intersection()`
4. Filtre participantes exclusivos de cada evento com `.difference()`
5. Apure os participantes não repetidos com `.symmetricDifference()`
6. Exiba o relatório em formato tabular com `console.table()`

---

## Perguntas de Revisão: Map e Mapeamento

1. Por que usar `Map` em vez de `{}` quando as chaves são objetos ou funções?
2. Como o algoritmo *SameValueZero* trata `NaN` e zeros com sinal (`+0`/`-0`)?
3. Como converter um `Map` em um Objeto literal e vice-versa?
4. Por que a busca por uma chave de objeto recém-criada retorna `undefined`?

---

## Perguntas de Revisão: Set e Conjuntos

5. Qual é a diferença de complexidade assintótica entre `Array.includes()` e `Set.has()`?
6. Como funciona o padrão de deduplicação `[...new Set(array)]`?
7. Quais são as operações de conjuntos nativas padronizadas no ES2024?
8. As operações de conjuntos do ES2024 alteram o conjunto original?

---

## Perguntas de Revisão: Coleções Fracas

9. O que significa o termo "fraco" (*Weak*) em `WeakMap` e `WeakSet`?
10. Por que `WeakMap` e `WeakSet` não possuem `.size` e não podem ser iterados?
11. Quais tipos de dados são autorizados como chave em um `WeakMap`?
12. Qual é o principal caso de uso de `WeakMap` na arquitetura de aplicações?

---

## Síntese do Tópico

- **Map**: dicionário versátil para chaves heterogêneas e mutações frequentes
- **Set**: coleção de unicidade garantida com busca $O(1)$ e álgebra de conjuntos
- **ES2024**: suporte nativo a operações de teoria dos conjuntos imutáveis
- **WeakMap / WeakSet**: referências fracas para metadados imunes a *memory leaks*
