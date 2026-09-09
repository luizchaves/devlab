# Funcionalidades comuns de uma aplicação front-end

Exemplo do tópico [Web APIs: O que uma Aplicação Front-end Faz?](../../../../src/content/docs/courses/web-api/common-features.mdx).

Uma única página reúne seis das funcionalidades mais comuns de uma aplicação
vanilla, cada uma marcada com `#region` para ser recortada pela documentação:

| Região | Funcionalidade | API |
| --- | --- | --- |
| `fetch` | Carga inicial dos dados | Fetch API |
| `render` | Construção da lista | DOM, `DocumentFragment` |
| `validation` | Validação do formulário | Constraint Validation, `FormData` |
| `events` | Remoção de um item | Delegação de eventos, `<dialog>` |
| `storage` | Persistência entre visitas | Web Storage |

## Executando

O `fetch` do arquivo JSON exige HTTP: `file://` não funciona.

```bash
npx serve .
```

Para voltar ao estado inicial, apague a chave `common-features:investments` em
*Application › Local Storage*, nas ferramentas do desenvolvedor.
