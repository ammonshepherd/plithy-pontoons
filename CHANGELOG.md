# Changelog

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
