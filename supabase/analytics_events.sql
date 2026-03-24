-- Run in Supabase: SQL Editor → New query → paste → Run
-- Anonymous site visitors can INSERT events; they cannot SELECT (you view rows in Dashboard / SQL as project owner).

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.analytics_events is 'Lightweight client-side analytics (app opens, screen views, QR completions). View in Supabase Table Editor or SQL; anon cannot read.';

create index if not exists analytics_events_event_type_created_at_idx
  on public.analytics_events (event_type, created_at desc);

alter table public.analytics_events enable row level security;

-- Allow browser (anon key) to append events only
-- Note: Supabase may warn "destructive" because of DROP POLICY below; it only removes this one policy so the script can be re-run safely.
drop policy if exists "analytics_events_anon_insert" on public.analytics_events;
create policy "analytics_events_anon_insert"
  on public.analytics_events
  for insert
  to anon
  with check (true);

-- No SELECT policy for anon → public cannot read this table from the app

-- Example queries (run as you in SQL Editor):
-- select event_type, count(*) as n from public.analytics_events group by 1 order by n desc;
-- select * from public.analytics_events where event_type = 'qr_section_complete' order by created_at desc limit 50;
