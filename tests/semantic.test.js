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
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /\.budget-table tbody tr\.envelope \{ display: table-row/);
});

test('cloud refresh uses lifecycle events without interval polling', () => {
  assert.match(app, /window\.addEventListener\('focus',refreshBudgetFromCloud\)/);
  assert.match(app, /document\.addEventListener\('visibilitychange'/);
  assert.match(app, /window\.addEventListener\('online'/);
  assert.doesNotMatch(app, /setInterval\(/);
});
