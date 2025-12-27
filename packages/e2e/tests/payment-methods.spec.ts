import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {PaymentMethodsPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Payment Methods Management', () => {
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();
    await loginAsTestUser(page);
  });

  test('should create a new payment method', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    const pmName = `Debit Card ${testTimestamp}`;

    await paymentMethodsPage.goto();

    await paymentMethodsPage.createPaymentMethod({
      name: pmName,
      icon: '💳',
    });

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists(pmName);

    // Verify in database
    const dbPaymentMethod = await db.getPaymentMethodByName(userId, pmName);
    expect(dbPaymentMethod).toBeTruthy();
    expect(dbPaymentMethod.icon).toBe('💳');
  });

  test('should create a payment method without icon', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    const pmName = `Cash ${testTimestamp}`;

    await paymentMethodsPage.goto();

    await paymentMethodsPage.createPaymentMethod({
      name: pmName,
    });

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists(pmName);

    // Verify in database
    const dbPaymentMethod = await db.getPaymentMethodByName(userId, pmName);
    expect(dbPaymentMethod).toBeTruthy();
  });

  test('should edit an existing payment method', async ({ page, db }) => {
    // Create a payment method first
    const originalName = `Original Payment ${testTimestamp}`;
    const updatedName = `Updated Payment ${testTimestamp}`;

    await db.createPaymentMethod({
      userId,
      name: originalName,
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.editPaymentMethod(originalName);
    await paymentMethodsPage.nameInput.fill(updatedName);
    await paymentMethodsPage.iconInput.fill('🏦');
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists(updatedName);
    await paymentMethodsPage.verifyPaymentMethodNotExists(originalName);

    // Verify in database
    const dbPaymentMethod = await db.getPaymentMethodByName(userId, updatedName);
    expect(dbPaymentMethod).toBeTruthy();
    expect(dbPaymentMethod.icon).toBe('🏦');

    const oldPaymentMethod = await db.getPaymentMethodByName(userId, originalName);
    expect(oldPaymentMethod).toBeNull();
  });

  test('should delete a payment method', async ({ page, db }) => {
    // Create a payment method first
    const pmName = `Payment to Delete ${testTimestamp}`;

    await db.createPaymentMethod({
      userId,
      name: pmName,
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.verifyPaymentMethodExists(pmName);
    await paymentMethodsPage.deletePaymentMethod(pmName);

    await paymentMethodsPage.verifyPaymentMethodNotExists(pmName);

    // Verify in database
    const dbPaymentMethod = await db.getPaymentMethodByName(userId, pmName);
    expect(dbPaymentMethod).toBeNull();
  });

  test('should display multiple payment methods', async ({ page, db }) => {
    // Create multiple payment methods
    const paymentMethods = [
      { name: `Credit Card ${testTimestamp}`, icon: '💳' },
      { name: `Bank Transfer ${testTimestamp}`, icon: '🏦' },
      { name: `PayPal ${testTimestamp}`, icon: '💰' },
      { name: `Cash ${testTimestamp}`, icon: '💵' },
    ];

    for (const pm of paymentMethods) {
      await db.createPaymentMethod({
        userId,
        name: pm.name,
        icon: pm.icon,
      });
    }

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    for (const pm of paymentMethods) {
      await paymentMethodsPage.verifyPaymentMethodExists(pm.name);
    }

    // Verify in database
    const dbPaymentMethods = await db.getUserPaymentMethods(userId);
    expect(dbPaymentMethods.length).toBe(paymentMethods.length);
  });

  test('should complete full CRUD cycle', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    const pmName = `Test Payment ${testTimestamp}`;
    const modifiedName = `Modified Payment ${testTimestamp}`;

    await paymentMethodsPage.goto();

    // Create
    await paymentMethodsPage.createPaymentMethod({
      name: pmName,
      icon: '🧪',
    });
    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists(pmName);

    // Verify creation in database
    let dbPaymentMethod = await db.getPaymentMethodByName(userId, pmName);
    expect(dbPaymentMethod).toBeTruthy();
    expect(dbPaymentMethod.icon).toBe('🧪');

    // Update
    await paymentMethodsPage.editPaymentMethod(pmName);
    await paymentMethodsPage.nameInput.fill(modifiedName);
    await paymentMethodsPage.iconInput.fill('✏️');
    await paymentMethodsPage.submit();
    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists(modifiedName);

    // Verify update in database
    dbPaymentMethod = await db.getPaymentMethodByName(userId, modifiedName);
    expect(dbPaymentMethod).toBeTruthy();
    expect(dbPaymentMethod.icon).toBe('✏️');

    const oldPaymentMethod = await db.getPaymentMethodByName(userId, pmName);
    expect(oldPaymentMethod).toBeNull();

    // Delete
    await paymentMethodsPage.deletePaymentMethod(modifiedName);
    await paymentMethodsPage.verifyPaymentMethodNotExists(modifiedName);

    // Verify deletion in database
    dbPaymentMethod = await db.getPaymentMethodByName(userId, modifiedName);
    expect(dbPaymentMethod).toBeNull();
  });
});

test.describe.skip('Payment Method Form Validations', () => {
  // TODO: Payment methods UI needs to be reviewed
  let userId: string;
  let testTimestamp: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    testTimestamp = Date.now().toString();
    await loginAsTestUser(page);
  });

  test('should show error for empty name', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();
    await paymentMethodsPage.clickCreate();

    // Try to submit without name
    await paymentMethodsPage.submit();

    // Browser validation should prevent submission or error message should appear
    await expect(paymentMethodsPage.nameInput).toHaveAttribute('required', '');

    // TODO: expect validation message "Please fill out this field." or similar

    // Verify no payment method was created in database
    const paymentMethods = await db.getUserPaymentMethods(userId);
    expect(paymentMethods.length).toBe(0);
  });

  test('should show error for duplicate payment method name', async ({ page, db }) => {
    // Create a payment method first
    const pmName = `Existing Payment ${testTimestamp}`;

    await db.createPaymentMethod({
      userId,
      name: pmName,
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Try to create another payment method with the same name
    await paymentMethodsPage.createPaymentMethod({
      name: pmName,
    });

    await paymentMethodsPage.waitForError();

    // Verify only one payment method exists in database
    const paymentMethods = await db.getUserPaymentMethods(userId);
    const duplicates = paymentMethods.filter(pm => pm.name === pmName);
    expect(duplicates.length).toBe(1);
  });

  test('should trim whitespace from name', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.clickCreate();
    await paymentMethodsPage.nameInput.fill('  Visa Card  ');
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForSuccess();

    // Verify the name is trimmed in database
    const dbPaymentMethod = await db.getPaymentMethodByName(userId, 'Visa Card');
    expect(dbPaymentMethod).toBeTruthy();
    expect(dbPaymentMethod.name).toBe('Visa Card');
  });

  test('should show error for very long name', async ({ page, db }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();
    await paymentMethodsPage.clickCreate();

    // Try to create a payment method with a very long name
    const longName = 'A'.repeat(256);
    await paymentMethodsPage.nameInput.fill(longName);
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForError();

    // Verify no payment method was created in database
    const paymentMethods = await db.getUserPaymentMethods(userId);
    expect(paymentMethods.length).toBe(0);
  });
});

