# Changelog

## v0.51.0
- Added month-specific category layouts and ordering.
- New months inherit the previous month's category layout.
- Category and group changes now apply only to the selected month.
- Historical category layouts remain available without changing transaction references.

## v0.50.0
- Account cards and the Accounts page heading now properly hide while viewing account details.

## v0.49.0
- Planned remains editable while a month is unaccepted so users can build a plan manually.
- Manual, copied, and CSV-entered Planned values use medium contrast until the plan is accepted.
- Accepting the plan remains the action that unlocks monthly budgeting.

## v0.48.0
- Disabled monthly editing, assignment, transaction entry, and amount clicks until the plan is accepted.
- Faded all category metric labels and amounts while the month is locked.
- Kept plan setup actions available during the locked state.

## v0.47.0
- Locked monthly budgeting actions until the month plan is accepted.
- Faded all monthly metric labels and amounts while a month is locked.
- Kept Accept Current Plan, CSV import, and Copy Previous Month available.

## v0.46.0
- Made unaccepted Planned cells substantially more faded on desktop and mobile.
- Kept accepted plans at normal contrast.

## v0.45.0
- Prevented an older cloud snapshot from overwriting newer local changes after refresh.
- Added timestamp-aware synchronization for mobile transactions and other budget edits.

## v0.44.0
- Made unaccepted Planned cells and labels much lighter.
- Changed the action to “Accept Current Plan” and styled it green.

## v0.43.0
- Fixed the monthly plan status panel ignoring its hidden state because of its flex display rule.
- The status panel now disappears after a plan is accepted or imported.

## v0.42.0
- Made accepted plan state explicit with per-month plan markers.
- Kept Accept current plan visible for unaccepted months.
- Future CSV and copy actions now remain tied to months without an accepted plan.

## v0.41.0
- Suggested Planned amounts now appear in grey.
- Added Accept current plan to save suggestions as explicit monthly plans.
- Accepted, imported, and copied plans remain black.

## v0.40.0
- Fixed month navigation producing Invalid Date when moving between months.
- Updated the service-worker cache so GitHub Pages receives the latest app code.
- Clarified plan detection by using the same effective Planned amounts shown on the dashboard.

## v0.39.0
- Fixed plan detection so displayed suggested amounts count as an existing plan.
- Copy previous month now copies displayed planned amounts, including suggestions.

## v0.38.0
- Fixed applying monthly plans to the selected month.
- Added copy-previous-month and CSV actions when an empty month needs a plan.
- Made Planned amounts editable in place with cents, autosave, and Enter-to-advance behavior.

## v0.37.0

- Added assigned amounts beside categories in the Assign Money picker.
- Added Available to assign as a source in the Move Money picker when unassigned funds exist.
- Moving from Available to assign now increases the target category without requiring a category-to-category transfer.

## v0.36.0

- Fixed month navigation so future months remain accessible.
- The previous-month arrow is hidden when the selected month is the earliest available budget month.

## v0.35.0

- Assignment amount edits now persist while typing, improving reliability on mobile keyboards and navigation.
- Preserved cent-based validation and inline dashboard updates.

## v0.34.0

- Replaced the account transaction modal with a full-page Accounts detail view.
- Added an Accounts back button while preserving balance, account editing, transaction checkboxes, bulk reconciliation, and clickable lock statuses.

## v0.33.0

- Consolidated CSV monthly-plan importing to one control.
- Added an explicit month selector so imported plans can be applied to any chosen month.

## v0.32.0

- Added an Edit button to each account card.
- Account editing supports name, notes, account type, and opening balance while preserving transaction history.

## v0.31.2

- Fixed inline Assigned-column editing to validate increases using integer cents, including the final $0.99.

## v0.31.1

- Fixed assignment validation so remaining cents, including the final $0.99, can be assigned without floating-point rounding errors.

## v0.31.0

- Added persistent transaction tags.
- Added Settings management for adding, editing, and deleting tags.
- Added tag selection to the Add Transaction modal.

## v0.30.0

- Removed mobile background colors from all category amount cells.
- Preserved the rounded bordered background treatment for category names.
- Kept Saved text and sparkle accents visible without its panel background.

## v0.29.0

- Explicitly removed padding from mobile amount cells and their controls.
- Increased vertical separation between mobile category rows.

## v0.28.1

- Extended the active bottom-navigation highlight to include the icon and text label across the full button.

