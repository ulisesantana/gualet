import {expect} from '@playwright/test';
import {test} from '../helpers/fixtures';

test('login flow', async ({ page, db }) => {
  const user = {email: "test@gualet.app", password: "testTEST1"}
  await db.createUser(user)

  // Navigate to home page
  await page.goto('/');

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Must be redirected to login page
  await expect(page).toHaveURL('/login');

  // Click on the login button
  await page.click('text=Login');

  // Fill the form
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Verify successful login
  await expect(page).toHaveURL('/');
});
