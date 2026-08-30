FROM node:24-alpine AS deps
WORKDIR /app
# Copia so o manifesto antes do codigo: alterar src/ nao refaz a instalacao.
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

# O monitoramento depende do binario `ping`, que nao vem na imagem base.
RUN apk add --no-cache iputils

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# O client do Prisma e especifico da plataforma: precisa ser gerado na imagem.
RUN npx prisma generate

RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 3000
# Aplica as migrations pendentes no volume e so entao sobe o servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
