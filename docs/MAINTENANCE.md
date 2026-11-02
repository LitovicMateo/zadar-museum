# Maintenance Guide

How to run, update, back up and recover the Zadar Basketball Museum app on your own.

> **No secrets live in this file.** Passwords, JWT secrets and the VPS IP are deliberately not written here. Section 2 lists *where each one lives* and what to keep in your password manager. Never commit real credentials to git.

---

## 1. Big picture

| Piece | Tech | Where |
|-------|------|-------|
| Frontend | React + Vite, served by nginx in a container | `frontend/` |
| Backend / CMS | Strapi 5 (Node) | `backend/` |
| Database | PostgreSQL 15 (+ materialized views from `sql/Layer 1/`) | container `postgres_prod` |
| Cache | Redis 7 (keys prefixed `app:*`, cached 24h) | container `redis_prod` |
| Reverse proxy + TLS | nginx + certbot (Let's Encrypt, auto-renew) | `nginx/nginx.prod.conf` |
| Images | Built by GitHub Actions, stored in GHCR | `ghcr.io/litovicmateo/zadar-museum-{backend,frontend}:latest` |

Production domain: `ovdjejekosarkasve.com` (and `www.`).

Production containers (from `docker-compose.prod.yml`): `postgres_prod`, `redis_prod`, `strapi_prod`, `react_prod`, `nginx_prod`, `certbot`.

Data that matters (back these up): the **`postgres_prod_data`** volume (all content) and the **`strapi_uploads`** volume (photos/videos).

### How a change reaches production

```
local branch (development)
   │  merge / PR
   ▼
staging branch ──push──► GitHub Actions builds + validates ──► pushes :latest images to GHCR
                                                                   │
VPS: make backup-prod-full → git pull → make prod (pulls :latest, recreates containers)
```

Key facts:
- CI (`.github/workflows/publish-*.yml`) triggers on **push to `staging`** only, and only when files under `backend/**` or `frontend/**` changed.
- CI runs `npm ci && npm run build` first. **If the build fails, no image is published** and prod keeps running the old one.
- Prod pulls the `:latest` tag. Each image is also tagged with the commit SHA (`:<sha>`), which is how you roll back.
- Nothing is built on the VPS. Deploy = pull images + recreate containers.

---

## 2. Credentials and access checklist

Fill in the "Where it lives" column for yourself and store the values in a password manager (Bitwarden, 1Password, KeePass...). Keep an **offline copy** of the production `.env.prod` too — if the VPS dies, you cannot rebuild without those secrets (especially `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`).

| What | Where it lives | Notes |
|------|----------------|-------|
| VPS provider account | Provider website (name: ______ ) | Needed for console access, rebooting, snapshots, billing. Enable 2FA. |
| VPS IP / hostname | `91.98.47.143` (host `ubuntu-zadar-museum`) | Verified 2026-11-02. Domain `ovdjejekosarkasve.com` also points at it. |
| VPS SSH user | `root`, repo at `/root/zadar-museum` | Verified 2026-11-02. |
| SSH private key | `~/.ssh/zadar_ed25519` on your computer (`id_ed25519` is NOT accepted by this server) | **Back it up.** Lose it and you need the provider console to get back in. |
| Domain registrar account | Registrar website (name: ______ ) | DNS + renewal. Domain expiry = site down. |
| GitHub account `LitovicMateo` | github.com | Repo `LitovicMateo/zadar-museum`. Enable 2FA. |
| GHCR (container registry) | Same GitHub account | CI pushes with the built-in `GITHUB_TOKEN`; no extra secret needed for CI. If the packages are private, the VPS must be `docker login ghcr.io` with a Personal Access Token that has `read:packages`. |
| `.env.prod` | **On the VPS only**, in the repo root (git-ignored) | Template: `.env.prod.example`. Holds DB password and Strapi secrets. |
| Strapi admin login | Strapi admin UI: `https://ovdjejekosarkasve.com/admin` | Create/reset admins with the CLI (section 9). |
| App (frontend) login | `/login` on the site | Any Strapi user can write; there are no per-role permissions. |
| Postgres user/password | `.env.prod` (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) | Only reachable inside the Docker network; not exposed publicly. |

### Environment files at a glance

| File | Purpose | Committed? |
|------|---------|-----------|
| `.env.dev` | local dev stack | present locally |
| `.env.staging` | staging stack | present locally |
| `.env.prod` | production on the VPS | **never** (git-ignored); copy from `.env.prod.example` |

---

## 3. Getting into the VPS (SSH)

### First-time setup on your computer

1. The key pair is `~/.ssh/zadar_ed25519` (+ `.pub`). If you ever need a new one:
   ```bash
   ssh-keygen -t ed25519 -C "your-email"
   ```
2. Add the **public** key (`~/.ssh/id_ed25519.pub`) to the VPS (provider dashboard, or `ssh-copy-id user@host` while you still have another way in).
3. Add a shortcut to `~/.ssh/config` so you can type `ssh zadar`:
   ```
   Host zadar
       HostName 91.98.47.143
       User root
       IdentityFile ~/.ssh/zadar_ed25519
       IdentitiesOnly yes
   ```

### Connecting

```bash
ssh zadar
cd /root/zadar-museum      # or wherever the repo is checked out — confirm with: ls
```

### If you cannot SSH in

- Wrong key / lost key: use the **web console / VNC / rescue mode** in your VPS provider dashboard, log in with the provider's root password reset, then add a new public key to `~/.ssh/authorized_keys`.
- Connection timeout: check the VPS is running in the provider dashboard and that the provider/OS firewall allows port 22.
- Host key warning after a rebuild: `ssh-keygen -R <VPS_IP>` and reconnect (only if you are sure you rebuilt the server).

### Basic server health

```bash
docker ps                      # all 6 prod containers should be "Up"/"healthy"
df -h                          # disk usage (watch /, Docker volumes, backups/)
free -h                        # memory
docker stats --no-stream       # per-container CPU/RAM
```

---

## 4. Deploying an update (the normal workflow)

### 4.1 On your computer

Work on a feature branch or `development`, test locally (section 7), then:

```bash
git checkout staging
git merge development            # or merge your feature branch
cd frontend && npm run build     # optional but catches the same failure CI would
cd ../backend && npm run build
cd ..
git push origin staging
```

Pushing to `staging` triggers GitHub Actions. Watch it at
`https://github.com/LitovicMateo/zadar-museum/actions` (or `gh run watch`).
Wait for a **green check** on both workflows you expect (frontend if `frontend/**` changed, backend if `backend/**` changed).

> If CI is red, read the failing step's log, fix, push again. Nothing reaches prod until an image is published.

Also merge to `main` when you want the repo/compose files on the VPS to be current (the VPS does `git pull origin main`):

```bash
git checkout main && git merge staging && git push origin main
```

### 4.2 On the VPS

```bash
ssh zadar
cd /root/zadar-museum
make backup-prod-full            # ALWAYS first
git pull origin main             # compose files, scripts, SQL
make prod                        # pull :latest images + recreate containers
docker ps                        # confirm everything is Up/healthy
```

If you only changed one side, you can recreate just that service:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull frontend
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --no-deps --force-recreate frontend
```
(use `backend` instead of `frontend` for backend-only changes).

### 4.3 If the change touched SQL / materialized views

`apply-mvs` **skips views that already exist**, so an edited view definition is *not* applied automatically.

```bash
make apply-mvs-prod                       # create missing views
# refresh data in existing views:
bash scripts/apply-mvs.sh --compose-file docker-compose.prod.yml --env-file .env.prod --help   # see flags
```
To force-recreate changed definitions use `--force` (drops and recreates the views). Take a backup first.

One-off data/schema migrations live in `sql/migrations/` and must be run by hand. See the `PRODUCTION_MIGRATION_*.md` files in the repo root for step-by-step instructions on the migrations already written (period format, final score).

### 4.4 After deploying: flush the cache

Aggregations are cached in Redis for 24 h. If you changed an aggregation query, the old result keeps being served until the keys expire:

```bash
docker exec redis_prod redis-cli --scan --pattern 'app:*' | xargs -r docker exec -i redis_prod redis-cli del
```

(Redis has persistence disabled, so `docker restart redis_prod` also clears everything.)

### 4.5 Smoke test

- Open `https://ovdjejekosarkasve.com`, click through a player, a team, a stats table.
- Log in at `/login`, open a create/edit form.
- Check `https://ovdjejekosarkasve.com/admin` loads.
- `docker logs --tail 50 strapi_prod` shows no repeating errors.

---

## 5. Rolling back a bad deploy

Every CI build pushes an image tagged with its commit SHA. To go back:

1. Find the last good SHA: GitHub → repo → Packages → `zadar-museum-backend` / `-frontend`, or `git log`.
2. On the VPS, edit `docker-compose.prod.yml` and temporarily change `:latest` to `:<good-sha>` for the affected service.
3. ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --no-deps --force-recreate backend
   ```
4. Fix the problem on `staging`, push, wait for CI, then revert the compose edit (`git checkout docker-compose.prod.yml`) and `make prod`.

If the database was damaged (bad migration), restore the backup you took before deploying (section 6).

---

## 6. Backups and restore

Backups (DB dump + uploads archive) go to `backups/prod/` on the VPS; the newest 5 of each are kept.

```bash
make backup-prod-full      # manual backup
make restore-prod          # restore the NEWEST pair into the running prod stack (overwrites current data!)
```

Automatic backups every 2 days (install once on the VPS):

```bash
make install-backup-timer
systemctl list-timers zadar-backup.timer      # confirm it is scheduled
journalctl -u zadar-backup.service -n 50      # last run's output
```

### Off-site copy (important)

Backups sit on the same disk as the app. If the VPS is lost, they are lost. Regularly copy them to your computer:

```bash
scp -r zadar:/root/zadar-museum/backups/prod ./zadar-backups-$(date +%F)
```

Also keep a copy of `.env.prod` (password manager) and consider enabling automatic **snapshots** in your VPS provider dashboard.

### Pulling prod data into your local dev DB

```bash
make restore-dev-from-vps          # uses backups/vps/ (put a downloaded backup pair there first)
```
or the manual dump/scp/import flow documented in `README.md` ("Copying production data to your machine"). Croatian characters (š, ć, đ) break if the dump is re-encoded — use the provided Make targets, not PowerShell redirects.

---

## 7. Running locally

Prerequisites: Docker (+ Compose), Node 20+, Git.

```bash
make dev                 # postgres + backend + frontend + pgAdmin
make dev-logs-backend    # tail backend logs
make dev-stop
make dev-mv              # apply/refresh materialized views on dev DB
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Strapi / API | http://localhost:1337 (admin at `/admin`) |
| pgAdmin | http://localhost:5051 |

Gotchas:
- Under WSL2 mounts, Strapi does **not** hot-reload backend edits — restart the container after changing backend code: `docker compose -f docker-compose.dev.yml --env-file .env.dev restart backend`.
- Redis caches aggregations for 24 h; flush `app:*` keys after changing a cached query (see 4.4, using the dev Redis container).

Tests / checks:

```bash
cd frontend && npm run lint && npm test && npm run build
cd backend  && npm test && npm run build
```

Staging (`make staging`, `.env.staging`, `docker-compose.staging.yml`) is a copy of the stack that pulls the same GHCR images; use it to rehearse a deploy or migration before touching prod. `make restore-staging` rebuilds staging from `zadar-backup.sql`.

---

## 8. Routine maintenance checklist

**Every deploy:** back up first, check CI is green, smoke test after.

**Weekly / monthly:**
- `ssh zadar` → `docker ps` (all healthy), `df -h` (disk not near full).
- Confirm the backup timer ran: `ls -lt backups/prod | head`. Copy the latest off-site.
- Free disk when needed (does not touch volumes): `docker image prune -a -f`.
- OS security updates: `apt update && apt upgrade -y`, then `reboot` if the kernel updated. Afterwards check `docker ps` (containers have `restart: unless-stopped`, so they come back by themselves).

**Yearly:**
- Domain renewal at the registrar.
- Renew/verify VPS billing.
- Rotate the SSH key and the GitHub token if you have created any.

**SSL certificates** renew automatically (certbot loop every 12 h, nginx reload every 6 h). Verify:
```bash
echo | openssl s_client -connect ovdjejekosarkasve.com:443 -servername ovdjejekosarkasve.com 2>/dev/null | openssl x509 -noout -dates
```
If it expired / needs re-issuing from scratch, see "SSL certificates" in `README.deploy.md`.

---

## 9. Troubleshooting

| Symptom | Check / fix |
|---------|-------------|
| Site down entirely | `ssh zadar`; `docker ps -a`. Start the stack: `make prod`. Check `docker logs nginx_prod`. |
| 502 Bad Gateway | Backend not up: `docker logs --tail 100 strapi_prod`; `docker restart strapi_prod`. |
| nginx won't start | Cert files missing: check `./certbot/conf`. See SSL notes in `README.deploy.md`. |
| Browser says CORS error | `CORS_ORIGINS` in `.env.prod` must include the site origin; recreate backend: `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate backend`. |
| Stats look stale/wrong | Flush Redis `app:*` (4.4); if boxscore data looks wrong, refresh views (4.3). |
| Disk full | `docker image prune -a -f`; remove old files in `backups/prod/` after copying them off-site; `docker system df`. |
| Docker daemon metadata errors | `systemctl restart docker && sleep 3`. |
| Lost Strapi admin password | `docker exec -it strapi_prod npx strapi admin:reset-user-password --email you@example.com --password 'NewStrongPass'` |
| Need a DB shell | `docker exec -it postgres_prod psql -U <POSTGRES_USER> -d <POSTGRES_DB>` (values from `.env.prod`) |
| Upload files missing after rebuild | They are in the `strapi_uploads` volume; never run `docker compose down -v` on prod (deletes volumes). |
| VPS pull of image denied | `docker login ghcr.io -u LitovicMateo` with a PAT (`read:packages`). |

### Useful commands

```bash
docker logs -f --tail 100 strapi_prod        # live backend logs
docker logs --tail 100 nginx_prod
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
docker exec -it strapi_prod sh               # shell in backend container
make list-mvs-prod                           # list materialized views
```

### Dangerous commands (avoid on prod)

- `docker compose ... down -v` or `docker volume rm` — deletes the database / uploads.
- `make apply-mvs-prod` with `--force` — drops and recreates views; back up first.
- `make restore-prod` — overwrites current data with a backup.
- `git reset --hard` on the VPS repo — can discard local fixes such as `.env.prod` edits if they are tracked (they are not, but check first).

---

## 10. Rebuilding the server from scratch (disaster recovery)

1. Create a new VPS (Ubuntu LTS), add your SSH key, point the domain's DNS A record to the new IP.
2. Install Docker + Compose plugin, `git`, `make`.
3. `git clone https://github.com/LitovicMateo/zadar-museum.git && cd zadar-museum`
4. Put your saved `.env.prod` in the repo root.
5. `docker login ghcr.io` (only if the images are private).
6. Issue SSL certificates (procedure in `README.deploy.md`, "SSL certificates").
7. Copy your latest backup pair into `backups/prod/`, start the stack with `make prod`, then `make restore-prod`.
8. `make apply-mvs-prod`, flush Redis, smoke test (4.5).
9. Reinstall the backup timer: `make install-backup-timer`.

---

## 11. Related docs

- `README.md` — overview, Make targets, backup/restore details
- `README.deploy.md` — VPS deploy, MV runner, SSL re-issuance
- `README.local.md` — running sub-projects outside Docker
- `CLAUDE.md` — architecture reference
- `PRODUCTION_MIGRATION_*.md` — one-off prod migration runbooks
