# Getting Started Guide for New Developers

Welcome to **Gualet** - your offline-first personal expense tracking application.

This guide will help you set up your local development environment in just a few minutes.

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- **Node.js** v22.17.0 or higher ([download](https://nodejs.org/))
- **npm** v10 or higher (comes with Node.js)
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop/))
- **Git** ([download](https://git-scm.com/))

### Verify Installation

```bash
node --version  # should show v22.17.0 or higher
npm --version   # should show v10.x.x or higher
docker --version # should show Docker version 20.x.x or higher
git --version   # should show git version 2.x.x or higher
```

---

## 🚀 Quick Setup (5 minutes)

### Option 1: Automated Script ⚡ (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd gualet

# 2. Run the setup script
npm run setup

# 3. Start the complete environment
npm run dev:all
```

**Done!** Your application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5050
- **API Docs:** http://localhost:5050/api/docs

---

### Option 2: Step-by-Step Manual Setup

If you prefer to understand each step or the automated script fails:

#### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd gualet
```

#### 2️⃣ Install Dependencies

```bash
# Install all monorepo dependencies
npm install
```

This will install dependencies for:
- 📦 Shared packages (`shared`)
- 🔧 Backend (`packages/backend`)
- 🎨 Frontend (`packages/frontend`)
- 🧪 E2E Tests (`packages/e2e`)

#### 3️⃣ Configure Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
```

**Note:** The `.env.example` files already have default values for development. You don't need to modify them unless you want to customize something.

#### 4️⃣ Start the Database

```bash
# Start PostgreSQL in Docker
docker compose up -d
```

Verify it's running:
```bash
docker ps
# You should see a container named 'postgres' running
```

#### 5️⃣ Run Migrations

```bash
# Create tables in the database
npm run migration:run -w @gualet/backend
```

#### 6️⃣ Start the Backend

```bash
# Terminal 1: Backend
npm run dev -w @gualet/backend
```

Wait to see:
```
🌱 Running database seeders...
   ✓ Test user created: test@gualet.app / test1234
   ✓ Created 10 default categories
   ✓ Created 5 default payment methods
   ✓ Created 20 sample transactions
✅ Database seeding completed

🚀 Application is running on: http://localhost:5050
```

#### 7️⃣ Start the Frontend

```bash
# Terminal 2: Frontend
npm run dev -w @gualet/frontend
```

Wait to see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 8️⃣ Open the Application

Open your browser at: **http://localhost:5173**

**Test credentials:**
```
Email:    test@gualet.app
Password: test1234
```

---

## 🎯 Useful Commands

### Development

```bash
# Start everything (backend + frontend + DB)
npm run dev:all

# Backend only
npm run dev -w @gualet/backend

# Frontend only
npm run dev -w @gualet/frontend

# View database logs
docker compose logs -f postgres
```

### Tests

```bash
# All tests
npm test

# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend

# E2E tests (requires backend and frontend running)
npm run test:e2e

# Tests with coverage
npm run test:backend:cov
npm run test:frontend:cov
```

### Database

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# View logs
docker compose logs -f

# Reset database (warning! deletes all data)
npm run db:reset

# Run migrations
npm run migration:run -w @gualet/backend

# Create test data
npm run db:seed -w @gualet/backend
```

### Code Quality

```bash
# Check TypeScript types
npm run typecheck

# Run linter
npm run lint

# Format code
npm run format
```

---

## 📁 Project Structure

```
gualet/
├── packages/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/           # JWT Authentication
│   │   │   ├── categories/     # Category management
│   │   │   ├── payment-methods/# Payment methods
│   │   │   ├── transactions/   # Transactions
│   │   │   └── db/             # Database and seeders
│   │   └── test/
│   │
│   ├── frontend/         # React + Vite App
│   │   ├── src/
│   │   │   ├── application/    # Use cases
│   │   │   ├── domain/         # Domain models
│   │   │   └── infrastructure/ # UI, repos, HTTP
│   │   └── test/
│   │
│   ├── e2e/              # Playwright Tests
│   │   ├── tests/
│   │   ├── pages/              # Page Object Model
│   │   └── helpers/
│   │
│   └── shared/           # Shared types and utilities
│       └── src/
│           └── domain/
│
├── docs/                 # Project documentation
├── scripts/              # Utility scripts
└── docker-compose.yaml   # Docker configuration
```

---

## 🔐 Test User

The backend automatically creates a test user with sample data:

**Credentials:**
```
Email:    test@gualet.app
Password: test1234
```

**Includes:**
- ✅ 10+ default categories
- ✅ 5 payment methods
- ✅ 20 sample transactions

See more details in: [`DEVELOPMENT_TEST_USER.md`](../DEVELOPMENT_TEST_USER.md)

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Verify Docker is running
docker ps

# If no containers, start the DB
docker compose up -d

# Wait 5 seconds and try again
npm run dev -w @gualet/backend
```

---

### Frontend shows CORS error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Verify backend is running at `http://localhost:5050`
2. Verify `packages/frontend/.env` has:
   ```
   VITE_API_URL=http://localhost:5050
   ```
3. Restart the frontend

---

### Migrations fail

**Error:** `QueryFailedError: relation "users" already exists`

**Solution:**
```bash
# Tables already exist, no need to run migrations again
# If you want to start fresh:
npm run db:reset
npm run migration:run -w @gualet/backend
```

---

### Can't login

**Problem:** Credentials `test@gualet.app / test1234` don't work

**Solution:**
```bash
# Verify seeders ran
# You should see in backend logs:
# "✓ Test user created: test@gualet.app / test1234"

# If not, run manually:
npm run db:seed -w @gualet/backend
```

---

### E2E tests fail

**Error:** `Error: browserType.launch: Executable doesn't exist`

**Solution:**
```bash
# Install Playwright browsers
npx playwright install
```

---

### Docker takes too much space

**Solution:**
```bash
# Clean unused containers and images
docker system prune -a

# Clean volumes only
docker volume prune
```

---

## 📚 Additional Resources

### Project Documentation

- 📖 [Action Plan](../docs/project/ACTION_PLAN.md) - Project roadmap
- 🔌 [API Design](../docs/project/API_DESIGN.md) - API design
- 🧪 [Testing Guide](../.github/instructions/TESTS.instructions.md) - Testing guide
- 🔒 [Security Guide](../.github/instructions/SECURITY.instructions.md) - Best practices
- 📝 [Git Workflow](../.github/instructions/GIT.instructions.md) - Git workflow

### API Documentation

With the backend running, visit:
- **Swagger UI:** http://localhost:5050/api/docs
- Interactive documentation of all endpoints
- Test APIs directly from the browser

### Code Guides

- [Backend Instructions](../.github/instructions/BACKEND.instructions.md)
- [Frontend Instructions](../.github/instructions/FRONTEND.instructions.md)
- [E2E Instructions](../.github/instructions/E2E.instructions.md)

---

## 🎨 Technology Stack

### Backend
- **Framework:** NestJS 11.x
- **Database:** PostgreSQL 16
- **ORM:** TypeORM
- **Authentication:** JWT + Passport
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Routing:** Wouter (lightweight)
- **HTTP:** Fetch API
- **Styles:** Pure CSS
- **Testing:** Vitest + Testing Library

### Testing
- **Unit:** Jest (backend) + Vitest (frontend)
- **E2E:** Playwright
- **Coverage:** > 95% required

---

## 🤝 Workflow

### 1. Create a Feature

```bash
# 1. Create a branch from main
git checkout main
git pull origin main
git checkout -b feature/my-new-feature

# 2. Develop the feature
# ... make your changes ...

# 3. Run tests
npm run typecheck
npm run lint
npm run test:backend
npm run test:frontend

# 4. Commit (follow Conventional Commits)
git add .
git commit -m "feat(backend): add export endpoint"

# 5. Push
git push -u origin feature/my-new-feature

# 6. Create Pull Request on GitHub
```

### 2. Conventional Commits

Use the format:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Add or modify tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(frontend): add reports view
fix(backend): fix date validation
docs: update setup guide
test(e2e): add transaction tests
```

---

## 🎯 Next Steps

Now that you have everything set up:

1. ✅ **Explore the application**
   - Login with `test@gualet.app / test1234`
   - Navigate through different sections
   - Create, edit, and delete data

2. ✅ **Read the documentation**
   - Review the [Action Plan](../docs/project/ACTION_PLAN.md)
   - Familiarize yourself with the [API](http://localhost:5050/api/docs)
   - Read the [testing](../.github/instructions/TESTS.instructions.md) guides

3. ✅ **Run the tests**
   - Make sure all pass: `npm test`
   - Check coverage: `npm run test:backend:cov`

4. ✅ **Make your first change**
   - Pick a small issue
   - Create a feature branch
   - Implement the solution with tests
   - Create a Pull Request

---

## 💬 Getting Help

If you have problems or questions:

1. **Review this guide** - The solution is probably here
2. **Check the documentation** - In `/docs` and `/.github/instructions`
3. **Review the issues** - Maybe someone already solved the problem
4. **Ask the team** - We're here to help

---

## ✅ Setup Checklist

Use this list to verify everything is configured:

- [ ] Node.js v22+ installed
- [ ] Docker Desktop installed and running
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Database running (`docker compose up -d`)
- [ ] Migrations executed
- [ ] Backend started and seeders executed
- [ ] Frontend started
- [ ] Application accessible at http://localhost:5173
- [ ] Successful login with test user
- [ ] Tests passing (`npm test`)

---

**Happy coding! 🚀**

If you find any issues with this guide or have suggestions to improve it, please open an issue.
