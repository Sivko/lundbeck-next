#!/bin/bash

# Переходим в директорию, где находится сам скрипт
cd "$(dirname "$0")"

SERVER_IP=217.114.14.93
KEY_PATH="~/.ssh/id_rsa" 

cd ../

ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'EOF'
find /root/docker \
  ! -path /root/docker/traefik/acme.json \
  ! -path /root/docker/traefik \
  ! -path /root/docker \
  -delete
EOF


EXCLUDE_FILE=""
if ssh -i "$KEY_PATH" root@$SERVER_IP [ -f /root/docker/traefik/acme.json ]; then
  EXCLUDE_FILE="--exclude 'docker/traefik/acme.json'"
fi

rsync -avz \
  -e "ssh -i $KEY_PATH" \
  $EXCLUDE_FILE \
  ./docker/ \
  root@$SERVER_IP:/root/docker


ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'EOF'
cd /root/docker
docker compose up -d --remove-orphans
docker compose restart nginx
# Очищаем неиспользуемые (контейнеры, сети, образы, volumes):
docker system prune -a -f --volumes
EOF