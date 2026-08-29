# express-auth

Cadastro, autenticação e autorização em **TypeScript**, usando apenas
`node:crypto` — sem `bcrypt`, sem `jsonwebtoken`.

- `src/utils/password.ts` — hash de senha com **Argon2id** no formato PHC
- `src/utils/jwt.ts` — assinatura e verificação de **JWT HS256**
- `src/middlewares/authenticate.ts` — quem está chamando (401)
- `src/middlewares/authorize.ts` — o que essa pessoa pode fazer (403/404)

```bash
npm install
cp .env.example .env
npm run dev
npm test
```

Usuário de demonstração: `ana@example.com` / `senha-secreta` (papel `admin`).

| Método | Caminho            | Proteção            |
| ------ | ------------------ | ------------------- |
| POST   | `/auth/signup`     | pública             |
| POST   | `/auth/signin`     | pública             |
| GET    | `/auth/me`         | token               |
| GET    | `/investments`     | token (do dono)     |
| POST   | `/investments`     | token               |
| DELETE | `/investments/:id` | token + posse       |
| GET    | `/users`           | token + `role=admin`|

`argon2Sync` está disponível a partir do Node 24. Em versões anteriores, troque
por `scryptSync` — o formato PHC e a lógica de verificação são os mesmos.
