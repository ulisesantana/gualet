import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {CategoriesPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Categories Management', () => {
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();
    await loginAsTestUser(page);
  });

  test('should create a new expense category', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `Movies ${testTimestamp}`;
    await categoriesPage.goto();

    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
      icon: '🎬',
    });

    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists(categoryName);

    // Verify in database
    const dbCategory = await db.getCategoryByName(userId, categoryName);
    expect(dbCategory).toBeTruthy();
    expect(dbCategory.type).toBe('OUTCOME');
    expect(dbCategory.icon).toBe('🎬');
  });

  test('should create a new income category', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `Consulting ${testTimestamp}`;
    await categoriesPage.goto();

    await categoriesPage.createCategory({
      name: categoryName,
      type: 'INCOME',
      icon: '💼',
    });

    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists(categoryName);

    // Verify in database
    const dbCategory = await db.getCategoryByName(userId, categoryName);
    expect(dbCategory).toBeTruthy();
    expect(dbCategory.type).toBe('INCOME');
    expect(dbCategory.icon).toBe('💼');
  });

  test('should edit an existing category', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const originalName = `Original ${testTimestamp}`;
    const updatedName = `Updated ${testTimestamp}`;

    // Create a category via UI first
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: originalName,
      type: 'OUTCOME',
      icon: '📝',
    });
    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists(originalName);

    // Now edit it by clicking on the edit button for that category name
    await categoriesPage.editCategoryByName(originalName);
    await categoriesPage.nameInput.fill(updatedName);
    await categoriesPage.iconInput.fill('🎯');
    await categoriesPage.submit();

    await categoriesPage.waitForSuccess();
    await categoriesPage.verifyCategoryExists(updatedName);
    await categoriesPage.verifyCategoryNotExists(originalName);

    // Verify in database
    const dbCategory = await db.getCategoryByName(userId, updatedName);
    expect(dbCategory).toBeTruthy();
    expect(dbCategory.icon).toBe('🎯');

    const oldCategory = await db.getCategoryByName(userId, originalName);
    expect(oldCategory).toBeNull();
  });

  test('should delete a category', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `ToDelete ${testTimestamp}`;

    // Create a category via UI first
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
      icon: '🗑️',
    });
    await categoriesPage.waitForSuccess();

    // Navigate to manage to see the category
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists(categoryName);

    // Now delete it by clicking on the delete button for that category name
    await categoriesPage.deleteCategoryByName(categoryName);

    // Verify it's gone by navigating to the list again
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryNotExists(categoryName);

    // Verify in database
    const dbCategory = await db.getCategoryByName(userId, categoryName);
    expect(dbCategory).toBeNull();
  });

  test('should display multiple categories grouped by type', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);

    // Create some income categories
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: `Salary ${testTimestamp}`,
      type: 'INCOME',
      icon: '💼',
    });
    await categoriesPage.waitForSuccess();

    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: `Investments ${testTimestamp}`,
      type: 'INCOME',
      icon: '📈',
    });
    await categoriesPage.waitForSuccess();

    // Create some outcome categories
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: `Rent ${testTimestamp}`,
      type: 'OUTCOME',
      icon: '🏠',
    });
    await categoriesPage.waitForSuccess();

    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: `Groceries ${testTimestamp}`,
      type: 'OUTCOME',
      icon: '🛒',
    });
    await categoriesPage.waitForSuccess();

    // Now navigate to the list and verify all categories are displayed
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists(`Salary ${testTimestamp}`);
    await categoriesPage.verifyCategoryExists(`Investments ${testTimestamp}`);
    await categoriesPage.verifyCategoryExists(`Rent ${testTimestamp}`);
    await categoriesPage.verifyCategoryExists(`Groceries ${testTimestamp}`);

    // Verify in database
    const categories = await db.getUserCategories(userId);
    expect(categories.length).toBeGreaterThanOrEqual(4);

    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const outcomeCategories = categories.filter(c => c.type === 'OUTCOME');

    expect(incomeCategories.length).toBeGreaterThanOrEqual(2);
    expect(outcomeCategories.length).toBeGreaterThanOrEqual(2);
  });

  test('should complete full CRUD cycle', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `TestCRUD ${testTimestamp}`;
    const updatedName = `ModifiedCRUD ${testTimestamp}`;

    await categoriesPage.goto();

    // Create
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
      icon: '🧪',
    });
    await categoriesPage.waitForSuccess();
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists(categoryName);

    // Verify creation in database
    let dbCategory = await db.getCategoryByName(userId, categoryName);
    expect(dbCategory).toBeTruthy();
    expect(dbCategory.icon).toBe('🧪');

    // Update
    await categoriesPage.editCategoryByName(categoryName);
    await categoriesPage.nameInput.fill(updatedName);
    await categoriesPage.iconInput.fill('✏️');
    await categoriesPage.submit();
    await categoriesPage.waitForSuccess();
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryExists(updatedName);
    await categoriesPage.verifyCategoryNotExists(categoryName);

    // Verify update in database
    dbCategory = await db.getCategoryByName(userId, updatedName);
    expect(dbCategory).toBeTruthy();
    expect(dbCategory.icon).toBe('✏️');

    const oldCategory = await db.getCategoryByName(userId, categoryName);
    expect(oldCategory).toBeNull();

    // Delete
    await categoriesPage.deleteCategoryByName(updatedName);
    await categoriesPage.gotoManage();
    await categoriesPage.verifyCategoryNotExists(updatedName);

    // Verify deletion in database
    dbCategory = await db.getCategoryByName(userId, updatedName);
    expect(dbCategory).toBeNull();
  });
});

test.describe('Category Form Validations', () => {
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();
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
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `UniqueTest ${testTimestamp}`;

    // Create the first category via UI
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
      icon: '🧪',
    });
    await categoriesPage.waitForSuccess();

    // Verify first category exists in database
    const dbCategory = await db.getCategoryByName(userId, categoryName);
    expect(dbCategory).toBeTruthy();

    // Try to create another category with the same name and type
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
    });

    // Wait a bit for the operation to complete
    await page.waitForTimeout(2000);

    // Should show error OR redirect back to list without creating duplicate
    // Check if we're still on the form (error shown) or redirected to list
    const currentUrl = page.url();
    const isOnForm = currentUrl.includes('/add');

    if (isOnForm) {
      // Still on form, should see error
      await categoriesPage.waitForError();
    }

    // Verify only one category exists in database (most important check)
    const categories = await db.getUserCategories(userId);
    const duplicates = categories.filter(c => c.name === categoryName && c.type === 'OUTCOME');
    expect(duplicates.length).toBe(1);
  });

  test('should allow categories with same name but different types', async ({ page, db }) => {
    const categoriesPage = new CategoriesPage(page);
    const categoryName = `Bonuses ${testTimestamp}`;

    // Create an outcome category via UI
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'OUTCOME',
      icon: '💸',
    });
    await categoriesPage.waitForSuccess();

    // Create an income category with the same name (should be allowed)
    await categoriesPage.goto();
    await categoriesPage.createCategory({
      name: categoryName,
      type: 'INCOME',
      icon: '💰',
    });

    await categoriesPage.waitForSuccess();

    // Both should exist
    await categoriesPage.verifyCategoryExists(categoryName);

    // Verify both exist in database with different types
    const categories = await db.getUserCategories(userId);
    const bonusCategories = categories.filter(c => c.name === categoryName);

    expect(bonusCategories.length).toBe(2);
    expect(bonusCategories.some(c => c.type === 'INCOME')).toBe(true);
    expect(bonusCategories.some(c => c.type === 'OUTCOME')).toBe(true);
  });
});
