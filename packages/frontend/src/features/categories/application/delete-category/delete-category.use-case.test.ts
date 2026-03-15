import { CategoryRepository } from "../category.repository";
import { Id } from "@gualet/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteCategoryUseCase } from "./delete-category.use-case";

describe("DeleteCategoryUseCase", () => {
  let useCase: DeleteCategoryUseCase;
  let mockRepository: CategoryRepository;

  beforeEach(() => {
    mockRepository = {
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    useCase = new DeleteCategoryUseCase(mockRepository);
  });

  it("should delete a category by id", async () => {
    const categoryId = new Id("category-123");

    await useCase.exec(categoryId);

    expect(mockRepository.delete).toHaveBeenCalledWith(categoryId);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it("should throw error if repository delete fails", async () => {
    const categoryId = new Id("category-123");
    const error = new Error("Delete failed");
    vi.mocked(mockRepository.delete).mockRejectedValue(error);

    await expect(useCase.exec(categoryId)).rejects.toThrow("Delete failed");
  });
});
