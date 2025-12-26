import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";
import { CategoriesView } from "@views";
import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "@application/cases";

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

vi.mock("@infrastructure/ui/stores/useCategoryStore", () => ({
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
    <div data-testid="category-list">
      {categories.map((category) => (
        <div key={category.id.toString()}>{category.name}</div>
      ))}
    </div>
  ),
  Loader: () => <div>Loader</div>,
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

    expect(screen.getByText("Loader")).toBeInTheDocument();

    // Reset for other tests
    mockStore.isLoading = false;
    mockStore.categories = mockCategories;
  });
});
