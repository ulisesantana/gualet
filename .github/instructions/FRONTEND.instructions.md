---
applyTo: 'packages/frontend/**'
description: 'Frontend development guidelines for React application'
---

# Frontend Development Instructions

## Technology Stack

- **Framework:** React 18.x
- **Language:** TypeScript 5.x
- **Build Tool:** Vite 5.x
- **Routing:** Wouter 3.x
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library
- **PWA:** vite-plugin-pwa

## Project Structure

```
packages/frontend/src/
├── components/          # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   └── [feature]/       # Feature-specific components
├── views/               # Page components (Login, Transactions, etc.)
├── hooks/               # Custom React hooks
├── infrastructure/      # Data access layer
│   ├── data-sources/    # HTTP clients, IndexedDB (future)
│   └── repositories/    # Repository implementations
├── domain/              # Business logic & models
│   ├── models/          # Domain models
│   ├── repositories/    # Repository interfaces
│   └── use-cases/       # Business use cases
├── utils/               # Utility functions
├── styles/              # Global styles
└── App.tsx              # Main application component
```

## Architecture

### Clean Architecture / Hexagonal Architecture

The frontend follows clean architecture principles:

1. **Domain Layer** (innermost)
   - Models: Plain TypeScript classes/interfaces
   - Repository Interfaces: Define contracts
   - Use Cases: Business logic (optional, can be in views)

2. **Infrastructure Layer**
   - Repository Implementations: Actual data fetching
   - Data Sources: HTTP clients, local storage
   - External service integrations

3. **Presentation Layer** (outermost)
   - Views: Page components
   - Components: UI components
   - Hooks: State management

**Dependency Rule:** Inner layers never depend on outer layers.

## Code Conventions

### Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use TypeScript interfaces for props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

### Views (Pages)

- Views are full-page components
- Handle routing, layout, and orchestration
- Use repositories for data access
- Manage loading and error states

```typescript
export function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repository = new TransactionRepositoryImplementation();

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setIsLoading(true);
      const data = await repository.findAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Transactions</h1>
      <TransactionList transactions={transactions} />
    </div>
  );
}
```

### Custom Hooks

- Start with `use` prefix
- Encapsulate reusable logic
- Return values and functions in an object or tuple

```typescript
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const repository = useMemo(() => 
    new TransactionRepositoryImplementation(), 
    []
  );

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    const data = await repository.findAll();
    setTransactions(data);
    setIsLoading(false);
  }, [repository]);

  const createTransaction = useCallback(async (dto: CreateTransactionDto) => {
    const newTransaction = await repository.create(dto);
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  }, [repository]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    isLoading,
    loadTransactions,
    createTransaction,
  };
}
```

### Domain Models

- Plain TypeScript classes or interfaces
- No dependencies on external libraries
- Include validation logic if needed

```typescript
export class Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  paymentMethodId: string;

  constructor(data: TransactionData) {
    this.id = data.id;
    this.amount = data.amount;
    this.description = data.description;
    this.date = new Date(data.date);
    this.categoryId = data.categoryId;
    this.paymentMethodId = data.paymentMethodId;
  }

  isExpense(): boolean {
    return this.amount < 0;
  }

  isIncome(): boolean {
    return this.amount > 0;
  }
}
```

### Repository Pattern

**Interface (in domain/repositories/):**
```typescript
export interface TransactionRepository {
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  create(dto: CreateTransactionDto): Promise<Transaction>;
  update(id: string, dto: UpdateTransactionDto): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
```

**Implementation (in infrastructure/repositories/):**
```typescript
export class TransactionRepositoryImplementation implements TransactionRepository {
  private dataSource: HttpDataSource;

  constructor() {
    this.dataSource = new HttpDataSource();
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const response = await this.dataSource.get<TransactionResponse[]>(
      '/api/me/transactions',
      { params: filters }
    );
    return response.data.map(dto => new Transaction(dto));
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const response = await this.dataSource.post<TransactionResponse>(
      '/api/me/transactions',
      dto
    );
    return new Transaction(response.data);
  }

  // ... other methods
}
```

### Data Sources

**HTTP Data Source (using Axios):**
```typescript
export class HttpDataSource {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      withCredentials: true, // For cookie-based auth
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data);
  }

  // ... other methods
}
```

## State Management

- Use React hooks (useState, useReducer) for local state
- Use Context API for global state (if needed)
- Custom hooks for shared logic
- **Avoid Redux** unless absolutely necessary (keep it simple)

```typescript
// Example: Auth Context
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const authRepo = new AuthRepositoryImplementation();
    const user = await authRepo.login(email, password);
    setUser(user);
  };

  const logout = async () => {
    const authRepo = new AuthRepositoryImplementation();
    await authRepo.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Routing

Using Wouter for routing:

```typescript
import { Route, Switch, Redirect } from 'wouter';

function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginView} />
      <Route path="/register" component={RegisterView} />
      <Route path="/transactions" component={TransactionsView} />
      <Route path="/categories" component={CategoriesView} />
      <Route path="/settings" component={SettingsView} />
      <Route path="/">
        <Redirect to="/transactions" />
      </Route>
    </Switch>
  );
}
```

## Forms & Validation

- Keep validation simple (client-side only for UX)
- Server validates everything (trust the backend)
- Use controlled components

```typescript
function TransactionForm({ onSubmit }: { onSubmit: (data: CreateTransactionDto) => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    const validationErrors: Record<string, string> = {};
    if (!amount) validationErrors.amount = 'Amount is required';
    if (!description) validationErrors.description = 'Description is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      amount: parseFloat(amount),
      description,
      // ... other fields
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <Button type="submit" label="Create" />
    </form>
  );
}
```

## Error Handling

- Always handle loading and error states
- Show user-friendly error messages
- Log errors for debugging

```typescript
try {
  await repository.create(data);
  setSuccess('Transaction created!');
} catch (error) {
  console.error('Failed to create transaction:', error);
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Failed to create transaction';
    setError(message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Testing

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    
    fireEvent.click(screen.getByText('Click'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

### Hook Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './useTransactions';

describe('useTransactions', () => {
  it('should load transactions on mount', async () => {
    const { result } = renderHook(() => useTransactions());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(0);
  });
});
```

## Styling

- Use CSS modules or plain CSS
- Keep styles scoped to components
- Use CSS variables for theming
- Mobile-first responsive design

```css
/* Component.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: var(--color-primary);
  color: white;
}

.button:hover {
  opacity: 0.9;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Environment Variables

- Prefix with `VITE_` to expose to client
- Define in `.env` file (never commit!)
- Access via `import.meta.env.VITE_*`

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

## PWA Configuration

- Service worker configured via `vite-plugin-pwa`
- Manifest in `public/manifest.json`
- Icons in `public/icons/`
- Offline-first support (future)

## Checklist for New Features

- [ ] Domain model created (if needed)
- [ ] Repository interface defined
- [ ] Repository implementation created
- [ ] HTTP data source method added
- [ ] Custom hook created (if shared logic)
- [ ] View component created
- [ ] UI components created/reused
- [ ] Loading and error states handled
- [ ] Form validation added
- [ ] Route added to App.tsx
- [ ] Unit tests written (> 95% coverage)
- [ ] Manual testing in browser
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] No console errors or warnings

