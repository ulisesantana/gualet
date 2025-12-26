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

  test('should create a new expense transaction', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Weekly shopping ${testTimestamp}`;

    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description,
      amount: 150.50,
      category: 'Groceries',
      paymentMethod: 'Credit Card',
      operation: 'OUTCOME',
    });

    // Verify by category (which is what's displayed in the card)
    await transactionsPage.verifyTransactionExists('Groceries');
  });

  test('should create a new income transaction', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page);
    const description = `Monthly salary ${testTimestamp}`;

    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description,
      amount: 3000,
      category: 'Salary',
      paymentMethod: 'Credit Card',
      operation: 'INCOME',
    });

    // Verify by category (which is what's displayed in the card)
    await transactionsPage.verifyTransactionExists('Salary');
  });

  test.skip('should edit an existing transaction', async ({ page, db }) => {
    // TODO: Implement when edit functionality is available in UI
  });

  test.skip('should delete a transaction', async ({ page, db }) => {
    // TODO: Implement when delete functionality is available in UI
  });

  test.skip('should display multiple transactions', async ({ page, db }) => {
    // TODO: Implement when transaction list has proper test IDs
  });
});

test.describe.skip('Transaction Form Validations', () => {
  // TODO: Implement validation tests when validation messages are available
});

