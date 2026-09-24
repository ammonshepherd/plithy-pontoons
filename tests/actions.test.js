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

test('saving an Assigned edit rerenders the Available to assign summary', () => {
    assert.match(app, /beginInlineAssignment=function\(button,name\)[\s\S]*void flushCloudSave\(\);\s*render\(\);/);
    assert.match(html, /id="available-summary"/);
});

test('available card uses green money styling', () => {
    const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
    assert.match(css, /\.available-card\s*\{[\s\S]*border:\s*6px solid var\(--green\)[\s\S]*background:\s*#effbf5/);
    assert.match(css, /\.available-card strong\s*\{[\s\S]*font-size:\s*30px[\s\S]*color:\s*var\(--green\)/);
});

test('over-assigned warning has a red card and reassign guidance', () => {
    assert.match(app, /function overAssigned\(m=activeMonth\)/);
    assert.match(app, /class="summary-card over-assigned-card"/);
    assert.match(app, /Reassign money from categories until this amount reaches/);
    const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
    assert.match(css, /\.over-assigned-card\s*\{[\s\S]*border:\s*6px solid var\(--red\)[\s\S]*background:\s*#fff1f2/);
    assert.match(css, /\.over-assigned-card strong\s*\{[\s\S]*font-size:\s*30px[\s\S]*color:\s*var\(--red\)/);
});

test('account detail edits save and survive refresh', () => {
    assert.match(app, /const ACCOUNT_DETAIL_STORAGE_KEY = 'budgetbuddy-active-account'/);
    assert.match(app, /openAccountTransactions=function\(id\)[\s\S]*localStorage\.setItem\(ACCOUNT_DETAIL_STORAGE_KEY,id\)/);
    assert.match(app, /const detailIsOpen=activeAccountDetailId===id;[\s\S]*if\(detailIsOpen\)renderAccountDetail\(id\);else render\(\)/);
    assert.match(app, /rememberedView\(\)==='accounts-view'[\s\S]*localStorage\.getItem\(ACCOUNT_DETAIL_STORAGE_KEY\)/);
    assert.match(app, /<form id="account-edit-form" class="form-grid">/);
    assert.match(app, /account-edit-form'\)\.addEventListener\('submit'/);
    assert.match(app, /const detailIsOpen=activeAccountDetailId===id;[\s\S]*if\(detailIsOpen\)renderAccountDetail\(id\);else render\(\)/);
});

test('settings exposes actions for moving groups', () => {
    assert.match(app, /function moveGroupRelative\(groupName,direction\)/);
    assert.match(app, /data-move-group-up/);
    assert.match(app, /data-move-group-down/);
    assert.match(app, /moveGroupRelative\(b\.dataset\.moveGroupUp,-1\)/);
    assert.match(app, /moveGroupRelative\(b\.dataset\.moveGroupDown,1\)/);
});
