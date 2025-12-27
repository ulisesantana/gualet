import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";

import { CategoryCard } from "./CategoryCard";

vi.mock("wouter", () => ({
  useLocation: vi.fn(() => ["/categories", vi.fn()]),
}));

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
    const onDelete = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    ) as unknown as () => Promise<void>;
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteButton).toHaveTextContent("⏳");
    });
  });

  it("should display outcome type correctly", () => {
    const { container } = render(<CategoryCard category={mockCategory} />);

    const typeElement = container.querySelector(".category-card-type.outcome");
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

    const { container } = render(<CategoryCard category={incomeCategory} />);

    const typeElement = container.querySelector(".category-card-type.income");
    expect(typeElement).toBeInTheDocument();
  });
});
