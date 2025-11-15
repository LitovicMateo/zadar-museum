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

## Read all Materialized Views in Postgres VSP

```
docker-compose -f docker-compose.vps.yml exec -T postgres \
  psql -U "strapi_prod" -d "strapi_prod" -c \
  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname, matviewname;"

```

## Recreate images

```
# check images
docker ps -a

# remove images
docker rm -f <container_id>

# pull new images
docker-compose -f docker-compose.vps.yml pull frontend
docker-compose -f docker-compose.vps.yml pull backend
docker-compose -f docker-compose.vps.yml pull frontend backend


# recreate images
 docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate frontend
 docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate backend
 docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate frontend backend

```

## Execute MVs

```
POSTGRES_CTR=$(docker-compose -f docker-compose.vps.yml ps -q postgres)
NET=$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' "$POSTGRES_CTR" | awk '{print $1}')
echo "postgres container: $POSTGRES_CTR"
echo "compose network: $NET"

docker run --rm \
  -v "$(pwd)":/app \
  -w /app/backend \
  --network "$NET" \
  node:20 bash -lc "npm ci --production && \
    export DATABASE_HOST=postgres && \
    export DATABASE_PORT=5432 && \
    export DATABASE_USERNAME=strapi_prod && \
    export DATABASE_PASSWORD='STRONG_PASSWORD_HERE' && \
    export DATABASE_NAME=strapi_prod && \
    node ./scripts/apply-mvs.js"

```

## Refresh player's views

```
cd ~/zadar-museum
git pull origin main
./refresh_player_views.sh
```
