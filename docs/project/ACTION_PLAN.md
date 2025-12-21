# Gualet - Action Plan: Offline-First Implementation

**Goal:** Transform Gualet into a fully functional offline-first application  
**Timeline:** 6-7 weeks (full-time) or 12-14 weeks (part-time)  
**Starting Date:** TBD  

---

## 📅 Weekly Plan

### Week 0: Preparation & Backend Completion
**Duration:** 3-5 days  
**Focus:** Finish backend, stabilize tests

#### Tasks
- [x] Implement DELETE `/api/me/categories/:id`
  - Consider soft-delete or validate no transactions are using the category
- [x] Implement DELETE `/api/me/payment-methods/:id`
  - Consider soft-delete or validate no transactions are using the payment method
- [x] Fix E2E login test (error message mismatch)
- [ ] Run full E2E test suite and document all failures
- [ ] Verify all backend endpoints work with Postman/Swagger
- [ ] Update Swagger documentation
- [ ] Review and approve this action plan

#### Deliverables
- ✅ All backend CRUD endpoints working
- 🟡 E2E tests: 80%+ passing (requires Docker)
- ✅ Backend test coverage: >70% (currently 73.93%)
- [ ] Decision made: Custom sync vs Library (PouchDB/RxDB)

#### Validation
```bash
npm run test:backend:cov    # Coverage > 70%
npm run test:e2e            # Most tests passing
npm run typecheck           # No errors
```

---

### Week 1: Backend - Sync Infrastructure
**Focus:** Prepare backend for synchronization

#### Monday-Tuesday: Add Timestamps
- [ ] Create `BaseEntity` with `createdAt`, `updatedAt`, `version`
- [ ] Update all entities to extend `BaseEntity`
  - [ ] CategoryEntity
  - [ ] PaymentMethodEntity
  - [ ] TransactionEntity
  - [ ] UserPreferencesEntity
- [ ] Generate TypeORM migration
- [ ] Run migration in dev database
- [ ] Update DTOs to include timestamps
- [ ] Update tests

#### Wednesday-Thursday: Sync Module
- [ ] Create `packages/backend/src/sync/` module
- [ ] Implement `SyncController` with endpoints:
  - [ ] `POST /api/sync/push` - Accept client changes
  - [ ] `GET /api/sync/pull?since=timestamp` - Return server changes
  - [ ] `POST /api/sync/resolve` - Resolve conflicts
- [ ] Implement `SyncService` with:
  - [ ] `pushChanges()` - Merge client changes
  - [ ] `pullChanges()` - Fetch changes since timestamp
  - [ ] `resolveConflict()` - Last write wins strategy
- [ ] Create DTOs:
  - [ ] `PushChangesDto` (array of changes)
  - [ ] `PullChangesDto` (filter params)
  - [ ] `SyncResponseDto` (result + conflicts)

#### Friday: Testing & Documentation
- [ ] Unit tests for `SyncService`
- [ ] Integration tests for sync endpoints
- [ ] Swagger documentation
- [ ] Update `STATUS.md`

#### Deliverables
```typescript
// Endpoints ready:
POST /api/sync/push
  Body: {
    changes: [
      { entityType: 'transaction', operation: 'create', data: {...}, timestamp: ... },
      { entityType: 'category', operation: 'update', data: {...}, timestamp: ... }
    ]
  }

GET /api/sync/pull?since=2024-12-20T10:00:00Z
  Response: {
    categories: [...],
    paymentMethods: [...],
    transactions: [...],
    lastSyncAt: "2024-12-21T15:30:00Z"
  }
```

---

### Week 2: Frontend - IndexedDB Layer
**Focus:** Implement local storage with IndexedDB

#### Monday: Setup
- [ ] Install `idb` library: `npm install idb -w packages/frontend`
- [ ] Create folder structure:
  ```
  packages/frontend/src/infrastructure/data-sources/indexeddb/
  ├── IndexedDBDataSource.ts
  ├── db-config.ts
  ├── schemas.ts
  └── migrations.ts
  ```

#### Tuesday-Wednesday: IndexedDB Implementation
- [ ] Define database schema in `db-config.ts`:
  - Database name: `gualet-db`
  - Version: 1
  - Stores: categories, payment-methods, transactions, sync-queue, user-preferences
- [ ] Implement `IndexedDBDataSource` with methods:
  - [ ] `init()` - Initialize database
  - [ ] `create(store, data)` - Create record
  - [ ] `findAll(store)` - Get all records
  - [ ] `findById(store, id)` - Get by ID
  - [ ] `update(store, id, data)` - Update record
  - [ ] `delete(store, id)` - Delete record
  - [ ] `clear(store)` - Clear store
