import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { CategoryRepository } from "@application/repositories";
import { Category, Id, OperationType } from "@gualet/shared";
import { GetCategoryUseCase } from "@application/cases";
import { CategoryNotFoundError } from "@domain/errors";

const mockRepository: CategoryRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

describe("GetCategoryUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a category by its id", async () => {
    const mockCategory = new Category({
      id: new Id("cat1"),
      name: "Groceries",
      type: OperationType.Outcome,
      icon: "🛒",
    });

    const mockId = new Id("cat1");

    (mockRepository.findById as Mock).mockResolvedValue(mockCategory);

    const useCase = new GetCategoryUseCase(mockRepository);
    const category = await useCase.exec(mockId);

    expect(category).toEqual(mockCategory);
    expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw CategoryNotFoundError if transaction is not found", async () => {
    mockRepository.findById = vi.fn().mockResolvedValue(null);

    const useCase = new GetCategoryUseCase(mockRepository);

    await expect(useCase.exec(new Id("non-existent"))).rejects.toThrowError(
      new CategoryNotFoundError(new Id("non-existent")),
    );
    expect(mockRepository.findById).toHaveBeenCalledWith(
      new Id("non-existent"),
    );
  });
});
