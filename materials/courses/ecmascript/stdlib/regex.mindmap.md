---
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Mapa mental sobre modelo mental, sintaxe, métodos e validações com RegExp em JavaScript."
course: ecmascript
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões Regulares (RegExp)

## Modelo mental

- String de entrada.
- Padrão RegExp.
- Método escolhido.
- Resultado.
  - `boolean` em `test()`.
  - Array ou `null` em `exec()` e `match()`.
  - Nova string em `replace()`.
  - Novo array em `split()`.
- Validação de formato exige comparar a string inteira.

## Objetivo

- Criar RegExp literal e dinâmica.
- Interpretar flags e metacaracteres.
- Escolher métodos de `RegExp` e `String`.
- Construir validações de formato.
- Evitar armadilhas comuns.

## Criação e flags

- Literal.
  - `/padrão/flags`.
  - Melhor para padrões estáticos.
- Construtor.
  - `new RegExp("padrão", "flags")`.
  - Melhor para padrões dinâmicos.
  - Exige escapar barras invertidas.
- Flags.
  - `i`: ignora maiúsculas e minúsculas.
  - `g`: busca global.
  - `m`: múltiplas linhas.
  - `u`: Unicode.
  - `s`: ponto também casa quebra de linha.
  - `y`: busca fixa em `lastIndex`.

## Sintaxe fundamental

### Classes

- `.`: qualquer caractere único, exceto quebra de linha.
- `\d`: dígito.
- `\D`: não dígito.
- `\w`: alfanumérico ou `_`.
- `\W`: não alfanumérico.
- `\s`: espaço em branco.
- `\S`: não espaço em branco.

### Conjuntos

- `[abc]`: aceita um dos caracteres.
- `[^abc]`: rejeita os caracteres listados.
- `[a-z]`: intervalo.
- `[0-9]`: dígitos.
- `^` dentro de `[]` nega o conjunto.

### Âncoras

- `^`: início.
- `$`: fim.
- `\b`: fronteira de palavra.
- Validações usam `^` e `$` para impedir correspondência parcial.

### Quantificadores

- `*`: zero ou mais.
- `+`: um ou mais.
- `?`: zero ou um.
- `{n}`: exatamente `n`.
- `{n,}`: no mínimo `n`.
- `{n,m}`: entre `n` e `m`.
- O quantificador modifica o item imediatamente anterior.

### Greedy e lazy

- Greedy.
  - Captura o maior trecho possível.
  - Exemplo: `/<.*>/`.
- Lazy.
  - Captura o menor trecho possível.
  - Exemplo: `/<.*?>/`.
- ReDoS.
  - **Causa**: backtracking excessivo.
  - **Sinais**: quantificadores aninhados e alternâncias ambíguas.
  - **Detecção**: entradas inválidas longas e quase válidas.
  - **Ataque**: muitos dígitos seguidos de `X`.
  - **Correção**: limitar entrada e simplificar o padrão.

### Grupos

- `(padrão)`: captura por índice.
- `(?<nome>padrão)`: captura nomeada.
- `(?:padrão)`: grupo sem captura.
- `|`: alternância.

### Lookaround

- `(?=padrão)`: lookahead positivo.
- `(?!padrão)`: lookahead negativo.
- `(?<=padrão)`: lookbehind positivo.
- `(?<!padrão)`: lookbehind negativo.
- Verifica contexto sem consumir caracteres.

## Métodos

### RegExp

- `test(str)`.
  - Responde se o padrão existe.
  - Retorna `boolean`.
  - Evite `/g` em validação booleana.
- `exec(str)`.
  - Retorna correspondência detalhada.
  - Expõe grupos capturados.

### String

- `search(regexp)`: índice da primeira ocorrência.
- `match(regexp)`: correspondências.
- `matchAll(regexp)`: iterador com correspondências e grupos.
- `replace(regexp, novoTexto)`: substituição.
- `split(regexp)`: divisão por padrão.

## Validação

- Regex valida aparência textual.
- Regex não confirma existência nem regra de negócio.
- Railroad visual.
  - Diagramas ferroviários (ex: Regexper).
  - **CEP**: início -> dígitos -> máscara opcional -> fim.
  - **CPF**: formato cru ou formato pontuado.
  - **Horário (HH:MM)**: horas (00-23) e minutos (00-59).
  - **E-mail básico**: local -> `@` -> domínio -> sufixo.
  - **Data estrutural**: dia -> `/` -> mês -> `/` -> ano.
- CPF.
  - `/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/`.
- CEP.
  - `/^(\d{8}|\d{5}-\d{3})$/`.
- Horário (HH:MM).
  - `/^([01]\d|2[0-3]):[0-5]\d$/`.
- E-mail básico.
  - `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`.
  - WHATWG `<input type="email">` e regras de domínio (RFC 1034/1123).
- Data (formato estrutural).
  - `/^(\d{2})\/(\d{2})\/(\d{4})$/`.
- HTML `pattern`.
  - Recebe o corpo da expressão.
  - Não usa barras externas nem flags.

## Decisões e Boas práticas

- Defesa em profundidade.
  - Cliente: experiência do usuário (UX).
  - Servidor: segurança e integridade inegociáveis.
- Separação de responsabilidades.
  - RegExp para formato e extração.
  - Código JavaScript para domínio e regras.
- Prevenção a ReDoS.
  - Evitar quantificadores aninhados `(a+)+`.
  - Definir limites de payload.
  - Classes de caracteres específicas.
- Dependências na era da IA.
  - Utilitários próprios (*zero-dependency*) para regras locais (CPF, datas, CEP).
  - Bibliotecas consolidadas (`Zod`, `date-fns`) para esquemas complexos e tipos.
- Ferramentas no dia a dia.
  - IDEs: busca e substituição com grupos (`$1`) no VS Code.
  - Terminal (CLIs): ripgrep (`rg`), grep, sed e fd.
- Boas práticas gerais.
  - Use âncoras em validações de campo.
  - Teste casos válidos e inválidos.
  - Prefira literal para padrões estáticos.
  - Evite `/g` com `test()` em validação.
  - Use `(?:...)` quando não precisar capturar valor.

## Prática

- Criar `regexp-demo.js`.
- Encontrar telefones em um texto.
- Validar CPF, CEP e data.
- Extrair campos de linha de log com grupos.
- Comparar resultado esperado com resultado real.
