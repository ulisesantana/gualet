import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";

import { CategoryCard } from "./CategoryCard";

describe("CategoryCard", () => {
  const mockCategory: Category = new Category({
    id: new Id("1"),
    name: "Food",
    type: OperationType.Outcome,
  });

  it("renders the category title and type", () => {
    render(<CategoryCard category={mockCategory} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText(/outcome/i)).toBeInTheDocument();
  });

  it("renders edit button for the category", () => {
    render(<CategoryCard category={mockCategory} />);

    const editButton = screen.getByLabelText("Edit category");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute("title", "Edit");
  });

  it("applies the outcome CSS class when the category type is outcome", () => {
    render(<CategoryCard category={mockCategory} />);

    const typeElement = screen.getByText(/outcome/i);
    expect(typeElement).toHaveClass("outcome");
  });

  it("applies the income CSS class when the category type is income", () => {
    const incomeCategory: Category = new Category({
      id: new Id("2"),
      name: "Salary",
      type: OperationType.Income,
    });

    render(<CategoryCard category={incomeCategory} />);

    const typeElement = screen.getByText(/income/i);
    expect(typeElement).toHaveClass("income");
  });
});
