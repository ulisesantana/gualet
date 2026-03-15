---
applyTo: '**'
description: 'Git workflow, branching strategy, and collaboration guidelines'
---

# Git Workflow Instructions

## Overview

This document covers the Git workflow for the Gualet project. For detailed commit message conventions, see [git-commit-instructions.md](../git-commit-instructions.md).

## Branch Naming Convention

### Format

```
<type>/<short-description>
```

### Branch Types

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features | `feature/offline-sync` |
| `fix/` | Bug fixes | `fix/login-redirect-loop` |
| `refactor/` | Code refactoring | `refactor/transaction-service` |
| `test/` | Testing improvements | `test/e2e-categories` |
| `docs/` | Documentation | `docs/api-documentation` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `hotfix/` | Urgent production fixes | `hotfix/security-patch` |

### Examples

```bash
# Feature branches
feature/transaction-filters
feature/user-settings
feature/offline-first

# Bug fix branches
fix/category-deletion-error
fix/payment-method-validation

# Refactor branches
refactor/repository-pattern
refactor/error-handling

# Test branches
test/backend-coverage
test/e2e-transactions

# Documentation branches
docs/update-readme
docs/api-endpoints

# Chore branches
chore/upgrade-nestjs
chore/clean-dependencies
```

## Development Workflow

### 1. Starting New Work

```bash
# 1. Ensure you're on main and it's up to date
git checkout main
git pull origin main

# 2. Create a new branch
git checkout -b feature/my-new-feature

# 3. Verify you're on the correct branch
git branch --show-current
```

### 2. Making Changes

```bash
# 1. Make your changes
# ... edit files ...

# 2. Check what changed
git status
git diff

# 3. Stage changes
git add .
# OR stage specific files
git add path/to/file

# 4. Review staged changes
git diff --staged

# 5. Commit with good message
git commit -m "feat(backend): add transaction filtering"
```

### 3. Before Committing - Quality Checks

```bash
# Run all quality checks
npm run typecheck      # TypeScript compilation
npm run lint           # ESLint
npm run test:backend   # Backend tests
npm run test:frontend  # Frontend tests

# Check test coverage
npm run test:backend:cov   # Should be > 95%
npm run test:frontend:cov  # Should be > 95%

# Optional: Run E2E tests
npm run test:e2e       # Requires Docker
```

### 4. Pushing Changes

```bash
# First time pushing a new branch
git push -u origin feature/my-new-feature

# Subsequent pushes
git push
```

### 5. Pull Request Process

1. **Push your branch** to remote
2. **Create Pull Request** on GitHub
3. **Fill PR template** with:
   - Clear description of changes
   - Why the change was needed
   - Testing performed
   - Screenshots (if UI changes)
4. **Link related issues**: `Closes #123`, `Fixes #456`
5. **Ensure CI passes** (tests, linting, type checking)
6. **Request review** (if working in a team)
7. **Address feedback** and update PR
8. **Squash and merge** to keep clean history

### 6. After Merge

```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local branch
git branch -d feature/my-new-feature

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/my-new-feature
```

## Common Git Commands

### Checking Status

```bash
# See current status
git status

# See what changed
git diff

# See staged changes
git diff --staged

# See commit history
git log --oneline -10
git log --graph --oneline -10
```

### Staging Changes

```bash
# Stage all changes
git add .

# Stage specific file
git add path/to/file

# Stage parts of a file interactively
git add -p path/to/file

# Unstage file
git restore --staged path/to/file

# Discard changes in working directory
git restore path/to/file
```

### Committing

```bash
# Commit with inline message
git commit -m "feat(backend): add feature"

# Commit with editor for multi-line message
git commit

# Amend last commit
git commit --amend

# Amend without changing message
git commit --amend --no-edit
```

### Branching

```bash
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch to existing branch
git checkout main

# Delete local branch
git branch -d feature/old-feature

# Force delete unmerged branch
git branch -D feature/old-feature

# Rename current branch
git branch -m new-branch-name
```

### Syncing

```bash
# Fetch remote changes
git fetch origin

# Pull changes (fetch + merge)
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase origin main

# Push changes
git push origin feature/my-feature

# Force push (DANGEROUS - use with caution)
git push --force-with-lease origin feature/my-feature
```

### Stashing

```bash
# Save work in progress
git stash

# Save with description
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply and remove stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Clear all stashes
git stash clear
```

## Advanced Workflows

### Interactive Rebase

