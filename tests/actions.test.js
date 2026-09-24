const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

test('every static action control has application wiring', () => {
    const expectedActions = {
        'accept-current-plan': 'acceptCurrentPlan',
        'add-account': 'openAccount',
        'add-assignment': 'openAssignment',
        'add-category': 'openCategoryModal',
        'add-group': 'openGroupModal',
        'add-transaction': 'openTransaction',
        'backup-btn': 'backup',
        'header-add': 'openTransaction',
        'month-copy-plan': 'copyPreviousMonthPlan',
        'month-copy-spending': 'copyPreviousMonthSpending',
        'month-import-plan': 'openPlanCsvImport',
        'next-month': 'shiftMonth(1)',
        'prev-month': 'shiftMonth(-1)',
        'restore-btn': 'restore-input',
        'sign-out': 'signOut',
        'today-month': 'activeMonth=monthKey()',
        'user-account-back': 'settings-view',
        'user-account-link': 'user-account-view',
        'wipe-budget': 'wipeBudget'
    };
    for (const [id, action] of Object.entries(expectedActions)) {
        assert.match(html, new RegExp(`id="${id}"`), `${id} is missing from the document`);
        assert.match(app, new RegExp(action.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${id} is not wired to ${action}`);
    }
});

test('forms, delegated controls, and generated actions have handlers', () => {
    assert.match(app, /document\.getElementById\('auth-form'\)/);
    assert.match(app, /addEventListener\('submit'/);
    assert.match(app, /querySelectorAll\('\.nav-item'\)/);
    assert.match(app, /showView\(b\.dataset\.view,b\.dataset\.view\)/);
    assert.match(app, /\[data-edit-transaction\]/);
    assert.match(app, /\[data-edit-account-transaction\]/);
    assert.match(app, /\[data-delete-transaction\]/);
    assert.match(app, /\[data-delete-account-transaction\]/);
    assert.match(app, /\[data-toggle-reconciled\]/);
    assert.match(app, /\[data-account-split-toggle\]/);
    assert.match(app, /\[data-split-toggle\]/);
    assert.match(app, /\[data-category-option\]/);
    assert.match(app, /\[data-close\]/);
});

test('transaction add and edit modals use native form submission', () => {
    assert.equal((app.match(/function openTransaction\(/g) || []).length, 1);
    assert.equal((app.match(/function openTransactionV/g) || []).length, 0);
    assert.equal((app.match(/id="transaction-form"/g) || []).length, 1);
    assert.equal((app.match(/id="transaction-edit-form"/g) || []).length, 1);
    assert.match(app, /<button type="submit" class="primary" id="save-tx">Save transaction<\/button>/);
    assert.match(app, /const saveEditedTransaction=event=>\{/);
    assert.match(app, /form\.addEventListener\('submit',saveEditedTransaction\)/);
    assert.doesNotMatch(app, /m\.querySelector\('#save-tx'\)\.onclick/);
    assert.doesNotMatch(app, /requestSubmit/);
});

test('clicking an edit Save transaction submit button changes the transaction', () => {
    const transaction = { payee: 'Original payee' };
    const form = new EventTarget();
    const saveButton = {
        type: 'submit',
        click() {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    };
    form.addEventListener('submit', event => {
        event.preventDefault();
        transaction.payee = 'Updated payee';
    });

    saveButton.click();

    assert.equal(transaction.payee, 'Updated payee');
});
