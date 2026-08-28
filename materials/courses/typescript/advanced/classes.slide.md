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
title: "TypeScript: Classes"
description: "Slides da aula de classes: modificadores de acesso, propriedades de parâmetro, acessadores, implements, abstract e campos privados."


---



<!-- _class: lead -->

# TypeScript: Classes

Modificadores, propriedades de parâmetro, `implements`, `abstract` e campos `#`.



---



## Objetivo

Usar a construção que existe nos dois mundos — tipo e runtime:

- Declarar classes com propriedades tipadas.
- Aplicar `public`, `private`, `protected` e `readonly`.
- Encurtar construtores com **propriedades de parâmetro**.
- Implementar interfaces e criar classes **abstratas**.
- Diferenciar `private` de campos privados `#`.



---


## Classe Tipada (Parte 1)

```ts
class Course {
  title: string;
  published = false;

  constructor(title: string, public hours: number) {
    this.title = title;
  }

```


---


## Classe Tipada (Parte 2)

```ts
  describe(): string {
    return `${this.title} (${this.hours}h)`;
  }
}
```

*Sob `strict`, declarar sem inicializar é erro: `Property has no initializer`.*


---



## Modificadores

| Modificador | Acessível em |
| --- | --- |
| `public` | Qualquer lugar (padrão) |
| `protected` | Na classe e nas subclasses |
| `private` | Só na própria classe |
| `readonly` | Leitura livre; escrita só na inicialização |

*Todos valem apenas em **tempo de compilação**.*



---


## Propriedades de Parâmetro (Parte 1)

```ts
// Longo
class Verbose {
  private readonly url: string;
  constructor(url: string) { this.url = url; }
}

```


---


## Propriedades de Parâmetro (Parte 2)

```ts
// Curto: idêntico
class Concise {
  constructor(
    private readonly url: string,
    private readonly timeout: number = 5_000,
  ) {}
}
```

*O modificador é obrigatório para o atalho funcionar.*


---

## Acessadores (Parte 1)

```ts
class Product {
  #price = 0;

  get price(): number { return this.#price; }

```

---

## Acessadores (Parte 2)

```ts
  set price(value: number) {
    if (value < 0) throw new RangeError("preço negativo");
    this.#price = value;
  }

  get priceWithTax(): number { return this.#price * 1.1; }
}
```

*Getter sem setter = propriedade somente leitura.*

---



## `implements`

```ts
class InMemoryRepo implements Repository<Course> {
  async findById(id: string): Promise<Course | null> { … }
  async save(entity: Course): Promise<Course> { … }
}
```

- Apenas **verifica**: não herda nada.
- A compatibilidade continua estrutural — `implements` só antecipa o erro.



---



## Classes Abstratas

```ts
abstract class Notification {
  constructor(protected readonly recipient: string) {}

  abstract send(): string;          // subclasse implementa

  format(): string {                // herdado por todas
    return `[${new Date().toISOString()}] ${this.send()}`;
  }
}

// new Notification("x");   // erro: Cannot create an instance
```



---



## interface x abstract class

| Recurso | `interface` | `abstract class` |
| --- | --- | --- |
| Existe em runtime | Não | Sim |
| Contém implementação | Não | Sim |
| Herança múltipla | Sim | Não |
| Tem estado | Não | Sim |
| Custo no bundle | Zero | Código real |



---



## `private` x `#`

```ts
class Token {
  private legacy = "abc";   // apagado na compilação
  #modern = "xyz";          // campo privado do JavaScript
}

(token as any).legacy;      // "abc" — acessível em runtime!
Object.keys(token);         // ['legacy'] — o # nem aparece
```

*Prefira `#` em código novo: a privacidade vale depois da compilação.*



---



## Exercício

Crie `src/shapes.ts`:

1. `interface Measurable` com `area()` e `perimeter()`;
2. `abstract class Shape implements Measurable` com `readonly name`;
3. `Rectangle`, `Circle` e `Square` (estendendo `Rectangle`);
4. Valide medidas lançando `RangeError`;
5. Use um campo `#` e um membro `static` de contagem.



---


## Solução do Exercício (Parte 1)

```ts
abstract class Shape implements Measurable {
  static created = 0;

  protected constructor(public readonly name: string) {
    Shape.created += 1;
  }

```


---


## Solução do Exercício (Parte 2)

```ts
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `${this.name.padEnd(12)}${this.area().toFixed(2).padStart(10)}`;
  }
}
```


---


## Resumo da Aula (Parte 1)

- Classes geram código **e** definem tipo — existem nos dois mundos.
- Propriedades de parâmetro eliminam a repetição do construtor.
- `private` e `protected` são verificações de compilação, apagadas na emissão.


---


## Resumo da Aula (Parte 2)

- `#campo` é privacidade real, garantida pelo runtime.
- `implements` só verifica; a compatibilidade continua estrutural.
- Classe abstrata compartilha implementação; interface, apenas forma.