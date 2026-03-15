---
applyTo: '**'
description: 'Testing standards and best practices for Gualet project'
---

# Testing Instructions

## Coverage Requirements

- **Minimum coverage:** > 95% for statements, lines, and functions
- **Minimum branch coverage:** 100%
- Use tools to measure test coverage: `npm run test:cov` in respective packages
- Ensure tests cover:
  - Happy paths
  - Edge cases
  - Error handling scenarios
  - Boundary conditions
  - Authentication/authorization flows

## Mocking Best Practices

- **Avoid mocking whole files** - Mock only necessary parts or dependencies
- **Prefer dependency injection** - Ensure code has dependencies properly injected for easier mocking
- **Use real implementations when possible** - Only mock external services, databases, or slow operations
- **Mock at the boundary** - Mock HTTP clients, database connections, not business logic

## Test Organization

### Backend (NestJS + Jest)
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: jest.Mocked<DependencyType>;

  beforeEach(() => {
    // Setup mocks and test module
  });

  describe('methodName', () => {
    it('should handle success case', () => {});
    it('should handle error case', () => {});
    it('should validate input', () => {});
  });
});
```

### Frontend (React + Vitest)
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {});
  it('should handle user interactions', () => {});
  it('should handle loading states', () => {});
  it('should handle error states', () => {});
});
```

### E2E (Playwright)
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test data
  });

  test('should complete user journey', async ({ page }) => {
    // Test complete user flow
  });
});
```

## What to Test

### Backend
- ✅ Controllers: Request/response handling, validation, error cases
- ✅ Services: Business logic, error handling, edge cases
- ✅ Repositories: Data access patterns, null handling
- ✅ Guards/Middleware: Authentication, authorization
- ✅ DTOs: Validation rules
- ✅ Entities: Model relationships, constraints

### Frontend
- ✅ Components: Rendering, user interactions, conditional rendering
- ✅ Hooks: State management, side effects
- ✅ Services: API calls, error handling
- ✅ Utilities: Pure functions, transformations
- ✅ Repositories: Data access, caching

### E2E
- ✅ Critical user journeys (login, registration, create/edit/delete)
- ✅ Authentication flows
- ✅ Error handling (network errors, validation errors)
- ✅ Offline scenarios (when offline-first is implemented)

## Running Tests

```bash
# Backend tests
npm run test:backend           # Run all tests
npm run test:backend:cov       # With coverage
npm run test:backend:watch     # Watch mode

# Frontend tests
npm run test:frontend          # Run all tests
npm run test:frontend:cov      # With coverage
npm run test:frontend:watch    # Watch mode

# E2E tests (requires Docker)
npm run test:e2e               # Run all E2E tests
```

## Test Quality Checklist

- [ ] Tests are isolated (no dependencies between tests)
- [ ] Tests are deterministic (same result every time)
- [ ] Tests are fast (unit tests < 100ms)
- [ ] Test names describe what they test
- [ ] Arrange-Act-Assert pattern is followed
- [ ] No console errors or warnings
- [ ] Tests clean up after themselves
