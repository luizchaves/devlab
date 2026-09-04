---
title: 'JavaScript: Date e Manipulação de Datas'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Date e Manipulação de Datas

## Ideia Central

- **Unix Timestamp**: milissegundos decorridos desde 01/01/1970 00:00:00 UTC (*Epoch*)
- **Representação interna**: número de 64 bits em ponto flutuante
- **Padrão de texto**: formato internacional ISO 8601

## Instanciação e Construtores

- `new Date()`: momento exato da execução
- `new Date(ms)`: data criada a partir do timestamp Epoch
- `new Date(string)`: análise textual no formato ISO 8601
- `new Date(ano, mês, ...)`: componentes numéricos com mês base zero (`0` a `11`)
- `Date()` sem `new`: retorna *string* do momento atual, ignorando argumentos
- `Date.now()`: retorna timestamp numérico sem instanciar objeto

## Fusos Horários e ISO 8601

- **Padrão ISO 8601**: `YYYY-MM-DDTHH:mm:ss.sssZ`
- **Sufixo Z**: indica fuso UTC (*Zulu Time*)
- **Offsets explícitos**: deslocamento relativo ao UTC (ex: `-03:00` para Brasília)
- **Armadilha do dia anterior**: strings `"YYYY-MM-DD"` são parseadas em UTC
- **JSON**: `JSON.stringify()` chama `.toJSON()`, gerando string ISO UTC

## Leitura e Alteração

### Métodos Locais
- `getFullYear()` / `setFullYear()`: ano com quatro dígitos
- `getMonth()` / `setMonth()`: mês indexado em zero (`0` = Janeiro)
- `getDate()` / `setDate()`: dia do mês (`1` a `31`), ajusta viradas
- `getDay()`: dia da semana (`0` = Domingo a `6` = Sábado)
- `getHours()` / `setHours()`: horas no relógio do sistema local

### Métodos UTC
- `getUTCFullYear()` / `getUTCMonth()`: componentes universais em UTC
- `getUTCDate()` / `getUTCHours()`: componentes padronizados sem fuso local
- `getTime()` / `valueOf()`: timestamp bruto em milissegundos

## Aritmética e Coerção

- **Subtração (`d2 - d1`)**: coerção numérica automática via `valueOf()`
- **Adição (`d + 1000`)**: concatena como string devido a `Symbol.toPrimitive`
- **Cálculo de dias**: divisão de milissegundos por `86_400_000`
- **Aritmética de calendário**: prefira `setDate(d.getDate() + n)` contra Horário de Verão
- **Validação de datas**: verificar com `!Number.isNaN(d.getTime())`
- **Data inválida**: `new Date("abc")` gera objeto com timestamp `NaN`

## Formatação com Intl

### DateTimeFormat
- `Intl.DateTimeFormat`: adaptação ao idioma e fuso especificado
- `format()`: formatação com `dateStyle` e `timeStyle`
- `formatRange()`: formatação nativa de intervalos de datas

### RelativeTimeFormat
- `Intl.RelativeTimeFormat`: gera textos humanos internacionalizados
- **Unidades temporais**: frases com minutos, horas, dias ou meses

## API Temporal (TC39)

- **Imutabilidade**: todos os tipos geram novas instâncias sem efeitos colaterais
- **Meses base 1**: Janeiro é `1` e Dezembro é `12`
- `Temporal.PlainDate`: data de calendário sem horário ou fuso
- `Temporal.PlainTime`: horário puro de relógio
- `Temporal.ZonedDateTime`: instante exato associado a fuso IANA
- `until()` / `since()`: cálculo nativo de diferenças sem conversão em milissegundos
- `add()` / `subtract()`: adição e subtração semântica de períodos

## Bibliotecas Utilitárias

- `date-fns`: paradigma funcional, funções puras e *tree-shaking* eficiente
- `dayjs`: API fluente orientada a objetos com tamanho ultraleve (~2 KB)
- `Luxon`: suporte aprofundado a fusos horários e imutabilidade nativa
- `Moment.js`: biblioteca legada, pesada e mutável, descontinuada para novos projetos

## Boas Práticas

- **Persistência em UTC**: grave e trafegue dados no padrão ISO 8601 UTC
- **Exibição Local**: formate na camada de apresentação com `Intl`
- **Validação prévia**: rejeite datas inválidas testando `isNaN(date.getTime())`
- **Aritmética robusta**: use métodos de calendário ou bibliotecas em cálculos complexos
- **Prefira imutabilidade**: evite mutações diretas com `set*` em instâncias compartilhadas
