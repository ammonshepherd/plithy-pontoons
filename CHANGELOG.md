# Changelog

## v0.7.0 — 2026-09-19

- Renamed the app to BudgetBuddy.
- Updated the visual theme to use the Clearpath-inspired navy, blue, and pale-paper design language.
- Added compact cards, softer shadows, and a translucent bottom navigation style.

## v0.6.0 — 2026-09-19

- Added a confirmed testing button to wipe local and cloud budget data.
- Added CSV import for `Category, Monthly plan amount, Group`.
- Imported plans apply to the selected month without assigning money.
- Made imported and renamed categories appear in their configured groups.

## v0.5.1 — 2026-09-19

- Added a migration safeguard for accounts created before opening-balance funds were introduced.

## v0.5.0 — 2026-09-19

- Included positive checking and savings opening balances in initial available-to-assign funds.
- Excluded credit-card opening balances from available-to-assign funds.
- Prevented opening balances from being counted again in later months.

## v0.4.0 — 2026-09-19

- Fixed the authentication gate remaining visible after sign-in.
- Added the current version to the top header while testing.
- Added the current version to the Settings page.
- Added a changelog for future updates.

## v0.3.0

- Added Supabase cloud snapshot sync and offline upload queue.

## v0.2.0

- Added Supabase authentication.

## v0.1.0

- Added the initial local-first envelope budget PWA.
