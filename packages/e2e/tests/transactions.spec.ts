import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {TransactionsPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe.skip('Transactions Management', () => {
  let userId: string;
  let categoryId: string;
  let paymentMethodId: string;

  test.beforeEach(async ({ page, db }) => {
    // Create user and required data
    userId = await db.createUser(TEST_USER);
    categoryId = await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });
    paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Credit Card',
    });

    await loginAsTestUser(page);
  });

  test('should create a new expense transaction', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Weekly shopping',
      amount: 150.50,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    await transactionsPage.waitForSuccess();
    await transactionsPage.verifyTransactionExists('Weekly shopping');
  });

  test('should create a new income transaction', async ({ page, db }) => {
    // Create income category
    const incomeCategoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Monthly salary',
      amount: 3000,
      categoryId: incomeCategoryId,
      paymentMethodId,
      type: 'INCOME',
    });

    await transactionsPage.waitForSuccess();
    await transactionsPage.verifyTransactionExists('Monthly salary');
  });

  test('should edit an existing transaction', async ({ page, db }) => {
    // Create a transaction first
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 100,
      description: 'Original description',
      operation: 'OUTCOME',
      date: new Date().toISOString(),
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.editTransaction('Original description');
    await transactionsPage.descriptionInput.fill('Updated description');
    await transactionsPage.amountInput.fill('200');
    await transactionsPage.submit();

    await transactionsPage.waitForSuccess();
    await transactionsPage.verifyTransactionExists('Updated description');
    await transactionsPage.verifyTransactionNotExists('Original description');
  });

  test('should delete a transaction', async ({ page, db }) => {
    // Create a transaction first
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 50,
      description: 'Transaction to delete',
      operation: 'OUTCOME',
      date: new Date().toISOString(),
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.verifyTransactionExists('Transaction to delete');
    await transactionsPage.deleteTransaction('Transaction to delete');

    await transactionsPage.verifyTransactionNotExists('Transaction to delete');
  });

  test('should display multiple transactions', async ({ page, db }) => {
    // Create multiple transactions
    const transactions = [
      { description: 'Transaction 1', amount: 10 },
      { description: 'Transaction 2', amount: 20 },
      { description: 'Transaction 3', amount: 30 },
    ];

    for (const tx of transactions) {
      await db.createTransaction({
        userId,
        categoryId,
        paymentMethodId,
        amount: tx.amount,
        description: tx.description,
        operation: 'OUTCOME',
        date: new Date().toISOString(),
      });
    }

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    for (const tx of transactions) {
      await transactionsPage.verifyTransactionExists(tx.description);
    }
  });
});

test.describe.skip('Transaction Form Validations', () => {
  let userId: string;
  let categoryId: string;
  let paymentMethodId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    categoryId = await db.createCategory({
      userId,
      name: 'Test Category',
      type: 'OUTCOME',
    });
    paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Test Payment',
    });

    await loginAsTestUser(page);
  });

  test('should show error for empty description', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await transactionsPage.clickCreate();

    // Fill only amount and submit
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.categorySelect.selectOption(categoryId);
    await transactionsPage.paymentMethodSelect.selectOption(paymentMethodId);
    await transactionsPage.submit();

    await transactionsPage.waitForError();
    await expect(page.getByText(/description is required|description cannot be empty/i)).toBeVisible();
  });

  test('should show error for invalid amount', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await transactionsPage.clickCreate();

    await transactionsPage.descriptionInput.fill('Test transaction');
    await transactionsPage.amountInput.fill('-100');
    await transactionsPage.categorySelect.selectOption(categoryId);
    await transactionsPage.paymentMethodSelect.selectOption(paymentMethodId);
    await transactionsPage.submit();

    await transactionsPage.waitForError();
    await expect(page.getByText(/amount must be positive|invalid amount/i)).toBeVisible();
  });

  test('should show error for missing category', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await transactionsPage.clickCreate();

    await transactionsPage.descriptionInput.fill('Test transaction');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.paymentMethodSelect.selectOption(paymentMethodId);
    await transactionsPage.submit();

    await transactionsPage.waitForError();
    await expect(page.getByText(/category is required|select a category/i)).toBeVisible();
  });

  test('should show error for missing payment method', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await transactionsPage.clickCreate();

    await transactionsPage.descriptionInput.fill('Test transaction');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.categorySelect.selectOption(categoryId);
    await transactionsPage.submit();

    await transactionsPage.waitForError();
    await expect(page.getByText(/payment method is required|select a payment/i)).toBeVisible();
  });
});

