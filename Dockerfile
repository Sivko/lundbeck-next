# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Сборка Next.js
RUN npm run build

# Запуск Next.js
CMD ["npm", "run", "start"]