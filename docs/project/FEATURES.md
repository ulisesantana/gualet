# Gualet - Complete Feature Documentation

**Last Updated:** December 29, 2025

This document provides a comprehensive overview of all implemented features in the Gualet application.

---

## 📱 Application Features

### 1. Authentication & User Management

#### Login
- **Route:** `/login`
- **Backend:** `POST /api/auth/login`
- **Features:**
  - Email and password authentication
  - HttpOnly cookie-based session
  - JWT token management
  - Error handling (user not found, invalid credentials)
  - Session persistence

#### Registration
- **Route:** `/register`
- **Backend:** `POST /api/auth/register`
- **Features:**
  - Create new user account
  - Email validation
  - Password hashing (bcrypt)
  - Duplicate user detection
  - Automatic login after registration

#### Logout
- **Backend:** `POST /api/auth/logout`
- **Features:**
  - Clear authentication cookie
  - Session termination
  - Redirect to login page

#### Session Verification
- **Backend:** `POST /api/auth/verify`
- **Features:**
  - Validate JWT token
  - Check session validity
  - Automatic redirect if not authenticated
  - Protected route support

---

### 2. Transaction Management

#### View Transactions
- **Route:** `/` (Home)
- **Backend:** `GET /api/me/transactions`
- **Features:**
  - List recent transactions
  - Filter by date range (`from`, `to`)
  - Filter by category (`categoryId`)
  - Filter by payment method (`paymentMethodId`)
  - Filter by operation type (`INCOME` / `OUTCOME`)
  - Pagination support (`page`, `pageSize`)
  - Sorting by date (ascending/descending)
  - Display transaction details (amount, description, date, category, payment method)
  - Visual distinction between income (green) and expenses (red)

#### Create Transaction
- **Route:** `/` (Home form)
- **Backend:** `POST /api/me/transactions`
- **Features:**
  - Add new income or expense
  - Select operation type (INCOME/OUTCOME)
  - Enter amount (positive number)
  - Add description (required)
  - Select category (filtered by operation type)
  - Select payment method
  - Set transaction date (defaults to today)
  - Form validation:
    - Required: description, amount, category
    - Amount must be > 0
    - Description max 200 characters
  - Real-time category filtering based on operation type
  - Automatic user association

#### Edit Transaction
- **Route:** `/transactions/details/:id`
- **Backend:** `PATCH /api/me/transactions/:id`
- **Features:**
  - Update existing transaction
  - Modify amount, description, date, category, payment method
  - Same validation as creation
  - Preserve user ownership
  - Show current values in form

#### Delete Transaction
- **Backend:** `DELETE /api/me/transactions/:id`
- **Features:**
  - Remove transaction
  - User ownership validation
  - Immediate update of transaction list

#### Transaction Details View
- **Route:** `/transactions/details/:id`
- **Backend:** `GET /api/me/transactions/:id`
- **Features:**
  - View complete transaction information
  - Edit option
  - Delete option
  - Navigation back to transactions list

---

### 3. Category Management

#### View Categories
- **Route:** `/categories`
- **Backend:** `GET /api/me/categories`
- **Features:**
  - List all user categories
  - Grouped by type (Income/Expense)
  - Display category icon and name
  - Visual color coding
  - Navigation to category details
  - Add new category button

#### Create Category
- **Route:** `/categories/add`
- **Backend:** `POST /api/me/categories`
- **Features:**
  - Add new income or expense category
  - Select category type (INCOME/OUTCOME)
  - Enter category name (required, unique per type)
  - Select icon from emoji picker
  - Choose category color
  - Form validation:
    - Required: name, type
    - Name max 50 characters
    - Unique name per user per type
  - Automatic user association

#### Edit Category
- **Route:** `/categories/details/:id`
- **Backend:** `PATCH /api/me/categories/:id`
- **Features:**
  - Update category name
  - Change category icon
  - Modify category color
  - Cannot change category type (to preserve transaction consistency)
  - Duplicate name validation (per type)
  - User ownership validation

#### Delete Category
- **Route:** `/categories/details/:id`
- **Backend:** `DELETE /api/me/categories/:id`
- **Features:**
  - Remove category
  - Conflict detection (prevents deletion if category has transactions)
  - User ownership validation
  - Confirmation dialog
  - Automatic redirect after deletion

#### Category Details View
- **Route:** `/categories/details/:id`
- **Backend:** `GET /api/me/categories/:id`
- **Features:**
  - View category information
  - Edit option
  - Delete option (with validation)
  - Navigation back to categories list

---

### 4. Payment Methods Management

#### View Payment Methods
- **Route:** `/payment-methods`
- **Backend:** `GET /api/me/payment-methods`
- **Features:**
  - List all user payment methods
  - Display payment method icon and name
  - Visual color coding
  - Navigation to payment method details
  - Add new payment method button

