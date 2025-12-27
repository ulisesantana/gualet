import {expect, Page} from '@playwright/test';
import {LoginPage} from '../pages';

export const TEST_USER = {
  email: 'test@gualet.app',
  password: 'test1234', // Changed to match backend seeder password
};

/**
 * Logs in as the test user and waits for successful navigation
 */
export async function loginAsTestUser(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USER);

  // Wait for successful login
  await expect(page).toHaveURL('/');
  await expect(page.locator('header').getByRole('link', { name: /settings/i })).toBeVisible();
}

/**
 * Logs in with custom credentials and waits for successful navigation
 */
export async function loginAs(
  page: Page,
  credentials: { email: string; password: string },
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials);

  // Wait for successful login
  await expect(page).toHaveURL('/');
}

/**
 * Ensures the user is logged out
 */
export async function logout(page: Page): Promise<void> {
  // Navigate to home and check if redirected to login
  await page.goto('/');

  // If already on login page, we're logged out
  if (page.url().includes('/login')) {
    return;
  }

  // Otherwise, click logout button if it exists
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await expect(page).toHaveURL('/login');
  }
}
