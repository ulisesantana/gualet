import { Category, Id, OperationType, PaymentMethod } from '@gualet/shared';

export const DEMO_USER_ID = 'demo-user-id';
export const DEMO_USER_EMAIL = 'demo@gualet.app';

// Demo Categories
export const DEMO_CATEGORIES: Category[] = [
  new Category({
    id: new Id('demo-cat-1'),
    name: 'Food & Groceries',
    icon: '🍔',
    color: '#FF6B6B',
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id('demo-cat-2'),
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id('demo-cat-3'),
    name: 'Entertainment',
    icon: '🎬',
    color: '#95E1D3',
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id('demo-cat-4'),
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#F38181',
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id('demo-cat-5'),
    name: 'Healthcare',
    icon: '🏥',
    color: '#AA96DA',
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id('demo-cat-6'),
    name: 'Salary',
    icon: '💼',
    color: '#5CDB95',
    type: OperationType.Income,
  }),
  new Category({
    id: new Id('demo-cat-7'),
    name: 'Freelance',
    icon: '💻',
    color: '#3AB0FF',
    type: OperationType.Income,
  }),
  new Category({
    id: new Id('demo-cat-8'),
    name: 'Investment Returns',
    icon: '📈',
    color: '#FFD93D',
    type: OperationType.Income,
  }),
];

// Demo Payment Methods
export const DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  new PaymentMethod({
    id: new Id('demo-pm-1'),
    name: 'Debit Card',
    icon: '💳',
    color: '#6C5CE7',
  }),
  new PaymentMethod({
    id: new Id('demo-pm-2'),
    name: 'Cash',
    icon: '💵',
    color: '#00B894',
  }),
  new PaymentMethod({
    id: new Id('demo-pm-3'),
    name: 'Credit Card',
    icon: '💳',
    color: '#FD79A8',
  }),
  new PaymentMethod({
    id: new Id('demo-pm-4'),
    name: 'Bank Transfer',
    icon: '🏦',
    color: '#74B9FF',
  }),
];

// Simple transaction structure for demo storage
export interface DemoTransactionData {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
  operation: OperationType;
  categoryId: string;
  paymentMethodId: string;
}

// Demo Transactions (last 3 months)
export const DEMO_TRANSACTIONS: DemoTransactionData[] = [
  // Recent transactions (current month)
  {
    id: 'demo-tx-1',
    amount: 45.5,
    description: 'Supermarket purchase',
    date: new Date(2026, 1, 12).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-1',
    paymentMethodId: 'demo-pm-1',
  },
  {
    id: 'demo-tx-2',
    amount: 15.0,
    description: 'Uber ride',
    date: new Date(2026, 1, 11).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-2',
    paymentMethodId: 'demo-pm-1',
  },
  {
    id: 'demo-tx-3',
    amount: 3500.0,
    description: 'Monthly salary',
    date: new Date(2026, 1, 1).toISOString(),
    operation: OperationType.Income,
    categoryId: 'demo-cat-6',
    paymentMethodId: 'demo-pm-4',
  },
  {
    id: 'demo-tx-4',
    amount: 25.99,
    description: 'Netflix subscription',
    date: new Date(2026, 1, 10).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-3',
    paymentMethodId: 'demo-pm-3',
  },
  {
    id: 'demo-tx-5',
    amount: 120.0,
    description: 'Electricity bill',
    date: new Date(2026, 1, 5).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-4',
    paymentMethodId: 'demo-pm-4',
  },

  // Last month (January 2026)
  {
    id: 'demo-tx-6',
    amount: 52.3,
    description: 'Weekly groceries',
    date: new Date(2026, 0, 25).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-1',
    paymentMethodId: 'demo-pm-2',
  },
  {
    id: 'demo-tx-7',
    amount: 30.0,
    description: 'Gas station',
    date: new Date(2026, 0, 20).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-2',
    paymentMethodId: 'demo-pm-1',
  },
  {
    id: 'demo-tx-8',
    amount: 3500.0,
    description: 'Monthly salary',
    date: new Date(2026, 0, 1).toISOString(),
    operation: OperationType.Income,
    categoryId: 'demo-cat-6',
    paymentMethodId: 'demo-pm-4',
  },
  {
    id: 'demo-tx-9',
    amount: 500.0,
    description: 'Freelance project',
    date: new Date(2026, 0, 15).toISOString(),
    operation: OperationType.Income,
    categoryId: 'demo-cat-7',
    paymentMethodId: 'demo-pm-4',
  },
  {
    id: 'demo-tx-10',
    amount: 80.0,
    description: 'Doctor appointment',
    date: new Date(2026, 0, 18).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-5',
    paymentMethodId: 'demo-pm-3',
  },

  // Two months ago (December 2025)
  {
    id: 'demo-tx-11',
    amount: 150.0,
    description: 'Christmas dinner',
    date: new Date(2025, 11, 25).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-1',
    paymentMethodId: 'demo-pm-2',
  },
  {
    id: 'demo-tx-12',
    amount: 3500.0,
    description: 'Monthly salary',
    date: new Date(2025, 11, 1).toISOString(),
    operation: OperationType.Income,
    categoryId: 'demo-cat-6',
    paymentMethodId: 'demo-pm-4',
  },
  {
    id: 'demo-tx-13',
    amount: 200.0,
    description: 'Stock dividends',
    date: new Date(2025, 11, 15).toISOString(),
    operation: OperationType.Income,
    categoryId: 'demo-cat-8',
    paymentMethodId: 'demo-pm-4',
  },
  {
    id: 'demo-tx-14',
    amount: 45.0,
    description: 'Movie tickets',
    date: new Date(2025, 11, 20).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-3',
    paymentMethodId: 'demo-pm-2',
  },
  {
    id: 'demo-tx-15',
    amount: 110.0,
    description: 'Water bill',
    date: new Date(2025, 11, 10).toISOString(),
    operation: OperationType.Outcome,
    categoryId: 'demo-cat-4',
    paymentMethodId: 'demo-pm-4',
  },
];
