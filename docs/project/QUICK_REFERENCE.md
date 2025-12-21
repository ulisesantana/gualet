# Gualet - Quick Reference Guide

## 🎯 Current Status at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     GUALET PROJECT STATUS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Backend (NestJS + PostgreSQL)        ████████████░░  80%      │
│  Frontend (React + Vite)              ██████████░░░░  60%      │
│  E2E Tests (Playwright)               █████████░░░░░  70%      │
│  Offline-First (IndexedDB + Sync)     ░░░░░░░░░░░░░   0%      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 Project Structure

```
gualet/
├── packages/
│   ├── backend/          NestJS API (⚡ Ready)
│   │   ├── auth/         ✅ Login, Register, Logout
│   │   ├── categories/   ✅ CRUD (except DELETE)
│   │   ├── payment-methods/  ✅ CRUD (except DELETE)
│   │   └── transactions/ ✅ Full CRUD + Filters
│   │
│   ├── frontend/         React SPA (🔶 Partial)
│   │   ├── repositories/ ✅ Using NestJS backend
│   │   ├── use-cases/    ✅ All implemented
│   │   ├── views/        ✅ All main views
│   │   └── offline/      ❌ NOT IMPLEMENTED
│   │
│   ├── e2e/             Playwright (🔶 In Progress)
│   │   ├── login.spec.ts        ✅ 4/5 passing
│   │   ├── register.spec.ts     ✅ Passing
│   │   ├── categories.spec.ts   🔶 Needs adjustments
│   │   └── transactions.spec.ts 🔶 Needs validation
│   │
│   └── shared/          Shared types and utilities ✅
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
- **Swagger Docs:** http://localhost:5050/api (when backend is running)
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

### ✅ Implemented
- [x] User registration and login
- [x] Session management with cookies
- [x] Categories CRUD (simple - no filters or pagination needed)
- [x] Payment methods CRUD (simple - no filters or pagination needed)
- [x] Transactions BREAD (with advanced filtering, pagination, and sorting)
- [x] Transaction filtering and pagination
- [x] Frontend-backend integration
- [x] Unit tests (backend + frontend)
- [x] E2E tests foundation
- [x] Database seeding
- [x] PWA manifest

### 🔶 In Progress
- [ ] E2E tests completion
- [ ] DELETE endpoints for categories/payment methods
- [ ] Error handling improvements
- [ ] Loading states consistency

### ❌ Not Started (Main Goal)
- [ ] **IndexedDB implementation**
- [ ] **Sync Manager**
- [ ] **Offline-first architecture**
- [ ] **Conflict resolution**
- [ ] **Service Worker strategies**
- [ ] **Background sync**

## 🎯 Implementation Phases for Offline-First

### Phase 1: Backend Preparation (1 week)
```bash
Goal: Add timestamps and sync endpoints
- Add createdAt, updatedAt to all entities
- Create sync controller (push/pull endpoints)
- Implement change tracking
```

### Phase 2: IndexedDB (1 week)
```bash
Goal: Local storage implementation
- Install idb library
- Create IndexedDB schemas
- Implement CRUD operations
- Add migration system
```

### Phase 3: Sync Manager (1 week)
```bash
Goal: Synchronization logic
- Network detector (online/offline)
- Sync queue for pending operations
- Push/pull synchronization
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

