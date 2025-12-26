# Gualet - Project Status and Roadmap

**Date:** December 21, 2025  
**Application:** Personal finance management

---

## 📋 Executive Summary

Gualet is a personal finance web application in the process of migrating from Supabase to its own backend with NestJS and PostgreSQL. The backend is **~80% complete** with the main functionalities implemented, but the frontend **is still partially using the new backend**. Currently, there is **NO offline-first implementation** and it will be necessary to add IndexedDB and synchronization.

---

## 🎯 Current Project Status

### ✅ Backend (NestJS + PostgreSQL) - 80% Complete

#### Infrastructure
- ✅ **Framework:** NestJS configured and running
- ✅ **Database:** PostgreSQL with TypeORM
- ✅ **Migrations:** Migration system configured (2 migrations created)
- ✅ **Seeding:** Automatic test data system
  - Test user: `test@gualet.app` / `test1234`
  - Default categories (income and expenses)
  - Default payment methods
- ✅ **Docker:** docker-compose for development
- ✅ **Testing:** Jest configured with coverage
- ✅ **Documentation:** Swagger/OpenAPI

#### Authentication ✅
- ✅ POST `/api/auth/register` - User registration
- ✅ POST `/api/auth/login` - Login with HttpOnly cookies
- ✅ POST `/api/auth/logout` - Logout
- ✅ POST `/api/auth/verify` - Session verification
- ✅ JWT Guards implemented
- ✅ Complete unit tests

#### Categories ✅
- ✅ GET `/api/me/categories` - List user's categories
- ✅ GET `/api/me/categories/:id` - Get specific category
- ✅ POST `/api/me/categories` - Create category
- ✅ PATCH `/api/me/categories/:id` - Update category
- ✅ Authorization validations (owner user)
- ✅ Complete unit tests
- ❌ DELETE (not implemented)

#### Payment Methods ✅ (CRUD - Simple Operations)
- ✅ GET `/api/me/payment-methods` - List all payment methods (no filters or pagination)
- ✅ GET `/api/me/payment-methods/:id` - Get specific method
- ✅ POST `/api/me/payment-methods` - Create method
- ✅ PATCH `/api/me/payment-methods/:id` - Update method
- ✅ DELETE `/api/me/payment-methods/:id` - Delete method (with conflict detection for transactions in use)
- ✅ Authorization validations
- ✅ Complete unit tests

#### Transactions ✅ (BREAD - Browse with Advanced Filtering)
- ✅ GET `/api/me/transactions` - List transactions (with advanced filters and pagination)
  - **Filters:** date range (`from`, `to`), `categoryId`, `paymentMethodId`, `operation` type
  - **Pagination:** `page`, `pageSize` (supports `pageSize=0` for all results)
  - **Sorting:** `sort` (asc/desc by date)
- ✅ GET `/api/me/transactions/:id` - Get specific transaction
- ✅ POST `/api/me/transactions` - Create transaction
- ✅ PATCH `/api/me/transactions/:id` - Update transaction
- ✅ DELETE `/api/me/transactions/:id` - Delete transaction
- ✅ Pagination implemented
- ✅ Filters by category, payment method, date
- ✅ Complete unit tests

#### User Preferences ✅
- ✅ Module implemented
- ✅ Controller and Service created
- ✅ Endpoints implemented:
  - ✅ GET `/api/me/preferences` - Get preferences
  - ✅ PUT `/api/me/preferences` - Save preferences
- ✅ Frontend already uses backend (HttpDataSource, not localStorage)
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

### 🔶 Frontend (React + Vite) - 60% Complete

#### Infrastructure
- ✅ **Framework:** React 18 + Vite + TypeScript
- ✅ **Architecture:** Clean Architecture (Application/Domain/Infrastructure)
- ✅ **Routing:** Wouter
- ✅ **HTTP Client:** Axios with HttpDataSource abstraction
- ✅ **PWA:** vite-plugin-pwa configured (but no real offline-first)
- ✅ **Proxy:** Configured for `/api` → `http://localhost:5050`
- ✅ **Testing:** Vitest + Testing Library
- ❌ **NO IndexedDB** implemented
- ❌ **NO Service Worker** with custom cache strategies
- ❌ **NO offline synchronization**

