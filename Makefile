SHELL := /bin/bash
.ONESHELL:

# Project root and compose detection
PROJECT_ROOT := $(CURDIR)
COMPOSE_CMD := $(shell command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo docker compose)

DEV_COMPOSE := docker-compose.dev.yml
DEV_ENV := .env.dev
STAGING_COMPOSE := docker-compose.staging.yml
STAGING_ENV := .env.staging
PROD_COMPOSE := docker-compose.prod.yml
PROD_ENV := .env.prod


.PHONY: dev dev-stop dev-mv dev-enable-unaccent staging staging-stop prod prod-stop load-dev-backup import-dev-backup restore-dev-from-vps load-staging-backup import-staging-backup load-prod-backup import-prod-backup apply-mvs apply-mvs-staging apply-mvs-prod list-mvs list-mvs-prod backup-dev backup-staging backup-prod backup-prod-full restore-prod install-backup-timer help

help:
	@echo "Usage: make <target>"	@echo "Note: several targets forward flags to underlying scripts (e.g. apply-mvs accepts --env-file)"
	@echo "Script flags (when applicable): --compose-file FILE | --env-file FILE | --dry-run | --force | --backup"	@echo "Targets: dev dev-stop dev-mv staging staging-stop prod prod-stop backup-dev backup-staging backup-prod load-*-backup import-*-backup apply-mvs apply-mvs-staging apply-mvs-prod"

dev:
	$(COMPOSE_CMD) -f docker-compose.dev.yml --env-file .env.dev up --build -d --no-deps --force-recreate
dev-logs-backend:
	$(COMPOSE_CMD) -f docker-compose.dev.yml logs --follow --tail=30 backend
dev-logs-postgres:
	$(COMPOSE_CMD) -f docker-compose.dev.yml logs --follow --tail=30 postgres
dev-logs-frontend:
	$(COMPOSE_CMD) -f docker-compose.dev.yml logs --follow --tail=30 frontend
dev-stop:
	$(COMPOSE_CMD) -f $(DEV_COMPOSE) --env-file $(DEV_ENV) down
