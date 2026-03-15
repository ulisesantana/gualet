# GitHub Copilot Instructions

## 🎯 Project Overview

**Gualet** is an offline-first personal expense tracking application built as a monorepo using npm workspaces.

### Technology Stack

- **Backend:** NestJS 11.x + TypeScript + PostgreSQL + TypeORM
- **Frontend:** React 18.x + TypeScript + Vite + Wouter
- **E2E Tests:** Playwright with Docker containers
- **Monorepo:** npm workspaces

### Project Purpose

Track personal expenses and income to analyze spending patterns and generate reports. The application follows clean architecture principles and is being transformed into a fully offline-first PWA.

## 🌐 Language & Communication

- **Always write code and documentation in English**
- Keep comments clear and concise
- Avoid over-commenting obvious code
- Use descriptive variable and function names

## 📁 Project Structure

```
gualet/
├── packages/
│   ├── backend/          # NestJS API server
│   ├── frontend/         # React web application
│   ├── e2e/             # Playwright E2E tests
│   └── shared/          # Shared types and utilities
├── docs/                # Project documentation
├── .github/
│   └── instructions/    # AI agent instructions
└── docker-compose.yaml  # Development environment
```

## 📋 Detailed Instructions

This project has specialized instruction files for different aspects of development. These files provide detailed guidelines, examples, and checklists.

### Available Instructions

| File | Scope | Purpose |
|------|-------|---------|
| [BACKEND.instructions.md](instructions/BACKEND.instructions.md) | `packages/backend/**` | NestJS development patterns |
| [FRONTEND.instructions.md](instructions/FRONTEND.instructions.md) | `packages/frontend/**` | React development patterns |
| [TESTS.instructions.md](instructions/TESTS.instructions.md) | `**` | Testing standards (>95% coverage) |
| [E2E.instructions.md](instructions/E2E.instructions.md) | `packages/e2e/**` | E2E testing with Playwright |
| [SECURITY.instructions.md](instructions/SECURITY.instructions.md) | `**` | Security best practices |
| [GIT.instructions.md](instructions/GIT.instructions.md) | `**` | Git workflow & commit conventions |
| [DOCUMENTATION.instructions.md](instructions/DOCUMENTATION.instructions.md) | `docs/**` | Documentation standards |

## 💻 Code Generation Guidelines

### General Principles

1. **Follow framework conventions** - NestJS for backend, React hooks for frontend
2. **Use TypeScript strictly** - No `any` types unless absolutely necessary
3. **Include error handling** - Always handle errors gracefully
4. **Validate inputs** - Backend validates everything, frontend validates for UX
5. **Write testable code** - Dependency injection, pure functions
6. **Keep it simple** - Avoid over-engineering

### Code Style

- Use functional components with hooks (React)
- Use dependency injection (NestJS)
- Prefer composition over inheritance
- Follow clean architecture / hexagonal architecture
- Use repository pattern for data access
- Avoid tight coupling

### Testing Requirements

- **Minimum coverage:** 95% (statements, lines, functions)
- **Branch coverage:** 90%+
- Write unit tests for all business logic
- Write E2E tests for critical user journeys
- Mock only at boundaries (HTTP, database)

## 🏗️ Architecture Patterns

### Backend (NestJS)

```
Controller → Service → Repository → Database
     ↓          ↓          ↓
   DTOs    Business    TypeORM
           Logic       Entities
```

- **Controllers:** HTTP endpoints, validation, response formatting
- **Services:** Business logic, orchestration
- **Repositories:** Data access, entity mapping
- **DTOs:** Input/output validation with class-validator

### Frontend (React)

```
View → Hook → Repository → DataSource → API
  ↓      ↓         ↓           ↓
 UI   State    Interface   HTTP/IndexedDB
      Mgmt
```

