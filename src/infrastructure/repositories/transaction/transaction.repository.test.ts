import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Category,
  Day,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  defaultPaymentMethods,
  Id,
  PaymentMethod,
  Transaction,
  TransactionOperation,
} from "@domain/models";
import { MockSupabaseClient } from "@test/mocks";
import { SupabaseClient } from "@supabase/supabase-js";
import { TransactionBuilder } from "@test/builders";

import { TransactionRepositoryImplementation } from "./transaction.repository";

describe("TransactionRepositoryImplementation", () => {
  let mockSupabaseClient: MockSupabaseClient;
  let transactionRepository: TransactionRepositoryImplementation;
  let transaction: Transaction;
  const userId = "user-123";
  const dbName = "transactions";
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-01T00:00:00Z"));

    mockSupabaseClient = new MockSupabaseClient();
    transactionRepository = new TransactionRepositoryImplementation(
      userId,
      mockSupabaseClient as unknown as SupabaseClient,
    );
    transaction = new TransactionBuilder()
      .withId(new Id("txn-1"))
      .withAmount(100)
      .withDescription("Lunch")
      .withDate(new Day(new Date().toISOString()))
      .withOperation(TransactionOperation.Outcome)
      .withCategory(
        new Category({
          id: new Id("cat-1"),
          name: "Food",
          icon: "🍔",
          type: TransactionOperation.Outcome,
        }),
      )
      .withPaymentMethod(
        new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
        }),
      )
      .build();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("save", () => {
    it("should upsert a transaction", async () => {
      await transactionRepository.save(transaction);

      expect(mockSupabaseClient.from(dbName).upsert).toHaveBeenCalledWith({
        id: "txn-1",
        user_id: userId,
        category_id: "cat-1",
        payment_method_id: "pm-1",
        amount: 100,
        description: "Lunch",
        date: transaction.date.toString(),
        type: TransactionOperation.Outcome,
      });
    });

    it("should log an error if upsert fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Upsert failed"),
      });

      await transactionRepository.save(transaction);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error saving transaction: ${transaction}`,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("remove", () => {
    it("should delete a transaction by ID", async () => {
      const transactionId = new Id("txn-1");

      await transactionRepository.remove(transactionId);

      expect(mockSupabaseClient.from(dbName).delete).toHaveBeenCalledWith();
      expect(mockSupabaseClient.from(dbName).delete().eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(mockSupabaseClient.from(dbName).delete().eq).toHaveBeenCalledWith(
        "id",
        transactionId.toString(),
      );
    });

    it("should log an error if delete fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Delete failed"),
      });

      await transactionRepository.remove(new Id("txn-1"));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error removing transaction txn-1",
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("findById", () => {
    it("should fetch a transaction by ID", async () => {
      const transaction = {
        id: "txn-1",
        amount: 100,
        description: "Lunch",
        date: new Date().toISOString(),
        type: TransactionOperation.Outcome,
        categories: {
          id: "cat-1",
          name: "Food",
          icon: "🍔",
          type: TransactionOperation.Outcome,
        },
        payment_methods: { id: "pm-1", name: "Credit Card", icon: "💳" },
      };
      mockSupabaseClient.withResult({ data: [transaction], error: null });

      const result = await transactionRepository.findById(new Id("txn-1"));

      expect(result).toEqual(
        new TransactionBuilder()
          .withId(new Id(transaction.id))
          .withAmount(transaction.amount)
          .withDescription(transaction.description)
          .withDate(new Day(transaction.date))
          .withOperation(transaction.type)
          .withCategory(
            new Category({
              icon: transaction.categories.icon,
              id: new Id(transaction.categories.id),
              name: transaction.categories.name,
              type: transaction.categories.type,
            }),
          )
          .withPaymentMethod(
            new PaymentMethod({
              icon: transaction.payment_methods.icon,
              id: new Id(transaction.payment_methods.id),
              name: transaction.payment_methods.name,
            }),
          )
          .build(),
      );
    });

    it("should throw an error if transaction is not found", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Not found"),
      });

      await expect(
        transactionRepository.findById(new Id("txn-1")),
      ).rejects.toThrow("Transaction txn-1 not found.");
    });
  });

  describe("findLast", () => {
    it("should fetch the last transactions for the user", async () => {
      const transactionData = [
        {
          id: "txn-1",
          amount: 100,
          description: "Lunch",
          date: new Date().toISOString(),
          type: TransactionOperation.Outcome,
          categories: {
            id: "cat-1",
            name: "Food",
            icon: "🍔",
            type: TransactionOperation.Outcome,
          },
          payment_methods: { id: "pm-1", name: "Credit Card", icon: "💳" },
        },
      ];
      mockSupabaseClient.withResult({ data: transactionData, error: null });

      const result = await transactionRepository.findLast(1);

      expect(result).toEqual([transaction]);
    });

    it("should return an empty array if fetching last transactions fails", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Database error"),
      });

      const result = await transactionRepository.findLast(1);

      expect(result).toEqual([]);
    });
  });

  describe("fetchTransactionConfig", () => {
    it("should fetch transaction config with categories and payment methods", async () => {
      const paymentMethods = defaultPaymentMethods;
      const categories = defaultOutcomeCategories.concat(
        defaultIncomeCategories,
      );

      mockSupabaseClient.withResult([
        { data: paymentMethods, error: null },
        { data: categories, error: null },
      ]);

      const result = await transactionRepository.fetchTransactionConfig();

      expect(result.paymentMethods).toEqual(paymentMethods);
      expect(result.outcomeCategories).toEqual(defaultOutcomeCategories);
      expect(result.incomeCategories).toEqual(defaultIncomeCategories);
    });

    it("should use default categories and payment methods if fetching fails", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: new Error("Database error"),
      });

      const result = await transactionRepository.fetchTransactionConfig();

      expect(result.paymentMethods).toEqual(defaultPaymentMethods);
      expect(result.outcomeCategories).toEqual(defaultOutcomeCategories);
      expect(result.incomeCategories).toEqual(defaultIncomeCategories);
    });

    it("should insert default categories if none exist", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: null,
      });

      const result = await transactionRepository.fetchTransactionConfig();

      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        defaultIncomeCategories.concat(defaultOutcomeCategories).map((c) => ({
          icon: c.icon,
          id: c.id.toString(),
          name: c.name,
          type: c.type,
          user_id: "user-123",
        })),
      );
      expect(result.incomeCategories).toEqual(defaultIncomeCategories);
      expect(result.outcomeCategories).toEqual(defaultOutcomeCategories);
    });

    it("should insert default payment methods if none exist", async () => {
      mockSupabaseClient.withResult({
        data: [],
        error: null,
      });

      const result = await transactionRepository.fetchTransactionConfig();

      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        defaultPaymentMethods.map((p) => ({
          icon: p.icon,
          id: p.id.toString(),
          name: p.name,
          user_id: "user-123",
        })),
      );
      expect(result.paymentMethods).toEqual(defaultPaymentMethods);
    });
  });
});
