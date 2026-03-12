# IranSignal Pro

IranSignal Pro is a Next.js App Router OSINT-style command center for monitoring Iran-related developments across geopolitics, conflict indicators, markets, shipping, aviation, cyber, humanitarian signals, and AI-generated briefs.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + local shadcn-style UI primitives
- Prisma ORM + SQLite for local development
- Zod validation
- SSE realtime stream
- `react-grid-layout` widget dashboard
- Leaflet / `react-leaflet` map surface
- `ai` SDK with OpenAI fallback support

## Features

- Drag/drop command-center dashboard with a 55+ widget catalog
- Prebuilt `/overview`, `/timeline`, `/map`, `/sources`, `/alerts`, and `/admin` pages
- Prisma data model for sources, items, alerts, cache, widgets, layouts, and audit logs
- Seeded demo data with 50+ sources and 100 timeline items
- Ingestion service for RSS, page monitors, API feeds, caching, and alert evaluation
- SSE endpoint for realtime updates and alert-style notifications
- AI analysis endpoint with OpenAI integration or a deterministic fallback brief

## Local Setup

```bash
npm install
npx prisma db push
npm run seed
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Environment

Use `.env.example` as the portable baseline:

```env
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY=""
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
```

If your local Prisma runtime has trouble resolving a relative SQLite path, replace `DATABASE_URL` with an absolute `file:/.../prisma/dev.db` path.

## Useful Commands

```bash
npx prisma generate
npx prisma db push
npm run seed
npm run cron:dev
npm run build
```

## API Surface

- `GET /api/items`
- `GET|POST /api/sources`
- `GET|POST /api/alerts`
- `POST /api/ingest`
- `GET /api/stream`
- `POST /api/ai/analyze`
- `GET|POST /api/dashboard-layouts`
- `GET /api/kpis`

## Deployment Notes

- Swap SQLite for Postgres by changing `provider` and `DATABASE_URL`.
- Replace local cron with Vercel Cron calling `POST /api/ingest`.
- Wire real auth providers into `auth.ts`.
- Replace demo/fallback connectors with credentialed provider integrations for production feeds.
