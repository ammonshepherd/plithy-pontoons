# BudgetBuddy

A browser-only, offline-capable envelope budget planner. The first version is intentionally simple and practical, with local browser storage and JSON backup/restore.

## GitHub Pages

Enable Pages for the `main` branch in the repository settings. The app is static and needs no build step.

## Current scope

- Monthly envelopes with planned, assigned, spent, remaining, and category savings.
- Manual income, expense, transfer, and credit-card transactions.
- Accounts and opening balances.
- Reconciliation starter view.
- Editable categories and groups.
- JSON backup and restore.
- Offline PWA shell.

## Supabase setup

`supabase-schema.sql` contains the hosted database schema and Row Level Security policies. Run it in the Supabase SQL Editor after creating the project. If you already ran that file, run `supabase-sync-migration.sql` to add the cloud snapshot table used by offline sync. `supabase-config.js` contains only the public browser key; never place a service-role key or database password in the repository.
