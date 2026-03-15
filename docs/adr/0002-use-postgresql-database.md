# 0002. Use PostgreSQL as Primary Database

**Status**: accepted

**Date**: 2025-12-21

**Deciders**: Ulises Santana

---

## Context

After deciding to migrate from Supabase to a custom backend, we needed to choose a database system that would support our data requirements for a personal finance management application.

### Problem Statement

We needed a database that would:
- Store relational data (users, categories, transactions, payment methods)
- Support transactions and ACID properties
- Integrate well with NestJS and TypeORM
- Provide good performance for read-heavy operations
- Be reliable and well-supported
- Easy to set up for development (Docker)

### Requirements

- Relational data model support
- ACID compliance
- Good performance
- TypeScript/TypeORM integration
- Open source
- Easy local development setup
- Production-ready

---

## Decision

We chose **PostgreSQL** as our primary database.

### Chosen Solution

PostgreSQL is an open-source, object-relational database system with strong ACID compliance, excellent TypeORM integration, and robust feature set.

### Implementation Details

- Database: PostgreSQL 14+
- ORM: TypeORM (integrates natively with NestJS)
- Development: Docker container
- Migrations: TypeORM migration system
- Connection: Connection pooling via TypeORM

**Database Schema:**
- Users (authentication and preferences)
- Categories (income and expense categories)
- PaymentMethods (payment methods)
- Transactions (financial transactions)
- UserPreferences (user settings)

---

## Alternatives Considered

### Option 1: MySQL/MariaDB

**Pros:**
- Very popular and well-documented
- Good performance
- Wide hosting support
- TypeORM compatible

**Cons:**
- Less advanced features than PostgreSQL
- Weaker support for JSON data types
- Less strict with data integrity

**Estimated Effort**: Same as PostgreSQL

### Option 2: MongoDB

**Pros:**
- Flexible schema
- Good for rapid prototyping
- Horizontal scaling
- Popular in Node.js ecosystem

**Cons:**
- NoSQL (not ideal for relational data like transactions)
- No ACID transactions (in older versions)
- Overkill for our use case
- Less ideal for complex queries

**Estimated Effort**: Similar but different paradigm

### Option 3: SQLite

**Pros:**
- Simple setup
- No server needed
- Perfect for development
- Very lightweight

**Cons:**
- Not ideal for production multi-user scenarios
- No concurrent writes
- Limited in production environments
- Not scalable

**Estimated Effort**: Less setup, but migration to production DB needed later

### Option 4: Keep CouchDB (if using PouchDB)

**Pros:**
- Perfect sync with PouchDB
- Built for offline-first
- Automatic replication

**Cons:**
- NoSQL (not ideal for our relational data)
- Would require migrating existing PostgreSQL schema
- Different paradigm
- Only makes sense with PouchDB

---

## Consequences

### Positive

- **ACID Compliance**: Strong data integrity guarantees
- **Relational Model**: Perfect for our domain (users, categories, transactions with relationships)
- **TypeORM Integration**: Excellent support in NestJS ecosystem
- **Advanced Features**: JSON support, full-text search, window functions
- **Performance**: Very good query performance with proper indexing
- **Tooling**: pgAdmin, DBeaver, many GUI tools available
- **Open Source**: No licensing costs
- **Community**: Huge community and extensive documentation
- **Migrations**: TypeORM handles schema migrations

### Negative

- **Complexity**: More complex than SQLite for simple use cases
- **Server Required**: Need to run PostgreSQL server (Docker makes this easy)
- **Memory Usage**: Uses more resources than lightweight alternatives

### Neutral

- **SQL Knowledge Required**: Need to understand SQL and relational concepts
- **Schema-based**: Requires predefined schema (good for data integrity, less flexible)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance degradation with large data | Medium | Low | Proper indexing, query optimization, pagination |
| Migration complexity | Low | Low | TypeORM migrations handle schema changes |
| Hosting costs in production | Low | Medium | PostgreSQL has many affordable hosting options |
| Backup/restore complexity | Medium | Low | Regular automated backups, use managed services |

---

## Follow-up Actions

- [x] Set up PostgreSQL in Docker
- [x] Configure TypeORM with NestJS
- [x] Create initial migration
- [x] Implement entities (User, Category, PaymentMethod, Transaction)
- [x] Set up seeding system for development data
- [ ] Configure backup strategy for production
- [ ] Set up monitoring for query performance

---

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS Database Integration](https://docs.nestjs.com/techniques/database)
- [Database Seeding Documentation](../../packages/backend/DATABASE_SEEDING.md)
- [API Design Document](../project/API_DESIGN.md)

---

**Last Updated**: 2025-12-21

