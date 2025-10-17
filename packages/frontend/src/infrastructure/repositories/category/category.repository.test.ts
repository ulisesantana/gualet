import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, CategoryDto, Id, OperationType } from "@gualet/core";
import { HttpDataSource } from "@infrastructure/data-sources";

import { CategoryRepositoryImplementation } from "./category.repository";

const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
};

describe("CategoryRepositoryImplementation (HTTP)", () => {
  let repository: CategoryRepositoryImplementation;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new CategoryRepositoryImplementation(
      mockHttp as unknown as HttpDataSource,
    );
  });

  describe("findAll", () => {
    it("should return a list of categories", async () => {
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Food",
          icon: "🍔",
          type: OperationType.Outcome,
          color: "#fff",
        },
      ];
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { categories },
      });
      const result = await repository.findAll();
      expect(result[0]).toBeInstanceOf(Category);
      expect(result[0].id.toString()).toBe("cat-1");
    });

    it("should return an empty array if there is an error", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should return a category by id", async () => {
      const category: CategoryDto = {
        id: "cat-1",
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      };
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { category },
      });
      const result = await repository.findById(new Id("cat-1"));
      expect(result).toBeInstanceOf(Category);
      expect(result!.id.toString()).toBe("cat-1");
    });

    it("should throw an error if the category is not found", async () => {
      mockHttp.get.mockResolvedValue({ success: false, error: "fail" });

      const result = await repository.findById(new Id("cat-1"));

      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("should save and return the category", async () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      });
      const categoryDto: CategoryDto = {
        id: "cat-1",
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      };
      mockHttp.patch.mockResolvedValue({
        success: true,
        data: { category: categoryDto },
      });
      const result = await repository.update(category);
      expect(result).toBeInstanceOf(Category);
      expect(result?.id.toString()).toBe("cat-1");
    });

    it("should return null if there is an error when saving", async () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      });
      mockHttp.patch.mockResolvedValue({ success: false, error: "fail" });
      const result = await repository.update(category);
      expect(result).toBeNull();
    });
  });
});
