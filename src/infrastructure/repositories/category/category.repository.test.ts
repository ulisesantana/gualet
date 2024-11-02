import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Category,
  defaultOutcomeCategories,
  Id,
  TransactionOperation,
} from "@domain/models";
import { MockSupabaseClient } from "@test/mocks";
import { SupabaseClient } from "@supabase/supabase-js";

import { CategoryRepositoryImplementation } from "./category.repository";

describe("CategoryRepositoryImplementation", () => {
  let mockSupabaseClient: MockSupabaseClient;
  let categoryRepository: CategoryRepositoryImplementation;
  const userId = "user-123";
  const dbName = "categories";

  beforeEach(() => {
    mockSupabaseClient = new MockSupabaseClient();
    categoryRepository = new CategoryRepositoryImplementation(
      userId,
      mockSupabaseClient as unknown as SupabaseClient,
    );
  });

  describe("save", () => {
    it("should upsert a category", async () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: TransactionOperation.Outcome,
      });

      await categoryRepository.save(category);

      expect(mockSupabaseClient.from(dbName).upsert).toHaveBeenCalledWith({
        id: "cat-1",
        user_id: userId,
        name: "Food",
        icon: "🍔",
        type: TransactionOperation.Outcome,
      });
    });

    it("should log an error if upsert fails", async () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: TransactionOperation.Outcome,
      });
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockSupabaseClient.withResult({ error: new Error("Upsert failed") });

      await categoryRepository.save(category);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error saving category: ${category}`,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("findById", () => {
    it("should fetch a category by ID", async () => {
      const category = new Category(defaultOutcomeCategories[0]);
      mockSupabaseClient.withResult({ data: [category], error: null });

      const result = await categoryRepository.findById(category.id);

      expect(result).toEqual(category);
    });

    it("should throw an error if the category is not found", async () => {
      mockSupabaseClient.withResult({ error: new Error("Boom!") });

      await expect(
        categoryRepository.findById(new Id("cat-1")),
      ).rejects.toThrow("Category cat-1 not found.");
    });

    it("should throw an error if fetching the category fails", async () => {
      mockSupabaseClient.withResult({
        data: null,
        error: new Error("Database error"),
      });

      await expect(
        categoryRepository.findById(new Id("cat-1")),
      ).rejects.toThrow("Category cat-1 not found.");
    });
  });

  describe("findAll", () => {
    it("should fetch all categories for the user", async () => {
      const categoryData = [
        {
          id: "cat-1",
          name: "Food",
          icon: "🍔",
          type: TransactionOperation.Outcome,
          user_id: userId,
        },
        {
          id: "cat-2",
          name: "Entertainment",
          icon: "🎮",
          type: TransactionOperation.Outcome,
          user_id: userId,
        },
      ] as any;
      mockSupabaseClient.withResult({ data: categoryData, error: null });

      const result = await categoryRepository.findAll();

      expect(result).toEqual(
        categoryData.map(CategoryRepositoryImplementation.mapToCategory),
      );
      expect(mockSupabaseClient.from(dbName).select).toHaveBeenCalledWith();
    });

    it("should throw an error if fetching all categories fails", async () => {
      mockSupabaseClient.withResult({
        data: null,
        error: new Error("Database error"),
      });

      await expect(categoryRepository.findAll()).rejects.toThrow(
        "Categories not found.",
      );
    });
  });

  describe("mapToCategory", () => {
    it("should map raw data to Category instance", () => {
      const rawCategory = {
        id: "cat-1",
        name: "Food",
        icon: "🍔",
        type: TransactionOperation.Outcome,
      };
      const result = CategoryRepositoryImplementation.mapToCategory(
        rawCategory as any,
      );

      expect(result).toEqual(
        new Category({
          id: new Id("cat-1"),
          name: "Food",
          icon: "🍔",
          type: TransactionOperation.Outcome as TransactionOperation,
        }),
      );
    });
  });
});
