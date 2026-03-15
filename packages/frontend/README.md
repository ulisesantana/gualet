# Gualet Frontend

React frontend for Gualet - Personal finance management application.

## 📋 Overview

This is the frontend application for Gualet, built with React 18, TypeScript, and Vite. It provides a modern, responsive interface for managing personal finances.

## 🛠️ Tech Stack

- **React** 18.x - UI library
- **TypeScript** 5.x - Type safety
- **Vite** 5.x - Build tool and dev server
- **Wouter** - Lightweight routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **Testing Library** - React component testing

## 🚀 Quick Start

### Prerequisites
- Node.js v22.17.0 or higher
- Backend running at `http://localhost:5050`

### Installation

```bash
# From project root
npm install

# Or from frontend package
cd packages/frontend
npm install
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Watch mode for development
npm run test:watch

# UI mode for interactive testing
npm run test:ui
```

**Current Coverage:** 72.02% statements (183+ tests passing)

## 🏗️ Architecture

The frontend follows clean architecture principles:

```
src/
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── categories/       # Category management
│   ├── common/           # Shared components and utilities
│   ├── payment-methods/  # Payment method management
│   ├── transactions/     # Transaction management
│   └── user-preferences/ # User settings
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

### Layer Structure (per feature)

- **Application:** Use cases and business logic
- **Domain:** Models and repository interfaces
- **Infrastructure:** Repository implementations and data sources
- **UI:** React components and views

## 📱 Features

### ✅ Implemented
- User authentication (login, register, logout)
- Transaction management (CRUD with filters)
- Category management (CRUD)
- Payment method management (CRUD)
- User preferences
- Responsive design
- Form validation
- Error handling

### 🚧 Coming Soon
- Offline-first functionality with RxDB
- Service Worker for caching
- PWA features (install prompt, offline support)

## 🔒 Security

- Authentication via HttpOnly cookies
- Client-side form validation
- Protected routes with authentication check
- CORS configuration for API requests
- No sensitive data in localStorage

## 📖 API Integration

The frontend communicates with the backend through:

- **Base URL:** `http://localhost:5050/api`
- **Authentication:** Cookie-based sessions
- **HTTP Client:** Axios with interceptors

All API calls are abstracted through repository implementations in the infrastructure layer.

## 🛠️ Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Environment Variables

Create a `.env` file (or use `.env.example`):

```bash
VITE_API_URL=http://localhost:5050
```

## 📚 Documentation

- **Project Documentation:** [../../docs/](../../docs/)
- **Frontend Guidelines:** [../../.github/instructions/FRONTEND.instructions.md](../../.github/instructions/FRONTEND.instructions.md)

## 🎨 Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Maintain >95% test coverage goal

## 📄 License

ISC