- **Views:** Page components, routing, layout
- **Components:** Reusable UI elements
- **Hooks:** Shared state and logic
- **Repositories:** Data access abstraction
- **Data Sources:** HTTP client, IndexedDB (future)

## 🧪 Testing Strategy

### Unit Tests

- Test business logic in isolation
- Mock dependencies (repositories, external services)
- Fast, deterministic, independent

### Integration Tests

- Test modules working together
- Use test database or in-memory alternatives
- Test API endpoints end-to-end

### E2E Tests

- Test critical user journeys
- Use Page Object Model pattern
- Run against real browser + Docker database
- Test authentication, CRUD operations, error states

## 🔒 Security Requirements

- **Never commit secrets** - Use `.env` files (in .gitignore)
- **Validate all inputs** - Backend validates everything
- **Use parameterized queries** - TypeORM prevents SQL injection
- **Hash passwords** - bcrypt with salt rounds
- **Secure cookies** - httpOnly, secure, sameSite
- **Rate limiting** - Prevent abuse
- **CORS configuration** - Restrict origins in production

## 🚀 Development Workflow

### Starting Work

1. Create feature branch: `feature/description`
2. Read relevant instruction files
3. Implement feature with tests
4. Run all checks before committing

### Before Committing

```bash
npm run typecheck      # No TypeScript errors
npm run lint           # No linting errors
npm run test:backend   # All backend tests pass
npm run test:frontend  # All frontend tests pass
npm run test:e2e       # E2E tests pass (requires Docker)
```

### Commit Messages

Follow Conventional Commits:

```
feat(backend): add transaction filtering
fix(frontend): resolve login redirect loop
test(e2e): add category CRUD tests
docs: update API documentation
```

## 🛠️ Common Tasks

### Adding a Backend Endpoint

1. Create DTO with validation decorators
2. Add controller method with guards
3. Implement service business logic
4. Add repository method if needed
5. Add Swagger decorators
6. Write unit tests (>95% coverage)
7. Test manually with Swagger UI

### Adding a Frontend Feature

1. Create domain model (if needed)
2. Define repository interface
3. Implement repository with data source
4. Create custom hook (if shared logic)
5. Build UI components
6. Create view component
7. Add route to App.tsx
8. Write unit tests (>95% coverage)
9. Test manually in browser

### Adding E2E Tests

1. Create/update Page Object
2. Create test data helpers
3. Write test with setup/teardown
4. Use semantic locators
5. Use Playwright assertions (auto-retry)
6. Test locally with Docker
7. Ensure test is isolated and independent

## 📝 Documentation

- Update `ACTION_PLAN.md` with progress
- Update `API_DESIGN.md` for API changes
- Add JSDoc comments to public APIs
- Update README files for significant changes
- Keep examples up-to-date with code

## ⚠️ Special Notes

### Shell Commands

- Don't use `2>&1` - makes console output unreadable
- Use clear, single-purpose commands
- Provide context for what each command does

### Monorepo

- Use npm workspace commands: `npm run <script> -w <package>`
- Manage dependencies in correct package
- Shared code goes in `packages/shared`

### Code Snippets

- Ensure snippets are complete and runnable
- Include necessary imports
- Add brief comments for context
- Follow project conventions

## 🎯 Current Focus

The project is currently implementing **offline-first functionality** following the roadmap in `docs/project/ACTION_PLAN.md`. When generating code:

- Consider offline scenarios
- Plan for sync conflicts
- Think about data persistence (IndexedDB)
- Design for eventual consistency

## 📚 Additional Resources

- [Action Plan](../docs/project/ACTION_PLAN.md) - Implementation roadmap
- [API Design](../docs/project/API_DESIGN.md) - API specification
- [Status](../docs/project/STATUS.md) - Current state
- [GDPR Compliance](../docs/compliance/GDPR_COMPLIANCE.md) - Data privacy

---

**Remember:** Quality over speed. Well-tested, secure, maintainable code is always better than fast, buggy code.
