# ===== STAGE 1: build =====
FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas arquivos de dependência primeiro (cache de camadas)
COPY package.json package-lock.json* ./

RUN npm install

# Copia o resto do projeto
COPY . .

# Build do TanStack Start (SSR com Vite)
RUN npm run build


# ===== STAGE 2: production =====
FROM node:20-alpine

WORKDIR /app

# Copia package.json para instalar apenas dependências de produção
COPY --from=build /app/package.json /app/package-lock.json* ./

# Instala apenas dependências de produção (necessárias para SSR)
RUN npm install --omit=dev

# Copia o output do build (server + client)
COPY --from=build /app/dist ./dist

# Copia o adaptador Node.js que converte o fetch handler para HTTP server
COPY --from=build /app/docker-entry.mjs ./docker-entry.mjs

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "docker-entry.mjs"]
