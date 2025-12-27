import { describe, expect, it, Mock, vi } from "vitest";
import { CategoryRepository } from "../category.repository";
import { Category, OperationType } from "@gualet/shared";
import { GetAllCategoriesUseCase } from "../cases";

// Mock for the CategoryRepository
const mockCategoryRepository: CategoryRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

describe("GetAllCategoriesUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all categories from the repository", async () => {
    const mockCategories: Category[] = [
      new Category({ name: "Groceries", type: OperationType.Outcome }),
      new Category({ name: "Salary", type: OperationType.Income }),
    ];

    (mockCategoryRepository.findAll as Mock).mockResolvedValue(mockCategories);

    const categories = await new GetAllCategoriesUseCase(
      mockCategoryRepository,
    ).exec();

    expect(categories).toEqual(mockCategories);
    expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
