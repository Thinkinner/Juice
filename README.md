# Juice Finder

Mobile-first **Next.js 14** (App Router) app: short wellness quiz → personalized **juice ideas** (informational only) → email capture with **Supabase** `leads` table. Not a medical product—copy avoids “cure/treat” language and shows a clear disclaimer.

## Stack

- Next.js 14, TypeScript, Tailwind CSS, App Router  
- Supabase (`@supabase/supabase-js`, `@supabase/ssr` for future auth)  
- React Hook Form + Zod (`@hookform/resolvers` **v3** with **Zod 3**)  
- Framer Motion, Lucide React  

## Quick start

```bash
npm install
cp .env.example .env.local
# Add your Supabase URL + anon key (optional for local UI; lead API logs a warning if missing)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a project in [Supabase](https://supabase.com).  
2. In **SQL Editor**, run `supabase/migrations/001_initial.sql`, then `supabase/seed.sql` (recipes + juice spots).  
3. Copy **Project URL** and **anon public** key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.  
4. The `POST /api/leads` route inserts into `public.leads`. With the included RLS policy, the **anon** key is enough. Optionally set `SUPABASE_SERVICE_ROLE_KEY` for server-only inserts (keep secret; never expose to the client).

## Deploy (Vercel)

1. Push the repo and import the project in [Vercel](https://vercel.com).  
2. Set the same environment variables in **Project → Settings → Environment Variables**.  
3. Deploy — `npm run build` should pass (`next build`).

## Routes

| Path        | Purpose                                      |
|------------|-----------------------------------------------|
| `/`        | Landing, CTA to quiz                          |
| `/quiz`    | Multi-step quiz + email unlock + lead save   |
| `/results` | Recipes + mock juice spots (needs session)    |
| `/saved`   | Saved recipe IDs (localStorage; auth-ready)   |
| `POST /api/leads` | Persists lead to Supabase              |

## Data & logic

- Recipe catalog: `src/data/recipes.ts` (aligned UUIDs with `supabase/seed.sql`).  
- Mock spots + ZIP matching: `src/data/juice-spots.ts` (replace with Google Places later).  
- Scoring: `src/lib/recommendations.ts` (goal + sensitivities + flavor).  
- Quiz + unlocked session persistence: `localStorage` keys in `src/lib/quiz-storage.ts`.  
- Saved recipes: `src/lib/saved-recipes.ts`.

## Scripts

- `npm run dev` — development  
- `npm run build` — production build  
- `npm run start` — run production server  
- `npm run lint` — ESLint  

## Legal / product note

All juice suggestions are **informational wellness content only**, not medical advice. The UI states that the app does not diagnose, treat, or cure conditions.