dev-enable-unaccent:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(DEV_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" psql -U strapi -d strapi -c "CREATE EXTENSION IF NOT EXISTS unaccent;"

dev-mv:
	@POSTGRES_CTR=$$($(COMPOSE_CMD) -f $(DEV_COMPOSE) ps -q postgres); \
	if [ -z "$$POSTGRES_CTR" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	NET=$$(docker inspect -f '{{range $$k,$$v := .NetworkSettings.Networks}}{{$$k}}{{end}}' "$$POSTGRES_CTR" | awk '{print $$1}'); \
	echo "Running apply-mvs.js in temporary node container on network: $$NET"; \
	docker run --rm \
		-v "$(PROJECT_ROOT)":/app \
		-w /app/backend \
		--network "$$NET" \
		node:20-alpine \
		sh -lc 'npm ci --production && export DATABASE_HOST=postgres && export DATABASE_PORT=5432 && export DATABASE_USERNAME=$${DATABASE_USERNAME:-strapi} && export DATABASE_PASSWORD=$${DATABASE_PASSWORD:-strapi_password_change_me} && export DATABASE_NAME=$${DATABASE_NAME:-strapi} && node ./scripts/apply-mvs.js --refresh --concurrent'

staging:
	$(COMPOSE_CMD) -f $(STAGING_COMPOSE) --env-file $(STAGING_ENV) pull --ignore-buildable
	$(COMPOSE_CMD) -f $(STAGING_COMPOSE) --env-file $(STAGING_ENV) up --build -d --no-deps --force-recreate

staging-stop:
	$(COMPOSE_CMD) -f $(STAGING_COMPOSE) --env-file $(STAGING_ENV) down

prod:
	@if [ ! -f "$(PROD_ENV)" ]; then echo "Error: $(PROD_ENV) not found. Create it from .env.prod.example or provide env vars in CI/VPS."; exit 1; fi
	$(COMPOSE_CMD) -f $(PROD_COMPOSE) --env-file $(PROD_ENV) pull
	$(COMPOSE_CMD) -f $(PROD_COMPOSE) --env-file $(PROD_ENV) up -d --no-deps --force-recreate

prod-stop:
	$(COMPOSE_CMD) -f $(PROD_COMPOSE) --env-file $(PROD_ENV) down

load-dev-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(DEV_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp "$(PROJECT_ROOT)/zadar-backup.sql" "$$CONTAINER":/tmp/zadar-backup.sql

import-dev-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(DEV_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"

## Restore the latest backup from backups/vps/ into the running dev stack
restore-dev-from-vps:
	bash scripts/backups/restore-dev-from-vps.sh

load-staging-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(STAGING_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the staging stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp "$(PROJECT_ROOT)/zadar-backup.sql" "$$CONTAINER":/tmp/zadar-backup.sql

import-staging-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(STAGING_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the staging stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"

apply-mvs:
	bash scripts/apply-mvs.sh --compose-file $(DEV_COMPOSE) --env-file $(DEV_ENV)

apply-mvs-staging:
	bash scripts/apply-mvs.sh --compose-file $(STAGING_COMPOSE) --env-file $(STAGING_ENV)

apply-mvs-prod:
	bash scripts/apply-mvs.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV)

# List materialized views in the running dev/prod postgres (excludes system schemas)
list-mvs:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(DEV_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the dev stack running?)"; exit 1; fi; \
	DB_USER=$$(grep -E '^(POSTGRES_USER|DATABASE_USERNAME)=' $(DEV_ENV) 2>/dev/null | head -n1 | sed -E 's/^[^=]+=//'); \
	DB_NAME=$$(grep -E '^(POSTGRES_DB|DATABASE_NAME)=' $(DEV_ENV) 2>/dev/null | head -n1 | sed -E 's/^[^=]+=//'); \
	docker exec -i "$$CONTAINER" psql -U "$${DB_USER:-strapi}" -d "$${DB_NAME:-strapi}" -c \
	  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2;"

list-mvs-prod:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(PROD_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the prod stack running?)"; exit 1; fi; \
	DB_USER=$$(grep -E '^(POSTGRES_USER|DATABASE_USERNAME)=' $(PROD_ENV) 2>/dev/null | head -n1 | sed -E 's/^[^=]+=//'); \
	DB_NAME=$$(grep -E '^(POSTGRES_DB|DATABASE_NAME)=' $(PROD_ENV) 2>/dev/null | head -n1 | sed -E 's/^[^=]+=//'); \
	docker exec -i "$$CONTAINER" psql -U "$${DB_USER:-strapi}" -d "$${DB_NAME:-strapi}" -c \
	  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2;"

# Backups: produce zadar-backup.sql (hyphen) to match existing load/import targets
backup-dev:
	@echo "Creating dev backup -> $(PROJECT_ROOT)/zadar-backup.sql"; \
	./scripts/pg_backup.sh --compose-file $(DEV_COMPOSE) --env-file $(DEV_ENV) --output "$(PROJECT_ROOT)/zadar-backup.sql"

backup-staging:
	@echo "Creating staging backup -> $(PROJECT_ROOT)/zadar-backup.sql"; \
	./scripts/pg_backup.sh --compose-file $(STAGING_COMPOSE) --env-file $(STAGING_ENV) --output "$(PROJECT_ROOT)/zadar-backup.sql"

backup-prod:
	@echo "Creating prod backup -> $(PROJECT_ROOT)/zadar-backup.sql"; \
	./scripts/pg_backup.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV) --output "$(PROJECT_ROOT)/zadar-backup.sql"

# Full prod backup (timestamped DB + uploads with retention) -> backups/prod/
backup-prod-full:
	./scripts/backups/backup.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV) --output-dir backups/prod

# Restore latest backups/prod/ pair into the running prod stack
restore-prod:
	./scripts/backups/restore.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV) --backup-dir backups/prod

load-prod-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(PROD_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the prod stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp "$(PROJECT_ROOT)/zadar-backup.sql" "$$CONTAINER":/tmp/zadar-backup.sql

import-prod-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(PROD_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the prod stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"
# Install the systemd timer that runs backup.sh every 2 days (run on the VPS)
install-backup-timer:
	@sed 's|__PROJECT_ROOT__|$(PROJECT_ROOT)|g' scripts/backups/systemd/zadar-backup.service | sudo tee /etc/systemd/system/zadar-backup.service >/dev/null
	@sudo cp scripts/backups/systemd/zadar-backup.timer /etc/systemd/system/zadar-backup.timer
	@sudo systemctl daemon-reload
	@sudo systemctl enable --now zadar-backup.timer
	@echo "Installed. Verify with: systemctl list-timers zadar-backup.timer"
