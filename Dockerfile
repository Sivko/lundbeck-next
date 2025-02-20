# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Копируем весь проект
COPY . .

# Сборка Next.js
RUN pnpm build

# Запуск Next.js
CMD ["pnpm", "start"]