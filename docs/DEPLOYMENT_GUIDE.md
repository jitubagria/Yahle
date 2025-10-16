# Deployment guide — Yahle backend

This guide documents building and deploying the Yahle backend using Docker and GitHub Actions.

## Build & run (production)

1. Build and push container (CI will automate this):

- Local build (production tag):

```bash
DOCKER_BUILDKIT=1 docker build -t ghcr.io/<owner>/yahle:latest .
```

2. Run with docker-compose.prod.yml (example):

```bash
# create .env with JWT_SECRET and other secrets
export JWT_SECRET=supersecret
docker compose -f docker-compose.prod.yml up -d
```

## Environment variables

- DATABASE_HOST (db hostname)
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME
- JWT_SECRET
- NODE_ENV=production
- PORT (default 3000)

## GitHub Actions (GHCR) — minimal CI snippet

Add to `.github/workflows/deploy.yml`:

```yaml
name: CI Build and Push
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - name: Install
        run: npm ci
      - name: Build
        run: npm run build || true
      - name: Log in to GHCR
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/yahle:latest
```

## Notes

- Ensure DB migrations are applied before starting the app in production. Add drizzle-kit or migration toolchain.
- Store secrets in GitHub Secrets and do not check them into repo.
