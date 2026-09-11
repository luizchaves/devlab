# invest-db — o SQL do Guia de Banco de Dados

Todo SQL mostrado nas páginas do guia vive aqui como arquivo `.sql` de verdade, executado
contra um SQLite em memória pelo `run.mjs`. As saídas que as páginas exibem são as que o
script imprime.

## Arquivos

- `schema.sql` e `seed.sql`: o blog de exemplo (`User`, `Post`, `Product`), carregado antes
  de todo arquivo que não começa com `-- standalone`.
- `crud.sql`, `filters.sql`, `ordering.sql`, `alter-drop.sql`: DDL e DML.
- `joins.sql`, `aggregations.sql`, `subqueries.sql`, `views.sql`: consultas.
- `modeling/school.sql`: mapeamento do DER de professores, turmas e alunos.
- `normalization/1fn.sql`, `2fn.sql`, `3fn.sql`: as formas normais, com uma verificação cada.
- `datasets/selic.csv`: dataset ilustrativo para o exercício de importação com `sqlite3 .import`.

## Como executar

Requer Node.js 22+. Não há dependências.

```bash
npm start
```

Para um arquivo só:

```bash
node run.mjs joins.sql
```

Arquivos que começam com `-- standalone` criam o próprio esquema e não carregam o blog.
