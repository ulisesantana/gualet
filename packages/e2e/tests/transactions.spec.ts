import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {TransactionsPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Transactions Management', () => {
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    // Create user and required data
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();

    // Create categories
    await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });

    await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    // Create payment method
    await db.createPaymentMethod({
      userId,
      name: 'Credit Card',
    });

    await loginAsTestUser(page);
  });

  test('should create a new expense transaction', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Weekly shopping ${testTimestamp}`;

    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description,
      amount: 150.50,
      category: 'Groceries',
      paymentMethod: 0, // Use first payment method
      operation: 'OUTCOME',
    });

    // Verify by category (which is what's displayed in the card)
    await transactionsPage.verifyTransactionExists('Groceries');

    // Wait for transaction to persist to database
    await page.waitForTimeout(1000);

    // Verify in database
    const transactions = await db.getUserTransactions(userId);
    const transaction = transactions.find(t => t.description === description);

    expect(transaction).toBeTruthy();
    expect(transaction.amount).toBe("150.50"); // Negative for outcome
    expect(transaction.operation).toBe('OUTCOME');
  });

  test('should create a new income transaction', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Monthly salary ${testTimestamp}`;

    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description,
      amount: 3000,
      category: 'Salary',
      paymentMethod: 0, // Use first payment method
      operation: 'INCOME',
    });

    // Verify by category (which is what's displayed in the card)
    await transactionsPage.verifyTransactionExists('Salary');

    // Wait for transaction to persist to database
    await page.waitForTimeout(1000);

    // Verify in database
    const transactions = await db.getUserTransactions(userId);
    const transaction = transactions.find(t => t.description === description);

    expect(transaction).toBeTruthy();
    expect(transaction.amount).toBe("3000.00");
    expect(transaction.operation).toBe('INCOME');
  });

  test.skip('should edit an existing transaction', async ({ page, db }) => {
    // TODO: Implement when edit functionality is available in UI
  });

  test.skip('should delete a transaction', async ({ page, db }) => {
    // TODO: Implement when delete functionality is available in UI
  });

  test('should display multiple transactions', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);

    // Create multiple transactions
    await transactionsPage.goto();

    const transactions = [
      {
        description: `Transaction 1 ${testTimestamp}`,
        amount: 50,
        category: 'Groceries',
        paymentMethod: 0, // Use first payment method
        operation: 'OUTCOME' as const,
      },
      {
        description: `Transaction 2 ${testTimestamp}`,
        amount: 1500,
        category: 'Salary',
        paymentMethod: 0, // Use first payment method
        operation: 'INCOME' as const,
      },
      {
        description: `Transaction 3 ${testTimestamp}`,
        amount: 100,
        category: 'Groceries',
        paymentMethod: 0, // Use first payment method
        operation: 'OUTCOME' as const,
      },
    ];

    for (const transaction of transactions) {
      await transactionsPage.createTransaction(transaction);
    }

    // Verify all transactions are visible
    for (const transaction of transactions) {
      await transactionsPage.verifyTransactionExists(transaction.category);
    }

    // Wait for all transactions to persist to database
    await page.waitForTimeout(2000);

    // Verify in database
    const dbTransactions = await db.getUserTransactions(userId);
    expect(dbTransactions.length).toBe(transactions.length);

    const count = await db.countUserTransactions(userId);
    expect(count).toBe(transactions.length);
  });

  test('should create transaction with specific date', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Dated transaction ${testTimestamp}`;
    const specificDate = '2024-01-15';

    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description,
      amount: 75,
      category: 'Groceries',
      paymentMethod: 0, // Use first payment method
      operation: 'OUTCOME',
      date: specificDate,
    });

    await transactionsPage.verifyTransactionExists('Groceries');

    // Wait for transaction to persist to database
    await page.waitForTimeout(1000);

    // Verify date in database
    const transactions = await db.getUserTransactions(userId);
    const transaction = transactions.find(t => t.description === description);

    expect(transaction).toBeTruthy();
    const dbDate = new Date(transaction.date);
    expect(dbDate.toISOString().split('T')[0]).toBe(specificDate);
  });

  test.skip('should set last transaction date after creating a new one', async ({ page, db }) => {

  })
});

test.describe('Transaction Form Validations', () => {
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();

    // Create categories
    await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });

    await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    // Create payment method
    await db.createPaymentMethod({
      userId,
      name: 'Credit Card',
    });

    await loginAsTestUser(page);
  });

  test.skip('should prevent creating transaction with empty description', async ({ page, db }) => {
    // TODO: Add proper validation in frontend
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    // Try to submit without description
    await transactionsPage.operationSelect.selectOption('OUTCOME');
    await transactionsPage.categoryInput.fill('Groceries');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Browser validation should prevent submission
    await expect(transactionsPage.descriptionInput).toHaveAttribute('required', '');

    // Verify no transaction was created in database
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });

  test.skip('should prevent creating transaction with zero amount', async ({ page, db }) => {
    // TODO: Add proper validation in frontend
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await transactionsPage.operationSelect.selectOption('OUTCOME');
    await transactionsPage.categoryInput.fill('Groceries');
    await transactionsPage.amountInput.fill('0');
    await transactionsPage.descriptionInput.fill('Zero amount test');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Amount should have min validation
    await expect(transactionsPage.amountInput).toHaveAttribute('min');

    // Verify no transaction was created in database
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });

  test.skip('should prevent creating transaction without category', async ({ page, db }) => {
    // TODO: Add proper validation in frontend
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await transactionsPage.descriptionInput.fill('No category test');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Category should be required
    await expect(transactionsPage.categoryInput).toHaveAttribute('required', '');

    // Verify no transaction was created in database
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });
});

