import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { CategoryRepository } from "@application/repositories";
import { Category, Id, TransactionOperation } from "@domain/models";
import { GetCategoryUseCase } from "@application/cases";

const mockCategoryRepository: CategoryRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
};

describe("GetCategoryUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a category by its id", async () => {
    const mockCategory = new Category({
      id: new Id("cat1"),
      name: "Groceries",
      type: TransactionOperation.Outcome,
      icon: "🛒",
    });

    const mockId = new Id("cat1");

    (mockCategoryRepository.findById as Mock).mockResolvedValue(mockCategory);

    const useCase = new GetCategoryUseCase(mockCategoryRepository);
    const category = await useCase.exec(mockId);

    expect(category).toEqual(mockCategory);
    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(mockId);
    expect(mockCategoryRepository.findById).toHaveBeenCalledTimes(1);
  });
});
