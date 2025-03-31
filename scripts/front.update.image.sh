#!/bin/bash

# Переходим в директорию, где находится сам скрипт
cd "$(dirname "$0")"

# Теперь все относительные пути работают как ожидается
cd ../

docker build --platform linux/amd64 -f docker/Dockerfile -t nextjs:latest .

docker save nextjs:latest -o nextjs.tar     
scp -o StrictHostKeyChecking=no nextjs.tar root@217.114.14.93:/root/docker/

ssh -o StrictHostKeyChecking=no root@217.114.14.93 << 'EOF'
cd /root/docker

# Удаляем временный контейнер, если он остался
if [ "$(docker ps -a -q -f name=nextjs_temp)" ]; then
  docker rm -f nextjs_temp
fi

# Импортируем новый образ
docker load -i nextjs.tar

# Запускаем временный контейнер для проверки
docker run -d --name nextjs_temp -p 3100:3000 nextjs:latest

# Дожидаемся запуска контейнера
echo "Ожидание запуска временного контейнера..."
sleep 5

# Проверка здоровья
echo "Проверка здоровья через /api/health..."
if curl -s --fail http://localhost:3100/api/health > /dev/null; then
  echo "✅ Новый образ работает корректно. Обновляем основной контейнер."

  # Останавливаем и удаляем старый контейнер, если есть
  if [ "$(docker ps -a -q -f name=nextjs)" ]; then
    docker stop nextjs
    docker rm nextjs
  fi

  # Запускаем новый контейнер через docker compose
  docker compose up -d --force-recreate --no-deps nextjs

else
  echo "❌ Проверка здоровья не пройдена. Обновление отменено."
fi

# Удаляем временный контейнер
docker rm -f nextjs_temp

# Чистим систему
docker system prune -af
EOF