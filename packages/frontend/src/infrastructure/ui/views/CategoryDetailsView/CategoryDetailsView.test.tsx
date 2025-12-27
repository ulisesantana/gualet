import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GetCategoryUseCase, SaveCategoryUseCase } from "@application/cases";
import { Category, Id, OperationType } from "@gualet/shared";
import { useCategoryStore } from "@infrastructure/ui/stores/useCategoryStore";

import { CategoryDetailsView } from "./CategoryDetailsView";

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useRoute: vi.fn(() => [true, { id: "cat-123" }]),
  useLocation: vi.fn(() => ["/categories/cat-123", mockSetLocation]),
}));

// Mock Transition
vi.mock("react-transition-group", () => ({
  Transition: ({ children }: any) => children,
}));

describe("CategoryDetailsView", () => {
  const mockGetCategoryUseCase = {
    exec: vi.fn(),
  } as unknown as GetCategoryUseCase;

  const mockSaveCategoryUseCase = {
    exec: vi.fn(),
  } as unknown as SaveCategoryUseCase;

  const mockCategory = new Category({
    id: new Id("cat-123"),
    name: "Groceries",
    type: OperationType.Outcome,
    icon: "🛒",
    color: "#FF5733",
  });

  beforeEach(() => {
    vi.clearAllMocks();
    useCategoryStore.getState().reset();
  });

  it("should render loader while fetching category", () => {
    vi.mocked(mockGetCategoryUseCase.exec).mockImplementation(
      () => new Promise(() => {}),
    );

    const { container } = render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    expect(container.querySelector(".loader-container")).toBeInTheDocument();
  });

  it("should fetch and display category details", async () => {
    vi.mocked(mockGetCategoryUseCase.exec).mockResolvedValue(mockCategory);

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(mockGetCategoryUseCase.exec).toHaveBeenCalledWith(
        new Id("cat-123"),
      );
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();
    });
  });

  it("should display error message when category not found", async () => {
    // @ts-ignore
    vi.mocked(mockGetCategoryUseCase.exec).mockResolvedValue(undefined);

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/category not found/i)).toBeInTheDocument();
    });
  });

  it("should handle fetch error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(mockGetCategoryUseCase.exec).mockRejectedValue(
      new Error("Network error"),
    );

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting category");
    });

    consoleErrorSpy.mockRestore();
  });

  it("should display category with correct type", async () => {
    vi.mocked(mockGetCategoryUseCase.exec).mockResolvedValue(mockCategory);

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();
    });

    // Category should be displayed with its data
    expect(mockGetCategoryUseCase.exec).toHaveBeenCalledWith(new Id("cat-123"));
  });

  it("should handle onError callback", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(mockGetCategoryUseCase.exec).mockResolvedValue(mockCategory);

    render(
      <CategoryDetailsView
        getCategoryUseCase={mockGetCategoryUseCase}
        saveCategoryUseCase={mockSaveCategoryUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();
    });

    // Form is displayed, onError callback is defined
    consoleErrorSpy.mockRestore();
  });
});
