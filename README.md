# gualet

Personal finance management app - Track your expenses offline-first

## 🚀 Quick Start for New Developers

**New to the project?** Get started in 5 minutes:

```bash
# 1. Clone and setup
git clone <repository-url>
cd gualet
npm run setup

# 2. Start development environment
npm run dev

# 3. Open http://localhost:3000
# Login with: test@gualet.app / test1234
```

📖 **[Complete Getting Started Guide →](./docs/GETTING_STARTED.md)**

---

## 📊 Project Status

**Current State:** Backend 100% complete, Frontend fully integrated with enhanced test coverage, Offline-first pending

📖 **[See full project status and roadmap →](./docs/project/STATUS.md)**

### Quick Summary
- ✅ **Backend (NestJS + PostgreSQL):** Auth, Categories (CRUD), Payment Methods (CRUD), Transactions (BREAD with filters) - **100% complete**
  - **Latest:** Payment Methods now require UUID `id` in creation DTO
  - DELETE returns status 200 with success response
  - Repository improved with better query handling
- ✅ **Frontend (React):** Fully integrated with NestJS backend (NO Supabase)
  - **Enhanced:** Comprehensive test coverage added for stores, components, and views
  - Payment Method creation now generates UUID client-side
  - Improved UI/UX in PaymentMethodsView and SettingsView
- ✅ **Tests Backend:** 190 tests passing - **99.62% coverage**
- ✅ **Tests Frontend:** 183+ tests passing - **72.02% coverage** (improving with new tests)
  - **New:** 285 tests for useCategoryStore
  - **New:** 215 tests for usePaymentMethodStore
  - **New:** 100+ tests for CategoryCard and PaymentMethodCard
  - **New:** Comprehensive tests for forms, contexts, and hooks
- ✅ **Tests E2E (Playwright):** 24/24 active tests passing **(100%)** - Login ✅, Register ✅, Categories ✅, Transactions ✅
  - **New:** Report test suite added (comprehensive scenarios)
  - Note: 21 tests skipped (payment-methods and network-errors suites pending implementation)
- ❌ **Offline-First:** NOT implemented yet (RxDB + Sync pending)

### Latest Updates (Dec 29, 2025)
- 🆕 Documentation fully reviewed and updated
- 🆕 Backend README rewritten with Gualet-specific information
- 🆕 Frontend README enhanced with complete details
- 🆕 All dates updated to current status
- ✅ Payment Methods require UUID ID in creation

### Next Steps
1. ✅ ~~Complete DELETE endpoints~~ - **DONE**
2. ✅ ~~Enhance test coverage~~ - **IN PROGRESS** (major improvements made)
3. 🎯 Implement offline-first with RxDB (see [ADR-0003](./docs/adr/0003-offline-first-sync-strategy.md))

---

## Pending tasks
### Routes (Updated Status)
#### Categories
- ✅ GET    /api/me/categories
- ✅ GET    /api/me/categories/:id
- ✅ POST   /api/me/categories
- ✅ PATCH  /api/me/categories/:id
- ✅ DELETE /api/me/categories/:id

#### Payment Methods
- ✅ GET    /api/me/payment-methods
- ✅ GET    /api/me/payment-methods/:id
- ✅ POST   /api/me/payment-methods
- ✅ PATCH  /api/me/payment-methods/:id
- ✅ DELETE /api/me/payment-methods/:id

#### Transactions
- ✅ GET    /api/me/transactions
- ✅ GET    /api/me/transactions/:id
- ✅ POST   /api/me/transactions
- ✅ PATCH  /api/me/transactions/:id
- ✅ DELETE /api/me/transactions/:id

#### Auth
- ✅ POST   /api/auth/login
- ✅ POST   /api/auth/logout
- ✅ POST   /api/auth/register
- ✅ POST   /api/auth/verify

## Roadmap
### Backend Migration ✅ COMPLETE (Dec 27, 2025)
- ✅ Create user
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
    - ✅ Tests (99.62% coverage)
- ✅ Login on the app
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
    - ✅ Tests
- ✅ Logout on the app
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
    - ✅ Tests
- ✅ BREAD transactions
    - ✅ Browse (with advanced filters: date, category, payment method)
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete
    - ✅ Tests
- ✅ BREAD categories
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete (with conflict detection)
    - ✅ Tests
- ✅ BREAD payment methods
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete (with conflict detection)
    - ✅ Tests

