import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { HttpDataSource } from "@common/infrastructure";
import {
  Category,
  CategoryDto,
  Day,
  Id,
  OperationType,
  PaymentMethod,
  PaymentMethodDto,
  TimeString,
  Transaction,
  TransactionDto,
} from "@gualet/shared";

import { TransactionRepositoryImplementation } from "./transaction.repository";

function createTransactionDto(): TransactionDto {
  return {
    id: "txn-1",
    amount: 100,
    description: "Lunch",
    date: new Date().toISOString() as TimeString,
    operation: OperationType.Outcome,
    category: {
      id: "cat-1",
      name: "Food",
      icon: "🍔",
      type: OperationType.Outcome,
      color: "#fff",
    },
    paymentMethod: {
      id: "pm-1",
      name: "Credit Card",
      icon: "💳",
      color: "#000",
    },
  };
}

describe("TransactionRepositoryImplementation (HTTP)", () => {
  let repository: TransactionRepositoryImplementation;
  let mockHttp: Mocked<HttpDataSource>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<HttpDataSource>;
    repository = new TransactionRepositoryImplementation(mockHttp);
  });

  describe("create", () => {
    it("should create a transaction and return the mapped Transaction", async () => {
      const dto = createTransactionDto();
      mockHttp.post.mockResolvedValue({
        success: true,
        data: { transaction: dto },
      });
      const transaction = new Transaction({
        id: new Id(dto.id),
        amount: dto.amount,
        description: dto.description,
        date: new Day(dto.date),
        operation: dto.operation,
        category: new Category({
          id: new Id(dto.category.id),
          name: dto.category.name,
          icon: dto.category.icon ?? undefined,
          type: dto.category.type,
          color: dto.category.color ?? undefined,
        }),
        paymentMethod: new PaymentMethod({
          id: new Id(dto.paymentMethod.id),
          name: dto.paymentMethod.name,
          icon: dto.paymentMethod.icon ?? undefined,
          color: dto.paymentMethod.color ?? undefined,
        }),
      });
      const result = await repository.create(transaction);
      expect(result).toEqual(expect.any(Transaction));
      expect(mockHttp.post).toHaveBeenCalled();
    });
    it("should return null if creation fails", async () => {
      mockHttp.post.mockResolvedValue({ success: false, error: "fail" });
      const transaction = new Transaction({
        id: new Id("txn-1"),
        amount: 100,
        description: "Lunch",
        date: new Day(new Date().toISOString()),
        operation: OperationType.Outcome,
        category: new Category({
          id: new Id("cat-1"),
          name: "Food",
          icon: "🍔",
          type: OperationType.Outcome,
          color: "#fff",
        }),
        paymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
          color: "#000",
        }),
      });
      const result = await repository.create(transaction);
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return a Transaction if found", async () => {
      const dto = createTransactionDto();
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { transaction: dto },
      });
      const result = await repository.findById(new Id(dto.id));
      expect(result).toEqual(expect.any(Transaction));
      expect(mockHttp.get).toHaveBeenCalled();
    });
    it("should return null if not found", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "not found" });
      const result = await repository.findById(new Id("not-exist"));
      expect(result).toBeNull();
    });
  });

  describe("find", () => {
    it("should return a list of Transactions", async () => {
      const dto = createTransactionDto();
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { transactions: [dto] },
      });
      const result = await repository.find({});
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(expect.any(Transaction));
    });
    it("should return an empty array if fetch fails", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.find({});
      expect(result).toEqual([]);
    });
  });

  describe("remove", () => {
    it("should call http.delete and return a CommandResponse", async () => {
      mockHttp.delete.mockResolvedValue({ success: true, data: null });
      const result = await repository.remove(new Id("txn-1"));
      expect(mockHttp.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update a transaction and return the mapped Transaction", async () => {
      const dto = createTransactionDto();
      mockHttp.patch.mockResolvedValue({
        success: true,
        data: { transaction: dto },
      });
      const transaction = new Transaction({
        id: new Id(dto.id),
        amount: dto.amount,
        description: dto.description,
        date: new Day(dto.date),
        operation: dto.operation,
        category: new Category({
          id: new Id(dto.category.id),
          name: dto.category.name,
          icon: dto.category.icon ?? undefined,
          type: dto.category.type,
          color: dto.category.color ?? undefined,
        }),
        paymentMethod: new PaymentMethod({
          id: new Id(dto.paymentMethod.id),
          name: dto.paymentMethod.name,
          icon: dto.paymentMethod.icon ?? undefined,
          color: dto.paymentMethod.color ?? undefined,
        }),
      });
      const result = await repository.update(transaction);
      expect(result).toEqual(expect.any(Transaction));
      expect(mockHttp.patch).toHaveBeenCalled();
    });
    it("should return null if update fails", async () => {
      mockHttp.patch.mockResolvedValue({ success: false, error: "fail" });
      const transaction = new Transaction({
        id: new Id("txn-1"),
        amount: 100,
        description: "Lunch",
        date: new Day(new Date().toISOString()),
        operation: OperationType.Outcome,
        category: new Category({
          id: new Id("cat-1"),
          name: "Food",
          icon: "🍔",
          type: OperationType.Outcome,
          color: "#fff",
        }),
        paymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
          color: "#000",
        }),
      });
      const result = await repository.update(transaction);
      expect(result).toBeNull();
    });
  });

  describe("fetchTransactionConfig", () => {
    it("should return a TransactionConfig with categories and payment methods", async () => {
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Food",
          icon: "🍔",
          type: OperationType.Outcome,
          color: "#fff",
        },
        {
          id: "cat-2",
          name: "Salary",
          icon: "💰",
          type: OperationType.Income,
          color: "#eee",
        },
      ];
      const paymentMethods: PaymentMethodDto[] = [
        { id: "pm-1", name: "Credit Card", icon: "💳", color: "#000" },
      ];
      mockHttp.get
        .mockResolvedValueOnce({ success: true, data: { paymentMethods } })
        .mockResolvedValueOnce({ success: true, data: { categories } });
      const result = await repository.fetchTransactionConfig();
      expect(result.paymentMethods.length).toBe(1);
      expect(result.incomeCategories.length).toBe(1);
      expect(result.outcomeCategories.length).toBe(1);
    });
    it("should return empty arrays if fetch fails", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.fetchTransactionConfig();
      expect(result.paymentMethods).toEqual([]);
      expect(result.incomeCategories).toEqual([]);
      expect(result.outcomeCategories).toEqual([]);
    });
  });
});
