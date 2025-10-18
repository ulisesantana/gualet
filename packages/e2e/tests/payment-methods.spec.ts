import {expect} from '@playwright/test';
import {test} from '@fixtures';
import {PaymentMethodsPage} from '@pages';
import {loginAsTestUser, TEST_USER} from '../helpers/auth.helpers';

test.describe('Payment Methods Management', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should create a new payment method', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.createPaymentMethod({
      name: 'Debit Card',
      icon: '💳',
      color: '#4287f5',
    });

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists('Debit Card');
  });

  test('should create a payment method without icon and color', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.createPaymentMethod({
      name: 'Cash',
    });

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists('Cash');
  });

  test('should edit an existing payment method', async ({ page, db }) => {
    // Create a payment method first
    await db.createPaymentMethod({
      userId,
      name: 'Original Payment',
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.editPaymentMethod('Original Payment');
    await paymentMethodsPage.nameInput.fill('Updated Payment');
    await paymentMethodsPage.iconInput.fill('🏦');
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists('Updated Payment');
    await paymentMethodsPage.verifyPaymentMethodNotExists('Original Payment');
  });

  test('should delete a payment method', async ({ page, db }) => {
    // Create a payment method first
    await db.createPaymentMethod({
      userId,
      name: 'Payment to Delete',
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.verifyPaymentMethodExists('Payment to Delete');
    await paymentMethodsPage.deletePaymentMethod('Payment to Delete');

    await paymentMethodsPage.verifyPaymentMethodNotExists('Payment to Delete');
  });

  test('should display multiple payment methods', async ({ page, db }) => {
    // Create multiple payment methods
    const paymentMethods = [
      { name: 'Credit Card', icon: '💳' },
      { name: 'Bank Transfer', icon: '🏦' },
      { name: 'PayPal', icon: '💰' },
      { name: 'Cash', icon: '💵' },
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
  });

  test('should complete full CRUD cycle', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Create
    await paymentMethodsPage.createPaymentMethod({
      name: 'Test Payment',
      icon: '🧪',
      color: '#ff0000',
    });
    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists('Test Payment');

    // Update
    await paymentMethodsPage.editPaymentMethod('Test Payment');
    await paymentMethodsPage.nameInput.fill('Modified Payment');
    await paymentMethodsPage.iconInput.fill('✏️');
    await paymentMethodsPage.colorInput.fill('#00ff00');
    await paymentMethodsPage.submit();
    await paymentMethodsPage.waitForSuccess();
    await paymentMethodsPage.verifyPaymentMethodExists('Modified Payment');

    // Delete
    await paymentMethodsPage.deletePaymentMethod('Modified Payment');
    await paymentMethodsPage.verifyPaymentMethodNotExists('Modified Payment');
  });
});

test.describe('Payment Method Form Validations', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should show error for empty name', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();
    await paymentMethodsPage.clickCreate();

    // Try to submit without name
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForError();
    await expect(page.getByText(/name is required|name cannot be empty/i)).toBeVisible();
  });

  test('should show error for duplicate payment method name', async ({ page, db }) => {
    // Create a payment method first
    await db.createPaymentMethod({
      userId,
      name: 'Existing Payment',
    });

    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    // Try to create another payment method with the same name
    await paymentMethodsPage.createPaymentMethod({
      name: 'Existing Payment',
    });

    await paymentMethodsPage.waitForError();
    await expect(page.getByText(/payment method.*already exists|duplicate payment/i)).toBeVisible();
  });

  test('should trim whitespace from name', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();

    await paymentMethodsPage.clickCreate();
    await paymentMethodsPage.nameInput.fill('  Visa Card  ');
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForSuccess();

    // Verify the name is trimmed
    const item = paymentMethodsPage.getPaymentMethodItem('Visa Card');
    await expect(item).toBeVisible();
  });

  test('should show error for very long name', async ({ page }) => {
    const paymentMethodsPage = new PaymentMethodsPage(page);
    await paymentMethodsPage.goto();
    await paymentMethodsPage.clickCreate();

    // Try to create a payment method with a very long name
    const longName = 'A'.repeat(256);
    await paymentMethodsPage.nameInput.fill(longName);
    await paymentMethodsPage.submit();

    await paymentMethodsPage.waitForError();
    await expect(page.getByText(/name is too long|maximum.*characters/i)).toBeVisible();
  });
});

