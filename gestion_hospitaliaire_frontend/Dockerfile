# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./

# Installer toutes les dépendances (y compris devDependencies)
RUN npm ci

# Copier le reste du code
COPY . .

# Variables d'environnement pour le build
ENV NEXT_IGNORE_ESLINT=1
ENV NEXT_TELEMETRY_DISABLED=1

# Build de l'application
RUN npm run build

# Étape de production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]