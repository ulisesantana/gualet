import { describe, it, expect, vi } from "vitest";
import { CategoryRepository } from "@application/repositories";
import { Category, Id, TransactionOperation } from "@domain/models";

import { SaveCategoryUseCase } from "./save-category.use-case";

const mockRepository: CategoryRepository = {
  save: vi.fn(),
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
      type: TransactionOperation.Outcome,
      icon: "🛒",
    });

    const useCase = new SaveCategoryUseCase(mockRepository);

    await useCase.exec(category);

    expect(mockRepository.save).toHaveBeenCalledWith(category);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
