-- Harbor Budget / Budgeteer initial Supabase schema
-- Run this in Supabase SQL Editor after rotating the database password.

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Budget',
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create or replace function public.is_household_member(target_household uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.household_members
    where household_id = target_household and user_id = auth.uid()
  );
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  group_name text not null,
  note text not null default '',
  sort_order integer not null default 0,
  target_month integer check (target_month between 1 and 12),
  target_amount numeric(12,2) check (target_amount >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (household_id, name)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  account_type text not null check (account_type in ('checking','savings','credit')),
  opening_balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.budget_months (
  household_id uuid not null references public.households(id) on delete cascade,
  month_start date not null,
  created_at timestamptz not null default now(),
  primary key (household_id, month_start)
);

create table if not exists public.category_monthly (
  household_id uuid not null references public.households(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month_start date not null,
  planned numeric(12,2) not null default 0 check (planned >= 0),
  assigned numeric(12,2) not null default 0 check (assigned >= 0),
  primary key (category_id, month_start)
);

create table if not exists public.category_savings (
  household_id uuid not null references public.households(id) on delete cascade,
  category_id uuid primary key references public.categories(id) on delete cascade,
  balance numeric(12,2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('income','expense','transfer')),
  transaction_date date not null,
  payee text not null default '',
  amount numeric(12,2) not null check (amount > 0),
  account_id uuid references public.accounts(id) on delete restrict,
  to_account_id uuid references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete restrict,
  memo text not null default '',
  cleared boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (transaction_type <> 'expense' or category_id is not null),
  check (transaction_type <> 'transfer' or to_account_id is not null)
);

create table if not exists public.category_transfers (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  month_start date not null,
  from_category_id uuid not null references public.categories(id) on delete restrict,
  to_category_id uuid not null references public.categories(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (from_category_id <> to_category_id)
);

create table if not exists public.reconciliations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  statement_date date not null,
  statement_balance numeric(12,2) not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Local-first bridge used by the first cloud-sync pass. The app keeps its
-- offline cache locally and stores a protected household snapshot here.
create table if not exists public.budget_snapshots (
  household_id uuid primary key references public.households(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists transactions_household_date_idx on public.transactions(household_id, transaction_date);
create index if not exists category_monthly_household_month_idx on public.category_monthly(household_id, month_start);
create index if not exists category_transfers_household_month_idx on public.category_transfers(household_id, month_start);

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.categories enable row level security;
alter table public.accounts enable row level security;
alter table public.budget_months enable row level security;
alter table public.category_monthly enable row level security;
alter table public.category_savings enable row level security;
alter table public.transactions enable row level security;
alter table public.category_transfers enable row level security;
alter table public.reconciliations enable row level security;
alter table public.budget_snapshots enable row level security;

create policy "members can view households" on public.households for select using (public.is_household_member(id));
create policy "owners can update households" on public.households for update using (exists (select 1 from public.household_members m where m.household_id=id and m.user_id=auth.uid() and m.role='owner'));
create policy "members can view membership" on public.household_members for select using (public.is_household_member(household_id));
create policy "owners can manage membership" on public.household_members for all using (public.is_household_member(public.household_members.household_id)) with check (public.is_household_member(public.household_members.household_id));

create policy "members manage categories" on public.categories for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage accounts" on public.accounts for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage months" on public.budget_months for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage monthly budgets" on public.category_monthly for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage savings" on public.category_savings for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage transactions" on public.transactions for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage category transfers" on public.category_transfers for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage reconciliations" on public.reconciliations for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members manage budget snapshots" on public.budget_snapshots for all using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));

-- Create a household automatically for a newly authenticated user.
create or replace function public.create_default_household()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_household uuid;
begin
  insert into public.households(name) values ('My Budget') returning id into new_household;
  insert into public.household_members(household_id, user_id, role) values (new_household, new.id, 'owner');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_budgeteer on auth.users;
create trigger on_auth_user_created_budgeteer
  after insert on auth.users
  for each row execute procedure public.create_default_household();
