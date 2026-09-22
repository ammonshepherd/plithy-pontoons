-- BudgetBuddy database cleanup
--
-- This migration removes legacy tables and columns that the current app no
-- longer uses. It preserves the active normalized budget model:
-- households, household_members, categories, accounts, budget_months,
-- category_monthly, category_savings, transactions, category_month_layouts,
-- and budget_metadata.
--
-- Run in the Supabase SQL Editor. The transaction will roll back if any
-- statement fails. Review the DROP TABLE statements before running them.

begin;

-- Legacy JSON snapshot storage. The app now reads and writes normalized rows.
drop table if exists public.budget_snapshots;

-- Reserved tables that the current app does not read or write. Category-to-
-- category moves currently change monthly assignments directly, and account
-- reconciliation currently uses transaction-level reconciled status.
drop table if exists public.category_transfers;
drop table if exists public.reconciliations;

-- Obsolete optimistic-sync metadata. The app now uses Supabase directly and
-- stores only its active metadata JSON and timestamp.
alter table if exists public.budget_metadata
  drop column if exists revision,
  drop column if exists updated_by;

-- Obsolete row-level timestamp columns. The app does not use these columns;
-- created_at remains available for basic row history.
alter table if exists public.categories
  drop column if exists updated_at;

alter table if exists public.accounts
  drop column if exists updated_at;

alter table if exists public.transactions
  drop column if exists updated_at;

alter table if exists public.category_monthly
  drop column if exists updated_at;

alter table if exists public.category_month_layouts
  drop column if exists updated_at;

commit;

