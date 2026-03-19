# Multi-stage Docker build for Next.js standalone
FROM node:20-alpine AS base
RUN apk add --no-cache openssl

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci && npx prisma generate

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Create empty SQLite database during build
ENV DATABASE_URL="file:/app/build.db"
RUN npx prisma generate && npx prisma db push && npm run build

# --- Production ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/build.db /app/seed.db

# Copy prisma engine for runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
ENV DATABASE_URL="file:/app/data/prod.db"

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy seed DB if prod.db doesn't exist, then start
CMD ["sh", "-c", "if [ ! -f /app/data/prod.db ]; then cp /app/seed.db /app/data/prod.db; fi && node server.js"]
