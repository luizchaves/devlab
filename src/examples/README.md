# src/examples

Diretório autorizado alternativo para o `<SourceCode>`, além de `examples/`.

Use `examples/` para projetos completos e executáveis (com `package.json` próprio) e
`src/examples/` para trechos avulsos que existem só para a documentação — um arquivo
de configuração de exemplo, um snippet longo reaproveitado em várias aulas.

```mdx
<SourceCode path="src/examples/config-exemplo.json" />
```

Qualquer caminho fora destes dois diretórios é rejeitado em tempo de build.
