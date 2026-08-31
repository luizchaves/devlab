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
title: "JavaScript: Data e Hora (Date e Intl)"
description: "Instanciação de Date, Unix Epoch, pegadinhas de fusos/meses, formatação com Intl.DateTimeFormat e Temporal API."
---

<!-- _class: lead -->

# JavaScript: Data e Hora (Date e Intl)

O objeto `Date`, Unix Epoch timestamp, pegadinhas de indexação de meses e fusos horários, a API `Intl.DateTimeFormat` e a nova Temporal API.

---

## Objetivos da Aula

- **Instanciação**: Manipular datas usando `new Date()`, timestamps e strings ISO 8601.
- **Pegadinhas**: Evitar o erro de indexação de meses baseados em zero (`0 = Janeiro`).
- **Formatação**: Utilizar `Intl.DateTimeFormat` para internacionalização e localização.
- **Fuso Horário**: Compreender a diferença entre horário local e UTC.

---

## O Objeto `Date` e o Unix Epoch

O objeto `Date` armazena um momento no tempo como **milissegundos transcorridos desde o Unix Epoch** (1º de janeiro de 1970, 00:00:00 UTC).

```javascript
// 1. Data e hora atual:
const now = new Date();
console.log(now.getTime()); // Timestamp em milissegundos (ex: 1788134400000)

// 2. Data a partir de String ISO 8601 (recomendado):
const isoDate = new Date("2026-08-30T21:00:00Z");

// 3. Data por componentes (Ano, Mês [0-11], Dia, Hora...):
const customDate = new Date(2026, 7, 30); // 30 de AGOSTO de 2026!
```

---

## Pegadinha Crítica: Meses Baseados em Zero (0-indexed)

Em JavaScript, os meses vão de **`0` (Janeiro)** a **`11` (Dezembro)**:

```javascript
const date = new Date(2026, 0, 15);
console.log(date.getMonth()); // 0 (Janeiro!)

// Tabela rápida de referência de meses:
// 0 = Jan,  1 = Fev,  2 = Mar,  3 = Abr,  4 = Mai,  5 = Jun
// 6 = Jul,  7 = Ago,  8 = Set,  9 = Out, 10 = Nov, 11 = Dez
```

### Métodos Principais de Leitura
- `getFullYear()`: Ano com 4 dígitos.
- `getMonth()`: Mês (0 a 11).
- `getDate()`: Dia do mês (1 a 31).
- `getDay()`: Dia da semana (0 = Domingo a 6 = Sábado).

---

## Formatação com `Intl.DateTimeFormat`

A API `Intl.DateTimeFormat` permite formatar datas de acordo com o idioma e a região do usuário sem bibliotecas externas:

```javascript
const now = new Date();

// Formatação padrão pt-BR (dd/mm/aaaa):
const formatterBR = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short"
});
console.log(formatterBR.format(now));
// Ex: "domingo, 30 de agosto de 2026 às 21:00"

// Formatação customizada:
const customFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});
console.log(customFormatter.format(now)); // "30 de ago. de 2026"
```

---

## Futuro da Manipulação de Datas: Temporal API

O objeto `Date` tradicional possui limitações históricas de mutabilidade e fuso. A **Temporal API** (Stage 3/4) é a nova especificação nativa para datas:

```javascript
// Exemplo de uso da especificação Temporal (moderna):
// const now = Temporal.Now.zonedDateTimeISO();
// const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
// const future = now.add(duration);
```

- **Vantagens**: Objetos imutáveis, tratamento nativo de fusos horários e separação clara entre data pura, hora pura e data/hora com fuso.

---

## Resumo & Revisão

- O objeto `Date` utiliza milissegundos desde o **Unix Epoch (1970)**.
- **Atenção**: `getMonth()` retorna números de `0` a `11` (`0` = Janeiro).
- Use **ISO 8601** (`YYYY-MM-DDTHH:mm:ssZ`) para transporte seguro de datas em JSON/APIs.
- Use **`Intl.DateTimeFormat`** para formatar datas para o usuário final.

---

## Referências & Links Úteis

- **MDN**: [Objeto Date](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date)
- **MDN**: [Intl.DateTimeFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
