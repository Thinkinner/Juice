-- IG Brain — optional Row Level Security when exposing Supabase PostgREST.
-- This app primarily uses Prisma from Next.js server with DATABASE_URL (often service role / bypass RLS).
-- If you add client-side Supabase queries to Postgres, enable RLS and policies per table.

-- Example pattern (adjust to your security model):
-- alter table public."User" enable row level security;
-- create policy "users_own_row" on public."User" for select using (auth.uid() = id);

-- Prisma migrations: use `prisma db push` or `prisma migrate` against a role that can DDL.
-- For production, prefer migrate + review.
