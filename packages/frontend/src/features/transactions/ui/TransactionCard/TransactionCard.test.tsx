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

import { TransactionCard } from "./TransactionCard";

// Mock CSS import
vi.mock("./CategoryCard.css", () => ({ default: "irrelevant" }));

describe("TransactionCard", () => {
  const mockTransaction = new Transaction({
    id: new Id(),
    amount: 150,
    category: new Category({
      name: "Groceries",
      type: OperationType.Outcome,
    }),
    date: new Day("2024/09/12"),
    description: "Buying groceries",
    operation: OperationType.Outcome,
    paymentMethod: new PaymentMethod({ icon: "💳", name: "Credit card" }),
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
    const { container } = render(
      <TransactionCard transaction={mockTransaction} />,
    );

    const amountElement = screen.getByText("-150,00 €");
    expect(amountElement).toBeInTheDocument();
    // Chakra UI Badge with red colorScheme for outcome
    const badge = container.querySelector('[class*="chakra-badge"]');
    expect(badge).toBeInTheDocument();
  });

  it("render income transaction", () => {
    const mockIncomeTransaction = new Transaction({
      ...mockTransaction,
      operation: OperationType.Income,
    });

    const { container } = render(
      <TransactionCard transaction={mockIncomeTransaction} />,
    );

    const amountElement = screen.getByText("150,00 €"); // No '-' for income
    expect(amountElement).toBeInTheDocument();
    // Chakra UI Badge with green colorScheme for income
    const badge = container.querySelector('[class*="chakra-badge"]');
    expect(badge).toBeInTheDocument();
  });
});
