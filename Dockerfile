FROM dhi.io/node:22.22.3-alpine3.23-dev AS deps
WORKDIR /app

# Install dependencies based on lockfile
COPY package.json package-lock.json* ./
RUN npm ci


FROM dhi.io/node:22.22.3-alpine3.23-dev AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma v7 may require DATABASE_URL to exist for "prisma generate"
# Use a non-secret placeholder (no real password)
ENV DATABASE_URL="postgresql://user:pass@127.0.0.1:5432/db?schema=public"

RUN npx prisma generate
RUN npm run build


FROM dhi.io/node:22.22.3-alpine3.23 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy Next.js standalone output
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# If you plan to run migrations at startup, also copy prisma folder:
COPY --from=builder --chown=node:node /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "server.js"]

