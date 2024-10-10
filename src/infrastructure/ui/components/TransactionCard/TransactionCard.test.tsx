import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Category,
  Day,
  Id,
  Transaction,
  TransactionOperation,
} from "domain/models";

import { TransactionCard } from "./TransactionCard";

// Mock CSS import
jest.mock("./TransactionCard.css", () => ({}));

describe("TransactionCard", () => {
  const mockTransaction = new Transaction({
    id: new Id(),
    amount: 150,
    category: new Category({
      name: "Groceries",
      type: TransactionOperation.Outcome,
    }),
    date: new Day("2024/09/12"),
    description: "Buying groceries",
    operation: TransactionOperation.Outcome,
    paymentMethod: "Expense",
  });

  it("renders transaction card with correct data", () => {
    render(<TransactionCard transaction={mockTransaction} />);

    const date = screen.getByText("12 / 09");
    const category = screen.getByText("Groceries");
    const amount = screen.getByText("-150,00 €"); // Amount should be formatted

    expect(date).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });

  it("render outcome transactions", () => {
    render(<TransactionCard transaction={mockTransaction} />);

    const amountElement = screen.getByText("-150,00 €");
    expect(amountElement).toHaveClass("outcome");
  });

  it("render income transaction", () => {
    const mockIncomeTransaction = new Transaction({
      ...mockTransaction,
      operation: TransactionOperation.Income,
    });

    render(<TransactionCard transaction={mockIncomeTransaction} />);

    const amountElement = screen.getByText("150,00 €"); // No '-' for income
    expect(amountElement).toHaveClass("income");
  });
});
