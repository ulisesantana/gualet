import { describe, expect, it, vi } from "vitest";
import { CategoryRepository } from "@application/repositories";
import { Category, Id, OperationType } from "@gualet/shared";

import { SaveCategoryUseCase } from "./save-category.use-case";

const mockRepository: CategoryRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
};

describe("SaveCategoryUseCase", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should save a category using the repository", async () => {
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
  });
});