- [ ] Implement indexes:
  - Categories: by type
  - Transactions: by date, categoryId, paymentMethodId
  - Sync queue: by status, createdAt

#### Thursday: Sync Queue
- [ ] Implement sync queue store schema:
  ```typescript
  {
    id: string,
    entityType: 'category' | 'payment-method' | 'transaction',
    entityId: string,
    operation: 'create' | 'update' | 'delete',
    payload: JSON,
    createdAt: timestamp,
    status: 'pending' | 'syncing' | 'synced' | 'error',
    retryCount: number,
    error?: string
  }
  ```
- [ ] Implement queue operations:
  - [ ] `addToQueue(operation)` - Add operation
  - [ ] `getQueue()` - Get all pending
  - [ ] `updateQueueStatus(id, status)` - Update status
  - [ ] `removeFromQueue(id)` - Remove after sync

#### Friday: Testing
- [ ] Unit tests for IndexedDBDataSource
- [ ] Test CRUD operations
- [ ] Test queue operations
- [ ] Test indexes
- [ ] Browser testing (Chrome, Firefox, Safari)

#### Deliverables
```typescript
// IndexedDB working:
const db = new IndexedDBDataSource();
await db.init();
await db.create('categories', category);
const categories = await db.findAll('categories');
await db.addToQueue({ entityType: 'category', operation: 'create', ... });
```

---

### Week 3: Frontend - Sync Manager
**Focus:** Build synchronization orchestrator

#### Monday-Tuesday: Network Detection
- [ ] Create `packages/frontend/src/infrastructure/sync/NetworkDetector.ts`
- [ ] Implement online/offline detection
- [ ] Add event listeners for connectivity changes
- [ ] Implement `isOnline()` method
- [ ] Create React hook `useOnlineStatus()`

#### Wednesday-Thursday: Sync Manager Core
- [ ] Create `packages/frontend/src/infrastructure/sync/SyncManager.ts`
- [ ] Implement methods:
  - [ ] `init()` - Initialize sync manager
  - [ ] `syncAll()` - Sync everything
  - [ ] `syncEntity(type)` - Sync specific entity type
  - [ ] `pushChanges()` - Push local changes to server
  - [ ] `pullChanges()` - Pull server changes to local
  - [ ] `onOnline()` - Handler for going online
  - [ ] `onOffline()` - Handler for going offline
- [ ] Implement auto-sync (every 30 seconds when online)
- [ ] Implement retry logic for failed syncs

#### Friday: Conflict Resolution
- [ ] Create `ConflictResolver.ts`
- [ ] Implement "last write wins" strategy
- [ ] Compare timestamps (local vs server)
- [ ] Handle edge cases:
  - Both created same entity
  - Local update + server delete
  - Local delete + server update

#### Deliverables
```typescript
// Sync Manager ready:
const syncManager = new SyncManager(http, indexedDB, networkDetector);
await syncManager.init();

// Manual sync
await syncManager.syncAll();

// Auto-sync on reconnect
networkDetector.on('online', () => syncManager.syncAll());
```

---

### Week 4: Frontend - Repositories Refactor
**Focus:** Update repositories to use IndexedDB first

#### Monday: CategoryRepository
- [ ] Refactor `CategoryRepositoryImplementation`
- [ ] Update `create()`:
  - Save to IndexedDB first
  - Add to sync queue
  - Return local data immediately
  - Sync in background
- [ ] Update `findAll()`:
  - Always read from IndexedDB
- [ ] Update `update()`:
  - Update IndexedDB
  - Add to sync queue
  - Sync in background
- [ ] Update `delete()`:
  - Soft delete in IndexedDB
  - Add to sync queue

#### Tuesday: PaymentMethodRepository
- [ ] Same refactoring as CategoryRepository
- [ ] Update all CRUD methods

#### Wednesday: TransactionRepository
- [ ] Same refactoring as CategoryRepository
- [ ] Handle relations (category, payment method)
- [ ] Update filtering logic to work with IndexedDB

#### Thursday: UserPreferencesRepository
- [ ] Refactor for offline-first
- [ ] Store preferences locally

#### Friday: Integration & Testing
- [ ] Update dependency injection
- [ ] Update use cases if needed
- [ ] Integration tests
- [ ] Test offline scenarios manually

#### Deliverables
```typescript
// Repositories working offline:
const category = await categoryRepo.create(newCategory);
// ↑ Saved to IndexedDB + queued for sync
// Returns immediately (no network wait)

const categories = await categoryRepo.findAll();
// ↑ Read from IndexedDB (fast)
```

---