#### Create Payment Method
- **Route:** `/payment-methods/add`
- **Backend:** `POST /api/me/payment-methods`
- **Features:**
  - Add new payment method
  - Enter payment method name (required)
  - Select icon from emoji picker
  - Choose color
  - Form validation:
    - Required: name
    - Name max 50 characters
  - Automatic user association

#### Edit Payment Method
- **Route:** `/payment-methods/details/:id`
- **Backend:** `PATCH /api/me/payment-methods/:id`
- **Features:**
  - Update payment method name
  - Change icon
  - Modify color
  - User ownership validation

#### Delete Payment Method
- **Route:** `/payment-methods/details/:id`
- **Backend:** `DELETE /api/me/payment-methods/:id`
- **Features:**
  - Remove payment method
  - Conflict detection (prevents deletion if payment method has transactions)
  - User ownership validation
  - Confirmation dialog
  - Automatic redirect after deletion

#### Payment Method Details View
- **Route:** `/payment-methods/details/:id`
- **Backend:** `GET /api/me/payment-methods/:id`
- **Features:**
  - View payment method information
  - Edit option
  - Delete option (with validation)
  - Navigation back to payment methods list

---

### 5. Reports & Analytics

#### Reports View
- **Route:** `/reports`
- **Features:**
  - Financial summary
  - Visual charts and graphs
  - Category-based expense breakdown
  - Income vs Expense comparison
  - Period selection
  - Export options (planned)

---

### 6. User Preferences

#### User Settings
- **Route:** `/settings`
- **Backend:** 
  - `GET /api/me/preferences`
  - `PUT /api/me/preferences`
- **Features:**
  - Set default payment method
  - Manage user preferences
  - Access to categories management
  - Access to payment methods management
  - Logout option

---

## 🔧 Technical Features

### Backend API

#### Health Check
- **Endpoint:** `GET /api/health`
- **Public:** Yes (no authentication required)
- **Purpose:** Check API availability

#### API Documentation
- **Endpoint:** `GET /api/docs`
- **Public:** Yes
- **Features:**
  - Swagger/OpenAPI documentation
  - Interactive API testing
  - Request/response examples
  - Authentication documentation

### Security Features

1. **Authentication:**
   - JWT-based authentication
   - HttpOnly cookies (XSS protection)
   - Secure password hashing (bcrypt, 10 salt rounds)
   - Session validation on protected routes

2. **Authorization:**
   - User ownership validation
   - Protected endpoints (require authentication)
   - Resource-level access control

3. **Input Validation:**
   - DTO validation (class-validator)
   - UUID validation for IDs
   - Length constraints
   - Type checking
   - Required field validation

4. **Data Protection:**
   - User data isolation
   - Conflict detection (prevent deletion of resources in use)
   - Transaction integrity

### Data Persistence

1. **Database:**
   - PostgreSQL with TypeORM
   - Database migrations
   - Foreign key constraints
   - Automatic timestamps (createdAt, updatedAt)

2. **Database Seeding:**
   - Test user creation
   - Default categories (income and expense)
   - Default payment methods
   - Script: `npm run db:seed -w @gualet/backend`

3. **Database Management:**
   - Reset script: `./scripts/db-reset.sh`
   - Clean database: `npm run db:clean -w @gualet/backend`
   - Migration system

---

## 📊 Testing Coverage

### Backend Tests
- **Test Files:** 22 test suites
- **Total Tests:** 190 tests
- **Coverage:**
  - Statements: 99.62%
  - Functions: 97.97%
  - Lines: 99.6%
  - Branches: 92.99%
- **Command:** `npm run test:backend:cov`

### Frontend Tests
- **Test Files:** 47 test suites
- **Total Tests:** 183 tests
- **Coverage:**
  - Statements: 72.02%
  - Branches: 90.63%
  - Functions: 76.87%
  - Lines: 72.02%
- **Note:** All tests passing, but coverage is below the 95% target
- **Command:** `npm run test:frontend`

### E2E Tests
- **Test Files:** 6 test suites
- **Total Tests:** 45 tests
- **Active Tests:** 24 tests (21 intentionally skipped)
- **Passing:** 24/24 (100%)
- **Suites:**
  - Login: 5/5 ✅
  - Register: 2/2 ✅
  - Categories: 9/9 ✅
  - Transactions: 8/8 ✅
  - Payment Methods: 0/10 (skipped)
  - Network Errors: 0/9 (skipped)
- **Command:** `npm run test:e2e`

---

## 🚀 Development Scripts

### Setup & Installation
```bash
npm run setup                    # Complete project setup
npm install                      # Install dependencies
npm run dependencies:restart     # Clean reinstall all dependencies
```

