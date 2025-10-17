import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/core";
import { CategoryDetailsView } from "@views";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import { GetCategoryUseCase, SaveCategoryUseCase } from "@application/cases";

const mockCategory = new Category({
  id: new Id("1"),
  name: "Food",
  type: OperationType.Outcome,
});

const mockGetCategoryUseCase = {
  exec: vi.fn().mockResolvedValue(mockCategory),
} as unknown as GetCategoryUseCase;

const mockSaveCategoryUseCase = {
  exec: vi.fn(),
} as unknown as SaveCategoryUseCase;

vi.mock("@infrastructure/ui/hooks", () => ({
  useLoader: vi.fn(() => ({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div>Loader</div>,
  })),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  EditCategoryForm: ({ category }: { category: Category }) => (
    <div>Edit form for {category.name}</div>
  ),
}));

describe("CategoryDetailsView", () => {
  it("renders Loader when loading is true", async () => {
    const { useLoader } = await import("@infrastructure/ui/hooks");
    (useLoader as any).mockReturnValueOnce({
      isLoading: true,
      setIsLoading: vi.fn(),
      Loader: () => <div>Loader</div>,
    });

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders EditCategoryForm with category data after loading", async () => {
    render(
      <Router>
        <TestRouter path={"/categories/details/1"} />
        <CategoryDetailsView
          getCategoryUseCase={mockGetCategoryUseCase}
          saveCategoryUseCase={mockSaveCategoryUseCase}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit form for Food")).toBeInTheDocument();
    });
  });

  it("displays an error message if category is not found", async () => {
    const mockGetCategoryUseCaseNotFound = {
      exec: vi.fn().mockResolvedValue(undefined),
    } as unknown as GetCategoryUseCase;

    render(
      <Router>
        <TestRouter path="/categories/details/2" />
        <CategoryDetailsView
          getCategoryUseCase={mockGetCategoryUseCaseNotFound}
          saveCategoryUseCase={mockSaveCategoryUseCase}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("Category not found.")).toBeInTheDocument();
    });
  });
});
