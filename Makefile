dev:
	docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build -d
staging:
	docker-compose -f docker-compose.staging.yml --env-file .env.staging up --build -d

load-backup:
	CONTAINER=$(docker compose -f docker-compose.dev.yml ps -q postgres)
	echo "using container: $CONTAINER"
	docker cp /home/litovic/projects/zadar-museum/zadar-backup.sql "$CONTAINER":/tmp/zadar-backup.sql

import-backup:
	docker exec -i "$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"