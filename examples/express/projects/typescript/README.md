# express-typescript

CRUD de usuários em **TypeScript**, com as mesmas camadas do projeto `mvc`:
router → controller → model, erros centralizados e tipos em `src/types/`.

Não há passo de build: o Node 22.6+ executa `.ts` diretamente removendo as
anotações de tipo (*type stripping*).

```bash
npm install
npm run dev
```

| Método | Caminho      | Ação        |
| ------ | ------------ | ----------- |
| GET    | `/users`     | Lista todos |
| GET    | `/users/:id` | Busca um    |
| POST   | `/users`     | Cria        |
| PUT    | `/users/:id` | Atualiza    |
| DELETE | `/users/:id` | Remove      |

Os imports usam `#` (*subpath imports*), declarado em `package.json`:
`#models/user-model.ts` resolve para `./src/models/user-model.ts`. É um recurso do
próprio Node — diferente de `paths` do `tsconfig.json`, funciona em execução sem
bundler nem loader.

`npm run typecheck` roda o `tsc --noEmit`: é ele quem valida os tipos, não o Node.
