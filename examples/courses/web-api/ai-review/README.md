# Revisão de código de Web API gerado por assistente

Exemplo do tópico [Web APIs: APIs Modernas do Navegador](../../../../src/content/docs/courses/web-api/browser/modern-apis.mdx),
seção "Web APIs na Era da Inteligência Artificial".

`load-items.generated.js` traz a função como um assistente costuma gerá-la, sem
conferir `response.ok`. `load-items.js` traz a versão corrigida. O mesmo arquivo
de teste roda contra as duas.

## Executando

Contra a versão gerada, os testes falham:

```bash
IMPL=generated node --test
```

Contra a versão corrigida, passam:

```bash
node --test
```

Nenhuma dependência: `fetch`, `Response` e `node:test` são nativos do Node.js 22.
