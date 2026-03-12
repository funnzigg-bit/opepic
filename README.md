# IranSignal Pro

IranSignal Pro is a Next.js App Router OSINT-style command center for monitoring Iran-related developments across geopolitics, conflict indicators, markets, shipping, aviation, cyber, humanitarian signals, and AI-generated briefs.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + local shadcn-style UI primitives
- Prisma ORM + PostgreSQL
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
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/iransignal?schema=public"
OPENAI_API_KEY=""
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
```

Use a real Postgres instance for both local and hosted deployments. Good fits: Vercel Postgres, Neon, Supabase, or Railway.

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

- Set `DATABASE_URL` to your hosted Postgres connection string in Vercel Project Settings.
- Run `npx prisma db push` against that database before the first production deploy, or use a migration workflow if you want tracked schema history.
- Replace local cron with Vercel Cron calling `POST /api/ingest`.
- Wire real auth providers into `auth.ts`.
- Replace demo/fallback connectors with credentialed provider integrations for production feeds.

## Vercel Deploy

```bash
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add OPENAI_API_KEY
vercel --prod
```

After the env vars are set:

```bash
npx prisma db push
npm run seed
vercel --prod
```
