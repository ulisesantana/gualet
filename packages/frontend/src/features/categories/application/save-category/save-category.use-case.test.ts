import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryRepository } from "../category.repository";
import { Category, Id, NewCategory, OperationType } from "@gualet/shared";

import { SaveCategoryUseCase } from "./save-category.use-case";

const mockRepository: CategoryRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

describe("SaveCategoryUseCase", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a new category when given NewCategory", async () => {
    const newCategory = new NewCategory({
      name: "Groceries",
      type: OperationType.Outcome,
      icon: "🛒",
    });

    const useCase = new SaveCategoryUseCase(mockRepository);

    await useCase.exec(newCategory);

    expect(mockRepository.create).toHaveBeenCalledWith(newCategory);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should update an existing category when given Category with id", async () => {
    const category = new Category({
      id: new Id("test-id"),
      name: "Groceries",
      type: OperationType.Outcome,
      icon: "🛒",
    });

    const useCase = new SaveCategoryUseCase(mockRepository);

    await useCase.exec(category);

    expect(mockRepository.update).toHaveBeenCalledWith(category);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
