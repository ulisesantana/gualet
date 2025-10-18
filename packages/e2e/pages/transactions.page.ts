import {expect, Locator, Page} from '@playwright/test';

export class TransactionsPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly transactionForm: Locator;
  readonly descriptionInput: Locator;
  readonly amountInput: Locator;
  readonly dateInput: Locator;
  readonly categorySelect: Locator;
  readonly paymentMethodSelect: Locator;
  readonly typeIncomeRadio: Locator;
  readonly typeExpenseRadio: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: /new transaction|add transaction|create/i });
    this.transactionForm = page.locator('[data-testid="transaction-form"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.dateInput = page.locator('input[name="date"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.paymentMethodSelect = page.locator('select[name="paymentMethod"]');
    this.typeIncomeRadio = page.locator('input[name="type"][value="INCOME"]');
    this.typeExpenseRadio = page.locator('input[name="type"][value="OUTCOME"]');
    this.submitButton = page.getByRole('button', { name: /save|submit|create/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/transactions');
  }

  async clickCreate() {
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
    await expect(this.transactionForm).toBeVisible();
  }

  async fillForm(transaction: {
    description: string;
    amount: number;
    date?: string;
    categoryId: string;
    paymentMethodId: string;
    type?: 'INCOME' | 'OUTCOME';
  }) {
    // Wait for form to be visible
    await expect(this.transactionForm).toBeVisible();

    // Fill description
    await this.descriptionInput.fill(transaction.description);

    // Fill amount
    await this.amountInput.fill(transaction.amount.toString());

    // Fill date if provided, otherwise use today
    const date = transaction.date || new Date().toISOString().split('T')[0];
    await this.dateInput.fill(date);

    // Select category
    await this.categorySelect.selectOption(transaction.categoryId);

    // Select payment method
    await this.paymentMethodSelect.selectOption(transaction.paymentMethodId);

    // Select type if provided
    if (transaction.type === 'INCOME') {
      await this.typeIncomeRadio.click();
    } else if (transaction.type === 'OUTCOME') {
      await this.typeExpenseRadio.click();
    }
  }

  async submit() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async createTransaction(transaction: {
    description: string;
    amount: number;
    date?: string;
    categoryId: string;
    paymentMethodId: string;
    type?: 'INCOME' | 'OUTCOME';
  }) {
    await this.clickCreate();
    await this.fillForm(transaction);
    await this.submit();
  }

  async waitForSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  getTransactionItem(description: string): Locator {
    return this.page.locator(`[data-testid="transaction-item"]`, {
      hasText: description,
    });
  }

  async editTransaction(description: string) {
    const item = this.getTransactionItem(description);
    await expect(item).toBeVisible();
    const editButton = item.getByRole('button', { name: /edit/i });
    await editButton.click();
    await expect(this.transactionForm).toBeVisible();
  }

  async deleteTransaction(description: string) {
    const item = this.getTransactionItem(description);
    await expect(item).toBeVisible();
    const deleteButton = item.getByRole('button', { name: /delete/i });
    await deleteButton.click();

    // Wait for confirmation dialog and confirm
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  async verifyTransactionExists(description: string) {
    await expect(this.getTransactionItem(description)).toBeVisible();
  }

  async verifyTransactionNotExists(description: string) {
    await expect(this.getTransactionItem(description)).not.toBeVisible();
  }
}

