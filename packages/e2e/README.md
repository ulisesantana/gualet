# E2E Testing with Full Environment

## Quick Start

### Run tests with complete environment (Recommended)

```bash
npm run test:full
```

This command automatically:
1. Starts PostgreSQL test database (port 5433)
2. Starts backend with test configuration (port 3001)
3. Starts frontend with test configuration (port 5174)
4. Runs all Playwright tests
5. Cleans up all services

### Run tests with UI mode (full environment)

```bash
npm run test:ui:full
```

Same as `test:full` but opens the Playwright UI for interactive testing. Close the UI window to stop all services.

### Manual environment control

```bash
# Start environment manually (for development)
npm run env:start

# In another terminal, run tests
npm test
```

### Database helpers for verification

```typescript
// Verify data in database during tests
const category = await db.getCategoryByName(userId, 'Groceries');
expect(category).toBeDefined();

const exists = await db.categoryExists(userId, 'Groceries', 'OUTCOME');
expect(exists).toBe(true);
```

📖 **See [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md) for complete documentation**

---

## 📋 Summary of Applied Improvements

### ✅ High Priority Improvements Applied

#### 1. **Enhanced Database Manager**
- Added methods for creating categories, payment methods, and transactions
- Added `cleanupUserData()` for targeted cleanup
- Added `getUserByEmail()` for better test setup
- Improved `reset()` to respect foreign key constraints

#### 2. **Authentication Helpers**
- Created `auth.helpers.ts` with reusable login functions
- `loginAsTestUser()` - Quick login with default test user
- `loginAs()` - Login with custom credentials
- `logout()` - Logout helper
- Exported `TEST_USER` constant for consistency

#### 3. **Page Object Models**
- **TransactionsPage**: Complete CRUD operations for transactions
- **CategoriesPage**: Complete CRUD operations for categories
- **PaymentMethodsPage**: Complete CRUD operations for payment methods
- All pages include:
  - Explicit waits with `expect().toBeVisible()`
  - Helper methods for common operations
  - Error and success message handling

#### 4. **Comprehensive Test Suites**

**Transactions Tests** (`tests/transactions.spec.ts`)
- ✅ Create expense/income transactions
- ✅ Edit transactions
- ✅ Delete transactions
- ✅ Display multiple transactions
- ✅ Form validations (empty fields, invalid amounts, missing fields)

**Categories Tests** (`tests/categories.spec.ts`)
- ✅ Create income/expense categories
- ✅ Edit categories
- ✅ Delete categories
- ✅ Display categories grouped by type
- ✅ Full CRUD cycle
- ✅ Form validations (empty name, missing type, duplicates)
- ✅ Allow same name for different types

**Payment Methods Tests** (`tests/payment-methods.spec.ts`)
- ✅ Create payment methods with/without icons
- ✅ Edit payment methods
- ✅ Delete payment methods
- ✅ Display multiple payment methods
- ✅ Full CRUD cycle
- ✅ Form validations (empty name, duplicates, long names, whitespace trimming)

**Network Error Tests** (`tests/network-errors.spec.ts`)
- ✅ API unavailable scenarios
- ✅ 500 server errors
- ✅ Timeout handling
- ✅ 401 unauthorized errors
- ✅ Retry mechanisms
- ✅ Max retries exceeded

#### 5. **Improved Fixtures**
- Automatic database cleanup after each test
- Consistent test isolation

## 🚀 How to Run Tests

### Run all tests
```bash
cd packages/e2e
npm test
```

### Run specific test suite
```bash
npm test transactions.spec.ts
npm test categories.spec.ts
npm test payment-methods.spec.ts
npm test network-errors.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npm test -- --headed
```

### Run tests in debug mode
```bash
npm test -- --debug
```

### Run specific test by name
```bash
npm test -- --grep "should create a new expense transaction"
```

## 📁 Project Structure

