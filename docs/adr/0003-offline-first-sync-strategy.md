# 0003. Offline-First Synchronization Strategy

**Status**: accepted

**Date**: 2025-12-21

**Decision Date**: 2025-12-21

**Deciders**: Ulises Santana, GitHub Copilot

---

## Context

Gualet needs to evolve from an online-only application to a fully offline-first Progressive Web App (PWA). Users should be able to manage their finances even without an internet connection, with automatic synchronization when connectivity is restored.

### Problem Statement

We need to implement a robust offline-first architecture that:
- Allows full CRUD operations offline
- Synchronizes data automatically when online
- Handles conflict resolution
- Maintains data integrity
- Provides good user experience
- Integrates with our existing NestJS + PostgreSQL backend
- Works seamlessly with our React frontend

### Requirements

**Functional:**
- Local data storage in browser (IndexedDB)
- Full offline CRUD capabilities
- Automatic sync when online
- Conflict resolution strategy
- Queue for pending operations
- Data persistence across sessions

**Technical:**
- TypeScript support end-to-end
- Integration with existing NestJS backend
- React compatibility
- Good developer experience
- Test coverage >95%
- Bundle size consideration (<100KB ideal)

**User Experience:**
- Fast response times (<100ms for local operations)
- Clear sync status indicators
- No data loss
- Seamless online/offline transitions

---

## Decision

**We have chosen Option 3: RxDB** as our offline-first synchronization strategy.

### Chosen Solution: RxDB

RxDB is a modern reactive database for JavaScript applications that provides offline-first capabilities with custom replication support. It will serve as our client-side database layer, working seamlessly with our existing NestJS + PostgreSQL backend.

### Why RxDB?

1. **Perfect Stack Compatibility**
   - Works with our existing NestJS + PostgreSQL backend (no migration needed)
   - First-class TypeScript support throughout
   - Reactive queries using RxJS Observables (ideal for React)

2. **Technical Advantages**
   - JSON Schema validation (similar to our class-validator DTOs)
   - Plugin architecture allows us to use only what we need
   - Custom replication protocol works with REST APIs
   - Multiple storage adapters (IndexedDB for web, SQLite for React Native)

3. **Development Efficiency**
   - Reasonable implementation time (3-4 weeks)
   - Good balance between features and control
   - Well-documented custom replication
   - Active development and growing community

4. **Future-Proof**
   - Works with React Native (if we want mobile app later)
   - Flexible enough for evolving requirements
   - No vendor lock-in (we control the backend)

### Implementation Approach

We will implement RxDB following this architecture:

```
┌─────────────────┐
│   React App     │
│   (Components)  │
└────────┬────────┘
         │
    ┌────▼─────────────┐
    │  React Hooks     │
    │  (State Mgmt)    │
    └────┬─────────────┘
         │
    ┌────▼─────────────┐
    │  RxDB            │
    │  (Reactive DB)   │
    │  - Collections   │
    │  - Observables   │
    │  - JSON Schema   │
    └────┬─────────────┘
         │
    ┌────▼─────────────┐
    │  Replication     │
    │  Plugin          │
    │  - Push/Pull     │
    │  - Conflict Res. │
    └────┬─────────────┘
         │
    ┌────▼─────────────┐
    │  NestJS Backend  │
    │  + PostgreSQL    │
    └──────────────────┘
```

### Key Components

1. **RxDB Collections**: Categories, PaymentMethods, Transactions, UserPreferences
2. **Storage**: Dexie.js adapter for IndexedDB
3. **Replication**: Custom pull/push handlers using our REST API
4. **Conflict Resolution**: Last Write Wins (based on `updatedAt` timestamp)
5. **Schema Validation**: JSON Schema for all entities

### Options Previously Considered

We have identified 4 main approaches (detailed analysis in Appendix below):

1. **Custom Implementation with idb**
2. **PouchDB + CouchDB**
3. **RxDB** (Currently recommended)
4. **Dexie.js + Custom Sync**

---

## Alternatives Considered

### Option 1: Custom Implementation

Build everything from scratch using IndexedDB directly (with `idb` wrapper library).

**Pros:**
- ✅ Complete control over implementation
- ✅ Minimal dependencies (~3KB)
- ✅ Deep learning opportunity
- ✅ Optimized for exact use case
- ✅ Works with existing NestJS backend

**Cons:**
- ❌ Longest development time (6-7 weeks)
- ❌ Reinventing solved problems
- ❌ All maintenance is our responsibility
- ❌ Complex conflict resolution to implement
- ❌ More potential for bugs

