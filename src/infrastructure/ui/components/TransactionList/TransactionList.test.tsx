import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Category,
  Day,
  Id,
  Transaction,
  TransactionOperation,
} from "@domain/models";
import { vi } from "vitest";

import { TransactionList } from "./TransactionList";

// Mock CSS import
vi.mock("./TransactionList.css", () => ({ default: "irrelevant" }));

// Mock the TransactionCard component
vi.mock("../TransactionCard", () => ({
  TransactionCard: ({ transaction }: { transaction: Transaction }) => (
    <div>{`Transaction: ${transaction.category.title} - ${transaction.amountFormatted}`}</div>
  ),
}));

describe("TransactionList", () => {
  const mockTransactions: Transaction[] = [
    new Transaction({
      date: new Day("2022/02/02"),
      paymentMethod: "Credit card",
      id: new Id("1"),
      amount: 100,
      category: new Category({
        name: "Groceries",
        type: TransactionOperation.Outcome,
      }),
      description: "Buying groceries",
      operation: TransactionOperation.Outcome,
    }),
    new Transaction({
      date: new Day("2022/02/05"),
      id: new Id("2"),
      amount: 200,
      description: "Monthly salary",
      category: new Category({
        name: "Salary",
        type: TransactionOperation.Income,
      }),
      operation: TransactionOperation.Income,
      paymentMethod: "Bank transfer",
    }),
  ];

  it("renders the correct number of TransactionCard components", () => {
    render(<TransactionList transactions={mockTransactions} />);

    const transactionCards = screen.getAllByText(/Transaction:/);
    expect(transactionCards).toHaveLength(mockTransactions.length);
  });

  it("renders the TransactionCard components with correct transaction details", () => {
    render(<TransactionList transactions={mockTransactions} />);

    expect(
      screen.getByText("Transaction: Groceries - -100,00 €"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Transaction: Salary - 200,00 €"),
    ).toBeInTheDocument();
  });
});
