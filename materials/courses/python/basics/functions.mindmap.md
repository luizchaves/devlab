---
title: 'Python: Funções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Funções

## Ideia Central

- Funções empacotam comportamento sob um nome e evitam repetição
- São **objetos de primeira classe**: podem ser passadas, devolvidas e guardadas

## Definição

- `def nome(parâmetros):` seguido de bloco indentado
- **Docstring** na primeira linha do corpo (PEP 257)
- Sem `return`, devolve `None` implicitamente
- `def` cria o objeto; os parênteses **chamam**

## Parâmetros

### Formas de passagem
- **Posicionais**: seguem a ordem da definição
- **Nomeados**: `active=True` documenta a chamada
- Nomeado antes de posicional é erro de sintaxe

### Valores padrão
- Tornam o parâmetro opcional e vêm **depois** dos obrigatórios
- Avaliados **uma única vez**, na definição
- Nunca use lista ou dicionário como padrão: use `None` como sentinela

### Quantidade variável
- `*args`: posicionais extras em uma **tupla**
- `**kwargs`: nomeados extras em um **dicionário**
- Na chamada, `*` e `**` desempacotam coleções

### Restrições de assinatura
- `/`: tudo antes é somente-posicional
- `*`: tudo depois é somente-nomeado

## Retorno

- `return` encerra a função imediatamente
- Vários valores viram **tupla**, desempacotada na atribuição
- **Guard clause**: retorne cedo nos casos de exceção

## Escopo LEGB

- **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in → `NameError`
- Atribuir dentro da função cria variável **local**
- `global`: liga ao escopo do módulo
- `nonlocal`: liga à função externa (closures)
- **Closure**: função interna que preserva o ambiente de criação

## Funções como Valores

- `lambda`: função anônima de **uma expressão**
- Ordem superior: `sorted(key=...)`, `map`, `filter`
- Dicionário de despacho: função escolhida por chave
- PEP 8 desaconselha `nome = lambda ...`

## Decoradores

- `@decorador` equivale a `função = decorador(função)`
- `functools.wraps` preserva nome e docstring
- Base de `@property`, `@staticmethod` e rotas de frameworks web

## Boas Práticas

- **Uma responsabilidade por função**, com nome que descreve a ação
- **Documente com docstring** e anote tipos
- **Evite `global`**: receba por parâmetro e devolva resultado
- **Prefira `def` a `lambda`** quando a função tem nome
