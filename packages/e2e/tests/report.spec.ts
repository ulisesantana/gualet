import {test} from '@fixtures';
import {ReportPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Reports', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should show balance of 0 when no transactions exist', async ({ page }) => {
    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Should show balance of 0, not "No data"
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(0);
  });

  test('should display report with income transactions', async ({ page, db }) => {
    // Create test data
    const categoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    // Create income transaction
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Monthly salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transaction
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();

    // Verify balance shows positive amount
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(3000);

    // Verify income section shows
    await reportPage.verifyIncomeTotal(3000);
    await reportPage.verifyOutcomeSectionNotVisible();
  });

  test('should display report with outcome transactions', async ({ page, db }) => {
    // Create test data
    const categoryId = await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Credit Card',
    });

    // Create outcome transaction (amount should be positive, operation determines sign)
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 150.50,
      description: 'Weekly shopping',
      operation: 'OUTCOME',
      date: '2025-01-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transaction
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();

    // Verify balance shows negative amount (outcome is negative)
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(-150.50);

    // Verify outcome section shows
    await reportPage.verifyOutcomeTotal(-150.50);
    await reportPage.verifyIncomeSectionNotVisible();
  });

  test('should display report with both income and outcome transactions', async ({ page, db }) => {
    // Create test data
    const incomeCategory = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const outcomeCategory = await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    // Create income transaction
    await db.createTransaction({
      userId,
      categoryId: incomeCategory,
      paymentMethodId,
      amount: 3000,
      description: 'Salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    // Create outcome transaction (amount should be positive)
    await db.createTransaction({
      userId,
      categoryId: outcomeCategory,
      paymentMethodId,
      amount: 500,
      description: 'Groceries',
      operation: 'OUTCOME',
      date: '2025-01-20',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transactions
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();

    // Verify balance (3000 - 500 = 2500)
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(2500);

    // Verify both sections show
    await reportPage.verifyIncomeTotal(3000);
    await reportPage.verifyOutcomeTotal(-500);
  });

  test('should show category breakdown when expanding sections', async ({ page, db }) => {
    // Create test data
    const salaryCategory = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const freelanceCategory = await db.createCategory({
      userId,
      name: 'Freelance',
      type: 'INCOME',
    });

    const groceriesCategory = await db.createCategory({
      userId,
      name: 'Groceries',
      type: 'OUTCOME',
    });

    const rentCategory = await db.createCategory({
      userId,
      name: 'Rent',
      type: 'OUTCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    // Create multiple income transactions
    await db.createTransaction({
      userId,
      categoryId: salaryCategory,
      paymentMethodId,
      amount: 3000,
      description: 'Salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    await db.createTransaction({
      userId,
      categoryId: freelanceCategory,
      paymentMethodId,
      amount: 500,
      description: 'Freelance work',
      operation: 'INCOME',
      date: '2025-01-20',
    });

    // Create multiple outcome transactions (amounts should be positive)
    await db.createTransaction({
      userId,
      categoryId: groceriesCategory,
      paymentMethodId,
      amount: 300,
      description: 'Groceries',
      operation: 'OUTCOME',
      date: '2025-01-10',
    });

    await db.createTransaction({
      userId,
      categoryId: rentCategory,
      paymentMethodId,
      amount: 1200,
      description: 'Rent',
      operation: 'OUTCOME',
      date: '2025-01-01',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include all transactions
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();

    // Expand income section and verify categories
    await reportPage.expandIncomeSection();
    await reportPage.verifyCategoryInList('Salary', 3000);
    await reportPage.verifyCategoryInList('Freelance', 500);

    // Expand outcome section and verify categories
    await reportPage.expandOutcomeSection();
    await reportPage.verifyCategoryInList('Groceries', -300);
    await reportPage.verifyCategoryInList('Rent', -1200);
  });

  test('should filter transactions by date range', async ({ page, db }) => {
    // Create test data
    const categoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    // Create transactions in different months
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'January salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'February salary',
      operation: 'INCOME',
      date: '2025-02-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Test January only
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(3000);

    // Test February only
    await reportPage.setDateRange('2025-02-01', '2025-02-28');
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(3000);

    // Test both months
    await reportPage.setDateRange('2025-01-01', '2025-02-28');
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(6000);
  });

  test('should handle reversed date range (to date before from date)', async ({ page, db }) => {
    // Create test data
    const categoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set reversed date range - should still work
    await reportPage.setDateRange('2025-01-31', '2025-01-01');
    await reportPage.submitReport();

    // Should still show the transaction (use case swaps dates)
    await reportPage.verifyBalanceAmount(3000);
  });

  test('should update report on form submission', async ({ page, db }) => {
    // Create test data
    const categoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // First, set a date range that excludes the transaction
    await reportPage.setDateRange('2025-02-01', '2025-02-28');
    await reportPage.submitReport();
    // Should show balance 0 when no transactions in range
    await reportPage.verifyBalanceAmount(0);

    // Then change to include the transaction
    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(3000);
  });

  test('should show correct date range in balance text', async ({ page, db }) => {
    const categoryId = await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });

    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Bank Account',
    });

    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Salary',
      operation: 'INCOME',
      date: '2025-01-15',
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    await reportPage.setDateRange('2025-01-01', '2025-01-31');
    await reportPage.submitReport();

    // Verify the date range is shown in the balance text
    await reportPage.verifyDateRange('2025-01-01', '2025-01-31');
  });
});

