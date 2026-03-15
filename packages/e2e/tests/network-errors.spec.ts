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

  test('should not create transaction when API is unavailable', async ({
    page,
    context,
    db,
  }) => {
    // Abort POST requests to transactions endpoint
    await context.route('**/api/me/transactions', (route) => {
      if (route.request().method() === 'POST') {
        route.abort();
      } else {
        route.continue();
      }
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Test transaction that should fail',
      amount: 100,
      category: 'Test Category',
      paymentMethod: 0,
      operation: 'OUTCOME',
    });

    // Wait to ensure any potential DB operations would have completed
    await page.waitForTimeout(2000);

    // Verify transaction was NOT saved to database
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });

  test('should not create transaction when API returns 500', async ({
    page,
    context,
    db,
  }) => {
    // Simulate server error on POST
    await context.route('**/api/me/transactions', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        route.continue();
      }
    });

    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();

    await transactionsPage.createTransaction({
      description: 'Test transaction that should fail',
      amount: 100,
      category: 'Test Category',
      paymentMethod: 0,
      operation: 'OUTCOME',
    });

    // Wait to ensure any potential DB operations would have completed
    await page.waitForTimeout(2000);

    // Verify transaction was NOT saved to database
    const count = await db.countUserTransactions(userId);
    expect(count).toBe(0);
  });
});

test.describe('Network Error Handling - Categories', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should not create category when API is unavailable', async ({
    page,
    context,
    db,
  }) => {
    // Block POST requests to categories endpoint
    await context.route('**/api/me/categories', (route) => {
      if (route.request().method() === 'POST') {
        route.abort();
      } else {
        route.continue();
      }
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.createCategory({
      name: 'Category That Should Fail',
      type: 'OUTCOME',
    });

    // Wait for any potential async operations
    await page.waitForTimeout(2000);

    // Verify no category was created in database
    const categories = await db.getUserCategories(userId);
    expect(categories.length).toBe(0);
  });

  test('should redirect to login when session is expired (auth verify returns 401)', async ({
    page,
    context,
  }) => {
    // Simulate unauthorized response from the auth verify endpoint
    await context.route('**/api/auth/verify', (route) =>
      route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      }),
    );

    // Navigate to a protected route - ProtectedRoute will verify session
    await page.goto('/categories');

    // Should redirect to login because session verification fails
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Network Error Handling - Payment Methods', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should not create payment method when API is unavailable', async ({
    page,
    context,
    db,
  }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Intercept and fail the POST request AFTER navigating to the list
    await context.route('**/api/me/payment-methods', (route) => {
      if (route.request().method() === 'POST') {
        route.abort();
      } else {
        route.continue();
      }
    });

    await paymentMethodsPage.createPaymentMethod({
      name: 'New Payment Method',
    });

    // Wait for any potential async operations
    await page.waitForTimeout(2000);

    // Verify no payment method was created in database
    const paymentMethods = await db.getUserPaymentMethods(userId);
    expect(paymentMethods.length).toBe(0);
  });

  test('should keep payment method in UI when DELETE fails', async ({
    page,
    context,
    db,
  }) => {
    // Create a payment method
    await db.createPaymentMethod({
      userId,
      name: 'Payment to Keep',
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Intercept and fail the DELETE request
    await context.route('**/api/me/payment-methods/**', (route) => {
      if (route.request().method() === 'DELETE') {
        route.abort();
      } else {
        route.continue();
      }
    });

    // Attempt to delete - dialog will appear and we accept it
    paymentMethodsPage.page.once('dialog', async dialog => {
      await dialog.accept();
    });

    const item = paymentMethodsPage.getPaymentMethodItem('Payment to Keep');
    await expect(item).toBeVisible();
    const deleteButton = item.getByRole('button', { name: /delete/i });
    await deleteButton.click();

    // Wait for any potential async operations
    await page.waitForTimeout(2000);

    // Verify payment method still exists in database
    const pm = await db.getPaymentMethodByName(userId, 'Payment to Keep');
    expect(pm).toBeTruthy();
  });
});
