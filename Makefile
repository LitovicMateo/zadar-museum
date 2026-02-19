SHELL := /bin/bash
.ONESHELL:

# Project root and compose detection
PROJECT_ROOT := $(CURDIR)
COMPOSE_CMD := docker-compose

DEV_COMPOSE := docker-compose.dev.yml
DEV_ENV := .env.dev
STAGING_COMPOSE := docker-compose.staging.yml
STAGING_ENV := .env.staging
PROD_COMPOSE := docker-compose.prod.yml
PROD_ENV := .env.prod


.PHONY: dev dev-stop dev-mv staging staging-stop prod prod-stop load-dev-backup import-dev-backup load-staging-backup import-staging-backup load-prod-backup import-prod-backup apply-mvs apply-mvs-staging apply-mvs-prod backup-dev backup-staging backup-prod help

help:
	@echo "Usage: make <target>"	@echo "Note: several targets forward flags to underlying scripts (e.g. apply-mvs accepts --env-file)"
	@echo "Script flags (when applicable): --compose-file FILE | --env-file FILE | --dry-run | --force | --backup"	@echo "Targets: dev dev-stop dev-mv staging staging-stop prod prod-stop backup-dev backup-staging backup-prod load-*-backup import-*-backup apply-mvs apply-mvs-staging apply-mvs-prod"

dev:
	docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build -d --no-deps --force-recreate
dev-logs-backend:
	docker-compose -f docker-compose.dev.yml logs --follow --tail=30 backend
dev-logs-postgres:
	docker-compose -f docker-compose.dev.yml logs --follow --tail=30 postgres
dev-logs-frontend:
	docker-compose -f docker-compose.dev.yml logs --follow --tail=30 frontend
dev-stop:
	$(COMPOSE_CMD) -f $(DEV_COMPOSE) --env-file $(DEV_ENV) down

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
	$(COMPOSE_CMD) -f $(STAGING_COMPOSE) --env-file $(STAGING_ENV) up --build -d --no-deps --force-recreate

staging-stop:
	$(COMPOSE_CMD) -f $(STAGING_COMPOSE) --env-file $(STAGING_ENV) down

prod:
	@if [ ! -f "$(PROD_ENV)" ]; then echo "Error: $(PROD_ENV) not found. Create it from .env.prod.example or provide env vars in CI/VPS."; exit 1; fi
	$(COMPOSE_CMD) -f $(PROD_COMPOSE) --env-file $(PROD_ENV) up --build -d --no-deps --force-recreate

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

load-prod-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(PROD_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the prod stack running?)"; exit 1; fi; \
	echo "using container: $$CONTAINER"; \
	docker cp "$(PROJECT_ROOT)/zadar-backup.sql" "$$CONTAINER":/tmp/zadar-backup.sql

import-prod-backup:
	@CONTAINER=$$($(COMPOSE_CMD) -f $(PROD_COMPOSE) ps -q postgres); \
	if [ -z "$$CONTAINER" ]; then echo "No postgres container found (is the prod stack running?)"; exit 1; fi; \
	docker exec -i "$$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; psql -U strapi -d strapi -f /tmp/zadar-backup.sql"