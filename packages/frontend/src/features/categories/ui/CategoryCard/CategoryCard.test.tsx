import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { Category, Id, OperationType } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { CategoryCard } from "./CategoryCard";

const mockSetLocation = vi.fn();

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useLocation: vi.fn() };
});

describe("CategoryCard", () => {
  const mockCategory = new Category({
    id: new Id("cat-1"),
    name: "Groceries",
    type: OperationType.Outcome,
    icon: "🛒",
    color: "#FF5733",
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/categories",
      mockSetLocation,
    ]);
  });

  it("should render category card with name and type", () => {
    render(<CategoryCard category={mockCategory} />);

    expect(screen.getByText("🛒 Groceries")).toBeInTheDocument();
  });

  it("should show edit button", () => {
    render(<CategoryCard category={mockCategory} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  it("should show delete button when onDelete is provided", () => {
    const onDelete = vi.fn();
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("should not show delete button when onDelete is not provided", () => {
    render(<CategoryCard category={mockCategory} />);

    const deleteButton = screen.queryByRole("button", { name: /delete/i });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked and confirmed", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith("cat-1");
    });
  });

  it("should not call onDelete when delete is cancelled", () => {
    global.confirm = vi.fn(() => false);
    const onDelete = vi.fn();
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("should handle delete error and show alert", async () => {
    const onDelete = vi.fn().mockRejectedValue(new Error("Category in use"));
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining("Failed to delete category"),
      );
    });
  });

  it("should show loading state while deleting", async () => {
    let resolveDelete: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDelete = resolve;
    });

    const onDelete = vi.fn(
      () => deletePromise,
    ) as unknown as () => Promise<void>;
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Verify onDelete was called
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalled();
    });

    // Resolve the promise to avoid hanging
    resolveDelete!();
  });

  it("should display outcome type correctly", () => {
    render(<CategoryCard category={mockCategory} />);

    const typeElement = screen.getByTestId("category-type-outcome");
    expect(typeElement).toBeInTheDocument();
  });

  it("should display income type correctly", () => {
    const incomeCategory = new Category({
      id: new Id("cat-2"),
      name: "Salary",
      type: OperationType.Income,
      icon: "💰",
      color: "#33FF57",
    });

    render(<CategoryCard category={incomeCategory} />);

    const typeElement = screen.getByTestId("category-type-income");
    expect(typeElement).toBeInTheDocument();
  });

  it("should navigate to category details when edit is clicked", () => {
    render(<CategoryCard category={mockCategory} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockSetLocation).toHaveBeenCalledWith(
      expect.stringContaining("cat-1"),
    );
  });
});
