import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionList, TransactionListProps } from './TransactionList';
import { TransactionCard } from '../TransactionCard';
import { Transaction, TransactionOperation } from 'domain/models';

// Mock CSS import
jest.mock('./TransactionList.css', () => ({}));

// Mock the TransactionCard component
jest.mock('../TransactionCard', () => ({
  TransactionCard: ({ transaction }: { transaction: Transaction }) => (
    <div>{`Transaction: ${transaction.category} - ${transaction.amountFormatted}`}</div>
  ),
}));

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    new Transaction({
      id: '1',
      amount: 100,
      category: 'Groceries',
      day: '12',
      description: 'Buying groceries',
      month: '09',
      operation: TransactionOperation.Outcome,
      timestamp: new Date().toISOString(),
      type: 'Expense',
    }),
    new Transaction({
      id: '2',
      amount: 200,
      category: 'Salary',
      day: '15',
      description: 'Monthly salary',
      month: '09',
      operation: TransactionOperation.Income,
      timestamp: new Date().toISOString(),
      type: 'Income',
    }),
  ];

  it('renders the correct number of TransactionCard components', () => {
    render(<TransactionList transactions={mockTransactions} />);

    const transactionCards = screen.getAllByText(/Transaction:/);
    expect(transactionCards).toHaveLength(mockTransactions.length);
  });

  it('renders the TransactionCard components with correct transaction details', () => {
    render(<TransactionList transactions={mockTransactions} />);

    expect(screen.getByText('Transaction: Groceries - -100,00 €')).toBeInTheDocument();
    expect(screen.getByText('Transaction: Salary - 200,00 €')).toBeInTheDocument();
  });
});
