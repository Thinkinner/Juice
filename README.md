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
# Fill POSTGRES_PRISMA_URL (Prisma pooler URI from Supabase → Database), plus NEXT_PUBLIC_* keys.
# **Vercel + Supabase integration:** sets `POSTGRES_PRISMA_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — redeploy after connecting.
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

- `POSTGRES_PRISMA_URL` — Prisma/pooled Postgres URI (**Vercel Supabase integration adds this**)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (integration adds this)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (integration adds this)

Optional:

- `CRON_SECRET` — protect cron route
- `SEED_USER_EMAIL` / `SEED_EMAIL` — seed target user
- `OPENAI_API_KEY` — future grounded LLM layer (not required)

If you only have `DATABASE_URL` from older docs, set `POSTGRES_PRISMA_URL` to the **same connection string** (Prisma reads `POSTGRES_PRISMA_URL` in this repo).

## Deploy (Vercel)

1. Import repo; set **Root Directory** to project root (where `package.json` lives).
2. **Node.js**: set **20.x** (Project → Settings → General) — matches `engines` and `.nvmrc`.
3. **Supabase integration** should add `POSTGRES_PRISMA_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. If `POSTGRES_PRISMA_URL` is missing, add it from Supabase → Database → Prisma connection string.
4. Build runs `prisma generate && next build` so the Prisma client always exists on the server.
5. **Prisma**: run `npx prisma db push` against production DB before first deploy (or from CI), with `POSTGRES_PRISMA_URL` in your local `.env.local`.
6. Optional: Vercel Cron → `POST /api/cron/sync` with `Authorization: Bearer CRON_SECRET`.

If **`npm run build`** fails on Vercel, open the deployment → **Building** tab and scroll to the **first red error** (not just “exited with 1”). Common fixes:

1. **Node 20** — Vercel → Settings → General → Node.js **20.x**.
2. **Env vars** — `POSTGRES_PRISMA_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` on **Production** (and Preview if you use it).
3. **Root Directory** — empty if `package.json` is at repo root.
4. **Prisma on Linux** — this repo sets `binaryTargets` for Vercel; run `npx prisma generate` after pulling.

Paste the **last 30 lines** of the Build log here if it still fails.

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