**Estimated Effort**: 6-7 weeks

**Bundle Size**: ~3KB

**Compatibility with Current Stack**: ✅ Perfect (no backend changes needed)

---

### Option 2: PouchDB + CouchDB

Use PouchDB (client-side) with CouchDB (server-side) for automatic replication.

**Pros:**
- ✅ Battle-tested in production
- ✅ Automatic bidirectional sync
- ✅ Built-in conflict resolution
- ✅ Fastest implementation (2-3 weeks)
- ✅ Large community and documentation

**Cons:**
- ❌ Requires CouchDB server (different from PostgreSQL)
- ❌ Need to maintain two databases OR migrate completely
- ❌ NoSQL paradigm (not ideal for our relational data)
- ❌ Largest bundle size (~145KB)
- ❌ Vendor lock-in with CouchDB
- ❌ Cannot use existing NestJS API endpoints

**Estimated Effort**: 2-3 weeks (but requires CouchDB migration)

**Bundle Size**: ~145KB

**Compatibility with Current Stack**: ❌ Major issue - requires CouchDB

---

### Option 3: RxDB (⭐ RECOMMENDED)

Modern reactive database that works with any backend through custom replication.

**Pros:**
- ✅ **Works with existing NestJS + PostgreSQL backend**
- ✅ TypeScript first-class support
- ✅ Reactive queries (RxJS Observables)
- ✅ JSON Schema validation
- ✅ Flexible replication (REST, GraphQL, WebSocket)
- ✅ Multiple storage adapters
- ✅ Good balance: features vs. control
- ✅ Plugin architecture (use only what you need)

**Cons:**
- ⚠️ RxJS learning curve
- ⚠️ Smaller community than PouchDB
- ⚠️ More initial setup than PouchDB
- ⚠️ Medium bundle size (~70KB)
- ⚠️ Less proven in production than PouchDB

**Estimated Effort**: 3-4 weeks

**Bundle Size**: ~70KB

**Compatibility with Current Stack**: ✅ Excellent (designed for custom backends)

**Why This is Recommended:**
- Perfect match for our tech stack (TypeScript everywhere)
- No need to change backend architecture
- Reactive queries work beautifully with React
- JSON Schema validation similar to our DTOs
- Future-proof (works with React Native if needed)

---

### Option 4: Dexie.js + Custom Sync

Use Dexie.js for IndexedDB wrapper + build custom sync logic.

**Pros:**
- ✅ Simpler API than raw IndexedDB
- ✅ Good TypeScript support
- ✅ React hooks available (dexie-react-hooks)
- ✅ Smaller bundle than RxDB (~20KB)
- ✅ Works with existing backend
- ✅ More control than RxDB

**Cons:**
- ⚠️ Need to implement entire sync layer
- ⚠️ No built-in replication
- ⚠️ No schema validation
- ⚠️ Similar effort to custom implementation
- ⚠️ Conflict resolution still manual

**Estimated Effort**: 4-5 weeks

**Bundle Size**: ~20KB

**Compatibility with Current Stack**: ✅ Good

---

## Comparison Matrix

| Criterion | Custom | PouchDB | RxDB | Dexie + Custom |
|----------|--------|---------|------|----------------|
| **Development Time** | 6-7 weeks | 2-3 weeks | 3-4 weeks | 4-5 weeks |
| **Learning Curve** | Medium | Low | Medium-High | Medium |
| **TypeScript Support** | ✅ Total | ⚠️ Basic | ✅ Excellent | ✅ Good |
| **Bundle Size** | ~3KB | ~145KB | ~70KB | ~20KB |
| **Control Level** | ✅ Total | ❌ Limited | ✅ High | ✅ High |
| **NestJS Compatible** | ✅ Yes | ❌ No* | ✅ Yes | ✅ Yes |
| **Reactive Queries** | ❌ Manual | ⚠️ Plugin | ✅ Built-in | ✅ Hooks |
| **Conflict Resolution** | 🔨 Build it | ✅ Automatic | 🔨 Build it | 🔨 Build it |
| **Schema Validation** | 🔨 Build it | ❌ No | ✅ JSON Schema | ❌ No |
| **Production Maturity** | N/A | ✅ High | ⚠️ Medium | ✅ High |
| **Community Size** | N/A | ✅ Large | ⚠️ Medium | ✅ Large |
| **Maintenance Burden** | 😰 High | ✅ Low | ✅ Low | ⚠️ Medium |

