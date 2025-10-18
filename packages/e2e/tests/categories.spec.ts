import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {CategoriesPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe.skip('Categories Management', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should create a new expense category', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    await categoriesPage.createCategory({
      name: 'Entertainment',
      type: 'OUTCOME',
      icon: '🎬',
    });

    await categoriesPage.waitForSuccess();

    // Navigate to categories list to verify
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists('Entertainment');
  });

  test('should create a new income category', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    await categoriesPage.createCategory({
      name: 'Freelance',
      type: 'INCOME',
      icon: '💼',
    });

    await categoriesPage.waitForSuccess();

    // Navigate to categories list to verify
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists('Freelance');
  });

  test('should edit an existing category', async ({ page, db }) => {
    // Create a category first
    const categoryId = await db.createCategory({
      userId,
      name: 'Original Category',
      type: 'OUTCOME',
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.gotoManage();

    await categoriesPage.editCategory(categoryId);
    await categoriesPage.nameInput.fill('Updated Category');
    await categoriesPage.iconInput.fill('🎯');
    await categoriesPage.submit();

    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists('Updated Category');
    await categoriesPage.verifyCategoryNotExists('Original Category');
  });

  test('should delete a category', async ({ page, db }) => {
    // Create a category first
    const categoryId = await db.createCategory({
      userId,
      name: 'Category to Delete',
      type: 'OUTCOME',
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.gotoManage();

    await categoriesPage.verifyCategoryExists('Category to Delete');
    await categoriesPage.deleteCategory(categoryId);

    await categoriesPage.verifyCategoryNotExists('Category to Delete');
  });

  test('should display multiple categories grouped by type', async ({ page, db }) => {
    // Create income categories
    await db.createCategory({
      userId,
      name: 'Salary',
      type: 'INCOME',
    });
    await db.createCategory({
      userId,
      name: 'Investments',
      type: 'INCOME',
    });

    // Create outcome categories
    await db.createCategory({
      userId,
      name: 'Rent',
      type: 'OUTCOME',
    });
    await db.createCategory({
      userId,
      name: 'Utilities',
      type: 'OUTCOME',
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.gotoManage();

    // Verify all categories are displayed
    await categoriesPage.verifyCategoryExists('Salary');
    await categoriesPage.verifyCategoryExists('Investments');
    await categoriesPage.verifyCategoryExists('Rent');
    await categoriesPage.verifyCategoryExists('Utilities');
  });

  test('should complete full CRUD cycle', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    // Create
    await categoriesPage.createCategory({
      name: 'Test Category',
      type: 'OUTCOME',
      icon: '🧪',
    });
    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists('Test Category');

    // Update
    await categoriesPage.editCategory('Test Category');
    await categoriesPage.nameInput.fill('Modified Category');
    await categoriesPage.iconInput.fill('✏️');
    await categoriesPage.submit();
    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists('Modified Category');

    // Delete
    await categoriesPage.deleteCategory('Modified Category');
    await categoriesPage.verifyCategoryNotExists('Modified Category');
  });
});

test.describe.skip('Category Form Validations', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should show error for empty name', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();
    await categoriesPage.clickCreate();

    // Try to submit without name
    await categoriesPage.typeSelect.selectOption('OUTCOME');
    await categoriesPage.submit();

    // Browser validation should prevent submission
    // Check if we're still on the same page (form didn't submit)
    await expect(categoriesPage.categoryForm).toBeVisible();
  });

  test('should show error for duplicate category name', async ({ page, db }) => {
    // Create a category first
    await db.createCategory({
      userId,
      name: 'Existing Category',
      type: 'OUTCOME',
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    // Try to create another category with the same name
    await categoriesPage.createCategory({
      name: 'Existing Category',
      type: 'OUTCOME',
    });

    await categoriesPage.waitForError();
  });

  test('should allow categories with same name but different types', async ({ page, db }) => {
    // Create an outcome category
    await db.createCategory({
      userId,
      name: 'Gifts',
      type: 'OUTCOME',
    });

    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();

    // Create an income category with the same name
    await categoriesPage.createCategory({
      name: 'Gifts',
      type: 'INCOME',
    });

    await categoriesPage.waitForSuccess();
  });
});
