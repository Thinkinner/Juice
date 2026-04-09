# IG Brain

Production-style **Instagram professional account** analytics app: ingest insights, classify posts, discover patterns, and generate **what to post next** recommendations. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**, **Supabase Auth**, **Prisma** + **PostgreSQL** (Supabase), **Recharts**, **Zod**, **React Hook Form** (where needed), **dark mode** (next-themes).

## Features

- **Auth**: Email/password via Supabase Auth; Prisma `User` rows keyed by `auth.users` UUID.
- **Workspaces**: Default workspace per user; ready for multi-account.
- **Mock Instagram**: Connect mock account + sync + **seed 120 posts** without Meta credentials.
- **Scoring**: Weighted composite (views, share/save quality, comments, ER, recency) — editable in Settings.
- **Patterns**: Topics, hooks, hours, formats vs baseline.
- **Recommendations**: Ranked list with confidence, window, reasoning, supporting post IDs.
- **AI Strategist**: Rule-based Q&A grounded in DB metrics (optional OpenAI hook described in code).
- **Copy pack**: Hooks, CTAs, reel script, carousel outline templated from top performers.
- **Cron-ready**: `POST /api/cron/sync` with `Authorization: Bearer $CRON_SECRET`.

## Prerequisites

- Node **20+** (see `.nvmrc` if present)
- A **Supabase** project (Auth + Postgres)
- **npm**

## Install

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## First-time setup

1. **Supabase**: Enable Email auth (Authentication → Providers).
2. **Database**: Paste `DATABASE_URL` from Supabase (SQL → connection string or pooler).
3. **Push schema**: `npx prisma db push` (applies `prisma/schema.prisma`).
4. **Sign up** at `/signup` (creates `User` + workspace via app).
5. **Seed mock data** (120 posts):

   ```bash
   SEED_USER_EMAIL="your@signup.email" npx prisma db seed
   ```

6. In the app: **Settings** → **Connect mock Instagram** → **Sync latest posts** (refreshes insight snapshots) → **What to post next** → **Regenerate recommendations**.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npx prisma db push` | Sync DB schema |
| `npx prisma db seed` | Seed mock posts |
| `npm run db:studio` | Prisma Studio |

## Environment variables

See **`.env.example`**. Required for full functionality:

- `DATABASE_URL` — Postgres (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key

Optional:

- `CRON_SECRET` — protect cron route
- `SEED_USER_EMAIL` / `SEED_EMAIL` — seed target user
- `OPENAI_API_KEY` — future grounded LLM layer (not required)

## Deploy (Vercel)

1. Import repo; set **Root Directory** to project root (where `package.json` lives).
2. Add env vars from `.env.example`.
3. Build command: `npm run build`; Install: `npm install`.
4. **Prisma**: run `prisma db push` from CI or locally against production DB before first deploy.
5. Optional: Vercel Cron hitting `POST /api/cron/sync` nightly with `Authorization: Bearer CRON_SECRET`.

## Live Instagram (Meta) — not wired by default

- Implement `src/services/instagram/instagram.service.ts` using Instagram Graph API + long-lived tokens.
- Store tokens only in `SocialAccount.accessTokenEncrypted` (encrypt at rest in production).
- Map media + insights into `MediaPost` / `MediaInsight` (see `instagram.types.ts`).
- **Never** expose tokens to the client.

## Architecture notes

- **Modular providers**: `Platform` enum ready for TikTok, Facebook, X, YouTube.
- **Insights**: Multiple `MediaInsight` rows per post = time series.
- **Security**: Server actions + API routes for mutations; tokens server-only.

### Bonus (comments in codebase)

- Webhook ingestion for Meta subscriptions
- TikTok adapter implementing same sync interface
- A/B test recommendation arms
- Viral prediction model
- Scheduler integration (Buffer, Later, etc.)

## Repository layout (high level)

```
src/
  app/
    (auth)/login, signup
    (dashboard)/dashboard/*   — overview, content, patterns, next, strategist, settings
    api/cron/sync
  actions/                    — server actions (auth, sync, settings, recommendations, …)
  components/
    charts/                     — Recharts wrappers
    dashboard/                  — sidebar, strategist, copy pack
    ui/                         — shadcn
  lib/
    supabase/                   — browser + server + middleware clients
    prisma.ts
    constants/
  services/
    analytics/                  — aggregates, overview, patterns
    scoring/                    — composite score
    recommendation/             — ranked next-post engine
    sync/                       — mock sync + cron path
    classifier/                 — rules fallback
    ai/                         — grounded strategist
    instagram/                  — live API placeholders
prisma/
  schema.prisma
  seed.ts
supabase/
  rls-notes.sql
```

## License

Private / your project.
