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
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Sintaxe, quantificadores, classes de caracteres, âncoras, métodos test, exec, match, replace e aplicações práticas de RegExp em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Expressões Regulares (RegExp)

Sintaxe, quantificadores, classes de caracteres, âncoras, métodos test, exec, match, replace e aplicações práticas de RegExp em JavaScript.

---

## Objetivo

- Compreender o conceito e a sintaxe de Expressões Regulares em JavaScript, dominar a criação por notação literal e construtor.

---

## Mapa da Aula

- Criação e Flags de Expressões Regulares
- Flags (Modificadores de Comportamento)
- Sintaxe Fundamental de RegExp
- Métodos de RegExp e String
- Padrões Práticos de Validação
- Validação Nativa em Formulários HTML

---

## Criação e Flags de Expressões Regulares

- Em JavaScript, uma Expressão Regular é representada por um objeto do tipo `RegExp`.
- Ela pode ser criada de duas formas: por Notação Literal (delimitada por barras `/padrão/flags`) ou pelo Construtor `new RegExp()`.

---

## Criação e Flags de Expressões Regulares (Comparação)

| Forma de Criação | Sintaxe | Uso Recomendado |
| ---------------- | ------- | --------------- |
| **Notação Literal** | `/padrão/flags` | Padrões estáticos conhecidos em tempo de desenvolvimento |
| **Construtor** | `new RegExp("padrão", "flags")` | Padrões dinâmicos construídos a partir de variáveis |

---

## Flags (Modificadores de Comportamento)

- As flags alteram a forma como a busca por padrões é executada.
- Ao usar o construtor `new RegExp("..."),` as barras invertidas devem ser escapadas com outra barra invertida.
- Por exemplo: o padrão `/\d{3}/` em notação literal torna-se `new RegExp("\\d{3}")` em formato de string.
- Construir e depurar Expressões Regulares diretamente no código pode ser desafiador.
- Uma excelente estratégia antes de implementar a regex na sua aplicação é testá-la e validá-la interativamente no site Regex101.

---

## Flags (Modificadores de Comportamento) (Comparação)

| Flag | Nome | Descrição |
| ---- | ---- | --------- |
| `i` | *Ignore Case* | Busca sem diferenciar letras maiúsculas de minúsculas |
| `g` | *Global* | Busca todas as correspondências no texto, não apenas a primeira |
| `m` | *Multiline* | Faz as âncoras `^` e `$` corresponderem ao início e fim de cada linha |
| `u` | *Unicode* | Ativa o suporte completo a caracteres Unicode de 32-bit |
| `s` | *Dot All* | Faz o caractere ponto (`.`) corresponder também a quebras de linha (`\n`) |

---

## Flags (Modificadores de Comportamento) (Exemplo)

```js
// 1. Notação Literal (com a flag 'i' para ignorar maiúsculas/minúsculas)
const regexLiteral = /javascript/i;

// 2. Construtor RegExp (útil quando o padrão vem de uma variável)
const term = "javascript";
const regexConstructor = new RegExp(term, "i");

console.log(regexLiteral.test("JavaScript"));     // true
console.log(regexConstructor.test("JAVASCRIPT")); // true
```

---

## Sintaxe Fundamental de RegExp

- Uma Expressão Regular combina caracteres literais (como letras e números) com metacaracteres que possuem significados especiais.

---

## 1. Classes de Caracteres

- Atalhos para conjuntos comuns de caracteres.

---

## 1. Classes de Caracteres (Comparação)

| Metacaractere | Correspondência | Equivalente |
| ------------- | --------------- | ----------- |
| `.` | Qualquer caractere (exceto quebra de linha) | Qual caractere único |
| `\d` | Qualquer dígito numérico | `[0-9]` |
| `\D` | Qualquer caractere que **NÃO** seja dígito | `[^0-9]` |
| `\w` | Caractere alfanumérico ou sublinhado | `[a-zA-Z0-9_]` |
| `\W` | Qualquer caractere **NÃO** alfanumérico | `[^a-zA-Z0-9_]` |

