const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const { webcrypto } = require('node:crypto');

function loadApp() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const executable = source.replace(/\nsetup\(\);[\s\S]*$/, '');
  const elements = new Map();
  const element = (id) => elements.get(id) || elements.set(id, {
    value: '', textContent: '', innerHTML: '', className: '', hidden: false,
    focus() {}, select() {}
  }).get(id);
  let updatePayload;
  const fakeClient = {
    auth: {
      updateUser: async (payload) => {
        updatePayload = payload;
        fakeClient.auth.lastPayload = payload;
        context.window.__lastPayload = payload;
        return { data: { user: { id: 'user-1', email: payload.email, user_metadata: payload.data } }, error: null };
      }
    }
  };
  const context = {
    console,
    crypto: webcrypto,
    Intl,
    Date,
    Number,
    String,
    Object,
    Array,
    Math,
    JSON,
    Promise,
    URL,
    Blob,
    setTimeout,
    clearTimeout,
    setInterval: () => 1,
    navigator: { onLine: true },
    window: {
      BUDGETEER_SUPABASE: { url: 'https://example.supabase.co', publishableKey: 'test-key' },
      supabase: { createClient: () => fakeClient },
      addEventListener() {},
      currentBudgetUser: undefined
    },
    document: {
      visibilityState: 'hidden',
      addEventListener() {},
      getElementById: element,
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => element('created')
    }
  };
  context.globalThis = context;
  vm.runInNewContext(`${executable}\n;globalThis.__budgetTest={
    getState:()=>state,
    setState:value=>{state=value;GROUPS=cloneGroups(value.groups||[]);},
    setMonth:value=>{activeMonth=value;},
    setUser:value=>{window.currentBudgetUser=value;},
    setHousehold:value=>{cloudHouseholdId=value;},
    replaceSideEffects:(saveFn,renderFn,messageFn)=>{save=saveFn;render=renderFn;appMessage=messageFn;},
    initialState,blankState,category,monthGroups,addNameToMonthLayout,removeNameFromMonthLayout,renameNameInMonthLayouts,
    moveGroup,moveCategory,createGroupRecord,createCategoryRecord,availableToAssign,categoryRemaining,plannedFor,hasExplicitPlan,hasSuggestedPlan,
    acceptCurrentPlan,copyPreviousMonthPlan,normalizedRows,accountBalance,transactionPartsFromValues,transactionRecordsFromParts,transactionCategorySelectMarkup,passwordStrength,saveUserAccount,parseBankTransactionCsv,bankTransactionFromRow,bankImportPlan,
    setField:(id,value)=>{document.getElementById(id).value=value;},
    getUpdatePayload:()=>window.__lastPayload,
    getGroups:()=>GROUPS
  };`, context);
  return context.__budgetTest;
}

function preparedState(api) {
  const state = api.initialState();
  api.setMonth('2026-09');
  state.planMonths = { '2026-09': true };
  state.accounts = [{ id: '11111111-1111-4111-8111-111111111111', name: 'Checking', type: 'checking', openingBalance: 0 }];
  state.categories.Groceries.plans['2026-09'] = 500;
  state.assignments['2026-09'] = { Groceries: 200 };
  api.setState(state);
  return state;
}

test('expense, income, and split transaction parts are validated', () => {
  const api = loadApp();
  assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({ type: 'income', amount: 125 }))), [{ category: '', amount: 125 }]);
  assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({ type: 'expense', amount: 12.34, category: 'Groceries' }))), [{ category: 'Groceries', amount: 12.34 }]);
  assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({ type: 'expense', split: true, amount: 20, splitCategories: ['Groceries', 'General'], splitAmounts: [12.5, 7.5] }))), [
    { category: 'Groceries', amount: 12.5 }, { category: 'General', amount: 7.5 }
  ]);
  assert.throws(() => api.transactionPartsFromValues({ type: 'expense', split: true, amount: 20, splitCategories: ['Groceries', 'General'], splitAmounts: [12, 7] }), /equal/);
  const records = api.transactionRecordsFromParts([{ category: 'Groceries', amount: 20 }, { category: 'General', amount: 5 }], { type: 'expense', date: '2026-09-23', payee: 'Store', accountId: 'account-1', cleared: true, tag: 'Test' });
  assert.equal(records.length, 2);
  assert.ok(records[0].splitGroupId);
  assert.equal(records[0].splitGroupId, records[1].splitGroupId);
  assert.deepEqual(records.map(record => record.splitIndex), [0, 1]);
  assert.deepEqual(JSON.parse(JSON.stringify(records.map(({ type, date, amount, category, cleared, tag }) => ({ type, date, amount, category, cleared, tag })))), [
    { type: 'expense', date: '2026-09-23', amount: 20, category: 'Groceries', cleared: true, tag: 'Test' },
    { type: 'expense', date: '2026-09-23', amount: 5, category: 'General', cleared: true, tag: 'Test' }
  ]);
});

