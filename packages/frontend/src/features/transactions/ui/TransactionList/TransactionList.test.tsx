import React from "react";
import {
  Category,
  Day,
  Id,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/shared";
import { vi } from "vitest";
import { render, screen } from "@test/test-utils";

import { TransactionList } from "./TransactionList";

// Mock CSS import
vi.mock("./CategoryList.css", () => ({ default: "irrelevant" }));

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
      paymentMethod: new PaymentMethod({ icon: "💳", name: "Credit card" }),
      id: new Id("1"),
      amount: 100,
      category: new Category({
        name: "Groceries",
        type: OperationType.Outcome,
      }),
      description: "Buying groceries",
      operation: OperationType.Outcome,
    }),
    new Transaction({
      date: new Day("2022/02/05"),
      id: new Id("2"),
      amount: 200,
      description: "Monthly salary",
      category: new Category({
        name: "Salary",
        type: OperationType.Income,
      }),
      operation: OperationType.Income,
      paymentMethod: new PaymentMethod({ icon: "🏦", name: "Bank transfer" }),
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

  it("renders empty message when there are no transactions", () => {
    render(<TransactionList transactions={[]} />);

    expect(screen.getByText("There are no transactions")).toBeInTheDocument();
  });
});
