SERVER_IP=217.114.14.93
KEY_PATH="~/.ssh/id_rsa" 

# Установка Docker
ssh root@$SERVER_IP 'apt install docker.io '
ssh root@$SERVER_IP 'mkdir -p ~/.docker/cli-plugins/'
ssh root@$SERVER_IP 'curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose'
ssh root@$SERVER_IP 'chmod +x ~/.docker/cli-plugins/docker-compose'
ssh root@$SERVER_IP 'sudo mkdir -p /usr/lib/docker/cli-plugins'
ssh root@$SERVER_IP 'sudo mv ~/.docker/cli-plugins/docker-compose /usr/lib/docker/cli-plugins/'
ssh root@$SERVER_IP 'sudo chmod +x /usr/lib/docker/cli-plugins/docker-compose'
ssh root@$SERVER_IP 'docker compose version'