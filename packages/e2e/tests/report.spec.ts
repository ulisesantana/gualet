import {test} from '@fixtures';
import {ReportPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

/**
 * Helper to get dates for the current month
 */
function getCurrentMonthDates() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // First day of current month
  const firstDay = new Date(year, month, 1);

  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);

  // Middle of the month (15th)
  const midMonth = new Date(year, month, 15);

  // 20th of the month
  const day20 = new Date(year, month, 20);

  // 10th of the month
  const day10 = new Date(year, month, 10);

  const format = (date: Date) => date.toISOString().split('T')[0];

  return {
    firstDay: format(firstDay),
    lastDay: format(lastDay),
    midMonth: format(midMonth),
    day20: format(day20),
    day10: format(day10),
  };
}

/**
 * Helper to get dates for previous month
 */
function getPreviousMonthDates() {
  const today = new Date();

  // Calculate previous month (handles year boundary correctly)
  const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const midMonth = new Date(year, month, 15);

  const format = (date: Date) => date.toISOString().split('T')[0];

  return {
    firstDay: format(firstDay),
    lastDay: format(lastDay),
    midMonth: format(midMonth),
  };
}

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
    const dates = getCurrentMonthDates();

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

    // Create income transaction in the middle of current month
    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Monthly salary',
      operation: 'INCOME',
      date: dates.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transaction (full current month)
    await reportPage.setDateRange(dates.firstDay, dates.lastDay);
    await reportPage.submitReport();

    // Verify balance shows positive amount
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(3000);

    // Verify income section shows
    await reportPage.verifyIncomeTotal(3000);
    await reportPage.verifyOutcomeSectionNotVisible();
  });

  test('should display report with outcome transactions', async ({ page, db }) => {
    const dates = getCurrentMonthDates();

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
      date: dates.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transaction
    await reportPage.setDateRange(dates.firstDay, dates.lastDay);
    await reportPage.submitReport();

    // Verify balance shows negative amount (outcome is negative)
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(-150.50);

    // Verify outcome section shows
    await reportPage.verifyOutcomeTotal(-150.50);
    await reportPage.verifyIncomeSectionNotVisible();
  });

  test('should display report with both income and outcome transactions', async ({ page, db }) => {
    const dates = getCurrentMonthDates();

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
      date: dates.midMonth,
    });

    // Create outcome transaction (amount should be positive)
    await db.createTransaction({
      userId,
      categoryId: outcomeCategory,
      paymentMethodId,
      amount: 500,
      description: 'Groceries',
      operation: 'OUTCOME',
      date: dates.day20,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include the transactions
    await reportPage.setDateRange(dates.firstDay, dates.lastDay);
    await reportPage.submitReport();

    // Verify balance (3000 - 500 = 2500)
    await reportPage.verifyBalanceIsVisible();
    await reportPage.verifyBalanceAmount(2500);

    // Verify both sections show
    await reportPage.verifyIncomeTotal(3000);
    await reportPage.verifyOutcomeTotal(-500);
  });

  test('should show category breakdown when expanding sections', async ({ page, db }) => {
    const dates = getCurrentMonthDates();

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
      date: dates.midMonth,
    });

    await db.createTransaction({
      userId,
      categoryId: freelanceCategory,
      paymentMethodId,
      amount: 500,
      description: 'Freelance work',
      operation: 'INCOME',
      date: dates.day20,
    });

    // Create multiple outcome transactions (amounts should be positive)
    await db.createTransaction({
      userId,
      categoryId: groceriesCategory,
      paymentMethodId,
      amount: 300,
      description: 'Groceries',
      operation: 'OUTCOME',
      date: dates.day10,
    });

    await db.createTransaction({
      userId,
      categoryId: rentCategory,
      paymentMethodId,
      amount: 1200,
      description: 'Rent',
      operation: 'OUTCOME',
      date: dates.firstDay,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set date range to include all transactions
    await reportPage.setDateRange(dates.firstDay, dates.lastDay);
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
    const currentMonth = getCurrentMonthDates();
    const previousMonth = getPreviousMonthDates();


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
      description: 'Previous month salary',
      operation: 'INCOME',
      date: previousMonth.midMonth,
    });

    await db.createTransaction({
      userId,
      categoryId,
      paymentMethodId,
      amount: 3000,
      description: 'Current month salary',
      operation: 'INCOME',
      date: currentMonth.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Test both months together
    await reportPage.setDateRange(previousMonth.firstDay, currentMonth.lastDay);
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(6000);
  });

  test('should handle reversed date range (to date before from date)', async ({ page, db }) => {
    const dates = getCurrentMonthDates();

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
      date: dates.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // Set reversed date range - should still work
    await reportPage.setDateRange(dates.lastDay, dates.firstDay);
    await reportPage.submitReport();

    // Should still show the transaction (use case swaps dates)
    await reportPage.verifyBalanceAmount(3000);
  });

  test('should update report on form submission', async ({ page, db }) => {
    const currentMonth = getCurrentMonthDates();
    const previousMonth = getPreviousMonthDates();

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
      date: currentMonth.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    // First, set a date range that excludes the transaction (previous month)
    await reportPage.setDateRange(previousMonth.firstDay, previousMonth.lastDay);
    await reportPage.submitReport();
    // Should show balance 0 when no transactions in range
    await reportPage.verifyBalanceAmount(0);

    // Then change to include the transaction (current month)
    await reportPage.setDateRange(currentMonth.firstDay, currentMonth.lastDay);
    await reportPage.submitReport();
    await reportPage.verifyBalanceAmount(3000);
  });

  test('should show correct date range in balance text', async ({ page, db }) => {
    const dates = getCurrentMonthDates();

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
      date: dates.midMonth,
    });

    const reportPage = new ReportPage(page);
    await reportPage.goto();

    await reportPage.setDateRange(dates.firstDay, dates.lastDay);
    await reportPage.submitReport();

    // Verify the date range is shown in the balance text
    await reportPage.verifyDateRange(dates.firstDay, dates.lastDay);
  });
});