---

## 1. Classes de Caracteres (Exemplo)

```js
const hasDigits = /\d+/;
const hasWhitespace = /\s/;

console.log(hasDigits.test("Código 123")); // true
console.log(hasDigits.test("Código ABC")); // false
console.log(hasWhitespace.test("SemEspaços")); // false
```

---

## 2. Conjuntos e Intervalos (`[...]`)

- Os colchetes definem um conjunto de caracteres permitidos em uma determinada posição.

---

## 2. Conjuntos e Intervalos (`[...]`) (Comparação)

| Sintaxe | Descrição | Exemplo |
| ------- | --------- | ------- |
| `[abc]` | Qualquer um dos caracteres: `a`, `b` ou `c` | `/[aeiou]/` (vogais) |
| `[^abc]` | Qualquer caractere **EXCETO** `a`, `b` ou `c` (negação) | `/[^0-9]/` (não dígitos) |
| `[a-z]` | Intervalo de letras minúsculas de `a` a `z` | `/[a-z]/` |
| `[0-9]` | Intervalo de dígitos de `0` a `9` | `/[0-9]/` |
| `[a-zA-Z0-9]` | Combinação de intervalos alfanuméricos | `/[a-zA-Z0-9]/` |

---

## 2. Conjuntos e Intervalos (`[...]`) (Exemplo)

```js
const hexColor = /^#[0-9a-fA-F]{6}$/;

console.log(hexColor.test("#ff0000")); // true
console.log(hexColor.test("#123456")); // true
console.log(hexColor.test("#zzzzzz")); // false (caracteres z não são hexadecimais)
```

---

## 3. Âncoras e Fronteiras

- As âncoras não correspondem a caracteres visíveis; elas especificam posições no texto.
- Sempre utilize a âncora de início `^` e a âncora de fim `$` ao validar campos de formulários (como CPF, CEP ou e-mail).
- Sem elas, uma string contendo caracteres inválidos extras antes ou depois do padrão ainda seria aceita!

---

## 3. Âncoras e Fronteiras (Comparação)

| Metacaractere | Descrição | Exemplo |
| ------------- | --------- | ------- |
| `^` | Início do texto (ou início da linha com flag `m`) | `/^http/` (deve começar com http) |
| `$` | Fim do texto (ou fim da linha com flag `m`) | `/\.pdf$/` (deve terminar em .pdf) |
| `\b` | Fronteira de palavra (limite entre `\w` e `\W`) | `/\bweb\b/i` |

---

## 3. Âncoras e Fronteiras (Exemplo)

```js
// Sem âncoras: busca o padrão em qualquer parte da string
const looseCheck = /\d{3}/;
console.log(looseCheck.test("abc123xyz")); // true

// Com âncoras (^ e $): exige que a string INTEIRA seja exatamente 3 dígitos
const exactCheck = /^\d{3}$/;
console.log(exactCheck.test("abc123xyz")); // false
console.log(exactCheck.test("123"));       // true
```

---

## 4. Quantificadores

- Os quantificadores especificam quantas vezes o elemento anterior deve se repetir.

---

## 4. Quantificadores (Comparação)

| Quantificador | Significado | Exemplo |
| ------------- | ----------- | ------- |
| `*` | 0 ou mais vezes (equivalente a `{0,}`) | `/a*/` |
| `+` | 1 ou mais vezes (equivalente a `{1,}`) | `/\d+/` |
| `?` | 0 ou 1 vez (opcional, equivalente a `{0,1}`) | `/https?/` (aceita http ou https) |
| `{n}` | Exatamente `n` vezes | `/\d{4}/` (exatamente 4 dígitos) |
| `{n,}` | No mínimo `n` vezes | `/\d{2,}/` (no mínimo 2 dígitos) |

---

