---
applyTo: 'packages/e2e/**'
description: 'E2E testing guidelines for Playwright tests'
---

# E2E Testing Instructions

## Technology Stack

- **Framework:** Playwright
- **Language:** TypeScript
- **Docker:** PostgreSQL container for test database
- **Organization:** Page Object Model pattern

## Project Structure

```
packages/e2e/
├── tests/              # Test files
│   ├── login.spec.ts
│   ├── register.spec.ts
│   ├── transactions.spec.ts
│   └── categories.spec.ts
├── pages/              # Page Object Models
│   ├── LoginPage.ts
│   ├── TransactionsPage.ts
│   └── BasePage.ts
├── helpers/            # Test utilities
│   ├── database.ts     # DB seeding/cleanup
│   ├── auth.ts         # Authentication helpers
│   └── fixtures.ts     # Test data factories
├── docker-compose.test.yaml
└── playwright.config.ts
```

## Page Object Model (POM)

### Base Page

```typescript
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(`http://localhost:5173${path}`);
  }

  async waitForUrl(url: string) {
    await this.page.waitForURL(url);
  }

  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('.error-message');
    return await errorElement.textContent();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }
}
```

### Feature Page

```typescript
export class LoginPage extends BasePage {
  private emailInput = this.page.locator('input[type="email"]');
  private passwordInput = this.page.locator('input[type="password"]');
  private loginButton = this.page.locator('button[type="submit"]');

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getEmailError(): Promise<string | null> {
    const errorElement = this.page.locator('.email-error');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }
}
```

## Test Organization

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { setupTestUser, cleanupTestUser } from '../helpers/database';

test.describe('Login', () => {
  let loginPage: LoginPage;
  const testUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  test.beforeAll(async () => {
    // Setup test data (runs once before all tests)
    await setupTestUser(testUser);
  });

  test.afterAll(async () => {
    // Cleanup test data (runs once after all tests)
    await cleanupTestUser(testUser.email);
  });

  test.beforeEach(async ({ page }) => {
    // Setup for each test
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(testUser.email, testUser.password);
    
    await expect(page).toHaveURL('/transactions');
    await expect(page.locator('h1')).toContainText('Transactions');
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login(testUser.email, 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should validate required fields', async () => {
    await loginPage.login('', '');
    
    await expect(loginPage.page.locator('.email-error'))
      .toContainText('Email is required');
    await expect(loginPage.page.locator('.password-error'))
      .toContainText('Password is required');
  });
});
```

## Database Helpers

### Database Setup

```typescript
// helpers/database.ts
import { Client } from 'pg';

const dbConfig = {
  host: 'localhost',
  port: 5433, // Test database port
  database: 'gualet_test',
  user: 'gualet',
  password: 'gualet',
};

export async function getDbClient(): Promise<Client> {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

export async function setupTestUser(user: { email: string; password: string }) {
  const client = await getDbClient();
  try {
    // Insert user into database (hash password properly)
    await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [user.email, hashPassword(user.password)]
    );
  } finally {
    await client.end();
  }
}

export async function cleanupTestUser(email: string) {
  const client = await getDbClient();
  try {
    await client.query('DELETE FROM users WHERE email = $1', [email]);
  } finally {
    await client.end();
  }
}

export async function seedCategories(userId: string) {
  const client = await getDbClient();
  try {
    await client.query(
      'INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3)',
      [userId, 'Food', 'EXPENSE']
    );
  } finally {
    await client.end();
  }
}
```

## Test Data Factories

```typescript
// helpers/fixtures.ts
import { v4 as uuidv4 } from 'uuid';

export function createTestUser(overrides?: Partial<TestUser>): TestUser {
  return {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    ...overrides,
  };
}

export function createTestTransaction(overrides?: Partial<TestTransaction>): TestTransaction {
  return {
    id: uuidv4(),
    amount: -50.00,
    description: 'Test transaction',
    date: new Date().toISOString(),
    categoryId: uuidv4(),
    paymentMethodId: uuidv4(),
    ...overrides,
  };
}
```

## Authentication Helpers

```typescript
// helpers/auth.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export async function loginAsUser(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  await page.waitForURL('/transactions');
}

// Use storage state to avoid repeated logins
export async function getAuthenticatedState(page: Page): Promise<any> {
  await loginAsUser(page, 'test@example.com', 'password123');
  return await page.context().storageState();
}
```

## Testing Best Practices

### What to Test

✅ **DO Test:**
- Critical user journeys (login, register, CRUD operations)
- User interactions (clicks, form submissions)
- Navigation flows
- Error states and validation messages
- Data persistence (create → refresh → verify)
- Authentication/authorization (logged in vs logged out)

❌ **DON'T Test:**
- Unit-level logic (covered by unit tests)
- Styling details (use visual regression tools if needed)
- Every possible edge case (covered by unit/integration tests)

### Test Isolation

- Each test should be independent
- Don't rely on execution order
- Clean up test data after each test
- Use unique test data (timestamps, UUIDs)

