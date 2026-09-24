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

test('account transaction editor explicitly submits when Save changes is clicked', () => {
    assert.match(app, /<button type="button" class="primary" id="save-tx">Save transaction<\/button>/);
    assert.match(app, /const saveEditedTransaction=event=>\{/);
    assert.match(app, /m\.querySelector\('#save-tx'\)\.onclick=saveEditedTransaction/);
    assert.match(app, /form\.addEventListener\('submit',saveEditedTransaction\)/);
    assert.doesNotMatch(app, /form\.requestSubmit\(\)/);
});
