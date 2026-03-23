# Étape 1 : Build
FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

# Copie des fichiers nécessaires à l'installation
COPY package.json package-lock.json ./
RUN npm ci

# Copie du reste du projet
COPY . .

# Build l'application en production
RUN npm run build:no-lint

# Étape 2 : Runtime
FROM node:22-alpine AS runner

# Créer utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copie les fichiers nécessaires au runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Désactive l'exécution de shells
ENV SHELL=/bin/false

# Lancer l'app avec un utilisateur non-root
USER nextjs

# Lancement de l'app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "start"]
