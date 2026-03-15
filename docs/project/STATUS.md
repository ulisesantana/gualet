# Gualet - Project Status and Roadmap

**Date:** March 15, 2026  
**Application:** Personal finance management  
**Status:** 🟡 **Development Phase - Not Production Ready**

---

## 📋 Executive Summary

Gualet is a personal finance web application that has **successfully migrated from Supabase to its own backend** with NestJS and PostgreSQL. The backend is **100% complete** with all CRUD functionalities implemented, the frontend is **fully integrated with the new backend**, and a **complete Demo Account System** allows users to try the application without registration.

**Current Phase:** Pre-Production Preparation  
**Latest Achievement:** 🧪 **Frontend test coverage at 98.15% — exceeds 95% target** (399 tests, 70 files, all passing)  
**Next Milestone:** GDPR Compliance & Production Deployment Setup  
**After That:** Offline-First Implementation with RxDB

⚠️ **Production Readiness:** The application is **NOT ready for production deployment** - critical GDPR requirements, security configurations, and deployment infrastructure are missing.

**Features:**
- 🎭 **Demo Account:** Fully functional in-memory demo with auto-reset every 30 minutes (backend + frontend integrated)
- 🏭 **Factory Pattern:** Repository factories for database/demo mode switching
- 🔒 **100% DB Isolation:** Demo data NEVER touches database (E2E verified)
- 🎨 **AuthContext:** Reactive authentication state management
- 🧪 **Frontend Tests:** 98.15% statement coverage / 91.85% branch coverage — exceeds 95% target ⭐

---

## 🎯 Current Project Status

### ✅ Backend (NestJS + PostgreSQL) - 100% Complete

#### Infrastructure
- ✅ **Framework:** NestJS configured and running
- ✅ **Database:** PostgreSQL with TypeORM
- ✅ **Migrations:** Migration system configured (InitSchema migration created)
- ✅ **Seeding:** Automatic test data system
  - Test user: `test@gualet.app` / `test1234`
  - Default categories (income and expenses)
  - Default payment methods
- ✅ **Docker:** docker-compose for development
- ✅ **Testing:** Jest configured with **99.6% coverage** (69 unit tests passing)
- ✅ **Documentation:** Swagger/OpenAPI

#### 🎭 Demo Account System ✅ (Complete - Feb 14, 2026 backend / Mar 2, 2026 frontend)
- ✅ **Demo Login Endpoint:** `GET /api/auth/login/demo`
  - No credentials required
  - Returns JWT with `isDemo: true` flag
  - User ID: `demo-user-id` (not valid UUID - prevents DB ops)
  - Token expires in 24 hours
- ✅ **DemoService:** Centralized in-memory data store
  - 8 categories (4 INCOME, 4 OUTCOME)
  - 4 payment methods
  - 15 transactions (last 90 days)
  - **Auto-reset every 30 minutes**
- ✅ **Repository Factory Pattern:**
  - CategoriesRepositoryFactory
  - PaymentMethodsRepositoryFactory
  - TransactionsRepositoryFactory
  - UserPreferencesRepositoryFactory
- ✅ **Demo Repositories:** (All in-memory, zero DB impact)
  - DemoCategoriesRepository
  - DemoPaymentMethodsRepository
  - DemoTransactionsRepository
  - DemoUserPreferencesRepository
- ✅ **Database Isolation:** E2E tests verify 0 DB changes
- ✅ **Registration Control:** Enable/disable via `ENABLE_REGISTRATION` env var

#### Authentication ✅
- ✅ POST `/api/auth/register` - User registration
- ✅ POST `/api/auth/login` - Login with HttpOnly cookies
- ✅ **GET `/api/auth/login/demo`** - **Demo login (NEW)**
- ✅ POST `/api/auth/logout` - Logout
- ✅ POST `/api/auth/verify` - Session verification
- ✅ JWT Guards implemented
- ✅ Complete unit tests
- ✅ Improved error handling and messages

#### Categories ✅
- ✅ GET `/api/me/categories` - List user's categories
- ✅ GET `/api/me/categories/:id` - Get specific category
- ✅ POST `/api/me/categories` - Create category
- ✅ PATCH `/api/me/categories/:id` - Update category
- ✅ DELETE `/api/me/categories/:id` - Delete category (with conflict detection)
- ✅ Authorization validations (owner user)
- ✅ Duplicate category name validation
- ✅ Complete unit tests

#### Payment Methods ✅
- ✅ GET `/api/me/payment-methods` - List all payment methods
- ✅ GET `/api/me/payment-methods/:id` - Get specific method
- ✅ POST `/api/me/payment-methods` - Create method
  - **Enhanced:** Now requires UUID `id` field in request body
  - **Frontend generates UUID** before sending to backend
  - Ensures consistency between client and server state
- ✅ PATCH `/api/me/payment-methods/:id` - Update method
- ✅ DELETE `/api/me/payment-methods/:id` - Delete method
  - Returns **status 200** with success response (instead of 204)
  - Conflict detection for transactions in use
- ✅ Authorization validations
- ✅ Complete unit tests (all 190 tests passing)
- ✅ **Repository improvements:**
  - Changed from `findOneBy()` to `find()` with `take: 1` and relations
  - Enhanced error handling in queries
  - Better null/undefined handling

#### Transactions ✅
- ✅ GET `/api/me/transactions` - List transactions (with advanced filters and pagination)
  - **Filters:** date range (`from`, `to`), `categoryId`, `paymentMethodId`, `operation` type
  - **Pagination:** `page`, `pageSize` (supports `pageSize=0` for all results)
  - **Sorting:** `sort` (asc/desc by date)
- ✅ GET `/api/me/transactions/:id` - Get specific transaction
- ✅ POST `/api/me/transactions` - Create transaction (with UUID validation for IDs)
- ✅ PATCH `/api/me/transactions/:id` - Update transaction
- ✅ DELETE `/api/me/transactions/:id` - Delete transaction
- ✅ Complete unit tests

#### User Preferences ✅
- ✅ Module implemented
- ✅ Controller and Service created
- ✅ Endpoints implemented:
  - ✅ GET `/api/me/preferences` - Get preferences (returns null if no payment methods)
  - ✅ PUT `/api/me/preferences` - Save preferences
- ✅ Frontend uses backend (HttpDataSource)
- ✅ Unit tests

#### TypeORM Entities ✅
```typescript
- UserEntity
- CategoryEntity (name, type, icon, color)
- PaymentMethodEntity (name, icon, color)
- TransactionEntity (amount, date, description, operation)
- UserPreferencesEntity
```

---

### ✅ Frontend (React + Vite) - 100% Complete

