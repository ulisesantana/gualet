import { describe, expect, it, Mock, vi } from "vitest";
import { CategoryRepository } from "@application/repositories";
import { Category, TransactionOperation } from "@domain/models";
import { GetAllCategoriesUseCase } from "@application/cases";

// Mock for the CategoryRepository
const mockCategoryRepository: CategoryRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
};

describe("GetAllCategoriesUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all categories from the repository", async () => {
    const mockCategories: Category[] = [
      new Category({ name: "Groceries", type: TransactionOperation.Outcome }),
      new Category({ name: "Salary", type: TransactionOperation.Income }),
    ];

    (mockCategoryRepository.findAll as Mock).mockResolvedValue(mockCategories);

    const categories = await new GetAllCategoriesUseCase(
      mockCategoryRepository,
    ).exec();

    expect(categories).toEqual(mockCategories);
    expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
