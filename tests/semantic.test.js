const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

test('document uses semantic page landmarks and native forms', () => {
  assert.match(html, /<header\b/);
  assert.match(html, /<main\b/);
  assert.match(html, /<nav\b/);
  assert.match(html, /<form id="auth-form"/);
  assert.match(html, /<form id="user-account-form"/);
  assert.match(html, /<table>/);
});

test('dashboard category renderer uses a semantic table with scoped headers', () => {
  assert.match(app, /<table class="budget-table">/);
  assert.match(app, /<caption class="visually-hidden">/);
  assert.match(app, /<th scope="col"><span class="visually-hidden">Category<\/span><\/th>/);
  assert.match(app, /<colgroup><col class="category-column"><col span="5" class="amount-column"><\/colgroup>/);
  assert.match(app, /<th scope="row" class="category-cell">/);
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
  assert.match(css, /\.budget-table tbody tr\.envelope \{ display: table-row/);
  assert.doesNotMatch(css, /@media\s*\(max-width/);
  assert.doesNotMatch(css, /\.category-header|\.kebab|\.category-name/);
  assert.match(css, /\.visually-hidden\s*\{/);
  assert.match(css, /\.budget-table \.category-link[^{]*\{[^}]*overflow-wrap: anywhere[^}]*word-break: break-word[^}]*white-space: normal/);
  assert.match(css, /\.budget-table \.metric\.planned button \{ color: var\(--ink\); \}/);
  assert.match(css, /\.budget-table \.metric\.remaining \{ grid-column: 2; grid-row: 2; \}/);
  assert.match(css, /\.budget-table \.metric\.planned \{ grid-column: 3; grid-row: 1; \}/);
});

test('selected app view is remembered across refreshes', () => {
  assert.match(app, /const VIEW_STORAGE_KEY = 'budgetbuddy-active-view'/);
  assert.match(app, /localStorage\.setItem\(VIEW_STORAGE_KEY,viewId\)/);
  assert.match(app, /function rememberedView\(\)/);
  assert.match(app, /setup\(\);[\s\S]*showView\(rememberedView\(\)/);
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
  assert.match(app, /transactionExtras.*splitGroupId/);
});

test('account details group split transactions and reconcile the parent', () => {
  assert.match(app, /function groupedAccountRow\(group,accountId\)/);
  assert.match(app, /data-account-split-toggle/);
  assert.match(app, /renderAccountDetail=function\(id\)[\s\S]*groups\.map\(group=>groupedAccountRow\(group,id\)\)/);
  assert.match(app, /group\.items\.forEach\(item=>\{item\.reconciled=!allReconciled;\}\)/);
});

test('activity uses the requested columns and lock status instead of row delete controls', () => {
  assert.match(html, /<th>Date<\/th><th>Payee<\/th><th>Amount<\/th><th>Category<\/th><th>Account<\/th><th>Status<\/th>/);
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

test('split detail rows align category and amount with each table layout', () => {
  assert.match(app, /splitBreakdownMarkup=function\(items\)[\s\S]*split-detail-activity/);
  assert.match(app, /splitBreakdownMarkup=function\(items\)[\s\S]*split-detail-account/);
  assert.match(css, /\.account-detail-table \.split-detail-table \.split-detail-activity \{ display: none; \}/);
  assert.match(css, /\.account-detail-table \.split-detail-table \.split-detail-account \{ display: table-row; \}/);
});

test('account detail places Amount before Category', () => {
  assert.match(app, /const accountDetailColumnOrderRender=renderAccountDetail/);
  assert.match(app, /header\.append\(cells\[4\],cells\[3\]\)/);
  assert.match(app, /groupedAccountRow=function\(group,accountId\)[\s\S]*data-edit-account-transaction[\s\S]*amount-in[\s\S]*Split transaction/);
});

test('transaction amount cells use consistent right alignment', () => {
  assert.match(css, /\.table-wrap td\.amount-in, \.table-wrap td\.amount-out, \.account-transaction-list td\.amount-in, \.account-transaction-list td\.amount-out \{ text-align: right; \}/);
  assert.match(css, /\.split-detail-table td\.amount-in, \.split-detail-table td\.amount-out \{ font-weight: 750; text-align: right; \}/);
  assert.match(css, /\.table-wrap th:nth-child\(3\), \.account-transaction-list th:nth-child\(4\) \{ text-align: right; \}/);
  assert.match(css, /\.table-wrap table, \.account-transaction-list table \{ min-width: 560px; table-layout: fixed; \}/);
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
  assert.match(app, /pullNormalizedState=async function\(\)\{await pullWithPlanRecovery\(\);await recoverPlanFromCloud\(\);\}/);
});

test('CSV monthly plans mark the selected month accepted and flush cloud save', () => {
  assert.match(app, /importCsvFile=function\(event\)/);
  assert.match(app, /state\.planMonths\[importMonth\]=true/);
  assert.match(app, /void flushCloudSave\(\)/);
  assert.match(app, /addNameToMonthLayout\(name,group,importMonth\)/);
});

test('monthly plan actions can copy previous actual spending', () => {
  assert.match(html, /id="month-copy-spending">Copy Previous Spending<\/button>/);
  assert.match(app, /function copyPreviousMonthSpending\(\)/);
  assert.match(app, /spentFor\(c\.name,prior\)/);
  assert.match(app, /month-copy-spending/);
});
