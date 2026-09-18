-- Run this once if you already ran supabase-schema.sql before cloud sync was added.
create table if not exists public.budget_snapshots (
  household_id uuid primary key references public.households(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.budget_snapshots enable row level security;
drop policy if exists "members manage budget snapshots" on public.budget_snapshots;
create policy "members manage budget snapshots" on public.budget_snapshots
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));