#### Implemented Repositories
The repositories are already created and use the **NestJS backend**:

```typescript
✅ UserRepository - /api/auth/*
  - login(), logout(), register(), verify(), isLoggedIn()

✅ CategoryRepository - /api/me/categories
  - create(), findAll(), findById(), update()
  - ❌ Missing: delete()

✅ PaymentMethodRepository - /api/me/payment-methods
  - create(), findAll(), findById(), update()
  - ❌ Missing: delete()

✅ TransactionRepository - /api/me/transactions
  - create(), find(), findById(), update(), delete()

✅ UserPreferencesRepository - /api/me/preferences
  - find(), update()
```

**Important Note:** The frontend **NO longer uses Supabase**. All repositories point to NestJS backend routes.

#### Use Cases (Application Layer) ✅
```typescript
✅ LoginUseCase
✅ LogoutUseCase
✅ RegisterUseCase
✅ GetAllCategoriesUseCase
✅ SaveCategoryUseCase
✅ GetAllPaymentMethodsUseCase
✅ SavePaymentMethodUseCase
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
✅ TransactionDetailsView
✅ CategoriesView - Connected to backend
✅ AddCategoryView
✅ CategoryDetailsView
✅ SettingsView
✅ ReportView
```

#### Frontend-Backend Integration Status
- ✅ **Authentication:** Working with HttpOnly cookies
- ✅ **Categories:** Basic CRUD working
- ✅ **Transactions:** Listing and creation working
- ⚠️ **Payment Methods:** Listing working, editing pending verification
- ⚠️ **Synchronization:** Everything depends on online connection

---

### ✅ E2E Tests (Playwright) - 70% Complete

#### Infrastructure
- ✅ Playwright configured
- ✅ Docker Compose for test database
- ✅ DatabaseManager with complete helpers
- ✅ Page Objects created (LoginPage, CategoriesPage, TransactionsPage, PaymentMethodsPage)
- ✅ Authentication helpers
- ✅ Automatic data cleanup between tests

#### Test Suites
```
✅ login.spec.ts - 4/5 tests passing
  ✅ Redirect to login if not authenticated
  ✅ Successful login
  ✅ Don't show settings if not authenticated
  ❌ Error message "user not found" doesn't match

✅ register.spec.ts - Tests working
  ✅ Successful registration
  ⚠️ Error handling (user already exists)

⚠️ categories.spec.ts - 10 tests created
  ✅ Create expense category
  ✅ Create income category
  ⚠️ Edit category (pending adjustments)
  ⚠️ Delete category (pending adjustments)
  ✅ Show multiple categories
  ⚠️ Complete CRUD cycle

📝 transactions.spec.ts - 10 tests created (pending UI validation)
📝 payment-methods.spec.ts - 10 tests created (pending UI validation)
📝 network-errors.spec.ts - 9 tests created (pending validation)
```

#### E2E Documentation
- ✅ `packages/e2e/README.md` - Complete guide
- ✅ `packages/e2e/IMPLEMENTATION_STATUS.md` - Detailed status

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

### 🔴 Critical Tasks - Basic Functionality

#### 1. Complete Backend
- [ ] DELETE `/api/me/categories/:id` (consider soft-delete or validate dependencies)
- [ ] DELETE `/api/me/payment-methods/:id` (consider soft-delete or validate dependencies)
- [ ] Implement business validations:
  - [ ] Validate that user doesn't access another user's resources (already partially implemented)
  - [ ] Validate limits on names, descriptions
  - [ ] Validate transaction dates are valid
  - [ ] Validate transaction amounts (not negative, reasonable limits)
  - [ ] Uniqueness of category names per user
  - [ ] Uniqueness of payment method names per user
