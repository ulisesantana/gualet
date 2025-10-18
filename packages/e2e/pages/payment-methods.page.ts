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
    this.createButton = page.getByRole('button', { name: /new payment method|add payment|create/i });
    this.paymentMethodForm = page.locator('[data-testid="payment-method-form"]');
    this.nameInput = page.locator('input[name="name"]');
    this.iconInput = page.locator('input[name="icon"]');
    this.colorInput = page.locator('input[name="color"]');
    this.submitButton = page.getByRole('button', { name: /save|submit|create/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/payment-methods');
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
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  getPaymentMethodItem(name: string): Locator {
    return this.page.locator(`[data-testid="payment-method-item"]`, {
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
    await deleteButton.click();

    // Wait for confirmation dialog and confirm
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  async verifyPaymentMethodExists(name: string) {
    await expect(this.getPaymentMethodItem(name)).toBeVisible();
  }

  async verifyPaymentMethodNotExists(name: string) {
    await expect(this.getPaymentMethodItem(name)).not.toBeVisible();
  }
}

