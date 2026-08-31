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
title: "JavaScript: Objetos, Protótipos e Classes"
description: "Sintaxe literal, acessores, desestruturação, métodos estáticos da classe Object, cadeia de protótipos e Classes ES6."
---

<!-- _class: lead -->

# JavaScript: Objetos, Protótipos e Classes

Literais de objetos, referências, desestruturação, métodos de `Object`, herança por protótipos e orientação a objetos com `class`.

---

## Objetivos da Aula

- **Manipulação**: Criar e manipular objetos com sintaxe literal, colchetes e desestruturação.
- **Utilitários**: Utilizar `Object.keys()`, `values()`, `entries()`, `freeze()` e `assign()`.
- **Prototipação**: Compreender a cadeia de protótipos (*Prototype Chain*) nativa do JS.
- **Classes**: Aplicar a sintaxe `class`, `constructor`, herança (`extends`) e campos privados (`#field`).

---

## Criação e Acesso a Propriedades

Objetos são coleções de pares chave-valor:

```javascript
const user = {
  name: "Maria",
  "user-role": "admin", // Chaves com caracteres especiais exigem aspas
  age: 28
};

// 1. Notação de Ponto (Dot Notation):
console.log(user.name); // "Maria"

// 2. Notação de Colchetes (Bracket Notation - aceita variáveis e hífens):
const key = "age";
console.log(user[key]);         // 28
console.log(user["user-role"]); // "admin"
```

---

## Desestruturação e Property Shorthand

Sintaxe moderna para extrair e declarar propriedades de forma concisa:

### 1. Property Shorthand (Chaves com o mesmo nome da variável)
```javascript
const name = "DevLab";
const active = true;
const service = { name, active }; // Equivalente a { name: name, active: active }
```

### 2. Desestruturação de Objetos (Destructuring)
```javascript
const person = { first: "Luiz", city: "João Pessoa", role: "Professor" };

// Extrai e permite renomear ou definir valor default:
const { first: firstName, city, country = "Brasil" } = person;
console.log(firstName, city, country); // "Luiz João Pessoa Brasil"
```

---

## Métodos Utilitários da Classe `Object`

```javascript
const user = { id: 1, name: "Ana", role: "Dev" };

// 1. Obter Arrays de chaves, valores ou pares:
console.log(Object.keys(user));   // ["id", "name", "role"]
console.log(Object.values(user)); // [1, "Ana", "Dev"]
console.log(Object.entries(user));// [["id", 1], ["name", "Ana"], ["role", "Dev"]]

// 2. Mesclar Objetos:
const updated = Object.assign({}, user, { role: "Tech Lead" });

// 3. Imutabilidade de Objetos:
Object.freeze(user); // Impede adicionar, deletar ou alterar propriedades!
```

---

## Cadeia de Protótipos (Prototype Chain)

Em JavaScript, objetos herdam propriedades e métodos de outros objetos através da cadeia de protótipos:

<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 15px; font-size: 0.85em;">
  <div style="border: 2px solid #0284c7; border-radius: 6px; padding: 8px 16px; background: #f0f9ff; width: 90%; text-align: center;">
    <strong>Instância (myArray)</strong>: <code>[1, 2, 3]</code>
  </div>
  <div style="font-weight: bold; color: #0284c7;">↓ [[Prototype]]</div>
  <div style="border: 2px solid #eab308; border-radius: 6px; padding: 8px 16px; background: #fefce8; width: 90%; text-align: center;">
    <strong>Array.prototype</strong>: <code>map(), filter(), push(), length...</code>
  </div>
  <div style="font-weight: bold; color: #16a34a;">↓ [[Prototype]]</div>
  <div style="border: 2px solid #16a34a; border-radius: 6px; padding: 8px 16px; background: #f0fdf4; width: 90%; text-align: center;">
    <strong>Object.prototype</strong>: <code>toString(), hasOwnProperty()...</code>
  </div>
  <div style="font-weight: bold; color: #71717a;">↓ [[Prototype]]</div>
  <div style="color: #71717a;"><code>null</code> (Fim da cadeia)</div>
</div>

---

## Orientação a Objetos com `class` (ES6+)

A sintaxe `class` é um *sugar syntax* sobre o sistema tradicional de protótipos:

```javascript
class Person {
  #cpf; // Campo privado (ES2022) - inacessível fora da classe!

  constructor(name, cpf) {
    this.name = name;
    this.#cpf = cpf;
  }

  // Método público:
  getDetails() {
    return `${this.name} (CPF: ${this.#formatCpf()})`;
  }

  // Método privado:
  #formatCpf() {
    return "***." + this.#cpf.slice(3, 9) + "-**";
  }
}
```

---

## Herança com `extends` e `super`

```javascript
class Employee extends Person {
  constructor(name, cpf, salary) {
    super(name, cpf); // Chama o construtor da classe pai (Person)
    this.salary = salary;
  }

  // Sobrescrita de método (Polimorfismo):
  getDetails() {
    return `${super.getDetails()} - Salário: R$ ${this.salary}`;
  }
}

const emp = new Employee("Carlos", "12345678900", 5000);
console.log(emp.getDetails());
```

---

## Resumo & Revisão

- Desestruturação facilita a extração limpa de propriedades de objetos.
- **`Object.keys()`**, **`values()`** e **`entries()`** convertem objetos para estruturas iteráveis em Array.
- **`Object.freeze()`** impede qualquer modificação no objeto.
- **Classes em JS** usam herança baseada em protótipos sob uma sintaxe moderna (`class`, `extends`, `#field`).

---

## Referências & Links Úteis

- **MDN**: [Trabalhando com Objetos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Working_with_Objects)
- **MDN**: [Classes](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes)
- **MDN**: [Herança e Prototype Chain](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