```
packages/e2e/
├── helpers/
│   ├── auth.helpers.ts          # Authentication utilities
│   ├── fixtures.ts              # Test fixtures with DB manager
│   ├── generate-random-id.ts   # ID generation utility
│   └── db/
│       └── database-manager.ts  # Enhanced DB operations
├── pages/
│   ├── index.ts                 # Exports all page objects
│   ├── login.page.ts
│   ├── register.page.ts
│   ├── categories.page.ts       # NEW
│   ├── payment-methods.page.ts  # NEW
│   └── transactions.page.ts     # NEW
└── tests/
    ├── login.spec.ts
    ├── register.spec.ts
    ├── categories.spec.ts       # NEW
    ├── payment-methods.spec.ts  # NEW
    ├── transactions.spec.ts     # NEW
    └── network-errors.spec.ts   # NEW
```

## 🎯 Best Practices Implemented

### 1. **Explicit Waits**
```typescript
// Bad
await page.click('button');

// Good
const button = page.getByRole('button', { name: 'Submit' });
await expect(button).toBeVisible();
await button.click();
```

### 2. **Page Object Pattern**
```typescript
// Bad: Direct page interactions in tests
await page.fill('input[name="name"]', 'Test');
await page.click('button[type="submit"]');

// Good: Use page objects
await categoriesPage.fillForm({ name: 'Test', type: 'OUTCOME' });
await categoriesPage.submit();
```

### 3. **Database Setup**
```typescript
// Create test data using database manager
const userId = await db.createUser(TEST_USER);
const categoryId = await db.createCategory({
  userId,
  name: 'Test Category',
  type: 'OUTCOME',
});
```

### 4. **Reusable Helpers**
```typescript
// Use authentication helper instead of repeating login code
await loginAsTestUser(page);
```

## 📊 Test Coverage

| Feature | Tests | Coverage |
|---------|-------|----------|
| Login/Register | ✅ | Existing |
| Transactions | ✅ | **NEW** - Complete CRUD + Validations |
| Categories | ✅ | **NEW** - Complete CRUD + Validations |
| Payment Methods | ✅ | **NEW** - Complete CRUD + Validations |
| Network Errors | ✅ | **NEW** - Comprehensive error handling |

## 🔄 What's Next (Future Improvements)

### Medium Priority
- [ ] Add tests for transaction filters and reports
- [ ] Add tests for date range filtering
- [ ] Add tests for user preferences
- [ ] Add visual regression tests

### Low Priority
- [ ] Add accessibility tests
- [ ] Add performance tests
- [ ] Add mobile viewport tests
- [ ] Add API contract tests

## 🐛 Troubleshooting

### Tests fail with "Database connection error"
Make sure your test database is running:
```bash
docker compose -f docker-compose.test.yaml up -d
```

### Tests are flaky
- Check if there are hardcoded timeouts that need adjustment
- Verify database cleanup is working correctly
- Look for race conditions in async operations

### "Element not found" errors
- Verify that data-testid attributes match between tests and components
- Check if the page is fully loaded before interactions
- Ensure proper wait conditions are in place

## 📝 Writing New Tests

### Basic structure
```typescript
import { expect } from '@playwright/test';
import { test } from '@fixtures';
import { YourPage } from '@pages';
import { loginAsTestUser, TEST_USER } from '../helpers/auth.helpers';

test.describe('Your Feature', () => {
  let userId: string;

  test.beforeEach(async ({ page, db }) => {
    // Setup
    userId = await db.createUser(TEST_USER);
    await loginAsTestUser(page);
  });

  test('should do something', async ({ page, db }) => {
    // Arrange
    const yourPage = new YourPage(page);
    await yourPage.goto();

    // Act
    await yourPage.doSomething();

    // Assert
    await expect(page.getByText('Expected result')).toBeVisible();
  });
});
```

## 🎉 Benefits of These Guidelines

1. **Better Test Reliability**: Explicit waits and proper cleanup reduce flakiness
2. **Easier Maintenance**: Page Objects centralize selectors and actions
3. **Better Coverage**: Comprehensive validation and error handling tests
4. **Reusability**: Helpers and fixtures reduce code duplication
5. **Type Safety**: Full TypeScript support catches errors early
6. **Clear Documentation**: Self-documenting code with descriptive names

