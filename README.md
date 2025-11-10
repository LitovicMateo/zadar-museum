# zadar-basketball-museum

cd /root/zadar-museum

# stop and remove specific containers created by the stack

docker rm -f nginx_prod react_prod strapi_prod certbot postgres_prod 2>/dev/null || true

# restart docker engine (if you saw odd metadata errors)

systemctl restart docker
sleep 3

# optionally remove dangling images to free space (non-destructive to volumes)

docker image prune -a -f

# recreate services (pull first if you want freshest images)

docker-compose -f docker-compose.vps.yml pull
docker-compose -f docker-compose.vps.yml up -d --force-recreate