## 4. Quantificadores (Exemplo)

```js
// Aceita "http://" ou "https://"
const urlPattern = /^https?:\/\//;

console.log(urlPattern.test("http://ifpb.edu.br"));  // true
console.log(urlPattern.test("https://ifpb.edu.br")); // true
console.log(urlPattern.test("ftp://ifpb.edu.br"));   // false

// Ano de nascimento com 4 dígitos
const yearPattern = /^\d{4}$/;
console.log(yearPattern.test("2026")); // true
console.log(yearPattern.test("26"));   // false
```

---

## Quantificadores Gulosos (*Greedy*) vs. Não Gulosos (*Lazy / Non-greedy*)

- Adicionando o caractere `?` logo após um quantificador (como `?`, `+?`, `??`, `{n,m}?`).

---

## Quantificadores Gulosos (*Greedy*) vs. Não Gulosos (*Lazy / Non-greedy*) (Comparação)

| Tipo | Quantificadores | Comportamento | Exemplo em `"<p>texto 1</p><p>texto 2</p>"` |
| ---- | --------------- | ------------- | ------------------------------------------- |
| **Guloso (*Greedy*)** | `*`, `+`, `?`, `{n,m}` | Captura o **máximo** de texto | `/<.*>/` captura `"<p>texto 1</p><p>texto 2</p>"` |
| **Não Guloso (*Lazy*)** | `*?`, `+?`, `??`, `{n,m}?` | Captura o **mínimo** de texto | `/<.*?>/` captura `"<p>"` |

---

## Quantificadores Gulosos (*Greedy*) vs. Não Gulosos (*Lazy / Non-greedy*) (Exemplo)

```js
const html = "<div>Primeira tag</div><div>Segunda tag</div>";

// 1. Quantificador Guloso (Greedy: .*): vai até o ÚLTIMO </div>
const greedyRegex = /<div>.*<\/div>/;
console.log(html.match(greedyRegex)[0]);
// "<div>Primeira tag</div><div>Segunda tag</div>" (Captura a string inteira)

// 2. Quantificador Não Guloso (Lazy: .*?): para no PRIMEIRO </div>
const lazyRegex = /<div>.*?<\/div>/;
console.log(html.match(lazyRegex)[0]);
// "<div>Primeira tag</div>" (Captura apenas o primeiro bloco!)
```

---

## 5. Grupos e Alternância

- Parênteses `(...)` são usados para agrupar expressões, criar grupos de captura e aplicar quantificadores a múltiplos caracteres.
- O operador pipe `|` permite alternância (opção OU).

---

## 5. Grupos e Alternância (Exemplo)

```js
// Alternância (OU)
const domainPattern = /\.(com|org|net|edu\.br)$/i;

console.log(domainPattern.test("site.com"));    // true
console.log(domainPattern.test("ifpb.edu.br")); // true
console.log(domainPattern.test("site.xyz"));    // false

// Grupos de Captura
const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const match = "22/08/2026".match(datePattern);

if (match) {
// ...
```

---

## Métodos de RegExp e String

- Em JavaScript, o trabalho com Expressões Regulares é dividido entre métodos da própria instância `RegExp` e métodos da classe `String`.

---

## 1. Métodos do Objeto RegExp

- O próprio objeto da expressão regular expõe dois métodos, com propósitos bem distintos
- Quando uma instância de `RegExp` usa a flag `/g`, o método `.test()` atualiza internamente a propriedade `lastIndex`.
- Invocar o mesmo objeto `regexp.test(str)` repetidamente na mesma string pode alternar entre `true` e `false`!
- Para testes booleanos simples de validação, evite a flag `g`.

---

## 1. Métodos do Objeto RegExp (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `regexp.test(str)` | Testa se o padrão existe na string | `boolean` (`true` ou `false`) |
| `regexp.exec(str)` | Executa a busca e retorna informações de grupos | Array de correspondência ou `null` |

---

