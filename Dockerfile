FROM node:20.18.1-alpine AS base

# Instalar las dependencias de sistema
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./
# instalar dependencias usando npm ci
RUN npm ci


#Build the Nextjs app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


# Production image, we have everything in order and we can run the next app
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiando los archivos necesarios para correr nextjs en produccion
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run utiliza ese puerto por defecto
EXPOSE 8080

ENV PORT=8080

ENV HOSTNAME="0.0.0.0"
# Comando ejecucion
CMD ["node", "server.js"]