test('transaction category selects preserve groups, order, and Remaining balances', () => {
  const api = loadApp();
  preparedState(api);
  const markup = api.transactionCategorySelectMarkup('category-select', 'Groceries');
  assert.match(markup, /<select[^>]+name="category"/);
  assert.match(markup, /<optgroup label="Weekly Basics">/);
  assert.match(markup, /Groceries — \$200\.00/);
});

test('category layouts support adding, moving, removing, and renaming categories', () => {
  const api = loadApp();
  const state = preparedState(api);
  api.addNameToMonthLayout('Groceries', 'Monthly Autopay');
  assert.ok(api.monthGroups('2026-09').find(([name]) => name === 'Monthly Autopay')[1].includes('Groceries'));
  api.renameNameInMonthLayouts('Groceries', 'Food');
  assert.ok(api.monthGroups('2026-09').some(([, names]) => names.includes('Food')));
  api.removeNameFromMonthLayout('Food', '2026-09');
  assert.ok(!api.monthGroups('2026-09').some(([, names]) => names.includes('Food')));
  api.setState(state);
  api.replaceSideEffects(() => {}, () => {}, () => {});
  api.moveCategory('Groceries', 'Weekly Basics', 'Other Stuff');
  assert.ok(api.monthGroups('2026-09').find(([group,names]) => group === 'Other Stuff' && names.includes('Groceries')));
});

test('new groups and categories are created in the selected month layout', () => {
  const api = loadApp();
  const state = preparedState(api);
  api.createGroupRecord('New Group', '2026-09');
  api.createCategoryRecord('New Category', 'New Group', { note: 'Test note' }, '2026-09');
  assert.ok(api.monthGroups('2026-09').some(([group,names]) => group === 'New Group' && names.includes('New Category')));
  assert.equal(api.category('New Category').note, 'Test note');
  assert.throws(() => api.createGroupRecord('New Group', '2026-09'), /already exists/);
  assert.throws(() => api.createCategoryRecord('New Category', 'New Group', {}, '2026-09'), /already exists/);
  assert.ok(state.categories['New Category']);
});

test('groups can be reordered and state tracks the new order', () => {
  const api = loadApp();
  api.setState(api.initialState());
  api.replaceSideEffects(() => {}, () => {}, () => {});
  api.moveGroup('Other Stuff', 'Weekly Basics');
  assert.equal(api.monthGroups('2026-09')[0][0], 'Other Stuff');
});

test('planned amounts, suggestions, and plan approval work by month', () => {
  const api = loadApp();
  const state = api.initialState();
  api.setMonth('2026-09');
  state.transactions.push({ id: 't1', type: 'expense', date: '2026-08-10', amount: 63.21, category: 'Groceries', accountId: 'a1' });
  api.setState(state);
  assert.equal(api.plannedFor('Groceries', '2026-09'), 63.21);
  assert.equal(api.hasSuggestedPlan('2026-09'), true);
  api.replaceSideEffects(() => {}, () => {}, () => {});
  api.acceptCurrentPlan();
  assert.equal(api.hasExplicitPlan('2026-09'), true);
  assert.equal(api.getState().categories.Groceries.plans['2026-09'], 63.21);
  api.setMonth('2026-10');
  api.copyPreviousMonthPlan();
  assert.equal(api.getState().categories.Groceries.plans['2026-10'], 63.21);
});

test('available-to-assign includes income and opening funds, while remaining subtracts spending', () => {
  const api = loadApp();
  const state = preparedState(api);
  state.openingFunds = 100;
  state.openingFundsMonth = '2026-09';
  state.transactions.push({ id: 'income-1', type: 'income', date: '2026-09-01', amount: 400, category: '', accountId: 'a1' });
  state.transactions.push({ id: 'expense-1', type: 'expense', date: '2026-09-02', amount: 25.5, category: 'Groceries', accountId: 'a1' });
  api.setState(state);
  assert.equal(api.availableToAssign('2026-09'), 300);
  assert.equal(api.categoryRemaining('Groceries', '2026-09'), 174.5);
});


