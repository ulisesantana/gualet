import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {RegisterPage} from "@pages";

const user = {email: "test@gualet.app", password: "testTEST1"}
test.describe('register success', () => {
  test('should register successfully', async ({page, db}) => {
    await db.reset()
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.register(user);

    await expect(registerPage.success).toBeVisible();
    await expect(registerPage.success).toHaveText('Your email needs to be confirmed. Please, check your email and click on confirm link.');
  })
});

test.describe('handle register errors', () => {
  test('user already exists', async ({page, db}) => {
    await db.createUser(user);
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.register(user);

    await expect(registerPage.error).toHaveText('User with email "test@gualet.app" already exists.');
  })

})
