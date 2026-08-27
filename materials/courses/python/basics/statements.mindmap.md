---
title: 'Python: Decisão e Repetição'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Decisão e Repetição

## Ideia Central

- A **indentação** delimita blocos: recuo é sintaxe, não estilo
- Decisão escolhe caminhos; repetição percorre iteráveis ou condições

## Blocos e Indentação

- **4 espaços** por nível (PEP 8), sem misturar tabs
- Todo cabeçalho termina em dois-pontos
- Bloco vazio precisa de `pass`
- Recuo incorreto gera `IndentationError` ou `TabError`

## Decisão com if

### Encadeamento
- `if` → `elif` → `else`: apenas o primeiro verdadeiro executa
- Ordem importa: da condição mais restritiva para a mais ampla

### Testes idiomáticos
- `if not items:` para coleção vazia
- `if user is None:` para ausência de valor
- **Guard clause**: trate saídas cedo e evite aninhamento

## match e case

- Disponível desde o **Python 3.10** (PEP 634)
- **Literal**: `case 404:`
- **Alternativa**: `case "a" | "b":`
- **Sequência**: `case [x, y]:` e `case [first, *rest]:`
- **Mapeamento**: `case {"id": id}:`
- **Guarda**: `case x if x > 10:`
- **Curinga**: `case _:`
- Armadilha: `case nome:` **captura**, não compara

## Laço for

- Percorre iteráveis; não existe `for (i = 0; i < n; i++)`
- `range(início, fim, passo)` com fim **exclusivo**
- `enumerate(itens, start=1)` fornece índice e valor
- `zip(a, b)` percorre listas em paralelo
- `dict.items()` devolve pares chave/valor

## Laço while

- Repete enquanto a condição for verdadeira
- Indicado quando o número de repetições é desconhecido
- Esquecer de atualizar a variável gera laço infinito

## Controle de Fluxo

- `break`: encerra o laço
- `continue`: pula para a próxima iteração
- `else` de laço: executa se **nenhum** `break` ocorreu
- `pass`: marcador de bloco vazio

## Boas Práticas

- **Evite `for i in range(len(itens))`**: use `enumerate`
- **Use `for ... else`** em buscas, no lugar de variável de flag
- **Extraia laços aninhados** para funções quando precisar sair dos dois
- **Configure o editor** para converter tab em 4 espaços
