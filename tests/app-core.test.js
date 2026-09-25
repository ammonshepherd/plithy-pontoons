const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {
   webcrypto
}
 = require('node:crypto');
function loadApp() {
    const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
    const executable = source.replace(/\nsetup\(\);[\s\S]*$/, '');
    const elements = new Map();
    const element = (id) => elements.get(id) || elements.set(id, {
        value: '', textContent: '', innerHTML: '', className: '', hidden: false,
        focus() {
    }, select() {
    }
  }).get(id);
    let updatePayload;
    const fakeClient = {
        auth: {
            updateUser: async (payload) => {
                updatePayload = payload;
                fakeClient.auth.lastPayload = payload;
                context.window.__lastPayload = payload;
                return {
           data: {
             user: {
               id: 'user-1', email: payload.email, user_metadata: payload.data
            }
          }, error: null
        };
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
        navigator: {
       onLine: true
    },
        window: {
            BUDGETEER_SUPABASE: {
         url: 'https://example.supabase.co', publishableKey: 'test-key'
      },
            supabase: {
         createClient: () => fakeClient
      },
            addEventListener() {
      },
            currentBudgetUser: undefined
    },
        document: {
            visibilityState: 'hidden',
            addEventListener() {
      },
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
    moveGroup,moveGroupRelative,moveCategory,createGroupRecord,createCategoryRecord,availableToAssign,overAssigned,checkingCashBalance,categoryEnvelopeBalance,envelopeTotal,categorySpentThrough,creditCardPaymentReserve,totalCreditCardPaymentReserve,paymentMatchScore,possibleTransferPairs,categoryRemaining,plannedFor,hasExplicitPlan,hasSuggestedPlan,
    acceptCurrentPlan,copyPreviousMonthPlan,isMissingCloudTableError,normalizedRows,accountBalance,transactionPartsFromValues,transactionRecordsFromParts,transactionCategorySelectMarkup,passwordStrength,saveUserAccount,parseBankTransactionCsv,bankTransactionFromRow,bankImportPlan,
    setField:(id,value)=>{document.getElementById(id).value=value;},
    getUpdatePayload:()=>window.__lastPayload,
    getGroups:()=>GROUPS
  };`, context);
    return context.__budgetTest;
}
function preparedState(api) {
    const state = api.initialState();
    api.setMonth('2026-09');
    state.planMonths = {
     '2026-09': true
  };
    state.accounts = [{
     id: '11111111-1111-4111-8111-111111111111', name: 'Checking', type: 'checking', openingBalance: 0
  }];
    state.categories.Groceries.plans['2026-09'] = 500;
    state.assignments['2026-09'] = {
     Groceries: 200
  };
    api.setState(state);
    return state;
}
test('expense, income, and split transaction parts are validated', () => {
    const api = loadApp();
    assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({
     type: 'income', amount: 125
  }))), [{
     category: '', amount: 125
  }]);
    assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({
     type: 'expense', amount: 12.34, category: 'Groceries'
  }))), [{
     category: 'Groceries', amount: 12.34
  }]);
    assert.deepEqual(JSON.parse(JSON.stringify(api.transactionPartsFromValues({
     type: 'expense', split: true, amount: 20, splitCategories: ['Groceries', 'General'], splitAmounts: [12.5, 7.5]
  }))), [
      {
     category: 'Groceries', amount: 12.5
  }, {
     category: 'General', amount: 7.5
  }
    ]);
    assert.throws(() => api.transactionPartsFromValues({
     type: 'expense', split: true, amount: 20, splitCategories: ['Groceries', 'General'], splitAmounts: [12, 7]
  }), /equal/);
    const records = api.transactionRecordsFromParts([{
     category: 'Groceries', amount: 20
  }, {
     category: 'General', amount: 5
  }], {
     type: 'expense', date: '2026-09-23', payee: 'Store', accountId: 'account-1', cleared: true, tag: 'Test'
  });
    assert.equal(records.length, 2);
    assert.ok(records[0].splitGroupId);
    assert.equal(records[0].splitGroupId, records[1].splitGroupId);
    assert.deepEqual(records.map(record => record.splitIndex), [0, 1]);
    assert.deepEqual(JSON.parse(JSON.stringify(records.map(({
     type, date, amount, category, cleared, tag
  }) => ({
     type, date, amount, category, cleared, tag
  })))), [
      {
     type: 'expense', date: '2026-09-23', amount: 20, category: 'Groceries', cleared: true, tag: 'Test'
  },
      {
     type: 'expense', date: '2026-09-23', amount: 5, category: 'General', cleared: true, tag: 'Test'
  }
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
    state.accounts[0].openingBalance = 400;
    state.openingFundsMonth = '2026-09';
    api.addNameToMonthLayout('Groceries', 'Monthly Autopay');
    assert.ok(api.monthGroups('2026-09').find(([name]) => name === 'Monthly Autopay')[1].includes('Groceries'));
    api.renameNameInMonthLayouts('Groceries', 'Food');
    assert.ok(api.monthGroups('2026-09').some(([, names]) => names.includes('Food')));
    api.removeNameFromMonthLayout('Food', '2026-09');
    assert.ok(!api.monthGroups('2026-09').some(([, names]) => names.includes('Food')));
    api.setState(state);
    api.replaceSideEffects(() => {
  }, () => {
  }, () => {
  });
    api.moveCategory('Groceries', 'Weekly Basics', 'Other Stuff');
    assert.ok(api.monthGroups('2026-09').find(([group,names]) => group === 'Other Stuff' && names.includes('Groceries')));
});
test('new groups and categories are created in the selected month layout', () => {
    const api = loadApp();
    const state = preparedState(api);
    api.createGroupRecord('New Group', '2026-09');
    api.createCategoryRecord('New Category', 'New Group', {
     note: 'Test note'
  }, '2026-09');
    assert.ok(api.monthGroups('2026-09').some(([group,names]) => group === 'New Group' && names.includes('New Category')));
    assert.equal(api.category('New Category').note, 'Test note');
    assert.throws(() => api.createGroupRecord('New Group', '2026-09'), /already exists/);
    assert.throws(() => api.createCategoryRecord('New Category', 'New Group', {
  }, '2026-09'), /already exists/);
    assert.ok(state.categories['New Category']);
});
test('groups can be reordered and state tracks the new order', () => {
    const api = loadApp();
    api.setState(api.initialState());
    api.replaceSideEffects(() => {
  }, () => {
  }, () => {
  });
    api.moveGroup('Other Stuff', 'Weekly Basics');
    assert.equal(api.monthGroups('2026-09')[0][0], 'Other Stuff');
});
test('group move controls reorder the active month layout and persist it', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-09');
    api.setState(state);
    api.replaceSideEffects(() => {
    }, () => {
    }, () => {
    });
    api.moveGroupRelative('Weekly Basics', 1);
    assert.equal(api.monthGroups('2026-09')[1][0], 'Weekly Basics');
    assert.equal(api.getState().monthLayouts['2026-09'].groups[1][0], 'Weekly Basics');
});
test('lowering an account opening balance exposes the amount over assigned', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-09');
    state.openingFundsMonth = '2026-09';
    state.accounts = [{
     id: 'account-1', name: 'Checking', type: 'checking', openingBalance: 4000
  }];
    state.assignments['2026-09'] = { Groceries: 4615.61 };
    api.setState(state);
    assert.equal(api.availableToAssign('2026-09'), -615.61);
    assert.equal(api.overAssigned('2026-09'), 615.61);
    state.accounts[0].openingBalance = 5000;
    api.setState(state);
    assert.equal(api.availableToAssign('2026-09'), 384.39);
    assert.equal(api.overAssigned('2026-09'), 0);
});
test('available-to-assign uses cumulative checking cash and carried-forward envelopes', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-02');
    state.openingFundsMonth = '2026-01';
    state.accounts = [{
     id: 'checking-1', name: 'Checking', type: 'checking', openingBalance: 1000
  }];
    state.transactions = [
     { id: 'income-jan', type: 'income', date: '2026-01-01', amount: 500, accountId: 'checking-1' },
     { id: 'expense-jan', type: 'expense', date: '2026-01-15', amount: 100, category: 'Groceries', accountId: 'checking-1' },
     { id: 'income-feb', type: 'income', date: '2026-02-01', amount: 300, accountId: 'checking-1' },
     { id: 'expense-feb', type: 'expense', date: '2026-02-02', amount: 50, category: 'Groceries', accountId: 'checking-1' }
  ];
    state.assignments = {
     '2026-01': { Groceries: 200 },
     '2026-02': { Groceries: 100 }
  };
    api.setState(state);
    assert.equal(api.checkingCashBalance('2026-02'), 1650);
    assert.equal(api.categoryEnvelopeBalance('Groceries', '2026-02'), 150);
    assert.equal(api.envelopeTotal('2026-02'), 150);
    assert.equal(api.availableToAssign('2026-02'), 1500);
});
test('checking transfers do not change cumulative checking cash', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-02');
    state.openingFundsMonth = '2026-01';
    state.accounts = [
     { id: 'checking-1', name: 'Checking 1', type: 'checking', openingBalance: 1000 },
     { id: 'checking-2', name: 'Checking 2', type: 'checking', openingBalance: 500 }
  ];
    state.transactions = [{ id: 'transfer-1', type: 'transfer', date: '2026-02-01', amount: 200, accountId: 'checking-1', toAccountId: 'checking-2' }];
    api.setState(state);
    assert.equal(api.checkingCashBalance('2026-02'), 1500);
});
test('planned amounts, suggestions, and plan approval work by month', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-09');
    state.transactions.push({
     id: 't1', type: 'expense', date: '2026-08-10', amount: 63.21, category: 'Groceries', accountId: 'a1'
  });
    api.setState(state);
    assert.equal(api.plannedFor('Groceries', '2026-09'), 63.21);
    assert.equal(api.hasSuggestedPlan('2026-09'), true);
    api.replaceSideEffects(() => {
  }, () => {
  }, () => {
  });
    api.acceptCurrentPlan();
    assert.equal(api.hasExplicitPlan('2026-09'), true);
    assert.equal(api.getState().categories.Groceries.plans['2026-09'], 63.21);
    api.setMonth('2026-10');
    api.copyPreviousMonthPlan();
    assert.equal(api.getState().categories.Groceries.plans['2026-10'], 63.21);
});
test('available-to-assign uses current cash less assignments, while remaining subtracts spending', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.openingFunds = 100;
    state.openingFundsMonth = '2026-09';
    state.transactions.push({
     id: 'income-1', type: 'income', date: '2026-09-01', amount: 400, category: '', accountId: state.accounts[0].id
  });
    state.transactions.push({
     id: 'expense-1', type: 'expense', date: '2026-09-02', amount: 25.5, category: 'Groceries', accountId: state.accounts[0].id
  });
    api.setState(state);
    assert.equal(api.availableToAssign('2026-09'), 274.5);
    assert.equal(api.categoryRemaining('Groceries', '2026-09'), 174.5);
});
test('available-to-assign uses account opening balances once instead of stale aggregate opening funds', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.openingFunds = 5231.22;
    state.openingFundsMonth = '2026-09';
    state.accounts[0].openingBalance = 4615.61;
    state.assignments['2026-09'] = {
  };
    api.setState(state);
    assert.equal(api.availableToAssign('2026-09'), 4615.61);
});
test('account balance reflects an edited checking opening balance and transactions', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.accounts[0].openingBalance = 1250.50;
    state.transactions.push({
     id: 'income-2', type: 'income', date: '2026-09-03', amount: 300, category: '', accountId: state.accounts[0].id
  });
    state.transactions.push({
     id: 'expense-2', type: 'expense', date: '2026-09-04', amount: 75.25, category: 'Groceries', accountId: state.accounts[0].id
  });
    api.setState(state);
    assert.equal(api.accountBalance(api.getState().accounts[0]), 1475.25);
});
test('normalized persistence rows include accounts, categories, plans, transactions, and accepted months', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.transactions.push({
     id: '22222222-2222-4222-8222-222222222222', type: 'expense', date: '2026-09-02', amount: 10, category: 'Groceries', accountId: state.accounts[0].id, cleared: true
  });
    api.setState(state);
    api.setUser({
     id: '33333333-3333-4333-8333-333333333333', email: 'test@example.com'
  });
    api.setHousehold('44444444-4444-4444-8444-444444444444');
    const rows = api.normalizedRows();
    assert.equal(rows.categories.find(row => row.name === 'Groceries').household_id, '44444444-4444-4444-8444-444444444444');
    assert.equal(rows.accounts.length, 1);
    assert.equal(rows.transactions[0].category_id, state.categories.Groceries.id);
    assert.equal(rows.monthly.find(row => row.category_id === state.categories.Groceries.id).planned, 500);
    assert.equal(rows.monthly.find(row => row.category_id === state.categories.Groceries.id).assigned, 200);
    assert.deepEqual(JSON.parse(JSON.stringify(rows.months)), [{
     household_id: '44444444-4444-4444-8444-444444444444', month_start: '2026-09-01'
  }]);
});
test('strong-password validation and user account updates build the expected payload', async () => {
    const api = loadApp();
    assert.equal(api.passwordStrength('short').valid, false);
    assert.equal(api.passwordStrength('StrongPassword9!').valid, true);
    api.setUser({
     id: 'user-1', email: 'old@example.com', user_metadata: {
    }
  });
    api.setField('user-email', 'new@example.com');
    api.setField('user-display-name', 'Ammon');
    api.setField('user-password', 'StrongPassword9!');
    api.setField('user-password-confirm', 'StrongPassword9!');
    api.setField('user-account-message', '');
    api.setField('user-password-strength', '');
    await api.saveUserAccount({
     preventDefault() {
    }
  });
    assert.deepEqual(JSON.parse(JSON.stringify(api.getUpdatePayload())), {
     email: 'new@example.com', data: {
       display_name: 'Ammon'
    }, password: 'StrongPassword9!'
  });
});
test('bank CSV parsing and matching reconciles manual transactions without duplicating them', () => {
    const api = loadApp();
    const state = api.initialState();
    const accountId = '11111111-1111-4111-8111-111111111111';
    state.accounts = [{
     id: accountId, name: 'Checking', type: 'checking', openingBalance: 0
  }];
    state.transactions = [{
     id: 'manual-1', type: 'expense', date: '2026-09-20', amount: 45.67, payee: 'Grocery, Store', memo: '', accountId, category: 'Groceries', cleared: false
  }];
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
test('credit card CSV parsing maps Debit and Credit to signed account transactions', () => {
    const api = loadApp();
    const state = api.initialState();
    const accountId = '22222222-2222-4222-8222-222222222222';
    state.accounts = [{
     id: accountId, name: 'Credit Card', type: 'credit', openingBalance: 0
  }];
    api.setState(state);
    const rows = api.parseBankTransactionCsv('Transaction Date,Posted Date,Card No.,Description,Category,Debit,Credit\n2026-09-23,2026-09-24,4160,JODY MOORE COACHING,Other Services,59.00,\n2026-09-23,2026-09-24,4160,AMAZON MKTPLACE PMTS,Merchandise,,6.86');
    assert.equal(rows.length, 2);
    assert.equal(rows[0].sourceFormat, 'credit-card');
    assert.equal(rows[0].date, '2026-09-23');
    assert.equal(rows[0].description, 'JODY MOORE COACHING');
    assert.equal(rows[0].amount, -59);
    assert.equal(rows[1].amount, 6.86);
    const purchase = api.bankTransactionFromRow(rows[0], accountId);
    const payment = api.bankTransactionFromRow(rows[1], accountId);
    assert.equal(purchase.type, 'expense');
    assert.equal(purchase.amount, 59);
    assert.equal(payment.type, 'income');
    assert.equal(payment.amount, 6.86);
    assert.equal(purchase.accountId, accountId);
});
test('credit card purchases reserve cash without changing Available to Assign', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.accounts[0].openingBalance = 400;
    state.openingFundsMonth = '2026-09';
    const cardId = '33333333-3333-4333-8333-333333333333';
    state.accounts.push({ id: cardId, name: 'Credit Card', type: 'credit', openingBalance: -500 });
    state.transactions.push({ id: 'card-purchase', type: 'expense', date: '2026-09-23', amount: 50, payee: 'Card purchase', accountId: cardId, category: 'Groceries' });
    api.setState(state);
    assert.equal(api.creditCardPaymentReserve(cardId, '2026-09'), 50);
    assert.equal(api.totalCreditCardPaymentReserve('2026-09'), 50);
    assert.equal(api.availableToAssign('2026-09'), 200);
});
test('credit card payments release reserves and reduce debt without creating income', () => {
    const api = loadApp();
    const state = preparedState(api);
    state.accounts[0].openingBalance = 400;
    state.openingFundsMonth = '2026-09';
    const checkingId = state.accounts[0].id;
    const cardId = '44444444-4444-4444-8444-444444444444';
    state.accounts.push({ id: cardId, name: 'Credit Card', type: 'credit', openingBalance: -500 });
    state.transactions.push(
      { id: 'card-purchase', type: 'expense', date: '2026-09-20', amount: 100, payee: 'Card purchase', accountId: cardId, category: 'Groceries' },
      { id: 'card-payment', type: 'transfer', date: '2026-09-23', amount: 40, payee: 'Credit Card Payment', accountId: checkingId, toAccountId: cardId }
    );
    api.setState(state);
    assert.equal(api.creditCardPaymentReserve(cardId, '2026-09'), 60);
    assert.equal(api.accountBalance(state.accounts[1]), -560);
    assert.equal(api.availableToAssign('2026-09'), 200);
});
test('credit card refunds restore their category and release the reserved amount', () => {
    const api = loadApp();
    const state = preparedState(api);
    const cardId = '55555555-5555-4555-8555-555555555555';
    state.accounts.push({ id: cardId, name: 'Credit Card', type: 'credit', openingBalance: 0 });
    state.transactions.push(
      { id: 'card-purchase', type: 'expense', date: '2026-09-20', amount: 100, payee: 'Card purchase', accountId: cardId, category: 'Groceries' },
      { id: 'card-refund', type: 'income', date: '2026-09-22', amount: 25, payee: 'Refund', accountId: cardId, category: 'Groceries' }
    );
    api.setState(state);
    assert.equal(api.categorySpentThrough('Groceries', '2026-09'), 75);
    assert.equal(api.creditCardPaymentReserve(cardId, '2026-09'), 75);
});
test('payment matching recognizes bank abbreviations such as online pymt', () => {
    const api = loadApp();
    const state = api.initialState();
    const checkingId = '66666666-6666-4666-8666-666666666666';
    const cardId = '77777777-7777-4777-8777-777777777777';
    state.accounts = [
      { id: checkingId, name: 'Checking', type: 'checking', openingBalance: 0 },
      { id: cardId, name: 'Visa', type: 'credit', openingBalance: -500 }
    ];
    state.transactions = [
      { id: 'checking-payment', type: 'expense', date: '2026-09-20', amount: 123.45, payee: 'Online Visa Payment', accountId: checkingId },
      { id: 'card-payment', type: 'income', date: '2026-09-21', amount: 123.45, payee: 'VISA ONLINE PYMT', accountId: cardId }
    ];
    api.setState(state);
    const pairs = api.possibleTransferPairs();
    assert.equal(pairs.length, 1);
    assert.equal(pairs[0].checking.id, 'checking-payment');
    assert.equal(pairs[0].card.id, 'card-payment');
});
test('payment matching scores exact amounts, dates, and payee evidence', () => {
    const api = loadApp();
    const sameDay = api.paymentMatchScore(
      { amount: 100, date: '2026-09-20', payee: 'Visa payment' },
      { amount: 100, date: '2026-09-20', payee: 'Online pymt' },
      ['Visa']
    );
    const reviewOnly = api.paymentMatchScore(
      { amount: 100, date: '2026-09-20', payee: 'Bank entry' },
      { amount: 100, date: '2026-09-23', payee: 'Account credit' },
      ['Visa']
    );
    assert.equal(sameDay.confidence, 'High');
    assert.equal(reviewOnly.confidence, 'Review');
    assert.equal(api.paymentMatchScore(
      { amount: 100, date: '2026-09-20', payee: 'Payment' },
      { amount: 101, date: '2026-09-20', payee: 'Payment' },
      ['Visa']
    ), null);
    assert.equal(api.paymentMatchScore(
      { amount: 100, date: '2026-09-20', payee: 'Payment' },
      { amount: 100, date: '2026-09-28', payee: 'Payment' },
      ['Visa']
    ), null);
});

test('cloud wipe treats missing legacy tables as already clean', () => {
    const api = loadApp();
    assert.equal(api.isMissingCloudTableError({ code: '42P01', message: 'relation "category_transfers" does not exist' }), true);
    assert.equal(api.isMissingCloudTableError({ code: 'PGRST205', message: "Could not find the table 'public.reconciliations' in the schema cache" }), true);
    assert.equal(api.isMissingCloudTableError({ code: '42501', message: 'new row violates row-level security policy' }), false);
    assert.equal(api.isMissingCloudTableError({ code: '23503', message: 'foreign key violation' }), false);
});

test('categorized spending and excess credit-card payments do not release assigned money', () => {
    const api = loadApp();
    const state = api.initialState();
    api.setMonth('2026-09');
    const checkingId = '88888888-8888-4888-8888-888888888888';
    const cardId = '99999999-9999-4999-8999-999999999999';
    state.openingFundsMonth = '2026-09';
    state.accounts = [
      { id: checkingId, name: 'Checking', type: 'checking', openingBalance: 500 },
      { id: cardId, name: 'Card', type: 'credit', openingBalance: -100 }
    ];
    state.transactions = [
      { id: 'card-purchase', type: 'expense', date: '2026-09-01', amount: 50, category: 'Groceries', accountId: cardId },
      { id: 'card-payment', type: 'transfer', date: '2026-09-02', amount: 150, accountId: checkingId, toAccountId: cardId }
    ];
    state.assignments['2026-09'] = { Groceries: 350 };
    api.setState(state);
    assert.equal(api.checkingCashBalance('2026-09'), 350);
    assert.equal(api.availableToAssign('2026-09'), 0);
    assert.equal(api.categoryRemaining('Groceries', '2026-09'), 300);
});
