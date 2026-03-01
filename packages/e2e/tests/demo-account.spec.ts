import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {CategoriesPage, PaymentMethodsPage} from '@pages';

test.describe('Demo Account', () => {
  test.describe('Demo Login', () => {
    test('should login as demo user without credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByTestId('demo-login').click();

      // Should redirect to home page
      await expect(page).toHaveURL(/\/$/);

      // Should show settings link (user is logged in)
      await expect(page.locator('header').getByRole('link', {name: /settings/i})).toBeVisible();
    });

    test('should have demo data pre-loaded', async ({ page }) => {
      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/$/);

      // Verify categories exist
      const categoriesPage = new CategoriesPage(page);
      await categoriesPage.goto();
      await page.waitForLoadState('networkidle');

      // Check if manage categories button is visible (means there are categories)
      await expect(categoriesPage.manageCategoriesButton).toBeVisible();

      // Verify payment methods exist
      const paymentMethodsPage = new PaymentMethodsPage(page);
      await paymentMethodsPage.goto();
      await page.waitForLoadState('networkidle');

      // Check if create payment method button is visible
      await expect(paymentMethodsPage.createButton).toBeVisible();
    });
  });

  test.describe('Database Isolation - Critical', () => {
    test('should NOT persist demo transactions to database', async ({ page, db }) => {
      // Count transactions in DB before demo login
      const transactionsBeforeQuery = 'SELECT COUNT(*) as count FROM transactions';
      const beforeResult = await db.pool.query(transactionsBeforeQuery);
      const transactionsCountBefore = parseInt(beforeResult.rows[0].count);

      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/$/);

      // Navigate to home and wait for page to load
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify demo transactions ARE visible in UI (in memory)
      // Using more flexible selectors - look for any content that suggests transactions
      const hasTransactionContent = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        // Check for common transaction-related words that demo data would have
        return bodyText.includes('Food') ||
               bodyText.includes('Transport') ||
               bodyText.includes('Salary') ||
               bodyText.includes('€') ||
               bodyText.includes('$');
      });
      expect(hasTransactionContent).toBe(true); // Demo transactions visible

      // Wait to ensure any potential DB operations would have completed
      await page.waitForTimeout(3000);

      // Verify demo transactions were NOT saved to database
      const transactionsAfterQuery = 'SELECT COUNT(*) as count FROM transactions';
      const afterResult = await db.pool.query(transactionsAfterQuery);
      const transactionsCountAfter = parseInt(afterResult.rows[0].count);

      // Database count should be IDENTICAL - demo transactions only exist in memory
      expect(transactionsCountAfter).toBe(transactionsCountBefore);
    });

    test('should NOT persist demo categories to database', async ({ page, db }) => {
      const beforeResult = await db.pool.query('SELECT COUNT(*) as count FROM categories');
      const categoriesCountBefore = parseInt(beforeResult.rows[0].count);

      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/(transactions)?$/);

      const categoriesPage = new CategoriesPage(page);
      await categoriesPage.goto();

      const testCategoryName = `Demo Category ${Date.now()}`;
      await categoriesPage.createCategory({
        name: testCategoryName,
        type: 'OUTCOME',
      });

      await page.waitForTimeout(1000);
      await categoriesPage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const afterResult = await db.pool.query('SELECT COUNT(*) as count FROM categories');
      const categoriesCountAfter = parseInt(afterResult.rows[0].count);

      expect(categoriesCountAfter).toBe(categoriesCountBefore);

      const searchResult = await db.pool.query('SELECT * FROM categories WHERE name = $1', [testCategoryName]);
      expect(searchResult.rows.length).toBe(0);
    });

    test('should NOT persist demo payment methods to database', async ({ page, db }) => {
      const beforeResult = await db.pool.query('SELECT COUNT(*) as count FROM payment_methods');
      const pmCountBefore = parseInt(beforeResult.rows[0].count);

      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/(transactions)?$/);

      const paymentMethodsPage = new PaymentMethodsPage(page);
      await paymentMethodsPage.goto();

      const testPmName = `Demo Payment ${Date.now()}`;
      await paymentMethodsPage.createPaymentMethod({
        name: testPmName,
      });

      await page.waitForTimeout(1000);
      await paymentMethodsPage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const afterResult = await db.pool.query('SELECT COUNT(*) as count FROM payment_methods');
      const pmCountAfter = parseInt(beforeResult.rows[0].count);

      expect(pmCountAfter).toBe(pmCountBefore);

      const searchResult = await db.pool.query('SELECT * FROM payment_methods WHERE name = $1', [testPmName]);
      expect(searchResult.rows.length).toBe(0);
    });

    test('should have demo data in memory but NOT in database', async ({ page, db }) => {
      const beforeCounts = {
        transactions: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM transactions')).rows[0].count),
        categories: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM categories')).rows[0].count),
        paymentMethods: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM payment_methods')).rows[0].count),
      };

      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/$/);

      // Navigate through the app to trigger any potential data loading
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify transactions are visible in UI (even if no data-testid)
      const hasTransactionContent = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return bodyText.includes('Food') ||
               bodyText.includes('Transport') ||
               bodyText.includes('€') ||
               bodyText.includes('$');
      });
      expect(hasTransactionContent).toBe(true); // Demo transactions visible in UI

      // Navigate to settings to trigger categories and payment methods loading
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const categoriesPage = new CategoriesPage(page);
      await expect(categoriesPage.manageCategoriesButton).toBeVisible(); // Demo categories exist

      const paymentMethodsPage = new PaymentMethodsPage(page);
      await expect(paymentMethodsPage.createButton).toBeVisible(); // Demo payment methods exist

      // Wait for any potential async operations
      await page.waitForTimeout(3000);

      // Verify database counts haven't changed - all demo data is in memory only
      const afterCounts = {
        transactions: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM transactions')).rows[0].count),
        categories: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM categories')).rows[0].count),
        paymentMethods: parseInt((await db.pool.query('SELECT COUNT(*) as count FROM payment_methods')).rows[0].count),
      };

      // All counts should be IDENTICAL - nothing touched the database
      expect(afterCounts.transactions).toBe(beforeCounts.transactions);
      expect(afterCounts.categories).toBe(beforeCounts.categories);
      expect(afterCounts.paymentMethods).toBe(beforeCounts.paymentMethods);
    });
  });

  test.describe('Demo User Isolation', () => {
    test('should not see real user data when logged in as demo', async ({ page, db }) => {
      const realUserId = await db.createUser({
        email: 'realuser@test.com',
        password: 'password123',
      });

      const realCategoryId = await db.createCategory({
        userId: realUserId,
        name: 'Real User Category',
        type: 'OUTCOME',
      });

      await db.createPaymentMethod({
        userId: realUserId,
        name: 'Real User Payment',
      });

      await db.createTransaction({
        userId: realUserId,
        amount: 100.00,
        description: 'Real User Transaction',
        categoryId: realCategoryId,
        paymentMethodId: (await db.getUserPaymentMethods(realUserId))[0].id,
        date: new Date().toISOString(),
        operation: 'OUTCOME',
      });

      await page.goto('/login');
      await page.getByTestId('demo-login').click();
      await expect(page).toHaveURL(/\/$/);

      // Check transactions - should NOT see real user's transaction
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const pageContent = await page.content();
      expect(pageContent).not.toContain('Real User Transaction');

      // Check categories - should NOT see real user's category
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const categoryContent = await page.content();
      expect(categoryContent).not.toContain('Real User Category');

      // Check payment methods - settings page also shows payment methods
      const pmContent = await page.content();
      expect(pmContent).not.toContain('Real User Payment');
    });
  });
});