*PouchDB requires CouchDB, not directly compatible with PostgreSQL/NestJS

---

## Consequences

### If We Choose RxDB (Recommended)

**Positive:**
- Seamless integration with existing backend
- TypeScript end-to-end
- Reactive queries perfect for React
- Modern, future-proof solution
- Reasonable bundle size (~70KB)
- Good balance of control and convenience
- JSON Schema validation
- Works with React Native (future mobile app)

**Negative:**
- Team needs to learn RxJS concepts
- Medium bundle size (larger than custom/Dexie)
- Less Stack Overflow answers than PouchDB
- Some custom replication code needed
- API might change in future versions

**Neutral:**
- 3-4 weeks development time (middle ground)
- Plugin architecture requires configuration

---

### If We Choose Custom Implementation

**Positive:**
- Total control and understanding
- Minimal bundle size (~3KB)
- Exact fit for our needs
- No external dependencies to maintain
- Deep learning experience

**Negative:**
- 6-7 weeks development time
- All bugs are our responsibility
- Reinventing the wheel
- Complex conflict resolution
- More testing surface area

---

### If We Choose PouchDB

**Positive:**
- Fastest to implement (2-3 weeks)
- Battle-tested and reliable
- Automatic conflict resolution
- Large community

**Negative:**
- **CRITICAL**: Requires CouchDB (incompatible with our PostgreSQL backend)
- Need to maintain two databases OR completely migrate
- Largest bundle size (~145KB)
- NoSQL paradigm not ideal for our data
- Vendor lock-in

---

### If We Choose Dexie + Custom Sync

**Positive:**
- Good balance of simplicity and control
- Smaller bundle than RxDB (~20KB)
- React hooks available
- Familiar API

**Negative:**
- Still need to build sync layer
- 4-5 weeks effort
- No schema validation
- Similar complexity to custom

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| IndexedDB quota exceeded | High | Medium | Implement data cleanup, limit local history, pagination |
| Complex sync conflicts | High | Medium | "Last Write Wins" strategy initially, user notification for critical conflicts |
| Browser compatibility issues | Medium | Low | Feature detection, graceful degradation, test on major browsers |
| Performance with large datasets | Medium | Medium | Proper indexing, virtual scrolling, pagination (>10k records) |
| Network failures during sync | Medium | High | Transactional sync, rollback on error, retry with exponential backoff |
| Learning curve (RxJS for RxDB) | Low | Medium | Good documentation, examples, team training |
| Bundle size impact on mobile | Low | Medium | Code splitting, lazy loading, compression |

---

## Decision Criteria

### Time Available
- **< 3 weeks**: PouchDB (but incompatible with backend ❌)
- **3-4 weeks**: **RxDB** ⭐
- **4-5 weeks**: Dexie + Custom
- **6-7 weeks**: Custom Implementation

### Bundle Size Priority
- **Critical (<20KB)**: Custom (~3KB) or Dexie (~20KB)
- **Moderate (<100KB)**: **RxDB (~70KB)** ⭐
- **Not critical**: Any option

### Control vs. Convenience
- **Maximum control**: Custom Implementation
- **Balanced**: **RxDB** ⭐ or Dexie + Custom
- **Maximum convenience**: PouchDB (but backend incompatible ❌)

### Backend Compatibility
- **Must keep PostgreSQL + NestJS**: **RxDB** ⭐, Custom, or Dexie ✅
- **Can migrate to CouchDB**: PouchDB

---

## Recommendation

**We recommend Option 3: RxDB** for the following reasons:

1. **Perfect fit for Gualet's stack:**
   - ✅ Works with existing NestJS + PostgreSQL backend
   - ✅ TypeScript first-class support
   - ✅ Reactive (perfect for React)
   - ✅ Reasonable development time (3-4 weeks)
   - ✅ Good balance of control and features

2. **Technical advantages:**
   - JSON Schema validation (similar to our class-validator DTOs)
   - Observable queries (natural fit for React)
   - Plugin architecture (flexible)
   - Custom replication (works with any backend)

3. **Future-proof:**
   - Active development and growing community
   - Works with React Native (if we want mobile app)
   - Flexible enough for future requirements

4. **Trade-offs are acceptable:**
   - ~70KB bundle is reasonable for the features
   - RxJS learning curve is manageable
   - Custom replication is well-documented

---

## Implementation Plan (If RxDB Chosen)

