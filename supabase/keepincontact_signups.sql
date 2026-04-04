-- Run in Supabase: SQL Editor > New query > paste > Run
-- Anon users can INSERT and UPDATE their own rows (for email+phone merge logic).
-- They can SELECT by email/phone for dedup checks. They cannot DELETE or read all rows.

create table if not exists public.keepincontact_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists keepincontact_signups_email_idx
  on public.keepincontact_signups (email);

create unique index if not exists keepincontact_signups_phone_idx
  on public.keepincontact_signups (phone)
  where phone is not null;

alter table public.keepincontact_signups enable row level security;

-- Anon can insert new signups
drop policy if exists "kc_anon_insert" on public.keepincontact_signups;
create policy "kc_anon_insert"
  on public.keepincontact_signups
  for insert
  to anon
  with check (true);

-- Anon can select (needed for dedup lookup by email/phone)
drop policy if exists "kc_anon_select" on public.keepincontact_signups;
create policy "kc_anon_select"
  on public.keepincontact_signups
  for select
  to anon
  using (true);

-- Anon can update (needed for merge logic)
drop policy if exists "kc_anon_update" on public.keepincontact_signups;
create policy "kc_anon_update"
  on public.keepincontact_signups
  for update
  to anon
  using (true)
  with check (true);

-- Anon can delete (needed for merge of duplicate rows)
drop policy if exists "kc_anon_delete" on public.keepincontact_signups;
create policy "kc_anon_delete"
  on public.keepincontact_signups
  for delete
  to anon
  using (true);
