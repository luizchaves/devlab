---
title: 'JavaScript: Variáveis, Escopo e Hoisting'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Variáveis, Escopo e Hoisting

## Objetivo
- Compreender como o JavaScript gerencia variáveis na memória, diferenciando declarações com `var`, `let` e `const`.
- Dominar as regras de escopo (global, função e bloco), o comportamento de hoisting.

## Variáveis e Declaração de Identificadores
- Ao declarar uma variável, um valor recebe um nome simbólico e pode ser reutilizado.
### Por que variáveis existem
- Sem variáveis, o mesmo valor precisa ser repetido e o código perde intenção.
- Com uma variável, o valor ganha nome e pode ser reutilizado.
- Ao nomear os valores, o cálculo fica mais legível e cada parte passa a ter uma responsabilidade clara.
### Identificadores
- O nome da variável é chamado de identificador.
- Ele pode usar letras, dígitos, `_` e `$`, mas não pode começar com dígito nem usar palavras reservadas como nome.
- Os exemplos abaixo estão comentados porque representam erros de sintaxe; se forem descomentados.
### Convenções de Nomenclatura (Naming Conventions)
- Convenção: Padrão; Exemplo
- `camelCase`: primeira palavra em minúscula, subsequentes com inicial maiúscula; `userName`, `totalPrice`.
- `SCREAMING_SNAKE_CASE` (ou `UPPER_SNAKE_CASE`): todas as letras em maiúsculas separadas por underline `_`; `API_URL`.
- `PascalCase`: inicial de cada palavra em maiúscula; `UserProfile`, `OrderController`, `Button`
- `kebab-case`: todas as letras minúsculas separadas por hífen `-`; `user-service.js`, `array-utils.js`.
### Inicialização
- Inicializar é atribuir o primeiro valor.
- `const` precisa ser inicializada na declaração.

## Palavras-Chave de Declaração: `var`, `let` e `const`
- Palavra-Chave: Escopo; Reatribuição
- `var`: Função ou Global; Permitida
- `let`: Bloco; Permitida
### Panorama da declaração
- Palavra-chave: Pode reassociar?; Escopo principal
- `const`: Não; Bloco
- `let`: Sim; Bloco
- `var`: Sim; Função
- Em JavaScript moderno, as declarações mais usadas são `const` e `let`.
### Redeclaração
- `var` permite declarar novamente o mesmo nome no mesmo escopo.
- `let` e `const` evitam isso.
- Com `let` e `const`, a tentativa de repetir o mesmo nome no mesmo escopo é bloqueada antes da execução.

## Reassociação e mutação
- Reassociar é fazer a variável apontar para outro valor.
- `var` e `let` permitem isso; `const` não permite.
- `const` impede a troca da associação, mas não transforma objetos e arrays em valores imutáveis.
- O conteúdo interno ainda pode mudar.
- O mesmo vale para objetos: a variável continua apontando para o mesmo objeto.
- O mesmo modelo fica mais visível quando duas variáveis apontam para o mesmo array.

## Escopo Lexical e de Bloco
- Escopo determina em quais partes do código um determinado identificador está visível e pode ser acessado.
- A cadeia de escopos procura primeiro no bloco, depois na função e por fim no global.
### Escopo de Bloco (`let` e `const`)
- Um bloco é delimitado por chaves `{}` em `if`, `for`, `while` ou blocos autônomos.
- Identificadores criados com `let` e `const` dentro de um bloco existem apenas naquele contexto.
### Escopo de Função e Global
- Variáveis declaradas fora de qualquer função ou bloco pertencem ao escopo global.
- Variáveis declaradas com `var` dentro de uma função pertencem exclusivamente àquela função.
### Panorama do escopo
- Escopo define onde uma variável pode ser acessada.
- `var` tem escopo de função.
- Por isso, uma variável declarada dentro de um bloco pode continuar acessível fora dele quando está na mesma função.
- Fora da função, ela não fica disponível.
- O mesmo vale para `let` e `const`: variáveis declaradas dentro de uma função não ficam disponíveis fora dela.
### Escopo em laços
- `let` cria uma nova associação por iteração em laços `for`.
- `var`, por ter escopo de função, compartilha a mesma variável entre as iterações.

## Hoisting e a Zona Morta Temporal (TDZ)
### Hoisting com `var`
- Declarações com `var` são elevadas ao topo de seu escopo e inicializadas com `undefined`.
### Hoisting com `let` e `const` (TDZ)
- Use camelCase para variáveis e funções (`totalAmount`, `getUserProfile`).
- Use UPPER_SNAKE_CASE para constantes verdadeiras de tempo de compilação/configuração (`MAX_RETRY_COUNT`.
- Prefira nomes descritivos em vez de abreviações genéricas (`customerAddress` em vez de `cAddr`).
- Variáveis declaradas com `let` e `const` também sofrem hoisting, mas não são inicializadas.
### Panorama do hoisting
- Declarações são processadas antes da execução do código, comportamento chamado de hoisting.
- Com `var`, a variável existe antes da linha de declaração, mas começa como `undefined`.
- Com `let` e `const`, acessar a variável antes da declaração gera erro por causa da Temporal Dead Zone.
### Globais implícitas
- Esse comportamento é perigoso porque espalha estado pelo programa.

## Case sensitive
- JavaScript diferencia letras maiúsculas e minúsculas.
- Portanto, `number`, `Number` e `NUMBER` são nomes diferentes.

## Boas práticas
- Prática: Motivo
- Prefira `const`: A maior parte dos nomes não precisa ser reassociada
- Use `let` quando houver mudança: Deixa explícito que o valor varia com o tempo
- Evite `var` em código novo: Reduz surpresas de escopo, redeclaração e hoisting
- Declare sempre: Evita globais implícitas
- Use nomes descritivos: Facilita leitura, revisão e depuração

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras

