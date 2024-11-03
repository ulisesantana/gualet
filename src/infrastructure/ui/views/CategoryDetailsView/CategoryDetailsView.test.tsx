import { describe, expect, it, Mock, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Category, Id, TransactionOperation } from "@domain/models";
import { CategoryDetailsView } from "@views";
import { useRepositories } from "@infrastructure/ui/hooks";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  EditCategoryForm: ({ category }: { category: Category }) => (
    <div>Edit form for {category.name}</div>
  ),
}));

describe("CategoryDetailsView", () => {
  const mockSetIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRepositories as Mock).mockReturnValue({
      isReady: true,
      repositories: {
        category: {
          findById: async (id: Id) =>
            id.toString() === "1"
              ? new Category({
                  id: new Id("1"),
                  name: "Food",
                  type: TransactionOperation.Outcome,
                })
              : undefined,
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });
  });

  it("renders Loader when loading is true", async () => {
    (useRepositories as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: { category: {} },
      isLoading: true,
      setIsLoading: mockSetIsLoading,
    });

    render(<CategoryDetailsView />);

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders EditCategoryForm with category data after loading", async () => {
    render(
      <Router>
        <TestRouter path={"/categories/details/1"} />
        <CategoryDetailsView />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit form for Food")).toBeInTheDocument();
    });
  });

  it("displays an error message if category is not found", async () => {
    (useRepositories as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: {
        category: {
          findById: async () => undefined,
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    render(
      <Router>
        <TestRouter path="/categories/details/2" />
        <CategoryDetailsView />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("Category not found.")).toBeInTheDocument();
    });
  });
});
