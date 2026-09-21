-- BudgetBuddy normalized persistence migration.
-- Run this in Supabase SQL Editor before using the normalized app build.

create table if not exists public.budget_metadata (
  household_id uuid primary key references public.households(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.category_month_layouts (
  household_id uuid not null references public.households(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month_start date not null,
  group_name text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  primary key (category_id, month_start)
);

alter table public.transactions add column if not exists tag text not null default '';
alter table public.transactions add column if not exists reconciled boolean not null default false;
alter table public.accounts add column if not exists notes text not null default '';

alter table public.budget_metadata enable row level security;
alter table public.category_month_layouts enable row level security;

drop policy if exists "members manage budget metadata" on public.budget_metadata;
create policy "members manage budget metadata" on public.budget_metadata
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

drop policy if exists "members manage category month layouts" on public.category_month_layouts;
create policy "members manage category month layouts" on public.category_month_layouts
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create index if not exists category_month_layouts_household_month_idx
  on public.category_month_layouts(household_id, month_start);
