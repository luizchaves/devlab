# Formulários e validação nativa

Exemplo do tópico [Web APIs: Formulários e Validação](../../../../src/content/docs/courses/web-api/dom/forms.mdx).

Um cadastro de cinco campos em que **nenhuma regra de validação está escrita em
JavaScript**: elas são declaradas no HTML e consultadas pela Constraint Validation
API. A única exceção é a conferência entre as duas senhas, que o HTML não expressa
e entra por `setCustomValidity()`.

| Região | O que demonstra |
| --- | --- |
| `markup` | `required`, `minlength`, `type`, `pattern` e `inputmode` no HTML |
| `custom` | Regra própria integrada ao mecanismo nativo com `setCustomValidity()` |
| `messages` | `validity`, `validationMessage` e mensagem personalizada por restrição |
| `submit` | `checkValidity()` e leitura dos campos com `FormData` |

## Executando

Basta abrir o arquivo no navegador; não há requisição nem dependência.

```bash
npx serve .
```
