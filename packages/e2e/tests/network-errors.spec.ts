import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {CategoriesPage, PaymentMethodsPage, TransactionsPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Network Error Handling - Transactions', () => {
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

  test('should show error when API is unavailable during transaction creation', async ({
    page,
    context,
  }) => {
    // Abort all API requests to transactions endpoint
    await context.route('**/api/transactions', (route) => route.abort());

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Test transaction',
      amount: 100,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    // Should show error message
    await expect(
      page.getByText(/unable to connect|network error|failed to create/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show error when API returns 500', async ({
    page,
    context,
  }) => {
    // Simulate server error
    await context.route('**/api/transactions', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      }),
    );

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Test transaction',
      amount: 100,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    await expect(
      page.getByText(/server error|something went wrong/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test('should handle timeout gracefully', async ({ page, context }) => {
    // Simulate slow API response
    await context.route('**/api/transactions', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await route.continue();
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Test transaction',
      amount: 100,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    // Should show timeout or loading state
    await expect(
      page.getByText(/timeout|taking too long|please wait/i),
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Network Error Handling - Categories', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should show error when unable to fetch categories', async ({
    page,
    context,
  }) => {
    // Block categories API
    await context.route('**/api/categories', (route) => route.abort());

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    await expect(
      page.getByText(/unable to load|failed to fetch|error loading/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test('should handle 401 unauthorized error', async ({ page, context }) => {
    // Simulate unauthorized response
    await context.route('**/api/categories', (route) =>
      route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      }),
    );

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    // Should redirect to login or show auth error
    await page.waitForURL('**/login', { timeout: 5000 }).catch(async () => {
      await expect(
        page.getByText(/unauthorized|session expired|please log in/i),
      ).toBeVisible();
    });
  });
});

test.describe('Network Error Handling - Payment Methods', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should handle network interruption during creation', async ({
    page,
    context,
  }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Intercept and fail the POST request
    await context.route('**/api/payment-methods', (route) => {
      if (route.request().method() === 'POST') {
        route.abort();
      } else {
        route.continue();
      }
    });

    await paymentMethodsPage.createPaymentMethod({
      name: 'New Payment Method',
    });

    await expect(
      page.getByText(/failed to create|error creating|network error/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test('should handle network interruption during deletion', async ({
    page,
    context,
    db,
  }) => {
    // Create a payment method
    await db.createPaymentMethod({
      userId,
      name: 'Payment to Delete',
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Intercept and fail the DELETE request
    await context.route('**/api/payment-methods/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.abort();
      } else {
        route.continue();
      }
    });

    await paymentMethodsPage.deletePaymentMethod('Payment to Delete');

    await expect(
      page.getByText(/failed to delete|error deleting|network error/i),
    ).toBeVisible({ timeout: 5000 });

    // Payment method should still exist
    await paymentMethodsPage.verifyPaymentMethodExists('Payment to Delete');
  });
});

test.describe('Retry Mechanism', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should retry failed requests and eventually succeed', async ({
    page,
    context,
    db,
  }) => {
    const categoryId = await db.createCategory({
      userId,
      name: 'Test Category',
      type: 'OUTCOME',
    });
    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Test Payment',
    });

    let requestCount = 0;

    // Fail first 2 requests, then succeed
    await context.route('**/api/transactions', (route) => {
      requestCount++;
      if (requestCount <= 2) {
        route.abort();
      } else {
        route.continue();
      }
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Retry test transaction',
      amount: 100,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    // Should eventually succeed after retries
    await transactionsPage.waitForSuccess();
    await transactionsPage.verifyTransactionExists('Retry test transaction');

    // Verify it retried at least once
    expect(requestCount).toBeGreaterThan(1);
  });

  test('should show error after max retries exceeded', async ({
    page,
    context,
    db,
  }) => {
    const categoryId = await db.createCategory({
      userId,
      name: 'Test Category',
      type: 'OUTCOME',
    });
    const paymentMethodId = await db.createPaymentMethod({
      userId,
      name: 'Test Payment',
    });

    // Always fail
    await context.route('**/api/transactions', (route) => route.abort());

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Max retries test',
      amount: 100,
      categoryId,
      paymentMethodId,
      type: 'OUTCOME',
    });

    // Should show error after max retries
    await expect(
      page.getByText(
        /unable to connect|network error|failed to create|max retries/i,
      ),
    ).toBeVisible({ timeout: 15000 });
  });
});

