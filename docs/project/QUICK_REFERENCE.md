# Gualet - Quick Reference Guide

## 🎯 Current Status at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     GUALET PROJECT STATUS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Backend (NestJS + PostgreSQL)        ████████████  100%       │
│  Frontend (React + Vite)              ████████░░░░   72%       │
│  E2E Tests (Playwright)               ████████████  100%       │
│  Offline-First (RxDB + Sync)          ░░░░░░░░░░░░   0%       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Last Updated:** December 27, 2025

**Note:** Frontend is 100% complete functionally, but test coverage is 72% (target: 95%)

## 📂 Project Structure

```
gualet/
├── packages/
│   ├── backend/          NestJS API (✅ 100% Complete)
│   │   ├── auth/         ✅ Login, Register, Logout, Verify
│   │   ├── categories/   ✅ Full CRUD (including DELETE)
│   │   ├── payment-methods/  ✅ Full CRUD (including DELETE)
│   │   ├── transactions/ ✅ Full CRUD + Advanced Filters
│   │   └── user-preferences/ ✅ Get/Update preferences
│   │
│   ├── frontend/         React SPA (✅ 100% Complete)
│   │   ├── repositories/ ✅ All using NestJS backend
│   │   ├── use-cases/    ✅ All implemented
│   │   ├── views/        ✅ All views (12 total)
│   │   ├── stores/       ✅ Zustand state management
│   │   └── offline/      ❌ NOT IMPLEMENTED (RxDB planned)
│   │
│   ├── e2e/             Playwright (✅ 100% Active Tests)
│   │   ├── login.spec.ts        ✅ 5/5 passing
│   │   ├── register.spec.ts     ✅ 2/2 passing
│   │   ├── categories.spec.ts   ✅ 9/9 passing
│   │   ├── transactions.spec.ts ✅ 8/8 active passing
│   │   ├── payment-methods.spec.ts ⏸️ Skipped (10 tests)
│   │   └── network-errors.spec.ts  ⏸️ Skipped (9 tests)
│   │
│   └── shared/          Shared types and utilities ✅
│
├── scripts/             Development scripts ✅
│   ├── setup.sh         Complete project setup
│   ├── dev-all.sh       Start backend + frontend
│   ├── db-reset.sh      Reset and reseed database
│   └── verify-gdpr-compliance.sh  GDPR validation
│
└── docs/                Complete documentation ✅
    ├── GETTING_STARTED.md
    ├── adr/             Architecture Decision Records
    ├── compliance/      GDPR documentation
    └── project/         Project documentation
```

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Start database
npm run db:dev:up

# 3. Seed test data
npm run db:dev:seed

# 4. Start development
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5050
- **Swagger Docs:** http://localhost:5050/api/docs (when backend is running)
- **Test User:** test@gualet.app / test1234

## 🔧 Common Tasks

### Development
```bash
npm run dev              # Start everything
npm run dev:backend     # Backend only (port 5050)
npm run dev:frontend    # Frontend only (port 3000)
```

### Database
```bash
npm run db:dev:up       # Start PostgreSQL container
npm run db:dev:down     # Stop PostgreSQL container
npm run db:dev:seed     # Seed test data (user, categories, etc)
npm run db:dev:clean    # Clean all data
```

### Testing
```bash
npm run test            # All unit tests
npm run test:backend    # Backend unit tests
npm run test:frontend   # Frontend unit tests
npm run test:e2e        # E2E tests
npm run test:e2e:ui     # E2E with Playwright UI
```

### Type Checking
```bash
npm run typecheck       # All packages
```

## 📊 Feature Checklist

### ✅ Implemented & Working (100%)
- [x] User registration and login
- [x] Session management with HttpOnly cookies
- [x] Categories full CRUD (with conflict detection on delete)
- [x] Payment methods full CRUD (with conflict detection on delete)
- [x] Transactions full BREAD (Browse with advanced filters, Read, Edit, Add, Delete)
- [x] Transaction filtering (date, category, payment method, operation type)
- [x] Transaction pagination and sorting
- [x] User preferences management
- [x] Frontend-backend complete integration
- [x] Backend tests: 190 tests, 99.62% coverage
- [x] Frontend tests: 183 tests, 72.02% coverage (⚠️ below 95% target)
- [x] E2E tests: 24/24 active tests passing (100%)
- [x] Database seeding with test data
- [x] PWA manifest and service worker
- [x] Complete API documentation (Swagger)
- [x] Reports view
- [x] Settings view
- [x] Zustand state management

### ❌ Not Started (Next Milestone)
- [ ] **RxDB integration** (see ADR-0003)
- [ ] **Local data persistence (IndexedDB)**
- [ ] **Offline-first functionality**
- [ ] **Background synchronization**
- [ ] **Conflict resolution**
- [ ] **Sync status indicators**

