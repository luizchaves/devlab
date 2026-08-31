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
title: "JavaScript: Estruturas de Controle"
description: "Decisão (if, switch) e repetição (for, while, for...of, for...in), guard clauses e controle de fluxo."
---

<!-- _class: lead -->

# JavaScript: Estruturas de Controle

Decisão (`if/else`, `switch`), laços de repetição (`for`, `while`, `for...of`, `for...in`) e o padrão Guard Clauses.

---

## Objetivos da Aula

- **Decisão**: Dominar desvios condicionais com `if/else` e `switch`.
- **Iteração**: Escolha entre `for` tradicional, `while`, `for...of` (iteráveis) e `for...in` (chaves).
- **Controle**: Aplicar `break`, `continue` e rótulos de instrução.
- **Refatoração**: Substituir aninhamentos complexos pelo padrão Guard Clause.

---

## Desvios Condicionais: `if / else`

Permite a execução de blocos de código com base em avaliações booleanas:

```javascript
const score = 85;

if (score >= 90) {
  console.log("Conceito A");
} else if (score >= 70) {
  console.log("Conceito B");
} else {
  console.log("Conceito C");
}
```

- **Dica**: Blocos de comando com uma única linha continuam exigindo chaves `{}` por boa prática e legibilidade!

---

## Desvios Condicionais: `switch`

Avalia uma expressão contra múltiplos casos usando **igualdade estrita (`===`)**:

```javascript
const role = "admin";

switch (role) {
  case "admin":
    console.log("Acesso total ao sistema");
    break; // Impede o 'fallthrough' para o próximo caso!
  case "editor":
    console.log("Acesso à edição de conteúdo");
    break;
  default:
    console.log("Acesso restrito");
}
```

- **Cuidado**: Esquecer o `break` causa o fenômeno de **fallthrough** (o motor executa o caso seguinte mesmo sem a condição bater!).

---

## Laços de Repetição: `for` e `while`

### 1. Loop `for` Tradicional (Baseado em Contadores)
```javascript
for (let i = 0; i < 3; i++) {
  console.log(`Item ${i}`);
}
```

### 2. Loop `while` e `do...while`
```javascript
let count = 0;
while (count < 3) {
  count++;
}

// Executa ao menos UMA vez antes de testar a condição:
do {
  console.log("Executou ao menos 1 vez!");
} while (false);
```

---

## Iterando sobre Coleções: `for...of` vs `for...in`

Existe uma diferença fundamental no que cada estrutura percorre:

<div style="display: flex; gap: 15px; margin-top: 15px; font-size: 0.85em;">
  <div style="flex: 1; border: 2px solid #0284c7; border-radius: 8px; padding: 12px; background: #f0f9ff;">
    <strong style="color: #0369a1; font-size: 1.1em;">for...of (Itera Valores)</strong><br>
    Funciona em objetos <strong>iteráveis</strong> (Arrays, Strings, Maps, Sets).<br><br>
    <code>const colors = ["azul", "verde"];</code><br>
    <code>for (const color of colors) {</code><br>
    <code>  console.log(color); // "azul", "verde"</code><br>
    <code>}</code>
  </div>
  <div style="flex: 1; border: 2px solid #16a34a; border-radius: 8px; padding: 12px; background: #f0fdf4;">
    <strong style="color: #15803d; font-size: 1.1em;">for...in (Itera Chaves)</strong><br>
    Itera sobre as propriedades <strong>enumeráveis</strong> de um objeto.<br><br>
    <code>const user = { name: "Ana", age: 25 };</code><br>
    <code>for (const key in user) {</code><br>
    <code>  console.log(key); // "name", "age"</code><br>
    <code>}</code>
  </div>
</div>

---

## Controle de Iteração: `break` e `continue`

- **`break`**: Interrompe e encerra o laço de repetição imediatamente.
- **`continue`**: Pula a iteração atual e passa diretamente para a próxima.

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

for (const num of numbers) {
  if (num % 2 === 0) continue; // Pula números pares
  if (num > 4) break;          // Encerra ao encontrar número > 4
  console.log(num);            // Imprime apenas: 1, 3
}
```

---

## Padrão Guard Clauses (Cláusulas de Guarda)

Substitui aninhamentos profundos de `if/else` por verificações iniciais que interrompem a execução cedo (Early Return):

### Código Aninhado (Ruim):
```javascript
function processUser(user) {
  if (user) {
    if (user.isActive) {
      // Código de processamento principal...
      return "Sucesso";
    } else {
      return "Usuário inativo";
    }
  } else {
    return "Sem usuário";
  }
}
```

---

## Padrão Guard Clauses (Solução Limpa)

### Código Refatorado com Early Return (Excelente):
```javascript
function processUser(user) {
  // Cláusulas de guarda no topo da função:
  if (!user) return "Sem usuário";
  if (!user.isActive) return "Usuário inativo";

  // Fluxo principal limpo e sem aninhamento:
  // Código de processamento principal...
  return "Sucesso";
}
```

- **Vantagem**: Reduz indentação, diminui a carga cognitiva e deixa o "caminho feliz" (Happy Path) evidente.

---

## Resumo & Revisão

- `switch` utiliza igualdade estrita (`===`) e exige `break` para evitar fallthrough.
- Use `for...of` para percorrer os **valores** de arrays/iteráveis.
- Use `for...in` para percorrer as **chaves** de objetos.
- **Guard Clauses** simplificam funções eliminando blocos `else` desnecessários através de retornos antecipados.

---

## Referências & Links Úteis

- **MDN**: [Controle de Fluxo e Manipulação de Erros](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- **MDN**: [for...of](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for...of)