## v0.28.0

- Added a subtle light-blue background highlight behind the active bottom-navigation icon.

## v0.27.0

- Centered mobile metric labels and amounts within their cells.
- Removed the remaining metric-cell padding.

## v0.26.0

- Flattened mobile metric cells by removing rounded corners and borders.
- Reduced padding between category amounts for a denser dashboard.

## v0.25.0

- Changed mobile category groups and rows to flat, full-width list rows without rounded borders.
- Removed the mobile Envelopes heading and description while keeping the Assign Money control.

## v0.24.0

- Added compact bordered category rows for clearer separation on mobile.
- Increased mobile metric and category amount sizes without adding large spacing.

## v0.23.0

- Tightened mobile group sections and removed excess outer spacing around category cards.
- Reduced mobile padding and gaps for dashboard amounts, summary cards, panels, headings, and controls.

## v0.22.1

- Moved the mobile category name and Saved panel to the left column.
- Positioned Remaining/Spent and Assigned/Planned in the two columns on the right.

## v0.22.0

- Moved the mobile category name into the right-hand column above Saved.
- Increased the category name size and kept the Saved cell spanning the lower two rows.

## v0.21.0

- Reorganized mobile category amounts into a three-column layout.
- Added differentiated backgrounds for spending/planning values.
- Made the Saved area span both rows with a prominent sparkly savings treatment.

## v0.20.0

- Reworked the mobile dashboard into stacked category cards with all budget values visible without horizontal scrolling.
- Kept the desktop dashboard's existing column layout.

## v0.19.9

- Clicking away from an assignment field now saves and exits without advancing.
- Pressing Enter advances to the next assignment field; tapping another amount opens that specific field.
- Matched assignment input sizing to dashboard values and tightened mobile columns.

## v0.19.8

- Assignment amounts now save without refreshing the dashboard.
- After saving an assignment, focus advances to the next category's Assign field.

## v0.19.7

- Simplified account cards to show the account name, optional notes, and current balance.
- Moved reconciliation into each account's transaction list with checkboxes, bulk reconciliation, and clickable lock status icons.
- Removed the separate Accounts-page reconciliation panel and added notes when creating an account.

## v0.19.6

- Changed the Budget navigation icon to a colored dollar sign.
- Changed the Settings navigation icon to a colored gear.

## v0.19.5

- Fixed Move Money category selection so choosing a source category updates the picker correctly.
- Removed the underline from dashboard Remaining amounts.

## v0.19.4

- Changed the Activity navigation icon to a dollar bill.
- Changed the Accounts navigation icon to a bank.

## v0.19.3

- Added one sparkle on each side of every Saved amount on the dashboard.

## v0.19.2

- Explicitly left-aligned category names and notes in Settings rows.

## v0.19.1

- Fixed Settings category and group drag-and-drop initialization.
- Added explicit browser drag payloads and isolated nested category/group drag handlers.
- Added dropping categories onto a group area, including empty groups.

## v0.19.0

- Returned the month heading to the top of the dashboard.
- Increased dashboard amount size, tightened category rows, softened category-name weight, and added brighter purple sparkle styling for Saved.
- Added editable, reorderable, addable, and deletable category groups in Settings.
- Added category-to-category money transfers from the Remaining amount.
- Added account detail views with transaction lists, reconciliation checkboxes, individual/bulk reconciliation, and lock icons.
- Simplified account cards to name and current balance.

## v0.18.0

- Added 50px more space between the header and page content.
- Moved Envelopes above the month heading and capitalized Assign Money.
- Reused the grouped category picker in the Assign Money modal.
- Added brighter Activity and Accounts action buttons.
- Condensed Settings category groups and made category names the edit links.
- Clarified and separated Backup, Restore Backup, and Sign Out actions.

## v0.17.0

- Reordered dashboard columns to Remaining, Spent, Assigned, Planned, and Saved.
- Added red Spent, green Remaining, and sparkly Saved styling.
- Added horizontal scrolling for dashboard category groups.
- Added a softly yellow-tinted dashboard column header to match the activity table treatment.
- Replaced JavaScript alerts with themed BudgetBuddy message modals.

## v0.16.0

- Corrected mobile category header and amount-column alignment.
- Redesigned the Add Transaction modal into a single-column layout.
- Added a large, display-style amount entry at the top.
- Replaced Cleared with a toggle switch.
- Replaced the default category select with a grouped, styled category picker.

