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
    // Buttons are in Settings view - using i18n English translations
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
    // AlertMessage uses role="alert" or role="status" instead of CSS class
    this.errorMessage = page.locator('[role="alert"], [role="status"], [data-testid="error-message"]');
  }

  // ===== Navigation Methods =====

  async goto() {
    await this.page.goto('/settings');
  }

  async gotoManage() {
    // Navigate directly to categories list to ensure fresh data load
    await this.page.goto('/categories');
    await this.page.waitForLoadState('networkidle');
  }

  // ===== Form Interaction Methods =====

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

  // ===== CRUD Operations =====

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
    // Wait for content to be visible (either the list or the "no categories" message)
    await this.page.waitForLoadState('networkidle');
    // Add a small delay to ensure backend transaction is committed
    await this.page.waitForTimeout(500);
  }

  async waitForError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  // ===== Locator Helpers =====

  getCategoryByName(name: string): Locator {
    return this.page.locator(`[data-testid^="category-item-"]`, {
      hasText: name,
    });
  }

  // ===== Edit Operations =====


  async editCategoryByName(categoryName: string) {
    const item = this.getCategoryByName(categoryName).first();
    await expect(item).toBeVisible();
    // Click the edit button inside the category item
    const editButton = item.getByRole('button', { name: 'Edit category' });
    await editButton.click();
    await expect(this.categoryForm).toBeVisible();
  }

  // ===== Delete Operations =====


  async deleteCategoryByName(categoryName: string) {
    const item = this.getCategoryByName(categoryName).first();
    await expect(item).toBeVisible();

    const deleteButton = item.getByRole('button', { name: 'Delete category' });
    await expect(deleteButton).toBeVisible();

    // Setup dialog handler BEFORE clicking
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Click the delete button
    await deleteButton.click({ force: true });

    // Wait a bit for the async operations to start
    await this.page.waitForTimeout(1000);
  }

  // ===== Verification Methods =====

  /**
   * Verify that a category with the given name is visible in the UI
   * Uses .first() to handle cases with multiple categories with the same name
   * (e.g., same name but different types: INCOME and OUTCOME)
   */
  async verifyCategoryExists(name: string) {
    await expect(this.getCategoryByName(name).first()).toBeVisible();
  }

  /**
   * Verify that a category with the given name is NOT visible in the UI
   * Waits up to 10 seconds for the category to disappear
   */
  async verifyCategoryNotExists(name: string) {
    // Wait for the category to disappear with generous timeout
    // This allows time for: delete API call + event dispatch + list refresh
    await expect(this.getCategoryByName(name)).not.toBeVisible({ timeout: 10000 });
  }
}
