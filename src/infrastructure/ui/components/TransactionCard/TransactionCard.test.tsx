import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionCard } from './TransactionCard';
import { Transaction, TransactionOperation } from 'domain/models';

// Mock CSS import
jest.mock('./TransactionCard.css', () => ({}));

describe('TransactionCard', () => {
  const mockTransaction = new Transaction({
    id: '123',
    amount: 150,
    category: 'Groceries',
    day: '12',
    description: 'Buying groceries',
    month: '09',
    operation: TransactionOperation.Outcome,
    timestamp: new Date().toISOString(),
    type: 'Expense'
  });

  it('renders transaction card with correct data', () => {
    render(<TransactionCard transaction={mockTransaction} />);

    const date = screen.getByText('12 / 09');
    const category = screen.getByText('Groceries');
    const amount = screen.getByText('-150,00 €'); // Amount should be formatted

    expect(date).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });

  it('render outcome transactions', () => {
    render(<TransactionCard transaction={mockTransaction} />);

    const amountElement = screen.getByText('-150,00 €');
    expect(amountElement).toHaveClass('outcome');
  });

  it('render income transaction', () => {
    const mockIncomeTransaction = new Transaction({
      ...mockTransaction,
      operation: TransactionOperation.Income,
    });

    render(<TransactionCard transaction={mockIncomeTransaction} />);

    const amountElement = screen.getByText('150,00 €'); // No '-' for income
    expect(amountElement).toHaveClass('income');
  });
});
