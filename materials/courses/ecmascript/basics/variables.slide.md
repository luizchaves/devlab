---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Variáveis e Escopo"
description: "Declaração de variáveis (var, let, const), escopo de bloco vs função, hoisting e Temporal Dead Zone."
---

<!-- _class: lead -->

# JavaScript: Variáveis e Escopo

Declaração de variáveis com `var`, `let` e `const`, escopo funcional e de bloco, Hoisting e Temporal Dead Zone (TDZ).

---

## Objetivos da Aula

- **Declaração**: Diferenciar `var`, `let` e `const` em relação a reatribuição e redeclaração.
- **Escopo**: Dominar os escopos Global, Funcional e de Bloco em JavaScript.
- **Hoisting**: Entender o comportamento do compilador na fase de criação e elevação.
- **Temporal Dead Zone**: Reconhecer a TDZ e evitar erros de `ReferenceError`.

---

## Evolução das Declarações

No JavaScript moderno (ES6+), existem três palavras-chave para declarar variáveis:

| Característica | `var` (Legado - ES5) | `let` (Moderno - ES6) | `const` (Moderno - ES6) |
| :--- | :--- | :--- | :--- |
| **Escopo** | Função ou Global | Bloco `{}` | Bloco `{}` |
| **Reatribuição** | Permitida | Permitida | **Proibida** |
| **Redeclaração** | Permitida | **Erro de Sintaxe** | **Erro de Sintaxe** |
| **Hoisting** | `undefined` | Inicialização Bloqueada (TDZ) | Inicialização Bloqueada (TDZ) |

---

## Escopo em JavaScript

O **escopo** determina onde uma variável pode ser acessada no código:

```javascript
// 1. Escopo Global
const appName = "DevLab";

function execute() {
  // 2. Escopo de Função
  var functionVar = "Dentro da função";

  if (true) {
    // 3. Escopo de Bloco (let/const)
    let blockLet = "Dentro do bloco IF";
    console.log(blockLet); // OK
  }
  // console.log(blockLet); // ReferenceError!
}
```

---

## O Problema do Escopo do `var`

Variáveis declaradas com `var` ignoram blocos condicionais e de repetição (`if`, `for`, `while`):

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 100);
}
// Saída após 100ms: "var i: 3", "var i: 3", "var i: 3"
// Causa: existe apenas uma variável 'i' compartilhada no escopo da função!

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 100);
}
// Saída após 100ms: "let j: 0", "let j: 1", "let j: 2"
// O 'let' cria uma nova ligação (binding) a cada iteração do bloco!
```

---

## Hoisting (Elevação)

Antes da execução, o compilador varre o código e aloca memória para as declarações.

### Hoisting com `var` vs Declaração de Função:

```javascript
console.log(name); // Imprime: undefined (sem erro de execução!)
var name = "Luiz";

sayHello(); // Imprime: "Olá!" (funções declaradas sobem completamente)
function sayHello() {
  console.log("Olá!");
}
```

---

## Temporal Dead Zone (TDZ)

Com `let` e `const`, a variável sofre Hoisting, mas permanece inacessível na **Zona Morta Temporal** até a linha da sua inicialização:

<div style="border: 2px solid #ef4444; border-radius: 8px; padding: 12px; background: #fef2f2; font-size: 0.85em; margin-bottom: 10px;">
  <strong style="color: #991b1b;">Início do Bloco (Escopo Ativo)</strong><br>
  ↕ Variável vinculada, mas inacessível (TDZ — Temporal Dead Zone)<br>
  <strong style="color: #991b1b;">Acesso nesta área dispara: ReferenceError!</strong>
</div>

```javascript
{
  // TDZ começa aqui
  // console.log(score); // Uncaught ReferenceError: Cannot access 'score' before initialization
  let score = 100; // TDZ termina aqui!
  console.log(score); // 100
}
```

---

## Imutabilidade da Ligação (`const`)

`const` impede a **reatribuição** do identificador, mas **não torna o valor mutável imutável**:

```javascript
const maxLimit = 50;
// maxLimit = 100; // TypeError: Assignment to constant variable.

const student = { name: "Maria", score: 90 };
student.score = 100; // PERMITIDO: a propriedade do objeto foi alterada!
// student = { name: "João" }; // ERRO: reatribuição da referência!

// Para congelar as propriedades de um objeto:
Object.freeze(student);
// student.score = 95; // Não altera nada (ou lança erro em strict mode)
```

---

## Regras de Ouro para Boas Práticas

1. **Use `const` por padrão**: Torna a intenção do código clara e evita reatribuições acidentais.
2. **Use `let` somente quando for reatribuir**: Para contadores de loops, acumuladores ou flags de estado.
3. **Evite `var` totalmente**: O comportamento de escopo e hoisting do `var` favorece bugs silenciosos.
4. **Declare variáveis no topo do escopo**: Reduz a complexidade cognitiva e previne efeitos da TDZ.

---

## Resumo & Revisão

- `var`: Escopo funcional/global, permite redeclaração, sofre hoisting com valor `undefined`.
- `let`: Escopo de bloco, proíbe redeclaração, sofre TDZ até a inicialização.
- `const`: Escopo de bloco, exige valor inicial, proíbe reatribuição de referência.
- **TDZ**: Período entre a entrada no bloco e a execução da linha onde a variável `let`/`const` foi declarada.

---

## Referências & Links Úteis

- **MDN**: [let](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/let)
- **MDN**: [const](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/const)
- **MDN**: [Entendendo Escopo e Clojures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures)
