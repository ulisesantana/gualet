import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Category,
  CategoryDto,
  Id,
  NewCategory,
  OperationType,
} from "@gualet/shared";
import { HttpDataSource } from "@common/infrastructure";

import { CategoryRepositoryImplementation } from "./category.repository";

const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
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

    it("should map categories with null icon and color", async () => {
      const categories: CategoryDto[] = [
        {
          id: "cat-2",
          name: "Other",
          icon: null as any,
          type: OperationType.Outcome,
          color: null as any,
        },
      ];
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { categories },
      });
      const result = await repository.findAll();
      expect(result[0].icon).toBe("");
      expect(result[0].color).toBe("#545454");
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

    it("should throw error if there is an error when saving", async () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      });
      mockHttp.patch.mockResolvedValue({
        success: false,
        error: { message: "Update failed" },
      });
      await expect(repository.update(category)).rejects.toThrow(
        "Update failed",
      );
    });
  });

  describe("create", () => {
    it("should create and return the new category", async () => {
      const newCategory = new NewCategory({
        name: "Transport",
        icon: "🚗",
        type: OperationType.Outcome,
        color: "#00f",
      });
      const categoryDto: CategoryDto = {
        id: "cat-new",
        name: "Transport",
        icon: "🚗",
        type: OperationType.Outcome,
        color: "#00f",
      };
      mockHttp.post.mockResolvedValue({
        success: true,
        data: { category: categoryDto },
      });

      const result = await repository.create(newCategory);

      expect(result).toBeInstanceOf(Category);
      expect(result!.name).toBe("Transport");
      expect(mockHttp.post).toHaveBeenCalled();
    });

    it("should throw an error if creation fails", async () => {
      const newCategory = new NewCategory({
        name: "Transport",
        icon: "🚗",
        type: OperationType.Outcome,
        color: "#00f",
      });
      mockHttp.post.mockResolvedValue({
        success: false,
        error: null,
      });
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(repository.create(newCategory)).rejects.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("delete", () => {
    it("should delete a category successfully", async () => {
      mockHttp.delete.mockResolvedValue({ success: true, data: null });

      await expect(repository.delete(new Id("cat-1"))).resolves.toBeUndefined();
      expect(mockHttp.delete).toHaveBeenCalled();
    });

    it("should throw an error if deletion fails", async () => {
      mockHttp.delete.mockResolvedValue({
        success: false,
        error: { message: "Cannot delete category in use" },
      });
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(repository.delete(new Id("cat-1"))).rejects.toThrow(
        "Cannot delete category in use",
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("mapToDto", () => {
    it("should map a Category to a CategoryDto", () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      });

      const dto = CategoryRepositoryImplementation.mapToDto(category);

      expect(dto.id).toBe("cat-1");
      expect(dto.name).toBe("Food");
      expect(dto.icon).toBe("🍔");
      expect(dto.type).toBe(OperationType.Outcome);
    });

    it("should return empty string for id when category has no id", () => {
      const category = new Category({
        name: "NoId",
        icon: "🔸",
        type: OperationType.Outcome,
        color: "#000",
      });
      // Force id to null to hit the ?. branch
      (category as any).id = null;

      const dto = CategoryRepositoryImplementation.mapToDto(category);
      expect(dto.id).toBe("");
    });
  });

  describe("mapToDtoForUpdate", () => {
    it("should map a Category to an update DTO without id", () => {
      const category = new Category({
        id: new Id("cat-1"),
        name: "Food",
        icon: "🍔",
        type: OperationType.Outcome,
        color: "#fff",
      });

      const dto = CategoryRepositoryImplementation.mapToDtoForUpdate(category);

      expect((dto as any).id).toBeUndefined();
      expect(dto.name).toBe("Food");
      expect(dto.type).toBe(OperationType.Outcome);
    });
  });
});
