---
title: 'JavaScript: Objetos Globais e Nativos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Objetos Globais e Nativos

## Ideia Central

- **Catálogo fechado**: a ECMA-262 define todos os nomes disponíveis sem importação
- **Fronteira do padrão**: `fetch` e `structuredClone` vêm do ambiente, não da linguagem
- **Camada de bibliotecas**: objetos raros no código de aplicação e onipresentes em frameworks

## Protocolos de Iteração

### Contrato de Percurso
- **Iterável**: objeto que implementa `[Symbol.iterator]()`
- **Iterador**: objeto devolvido, com `next()` produzindo `{ value, done }`
- **Sintaxe habilitada**: `for...of`, spread (`...`) e desestruturação
- **Atalho prático**: `function*` satisfaz os dois protocolos de uma vez

### Iterator Helpers (ES2025)
- `map()` / `filter()` / `flatMap()`: transformação preguiçosa encadeável
- `take(n)` / `drop(n)`: recorte que torna sequências infinitas utilizáveis
- `toArray()` / `reduce()` / `find()`: métodos terminais que consomem a cadeia
- `Iterator.from(iterável)`: adapta qualquer iterável aos métodos auxiliares
- **Consumo único**: o iterador se esgota após um método terminal

### Iteração Assíncrona
- `[Symbol.asyncIterator]()`: cada `next()` devolve uma `Promise`
- `for await...of`: aguarda cada elemento antes de entregá-lo ao laço
- **Uso real**: APIs paginadas, filas de mensagens e *streams* do Node.js

## Metaprogramação

### O Objeto Proxy
- **Alvo e manipulador**: `new Proxy(target, handler)`
- `get` / `set`: leitura auditada, valores padrão e validação de escrita
- `has` / `deleteProperty`: controle sobre `in` e sobre remoção de chaves
- `apply` / `construct`: interceptação de chamadas e de instanciação
- **Limite**: quem retém o alvo ignora todas as armadilhas

### O Objeto Reflect
- **Espelho das armadilhas**: mesma assinatura de cada *trap* do `Proxy`
- `Reflect.get` / `Reflect.set`: comportamento padrão com o `receiver` correto
- `Reflect.ownKeys()`: lista chaves de string, símbolos e não enumeráveis
- **Falha por retorno**: devolve booleano onde `Object` lança `TypeError`

## Dados Binários

### Camadas de Acesso
- `ArrayBuffer`: bloco contínuo de memória bruta, sem tipo
- `TypedArray`: visão homogênea de números de tamanho fixo
- `DataView`: visão heterogênea com deslocamento em bytes
- **Compartilhamento**: várias visões sobre o mesmo buffer, sem cópia

### Cuidados Práticos
- **Estouro silencioso**: `Uint8Array` grava `256` como `0`, sem erro
- **Não são arrays**: `Array.isArray()` devolve `false` e não há `push()`
- ***Endianness***: `false` para *big-endian* (rede), `true` para *little-endian*
- `SharedArrayBuffer` e `Atomics`: memória entre threads com operações indivisíveis

## Referências Fracas

### WeakRef
- `deref()`: devolve o objeto ou `undefined` após a coleta
- **Cache oportunista**: guarda o que é caro recalcular e aceita perder
- **Verificação obrigatória**: o valor pode sumir entre duas chamadas

### FinalizationRegistry
- `register(objeto, rótulo)`: associa uma limpeza à coleta do objeto
- **Rótulo, nunca o objeto**: passar o objeto cria referência forte
- **Sem garantia**: a função de retorno pode nunca ser executada
- **Regra de ouro**: liberação de recurso continua explícita com `try...finally`

## Internacionalização (Intl)

### Comparação e Contagem
- `Intl.Collator`: ordenação alfabética real, com acentos e cedilha
- `Intl.PluralRules`: categorias `one`, `few`, `many` e `other` por idioma
- **Opção `numeric`**: compara `item2` e `item10` pelo valor numérico

### Texto e Rótulos
- `Intl.ListFormat`: enumeração com "e" (`conjunction`) ou "ou" (`disjunction`)
- `Intl.DisplayNames`: traduz códigos de região, idioma e moeda
- `Intl.Segmenter`: divide por grafema, palavra ou frase respeitando o Unicode
- **Contagem correta**: `.length` conta unidades UTF-16, não símbolos visíveis

## Recursos Globais de Apoio

- `globalThis`: objeto global com nome único em navegador e servidor
- **Detecção segura**: `typeof globalThis.window` não lança `ReferenceError`
- `encodeURIComponent()`: escapa um valor, inclusive `&`, `=`, `?` e `/`
- `encodeURI()`: escapa uma URL inteira preservando os separadores
- `URIError`: sequência percentual malformada interrompe a decodificação
- `eval()`: avaliação dinâmica desaconselhada por segurança e desempenho

## Boas Práticas

- **Prefira geradoras a iteradores manuais**: dispensa o controle de `{ value, done }`
- **Use `take(n)` em fontes infinitas**: sem ele o encadeamento nunca termina
- **Chame `Reflect` dentro das armadilhas**: preserva `receiver` e *getters* herdados
- **Escolha o `TypedArray` pela faixa**: o estouro é silencioso e corrompe dados
- **Não confie na coleta de lixo**: `WeakRef` e finalizadores não garantem execução
- **Delegue idioma ao `Intl`**: `sort()` puro e condicionais de plural falham
- **Troque `eval()` por `JSON.parse()`**: avaliar texto externo é execução remota