Clean up commits before pushing:

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Interactive rebase from main
git rebase -i main
```

In the editor:
- `pick` - keep commit as is
- `reword` - change commit message
- `squash` - combine with previous commit (keep message)
- `fixup` - combine with previous commit (discard message)
- `drop` - remove commit
- `edit` - pause to modify commit

### Cherry-pick

Apply specific commits to current branch:

```bash
# Cherry-pick single commit
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing
git cherry-pick -n abc123
```

### Resolving Conflicts

```bash
# 1. Pull/merge and encounter conflicts
git pull origin main

# 2. See conflicted files
git status

# 3. Open files and resolve conflicts manually
# Look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# 4. After resolving, stage files
git add path/to/resolved-file

# 5. Continue merge/rebase
git merge --continue
# or
git rebase --continue

# Abort if needed
git merge --abort
git rebase --abort
```

## Git Best Practices

### DO ✅

1. **Commit often** - Small, atomic commits
2. **Pull before push** - Avoid conflicts
3. **Write good commit messages** - Follow conventions
4. **Review before committing** - Use `git diff --staged`
5. **Test before pushing** - Run tests locally
6. **Keep branches updated** - Regularly merge/rebase from main
7. **Delete merged branches** - Keep repository clean
8. **Use meaningful branch names** - Describe what you're working on

### DON'T ❌

1. **Don't commit broken code** - Each commit should be functional
2. **Don't commit secrets** - Use `.env` files
3. **Don't force push to main** - Protect important branches
4. **Don't commit large files** - Use Git LFS if needed
5. **Don't mix unrelated changes** - Keep commits focused
6. **Don't rewrite published history** - Unless absolutely necessary
7. **Don't ignore conflicts** - Resolve them properly
8. **Don't commit without testing** - Run quality checks first

## Gitignore Best Practices

Already configured in `.gitignore`, but remember:

### ✅ Always Ignore

- `.env` files (secrets)
- `node_modules/` (dependencies)
- `dist/`, `build/` (build artifacts)
- `.vscode/`, `.idea/` (IDE configs)
- `*.log` (log files)
- `coverage/` (test coverage)
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)

### ✅ Commit to Repository

- `.env.example` (template for environment variables)
- `package.json`, `package-lock.json` (dependencies)
- Configuration files (`tsconfig.json`, `vite.config.ts`, etc.)
- Source code
- Tests
- Documentation

## Troubleshooting

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Discard All Uncommitted Changes

```bash
# Discard all changes
git reset --hard HEAD

# Discard specific file
git restore path/to/file
```

### Fix Wrong Branch

If you committed to the wrong branch:

```bash
# 1. Note the commit hash
git log --oneline -1

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick abc123

# 4. Go back to wrong branch
git checkout wrong-branch

# 5. Remove the commit
git reset --hard HEAD~1
```

### Recover Deleted Commits

```bash
# Find lost commits
git reflog

# Recover specific commit
git cherry-pick abc123

# Or reset to commit
git reset --hard abc123
```

## Monorepo Considerations

This project is a monorepo with npm workspaces:

```bash
# Work in specific package
cd packages/backend
git add .
git commit -m "feat(backend): add feature"

# Commit affects multiple packages
git add packages/backend packages/shared
git commit -m "feat(backend,shared): add transaction types"

# Always commit from root when possible
cd /path/to/gualet
git add .
git commit -m "chore: update dependencies"
```

## Release Workflow (Future)

When ready for releases:

### Semantic Versioning

Follow [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Creating a Release

```bash
# 1. Update version in package.json
npm version minor  # or major, patch

# 2. Create git tag
git tag -a v1.2.0 -m "Release 1.2.0"

# 3. Push tag
git push origin v1.2.0

# 4. Create GitHub release from tag
# (On GitHub UI or using gh cli)
```

## Commit Message Templates

Create a commit message template:

```bash
# Create template file
cat > ~/.gitmessage << 'EOF'
# <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>
# 
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
# Scopes: backend, frontend, e2e, shared, docs, ci, deps, db, auth, api
EOF

# Configure git to use template
git config --global commit.template ~/.gitmessage
```

## Quick Reference Card

```bash
# Common workflow
git checkout main               # Switch to main
git pull origin main           # Get latest
git checkout -b feature/new    # Create branch
# ... make changes ...
git add .                      # Stage changes
git commit -m "feat: ..."      # Commit
git push -u origin feature/new # Push

# Quality checks before commit
npm run typecheck
npm run lint
npm run test:backend
npm run test:frontend

# Clean up
git checkout main
git pull origin main
git branch -d feature/new
```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**See also**: [git-commit-instructions.md](../git-commit-instructions.md) for detailed commit message conventions.

