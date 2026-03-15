# 0001. Use NestJS as Backend Framework

**Status**: accepted

**Date**: 2025-12-21

**Deciders**: Ulises Santana

---

## Context

Gualet is a personal finance management application that initially used Supabase as backend. The decision was made to migrate to a custom backend to have more control over the architecture and business logic.

### Problem Statement

We needed to select a backend framework that would:
- Support TypeScript (matching our frontend stack)
- Provide good structure for clean architecture
- Have built-in dependency injection
- Include authentication and authorization mechanisms
- Offer good developer experience
- Have strong community support

### Requirements

- TypeScript support
- RESTful API capabilities
- Database ORM integration
- Authentication/Authorization
- Validation and error handling
- API documentation (OpenAPI/Swagger)
- Testing capabilities
- Scalability

---

## Decision

We chose **NestJS** as our backend framework.

### Chosen Solution

NestJS is a progressive Node.js framework built with TypeScript that uses Express under the hood and provides an opinionated structure based on Angular's architecture.

### Implementation Details

- Framework: NestJS 11.x
- Database: PostgreSQL with TypeORM
- Authentication: JWT with Passport
- Validation: class-validator and class-transformer
- Documentation: Swagger/OpenAPI
- Testing: Jest

---

## Alternatives Considered

### Option 1: Express.js

**Pros:**
- Minimal and flexible
- Huge ecosystem
- Well-known and documented
- Lightweight

**Cons:**
- No built-in structure (need to design architecture)
- No dependency injection out-of-the-box
- More boilerplate code
- Less opinionated (can be a pro or con)

**Estimated Effort**: Similar to NestJS but more setup

### Option 2: Fastify

**Pros:**
- Very fast (faster than Express)
- Modern plugin architecture
- Good TypeScript support
- Schema-based validation

**Cons:**
- Smaller community than Express/NestJS
- Less opinionated structure
- Fewer ready-made integrations

**Estimated Effort**: Similar to NestJS

### Option 3: AdonisJS

**Pros:**
- Full-featured MVC framework
- Built-in ORM (Lucid)
- Excellent TypeScript support
- All-in-one solution

**Cons:**
- Less flexible than NestJS
- Smaller community
- More opinionated (specific way of doing things)
- Less familiar patterns for team

**Estimated Effort**: Less setup but learning curve

---

## Consequences

### Positive

- **Strong TypeScript Support**: First-class TypeScript experience
- **Dependency Injection**: Built-in DI container makes code testable
- **Modular Architecture**: Clear separation of concerns (Controllers, Services, Repositories)
- **Decorators**: Clean syntax for routes, validation, guards
- **Testing**: Excellent testing utilities with Jest
- **Documentation**: Auto-generated Swagger documentation
- **Community**: Large and active community
- **Ecosystem**: Many official and third-party modules

### Negative

- **Learning Curve**: More complex than Express for simple APIs
- **Abstraction**: More "magic" than plain Express
- **Boilerplate**: Some boilerplate code for small features
- **Bundle Size**: Larger than minimal frameworks

### Neutral

- **Opinionated**: Enforces certain patterns (can be good or bad)
- **Angular-like**: Uses similar patterns to Angular (familiar if you know Angular)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Framework becomes unmaintained | High | Low | NestJS has strong community and active development |
| Performance issues with growth | Medium | Low | NestJS is built on top of fast frameworks (Express/Fastify) |
| Team learning curve | Low | Medium | Good documentation and examples available |

---

## Follow-up Actions

- [x] Set up NestJS project structure
- [x] Configure TypeORM with PostgreSQL
- [x] Implement authentication module
- [x] Set up Swagger documentation
- [x] Configure Jest for testing
- [x] Achieve >95% test coverage

---

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [TypeORM Documentation](https://typeorm.io/)
- [Action Plan - Week 0](../project/ACTION_PLAN.md)

---

**Last Updated**: 2025-12-21

