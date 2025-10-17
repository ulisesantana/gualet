import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";
import { CategoriesView } from "@views";
import { GetAllCategoriesUseCase } from "@application/cases";

const mockCategories = [
  new Category({
    id: new Id("1"),
    name: "Food",
    type: OperationType.Outcome,
  }),
  new Category({
    id: new Id("2"),
    name: "Salary",
    type: OperationType.Income,
  }),
];

const mockGetAllCategoriesUseCase = {
  exec: vi.fn().mockResolvedValue(mockCategories),
} as unknown as GetAllCategoriesUseCase;

vi.mock("@infrastructure/ui/hooks", () => ({
  useLoader: vi.fn(() => ({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div>Loader</div>,
  })),
}));

vi.mock("@components", () => ({
  CategoryList: ({ categories }: { categories: Category[] }) => (
    <div>
      {categories.map((category) => (
        <div key={category.id.toString()}>{category.name}</div>
      ))}
    </div>
  ),
}));

describe("CategoriesView", () => {
  it("renders Loader when loading is true", async () => {
    const { useLoader } = await import("@infrastructure/ui/hooks");
    (useLoader as any).mockReturnValueOnce({
      isLoading: true,
      setIsLoading: vi.fn(),
      Loader: () => <div>Loader</div>,
    });

    render(
      <CategoriesView getAllCategoriesUseCase={mockGetAllCategoriesUseCase} />,
    );

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders CategoryList with categories after loading", async () => {
    render(
      <CategoriesView getAllCategoriesUseCase={mockGetAllCategoriesUseCase} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });
  });
});