## 1. Métodos do Objeto RegExp (Exemplo)

```js
const pattern = /DW-(\d{4})/;
const text = "Turma DW-2026 de Desenvolvimento Web";

// 1. test() - Retorno booleano simples
console.log(pattern.test(text)); // true

// 2. exec() - Retorna array detalhado com correspondência e grupos
const result = pattern.exec(text);
console.log(result[0]); // "DW-2026" (texto completo capturado)
console.log(result[1]); // "2026" (primeiro grupo de captura)
```

---

## 2. Métodos de String que Utilizam RegExp

- Do outro lado, as strings aceitam expressões regulares em cinco métodos, que cobrem busca, substituição e divisão
- Referência: RegExp.prototype.test() | MDN.

---

## 2. Métodos de String que Utilizam RegExp (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `str.match(regexp)` | Retorna as correspondências encontradas | Array de correspondências ou `null` |
| `str.matchAll(regexp)` | Retorna um iterador com todas as correspondências e grupos (exige flag `g`) | Iterador de correspondências |
| `str.replace(regexp, newText)` | Substitui o padrão por um novo texto ou retorno de callback | Nova `string` |
| `str.split(regexp)` | Divide a string utilizando a RegExp como separador | Novo `Array` |

---

## 2. Métodos de String que Utilizam RegExp (Exemplo)

```js
const text = "Contatos: ana@gmail.com, bruno@ifpb.edu.br e carla@hotmail.com";

// 1. match() com flag /g: Encontra todos os e-mails
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const emails = text.match(emailPattern);
console.log(emails); // [ 'ana@gmail.com', 'bruno@ifpb.edu.br', 'carla@hotmail.com' ]

// 2. replace() com callback: Ocultando e-mails para privacidade
const maskedText = text.replace(emailPattern, "[E-MAIL OCULTO]");
console.log(maskedText); // "Contatos: [E-MAIL OCULTO], [E-MAIL OCULTO] e [E-MAIL OCULTO]"

// 3. split() com RegExp: Dividindo por múltiplos separadores (vírgula, ponto e vírgula ou espaço)
const items = "HTML; CSS, JavaScript   Node.js".split(/[\s,;]+/);
console.log(items); // [ 'HTML', 'CSS', 'JavaScript', 'Node.js' ]
```

---

## Padrões Práticos de Validação (Exemplo)

```js
// 1. Validação de CPF (formato 11 dígitos ou 000.000.000-00)
const cpfPattern = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

console.log(cpfPattern.test("11122233344"));     // true
console.log(cpfPattern.test("111.222.333-44")); // true
console.log(cpfPattern.test("111A22233344"));   // false

// 2. Validação de CEP (formato 8 dígitos ou 00000-000)
const cepPattern = /^(\d{8}|\d{5}-\d{3})$/;

console.log(cepPattern.test("58000000"));  // true
console.log(cepPattern.test("58000-000")); // true
// ...
```

---

## Validação Nativa em Formulários HTML

- No HTML5, você pode utilizar a propriedade `pattern` em elementos `` passando uma expressão regular (sem as barras externas).

---

## Validação Nativa em Formulários HTML (Exemplo)

```html
<!-- O formulário só será enviado se o usuário digitar o CEP no formato 00000-000 -->
<form>
  <label for="cep">CEP:</label>
  <input
    type="text"
    id="cep"
    name="cep"
    pattern="\d{5}-\d{3}"
    placeholder="00000-000"
    required
  />
  <button type="submit">Enviar</button>
</form>
```

---

## Resumo e Boas Práticas

- Em validações de formulário, use sempre as âncoras `^` (início) e `$` (fim) para garantir que a string inteira obedeça ao padrão.
- Teste seus padrões com casos positivos e negativos usando ferramentas como regex101.com.
- Prefira notação literal `/padrão/` para regex estáticas.
- Evite a flag `g` em instâncias de `RegExp` usadas repetidamente com `.test()` para prevenir problemas de estado com `lastIndex`.
- Use metacaracteres como `\d` (dígitos), `\w` (alfanumérico) e `\s` (espaços) para manter a expressão concisa.

