# ===== STAGE 1: Build stage =====
FROM node:18-alpine AS builder

WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем lock-файлы и устанавливаем зависимости
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Копируем остальные файлы и билдим
COPY . .
RUN pnpm build

# ===== STAGE 2: Production stage =====
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем только нужные файлы
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Копируем собранный проект
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["pnpm", "start"]