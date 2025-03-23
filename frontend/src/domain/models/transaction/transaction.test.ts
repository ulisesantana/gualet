import { describe, expect, it } from "vitest";
import {
  Category,
  Day,
  Id,
  PaymentMethod,
  Transaction,
  TransactionOperation,
} from "@domain/models";

describe("Transaction", () => {
  const mockCategory = new Category({
    id: new Id("cat1"),
    name: "Groceries",
    icon: "🛒",
    type: TransactionOperation.Outcome,
  });

  const mockPaymentMethod = new PaymentMethod({
    id: new Id("pay1"),
    name: "Card",
    icon: "💳",
  });

  const mockDay = new Day("2023-01-15");

  it("should create a transaction with the correct properties", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "Supermarket shopping",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.id).toBeInstanceOf(Id);
    expect(transaction.amount).toBe(1000);
    expect(transaction.description).toBe("Supermarket shopping");
    expect(transaction.category).toEqual(mockCategory);
    expect(transaction.isOutcome()).toBe(true);
    expect(transaction.paymentMethod).toEqual(mockPaymentMethod);
  });

  it("should trim given description", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "  Supermarket shopping  ",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.id).toBeInstanceOf(Id);
    expect(transaction.amount).toBe(1000);
    expect(transaction.description).toBe("Supermarket shopping");
    expect(transaction.category).toEqual(mockCategory);
    expect(transaction.isOutcome()).toBe(true);
    expect(transaction.paymentMethod).toEqual(mockPaymentMethod);
  });

  it("should format the amount correctly for Outcome transactions", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "Supermarket shopping",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.amountFormatted).toBe("-1.000,00 €");
  });

  it("should format the amount correctly for Income transactions", () => {
    const transaction = new Transaction({
      amount: 2000,
      category: mockCategory,
      date: mockDay,
      description: "Salary",
      operation: TransactionOperation.Income,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.amountFormatted).toBe("2.000,00 €");
  });

  it("should correctly return a string representation of the transaction", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "Supermarket shopping",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    const expectedString =
      'Transaction "Supermarket shopping" in category 🛒 Groceries with an amount of -1.000,00 € on 2023/01/15, via 💳 Card';

    expect(transaction.toString()).toBe(expectedString);
  });

  // Tests for instance methods (isOutcome, isIncome)
  it("should return true for isOutcome when operation is Outcome", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "Supermarket shopping",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.isOutcome()).toBe(true);
  });

  it("should return false for isOutcome when operation is Income", () => {
    const transaction = new Transaction({
      amount: 1000,
      category: mockCategory,
      date: mockDay,
      description: "Supermarket shopping",
      operation: TransactionOperation.Income,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.isOutcome()).toBe(false);
  });

  it("should return true for isIncome when operation is Income", () => {
    const transaction = new Transaction({
      amount: 2000,
      category: mockCategory,
      date: mockDay,
      description: "Salary",
      operation: TransactionOperation.Income,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.isIncome()).toBe(true);
  });

  it("should return false for isIncome when operation is Outcome", () => {
    const transaction = new Transaction({
      amount: 2000,
      category: mockCategory,
      date: mockDay,
      description: "Salary",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    expect(transaction.isIncome()).toBe(false);
  });

  // Test for toString method
  it("should return the correct string representation when there is no description", () => {
    const transaction = new Transaction({
      amount: 500,
      category: mockCategory,
      date: mockDay,
      description: "",
      operation: TransactionOperation.Outcome,
      paymentMethod: mockPaymentMethod,
    });

    const expectedString =
      "Transaction in category 🛒 Groceries with an amount of -500,00 € on 2023/01/15, via 💳 Card";

    expect(transaction.toString()).toBe(expectedString);
  });
});
