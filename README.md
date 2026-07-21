# AI Delivery Planner — Frontend

**Live demo:** [ai-planning-assistant.vercel.app](https://ai-planning-assistant.vercel.app/)

## 1. What this is

AI Delivery Planner is a SaaS tool for small and mid-size businesses that run their own local
deliveries — think couriers, distributors, and last-mile logistics teams who are still
planning routes by hand on a spreadsheet or a map.

**The problem it solves:** manually sequencing daily delivery stops across multiple drivers
and vehicles is slow, error-prone, and doesn't scale — planners spend hours every morning
figuring out who goes where, in what order, while still trying to respect customer time
windows, vehicle capacity, and driver working hours.

**What the product does about it:**
- A manager imports a delivery list (Excel/CSV upload or manual entry).
- An LLM (OpenAI) cleans up messy addresses, parses free-text notes into structured fields
  (priority, time windows), and flags likely duplicate entries — so bad input doesn't wreck
  the routing.
- Cleaned addresses are geocoded, and **Google OR-Tools** — not the LLM — solves the actual
  vehicle routing problem: optimized multi-driver routes that respect time windows,
  priorities, vehicle capacity, and driver hours.
- The result is shown on an interactive map with a stop-by-stop timeline, and each stop can
  open directly in Google Maps navigation for the driver.
- An AI chat assistant lets a manager ask questions about a route ("why is this stop last?")
  and request AI-assisted replanning mid-day when something changes (a delay, a cancelled
  stop, an unreachable customer).

**Business value:**
- **Hours of manual planning collapse into minutes** — routes are generated automatically
  instead of sequenced by hand.
- **Shorter, cheaper routes** — combinatorial optimization finds routes a human planner would
  typically miss, cutting distance and fuel spend.
- **Fewer late deliveries** — time windows, breaks, and driver hours are enforced by the
  solver, not by a dispatcher's memory.
- **Faster reaction to change** — mid-route disruptions get replanned via a chat message
  instead of a manual re-sequencing exercise.
- **Multi-tenant from day one** — every organization's deliveries, drivers, and routes are
  fully isolated, so the same deployment serves many customers.

This repo is the web UI: dashboard, deliveries table, drivers/vehicles/depots management, a
Google-Maps-based route view with timeline, and the AI chat/replanning panel.

## 2. Technology & infrastructure

### Frontend (this repo)
- **React 18 + TypeScript**, built with **Vite**
- **React Router** for routing
- **@tanstack/react-query** for server state/caching, **Axios** for HTTP
- **Zustand** for client state (auth session)
- **Tailwind CSS** for styling
- Google Maps JS API (`@types/google.maps`) for the route map
- **ESLint + typescript-eslint, Prettier** for linting/formatting; **Vitest + Testing Library**
  for tests
- **Deployment:** [Vercel](https://vercel.com) (this repo's live demo above), SPA rewrites
  configured in `vercel.json`

### Backend (sibling repo: `ai-delivery-planner-backend`)
- **FastAPI** (Python 3.12) + **Uvicorn**
- **PostgreSQL** via SQLAlchemy (async) + asyncpg, **Alembic** for migrations
- **Redis** + **Celery** for background/long-running jobs (route optimization, AI analysis)
- **JWT auth** (python-jose) + passlib/bcrypt
- **OpenAI API** for address cleanup, note parsing, duplicate detection, and the chat/replan
  assistant
- **Google OR-Tools** for the actual vehicle-routing optimization
- **Google Maps Geocoding API** for turning addresses into coordinates
- pandas/openpyxl for CSV/Excel import
- **Testing/linting:** pytest, pytest-asyncio, ruff
- **Deployment:** [Fly.io](https://fly.com) (Docker image, `flyctl deploy`), Postgres/Redis
  reachable via `DATABASE_URL`/`REDIS_URL`

### Infra (sibling repo: `ai-delivery-planner-infra`)
- `docker-compose` stack for local development: **PostgreSQL 16**, **Redis 7**, the FastAPI
  backend, a Celery worker, the Vite frontend, and an **nginx** reverse proxy tying them
  together behind one origin.
- No application code — just the glue (compose file, nginx config, cross-repo CI) that runs
  all three repos together locally.

### CI/CD
- Each app repo owns its own GitHub Actions pipeline:
  - **Frontend:** lint (`eslint`) + build (`tsc -b && vite build`) on every push/PR; Vercel
    deploys from the repo independently.
  - **Backend:** `ruff` + `pytest` on every push/PR, then `flyctl deploy` to Fly.io on push to
    `main`.
- The infra repo runs a separate build-validation workflow that checks out all three repos as
  siblings and proves `docker compose build` still succeeds end-to-end.

### High-level architecture

```
React (this repo)
  │  Axios, REST over HTTP
  ▼
FastAPI (backend, separate repo)
  │
  ├─ Service layer ─ Repository layer ─ PostgreSQL
  ├─ services.route_optimizer (Google OR-Tools)
  ├─ services.geocoding (Google Maps Geocoding API)
  ├─ services.ai (OpenAI: cleanup, parsing, chat, explanations)
  └─ Celery + Redis (background jobs)
```

This repo only talks to the backend over REST — it never touches the database directly. Code
here is organized feature-first (`features/<domain>/{components,api,types.ts}`, exposed via
`index.ts`), with domain-agnostic shared code under `components/shared`, `store`, `api`,
`utils`.

## 3. Running the project

### Just this frontend, against an already-running backend

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to point at the backend API
npm run dev
```

Other useful scripts:

```bash
npm run build     # typecheck + production build
npm run lint       # eslint
npm test           # vitest
```

### The full stack, locally, via the infra repo

Clone all three repos as **sibling** directories under one parent folder, using exactly these
names (the infra repo's `docker-compose.yml` references the others via relative paths):

```
some-parent-folder/
├── ai-delivery-planner-infra/
├── ai-delivery-planner-backend/
└── AI-Planning-Assistant/          (this repo)
```

Then, from `ai-delivery-planner-infra`:

```bash
cp .env.example .env
cp ../ai-delivery-planner-backend/.env.example ../ai-delivery-planner-backend/.env
cp ../AI-Planning-Assistant/.env.example ../AI-Planning-Assistant/.env
docker compose up --build
```

| Service    | URL                    | Notes                                   |
|------------|------------------------|------------------------------------------|
| nginx      | http://localhost:80    | Reverse proxy — main entrypoint          |
| backend    | http://localhost:8000  | FastAPI, direct access (bypasses nginx)  |
| frontend   | http://localhost:5173  | Vite dev server, direct access           |
| postgres   | localhost:5432          | Direct DB access (psql, GUI clients)     |

See `ai-delivery-planner-infra/README.md` for the full setup walkthrough, and
`ai-delivery-planner-backend/README.md` for backend-only (no Docker) setup.
