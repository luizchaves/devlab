---
title: 'JavaScript: Expressões Regulares (RegExp)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões Regulares (RegExp)

## Ideia Central e Modelo Mental

- **Propósito**: notação formal para descrever e casar padrões textuais
- **Tríade de execução**: texto de entrada, padrão RegExp e método escolhido
- **Resultado da busca**: booleano, array de ocorrências, extrações ou novas strings
- **Separação de papéis**: validação de formato textual vs. regras de negócio
- **Escopo**: casamento parcial no texto ou validação integral de campos

## Criação e Flags

### Formas de Criação
- **Notação literal (`/.../`)**: recomendada para padrões estáticos conhecidos em desenvolvimento
- **Construtor (`new RegExp`)**: recomendado para padrões dinâmicos construídos a partir de variáveis
- **Escape de barras no construtor**: exige barras invertidas duplas como `"\\d+"`

### Flags Modificadoras
- **Flag `i` (*ignore case*)**: ignora diferença entre letras maiúsculas e minúsculas
- **Flag `g` (*global*)**: busca todas as ocorrências sem parar na primeira
- **Flag `m` (*multiline*)**: aplica `^` e `$` a cada linha do texto
- **Flag `u` (*unicode*)**: habilita conformidade total e rejeita escapes inválidos
- **Flag `s` (*dotAll*)**: permite que o metacaractere ponto case quebras de linha
- **Flag `y` (*sticky*)**: busca correspondência exata na posição indicada por `lastIndex`

## Sintaxe Fundamental

### Metacaracteres e Classes
- **Ponto (`.`)**: qualquer caractere único exceto quebras de linha
- **Dígitos (`\d` e `\D`)**: casa algarismos numéricos (`\d`) ou qualquer não dígito (`\D`)
- **Alfanumérico (`\w` e `\W`)**: letras, números e sublinhado (`\w`) ou seu inverso (`\W`)
- **Espaço em branco (`\s` e `\S`)**: espaços, tabulações e quebras (`\s`) ou não espaços (`\S`)

### Conjuntos e Âncoras
- **Conjuntos (`[...]`)**: lista caracteres ou intervalos válidos como `[a-z0-9]`
- **Negação (`[^...]`)**: `^` dentro de colchetes rejeita todos os caracteres listados
- **Âncora de início (`^`)**: fixa a correspondência obrigatoriamente no início da string
- **Âncora de fim (`$`)**: fixa a correspondência obrigatoriamente no final da string
- **Fronteira de palavra (`\b`)**: demarca transições entre caracteres de palavra e delimitadores

### Quantificadores e Modos
- **Quantificadores básicos**: `*` (zero ou mais), `+` (um ou mais) e `?` (zero ou um)
- **Faixas numéricas**: `{n}` (exato), `{n,}` (no mínimo) e `{n,m}` (intervalo fechado)
- **Modo guloso (*greedy*)**: comportamento padrão que consome o maior trecho possível
- **Modo preguiçoso (*lazy*)**: marcado com `?` para consumir o menor trecho viável

### Grupos e Asserções
- **Grupo de captura (`(...)`)**: isola subpadrões e armazena valores em índices numéricos
- **Captura nomeada (`(?<name>...)`)**: armazena resultados capturados em propriedades do objeto `groups`
- **Não captura (`(?:...)`)**: aplica quantificadores ou alternância sem guardar valores
- **Alternância (`|`)**: operador lógico que aceita uma ramificação ou outra
- **Lookahead (`(?=...)` e `(?!...)`)**: inspeciona o texto posterior sem consumir caracteres
- **Lookbehind (`(?<=...)` e `(?<!...)`)**: inspeciona o texto anterior sem consumir caracteres

## Métodos de RegExp e String

### Métodos de RegExp
- **`test()`**: avalia existência do padrão e retorna `true` ou `false`
- **`exec()`**: retorna array detalhado com grupos ou `null` quando não casa
- **Armadilha de `lastIndex`**: flag `g` mantém estado interno e quebra `test()` repetido

### Métodos de String
- **`search()`**: retorna a posição da primeira correspondência ou `-1`
- **`match()`**: retorna array de correspondências ou grupos da primeira ocorrência
- **`matchAll()`**: produz iterador com todas as ocorrências e grupos associados
- **`replace()` e `replaceAll()`**: substitui padrões literais ou via grupos de captura
- **`split()`**: divide o texto aceitando padrões e delimitadores complexos

## Padrões Práticos de Validação

### Formatos Comuns
- **CEP brasileiro**: `/^(\d{8}|\d{5}-\d{3})$/` aceita formatos cru e formatado
- **CPF estrutural**: `/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/` valida apenas a máscara visual
- **Horário (HH:MM)**: `/^([01]\d|2[0-3]):[0-5]\d$/` restringe horas de 00 a 23 e minutos
- **E-mail prático**: padrão ancorado com classes de caracteres e domínio qualificado
- **Data estrutural**: `/^(\d{2})\/(\d{2})\/(\d{4})$/` valida disposição de dia, mês e ano

### Visualização e Formulários
- **Diagramas de ferrovia (Railroad)**: representação gráfica de fluxos como no Regexper
- **HTML5 `pattern`**: aplica o miolo da expressão diretamente em inputs do navegador

## Decisões de Arquitetura e Segurança

### Responsabilidades e Segurança
- **Formato vs. Domínio**: RegExp valida formato textual; JavaScript valida Módulo 11 e bissextos
- **Prevenção a ReDoS**: quantificadores aninhados causam explosão combinatória de backtracking
- **Mitigações de ReDoS**: limites em payload, classes específicas e eliminação de ambiguidades
- **Defesa em profundidade**: cliente cuida da experiência; servidor garante integridade inegociável

### Bibliotecas vs. Zero-Dependency
- **Utilitários nativos**: funções puras para regras locais (CPF, datas e CEPs) sem inflar dependências
- **Bibliotecas especializadas**: adoção criteriosa de Zod para contratos de APIs e tipagem estática

## Ferramentas de Produtividade

### Ambientes e Linha de Comando
- **IDEs (VS Code)**: busca com regex e substituição com grupos retrovisores `$1`
- **Ripgrep (`rg`)**: pesquisa ultrarrápida de padrões em repositórios inteiros
- **Utilitários CLI (`grep`, `sed`, `fd`)**: filtros em pipelines, substituições em lote e busca de arquivos

## RegExp na Era da IA

### Fluxo de Trabalho Assistido
- **Especificação por exemplos**: prompt detalhado com formato, dialeto ECMAScript e casos negativos
- **Casos negativos**: entradas inválidas no prompt evitam expressões excessivamente permissivas
- **Verificação automatizada**: transformar tabela de casos em testes com `node:test` nativo
- **Auditoria de padrões legados**: solicitar explicação trecho a trecho antes de refatorar
- **Armadilhas de dialetos**: modelos alucinam escapes de Python/Perl como `\z` que falham silenciosamente
- **Checklist pré-merge**: conferir âncoras, ausência de ReDoS e validações de regras em código

## Boas Práticas

### Recomendações Essenciais
- **Ancoragem obrigatória**: use sempre `^` e `$` em campos inteiros de formulário
- **Evite flag global em validações**: nunca combine flag `g` com chamadas a `test()`
- **Prefira grupos sem captura**: use `(?:...)` por padrão quando não precisar extrair o valor
- **Limites finitos**: restrinja repetições abertas com faixas como `{1,64}`
- **Testes com entradas de borda**: valide espaços laterais, strings vazias e tipos incorretos