---

## Criação e Flags

- Qual é a diferença de uso entre a Notação Literal (`/padrão/`) e o Construtor (`new RegExp()`)?
- A notação literal é usada para padrões estáticos conhecidos em tempo de desenvolvimento.
- Para que serve a flag `/i` e a flag `/g` em uma Expressão Regular?
- A flag `/i` (ignore case) faz com que a busca ignore a diferença entre letras maiúsculas e minúsculas.
- A flag `/g` (global) faz com que a busca encontre todas as correspondências no texto, e não apenas a primeira.

---

## Sintaxe e Metacaracteres

- Qual é a diferença de significado entre o caractere `^` dentro de colchetes `[^abc]` e fora de colchetes `^abc`?
- Fora dos colchetes, `^` é uma âncora que indica que o padrão deve estar no início da string.
- O que representam as classes de caracteres `\d`, `\w` e `\s`?
- `\d` corresponde a qualquer dígito numérico (0-9).
- `\w` corresponde a qualquer caractere alfanumérico (letras, números e sublinhado `_`).

---

## Métodos e Aplicações

- Por que é importante incluir as âncoras `^` e `$` em expressões de validação de formulários?
- Porque sem `^` e `$`, a Expressão Regular verificará apenas se o padrão existe em alguma parte da string.
- Com `^` e `$`, exige-se que a string inteira, do início ao fim, corresponda exatamente ao padrão.
- Como podemos extrair partes específicas de uma correspondência usando Expressões Regulares?
- Utilizando grupos de captura demarcados por parênteses `(...)` na expressão.

---

## Executando

- Crie um arquivo chamado `regexp-demo.js`
- Execute o arquivo com Node.js no terminal
- Modifique o padrão e teste novos cenários de captura.
- Os conceitos de Expressões Regulares podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Crie uma função `validateCPF(cpf)` que retorne `true` se o CPF estiver no formato de 11 dígitos ou `000.000.000-00`;
- Crie uma função `validateCEP(cep)` que retorne `true` se o CEP estiver no formato de 8 dígitos ou `00000-000`;
- Crie uma função `validateDate(date)` que retorne `true` se a data estiver no formato `DD/MM/AAAA`;
- Teste as funções com entradas válidas e inválidas e imprima os resultados no console.
- Crie um arquivo chamado `validator.js` para construir funções de validação de dados de formulário utilizando Expressões Regulares

---

## Desafio

- A linha de log possui a estrutura: `"192.168.1.50 - [22/Aug/2026:09:30:00] \"GET /api/users HTTP/1.1\" 200"`;
- Crie uma função `parseLogLine(logLine)` que utilize uma RegExp com grupos de captura `(...)` para extrair
- O endereço IP do cliente;
- A data/hora do acesso;
- O método HTTP (`GET`, `POST`, etc.);

---

## Resumo da Aula

- **Sintaxe & Flags**: Literais `/padrao/flags` ou construtor `new RegExp()`; flags `g` (global), `i` (case-insensitive), `m` (multilinha), `u` (unicode).
- **Metacaracteres & Classes**: `\d` (dígitos), `\w` (alfanumérico), `\s` (espaços), `^` (início), `$` (fim) e quantificadores (`*`, `+`, `?`, `{n,m}`).
- **Grupos Nomeados (ES2018)**: Captura semântica de partes do texto com `(?<nome>padrao)` acessíveis via `match.groups.nome`.
- **Métodos de Teste e Extração**: `regex.test()` para validações booleanas, `regex.exec()` e `string.matchAll()` para extração de grupos.
- **Substituição**: `string.replace()` e `replaceAll()` com suporte a referências numéricas (`$1`, `$2`) ou grupos nomeados.