### Phase 1: Setup (Week 1)
1. Install RxDB and plugins (`rxdb`, `rxdb/plugins/storage-dexie`)
2. Define JSON Schemas for all entities
3. Configure RxDB database and collections
4. Set up TypeScript types

### Phase 2: Backend Sync API (Week 1-2)
1. Create `/api/sync/pull` endpoint
2. Create `/api/sync/push` endpoint
3. Implement checkpoint/timestamp logic
4. Create sync DTOs and validation
5. Write tests

### Phase 3: Frontend Integration (Week 2-3)
1. Implement custom replication handlers
2. Configure pull/push strategies
3. Implement conflict resolution (Last Write Wins)
4. Migrate repositories to use RxDB
5. Create React hooks for reactive queries

### Phase 4: Polish & Testing (Week 3-4)
1. Add sync status UI components
2. Implement offline indicators
3. E2E tests for offline scenarios
4. Performance optimization
5. Documentation

**Total Estimated Time**: 3-4 weeks

---

## Follow-up Actions

- [x] Make final decision on sync strategy ✅ **RxDB chosen**
- [x] Document decision in this ADR ✅ **Completed**
- [ ] Update ACTION_PLAN.md with RxDB implementation tasks
- [ ] Install RxDB dependencies (`rxdb`, `rxdb/plugins/storage-dexie`)
- [ ] Define JSON Schemas for all entities
- [ ] Set up development environment for offline-first
- [ ] Begin Week 1: Backend Sync Infrastructure

---

## Appendix: Detailed Analysis of All Options

> **Note**: This section contains the comprehensive analysis that led to the RxDB decision. It provides in-depth technical details for each option.

### Executive Summary

| Strategy | Estimated Time | Complexity | Control | Dependencies | Recommendation |
|----------|---------------|------------|---------|--------------|----------------|
| **Custom Implementation** | 6-7 weeks | High | Total | Minimal (idb) | ⭐⭐⭐ |
| **PouchDB + CouchDB** | 2-3 weeks | Medium | Limited | PouchDB + CouchDB Server | ⭐⭐ |
| **RxDB** | 3-4 weeks | Medium-High | High | RxDB + adapters | ⭐⭐⭐⭐ **Chosen** |
| **Dexie.js + Custom Sync** | 4-5 weeks | Medium | High | Dexie.js | ⭐⭐⭐ |

---

### Option 1: Custom Implementation (Detailed)

**Description**: Build all synchronization infrastructure from scratch using IndexedDB directly (with `idb` library wrapper).

**Architecture**:
```
React App → Repositories → Sync Manager → IndexedDB (idb) + Backend API
                          ├─ Push/Pull
                          ├─ Conflict Resolution
                          └─ Queue Management
```

**Advantages**:
- **Total Control**: Design exactly what you need, no hidden abstractions
- **Minimal Dependencies**: Only `idb` (~3KB gzipped), no vendor lock-in
- **Deep Learning**: Complete understanding of how everything works
- **Specific Optimization**: Optimize for exact use case, no unused features
- **Backend Integration**: Works seamlessly with existing NestJS backend

**Disadvantages**:
- **Development Time**: 6-7 weeks vs 2-4 weeks for other options
- **Reinventing the Wheel**: Solving problems already solved by libraries
- **Sync Complexity**: Conflict resolution, edge cases (simultaneous updates, deletes)
- **Maintenance Burden**: All responsibility for code, updates, and fixes
- **Testing Surface**: Need to create all tests from scratch, edge cases hard to anticipate

**Best For**: Educational projects, when time isn't critical, teams wanting total control

---

### Option 2: PouchDB + CouchDB (Detailed)

**Description**: PouchDB is a JavaScript database that automatically syncs with CouchDB server. Most mature offline-first solution.

**Architecture**:
```
React App → Repositories → PouchDB (Browser) ←→ Auto-sync ←→ CouchDB (Server)
```

**Advantages**:
- **Automatic Sync**: Bidirectional sync out-of-the-box, integrated conflict resolution
- **Production Proven**: Used in thousands of applications, extensive documentation
- **Fast Development**: 2-3 weeks vs 6-7 weeks for custom
- **Automatic Conflict Resolution**: CouchDB handles conflicts with MVCC
- **Ecosystem**: Plugins like pouchdb-find, pouchdb-authentication