### Frontend Integration ✅ COMPLETE (Dec 27, 2025)
- ✅ Remove all Supabase dependencies
- ✅ Implement HTTP repositories for all resources
- ✅ Connect all views to NestJS backend
- ✅ Add delete functionality for categories
- ✅ Add delete functionality for payment methods
- ✅ Frontend tests: 183 passing (100%)

### Offline-First Implementation 🎯 NEXT (RxDB)
See [ADR-0003](./docs/adr/0003-offline-first-sync-strategy.md) and [ACTION_PLAN](./docs/project/ACTION_PLAN.md)
    - ✅ Add
    - ✅ Delete (with conflict detection)
    - ✅ Tests
- ✅ BREAD payment methods
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete (with conflict detection)
    - ✅ Tests

### Offline-First (Next Major Milestone) 🎯
- ✅ **Strategy Selected:** RxDB (see ADR-0003)
- [ ] **Week 1:** RxDB Setup & Backend Sync API
    - [ ] Install RxDB dependencies
    - [ ] Define JSON Schemas
    - [ ] Create backend sync endpoints
    - [ ] Implement pull/push handlers
- [ ] **Week 2:** RxDB Replication & Repository Migration
    - [ ] Initialize RxDB database
    - [ ] Implement custom replication
    - [ ] Migrate repositories to RxDB
- [ ] **Week 3:** React Integration & UI Components
    - [ ] Create React hooks for RxDB
    - [ ] Build sync status UI
    - [ ] Update views to use RxDB hooks
- [ ] **Week 4:** PWA, Testing & Polish
    - [ ] Service Worker strategies
    - [ ] Background sync
    - [ ] E2E offline tests
    - [ ] Lighthouse audit (target: >90 PWA score)

### Future Features
- [ ] Forgot password
- [ ] Add feedback after editing
    - [ ] Transaction
    - [ ] Category
- [ ] Add version on settings page

## 📚 Documentation

### Main Documents
- **[Project Status & Roadmap](./docs/project/STATUS.md)** - Complete project status, detailed roadmap, and offline-first implementation guide (6-7 weeks plan)
- **[Action Plan](./docs/project/ACTION_PLAN.md)** - Week-by-week implementation plan for offline-first with daily tasks and milestones
- **[Quick Reference](./docs/project/QUICK_REFERENCE.md)** - Quick start guide, common commands, and visual status overview
- **[API Design Patterns](./docs/project/API_DESIGN.md)** - Explanation of CRUD vs BREAD patterns used in the API

### Compliance & Privacy
- **[GDPR_QUICK_START.md](./docs/compliance/GDPR_QUICK_START.md)** - ⚡ Quick start guide (read this first!)
- **[GDPR_COMPLIANCE.md](./docs/compliance/GDPR_COMPLIANCE.md)** - Complete GDPR compliance guide for EU deployment
- **[GDPR_CHECKLIST.md](./docs/compliance/GDPR_CHECKLIST.md)** - Implementation checklist (use before production)
- **[DATA_PROCESSING_RECORD.md](./docs/compliance/DATA_PROCESSING_RECORD.md)** - Data processing activities record (Art. 30 GDPR)
- **[PRIVACY_POLICY_TEMPLATE.md](./docs/compliance/PRIVACY_POLICY_TEMPLATE.md)** - Privacy policy template to customize

### Package Documentation
- [Backend Documentation](./packages/backend/README.md)
- [Backend Seeding Guide](./packages/backend/DATABASE_SEEDING.md)
- [Frontend Documentation](./packages/frontend/README.md)
- [E2E Testing Guide](./packages/e2e/README.md)
- [E2E Implementation Status](./packages/e2e/IMPLEMENTATION_STATUS.md)

### Development Scripts

```bash
# Start development
npm run dev                    # All services
npm run dev:backend           # Backend only
npm run dev:frontend          # Frontend only

# Database
npm run db:dev:up             # Start PostgreSQL
npm run db:dev:seed           # Seed test data
npm run db:dev:clean          # Clean database

# Testing
npm run test                  # All tests
npm run test:backend          # Backend unit tests
npm run test:frontend         # Frontend unit tests
npm run test:e2e              # E2E tests with Playwright
npm run test:e2e:ui           # E2E tests with UI

# Type checking
npm run typecheck             # All packages
```

### Test User Credentials
- **Email:** `test@gualet.app`
- **Password:** `test1234`

---

**For complete documentation, see [Documentation Index](./docs/README.md)**
