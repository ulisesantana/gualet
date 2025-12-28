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

  test('should edit an existing transaction', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);
    const originalDescription = `Original transaction ${testTimestamp}`;
    const updatedDescription = `Updated transaction ${testTimestamp}`;

    await transactionsPage.goto();

    // Create a transaction
    await transactionsPage.createTransaction({
      description: originalDescription,
      amount: 100,
      category: 'Groceries',
      paymentMethod: 0,
      operation: 'OUTCOME',
    });

    await page.waitForTimeout(1000);

    // Get the transaction ID from database
    const transactions = await db.getUserTransactions(userId);
    const transaction = transactions.find(t => t.description === originalDescription);
    expect(transaction).toBeTruthy();

    // Click on the transaction to edit it
    await transactionsPage.clickTransactionByDataId(transaction.id);

    // Wait for navigation to details page
    await page.waitForURL(`/transactions/details/${transaction.id}`);

    // Edit the transaction (will wait for automatic redirect to home)
    await transactionsPage.editTransaction({
      description: updatedDescription,
      amount: 150,
    });

    // Now we should be on the home page
    await expect(page).toHaveURL('/');

    // Wait for the page to fully load and transactions to be fetched
    await page.waitForLoadState('networkidle');

    // Wait extra time for the location effect to trigger and fetch transactions
    await page.waitForTimeout(3000);


    // Verify the transaction card is still visible (by data-id, since description is not shown in card)
    await transactionsPage.verifyTransactionExistsByDataId(transaction.id);

    // Verify the amount is updated in the card (150.00 formatted)
    const transactionCard = transactionsPage.getTransactionByDataId(transaction.id);
    await expect(transactionCard).toContainText('150');

    // Verify in database
    const updatedTransaction = await db.getTransactionById(transaction.id);
    expect(updatedTransaction.description).toBe(updatedDescription);
    expect(updatedTransaction.amount).toBe("150.00");
  });

  test('should delete a transaction', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Transaction to delete ${Date.now()}`;

    await transactionsPage.goto();

    // Create a transaction
    await transactionsPage.createTransaction({
      description,
      amount: 75,
      category: 'Groceries',
      paymentMethod: 0,
      operation: 'OUTCOME',
    });

    await page.waitForTimeout(1000);

    // Get the transaction ID from database
    const transactions = await db.getUserTransactions(userId);
    const transaction = transactions.find(t => t.description === description);
    expect(transaction).toBeTruthy();

    const countBefore = await db.countUserTransactions(userId);
    expect(countBefore).toBe(1);

    // Click on the transaction to view details
    await transactionsPage.clickTransactionByDataId(transaction.id);

    // Wait for navigation to details page
    await page.waitForURL(`/transactions/details/${transaction.id}`);

    // Delete the transaction
    await transactionsPage.deleteTransaction();

    // Should navigate back to transactions list
    await expect(page).toHaveURL('/');

    // Wait for the page to fully load and transactions to be fetched
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Verify in database first (this is the source of truth)
    const countAfter = await db.countUserTransactions(userId);
    expect(countAfter).toBe(0);

    const deletedTransaction = await db.getTransactionById(transaction.id);
    expect(deletedTransaction).toBeNull();

    // Verify the transaction is not visible in UI
    await transactionsPage.verifyTransactionNotExists('Groceries');
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
    // TODO: This feature requires implementing user preferences for lastTransactionDate
    // The backend needs to track and update lastTransactionDate in user_preferences table
    // when a transaction is created. This functionality is not yet implemented.
  });
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

  test('should prevent creating transaction with empty description', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    // Try to submit without description
    await transactionsPage.operationSelect.selectOption('OUTCOME');
    await transactionsPage.categoryInput.fill('Groceries');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Browser validation should prevent submission
    await expect(transactionsPage.descriptionInput).toHaveAttribute('required', '');

    // Try to submit the form
    const submitButton = page.getByTestId('submit-transaction-button');
    await submitButton.click();

    // Should stay on the same page (validation prevents navigation)
    await expect(page).toHaveURL('/');

    // Verify no transaction was created in database
    await page.waitForTimeout(500);
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });

  test('should prevent creating transaction with zero amount', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await transactionsPage.operationSelect.selectOption('OUTCOME');
    await transactionsPage.categoryInput.fill('Groceries');
    await transactionsPage.amountInput.fill('0');
    await transactionsPage.descriptionInput.fill('Zero amount test');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Amount should have min validation
    await expect(transactionsPage.amountInput).toHaveAttribute('min', '0.01');

    // Try to submit the form
    const submitButton = page.getByTestId('submit-transaction-button');
    await submitButton.click();

    // Should stay on the same page (validation prevents navigation)
    await expect(page).toHaveURL('/');

    // Verify no transaction was created in database
    await page.waitForTimeout(500);
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });

  test('should prevent creating transaction without category', async ({ page, db }) => {
    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await transactionsPage.descriptionInput.fill('No category test');
    await transactionsPage.amountInput.fill('100');
    await transactionsPage.paymentMethodSelect.selectOption({ index: 0 });

    // Category should be required
    await expect(transactionsPage.categoryInput).toHaveAttribute('required', '');

    // Try to submit the form
    const submitButton = page.getByTestId('submit-transaction-button');
    await submitButton.click();

    // Should stay on the same page (validation prevents navigation)
    await expect(page).toHaveURL('/');

    // Verify no transaction was created in database
    await page.waitForTimeout(500);
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });
});

