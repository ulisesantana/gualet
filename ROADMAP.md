# 🗺️ ROADMAP - Backend Migration Refactor

## 📊 Current Project Status

### ✅ Completed

#### Backend (NestJS + PostgreSQL + TypeORM)

- [x] Basic backend structure with NestJS
- [x] JWT Authentication (login, register, logout, verify)
- [x] PostgreSQL database with TypeORM
- [x] Entities defined: User, Category, PaymentMethod, Transaction
- [x] Database migrations configured
- [x] Complete Categories CRUD
- [x] Complete Payment Methods CRUD
- [x] Complete Transactions CRUD
- [x] Custom error system by domain
- [x] Authentication Guards (JwtAuthGuard)
- [x] Controllers with unified error handling
- [x] E2E tests working correctly (7/7 passing)
- [x] Docker Compose for development and testing databases
- [x] Automatic creation of default categories and payment methods on
  registration

#### Frontend (React + Axios)

- [x] Hexagonal architecture (application, domain, infrastructure)
- [x] HTTP repositories implemented for:
    - [x] User (login, register, logout, verify)
    - [x] Categories (create, update, findAll, findById)
    - [x] PaymentMethods (create, update, findAll, findById)
    - [x] Transactions (create, update, findAll, findById, delete)
- [x] HttpDataSource configured with Axios
- [x] Use cases implemented:
    - [x] Login
    - [x] Sign Up
    - [x] Logout
    - [x] Verify Session
    - [x] Get All Categories
    - [x] Get Category
    - [x] Save Category
    - [x] Get All Payment Methods
    - [x] Get Payment Method
    - [x] Get Last Transactions
    - [x] Get Transaction
    - [x] Save Transaction
    - [x] Remove Transaction
    - [x] Get Transaction Settings
    - [x] Get User Preferences
    - [x] Save User Preferences (localStorage only)
    - [x] Get Report

#### Infrastructure

- [x] Monorepo with npm workspaces organized in `packages/` folder
- [x] Shared package (`@gualet/shared`) with common code
- [x] E2E tests with Playwright working
- [x] TypeScript configured across the project
- [x] ESLint and Prettier configured

---

## 🚧 Pending

### 🔴 Critical - Basic Functionality

#### 1. Remove Supabase dependency

- [x] Remove `@supabase/supabase-js` from frontend `package.json`
- [x] Verify no Supabase references remain in the code
- [x] Clean up unused dependencies from `package-lock.json`

#### 2. Complete Frontend Use Cases

**Payment Methods:**

- [ ] Implement `SavePaymentMethodUseCase` (create/update)
- [ ] Implement tests for `SavePaymentMethodUseCase`


#### 3. User Preferences - Backend Synchronization

**Current:** User preferences are saved only in localStorage
**Required:**

- [ ] Create `UserPreferences` entity in backend
- [ ] Create preferences table in database
- [ ] Implement CRUD endpoints for preferences:
    - [ ] GET `/api/me/preferences`
    - [ ] PUT `/api/me/preferences`
- [ ] Implement preferences service in backend
- [ ] Update frontend repository to use HTTP instead of localStorage
- [ ] Migrate existing localStorage data to backend (if necessary)

---

### 🟡 Important - Improvements and Robustness

#### 4. Validations and Business Rules

**Backend:**

- [ ] Validate that a user cannot access another user's resources
- [ ] Validate limits on names, descriptions, etc.
- [ ] Validate that transaction dates are valid
- [ ] Validate transaction amounts (not negative, reasonable limits)
- [ ] Implement uniqueness validation for category names per user
- [ ] Implement uniqueness validation for payment method names per user

**Frontend:**

- [ ] Improve specific error messages by failure type
- [ ] Implement form validation before submission
- [ ] Implement visual feedback for loading states

#### 5. Testing

**Backend:**

- [ ] Complete unit tests for services (current coverage unknown)
- [ ] Add repository tests
- [ ] Add controller tests
- [ ] Implement additional integration tests

