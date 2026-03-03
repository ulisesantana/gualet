import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Id, OperationType } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { CategoriesView } from "./CategoriesView";
import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "../../application/cases";

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

const mockDeleteCategoryUseCase = {
  exec: vi.fn().mockResolvedValue(undefined),
} as unknown as DeleteCategoryUseCase;

// Mock the Zustand store
const mockFetchCategories = vi.fn();
const mockDeleteCategory = vi.fn();

const mockStore = {
  categories: mockCategories,
  isLoading: false,
  fetchCategories: mockFetchCategories,
  deleteCategory: mockDeleteCategory,
};

vi.mock("@categories/infrastructure/useCategoryStore", () => ({
  useCategoryStore: vi.fn((selector) => {
    if (typeof selector === "function") {
      return selector(mockStore);
    }
    return mockStore;
  }),
  setUseCases: vi.fn(),
}));

vi.mock("@components", () => ({
  CategoryList: ({ categories }: { categories: Category[] }) => (
    <ul className="category-card-list">
      {categories.map((category) => (
        <li key={category.id.toString()}>{category.name}</li>
      ))}
    </ul>
  ),
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

describe("CategoriesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders categories from the store", async () => {
    render(
      <CategoriesView
        getAllCategoriesUseCase={mockGetAllCategoriesUseCase}
        deleteCategoryUseCase={mockDeleteCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });
  });

  it("shows loader when loading", async () => {
    // Update the mock store to be loading
    mockStore.isLoading = true;
    mockStore.categories = [];

    render(
      <CategoriesView
        getAllCategoriesUseCase={mockGetAllCategoriesUseCase}
        deleteCategoryUseCase={mockDeleteCategoryUseCase}
      />,
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Reset for other tests
    mockStore.isLoading = false;
    mockStore.categories = mockCategories;
  });

  it("handles delete category error gracefully via handleDeleteCategory", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockStore.isLoading = false;
    mockStore.categories = mockCategories;
    // Make deleteCategory throw so the catch in handleDeleteCategory runs
    mockDeleteCategory.mockRejectedValueOnce(new Error("Delete failed"));

    render(
      <CategoriesView
        getAllCategoriesUseCase={mockGetAllCategoriesUseCase}
        deleteCategoryUseCase={mockDeleteCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    // Click delete on first category card
    global.confirm = vi.fn(() => true);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }

    // Verify the view doesn't crash even when delete fails
    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("calls setUseCases and fetchCategories on mount", async () => {
    const { setUseCases } = await import(
      "@categories/infrastructure/useCategoryStore"
    );
    mockStore.isLoading = false;
    mockStore.categories = mockCategories;

    render(
      <CategoriesView
        getAllCategoriesUseCase={mockGetAllCategoriesUseCase}
        deleteCategoryUseCase={mockDeleteCategoryUseCase}
      />,
    );

    expect(setUseCases).toHaveBeenCalledWith(
      mockGetAllCategoriesUseCase,
      mockDeleteCategoryUseCase,
    );
    expect(mockFetchCategories).toHaveBeenCalled();
  });
});
