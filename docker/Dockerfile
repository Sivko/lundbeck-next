# ===== STAGE 1: Build stage =====
FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ===== STAGE 2: Production stage =====
FROM node:18-alpine AS runner

WORKDIR /app

# Если pnpm нужен на рантайме:
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts \
  && pnpm store prune \
  && rm -rf /root/.cache

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.production ./.env.production

CMD ["pnpm", "start"]