**Frontend:**

- [ ] Complete tests for all use cases
- [ ] Add repository tests
- [ ] Add UI component tests
- [ ] Improve overall coverage

**E2E:**

- [ ] Add tests for category flows (create, edit, list)
- [ ] Add tests for payment method flows
- [ ] Add tests for transaction flows (create, edit, delete, filter)
- [ ] Add tests for reports
- [ ] Add tests for edge cases (validations, errors)

#### 6. Error Handling

- [ ] Implement centralized logging in backend
- [ ] Implement error monitoring system (e.g., Sentry)
- [ ] Improve network error handling in frontend (retry, timeout)
- [ ] Implement user-friendly error feedback

---

### 🟢 Optional - Future Improvements

#### 7. Performance and Optimization

**Backend:**

- [ ] Implement caching for frequent queries
- [ ] Optimize database queries with appropriate indexes
- [ ] Implement pagination in all endpoints returning lists
- [ ] Implement response compression

**Frontend:**

- [ ] Implement client-side data caching
- [ ] Optimize large list rendering
- [ ] Implement lazy loading for components
- [ ] Implement service workers for offline mode

#### 8. Security

- [ ] Implement rate limiting in backend
- [ ] Implement proper CORS for production
- [ ] Implement input sanitization
- [ ] Implement CSP (Content Security Policy)
- [ ] Implement refresh tokens for JWT
- [ ] Implement 2FA (optional)
- [ ] Add audit logs for important changes

#### 9. DevOps and Deployment

- [ ] Configure CI/CD (GitHub Actions)
- [ ] Create optimized Dockerfile for production
- [ ] Configure environment variables for different environments
- [ ] Implement more robust health checks
- [ ] Configure automatic database backups
- [ ] Deployment documentation

#### 10. Documentation

- [ ] Document API with Swagger/OpenAPI
- [ ] Create detailed README with setup instructions
- [ ] Document project architecture
- [ ] Create contribution guide
- [ ] Document important design decisions

#### 11. Additional Features (Future)

- [ ] Export data (CSV, PDF)
- [ ] Import transactions from files
- [ ] Share reports
- [ ] Multi-currency support
- [ ] Budgets and goals
- [ ] Notifications/alerts
- [ ] Advanced charts and visualizations
- [ ] Tags/labels for transactions
- [ ] Advanced search and filters

---

## 📝 Important Notes

### Current Architecture

**Backend:**

- NestJS with modular architecture
- TypeORM for database management
- PostgreSQL as database
- JWT for authentication (httpOnly cookies)
- Guards for route protection

**Frontend:**

- Hexagonal architecture (Clean Architecture)
- React for UI
- Axios for HTTP communication
- localStorage for preferences (temporary)
- Wouter for routing

**Shared:**

- `@gualet/shared` package with shared DTOs, types, and models
- Avoids code duplication between frontend and backend

### Design Decisions

1. **JWT in httpOnly cookies:** Better security against XSS
2. **Soft-delete vs Hard-delete:** Consider impact on associated transactions
3. **Preferences in localStorage:** Temporary, should migrate to backend
4. **Automatic creation of default data:** Improves initial UX

### Recommended Next Steps

1. **Completely remove Supabase** from the project
2. **Implement SavePaymentMethodUseCase** (high priority, basic functionality)
3. **Migrate User Preferences to backend** (important for multi-device
   synchronization)
4. **Complete e2e test suite** for all main flows
5. **Implement pending business validations**
6. **Improve documentation** to facilitate maintenance

---

## 🎯 Definition of "Done"

The refactor will be **completely finished** when:

- ✅ No Supabase references exist in the code
- ✅ All basic use cases are implemented and tested
- ✅ User preferences synchronize with the backend
- ✅ E2E tests cover main flows (auth, transactions, categories, payment methods)
- ✅ Basic documentation is complete
- ✅ The system is deployable to production

---

*Last updated: October 17, 2025*