### Week 5: Service Worker & PWA
**Focus:** Enhanced PWA capabilities

#### Monday-Tuesday: Service Worker
- [ ] Create `packages/frontend/public/sw.js`
- [ ] Implement install event:
  - Cache static assets (HTML, CSS, JS, icons)
- [ ] Implement fetch event:
  - Static assets: Cache first
  - API calls: Network first, fallback to cache
- [ ] Implement activate event:
  - Clean old caches
- [ ] Register service worker in `main.tsx`

#### Wednesday: Background Sync
- [ ] Implement Background Sync API
- [ ] Register sync event in service worker
- [ ] Trigger sync on connectivity restore
- [ ] Handle sync failures

#### Thursday: Workbox (Optional)
- [ ] Evaluate using Workbox for easier SW management
- [ ] If yes: Migrate to Workbox
- [ ] Configure Workbox strategies:
  - CacheFirst for assets
  - NetworkFirst for API
  - BackgroundSync for offline operations

#### Friday: Testing
- [ ] Test PWA install
- [ ] Test offline functionality
- [ ] Test cache strategies
- [ ] Test background sync
- [ ] Test on multiple browsers

#### Deliverables
```javascript
// Service Worker active
// Can install app on mobile
// Works completely offline
// Background sync on reconnect
```

---

### Week 6: UI/UX & Polish
**Focus:** User feedback and experience

#### Monday-Tuesday: Sync UI Components
- [ ] Create `SyncIndicator` component
  - Shows: synced | syncing | pending | error
  - Shows: pending operations count
  - Shows: last sync time
- [ ] Create `OfflineBanner` component
  - Shows when offline
  - Dismissible
  - Auto-hide when online
- [ ] Create `PendingSyncBadge` component
  - Shows on settings icon
  - Number of pending operations

#### Wednesday: Hooks & Context
- [ ] Create `useOnlineStatus()` hook
- [ ] Create `useSyncStatus()` hook
- [ ] Create `SyncContext` for global sync state
- [ ] Integrate hooks in views

#### Thursday: Settings Page
- [ ] Add "Synchronization" section
- [ ] Manual sync button
- [ ] Show sync status
- [ ] Show last sync time
- [ ] Show pending operations list
- [ ] Clear local data button (with confirmation)

#### Friday: Error Handling & Feedback
- [ ] Improve error messages
- [ ] Add toast notifications for sync events
- [ ] Add loading states consistency
- [ ] Add retry button for failed syncs
- [ ] Add optimistic UI updates

#### Deliverables
```typescript
// UI showing sync status
<SyncIndicator 
  status="synced" 
  pendingCount={0} 
  lastSyncAt="2 minutes ago" 
/>

// Settings page with sync controls
- Last sync: 2 minutes ago
- Pending operations: 0
- [Sync Now] button
- [Clear Local Data] button
```

---

### Week 7: Testing & Documentation
**Status:** 🔵 Not Started (0%)  
**Focus:** Comprehensive testing and documentation  
**Assigned to:** [AI Agent / Developer Name]  
**Target completion:** [Date]

> **Prerequisites:** Week 1-6 must be complete

#### Monday-Tuesday: E2E Offline Tests
**Status:** [ ] Not Started | [ ] In Progress | [ ] Complete  
**Completed:** [Date]
- [ ] Create `packages/e2e/tests/offline/` folder
- [ ] Test: Create transaction offline
- [ ] Test: Edit transaction offline
- [ ] Test: Delete transaction offline
- [ ] Test: Sync on reconnect
- [ ] Test: Multiple pending operations
- [ ] Test: Conflict resolution
- [ ] Test: Sync error handling

#### Wednesday: Unit Tests
- [ ] IndexedDB tests
- [ ] SyncManager tests
- [ ] Repository offline tests
- [ ] Conflict resolver tests
- [ ] Increase coverage to >80%

#### Thursday: Performance Testing
- [ ] Test with 1,000 transactions
- [ ] Test with 10,000 transactions
- [ ] Test sync performance
- [ ] Test IndexedDB query performance
- [ ] Optimize if needed (indexes, pagination)

#### Friday: Documentation
- [ ] Update `STATUS.md`
- [ ] Update `QUICK_REFERENCE.md`
- [ ] Create `OFFLINE_FIRST.md` guide
- [ ] Document sync architecture
- [ ] Document troubleshooting
- [ ] Record demo video

#### Deliverables
- ✅ 95%+ E2E tests passing
- ✅ 95%+ unit test coverage
- ✅ Performance benchmarks documented
- ✅ Complete documentation
- ✅ Demo video

---

## 🎯 Success Criteria