#### Infrastructure
- ✅ **Framework:** React 18 + Vite + TypeScript
- ✅ **Architecture:** Clean Architecture (Application/Domain/Infrastructure)
- ✅ **Structure:** Feature-based directory structure (`features/auth`, `features/transactions`, etc.)
- ✅ **UI Library:** Chakra UI 3.x integrated
- ✅ **Routing:** Wouter
- ✅ **HTTP Client:** Axios with HttpDataSource abstraction
- ✅ **State Management:** Zustand stores for categories, payment methods, and transactions
- ✅ **i18n:** i18next with English and Spanish support
- ✅ **PWA:** vite-plugin-pwa configured (but no real offline-first)
- ✅ **Proxy:** Configured for `/api` → `http://localhost:5050`
- ✅ **Testing:** Vitest + Testing Library
  - `LastTransactionsView` and `TransactionDetailsView` tests updated to properly mock Zustand store (Mar 2, 2026)
  - Enhanced coverage with comprehensive tests for stores, components, forms, views and repositories (Mar 3, 2026)
  - **Coverage:** Statements: **98.15%**, Branches: **91.85%**, Functions: **98.53%**, Lines: **98.15%** ⭐
  - **399 tests passing across 70 test files (100%)** — exceeds the 95% target
  - New test files: `AuthContext`, `Card`, `Layout`, `submit-handler`
  - Repository null-coalescing and error-path branches fully covered
- ❌ **NO RxDB** implemented yet
- ❌ **NO Service Worker** with custom cache strategies
- ❌ **NO offline synchronization**

#### Implemented Repositories
All repositories are fully integrated with the **NestJS backend**:

```typescript
✅ UserRepository - /api/auth/*
  - login(), logout(), register(), verify(), isLoggedIn()

✅ CategoryRepository - /api/me/categories
  - create(), findAll(), findById(), update(), delete()

✅ PaymentMethodRepository - /api/me/payment-methods
  - create(), findAll(), findById(), update(), delete()
  - **Enhanced:** Now generates UUID before creating payment method
  - Improved error handling for repository operations

✅ TransactionRepository - /api/me/transactions
  - create(), find(), findById(), update(), delete()
  - **Enhanced:** Better error handling and response processing

✅ UserPreferencesRepository - /api/me/preferences
  - find(), update()
```

**Important Note:** The frontend **NO longer uses Supabase**. All repositories point to NestJS backend routes.

#### Use Cases (Application Layer) ✅
```typescript
✅ LoginUseCase
✅ LoginDemoUseCase  ← NEW (Mar 2, 2026) - Demo login without credentials
✅ LogoutUseCase
✅ RegisterUseCase
✅ GetAllCategoriesUseCase
✅ GetCategoryUseCase
✅ SaveCategoryUseCase
✅ DeleteCategoryUseCase
✅ GetAllPaymentMethodsUseCase
✅ GetPaymentMethodUseCase
✅ SavePaymentMethodUseCase
✅ DeletePaymentMethodUseCase
✅ GetLastTransactionsUseCase
✅ GetTransactionConfigUseCase
✅ SaveTransactionUseCase
✅ DeleteTransactionUseCase
✅ GetUserPreferencesUseCase
```

#### Implemented Views
```typescript
✅ LoginView - Connected to backend
✅ RegisterView - Connected to backend
✅ LastTransactionsView - Connected to backend
✅ TransactionDetailsView - Full CRUD working
✅ CategoriesView - Connected to backend with delete + enhanced tests
✅ AddCategoryView - Working + enhanced tests
✅ CategoryDetailsView - Full CRUD working + enhanced tests
✅ PaymentMethodsView - Connected to backend with delete + enhanced styling & tests
✅ AddPaymentMethodView - Working + comprehensive tests
✅ PaymentMethodDetailsView - Full CRUD working + comprehensive tests
✅ SettingsView - Working + enhanced layout & tests
✅ ReportView - Working
```

#### UI Components (Enhanced) 🆕
```typescript
✅ CategoryCard - Comprehensive test coverage (118 tests)
✅ PaymentMethodCard - Comprehensive test coverage (151 tests)
✅ CategoryForm - Full test coverage including submit handler (142 tests)
✅ PaymentMethodForm - Enhanced with submit handler tests
```

#### State Management
```typescript
✅ useCategoryStore - Zustand store for categories (285 tests) 🆕
✅ usePaymentMethodStore - Zustand store for payment methods (215 tests) 🆕
```

#### Hooks & Context
```typescript
✅ AuthContext - Reactive authentication state management (login, demo login, logout)
✅ SettingsContext - Context for app settings (86 tests)
✅ useLoader - Loading state management hook (50 tests)
✅ useAuth - Hook to consume AuthContext
```

#### Frontend-Backend Integration Status
- ✅ **Authentication:** Working with HttpOnly cookies
- ✅ **Categories:** Full CRUD working (including delete with conflict detection)
- ✅ **Payment Methods:** Full CRUD working (including delete with conflict detection)
- ✅ **Transactions:** Full CRUD working with filters
- ✅ **User Preferences:** Working
- ⚠️ **Synchronization:** Everything depends on online connection

---

### ✅ E2E Tests (Playwright) - 100% Complete (Active Tests) 🎉

#### Infrastructure
- ✅ Playwright configured
- ✅ **Test timeout:** 10 minutes (increased from 3 min for stability - Mar 2, 2026)
- ✅ Docker Compose for test database
- ✅ DatabaseManager with complete helpers
- ✅ Page Objects created (LoginPage, RegisterPage, CategoriesPage, TransactionsPage, PaymentMethodsPage)
- ✅ Authentication helpers
- ✅ Automatic data cleanup between tests
- ✅ Helper scripts for running tests

#### Test Results (24/24 active tests passing - 100%) 🎉
**Last run:** December 27, 2025  
**Note:** 21 tests are intentionally skipped (payment-methods and network-errors suites pending frontend implementation)

```
✅ login.spec.ts - 5/5 tests passing (100%)
  ✅ Redirect to login if not authenticated
  ✅ Don't show settings if not authenticated
  ✅ Successful login
  ✅ User not found error handling
  ✅ Invalid credentials error handling

✅ register.spec.ts - 2/2 tests passing (100%)
  ✅ Successful registration
  ✅ Error handling (user already exists)

✅ categories.spec.ts - 9/9 tests passing (100%)
  ✅ Create expense category
  ✅ Create income category
  ✅ Edit existing category
  ✅ Delete category
  ✅ Display multiple categories grouped by type
  ✅ Complete CRUD cycle
  ✅ Show error for empty name
  ✅ Show error for duplicate category name
  ✅ Allow categories with same name but different types

✅ transactions.spec.ts - 8/8 active tests passing (100%)
  ✅ Create new expense transaction
  ✅ Create new income transaction
  ✅ Edit existing transaction
  ✅ Display multiple transactions
  ✅ Create transaction with specific date
  ✅ Prevent creating transaction with empty description
  ✅ Prevent creating transaction with zero amount
  ✅ Prevent creating transaction without category
  ⏭️ 2 tests skipped individually (delete transaction, set last transaction date)

🆕 report.spec.ts - New comprehensive test suite added
  📝 Tests for transaction filtering and reporting
  📝 Report page functionality validation
  📝 407 lines of comprehensive E2E scenarios

⏸️ payment-methods.spec.ts - 0/10 tests (Entire suite skipped)
  📝 Pending frontend implementation validation
  📝 Note: Updated to use new UUID ID field requirement

⏸️ network-errors.spec.ts - 0/9 tests (Entire suite skipped)
  📝 Pending frontend error handling validation
```

