# Étape 1 : Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des fichiers nécessaires à l'installation
COPY package.json package-lock.json ./

# Installation des dépendances (y compris devDependencies pour le build)
RUN npm ci

# Copie du reste du projet
COPY . .

# Build l'application en production
ENV NODE_ENV=production
RUN npm run build

# Étape 2 : Runtime
FROM node:22-alpine AS runner

# Créer utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copie les fichiers de configuration
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Installation des dépendances de production seulement
RUN npm ci --omit=dev

# Copie les fichiers nécessaires au runtime
COPY --from=builder /app/public ./public
# Proprietaire nextjs : l'optimiseur ecrit son cache dans .next/cache/images,
# sinon chaque image optimisee echoue sur EACCES.
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Désactive l'exécution de shells
ENV SHELL=/bin/false

# Lancer l'app avec un utilisateur non-root
USER nextjs

# Lancement de l'app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "start"]
