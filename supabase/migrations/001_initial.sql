-- Juice Finder — initial schema (run in Supabase SQL editor or via Supabase CLI)

-- Leads captured from the quiz funnel
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  zip_code text,
  goal text,
  sensitivities text[],
  flavor_preference text
);

-- Recipe catalog (optional sync with app seed; useful for CMS-style edits later)
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  goal text not null,
  description text,
  ingredients text[],
  why_it_may_help text,
  caution_note text,
  image_url text
);

-- Local juice spots directory (mock / future Google Places)
create table if not exists public.juice_spots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  zip_code text,
  city text,
  state text,
  rating numeric,
  distance_miles numeric,
  is_open boolean default true
);

-- Row Level Security
alter table public.leads enable row level security;
alter table public.recipes enable row level security;
alter table public.juice_spots enable row level security;

-- Public can insert leads (anon key from the Next.js API route)
create policy "Allow anonymous insert on leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Public read for catalog tables (adjust when you add auth)
create policy "Allow public read recipes"
  on public.recipes
  for select
  to anon, authenticated
  using (true);

create policy "Allow public read juice_spots"
  on public.juice_spots
  for select
  to anon, authenticated
  using (true);

-- Optional: allow service role full access is implicit in Supabase

comment on table public.leads is 'Marketing / lead capture from Juice Finder quiz';
comment on table public.recipes is 'Juice recipe catalog';
comment on table public.juice_spots is 'Local spots; replace or augment with Places API later';
