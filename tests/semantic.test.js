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