### Development
```bash
npm run dev                      # Start backend and frontend together
npm run dev:backend             # Start backend only (port 5050)
npm run dev:frontend            # Start frontend only (port 3000)
npm run dev:shared              # Start shared package in watch mode
```

### Database Management
```bash
npm run db:dev:up               # Start PostgreSQL (Docker)
npm run db:dev:down             # Stop PostgreSQL
npm run db:dev:seed             # Seed database with test data
npm run db:dev:clean            # Clean database
npm run db:reset                # Reset and reseed database
```

### Testing
```bash
npm test                        # Run all tests
npm run test:backend            # Run backend tests
npm run test:backend:cov        # Backend tests with coverage
npm run test:frontend           # Run frontend tests
npm run test:frontend:cov       # Frontend tests with coverage
npm run test:e2e                # Run E2E tests
npm run test:e2e:ui             # Run E2E tests with UI
```

### Type Checking
```bash
npm run typecheck               # Check all packages
npm run typecheck:backend       # Check backend only
npm run typecheck:frontend      # Check frontend only
npm run typecheck:shared        # Check shared only
npm run typecheck:e2e           # Check E2E tests only
```

### Build
```bash
npm run build                   # Build all packages for production
```

### Backend Specific
```bash
# In packages/backend/
npm run dev                     # Start in development mode
npm run start:prod              # Start in production mode
npm run migration:generate      # Generate new migration
npm run migration:run           # Run pending migrations
npm run migration:revert        # Revert last migration
npm run lint                    # Lint code
npm run format                  # Format code with Prettier
```

### Frontend Specific
```bash
# In packages/frontend/
npm run dev                     # Start development server
npm run build                   # Build for production
npm run serve                   # Preview production build
npm run lint                    # Lint code
npm run storybook               # Start Storybook
npm run build-storybook         # Build Storybook
```

### E2E Specific
```bash
# In packages/e2e/
npm run db:test:up              # Start test database
npm run db:test:down            # Stop test database
npm run env:start               # Start E2E environment
npm test                        # Run tests
npm run test:ui                 # Run tests with UI
```

---

## 🏗️ Architecture

### Backend Architecture
```
Controller → Service → Repository → Database
     ↓          ↓          ↓
   DTOs    Business    TypeORM
           Logic       Entities
```

**Layers:**
- **Controllers:** HTTP endpoints, request/response handling
- **Services:** Business logic, orchestration
- **Repositories:** Data access layer
- **DTOs:** Data transfer objects with validation
- **Entities:** TypeORM database models
- **Guards:** Authentication and authorization

### Frontend Architecture
```
View → Use Case → Repository → Data Source → API
  ↓       ↓           ↓            ↓
 UI    Business   Interface    HTTP Client
      Logic
```

**Layers:**
- **Views:** Page components
- **Components:** Reusable UI elements
- **Use Cases:** Application business logic
- **Repositories:** Data access interfaces
- **Data Sources:** HTTP implementation (Axios)
- **Stores:** State management (Zustand)

---

## 🔮 Planned Features (Not Yet Implemented)

### Offline-First Functionality
- RxDB integration (see ADR-0003)
- Local data persistence (IndexedDB)
- Background synchronization
- Conflict resolution
- Offline transaction creation
- Sync status indicators

### Additional Features
- Data export (CSV, PDF)
- Data import
- Multi-currency support
- Budgets and goals
- Notifications
- Advanced charts
- Transaction tags
- Advanced search
- Password recovery
- Account deletion (GDPR compliance)

---

## 📚 Documentation

- **Getting Started:** `docs/GETTING_STARTED.md`
- **Project Status:** `docs/project/STATUS.md`
- **Action Plan:** `docs/project/ACTION_PLAN.md`
- **API Design:** `docs/project/API_DESIGN.md`
- **Quick Reference:** `docs/project/QUICK_REFERENCE.md`
- **Changelog:** `docs/project/CHANGELOG.md`
- **Architecture Decisions:** `docs/adr/`
- **GDPR Compliance:** `docs/compliance/`

---

## 🎯 Current Status

✅ **Backend:** 100% Complete (190 tests, 99.62% coverage)  
✅ **Frontend:** 100% Complete (183 tests, 72.02% coverage)  
✅ **E2E Tests:** 100% Complete (24/24 active tests)  
⏳ **Offline-First:** 0% (Next milestone - RxDB implementation)

**The application is fully functional and production-ready for online use.**

**Note:** Frontend test coverage (72.02%) is below the ideal 95% target. Main areas needing improvement:
- Zustand stores (useCategoryStore, usePaymentMethodStore): ~22% coverage
- Some UI components and views: varying coverage
- Business logic (use cases) already has excellent coverage (mostly 100%)

