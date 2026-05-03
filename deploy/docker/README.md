# Docker deployment

This project is now split into three deployable services:

- `db`: MySQL 8.0 with an initialization schema
- `api`: FastAPI backend
- `frontend`: React app served by Nginx

## Service split

### 1. Database service

Responsible for:

- persistent MySQL data
- schema bootstrap from `deploy/docker/mysql-init/00_schema.sql`

### 2. API service

Responsible for:

- authentication
- matching
- messages
- notifications
- stats and search

Runtime variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `JWT_SECRET`
- `CORS_ORIGINS`

### 3. Frontend service

Responsible for:

- serving the React SPA
- injecting `API_BASE_URL` at container startup

Runtime variables:

- `API_BASE_URL`

## Full stack on one VM

Start everything together from the repository root:

```bash
docker compose up -d --build
```

Default exposed ports:

- frontend: `8081`
- api: `8000`
- mysql: `3307` on the host, `3306` inside the Docker network

Optional variables can be supplied through the shell or a compose env file.
See `deploy/docker/.env.example`.

## Split across multiple VMs

### VM 1: database

```bash
docker compose -f deploy/docker/vm/docker-compose.db.yml --env-file deploy/docker/vm/db.env.example up -d
```

### VM 2: API

Point the API to the database VM:

```bash
docker compose -f deploy/docker/vm/docker-compose.api.yml --env-file deploy/docker/vm/api.env.example up -d --build
```

### VM 3: frontend

Point the frontend to the API VM:

```bash
docker compose -f deploy/docker/vm/docker-compose.frontend.yml --env-file deploy/docker/vm/frontend.env.example up -d --build
```

## Recommended VM topology

- DB VM on a private network
- API VM allowed to reach MySQL on `3306`
- Frontend VM allowed to reach API on `8000`
- Browser traffic exposed only on frontend VM

## Important notes

- Change all default passwords before production use.
- Replace IPs in the `vm/*.env.example` files with your real VM addresses or DNS names.
- Set `CORS_ORIGINS` to the real frontend URL(s).
- Set a strong `JWT_SECRET` in production.