## v0.15.0

- Changed the expense warning to explain that more money must be assigned before recording the transaction.
- Made Assigned amounts editable directly in the category row without opening a modal.
- Added more mobile top spacing and constrained mobile content width.
- Moved category drag-and-drop reordering to Settings and simplified the drag handle.

## v0.14.1

- Added a dedicated drag handle column and visual drop target for category reordering.
- Improved dropping categories onto a group container, including cross-group moves.
- Kept category rows compact while allowing horizontal scrolling on narrow screens.

## v0.14.0 — 2026-09-19

- Increased desktop spacing below the fixed top navigation.
- Standardized category dropdown ordering to match the plan.
- Added a dedicated drag handle for category reordering.
- Enabled moving categories between groups by drag and drop.
- Made Add Transaction blue and Assign Money green.

## v0.13.0 — 2026-09-19

- Made the top and bottom navigation fixed and continuously available.
- Replaced the transaction type dropdown with an Expense/Income pill toggle.
- Expense defaults to selected with red styling; Income uses green styling.
- Added drag-and-drop category reordering while preserving the existing order by default.

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
## v0.52.0
- Added confirmed transaction deletion from the Activity page.
- Added confirmed transaction deletion from account detail pages.
- Deleting a transaction immediately recalculates account balances and category totals.
## v0.53.0
- Switched cloud persistence to normalized Supabase tables for accounts, categories, monthly budgets, savings, layouts, and transactions.
- Added normalized metadata and monthly-layout storage for current BudgetBuddy features.
- Kept browser local storage as an offline cache.
- Updated wipe-budget to clear normalized data as well as the legacy snapshot.
## v0.54.0
- Changed normalized cloud saves to row-level upserts and targeted stale-row deletes.
- Added optimistic revision checks to prevent one device from overwriting another device’s newer save.
- Added a conflict message and automatic reload of the newest normalized budget when a conflict is detected.
- Added updated timestamps to normalized entities.
## v0.55.0
- Moved Sign Out to the top of Settings.
- Added a full User Account page linked from Settings.
- Added editing for display name, email address, and password through Supabase Auth.
## v0.56.0
- Added strong password enforcement for new account creation and password changes.
- Added live password-strength meters with requirement indicators to both forms.
- Requires at least 12 characters, uppercase, lowercase, a number, and a special character.
## v0.57.0
- Fixed mobile budget wipe behavior by clearing local data immediately, even when offline or cloud cleanup fails.
- Added cleanup for normalized transfers, reconciliations, monthly records, and legacy snapshots.
- Preserved an explicit wiped state so refresh does not recreate default categories.
- Added automatic cloud cleanup retry when the device reconnects.
## v0.58.0
- Synchronized accepted-month status through the normalized `budget_months` table.
- Loaded accepted-month markers separately on startup so desktop and mobile show the same plan status.
- Backfilled accepted-month markers from the existing plan metadata during normal saves.
## v0.59.0
- Refreshes cloud data when the app returns to the foreground or regains focus.
- Adds a periodic foreground sync so changes made on another device appear without signing out and back in.
- Forces the service worker to install the latest app bundle instead of serving an older cached mobile build.
## v0.60.0
- Serializes queued budget saves before a foreground refresh so local plan and account changes cannot be overwritten before syncing.
- Refreshes the Supabase user profile so display-name changes appear across devices.
- Bumps the mobile cache again to ensure the synchronization fix is installed.
## v0.61.0
- Removed browser local-storage budget persistence; authenticated budget state now loads from Supabase only.
- Removed the offline service-worker cache and unregisters existing BudgetBuddy service workers.
- Keeps budget changes in memory only until they are written to normalized Supabase tables.
- Removed the stale-revision rejection from direct database saves.
- Saves accepted-month records together with the rest of the normalized budget data.
- Added cache-busting version parameters to the app and stylesheet URLs.
## v0.62.0
- Removed the dependency on `budget_metadata.revision` and `updated_by`, which are not present in the current Supabase schema.
- Uses the existing `budget_metadata` columns while saving all normalized budget rows.
- Displays database save errors instead of silently losing changes.
## v0.63.0
- Removed optional `updated_at` fields from normalized writes so category reordering works with the current database schema.
- Stores account notes and transaction tag/reconciled metadata in the existing `budget_metadata.data` JSON.
## v0.64.0
- Audited normalized reads and writes against the installed base schema.
- Restores account notes and transaction tag/reconciled metadata from the JSON metadata extension when optional columns are absent.
- Keeps the app compatible with the current schema while retaining those supported details in Supabase.
## v0.65.0
- Restored the v0.64.0 startup behavior and removed the nonfunctional loading-screen experiment.
## v0.66.0
- Added split transactions to the Add Transaction modal.
- Requires split amounts to equal the transaction total before saving.
- Stores each split as its own category transaction for accurate reporting.
## v0.67.0
- Fixed the split toggle using valid modal markup and a pill-shaped control.
- Fixed category-picker interaction and Cancel behavior in Add Transaction.
## v0.68.0
- Increased the release version and cache-busting query strings.
- Fixed category picker event binding so each picker only handles its own options.
- Added guarded picker setup so one malformed or empty picker cannot stop the rest of the transaction modal from working.
## v0.69.0
- Shows each category's current Remaining amount in Add Transaction category pickers, including split rows.
- Keeps categories selectable when their monthly Remaining amount is zero but category savings may cover the expense.
## v0.70.0
- Fixed category selection in split transaction rows with delegated picker handling.
- Added a live Remaining to split / Over by indicator beneath the split categories.
## v0.71.0
- Rebuilt Add Transaction as a semantic HTML form.
- Replaced custom transaction category buttons with grouped native select controls.
- Replaced type and split controls with native radio/checkbox inputs styled to match the app.
## v0.72.0
- Audited the interface for semantic HTML5 structure.
- Rebuilt the dashboard envelope display as an accessible semantic table with scoped headers and responsive mobile styling.
- Converted plan and settings panels to semantic sections.
- Added a dependency-free Node test suite covering transactions, splits, groups, categories, plans, approvals, persistence, user updates, and semantic structure.
- Added modern nested CSS for the dashboard table and responsive layout.
## v0.73.0
- Aligned desktop dashboard headings and amount columns with fixed semantic table columns.
- Restored the mobile envelope layout to Category/Saved, Assigned/Planned, and Remaining/Spent.
## v0.74.0
- Removed 30-second automatic cloud polling.
- Preserved cloud refresh when the app regains focus, becomes visible, or reconnects online.
## v0.75.0
- Fixed desktop dashboard column alignment by preventing legacy envelope grid styles from affecting semantic table rows.
## v0.76.0
- Audited and consolidated the stylesheet to remove conflicting legacy dashboard and modal rules.
- Reorganized responsive styles mobile-first, with desktop enhancements in min-width media queries.
- Preserved the semantic envelope table, transaction form controls, account details, settings, and responsive navigation.
## v0.77.0
- Hid dashboard table captions visually on mobile while preserving them for accessibility.
## v0.78.0
- Enabled long mobile category names to wrap naturally, including unbroken names, without horizontal overflow.
## v0.79.0
- Changed normal Planned amounts to black while keeping suggested plans faded.
## v0.80.0
- Fixed Assigned inline edits so committed changes immediately flush to Supabase instead of waiting for the delayed save queue.
- Added regression coverage for Assigned persistence rows and save flushing.
## v0.81.0
- Fixed Settings drag-and-drop by making the visible category and group handles the draggable elements.
- Kept category rows and groups as drop targets for reordering and cross-group moves.
## v0.82.0
- Groups split transactions into one bank-style parent transaction on Activity.
- Added a collapsible split breakdown showing each category and amount.
- Persisted split-group metadata so grouping survives refreshes and device changes.
## v0.83.0
- Groups split transactions into one bank-style parent transaction on the Accounts detail page.
- Added collapsible split details while keeping selection, reconciliation, and deletion on the parent transaction.
## v0.84.0
- Reordered mobile envelope values: Category, Assigned, Planned on top; Saved, Remaining, Spent below.
- Remembers the selected app view across page refreshes.
## v0.85.0
- Reordered Activity columns to Date, Payee, Amount, Category, Account, Status.
- Replaced Activity status text with cleared lock symbols and moved deletion into the edit modal.
- Added click-to-edit transaction modals for Activity and Account detail transactions using the Add Transaction form layout.
- Preserved grouped split transactions, reconciliation controls, and confirmation-based deletion while editing.
## v0.86.0
- Aligns split categories under Category and split amounts under Amount in Activity.
- Aligns split categories and amounts with the existing Account detail columns.