#### Summary
- **Total tests defined:** 45+ tests (new report tests added)
- **Active tests:** 24 tests (21 intentionally skipped)
- **Passing:** 24/24 active tests **(100%)** 🎉
- **Fully working suites:** Login ✅, Register ✅, Categories ✅, Transactions ✅
- **New suites:** Report (comprehensive suite added)

#### E2E Documentation
- ✅ `packages/e2e/README.md` - Complete guide with helper scripts
- ✅ `packages/e2e/IMPLEMENTATION_STATUS.md` - Detailed status
- ✅ New `ReportPage` class for report testing

---

## 📦 Monorepo Packages

```
gualet/
├── packages/
│   ├── backend/          # NestJS + PostgreSQL + TypeORM
│   ├── frontend/         # React + Vite + TypeScript
│   ├── e2e/             # Playwright tests
│   └── shared/          # Shared types and utilities
```

---

## ❌ What's Missing

### 🔴 **CRITICAL - Production Blockers** ⚠️

The following items **MUST** be implemented before any production deployment:

#### 1. **GDPR Compliance (0% Complete)** 🚨
Despite having comprehensive documentation, **NO GDPR functionality is implemented**:

**Legal Requirements (EU Mandatory):**
- [ ] **Privacy Policy page** - Does not exist
- [ ] **Terms of Service page** - Does not exist  
- [ ] **Cookie Consent banner** - Not implemented
- [ ] **Consent tracking in database** - Columns don't exist (`privacyPolicyConsentDate`, `marketingConsent`)
- [ ] **Consent checkbox on registration** - Not in form

**User Rights (Articles 15-22):**
- [ ] **Data Export** - `GET /api/me/data-export` endpoint does not exist
- [ ] **Account Deletion** - `DELETE /api/me/account` endpoint does not exist
- [ ] **Data Portability** - No JSON export functionality
- [ ] **Right to Rectification** - Partially covered by PATCH endpoints

**Security Measures (Article 32):**
- [ ] **Security Headers** - Helmet not configured
- [ ] **Rate Limiting** - Not implemented (DDoS vulnerability)
- [ ] **CORS for Production** - Still using permissive settings
- [ ] **HTTPS Enforcement** - Not configured
- [ ] **Access Logging** - No audit trail
- [ ] **Data Encryption at Rest** - PostgreSQL TDE not enabled

**Penalties:** Up to €20 million or 4% of global revenue for non-compliance.

**Priority:** 🔴 **CRITICAL** - Must complete before EU deployment  
**Estimated Time:** 2-3 weeks  
**See:** [GDPR_CHECKLIST.md](../compliance/GDPR_CHECKLIST.md)

#### 2. **CI/CD Pipeline (Not in Use)** ⏸️
GitHub Actions workflows have been **removed** — CI/CD is not being used at this time.

**To set up in the future:**
- [ ] **Automated Tests** - Run on PRs (backend, frontend, e2e)
- [ ] **Type Checking** - Enforce in CI
- [ ] **Linting** - Automated checks
- [ ] **Build Verification** - Docker build pipeline
- [ ] **Deployment Automation** - Configured for production

**Priority:** ⏸️ **Deferred** — will be created when deployment is planned  
**Estimated Time:** 1 week (when needed)

#### 3. **Production Deployment (Not Configured)** 🚨

