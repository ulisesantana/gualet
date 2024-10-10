import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Category,
  Day,
  Id,
  Transaction,
  TransactionOperation,
} from "domain/models";

import { TransactionList } from "./TransactionList";

// Mock CSS import
jest.mock("./TransactionList.css", () => ({}));

// Mock the TransactionCard component
jest.mock("../TransactionCard", () => ({
  TransactionCard: ({ transaction }: { transaction: Transaction }) => (
    <div>{`Transaction: ${transaction.category} - ${transaction.amountFormatted}`}</div>
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
        name: "Groceries",
        type: TransactionOperation.Outcome,
      }),
      operation: TransactionOperation.Income,
      paymentMethod: "Salary",
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
