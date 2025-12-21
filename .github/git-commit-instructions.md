# Git Commit Instructions

## Conventional Commits Format

This project follows the **Conventional Commits** specification for clear, structured, and automated-friendly commit history.

### Basic Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Rules

1. **Type**: MUST be lowercase
2. **Scope**: MUST be lowercase, use kebab-case for multi-word scopes
3. **Subject**: 
   - MUST be lowercase
   - MUST use imperative mood ("add" not "added" or "adds")
   - MUST NOT end with a period
   - MUST be concise (max 72 characters for full commit message)
4. **Body**: Optional, use to explain WHAT and WHY (not HOW)
5. **Footer**: Optional, reference issues/PRs

## Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(backend): add transaction filtering` |
| `fix` | Bug fix | `fix(frontend): resolve login redirect loop` |
| `docs` | Documentation only | `docs(readme): update installation steps` |
| `style` | Code style (formatting, semicolons, etc.) | `style(backend): format with prettier` |
| `refactor` | Code refactoring | `refactor(frontend): extract useTransactions hook` |
| `perf` | Performance improvement | `perf(backend): optimize transaction queries` |
| `test` | Add/update tests | `test(e2e): add category CRUD tests` |
| `build` | Build system/dependencies | `build(deps): update nestjs to 11.0.2` |
| `ci` | CI/CD changes | `ci(github): add test workflow` |
| `chore` | Other changes (maintenance) | `chore(deps): update dependencies` |
| `revert` | Revert previous commit | `revert: feat(backend): add filtering` |

## Scopes

Common scopes in this project:

| Scope | Usage |
|-------|-------|
| `backend` | Backend changes (NestJS, TypeORM, API) |
| `frontend` | Frontend changes (React, UI, views) |
| `e2e` | E2E tests (Playwright) |
| `shared` | Shared package changes |
| `docs` | Documentation files |
| `ci` | CI/CD configuration |
| `deps` | Dependencies updates |
| `db` | Database migrations/schema |
| `auth` | Authentication/authorization |
| `api` | API-specific changes |

### Multiple Scopes

For changes affecting multiple areas:

```bash
feat(backend,frontend): implement user preferences
```

### No Scope

When change affects the whole project or is general:

```bash
chore: update dependencies
docs: update readme
```

## Examples

### ✅ Good Commits

```bash
# Feature
feat(backend): add DELETE endpoint for categories
feat(frontend): implement offline sync manager
feat(shared): add transaction filter types

# Bug fix
fix(frontend): resolve category dropdown not loading
fix(backend): correct transaction date validation
fix(e2e): update login test selectors

# Documentation
docs(readme): add offline-first setup guide
docs(api): document transaction filters
docs(instructions): add backend guidelines

# Tests
test(backend): add transaction service unit tests
test(frontend): add category form validation tests
test(e2e): add payment method CRUD tests

# Refactoring
refactor(frontend): extract transaction repository
refactor(backend): simplify error handling
refactor(shared): consolidate response types

# Chore/Maintenance
chore(deps): update @nestjs/core to 11.0.2
chore(backend): clean up unused imports
chore: remove core package

# Performance
perf(backend): optimize database queries with indexes
perf(frontend): implement virtual scrolling for transactions

# Build
build(docker): update postgres to version 16
build(vite): configure PWA plugin

# CI/CD
ci(github): add automated testing workflow
ci(playwright): configure test database
```

### ❌ Bad Commits

```bash
# Too vague
fix: bug fixes
update: changes
WIP
fixed stuff

# Wrong format
Fix: Login bug          # Type should be lowercase
feat(Backend): new API  # Scope should be lowercase
Added new feature.      # Use imperative, no period
FEAT: new endpoint      # Type must be lowercase

# Not descriptive
fix: fix
update: update code
chore: changes
```

## Breaking Changes

For backwards-incompatible changes, add `!` after type/scope:

```bash
feat(backend)!: change transaction API response format

BREAKING CHANGE: Transaction API now returns timestamps in ISO format instead of Unix timestamps.
```

## Commit Message Body

Use body to explain:
- **What** changed
- **Why** it changed
- **Any side effects** or important notes

```bash
feat(backend): implement transaction pagination

Add pagination support to transaction endpoints to improve
performance with large datasets. Default page size is 50,
maximum is 100.

Closes #123
```

## Footer Conventions

### Reference Issues/PRs

```bash
Closes #123
Fixes #456
Refs #789
Related to #321
```

### Breaking Changes

```bash
BREAKING CHANGE: API endpoint URLs have changed from /api/v1 to /api/v2
```

## Multi-line Commits

Use git editor for multi-line commits:

```bash
git commit
```

Then write:
```
feat(backend): add transaction export feature

Implement CSV and JSON export for transactions. Users can
export filtered transactions with all associated data
including category and payment method information.

Features:
- CSV format export
- JSON format export
- Apply current filters to export
- Include related entity data

Closes #234
```

## Commit Best Practices

### DO ✅

- **Keep commits atomic** - One logical change per commit
- **Write clear messages** - Others should understand without seeing the code
- **Use imperative mood** - "add feature" not "added feature"
- **Reference issues** - Link to relevant issues/PRs
- **Test before committing** - Ensure tests pass
- **Review your changes** - Use `git diff --staged`

### DON'T ❌

- **Mix unrelated changes** - Keep commits focused
- **Commit broken code** - Each commit should be functional
- **Write vague messages** - "fix bug" doesn't help anyone
- **Commit secrets** - Check for API keys, passwords, etc.
- **Forget to test** - Run tests before committing

## Pre-commit Checklist

Before committing, ensure:

```bash
# 1. Type check passes
npm run typecheck

# 2. Linting passes
npm run lint

# 3. Tests pass
npm run test:backend
npm run test:frontend

# 4. No secrets committed
git diff --staged | grep -i "password\|secret\|key"

# 5. Review changes
git diff --staged
```

## Amending Commits

### Fix last commit message

```bash
git commit --amend -m "feat(backend): correct commit message"
```

### Add forgotten files to last commit

```bash
git add forgotten-file.ts
git commit --amend --no-edit
```

## Interactive Rebase (Clean History)

Clean up commits before pushing:

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Options:
# pick   - keep commit as is
# reword - change commit message
# squash - combine with previous commit
# fixup  - like squash but discard message
# drop   - remove commit
```

## Commit Hooks (Future Enhancement)

Consider setting up Husky for automated checks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run typecheck",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test"
    }
  }
}
```

## Quick Reference

```bash
# Feature
git commit -m "feat(backend): add user authentication"

# Bug fix
git commit -m "fix(frontend): resolve navigation issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Tests
git commit -m "test(e2e): add login flow tests"

# Refactor
git commit -m "refactor(backend): simplify transaction service"

# Chore
git commit -m "chore(deps): update dependencies"

# Breaking change
git commit -m "feat(api)!: change response format"
```

## Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

---

**Remember**: Good commit messages are documentation for your future self and your team. Take the time to write them well! 📝