**Disadvantages**:
- **Requires CouchDB Server**: Can't use current NestJS backend
- **Different Paradigm**: NoSQL instead of PostgreSQL, flexible vs rigid schema
- **Large Bundle**: ~145KB gzipped (vs ~3KB for idb)
- **Less Control**: Abstractions hide implementation, hard to customize
- **Infrastructure Complexity**: Need CouchDB hosting, configuration, backups
- **Vendor Lock-in**: Difficult to migrate away from CouchDB ecosystem

**Critical Issue for Gualet**: Already have working NestJS + PostgreSQL backend. Using PouchDB means:
- Maintain two databases (PostgreSQL + CouchDB), OR
- Migrate everything to CouchDB (lose current NestJS backend), OR
- Sync between PostgreSQL and CouchDB (additional complexity)

**Best For**: Projects needing quick sync, teams without existing backend, apps that can use CouchDB as primary DB

---

### Option 3: RxDB (Detailed) ⭐ **CHOSEN**

**Description**: Modern reactive database for JavaScript with offline-first capabilities. Better TypeScript support than PouchDB, more flexible architecture.

**Architecture**:
```
React App → RxDB (Observable) → Replication Plugin (Custom Backend) → NestJS Backend
```

**Advantages**:
- **Backend Compatible**: Works with existing NestJS + PostgreSQL (no migration needed)
- **TypeScript First**: Strong typing out-of-the-box, better DX than PouchDB
- **Reactive (RxJS)**: Queries are Observables, real-time updates, perfect for React
- **Plugin Architecture**: Install only what you need, smaller than PouchDB
- **Multiple Storage Adapters**: IndexedDB, Memory (testing), SQLite (React Native)
- **Flexible Replication**: Works with GraphQL, REST, WebSocket - not tied to CouchDB
- **JSON Schema Validation**: Built-in validation, auto-generated TypeScript types
- **Better Performance**: Query optimizer, automatic indexes, compression

**Disadvantages**:
- **Learning Curve**: RxJS can be complex, reactive programming concepts
- **Documentation**: Fewer examples than PouchDB, smaller community
- **Relatively New**: Less production-proven than PouchDB, API may change
- **Initial Setup**: More configuration than PouchDB, need to define schemas
- **Bundle Size**: ~70KB gzipped (more than custom, less than PouchDB)

**Why Perfect for Gualet**:
- ✅ Existing NestJS backend (no server change needed)
- ✅ TypeScript throughout stack (perfect match)
- ✅ React with reactive state (RxJS Observables fit naturally)
- ✅ Want control without building everything (good balance)
- ✅ Future-proof (works with React Native if needed)

**Code Example**:
```typescript
// Schema definition
const categorySchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    name: { type: 'string' },
    type: { type: 'string', enum: ['income', 'expense'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'type'],
  indexes: ['type', 'createdAt']
};

// Database creation
const db = await createRxDatabase({
  name: 'gualet-db',
  storage: getRxStorageDexie()
});

await db.addCollections({
  categories: { schema: categorySchema }
});

// Reactive queries (perfect for React)
const categories$ = db.categories.find().where('type').eq('expense').$;

// React hook
function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const sub = categories$.subscribe(setCategories);
    return () => sub.unsubscribe();
  }, []);
  return categories;
}

// Custom replication (compatible with NestJS backend)
const replicationState = replicateRxCollection({
  collection: db.categories,
  replicationIdentifier: 'categories-replication',
  pull: {
    async handler(lastCheckpoint) {
      const res = await fetch(`/api/sync/pull?since=${lastCheckpoint}`);
      const data = await res.json();
      return { documents: data.categories, checkpoint: data.checkpoint };
    }
  },
  push: {
    async handler(docs) {
      await fetch('/api/sync/push', {
        method: 'POST',
        body: JSON.stringify({ categories: docs })
      });
    }
  }
});
```

---

### Option 4: Dexie.js + Custom Sync (Detailed)

**Description**: Dexie.js is a friendlier IndexedDB wrapper than `idb`, with simpler syntax. Combine Dexie for local storage with custom sync manager.

**Architecture**:
```
React App → Repositories → Custom Sync Manager → Dexie.js (IndexedDB) + NestJS Backend
```

**Advantages**:
- **Friendlier API**: Simpler syntax than raw IndexedDB or `idb`
- **TypeScript Support**: Typing with generics, auto-complete
- **Moderate Size**: ~20KB gzipped (less than RxDB/PouchDB)
- **Reactive Hooks**: `dexie-react-hooks` for React (similar to RxDB)
- **Sync Control**: Implement your own sync logic, compatible with existing backend
- **Easy Migrations**: Built-in versioning system

