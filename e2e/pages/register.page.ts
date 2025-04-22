import {Locator, Page} from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly inputUser: Locator;
  readonly inputPass: Locator;
  readonly btnSubmit: Locator;
  readonly success: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputUser = page.locator('input[name="email"]');
    this.inputPass = page.locator('input[name="password"]');
    this.btnSubmit = page.locator('button[type="submit"]');
    this.success = page.locator('span.success-message');
    this.error = page.locator('span.error-message');
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.click('text=Register');
  }

  async register({email, password} : {email: string, password: string}) {
    // Fill the form
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    // Submit form
    await this.page.click('button[type="submit"]');
  }

}
