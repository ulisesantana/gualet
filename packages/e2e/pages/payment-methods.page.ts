import {expect, Locator, Page} from '@playwright/test';

export class PaymentMethodsPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly paymentMethodForm: Locator;
  readonly nameInput: Locator;
  readonly iconInput: Locator;
  readonly colorInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: /add.*payment method/i });
    this.paymentMethodForm = page.locator('[data-testid="payment-method-form"]');
    this.nameInput = page.locator('input[name="name"]');
    this.iconInput = page.locator('input[name="icon"]');
    this.colorInput = page.locator('input[name="color"]');
    this.submitButton = page.locator('[data-testid="payment-method-submit-button"]');
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/payment-methods');
    await this.page.waitForLoadState('networkidle');

    // Wait for loader to disappear if present
    const loader = this.page.locator('[data-testid="loader-container"]');
    try {
      await loader.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Loader might not appear if data loads fast
    }
  }

  async clickCreate() {
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
    await expect(this.paymentMethodForm).toBeVisible();
  }

  async fillForm(paymentMethod: {
    name: string;
    icon?: string;
    color?: string;
  }) {
    await expect(this.paymentMethodForm).toBeVisible();

    await this.nameInput.fill(paymentMethod.name);

    if (paymentMethod.icon) {
      await this.iconInput.fill(paymentMethod.icon);
    }

    if (paymentMethod.color) {
      await this.colorInput.fill(paymentMethod.color);
    }
  }

  async submit() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async createPaymentMethod(paymentMethod: {
    name: string;
    icon?: string;
    color?: string;
  }) {
    await this.clickCreate();
    await this.fillForm(paymentMethod);
    await this.submit();
  }

  async waitForSuccess() {
    // After successful create/edit, the app redirects to the payment methods list
    await this.page.waitForURL('/payment-methods', { timeout: 5000 });
  }

  async waitForError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  getPaymentMethodItem(name: string): Locator {
    return this.page.locator(`[data-testid^="payment-method-item-"]`, {
      hasText: name,
    });
  }


  async editPaymentMethod(name: string) {
    const item = this.getPaymentMethodItem(name);
    await expect(item).toBeVisible();
    const editButton = item.getByRole('button', { name: /edit/i });
    await editButton.click();
    await expect(this.paymentMethodForm).toBeVisible();
  }

  async deletePaymentMethod(name: string) {
    const item = this.getPaymentMethodItem(name);
    await expect(item).toBeVisible();
    const deleteButton = item.getByRole('button', { name: /delete/i });

    // Handle the browser's confirm dialog
    this.page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await deleteButton.click();
  }

  async verifyPaymentMethodExists(name: string) {
    await expect(this.getPaymentMethodItem(name)).toBeVisible();
  }

  async verifyPaymentMethodNotExists(name: string) {
    await expect(this.getPaymentMethodItem(name)).not.toBeVisible();
  }
}

