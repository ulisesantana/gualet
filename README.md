# gualet

Personal finance management app - Track your expenses offline-first

## 📊 Project Status

**Current State:** Backend migration ~80% complete, Frontend integrated, Offline-first pending

📖 **[See full project status and roadmap →](./docs/project/STATUS.md)**

### Quick Summary
- ✅ **Backend (NestJS + PostgreSQL):** Auth, Categories (CRUD), Payment Methods (CRUD), Transactions (BREAD with filters) - All complete
- ✅ **Frontend (React):** Integrated with new backend (NO Supabase)
- ✅ **Tests E2E (Playwright):** Login, Register, Categories (~70% complete)
- ❌ **Offline-First:** NOT implemented yet (IndexedDB + Sync needed)

### Next Steps
1. Implement DELETE endpoints for categories and payment methods
2. Complete E2E test suite
3. Implement offline-first with IndexedDB and sync manager

---

## Pending tasks
### Routes (Updated Status)
#### Categories
- ✅ GET    /api/me/categories
- ✅ GET    /api/me/categories/:id
- ✅ POST   /api/me/categories
- ✅ PATCH  /api/me/categories/:id
- [ ] DELETE /api/me/categories/:id

#### Payment Methods
- ✅ GET    /api/me/payment-methods
- ✅ GET    /api/me/payment-methods/:id
- ✅ POST   /api/me/payment-methods
- ✅ PATCH  /api/me/payment-methods/:id
- [ ] DELETE /api/me/payment-methods/:id

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
### Features
- ✅ Create user
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
- ✅ Login on the app
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
- ✅ Logout on the app
    - ✅ Use case
    - ✅ UI
    - ✅ Backend (NestJS)
- ✅ BREAD transactions
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete
- ✅ BREAD categories
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete
- ✅ BREAD payment methods
    - ✅ Browse
    - ✅ Read
    - ✅ Edit
    - ✅ Add
    - ✅ Delete
- [ ] **Offline-First (Main Goal)**
    - [ ] IndexedDB implementation
    - [ ] Sync Manager
    - [ ] Conflict resolution
    - [ ] Service Worker strategies
    - [ ] Background sync
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
