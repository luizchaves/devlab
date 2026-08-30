FROM node:24-alpine AS deps
WORKDIR /app
# Copia so o manifesto antes do codigo: alterar src/ nao refaz a instalacao.
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build
WORKDIR /app
# O build do front precisa das devDependencies — o Vite e uma delas.
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# O front entra ja compilado: com NODE_ENV=production o Express serve `dist/`.
COPY --from=build /app/dist ./dist
# O client do Prisma e especifico da plataforma: precisa ser gerado na imagem.
RUN npx prisma generate

RUN mkdir -p /app/data /app/public/imgs/profile && chown -R node:node /app
USER node

EXPOSE 3000
# Aplica as migrations pendentes no volume e so entao sobe o servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
