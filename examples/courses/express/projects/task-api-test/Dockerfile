# #region build
# Multi-estagio: o estagio de build tem as ferramentas; a imagem final, nao.
FROM node:24-slim AS build

WORKDIR /app

# Copiar os manifestos antes do codigo aproveita o cache: enquanto as
# dependencias nao mudarem, esta camada nao e refeita.
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate
# #endregion

# #region runtime
FROM node:24-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Nao rodar como root: se a aplicacao for comprometida, o atacante herda um
# usuario sem privilegio.
RUN useradd --user-group --create-home --shell /bin/false app

COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/package.json ./package.json
COPY --from=build --chown=app:app /app/prisma ./prisma
COPY --from=build --chown=app:app /app/src ./src

USER app

EXPOSE 3000

# O contêiner sabe dizer se esta saudavel; o orquestrador so precisa perguntar.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.ts"]
# #endregion
