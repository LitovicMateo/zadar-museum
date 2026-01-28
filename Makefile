dev:
	docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build -d
dev-stop:
	docker-compose -f docker-compose.dev.yml --env-file .env.dev down
staging:
	docker-compose -f docker-compose.staging.yml --env-file .env.staging up --build -d --no-deps --force-recreate
staging-stop:
	docker-compose -f docker-compose.staging.yml --env-file .env.staging down

load-dev-backup:
	@CONTAINER=$$(docker compose -f docker-compose.dev.yml ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp /home/litovic/projects/zadar-museum/zadar-backup.sql "$$CONTAINER":/tmp/zadar-backup.sql

import-dev-backup:
	@CONTAINER=$$(docker compose -f docker-compose.dev.yml ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"

load-staging-backup:
	@CONTAINER=$$(docker compose -f docker-compose.staging.yml ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the staging stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp /home/litovic/projects/zadar-museum/zadar-backup.sql "$$CONTAINER":/tmp/zadar-backup.sql

import-staging-backup:
	@CONTAINER=$$(docker compose -f docker-compose.staging.yml ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the staging stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"