import {expect, Locator, Page} from '@playwright/test';

export class TransactionsPage {
  readonly page: Page;
  readonly transactionForm: Locator;
  readonly descriptionInput: Locator;
  readonly amountInput: Locator;
  readonly dateInput: Locator;
  readonly categoryInput: Locator;
  readonly paymentMethodSelect: Locator;
  readonly operationSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transactionForm = page.locator('form.transaction-form');
    this.descriptionInput = page.locator('input[name="description"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.dateInput = page.locator('input[name="date"]');
    this.categoryInput = page.locator('input[name="category"]');
    this.paymentMethodSelect = page.locator('select[name="payment-method"]');
    this.operationSelect = page.locator('select[name="operation"]');
    this.submitButton = this.transactionForm.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.transactionForm).toBeVisible({ timeout: 10000 });
  }

  async fillForm(transaction: {
    description: string;
    amount: number;
    category: string;
    paymentMethod?: string | number;
    operation?: 'INCOME' | 'OUTCOME';
    date?: string;
  }) {
    // Select operation type if specified
    if (transaction.operation) {
      await this.operationSelect.selectOption(transaction.operation);
      // Wait for categories to update
      await this.page.waitForTimeout(200);
    }

    // Fill category
    await this.categoryInput.fill(transaction.category);

    // Fill amount
    await this.amountInput.fill(transaction.amount.toString());

    // Fill date if provided
    if (transaction.date) {
      await this.dateInput.fill(transaction.date);
    }

    // Fill description
    await this.descriptionInput.fill(transaction.description);

    // Select payment method if provided
    if (transaction.paymentMethod !== undefined) {
      // If it's a number, select by index, otherwise by label
      if (typeof transaction.paymentMethod === 'number') {
        await this.paymentMethodSelect.selectOption({ index: transaction.paymentMethod });
      } else {
        await this.paymentMethodSelect.selectOption(transaction.paymentMethod);
      }
    }
  }

  async submit() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
    // Wait for the transaction to be added to the list
    await this.page.waitForTimeout(2000);
  }

  async createTransaction(transaction: {
    description: string;
    amount: number;
    category: string;
    paymentMethod?: string | number;
    operation?: 'INCOME' | 'OUTCOME';
    date?: string;
  }) {
    await this.fillForm(transaction);
    await this.submit();
  }

  getTransactionByDataId(dataId: string): Locator {
    return this.page.locator(`[data-id="${dataId}"]`);
  }

  getTransactionByText(text: string): Locator {
    return this.page.locator('li', {
      hasText: text,
    });
  }

  async verifyTransactionExists(text: string) {
    // Buscar por cualquier texto visible en el card (categoría, fecha, monto)
    await expect(this.getTransactionByText(text).first()).toBeVisible();
  }

  async verifyTransactionExistsByDataId(dataId: string) {
    await expect(this.getTransactionByDataId(dataId)).toBeVisible({ timeout: 10000 });
  }

  async verifyTransactionNotExists(text: string) {
    await expect(this.getTransactionByText(text)).not.toBeVisible({ timeout: 5000 });
  }

  async getTransactionCount(): Promise<number> {
    const items = this.page.locator('li');
    return await items.count();
  }

  async clickTransactionByText(text: string) {
    await this.getTransactionByText(text).first().click();
  }

  async clickTransactionByDataId(dataId: string) {
    // Click on the link inside the transaction card
    const transactionElement = this.getTransactionByDataId(dataId);
    const link = transactionElement.locator('a').first();
    await expect(link).toBeVisible();
    await link.click();
  }

  async editTransaction(transaction: {
    description?: string;
    amount?: number;
    category?: string;
    paymentMethod?: string | number;
    operation?: 'INCOME' | 'OUTCOME';
    date?: string;
  }) {
    // Fill only the fields that are provided
    if (transaction.operation) {
      await this.operationSelect.selectOption(transaction.operation);
      await this.page.waitForTimeout(200);
    }

    if (transaction.category) {
      await this.categoryInput.fill(transaction.category);
    }

    if (transaction.amount !== undefined) {
      await this.amountInput.fill(transaction.amount.toString());
    }

    if (transaction.date) {
      await this.dateInput.fill(transaction.date);
    }

    if (transaction.description) {
      await this.descriptionInput.fill(transaction.description);
    }

    if (transaction.paymentMethod !== undefined) {
      if (typeof transaction.paymentMethod === 'number') {
        await this.paymentMethodSelect.selectOption({ index: transaction.paymentMethod });
      } else {
        await this.paymentMethodSelect.selectOption(transaction.paymentMethod);
      }
    }

    // Click the submit button and wait for navigation to home page
    const submitButton = this.page.getByTestId('submit-transaction-button');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for automatic navigation to home page after successful save
    await this.page.waitForURL('/');
    await this.page.waitForLoadState('networkidle');

    // Wait for the transaction form to be visible (means page is loaded)
    await expect(this.transactionForm).toBeVisible({ timeout: 10000 });
  }

  async deleteTransaction() {
    const deleteButton = this.page.getByTestId('delete-transaction-button');
    await expect(deleteButton).toBeVisible();

    // Click with force to ensure it's triggered
    await deleteButton.click({ force: true });

    // Wait for navigation
    await this.page.waitForURL('/');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}