```typescript
test.describe('Transactions', () => {
  let testUser: TestUser;
  
  test.beforeEach(async () => {
    // Create unique user for each test
    testUser = createTestUser();
    await setupTestUser(testUser);
  });

  test.afterEach(async () => {
    // Cleanup after each test
    await cleanupTestUser(testUser.email);
  });

  test('should create transaction', async ({ page }) => {
    await loginAsUser(page, testUser.email, testUser.password);
    // ... test logic
  });
});
```

### Waiting Strategies

```typescript
// ✅ Good: Wait for specific conditions
await page.waitForSelector('.transaction-item');
await page.waitForURL('/transactions');
await expect(page.locator('h1')).toBeVisible();

// ❌ Bad: Arbitrary waits
await page.waitForTimeout(1000); // Flaky and slow
```

### Locators

```typescript
// ✅ Good: Semantic locators
await page.locator('button[type="submit"]').click();
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByTestId('transaction-item').click();

// ❌ Bad: Fragile locators
await page.locator('.css-class-xyz').click(); // Breaks if CSS changes
await page.locator('div > div > button').click(); // Too specific
```

### Assertions

```typescript
// ✅ Good: Playwright's built-in assertions (auto-retry)
await expect(page.locator('h1')).toContainText('Transactions');
await expect(page).toHaveURL('/transactions');
await expect(page.locator('.error')).toBeVisible();

// ❌ Bad: Regular assertions (no retry)
const text = await page.locator('h1').textContent();
expect(text).toBe('Transactions'); // Can be flaky
```

## Running Tests

### Local Development

```bash
# Start test database
docker-compose -f packages/e2e/docker-compose.test.yaml up -d

# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test packages/e2e/tests/login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run in UI mode (interactive)
npx playwright test --ui
```

### Continuous Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start test database
        run: docker-compose -f packages/e2e/docker-compose.test.yaml up -d
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Screenshots and Videos

```typescript
// Automatic on failure (configured in playwright.config.ts)
test('should fail and capture screenshot', async ({ page }) => {
  await page.goto('/transactions');
  await expect(page.locator('.non-existent')).toBeVisible(); // Fails, screenshot captured
});

// Manual screenshot
await page.screenshot({ path: 'screenshot.png' });
```

### Trace Viewer

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Console Logs

```typescript
// Listen to console messages
page.on('console', msg => console.log('Browser console:', msg.text()));

// Listen to errors
page.on('pageerror', error => console.log('Page error:', error));
```

## Docker Configuration

### Test Database

```yaml
# docker-compose.test.yaml
version: '3.8'
services:
  postgres-test:
    image: postgres:16
    environment:
      POSTGRES_DB: gualet_test
      POSTGRES_USER: gualet
      POSTGRES_PASSWORD: gualet
    ports:
      - "5433:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

## Checklist for New E2E Tests

- [ ] Page Object created/updated
- [ ] Test data factory created (if needed)
- [ ] Database setup/cleanup helpers created
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Test is isolated and independent
- [ ] Uses semantic locators (getByRole, getByLabel, etc.)
- [ ] Uses Playwright's assertions (auto-retry)
- [ ] No arbitrary waits (waitForTimeout)
- [ ] Cleans up test data
- [ ] Test passes locally
- [ ] Test passes in CI (if applicable)
- [ ] Test is documented (clear test name)

## Common Patterns

### Testing CRUD Operations

```typescript
test.describe('Transaction CRUD', () => {
  test('should create, read, update, and delete transaction', async ({ page }) => {
    // Create
    await transactionsPage.createTransaction({
      amount: -50,
      description: 'Test transaction',
    });
    await expect(page.locator('.transaction-item').first()).toContainText('Test transaction');

    // Read
    const transactions = await transactionsPage.getTransactions();
    expect(transactions).toHaveLength(1);

    // Update
    await transactionsPage.editTransaction(0, { description: 'Updated transaction' });
    await expect(page.locator('.transaction-item').first()).toContainText('Updated transaction');

    // Delete
    await transactionsPage.deleteTransaction(0);
    const updatedTransactions = await transactionsPage.getTransactions();
    expect(updatedTransactions).toHaveLength(0);
  });
});
```

### Testing Error States

```typescript
test('should handle network errors gracefully', async ({ page, context }) => {
  // Simulate offline mode
  await context.setOffline(true);

  await transactionsPage.createTransaction({ amount: -50, description: 'Test' });

  await expect(page.locator('.error-message')).toContainText('Network error');

  // Go back online
  await context.setOffline(false);
});
```

### Testing Authentication

```typescript
test('should redirect to login when not authenticated', async ({ page }) => {
  await page.goto('/transactions');
  
  await expect(page).toHaveURL('/login');
});

test('should access protected route when authenticated', async ({ page }) => {
  await loginAsUser(page, 'test@example.com', 'password123');
  await page.goto('/transactions');
  
  await expect(page).toHaveURL('/transactions');
  await expect(page.locator('h1')).toContainText('Transactions');
});
```

