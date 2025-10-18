import {expect, Locator, Page} from '@playwright/test';

export class CategoriesPage {
  readonly page: Page;
  readonly addCategoryButton: Locator;
  readonly manageCategoriesButton: Locator;
  readonly categoryForm: Locator;
  readonly nameInput: Locator;
  readonly typeSelect: Locator;
  readonly iconInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Buttons are in Settings view
    this.addCategoryButton = page.getByRole('button', { name: /add a new category/i });
    this.manageCategoriesButton = page.getByRole('button', { name: /manage categories/i });
    this.categoryForm = page.locator('form');
    this.nameInput = page.locator('input[name="name"]');
    this.typeSelect = page.locator('select[name="type"]');
    this.iconInput = page.locator('input[name="icon"]');
    // Submit button uses emoji, so we select by type instead
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async gotoManage() {
    await this.page.goto('/settings');
    await expect(this.manageCategoriesButton).toBeVisible();
    await this.manageCategoriesButton.click();
  }

  async clickCreate() {
    // From settings page, click "Add a new category"
    await this.page.goto('/settings');
    await expect(this.addCategoryButton).toBeVisible();
    await this.addCategoryButton.click();
    await expect(this.categoryForm).toBeVisible();
  }

  async fillForm(category: {
    name: string;
    type: 'INCOME' | 'OUTCOME';
    icon?: string;
  }) {
    await expect(this.categoryForm).toBeVisible();

    // Select type first (defaults to OUTCOME)
    await this.typeSelect.selectOption(category.type);

    // Fill name
    await this.nameInput.fill(category.name);

    // Fill icon if provided
    if (category.icon) {
      await this.iconInput.fill(category.icon);
    }
  }

  async submit() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async createCategory(category: {
    name: string;
    type: 'INCOME' | 'OUTCOME';
    icon?: string;
  }) {
    await this.clickCreate();
    await this.fillForm(category);
    await this.submit();
  }

  async waitForSuccess() {
    // Wait for redirect to categories list after creation
    await this.page.waitForURL(/categories/, { timeout: 5000 });
  }

  async waitForError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  getCategoryItem(categoryId: string): Locator {
    return this.page.locator(`[data-testid="category-item-${categoryId}"]`);
  }

  getCategoryByName(name: string): Locator {
    return this.page.locator(`[data-testid^="category-item-"]`, {
      hasText: name,
    });
  }

  async editCategory(categoryId: string) {
    const item = this.getCategoryItem(categoryId);
    await expect(item).toBeVisible();
    await item.click();
    await expect(this.categoryForm).toBeVisible();
  }

  async deleteCategory(categoryId: string) {
    const item = this.getCategoryItem(categoryId);
    await expect(item).toBeVisible();
    const deleteButton = item.getByRole('button', { name: /delete/i });
    await deleteButton.click();

    // Wait for confirmation dialog and confirm
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  async verifyCategoryExists(name: string) {
    await expect(this.getCategoryByName(name)).toBeVisible();
  }

  async verifyCategoryNotExists(name: string) {
    await expect(this.getCategoryByName(name)).not.toBeVisible();
  }
}