- [ ] Implement rate limiting
- [ ] Implement centralized logging service
- [ ] Improve consistent error handling

### 2. Complete Frontend-Backend Integration
- ✅ Verify that NO Supabase references remain (completely removed)
- ✅ DELETE operations implemented in repositories
- [ ] Verify all editing flows
- [ ] Add visual feedback after edits (toasts/notifications)
- [ ] Improve error handling in UI with specific messages
- [ ] Add consistent loading states
- [ ] Implement form validation before submission
- [ ] Implement visual feedback for loading states

### 3. E2E Tests
- [ ] Adjust login test "user not found" (error message)
- [ ] Complete categories tests (edit/delete)
- [ ] Validate and adjust transaction tests against real UI
- [ ] Validate and adjust payment methods tests against real UI
- [ ] Implement network error tests
- [ ] Add category flow tests (create, edit, list)
- [ ] Add payment method flow tests
- [ ] Add transaction flow tests (create, edit, delete, filter)
- [ ] Add report tests
- [ ] Add edge case tests (validations, errors)

### 4. Unit Tests
**Backend:**
- [ ] Complete service unit tests (current coverage unknown)
- [ ] Add repository tests
- [ ] Add controller tests
- [ ] Implement additional integration tests

**Frontend:**
- [ ] Complete tests for all use cases
- [ ] Add repository tests
- [ ] Add UI component tests
- [ ] Improve overall coverage

### 5. Security and Performance
**Security:**
- [ ] Implement rate limiting in backend
- [ ] Implement appropriate CORS for production
- [ ] Implement input sanitization
- [ ] Implement CSP (Content Security Policy)
- [ ] Implement refresh tokens for JWT
- [ ] Implement 2FA (optional)
- [ ] Add audit logs for important changes

**Performance:**
- [ ] Implement cache for frequent queries (backend)
- [ ] Optimize database queries with appropriate indexes
- [ ] Implement pagination in all endpoints that return lists
- [ ] Implement response compression
- [ ] Implement client-side data cache (frontend)
- [ ] Optimize rendering of large lists
- [ ] Implement lazy loading of components

### 6. DevOps and Deployment
- [ ] Configure CI/CD (GitHub Actions)
- [ ] Create optimized Dockerfile for production
- [ ] Configure environment variables for different environments
- [ ] Implement more robust health checks
- [ ] Configure automatic database backups
- [ ] Deployment documentation

### 7. Documentation
- [ ] Document API with Swagger/OpenAPI (partially done)
- [ ] Create detailed README with setup instructions
- [ ] Document project architecture
- [ ] Create contribution guide
- [ ] Document important design decisions

### 8. Additional Features (Future)
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

## 🎯 Main Objectives

### Objective 1: Complete Backend Migration ✅ (80% Done)
**Status:** Almost completed, minor details missing

**Remaining Steps:**
1. [ ] Implement DELETE for categories and payment methods
2. [ ] Verify complete frontend-backend integration
3. [ ] Run all E2E tests and adjust failing ones
4. [ ] Document complete API in Swagger

**Estimate:** 2-3 days

---

### Objective 2: Implement Offline-First with RxDB 🎯 (0% Done)

**Status:** Not started - Decision made: Using RxDB (see ADR-0003)

**Decision:** After thorough analysis, we have chosen **RxDB** over custom IndexedDB implementation:
- ✅ Works with existing NestJS + PostgreSQL backend
- ✅ TypeScript first-class support
- ✅ Reactive queries (RxJS Observables) perfect for React
- ✅ JSON Schema validation
- ✅ Custom replication with REST API
- ✅ 3-4 week implementation timeline (vs 6-7 weeks custom)
- ✅ ~70KB bundle size (acceptable)

**See:** [ADR-0003: Offline-First Sync Strategy](../adr/0003-offline-first-sync-strategy.md)

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

