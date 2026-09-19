# Changelog

## v0.12.0 — 2026-09-19

- Show the Available to Assign card only when money is available.
- Hide Assign Money when the available amount is zero.
- Made assigned amounts clickable category-specific assignment links.
- Added a more prominent header transaction button.

## v0.11.0 — 2026-09-19

- Moved Backup, Restore, and Sign out controls into Settings.
- Added an Add Transaction button to the top header.

## v0.10.0 — 2026-09-19

- Aligned column headings with the amounts below them.
- Removed the Category column heading.
- Made only category names bold; metric values and notes are now normal weight.

## v0.9.0 — 2026-09-19

- Added one column-heading row per category group instead of repeating labels on every category.
- Made category names the edit links.
- Removed the separate category menu buttons and tightened row spacing.

## v0.8.1 — 2026-09-19

- Changed the wipe/reset action to remove all categories and user data.
- A wiped budget now opens as a completely blank app.

## v0.8.0 — 2026-09-19

- Grouped each envelope section into one unified panel.
- Reduced category row spacing and visual noise.
- Added compact separators and group headings inspired by the reference design.

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