**No deployment setup exists:**
- [ ] **Production Environment Variables** - `.env.production` doesn't exist
- [ ] **Hosting Provider** - Not selected (Hetzner/OVH/AWS?)
- [ ] **Docker Compose for Production** - Only development setup exists
- [ ] **Nginx/Reverse Proxy** - Not configured
- [ ] **SSL/HTTPS Certificates** - Not set up (Let's Encrypt?)
- [ ] **Domain Configuration** - Not documented
- [ ] **Production Database** - Not provisioned
- [ ] **Database Backups** - No automation
- [ ] **Monitoring/Alerts** - No system in place
- [ ] **Health Checks** - Basic endpoint exists but not monitored

**Current State:**  
```dockerfile
# Dockerfile exists but:
- No production optimizations
- No multi-stage builds for smaller images
- Exposes port 5050 (not standard 80/443)
- No health check defined
```

**Priority:** 🔴 **CRITICAL**  
**Estimated Time:** 2 weeks  

#### 4. **Security Hardening (Incomplete)** 🚨

**Critical Security Gaps:**

```typescript
// packages/backend/src/main.ts - MISSING:
- helmet() for security headers
- rate limiting middleware
- CORS restricted to production domain
- Request body size limits
- File upload restrictions (if added later)
```

**Vulnerabilities:**
- ⚠️ **No Rate Limiting** - Vulnerable to brute force attacks
- ⚠️ **Permissive CORS** - Currently allows all origins in dev
- ⚠️ **No HSTS Headers** - Browsers can use HTTP
- ⚠️ **No CSP Headers** - XSS attacks possible
- ⚠️ **No Request Size Limits** - DoS vulnerability
- ⚠️ **JWT Secret in .env** - Should use secrets manager in production
- ⚠️ **Database Connection String** - Plain text in config

**Priority:** 🔴 **CRITICAL**  
**Estimated Time:** 1 week

---

### 🟡 **High Priority - Before Launch**

#### 5. **E2E Test Coverage Incomplete**
```typescript
// 21 tests intentionally skipped:
- payment-methods.spec.ts: 10 tests (entire suite)
- network-errors.spec.ts: 9 tests (entire suite)  
- transactions.spec.ts: 2 individual tests
```

**Current:** 24/45 tests running (53%)  
**Target:** 45/45 tests running (100%)

**Priority:** 🟡 **High**  
**Estimated Time:** 1 week

#### 6. **Frontend Test Coverage Low (72%)**
Backend has 99.62% coverage, frontend only 72.02%:

```
Coverage Summary:
- Statements: 72.02% (Target: >95%)
- Branches: 90.63% (Target: >95%)
- Functions: 76.87% (Target: >95%)
- Lines: 72.02% (Target: >95%)
```

**Missing Coverage:**
- [ ] Repository implementations (data-sources)
- [ ] Error boundary components
- [ ] Edge cases in forms
- [ ] Loading states
- [ ] Network error scenarios

**Priority:** 🟡 **High**  
**Estimated Time:** 1-2 weeks

#### 7. **Storybook Configured But Empty**
```typescript
// .storybook/main.ts exists
stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"]

// But: 0 story files found
```

**Missing Stories:**
- [ ] CategoryCard.stories.tsx
- [ ] PaymentMethodCard.stories.tsx
- [ ] TransactionCard.stories.tsx
- [ ] Form components (CategoryForm, PaymentMethodForm, TransactionForm)
- [ ] Button variants
- [ ] Input components
- [ ] Loading spinners
- [ ] Error messages

**Benefits:**
- Visual component testing
- Design system documentation
- Component isolation
- Faster UI development

**Priority:** 🟡 **High** (Developer Experience)  
**Estimated Time:** 1 week

#### 8. **Monitoring and Logging**
**No observability infrastructure:**

- [ ] **Centralized Logging** - No Winston/Pino configuration
- [ ] **Error Tracking** - No Sentry/Rollbar integration
- [ ] **Performance Monitoring** - No APM (Application Performance Monitoring)
- [ ] **Metrics** - No Prometheus/Grafana
- [ ] **Uptime Monitoring** - No UptimeRobot/Pingdom
- [ ] **Alert System** - No PagerDuty/email alerts
- [ ] **Log Rotation** - Not configured
- [ ] **Audit Logs** - Not tracking user actions

**Priority:** 🟡 **High** (Production Operations)  
**Estimated Time:** 1 week

---

### 🟢 **Medium Priority - Post-Launch**

#### 9. Offline-First Implementation (RxDB)
See [ADR-0003: Offline-First Sync Strategy](../adr/0003-offline-first-sync-strategy.md) and [ACTION_PLAN.md](./ACTION_PLAN.md)

**RxDB Implementation:**
- [ ] Install and configure RxDB
- [ ] Create RxDB schemas for all entities (User, Category, PaymentMethod, Transaction)
- [ ] Implement RxDB collections
- [ ] Create custom replication plugin for NestJS API
- [ ] Implement conflict resolution (last-write-wins)
- [ ] Update repositories to use RxDB
- [ ] Implement sync status indicators in UI
- [ ] Handle offline scenarios gracefully

**Timeline:** 3-4 weeks (see ACTION_PLAN.md)

### � Secondary Tasks - Improvements

#### 10. Complete E2E Test Suite ✅ COMPLETE
- [x] ~~Adjust login tests~~ - **DONE** (5/5 passing - 100%)
- [x] ~~Adjust register tests~~ - **DONE** (2/2 passing - 100%)
- [x] ~~Fix categories tests~~ - **DONE** (9/9 passing - 100%)
- [x] ~~Validate and adjust transaction tests~~ - **DONE** (8/8 active tests passing - 100%)
- [ ] Review and enable payment methods test suite (10 tests skipped - optional)
- [ ] Review and enable network error test suite (9 tests skipped - optional)

**Current Status:** 24/24 active tests passing **(100%)** 🎉
**Achievement:** All core functionality E2E tested and working!

#### 3. Backend Improvements (Nice to have)
- [x] ~~DELETE `/api/me/categories/:id`~~ - **DONE** (with conflict detection)
- [x] ~~DELETE `/api/me/payment-methods/:id`~~ - **DONE** (with conflict detection)
- [x] ~~Implement UUID validation for transaction DTOs~~ - **DONE**
- [x] ~~Improve error response handling~~ - **DONE**
- [ ] Implement rate limiting
- [ ] Implement centralized logging service
- [ ] Add more comprehensive business validations:
  - [x] ~~Validate that user doesn't access another user's resources~~ - **DONE**
  - [x] ~~Uniqueness of category names per user~~ - **DONE**
  - [ ] Uniqueness of payment method names per user
  - [ ] Transaction amount limits validation
  - [ ] More detailed field length limits

#### 4. Frontend Improvements (Nice to have)
- [x] ~~Implement DELETE operations in repositories~~ - **DONE**
- [x] ~~Implement DELETE UI for categories~~ - **DONE**
- [x] ~~Implement DELETE UI for payment methods~~ - **DONE**
- [ ] Add visual feedback after edits (toasts/notifications)
- [ ] Improve error handling in UI with specific messages
- [ ] Add consistent loading states across all views
- [ ] Implement optimistic UI updates
- [ ] Add confirmation dialogs for destructive actions

#### 5. Unit Tests
**Backend:** ✅ **EXCELLENT** (99.62% coverage)
- ✅ 190 tests passing
- ✅ 22 test suites
- ✅ Coverage: Statements 99.62%, Functions 97.97%, Lines 99.6%, Branches 92.99%

**Frontend:** ✅ **EXCELLENT** (100% passing)
- ✅ 183 tests passing
- ✅ 47 test suites
- ✅ All TypeScript compilation errors resolved

#### 6. Security and Performance
**Security:**
- [ ] Implement rate limiting in backend
- [ ] Implement appropriate CORS for production
- [ ] Implement input sanitization
- [ ] Implement CSP (Content Security Policy)
- [ ] Implement refresh tokens for JWT
- [ ] Add audit logs for important changes

**Performance:**
- [ ] Implement cache for frequent queries (backend)
- [ ] Optimize database queries with appropriate indexes
- [ ] Implement response compression
- [ ] Optimize rendering of large transaction lists
- [ ] Implement lazy loading of components

#### 7. DevOps and Deployment
- [ ] Configure CI/CD (GitHub Actions)
- [ ] Create optimized Dockerfile for production
- [ ] Configure environment variables for different environments
- [ ] Implement more robust health checks
- [ ] Configure automatic database backups
- [ ] Create deployment documentation

#### 8. Documentation
- [x] ~~Document API with Swagger/OpenAPI~~ - **DONE** (partially)
- [x] ~~Create detailed README with setup instructions~~ - **DONE**
- [x] ~~Document project architecture~~ - **DONE** (ADRs created)
- [ ] Create contribution guide
- [ ] Document all design decisions

#### 9. Additional Features (Future)
- [ ] Export data (CSV, PDF)
- [ ] Import transactions from files
- [ ] Share reports
- [ ] Multi-currency support
- [ ] Budgets and goals
- [ ] Notifications/alerts
- [ ] Advanced charts and visualizations
- [ ] Tags for transactions
- [ ] Advanced search and filters
- [ ] Forgot password / Reset password

---

## 🎯 Main Objectives (Updated February 2026)

### Objective 0: Pre-Production Readiness 🚨 **IN PROGRESS** (0% Done)
**Status:** 🔴 **Critical - Must complete before any production deployment**

**Why This is Now Priority #1:**
The original plan was to implement offline-first next, but a comprehensive audit revealed that the application has **critical production blockers** that must be addressed first. Deploying without these would violate GDPR regulations and create security vulnerabilities.

**Sub-Objectives:**

#### 0.1 GDPR Compliance Implementation (2-3 weeks)
**Priority:** 🔴 **CRITICAL** - Legal requirement for EU deployment

**Tasks:**
1. **Week 1: Legal Documents & User Rights**
   - [ ] Create Privacy Policy page (`/privacy-policy`)
   - [ ] Create Terms of Service page (`/terms`)
   - [ ] Implement cookie consent banner
   - [ ] Add consent checkbox to registration form
   - [ ] Create database migration for consent tracking
   - [ ] Implement `GET /api/me/data-export` endpoint
   - [ ] Implement `DELETE /api/me/account` endpoint

2. **Week 2: Security Hardening**
   - [ ] Configure Helmet for security headers (HSTS, CSP, etc.)
   - [ ] Implement rate limiting (express-rate-limit)
   - [ ] Configure production CORS (whitelist specific domain)
   - [ ] Add access logging middleware
   - [ ] Implement request body size limits
   - [ ] Review and fix all security headers

3. **Week 3: Testing & Documentation**
   - [ ] Test account deletion (cascade deletes all user data)
   - [ ] Test data export (complete user data in JSON)
   - [ ] Update GDPR documentation with implementation details
   - [ ] Security audit checklist
   - [ ] Create GDPR compliance verification script

**Deliverables:**
- ✅ Full GDPR compliance
- ✅ Privacy Policy and Terms of Service live
- ✅ User can export all their data
- ✅ User can delete their account
- ✅ Security headers configured
- ✅ Rate limiting active

**Success Criteria:**
- All GDPR_CHECKLIST.md items checked
- Legal review passed (if required)
- Security scan shows no critical vulnerabilities

#### 0.2 CI/CD Pipeline Setup (1 week, when needed)
**Priority:** ⏸️ **Deferred** — GitHub Actions workflows removed, not in use at this time

**Tasks (future):**
1. **Day 1-2: GitHub Actions Workflows**
   - [ ] Create `.github/workflows/ci.yml` - Run on all PRs
   - [ ] Add backend tests job
   - [ ] Add frontend tests job
   - [ ] Add type checking job
   - [ ] Add linting job

2. **Day 3-4: E2E Tests in CI**
   - [ ] Create `.github/workflows/e2e.yml`
   - [ ] Set up Docker containers for test database
   - [ ] Configure Playwright in CI environment
   - [ ] Add E2E test job with proper setup/teardown

3. **Day 5: Deployment Automation**
   - [ ] Configure deployment workflow for NestJS + React
   - [ ] Configure production environment secrets
   - [ ] Add Docker build and push steps
   - [ ] Document deployment process

**Deliverables:**
- ✅ Automated tests on every PR
- ✅ Type checking enforced
- ✅ E2E tests running in CI
- ✅ Deployment pipeline documented

#### 0.3 Production Deployment Configuration (2 weeks)
**Priority:** 🔴 **CRITICAL** - Infrastructure for going live

**Tasks:**
1. **Week 1: Infrastructure Setup**
   - [ ] Select hosting provider (Hetzner/OVH/DigitalOcean EU region)
   - [ ] Provision production database (PostgreSQL in EU)
   - [ ] Set up domain and DNS
   - [ ] Configure SSL/TLS certificates (Let's Encrypt)
   - [ ] Create production environment variables
   - [ ] Set up Nginx reverse proxy configuration

2. **Week 2: Deployment & Monitoring**
   - [ ] Create Docker Compose for production
   - [ ] Implement database backup automation
   - [ ] Configure health check monitoring
   - [ ] Set up basic error tracking (Sentry or similar)
   - [ ] Create deployment runbook
   - [ ] Test complete deployment process on staging

**Deliverables:**
- ✅ Production environment provisioned
- ✅ HTTPS configured
- ✅ Automated backups running
- ✅ Monitoring in place
- ✅ Deployment documentation complete

**Success Criteria:**
- Application accessible via HTTPS
- Database backups automated (daily)
- Health checks reporting correctly
- Rollback procedure documented and tested

#### 0.4 Quality Assurance Improvements (1-2 weeks)
**Priority:** 🟡 **High** - Code quality and coverage

**Tasks:**
1. **Week 1: Test Coverage**
   - [ ] Enable payment-methods E2E suite (10 tests)
   - [ ] Enable network-errors E2E suite (9 tests)
   - [ ] Fix 2 skipped transaction tests
   - [ ] Add missing frontend tests to reach >90% coverage
   - [ ] Add integration tests for critical paths

2. **Week 2: Developer Experience** (Optional)
   - [ ] Create Storybook stories for main components
   - [ ] Improve pre-commit hooks
   - [ ] Add commit message linting
   - [ ] Create contributor guide

**Deliverables:**
- ✅ E2E tests: 45/45 passing (100%)
- ✅ Frontend coverage: >90%
- ✅ Storybook with component documentation

**Total Estimated Time for Objective 0:** 6-8 weeks

---

### Objective 1: Complete Backend Migration ✅ COMPLETE (Dec 27, 2025)
**Status:** ✅ **100% Complete**

**Completed:**
1. ✅ All CRUD endpoints implemented for all resources
2. ✅ DELETE for categories and payment methods with conflict detection
3. ✅ Complete frontend-backend integration
4. ✅ UUID validation for transaction DTOs
5. ✅ Improved error response handling
6. ✅ Complete API documentation in Swagger
7. ✅ Backend tests: **99.62% coverage** (190 tests passing)
8. ✅ Frontend tests: **100% passing** (183 tests passing)

**Remaining:**
- 🟡 E2E tests: 23% passing (10/44) - Frontend UI fixes needed

---

### Objective 2: Implement Offline-First with RxDB 🎯 NEXT (0% Done)

**Status:** Not started - Decision made: Using RxDB (see [ADR-0003](../adr/0003-offline-first-sync-strategy.md))

**Decision:** After thorough analysis, we have chosen **RxDB** over custom IndexedDB implementation:
- ✅ Works with existing NestJS + PostgreSQL backend
- ✅ TypeScript first-class support
- ✅ Reactive queries (RxJS Observables) perfect for React
- ✅ JSON Schema validation
- ✅ Custom replication with REST API
- ✅ 3-4 week implementation timeline (vs 6-7 weeks custom)
- ✅ ~70KB bundle size (acceptable)

**See:** [ACTION_PLAN.md](./ACTION_PLAN.md) for detailed implementation plan

This is the **main objective** you want to achieve. It requires:

#### 2.1 Offline-First Architecture

**Concept:**
- Data is saved first in IndexedDB (local)
- The app works completely without connection
- When there's connection, sync with backend
- Conflicts are resolved with "last write wins" strategy or timestamps

**Required Components:**

##### Frontend
1. **IndexedDB Storage Layer**
   ```typescript
   packages/frontend/src/infrastructure/data-sources/indexeddb/
   ├── IndexedDBDataSource.ts        # IndexedDB wrapper
   ├── schemas.ts                     # Table schemas
   └── migrations.ts                  # Schema migrations
   ```

2. **Sync Manager**
   ```typescript
   packages/frontend/src/infrastructure/sync/
   ├── SyncManager.ts                 # Synchronization orchestrator
   ├── SyncQueue.ts                   # Pending operations queue
   ├── ConflictResolver.ts            # Conflict resolution
   └── NetworkDetector.ts             # Connectivity detector
   ```

3. **Updated Repository Pattern**
   ```typescript
   // Each repository must:
   - Write to IndexedDB first
   - Add operation to SyncQueue
   - Read from IndexedDB (fast)
   - Sync in background
   ```

4. **Improved Service Worker**
   ```typescript
   packages/frontend/public/sw.js
   - Cache static assets (HTML, CSS, JS)
   - Cache API responses
   - Strategy: Network First, falling back to cache
   - Background sync for pending operations
   ```

##### Backend
1. **Sync Endpoints**
   ```typescript
   POST /api/sync/push      # Client sends changes
   GET  /api/sync/pull      # Client gets changes
   POST /api/sync/resolve   # Resolve conflicts
   ```

2. **Timestamp Management**
   - Add `updatedAt` to all entities
   - Add `syncedAt` for tracking
   - Add `version` for conflict detection

3. **Change Log (Optional but recommended)**
   ```typescript
   ChangeLogEntity {
     id: string
     userId: string
     entityType: 'transaction' | 'category' | 'payment-method'
     entityId: string
     operation: 'create' | 'update' | 'delete'
     timestamp: Date
     payload: JSON
   }
   ```

#### 2.2 Detailed Implementation Plan

##### Phase 1: Backend Preparation (1 week)
```bash
# 1. Add timestamps to existing entities
packages/backend/src/db/entities/
├── base.entity.ts              # Create base entity with timestamps
├── category.entity.ts          # Extend from base
├── payment-method.entity.ts    # Extend from base
└── transaction.entity.ts       # Extend from base

# 2. Create migration to add timestamps
npm run migration:generate -w packages/backend

# 3. Implement synchronization endpoints
packages/backend/src/sync/
├── sync.module.ts
├── sync.controller.ts
├── sync.service.ts
├── dto/
│   ├── push-changes.dto.ts
│   ├── pull-changes.dto.ts
│   └── sync-response.dto.ts
└── sync.service.spec.ts
```

**Tasks:**
- [ ] Create `BaseEntity` with `createdAt`, `updatedAt`, `version`
- [ ] Migrate all entities to extend `BaseEntity`
- [ ] Generate and run timestamp migration
- [ ] Implement `SyncController` with push/pull endpoints
- [ ] Implement `SyncService` with merge logic
- [ ] Unit tests for synchronization
- [ ] Document endpoints in Swagger

##### Phase 2: IndexedDB in Frontend (1 week)
```bash
# 1. Install dependencies
npm install idb -w packages/frontend

# 2. Implementar capa de IndexedDB
packages/frontend/src/infrastructure/data-sources/indexeddb/
├── IndexedDBDataSource.ts
├── schemas.ts
├── db-config.ts
└── migrations.ts

# 3. Define schemas
- users (cache de sesión)
- categories
- payment-methods
- transactions
- sync-queue (operaciones pendientes)
```

**IndexedDB Schemas:**
```typescript
// db-config.ts
export const DB_NAME = 'gualet-db';
export const DB_VERSION = 1;

export const STORES = {
  CATEGORIES: 'categories',
  PAYMENT_METHODS: 'payment-methods',
  TRANSACTIONS: 'transactions',
  SYNC_QUEUE: 'sync-queue',
  USER_PREFERENCES: 'user-preferences',
};

// Schema example
categories: {
  id: string (primary key)
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  createdAt: timestamp
  updatedAt: timestamp
  syncedAt: timestamp (last synchronization)
  deleted: boolean (soft delete)
}

sync-queue: {
  id: string (primary key)
  entityType: string
  entityId: string
  operation: 'create' | 'update' | 'delete'
  payload: JSON
  createdAt: timestamp
  retryCount: number
  status: 'pending' | 'syncing' | 'error'
}
```

**Tasks:**
- [ ] Install library `idb` (IndexedDB wrapper)
- [ ] Create `IndexedDBDataSource` with CRUD operations
- [ ] Define schemas and create stores
- [ ] Implement migration system for IndexedDB
- [ ] Unit tests for IndexedDBDataSource

##### Phase 3: Sync Manager (1 week)
```bash
packages/frontend/src/infrastructure/sync/
├── SyncManager.ts              # Main orchestrator
├── SyncQueue.ts                # Queue management
├── NetworkDetector.ts          # Online/Offline events
├── ConflictResolver.ts         # Resolution strategies
└── sync-manager.test.ts
```

**SyncManager Features:**
```typescript
class SyncManager {
  // Detect connectivity change
  async onOnline(): Promise<void>
  
  // Synchronize everything
  async syncAll(): Promise<SyncResult>
  
  // Synchronize specific entity
  async syncEntity(type: EntityType): Promise<SyncResult>
  
  // Push: send local changes to server
  async pushChanges(): Promise<void>
  
  // Pull: get changes from server
  async pullChanges(since: Date): Promise<void>
  
  // Resolve conflicts
  async resolveConflicts(): Promise<void>
}
```

**Synchronization Strategies:**
1. **Auto-sync:** Every 30 seconds if online
2. **Manual sync:** "Synchronize" button in settings
3. **On reconnect:** When detecting connection after offline
4. **Background sync:** Service Worker tries to sync in background

**Tasks:**
- [ ] Implement `NetworkDetector` with online/offline events
- [ ] Implement `SyncQueue` to queue operations
- [ ] Implement `SyncManager` with push/pull
- [ ] Implement `ConflictResolver` (strategy: last write wins)
- [ ] Add UI indicator for sync status
- [ ] Synchronization tests

##### Phase 4: Update Repositories (1 week)
```bash
# Refactor repositories to use IndexedDB first
packages/frontend/src/infrastructure/repositories/
├── category/category.repository.ts
├── payment-method/payment-method.repository.ts
├── transaction/transaction.repository.ts
└── user-preferences/user-preferences.repository.ts
```

**Offline-First Pattern:**
```typescript
// Example: CategoryRepository
class CategoryRepositoryImplementation implements CategoryRepository {
  constructor(
    private readonly http: HttpDataSource,
    private readonly indexedDB: IndexedDBDataSource,
    private readonly syncQueue: SyncQueue,
  ) {}

  async create(category: Category): Promise<Category> {
    // 1. Save to IndexedDB first (fast)
    const savedCategory = await this.indexedDB.categories.create(category);
    
    // 2. Add to sync queue
    await this.syncQueue.add({
      entityType: 'category',
      entityId: savedCategory.id,
      operation: 'create',
      payload: savedCategory,
    });
    
    // 3. Try to sync if online (background)
    this.syncInBackground();
    
    return savedCategory;
  }

  async findAll(): Promise<Category[]> {
    // ALWAYS read from IndexedDB (fast)
    return this.indexedDB.categories.findAll();
  }

  private async syncInBackground(): Promise<void> {
    if (navigator.onLine) {
      // No await, run in background
      this.syncQueue.processNext().catch(console.error);
    }
  }
}
```

**Tasks:**
- [ ] Refactor `CategoryRepository` with IndexedDB
- [ ] Refactor `PaymentMethodRepository` with IndexedDB
- [ ] Refactor `TransactionRepository` with IndexedDB
- [ ] Refactor `UserPreferencesRepository` with IndexedDB
- [ ] Update repository tests
- [ ] Add offline scenario tests

##### Phase 5: Service Worker & PWA (1 week)
```bash
packages/frontend/public/
├── sw.js                       # Custom service worker
└── manifest.json               # Already exists

packages/frontend/src/
└── register-sw.ts              # SW registration
```

**Cache Strategies:**
```typescript
// sw.js
const CACHE_NAME = 'gualet-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/main.js',
  '/main.css',
  '/icons/gualet.png',
];

// 1. Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll(STATIC_ASSETS)
    )
  );
});

// 2. Fetch: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // API: Network first
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  } else {
    // Static: Cache first
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// 3. Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncDataWithServer());
  }
});
```

**Tasks:**
- [ ] Create custom Service Worker
- [ ] Implement static assets cache
- [ ] Implement Network First strategy for API
- [ ] Implement Background Sync API
- [ ] Register Service Worker in `main.tsx`
- [ ] Update `vite.config.ts` to generate SW
- [ ] Test PWA in offline mode

##### Phase 6: Offline UI/UX (3-5 days)
```bash
packages/frontend/src/infrastructure/ui/
├── components/
│   ├── SyncIndicator/          # Sync status indicator
│   ├── OfflineBanner/          # "No connection" banner
│   └── PendingSyncBadge/       # Pending operations badge
└── hooks/
    ├── useOnlineStatus.ts      # Connectivity hook
    └── useSyncStatus.ts        # Sync status hook
```

**UI Components:**
```typescript
// SyncIndicator
<SyncIndicator 
  status={syncStatus}      // 'synced' | 'syncing' | 'pending' | 'error'
  pendingCount={5}         // Pending operations
  lastSyncAt={timestamp}
/>

// OfflineBanner
<OfflineBanner isOnline={isOnline} />

// Settings: Manual Sync Button
<button onClick={() => syncManager.syncAll()}>
  Synchronize now ({pendingCount} pending)
</button>
```

**Tasks:**
- [ ] Create `useOnlineStatus()` hook
- [ ] Create `useSyncStatus()` hook
- [ ] Implement `SyncIndicator` component
- [ ] Implement `OfflineBanner` component
- [ ] Add manual sync button in Settings
- [ ] Show pending operations badge
- [ ] Add "Last sync: 2 min ago"

##### Phase 7: Testing Offline (1 week)
```bash
packages/e2e/tests/
├── offline/
│   ├── offline-create.spec.ts
│   ├── offline-edit.spec.ts
│   ├── offline-delete.spec.ts
│   ├── sync-on-reconnect.spec.ts
│   └── conflict-resolution.spec.ts
```

**Test Scenarios:**
```typescript
test('should create transaction offline and sync on reconnect', async () => {
  // 1. Go offline
  await context.setOffline(true);
  
  // 2. Create transaction
  await transactionsPage.create(transaction);
  
  // 3. Verify in IndexedDB
  const localTx = await indexedDB.transactions.findById(tx.id);
  expect(localTx).toBeDefined();
  
  // 4. Verify NOT in server
  await context.setOffline(false);
  const serverTx = await api.getTransaction(tx.id);
  expect(serverTx).toBeNull();
  
  // 5. Wait for automatic synchronization
  await page.waitForSelector('[data-sync-status="synced"]');
  
  // 6. Verify now IS in server
  const syncedTx = await api.getTransaction(tx.id);
  expect(syncedTx).toEqual(localTx);
});

test('should resolve conflicts with last write wins', async () => {
  // 1. Create transaction online
  const tx = await api.createTransaction(data);
  
  // 2. Go offline
  await context.setOffline(true);
  
  // 3. Edit locally
  await transactionsPage.edit(tx.id, { amount: 100 });
  
  // 4. Simulate server edit (another device)
  await api.updateTransaction(tx.id, { amount: 200 });
  
  // 5. Reconnect and synchronize
  await context.setOffline(false);
  await page.waitForSelector('[data-sync-status="synced"]');
  
  // 6. Verify last write wins
  const finalTx = await api.getTransaction(tx.id);
  expect(finalTx.amount).toBe(100); // Local is more recent
});
```

**Tasks:**
- [ ] Offline creation tests
- [ ] Offline editing tests
- [ ] Offline deletion tests
- [ ] Synchronization on reconnect tests
- [ ] Conflict resolution tests
- [ ] Multiple pending operations tests
- [ ] Synchronization error tests

#### 2.3 Recommended Libraries

```json
// packages/frontend/package.json
{
  "dependencies": {
    "idb": "^8.0.0",                    // IndexedDB wrapper
    "workbox-window": "^7.0.0",         // Service Worker helpers
    "react-query": "^5.0.0"             // (Optional) Reactive synchronization
  }
}
```

#### 2.4 Estimación Total
- **Phase 1 (Backend):** 1 semana
- **Phase 2 (IndexedDB):** 1 semana
- **Phase 3 (Sync Manager):** 1 semana
- **Phase 4 (Repositories):** 1 semana
- **Phase 5 (Service Worker):** 1 semana
- **Phase 6 (UI/UX):** 3-5 días
- **Phase 7 (Testing):** 1 semana

**Total: 6-7 semanas** (asumiendo trabajo a tiempo completo)

---

## 📊 Priorización de Tareas

### Inmediato (Esta Semana)
1. [ ] Ejecutar todos los tests E2E y documentar fallos
2. [ ] Implementar DELETE endpoints faltantes en backend
3. [ ] Verificar integración completa frontend-backend
4. [ ] Create plan detallado fase por fase para offline-first

### Corto Plazo (2-3 Semanas)
1. [ ] Phase 1: Preparación Backend (timestamps, sync endpoints)
2. [ ] Phase 2: IndexedDB en Frontend
3. [ ] Phase 3: Sync Manager básico

### Medio Plazo (1-2 Meses)
1. [ ] Phase 4: Refactorizar Repositories
2. [ ] Phase 5: Service Worker & PWA
3. [ ] Phase 6: UI/UX Offline
4. [ ] Phase 7: Testing Completo

---

## 🔧 Scripts Útiles

```bash
# Desarrollo
npm run dev                    # Levantar todo (backend + frontend + shared)
npm run dev:backend           # Solo backend
npm run dev:frontend          # Solo frontend

# Base de datos
npm run db:dev:up             # Levantar PostgreSQL (Docker)
npm run db:dev:down           # Bajar PostgreSQL
npm run db:dev:seed           # Seedear datos de prueba
npm run db:dev:clean          # Limpiar base de datos

# Tests
npm run test                  # Todos los tests (backend + frontend)
npm run test:backend          # Tests unitarios backend
npm run test:backend:cov      # Coverage backend
npm run test:frontend         # Tests unitarios frontend
npm run test:frontend:cov     # Coverage frontend
npm run test:e2e              # Tests E2E
npm run test:e2e:ui           # Tests E2E con UI

# Type checking
npm run typecheck             # Todos los paquetes
npm run typecheck:backend
npm run typecheck:frontend
npm run typecheck:e2e

# Build
npm run build                 # Build frontend + backend
```

---

## 📚 Resources and Documentation

### Project
- `README.md` - Introduction and roadmap
- `packages/backend/README.md` - Backend documentation
- `packages/backend/DATABASE_SEEDING.md` - Seeding system
- `packages/frontend/README.md` - Frontend documentation
- `packages/e2e/README.md` - E2E testing guide
- `packages/e2e/IMPLEMENTATION_STATUS.md` - Detailed E2E status

### Technologies
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [React Docs](https://react.dev/)
- [Playwright Docs](https://playwright.dev/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)

### Offline-First Libraries
- [idb](https://github.com/jakearchibald/idb) - IndexedDB wrapper
- [Workbox](https://developer.chrome.com/docs/workbox/) - Service Worker toolkit
- [PouchDB](https://pouchdb.com/) - Complete offline-first alternative
- [RxDB](https://rxdb.info/) - Reactive offline-first database

---

## 🎓 Key Concepts: Offline-First

### What is Offline-First?
- The app works **offline first**
- Data is saved locally (IndexedDB)
- Server synchronization is **asynchronous**
- User doesn't notice if online or offline

### Architecture
```
User Action
    ↓
[IndexedDB] ← Immediate save (fast)
    ↓
[Sync Queue] ← Queue operation
    ↓
[Online?] → No: Wait for reconnection
    ↓ Yes
[HTTP Request] → Backend
    ↓
[Conflict?] → Yes: Resolve (last write wins)
    ↓ No
[Update IndexedDB] ← Mark as synced
```

### Advantages
- ✅ App always works (offline)
- ✅ Instant response (no network wait)
- ✅ Better UX (no loading spinners)
- ✅ Works on slow/unstable networks
- ✅ Multi-device with sync

### Challenges
- ❌ Complexity: Conflict management
- ❌ Storage: IndexedDB limits (~50MB)
- ❌ Testing: Complex offline scenarios
- ❌ Debugging: Distributed state (local + remote)

---

## 🚀 Final Recommendations

### 1. Finish Migration First
Before starting offline-first, ensure that:
- ✅ All backend endpoints work
- ✅ All frontend repositories work
- ✅ E2E tests pass at 100%
- ✅ No critical bugs exist

**Reason:** Offline-first multiplies complexity. You need a solid foundation.

### 2. Implement Offline-First Incrementally
Don't try to do everything at once:
1. **Week 1-2:** Backend (timestamps, sync endpoints)
2. **Week 3-4:** IndexedDB + Basic Sync Manager
3. **Week 5:** Refactor 1 repository (e.g., Transactions)
4. **Week 6:** Test and debug that repository
5. **Week 7+:** Repeat for other repositories

### 3. Consider Alternatives
If time is limited, consider using existing libraries:
- **PouchDB + CouchDB:** Automatic bidirectional synchronization
- **RxDB:** Reactive database with sync plugins
- **WatermelonDB:** Optimized for React

**Advantages:**
- ✅ Much less code to write
- ✅ Problems already solved (conflicts, sync, etc.)
- ✅ Community maintenance

**Disadvantages:**
- ❌ Less control over synchronization
- ❌ Library learning curve
- ❌ External dependency

### 4. Testing is Critical
Offline-first is **difficult to test**. Invest time in:
- Unit tests for Sync Manager
- E2E tests for offline scenarios
- Conflict resolution tests
- Performance tests (IndexedDB can be slow with lots of data)

### 5. Monitoring and Debugging
Implement from the start:
- Detailed synchronization logs
- Metrics: pending operations, errors, sync time
- UI for debugging (e.g., `/debug` page with sync status)

---

## 📞 Suggested Next Steps

1. **Review this document** and ask questions
2. **Decide approach:** 
   - Implement custom offline-first? (6-7 weeks)
   - Use existing library? (2-3 weeks)
3. **Complete backend-frontend migration** (1 week)
4. **Start Phase 1:** Backend Preparation (1 week)
5. **Iterate phase by phase**

---

## 📝 Additional Notes

### Important Design Decisions

1. **JWT in httpOnly cookies:** 
   - ✅ Better security against XSS
   - Tokens are stored in httpOnly cookies, not in localStorage
   - Backend manages authentication via cookies

2. **Soft-delete vs Hard-delete:**
   - ⚠️ Consider impact on associated transactions
   - For categories: What happens with transactions using that category?
   - For payment methods: What happens with transactions using that method?
   - **Options:**
     - Soft-delete (mark as deleted but keep in DB)
     - Validate no transactions exist before deleting
     - Allow deletion and handle null references

3. **Automatic default data creation:**
   - ✅ Improves initial UX
   - Upon registration, user automatically gets:
     - Default categories (common income and expenses)
     - Basic payment methods
   - Implemented in `UserService` during registration

4. **Hexagonal Architecture in Frontend:**
   - ✅ Clear separation of concerns
   - Application Layer: Use cases and contracts
   - Domain Layer: Models and business logic
   - Infrastructure Layer: Implementations (HTTP, storage, UI)
   - **Advantage:** Makes it easy to change implementations without affecting logic

5. **Monorepo with npm workspaces:**
   - ✅ Shared code in `@gualet/shared`
   - Avoids duplication of DTOs, types and models
   - Facilitates keeping interfaces synchronized between backend and frontend

### Supabase Status
- ✅ **COMPLETELY REMOVED** from frontend
- No references to `createClient`, `VITE_SUPABASE`, etc.
- All repositories use NestJS backend
- Relevant commit: `72c964b - refactor: remove Supabase dependency from project`

### Clean Architecture
The frontend follows **Clean Architecture** correctly:
```
Application Layer (Use Cases) → Define contracts
    ↓
Domain Layer (Models, Types) → Business logic
    ↓
Infrastructure Layer (Repositories, HTTP) → Implementation
```

This makes it easy to add IndexedDB without breaking anything:
```typescript
// You only change the repository implementation
// Use cases DO NOT change
CategoryRepositoryImplementation {
  - HttpDataSource (current)
  + IndexedDBDataSource (new)
  + SyncQueue (new)
}
```

### Performance Considerations
IndexedDB is **asynchronous** and can be slow if:
- You have >10,000 transactions
- You make complex queries without indexes
- You don't use cursors for iteration

**Solution:**
- Create indexes on frequent fields (date, categoryId)
- Paginate results
- Lazy loading of old transactions

---

---

## 🎯 Definition of "Done"

### Backend Migration Completed ✅
The backend refactor to NestJS will be considered **completely finished** when:

- ✅ No Supabase references exist in the code (DONE)
- ✅ All basic use cases are implemented and tested (ALMOST COMPLETE)
- ✅ User preferences synchronized with backend (DONE - using HTTP, not localStorage)
- [ ] E2E tests cover main flows (auth, transactions, categories, payment methods)
- [ ] Basic documentation is complete
- [ ] System is deployable to production

### Offline-First Completed (Future Goal)
The offline-first implementation will be considered **finished** when:

- [ ] App works 100% without connection
- [ ] Data syncs automatically when back online
- [ ] Conflicts are resolved correctly
- [ ] No data loss
- [ ] Fast response times (<100ms for local operations)
- [ ] Test coverage >95%
- [ ] E2E tests >95% passing
- [ ] Offline-first architecture documentation complete

---

**Document created on:** December 21, 2025  
**Author:** GitHub Copilot  
**Version:** 1.1 (Integrated with original ROADMAP.md)  
**Last updated:** December 21, 2025

