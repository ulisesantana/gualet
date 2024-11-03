import { describe, expect, it, Mock, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Category, Id, TransactionOperation } from "@domain/models";
import { CategoriesView } from "@views";
import { useRepositories } from "@infrastructure/ui/hooks";

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  CategoryList: ({ categories }: { categories: Category[] }) => (
    <div>
      {categories.map((category) => (
        <div key={category.id.toString()}>{category.name}</div>
      ))}
    </div>
  ),
}));

describe("CategoriesView", () => {
  beforeEach(() => {
    (useRepositories as Mock).mockReturnValue({
      repositories: {
        category: {
          save: vi.fn(),
          findById: vi.fn(),
          findAll: async () => [
            new Category({
              id: new Id("1"),
              name: "Food",
              type: TransactionOperation.Outcome,
            }),
            new Category({
              id: new Id("2"),
              name: "Salary",
              type: TransactionOperation.Income,
            }),
          ],
        },
      },
      isReady: true,
      isLoading: false,
      setIsLoading: vi.fn(),
    });
  });

  it("renders Loader when loading is true", async () => {
    const mockSetIsLoading = vi.fn();
    (useRepositories as Mock).mockReturnValue({
      isReady: true,
      repositories: {
        category: {},
      },
      isLoading: true,
      setIsLoading: mockSetIsLoading,
    });
    render(<CategoriesView />);

    expect(screen.getByText("Loader")).toBeInTheDocument();
    expect(mockSetIsLoading).toHaveBeenCalled();
  });

  it("renders CategoryList with categories after loading", async () => {
    render(<CategoriesView />);

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });
  });
});
