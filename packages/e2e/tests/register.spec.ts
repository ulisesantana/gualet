import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {RegisterPage} from "@pages";

test.describe('register success', () => {
  test('should register successfully', async ({page, db}) => {
    await db.reset()
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const email = "new.user@gualet.app";
    await registerPage.register({email, password: "test1234"});

    // Wait a bit for the backend to process
    await page.waitForTimeout(3000);

    // Check for any error messages
    const errorVisible = await registerPage.error.isVisible().catch(() => false);
    if (errorVisible) {
      const errorText = await registerPage.error.textContent();
      console.log('Register error:', errorText);
    }

    // The backend auto-logs in the user after registration
    // So we should either see a success message or be redirected/logged in
    const currentUrl = page.url();
    console.log('Current URL after register:', currentUrl);

    // Check if user was created in database (most important)
    const users = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // If user wasn't created, check if there's an error message
    if (users.rows.length === 0) {
      const pageContent = await page.content();
      console.log('Page HTML (first 500 chars):', pageContent.substring(0, 500));
    }

    expect(users.rows.length).toBe(1);
    expect(users.rows[0].email).toBe(email);
  })
});

test.describe('handle register errors', () => {
  test('user already exists', async ({page, db}) => {
    const user = {email: "test@gualet.app", password: "test1234"}
    await db.createUser(user);

    // Verify user exists before test
    const usersBefore = await db.pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
    expect(usersBefore.rows.length).toBe(1);

    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.register(user);

    // Wait a bit for the backend to process
    await page.waitForTimeout(2000);

    // Verify only ONE user exists (no duplicate created)
    const usersAfter = await db.pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
    expect(usersAfter.rows.length).toBe(1);

    // Should still be on register/login page (not logged in)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(login|register)/);
  })

})