### 📝 Optional Enhancements
- [ ] Enable payment methods E2E test suite (10 tests ready)
- [ ] Enable network errors E2E test suite (9 tests ready)
- [ ] Data export (CSV, PDF)
- [ ] Data import
- [ ] Multi-currency support
- [ ] Budgets and goals
- [ ] Notifications
- [ ] Advanced charts
- [ ] Transaction tags
- [ ] Password recovery

## 🎯 Implementation Phases for Offline-First (RxDB)

**See:** [ADR-0003: Offline-First Sync Strategy](../adr/0003-offline-first-sync-strategy.md) and [ACTION_PLAN.md](./ACTION_PLAN.md) for complete details.

### Week 1: RxDB Foundation (5-7 days)
```bash
Goal: Set up RxDB with basic operations
- Install RxDB and dependencies
- Create database schema
- Implement basic CRUD with RxDB
- Set up collections (users, categories, payment-methods, transactions)
```

### Week 2: Custom Replication Plugin (5-7 days)
```bash
Goal: Implement sync with NestJS backend
- Create custom replication handler
- Implement push mechanism
- Implement pull mechanism
- Add conflict resolution (last-write-wins)
```

### Week 3: Integration & UI (5-7 days)
```bash
Goal: Connect RxDB with React components
- Update repositories to use RxDB
- Migrate views to use reactive queries
- Add sync status indicators
- Implement error handling
```

### Week 4: Testing & Polish (5-7 days)
```bash
Goal: Validate offline functionality
- Test offline scenarios
- Fix edge cases
- Update E2E tests
- Performance optimization
- Documentation update
```
- Conflict resolution (last write wins)
```

### Phase 4: Repositories Refactor (1 week)
```bash
Goal: Offline-first pattern
- Write to IndexedDB first
- Queue sync operations
- Read from local storage
- Background sync
```

### Phase 5: Service Worker (1 week)
```bash
Goal: PWA capabilities
- Cache static assets
- Network-first strategy for API
- Background sync API
- Offline fallback
```

### Phase 6: UI/UX (3-5 days)
```bash
Goal: User feedback
- Sync status indicator
- Offline banner
- Pending operations badge
- Manual sync button
```

### Phase 7: Testing (1 week)
```bash
Goal: Offline scenarios
- Create offline tests
- Sync on reconnect tests
- Conflict resolution tests
- Performance tests
```

## 📚 Important Files

### Documentation
- `README.md` - This file (quick reference)
- `PROJECT_STATUS.md` - Detailed status and roadmap
- `packages/backend/DATABASE_SEEDING.md` - Seeding system
- `packages/e2e/README.md` - E2E testing guide
- `packages/e2e/IMPLEMENTATION_STATUS.md` - E2E status

### Configuration
- `docker-compose.yaml` - PostgreSQL container
- `package.json` - Workspace scripts
- `packages/backend/src/app.module.ts` - NestJS modules
- `packages/frontend/vite.config.ts` - Frontend build/dev
- `playwright.config.ts` - E2E configuration

## 🐛 Known Issues

1. **E2E Test:** Login "user not found" error message mismatch
2. **Frontend:** No offline capability yet
3. **E2E:** Some category tests need adjustments for UI flow

## 💡 Tips

### Debugging
```bash
# Backend logs
npm run dev:backend
# Watch console output for errors

# Frontend logs
npm run dev:frontend
# Open browser DevTools > Console

# E2E debugging
npm run test:e2e:ui
# Use Playwright inspector
```

### Database Inspection
```bash
# Connect to PostgreSQL
docker exec -it postgres_dev psql -U gualet -d gualet

# Useful queries
\dt                     # List tables
SELECT * FROM users;    # View users
SELECT * FROM categories WHERE user_id = 'xxx';
```

### Reset Everything
```bash
# If things get messy
npm run db:dev:down
npm run db:dev:up
npm run db:dev:seed
npm run dev
```

## 🔗 Resources

### Learning Offline-First
- [Offline First Design Pattern](https://offlinefirst.org/)
- [IndexedDB API Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [Background Sync API](https://developer.chrome.com/blog/background-sync/)

### Libraries to Consider
- [idb](https://github.com/jakearchibald/idb) - IndexedDB wrapper (recommended)
- [PouchDB](https://pouchdb.com/) - Full offline-first DB with sync
- [RxDB](https://rxdb.info/) - Reactive offline database
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker toolkit

### Technology Stack
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT
- **Frontend:** React, Vite, Axios, Wouter
- **Testing:** Jest, Vitest, Playwright
- **Tools:** Docker, npm workspaces

## 🎓 Next Actions

### Immediate (Today)
1. Read `PROJECT_STATUS.md` thoroughly
2. Run `npm run test:e2e` to see current test status
3. Decide: custom offline-first vs library (PouchDB/RxDB)

### This Week
1. Implement DELETE endpoints (backend)
2. Fix failing E2E tests
3. Start Phase 1: Backend preparation for sync

### This Month
1. Complete backend sync infrastructure
2. Implement IndexedDB layer
3. Build basic sync manager

---

**Last Updated:** December 21, 2025  
**For complete documentation:** See [Documentation Index](../README.md)

