# Rolagem: progresso, seção ativa e scroll-snap

Exemplo do tópico [Web APIs: Rolagem e Posicionamento](../../../../src/content/docs/courses/web-api/dom/scroll.mdx).

Uma página de documentação com índice fixo que demonstra as três formas de lidar
com rolagem, e deixa explícito o quanto delas o CSS já resolve.

| Região | O que demonstra |
| --- | --- |
| `css` | `scroll-behavior`, `scroll-margin-top`, `scroll-snap-type` e `prefers-reduced-motion` |
| `ativo` | Seção ativa no índice com `IntersectionObserver` e `rootMargin` |
| `progresso` | Barra de leitura com `scrollY`, `scrollHeight` e `innerHeight` |
| `rolar` | `scrollIntoView()` disparado por um botão |

## Executando

Não há requisição nem dependência; qualquer servidor estático serve.

```bash
npx serve .
```
