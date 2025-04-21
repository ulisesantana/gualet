import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {LoginPage} from "@pages";

const user = {email: "test@gualet.app", password: "testTEST1"}
test.describe('login success', () => {
  test('should redirect to login page if not logged in', async ({page}) => {
    await page.goto('/');

    await expect(page).toHaveURL('/login');
    await expect(page.locator('header').getByRole('link', {name: 'Settings'})).not.toBeVisible();
  })

  test('should not show settings link on header', async ({page}) => {
    await new LoginPage(page).goto();

    await expect(page.locator('header').getByRole('link', {name: 'Settings'})).not.toBeVisible();
  })

  test('should login successfully', async ({page, db}) => {
    await db.createUser(user)
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(user);

    await expect(page).toHaveURL('/');
    await expect(page.locator('header').getByRole('link', {name: 'Settings'})).toBeVisible();
  })
});

test.describe('handle login errors', () => {
  test('user not found', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(user);

    await expect(loginPage.error).toHaveText('User not found.');
  })

  test('invalid credentials', async ({page, db}) => {
    await db.createUser(user)
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login({email: user.email, password: 'wrongPassword'});

    await expect(loginPage.error).toHaveText('Invalid credentials.');
  })

})
