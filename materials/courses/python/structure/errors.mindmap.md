---
title: 'Python: Erros e Exceções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Erros e Exceções

## Ideia Central

- Exceção interrompe o fluxo normal e **pode ser tratada**
- Tratar bem é decidir o que capturar — e o que deixar subir

## Sintaxe x Execução

- **Erro de sintaxe**: detectado na compilação, nenhuma linha executa
- **Exceção**: acontece durante a execução
- Traceback: leia **de baixo para cima** (tipo e mensagem na última linha)

## Exceções Embutidas

- `ValueError`: tipo certo, valor inadequado (`int("abc")`)
- `TypeError`: tipos incompatíveis (`"1" + 1`)
- `KeyError` / `IndexError`: chave ou índice inexistente
- `AttributeError`: atributo inexistente no objeto
- `FileNotFoundError`: arquivo ausente
- `ZeroDivisionError`: divisão por zero
- `KeyboardInterrupt`: interrupção com Ctrl+C

## Hierarquia

- `BaseException` é a raiz
- `SystemExit` e `KeyboardInterrupt` ficam fora de `Exception`
- Erros de programa descendem de `Exception`
- Capture `Exception`, nunca `BaseException`

## Estrutura do Tratamento

### Blocos
- `try`: apenas o trecho que pode falhar
- `except`: trata um tipo específico (ou tupla de tipos)
- `else`: executa quando **não** houve exceção
- `finally`: executa **sempre**, para limpeza

### Boas escolhas
- `except (KeyError, IndexError) as error:` agrupa tipos
- `except:` genérico esconde bugs e engole Ctrl+C
- Mantenha o `try` curto e mova o caso feliz para o `else`

## Levantando Exceções

- `raise ValueError("mensagem")` sinaliza condição inválida
- `raise ... from error` preserva a **causa** original
- `raise` sozinho relança sem perder o traceback
- Melhor que devolver valores especiais como `-1` ou `None`

## Exceções Próprias

- Herdam de `Exception` (ou de uma base do domínio)
- Uma **exceção base por domínio** permite capturar tudo de uma vez
- Atributos extras carregam contexto (`error.product`, `error.available`)

## Gerenciadores de Contexto

- `with` garante a liberação do recurso, com ou sem exceção
- Substitui o par `try`/`finally` manual
- `@contextmanager` cria gerenciadores próprios com `yield`

## Boas Práticas

- **EAFP**: em Python, `try`/`except` é idiomático para casos esperados
- **Capture o específico**, deixe o inesperado subir
- **Use `with`** sempre que houver arquivo, conexão ou trava
- **Registre antes de relançar** quando precisar auditar a falha
