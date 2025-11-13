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