test('available-to-assign uses account opening balances once instead of stale aggregate opening funds', () => {
  const api = loadApp();
  const state = preparedState(api);
  state.openingFunds = 5231.22;
  state.openingFundsMonth = '2026-09';
  state.accounts[0].openingBalance = 4615.61;
  state.assignments['2026-09'] = {};
  api.setState(state);
  assert.equal(api.availableToAssign('2026-09'), 4615.61);
});

test('account balance reflects an edited checking opening balance and transactions', () => {
  const api = loadApp();
  const state = preparedState(api);
  state.accounts[0].openingBalance = 1250.50;
  state.transactions.push({ id: 'income-2', type: 'income', date: '2026-09-03', amount: 300, category: '', accountId: state.accounts[0].id });
  state.transactions.push({ id: 'expense-2', type: 'expense', date: '2026-09-04', amount: 75.25, category: 'Groceries', accountId: state.accounts[0].id });
  api.setState(state);
  assert.equal(api.accountBalance(api.getState().accounts[0]), 1475.25);
});

test('normalized persistence rows include accounts, categories, plans, transactions, and accepted months', () => {
  const api = loadApp();
  const state = preparedState(api);
  state.transactions.push({ id: '22222222-2222-4222-8222-222222222222', type: 'expense', date: '2026-09-02', amount: 10, category: 'Groceries', accountId: state.accounts[0].id, cleared: true });
  api.setState(state);
  api.setUser({ id: '33333333-3333-4333-8333-333333333333', email: 'test@example.com' });
  api.setHousehold('44444444-4444-4444-8444-444444444444');
  const rows = api.normalizedRows();
  assert.equal(rows.categories.find(row => row.name === 'Groceries').household_id, '44444444-4444-4444-8444-444444444444');
  assert.equal(rows.accounts.length, 1);
  assert.equal(rows.transactions[0].category_id, state.categories.Groceries.id);
  assert.equal(rows.monthly.find(row => row.category_id === state.categories.Groceries.id).planned, 500);
  assert.equal(rows.monthly.find(row => row.category_id === state.categories.Groceries.id).assigned, 200);
  assert.deepEqual(JSON.parse(JSON.stringify(rows.months)), [{ household_id: '44444444-4444-4444-8444-444444444444', month_start: '2026-09-01' }]);
});

test('strong-password validation and user account updates build the expected payload', async () => {
  const api = loadApp();
  assert.equal(api.passwordStrength('short').valid, false);
  assert.equal(api.passwordStrength('StrongPassword9!').valid, true);
  api.setUser({ id: 'user-1', email: 'old@example.com', user_metadata: {} });
  api.setField('user-email', 'new@example.com');
  api.setField('user-display-name', 'Ammon');
  api.setField('user-password', 'StrongPassword9!');
  api.setField('user-password-confirm', 'StrongPassword9!');
  api.setField('user-account-message', '');
  api.setField('user-password-strength', '');
  await api.saveUserAccount({ preventDefault() {} });
  assert.deepEqual(JSON.parse(JSON.stringify(api.getUpdatePayload())), { email: 'new@example.com', data: { display_name: 'Ammon' }, password: 'StrongPassword9!' });
});

test('bank CSV parsing and matching reconciles manual transactions without duplicating them', () => {
  const api = loadApp();
  const state = api.initialState();
  const accountId = '11111111-1111-4111-8111-111111111111';
  state.accounts = [{ id: accountId, name: 'Checking', type: 'checking', openingBalance: 0 }];
  state.transactions = [{ id: 'manual-1', type: 'expense', date: '2026-09-20', amount: 45.67, payee: 'Grocery, Store', memo: '', accountId, category: 'Groceries', cleared: false }];
  api.setState(state);
  const rows = api.parseBankTransactionCsv('Account ID,Transaction ID,Date,Description,Check Number,Category,Tags,Amount,Balance\nacct,bank-1,09/20/26,"Grocery, Store",,,,"-$45.67","$1,000.00"\nacct,bank-2,09/21/26,Payroll,,,,"$2,000.00","$3,000.00"');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].amount, -45.67);
  assert.equal(rows[0].date, '2026-09-20');
  assert.equal(rows[0].description, 'Grocery, Store');
  const plan = api.bankImportPlan(accountId, rows);
  assert.equal(plan[0].match.id, 'manual-1');
  assert.equal(plan[1].match, null);
  const importedExpense = api.bankTransactionFromRow(rows[0], accountId);
  assert.equal(importedExpense.category, 'Uncategorized');
  assert.ok(api.getState().categories.Uncategorized);
  const imported = api.bankTransactionFromRow(rows[1], accountId);
  assert.equal(imported.type, 'income');
  assert.equal(imported.amount, 2000);
  assert.equal(imported.accountId, accountId);
});