**Disadvantages**:
- **Manual Sync**: Must implement all sync logic (conflict resolution, queue management)
- **More Code than RxDB**: No built-in replication, need to build sync manager
- **No Built-in Validation**: Need manual validation (no JSON Schema)

**Effort Estimation**: 4-5 weeks (between custom and RxDB)

**Best For**: Middle ground between custom and RxDB, prefer Dexie API, want reactive hooks but more control

---

### Direct Comparison Matrix

| Criterion | Custom | PouchDB | RxDB ⭐ | Dexie + Custom |
|----------|--------|---------|---------|----------------|
| **Development Time** | 6-7 weeks | 2-3 weeks | 3-4 weeks | 4-5 weeks |
| **Learning Curve** | Medium | Low | Medium-High | Medium |
| **TypeScript Support** | ✅ Total | ⚠️ Basic | ✅ Excellent | ✅ Good |
| **Bundle Size** | ~3KB | ~145KB | ~70KB | ~20KB |
| **Control Level** | ✅ Total | ❌ Limited | ✅ High | ✅ High |
| **NestJS Compatible** | ✅ Yes | ❌ No* | ✅ Yes | ✅ Yes |
| **Reactive Queries** | ❌ Manual | ⚠️ Plugin | ✅ Built-in | ✅ Hooks |
| **Conflict Resolution** | 🔨 Build it | ✅ Automatic | 🔨 Build it | 🔨 Build it |
| **Schema Validation** | 🔨 Build it | ❌ No | ✅ JSON Schema | ❌ No |
| **Production Maturity** | N/A | ✅ High | ⚠️ Medium | ✅ High |
| **Community Size** | N/A | ✅ Large | ⚠️ Medium | ✅ Large |
| **Maintenance** | 😰 High | ✅ Low | ✅ Low | ⚠️ Medium |

*PouchDB requires CouchDB, not directly compatible with PostgreSQL/NestJS

---

### Final Recommendation Rationale

**Why RxDB is the best choice for Gualet:**

1. **Stack Compatibility** (Critical):
   - Works with existing NestJS + PostgreSQL ✅
   - No need to add/migrate to CouchDB ✅
   - TypeScript end-to-end ✅

2. **Development Efficiency**:
   - 3-4 weeks (vs 6-7 for custom) ✅
   - Good balance of features vs control ✅
   - Well-documented custom replication ✅

3. **Technical Fit**:
   - Reactive queries perfect for React ✅
   - JSON Schema validation (like our DTOs) ✅
   - Observable state management ✅

4. **Future-Proof**:
   - Works with React Native (mobile later) ✅
   - Active development ✅
   - Flexible for evolving needs ✅

5. **Acceptable Trade-offs**:
   - ~70KB bundle is reasonable (<100KB target) ✅
   - RxJS learning curve is manageable ✅
   - Custom replication is well-documented ✅

---

## References
- [RxDB Documentation](https://rxdb.info/)
- [RxDB Replication Guide](https://rxdb.info/replication.html)
- [PouchDB Documentation](https://pouchdb.com/)
- [Dexie.js Documentation](https://dexie.org/)
- [IndexedDB API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Offline First Principles](https://offlinefirst.org/)
- [Action Plan](../project/ACTION_PLAN.md)

---

## Notes

**Decision Status**: ✅ **ACCEPTED**

This ADR documents the decision to use RxDB as our offline-first synchronization strategy. The decision was made on December 21, 2025, after careful evaluation of four different approaches.

### Decision Rationale

RxDB was chosen because it:
- Integrates perfectly with our existing NestJS + PostgreSQL backend
- Provides TypeScript support end-to-end
- Offers reactive queries that work seamlessly with React
- Has a reasonable implementation timeline (3-4 weeks)
- Provides a good balance between control and convenience
- Is future-proof and flexible for our evolving needs

### Next Steps

1. ✅ Decision documented in this ADR
2. 🔄 Update ACTION_PLAN.md with RxDB implementation tasks
3. 🔄 Begin Week 1: Setup and Backend Sync Infrastructure
4. 🔄 Install RxDB and define JSON Schemas
5. 🔄 Implement custom replication protocol

### Trade-offs Accepted

- RxJS learning curve (acceptable for the benefits)
- Medium bundle size of ~70KB (within our <100KB target)
- Need to implement custom replication handlers (well-documented)

---

**Last Updated**: 2025-12-21

**Decision Made**: 2025-12-21

**Chosen Solution**: RxDB (Option 3)