### Functional
- [ ] App works 100% offline
- [ ] Data syncs automatically when online
- [ ] Conflicts resolved correctly
- [ ] No data loss
- [ ] Fast response times (<100ms for local operations)

### Technical
- [ ] Test coverage >80%
- [ ] E2E tests >95% passing
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] IndexedDB size <50MB (for typical usage)

### User Experience
- [ ] Clear sync status indicator
- [ ] Offline mode is obvious
- [ ] No UI blocking during sync
- [ ] Error messages are helpful
- [ ] Manual sync available

---

## 📊 Progress Tracking

### Checklist Template (copy for each week)
```markdown
## Week X: [Title]
**Dates:** DD/MM - DD/MM
**Status:** 🔵 Not Started | 🟡 In Progress | 🟢 Complete | 🔴 Blocked

### Monday
- [ ] Task 1
- [ ] Task 2

### Tuesday
- [ ] Task 1
- [ ] Task 2

### Wednesday
- [ ] Task 1
- [ ] Task 2

### Thursday
- [ ] Task 1
- [ ] Task 2

### Friday
- [ ] Task 1
- [ ] Task 2

### Blockers
- None

### Notes
- [Add any notes, decisions, or learnings]
```

---

## 🚨 Risk Management

### High Risk
1. **IndexedDB Limitations**
   - Risk: Storage quota exceeded
   - Mitigation: Implement data cleanup, pagination, limit history
   
2. **Sync Conflicts**
   - Risk: Complex conflicts hard to resolve
   - Mitigation: "Last write wins" strategy, user notification

3. **Browser Compatibility**
   - Risk: IndexedDB/SW not supported everywhere
   - Mitigation: Feature detection, graceful degradation

### Medium Risk
1. **Performance with Large Data**
   - Risk: Slow queries with >10k transactions
   - Mitigation: Proper indexes, virtual scrolling, pagination

2. **Network Issues During Sync**
   - Risk: Partial syncs, corrupted state
   - Mitigation: Transactional sync, rollback on error

### Low Risk
1. **Learning Curve**
   - Risk: Team unfamiliar with IndexedDB
   - Mitigation: Use `idb` library, good documentation

---

## 🎓 Learning Resources

### Must Read
- [ ] [Working with IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [ ] [Service Worker Lifecycle](https://developer.chrome.com/docs/workbox/service-worker-lifecycle/)
- [ ] [Offline First Design](https://offlinefirst.org/)

### Code Examples
- [ ] [idb Library Examples](https://github.com/jakearchibald/idb#examples)
- [ ] [Background Sync Sample](https://github.com/GoogleChrome/samples/tree/gh-pages/background-sync)
- [ ] [PouchDB Architecture](https://pouchdb.com/guides/) (for reference)

---

## 📞 Decision Points

### Week 0 Decision: Custom vs Library
**Options:**
1. **Custom Implementation** (this plan)
   - Pros: Full control, learning, no dependencies
   - Cons: More work, reinventing the wheel
   - Time: 6-7 weeks

2. **PouchDB + CouchDB**
   - Pros: Battle-tested, automatic sync, less code
   - Cons: Need CouchDB server, different paradigm
   - Time: 2-3 weeks

3. **RxDB**
   - Pros: Reactive, good TypeScript support, plugins
   - Cons: Learning curve, dependency
   - Time: 3-4 weeks

**Decision:** [ ] Custom [ ] PouchDB [ ] RxDB [ ] Other: _______

**Rationale:**
```
[Document your decision and reasoning here]
```

---

## 📝 Daily Log Template

```markdown
### Day DD/MM/YYYY
**Hours:** X hours
**Tasks Completed:**
- [x] Task 1
- [x] Task 2
- [ ] Task 3 (blocked by...)

**Learnings:**
- Learned X about IndexedDB
- Found library Y useful for Z

**Blockers:**
- Issue with X, investigating...

**Tomorrow:**
- [ ] Finish Task 3
- [ ] Start Task 4
```

---

## 🎉 Milestones

- [ ] **M1:** Backend sync ready (End of Week 1)
- [ ] **M2:** IndexedDB working (End of Week 2)
- [ ] **M3:** Sync Manager implemented (End of Week 3)
- [ ] **M4:** Repositories refactored (End of Week 4)
- [ ] **M5:** PWA enhanced (End of Week 5)
- [ ] **M6:** UI polished (End of Week 6)
- [ ] **M7:** Fully tested & documented (End of Week 7)
- [ ] **M8:** Production ready! 🚀

---

**Created:** December 21, 2025  
**Last Updated:** December 21, 2025  
**Status:** 🔵 Planning Phase

Good luck! 💪

