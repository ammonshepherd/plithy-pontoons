const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
test('source files use readable multiline formatting', () => {
    assert.doesNotMatch(app, /[^\n]{2000,}/);
    assert.doesNotMatch(html, /[^\n]{500,}/);
    assert.doesNotMatch(css, /[^\n]{500,}/);
    assert.match(app, /\nfunction [A-Za-z]/);
    assert.match(html, /\n\s+<(?:section|form|table)\b/);
    assert.match(css, /\{\n[\s\S]*?\n\}/);
});
test('document uses semantic page landmarks and native forms', () => {
    assert.match(html, /<header\b/);
    assert.match(html, /<main\b/);
    assert.match(html, /<nav\b/);
    assert.match(html, /<form id="auth-form"/);
    assert.match(html, /<form id="user-account-form"/);
    assert.match(html, /<table>/);
});
test('dashboard category renderer uses a semantic table with scoped headers', () => {
    assert.match(app, /<table\s+class="budget-table">/);
    assert.match(app, /<caption\s+class="visually-hidden">/);
    assert.match(app, /<th\s+scope="col">[\s\S]*?Category[\s\S]*?<\/th>/);
    assert.match(app, /<colgroup>[\s\S]*?<col\s+class="category-column">[\s\S]*?<col\s+span="5"\s+class="amount-column">[\s\S]*?<\/colgroup>/);
    assert.match(app, /<th\s+scope="row"\s+class="category-cell">/);
});
test('transaction modal uses native form controls rather than custom category buttons', () => {
    assert.match(app, /<form id="transaction-form"/);
    assert.match(app, /name="transaction-type" value="expense"/);
    assert.match(app, /id="tx-split" name="split" type="checkbox"/);
    assert.match(app, /transactionCategorySelectMarkup\(`split-category-/);
    assert.doesNotMatch(app, /openTransactionV71[\s\S]*categoryPickerMarkup\(options\[Math\.min\(index/);
});
test('new dashboard CSS uses nested rules and responsive table semantics', () => {
    assert.match(css, /\.budget-table-wrap\s*\{[\s\S]*\.budget-table\s*\{/);
    assert.match(css, /\.budget-table\s*\{[\s\S]*thead th/);
    assert.match(css, /@media \(min-width: 781px\)/);
    assert.match(css, /\.budget-table tbody tr\.envelope\s*\{\s*display:\s*table-row/);
    assert.doesNotMatch(css, /@media\s*\(max-width/);
    assert.doesNotMatch(css, /\.category-header|\.kebab|\.category-name/);
    assert.match(css, /\.visually-hidden\s*\{/);
    assert.match(css, /\.budget-table \.category-link[^{]*\{[\s\S]*?overflow-wrap:\s*anywhere[\s\S]*?word-break:\s*break-word[\s\S]*?white-space:\s*normal/);
    assert.match(css, /\.budget-table \.metric\.planned button\s*\{[\s\S]*?color:\s*var\(--ink\)/);
    assert.match(css, /\.budget-table \.metric\.remaining\s*\{[\s\S]*?grid-column:\s*2[;\s]+[\s\S]*?grid-row:\s*2/);
    assert.match(css, /\.budget-table \.metric\.planned\s*\{[\s\S]*?grid-column:\s*3[;\s]+[\s\S]*?grid-row:\s*1/);
});
test('selected app view is remembered across refreshes', () => {
    assert.match(app, /const VIEW_STORAGE_KEY = 'budgetbuddy-active-view'/);
    assert.match(app, /localStorage\.setItem\(VIEW_STORAGE_KEY,viewId\)/);
    assert.match(app, /function rememberedView\(\)/);
    assert.match(app, /setup\(\);[\s\S]*showView\(rememberedView\(\)/);
    assert.match(app, /ACCOUNT_DETAIL_STORAGE_KEY/);
});
test('cloud refresh uses lifecycle events without interval polling', () => {
    assert.match(app, /window\.addEventListener\('focus',refreshBudgetFromCloud\)/);
    assert.match(app, /document\.addEventListener\('visibilitychange'/);
    assert.match(app, /window\.addEventListener\('online'/);
    assert.doesNotMatch(app, /setInterval\(/);
});
test('assigned inline edits flush their cloud save when committed', () => {
    assert.match(app, /function flushCloudSave\(\)/);
    assert.match(app, /beginInlineAssignment=function[\s\S]*void flushCloudSave\(\)/);
});
test('settings drag handles are the draggable elements', () => {
    assert.match(app, /function normalizeSettingsDragHandles\(root\)/);
    assert.match(app, /row\.setAttribute\('draggable','false'\)/);
    assert.match(app, /data-settings-drag-handle\].*setAttribute\('draggable','true'\)/);
    assert.match(app, /data-settings-group-handle\].*setAttribute\('draggable','true'\)/);
});
test('activity groups split transactions into a collapsible parent row', () => {
    assert.match(app, /function transactionGroups\(rows\)/);
    assert.match(app, /class="split-toggle"/);
    assert.match(app, /class="split-details-row"/);
    assert.match(app, /splitBreakdownMarkup\(group\.items\)/);
    assert.match(app, /transactionExtras[\s\S]*bankTransactionId/);
});
test('account details group split transactions and reconcile the parent', () => {
    assert.match(app, /function groupedAccountRow\(group,accountId\)/);
    assert.match(app, /data-account-split-toggle/);
    assert.match(app, /renderAccountDetail=function\(id\)[\s\S]*groups\.map\(group=>groupedAccountRow\(group,id\)\)/);
    assert.match(app, /group\.items\.forEach\(item=>\{\s*item\.reconciled=!allReconciled;/);
});
test('activity uses the requested columns and lock status instead of row delete controls', () => {
    assert.match(html, /<th>\s*Date\s*<\/th>[\s\S]*?<th>\s*Payee\s*<\/th>[\s\S]*?<th>\s*Amount\s*<\/th>[\s\S]*?<th>\s*Category\s*<\/th>[\s\S]*?<th>\s*Account\s*<\/th>[\s\S]*?<th>\s*Status\s*<\/th>/);
    assert.match(app, /transactionStatusLockMarkup/);
    assert.match(app, /data-edit-transaction/);
    assert.match(app, /groupedTransactionRow=function\(group\)[\s\S]*data-edit-transaction/);
    assert.doesNotMatch(app, /groupedTransactionRow=function\(group\)[\s\S]*?data-delete-transaction/);
});
test('transaction editing uses the add-transaction form and supports deletion', () => {
    assert.match(app, /function transactionEditorMarkup\(group\)/);
    assert.match(app, /function openTransactionEditor\(id,afterSave=\(\)=>render\(\)\)/);
    assert.match(app, /id="transaction-edit-form"/);
    assert.match(app, /id="delete-edit-transaction"/);
    assert.match(app, /data-edit-account-transaction/);
});
test('account deletion preserves transactions and removes their account links', () => {
    assert.match(app, /function deleteAccount\(id\)/);
    assert.match(app, /state\.accounts=state\.accounts\.filter\(item=>item\.id!==id\)/);
    assert.match(app, /if\(transaction\.accountId===id\)transaction\.accountId=''/);
    assert.match(app, /if\(transaction\.toAccountId===id\)transaction\.toAccountId=''/);
    assert.match(app, /id="delete-account-edit"/);
    assert.match(app, /id="confirm-delete-account"/);
});
test('split detail rows align category and amount with each table layout', () => {
    assert.match(app, /splitBreakdownMarkup=function\(items\)[\s\S]*split-detail-activity/);
    assert.match(app, /splitBreakdownMarkup=function\(items\)[\s\S]*split-detail-account/);
    assert.match(css, /\.account-detail-table \.split-detail-table \.split-detail-activity\s*\{\s*display:\s*none/);
    assert.match(css, /\.account-detail-table \.split-detail-table \.split-detail-account\s*\{\s*display:\s*table-row/);
});
test('account detail places Amount before Category', () => {
    assert.match(app, /const accountDetailColumnOrderRender=renderAccountDetail/);
    assert.match(app, /header\.append\(cells\[4\],cells\[3\]\)/);
    assert.match(app, /groupedAccountRow=function\(group,accountId\)[\s\S]*data-edit-account-transaction[\s\S]*amount-in[\s\S]*Split transaction/);
});
test('transaction amount cells use consistent right alignment', () => {
    assert.match(css, /\.table-wrap td\.amount-in, \.table-wrap td\.amount-out, \.account-transaction-list td\.amount-in, \.account-transaction-list td\.amount-out\s*\{[\s\S]*?text-align:\s*right/);
    assert.match(css, /\.split-detail-table td\.amount-in, \.split-detail-table td\.amount-out\s*\{[\s\S]*?font-weight:\s*750[\s\S]*?text-align:\s*right/);
    assert.match(css, /\.table-wrap th:nth-child\(3\), \.account-transaction-list th:nth-child\(4\)\s*\{[\s\S]*?text-align:\s*right/);
    assert.match(css, /\.table-wrap table, \.account-transaction-list table\s*\{[\s\S]*?min-width:\s*560px[\s\S]*?table-layout:\s*fixed/);
});
test('insufficient Assigned edits open a reallocation modal', () => {
    assert.match(app, /function openReassignMoney\(target,desired\)/);
    assert.match(app, /No more money to assign/);
    assert.match(app, /categoryPickerMarkup\(selected,'assign',false,target,false\)/);
    assert.match(app, /Move money from another assigned category/);
    assert.match(app, /beginInlineAssignment=function[\s\S]*openReassignMoney\(name,next\)/);
});
test('monthly plan loading can recover from optional table failures', () => {
    assert.match(app, /async function recoverPlanFromCloud\(\)/);
    assert.match(app, /query\('categories'\)/);
    assert.match(app, /query\('category_monthly'\)/);
    assert.match(app, /Could not load monthly plan/);
    assert.match(app, /pullNormalizedState=async function\(\)\{\s*await pullWithPlanRecovery\(\);\s*await recoverPlanFromCloud\(\);/);
});
test('CSV monthly plans mark the selected month accepted and flush cloud save', () => {
    assert.match(app, /importCsvFile=function\(event\)/);
    assert.match(app, /state\.planMonths\[importMonth\]=true/);
    assert.match(app, /void flushCloudSave\(\)/);
    assert.match(app, /addNameToMonthLayout\(name,group,importMonth\)/);
});
test('monthly plan actions can copy previous actual spending', () => {
    assert.match(html, /id="month-copy-spending">\s*Copy Previous Spending\s*<\/button>/);
    assert.match(app, /function copyPreviousMonthSpending\(\)/);
    assert.match(app, /spentFor\(c\.name,prior\)/);
    assert.match(app, /month-copy-spending/);
});
test('account detail exposes safe bank CSV import controls and matching behavior', () => {
    assert.match(app, /id="account-detail-import">Import bank CSV<\/button>/);
    assert.match(app, /id="account-bank-csv" type="file" accept="\.csv,text\/csv"/);
    assert.match(app, /function parseBankTransactionCsv\(text\)/);
    assert.match(app, /function bankImportPlan\(accountId,rows\)/);
    assert.match(app, /Import unmatched only/);
    assert.match(app, /Import all as new/);
    assert.match(app, /transaction\.reconciled=true/);
});
test('budget reset has one accurate destructive control', () => {
    assert.doesNotMatch(html, /id="reset-demo"/);
    assert.match(html, /<h2>\s*Reset budget\s*<\/h2>/);
    assert.match(html, /id="wipe-budget">\s*Wipe budget and start fresh\s*<\/button>/);
    assert.match(html, /Permanently deletes this local budget/);
    assert.match(app, /document\.getElementById\('wipe-budget'\)\.onclick=wipeBudget/);
    assert.doesNotMatch(app, /reset-demo/);
});
test('bank CSV review uses the app modal helper', () => {
    assert.match(app, /function openBankImportReview\(accountId,rows\)[\s\S]*modal\('Review bank import'/);
    assert.doesNotMatch(app, /openModal/);
});
test('settings omits the removed Planning suggestions section', () => {
    assert.doesNotMatch(html, /<h2>Planning suggestions<\/h2>/);
    assert.doesNotMatch(html, /New monthly plans use the previous month's actual spending/);
});
test('bank-imported expenses use a persisted uncategorized category', () => {
    assert.match(app, /function ensureBankImportCategory\(\)/);
    assert.match(app, /category:Number\(row\.amount\)<0\?ensureBankImportCategory\(\):category/);
});
test('credit card payment reserves are shown and reviewed without automatic conversion', () => {
    assert.match(app, /function creditCardPaymentReserve\(accountId,m=activeMonth\)/);
    assert.match(app, /function possibleTransferPairs\(\)/);
    assert.match(app, /id="review-card-transfers"/);
    assert.match(app, /Convert to transfer/);
    assert.match(app, /function convertPaymentPairToTransfer\(pair\)/);
    assert.match(css, /\.credit-card-payment-summary[\s\S]*\.unreserved-debt strong[\s\S]*color: var\(--red\)/);
});
test('account detail columns match the requested order and wrap payees', () => {
    assert.match(app, /<th>\s*<\/th><th>Date<\/th><th>Payee<\/th><th>Amount<\/th><th>Category<\/th><th>Status<\/th>/);
    assert.match(app, /groupedAccountRow=function\(group,accountId\)[\s\S]*amount-in[\s\S]*Split transaction/);
    assert.match(app, /function transactionPayeeMarkup\(transaction,label\)/);
    assert.match(app, /groupedAccountRow=function\(group,accountId\)[\s\S]*transactionPayeeMarkup\(t\)/);
    assert.match(css, /\.transaction-payee[\s\S]*overflow-wrap: anywhere[\s\S]*word-break: break-word/);
    assert.match(css, /\.transaction-tag[\s\S]*font-size: 10px/);
});
test('activity and account statuses render locks with cleared and reconciled styling', () => {
    assert.match(app, /function transactionStatusLockMarkup\(items\)[\s\S]*>🔒<\/span>/);
    assert.match(app, /allReconciled=group\.items\.every\(item=>item\.reconciled\)/);
    assert.match(app, /transactionPayeeMarkup\(t\)/);
    assert.match(css, /\.transaction-status-lock\.locked[\s\S]*filter: none/);
    assert.match(css, /\.transaction-status-lock\.unlocked[\s\S]*opacity: \.55/);
    assert.match(css, /\.lock-toggle\.unlocked[\s\S]*filter: grayscale\(1\)/);
});
