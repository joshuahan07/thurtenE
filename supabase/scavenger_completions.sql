-- Run in Supabase: SQL Editor > New query > paste > Run
-- Anon can upsert completions (by phone). Cannot read other users' entries.

create table if not exists public.scavenger_completions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  completed_at timestamptz not null default now()
);

alter table public.scavenger_completions enable row level security;

-- Anon can insert new completions
drop policy if exists "sc_anon_insert" on public.scavenger_completions;
create policy "sc_anon_insert"
  on public.scavenger_completions
  for insert
  to anon
  with check (true);

-- Anon can update (needed for upsert on phone conflict)
drop policy if exists "sc_anon_update" on public.scavenger_completions;
create policy "sc_anon_update"
  on public.scavenger_completions
  for update
  to anon
  using (true)
  with check (true);

-- No SELECT or DELETE for anon — only you can view completions in Dashboard/SQL
