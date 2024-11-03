import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Category, Id, TransactionOperation } from "@domain/models";

import { CategoryCard } from "./CategoryCard";

describe("CategoryCard", () => {
  const mockCategory: Category = new Category({
    id: new Id("1"),
    name: "Food",
    type: TransactionOperation.Outcome,
  });

  it("renders the category title and type", () => {
    render(<CategoryCard category={mockCategory} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText(/outcome/i)).toBeInTheDocument();
  });

  it("generates a link to the correct path based on category ID", () => {
    render(<CategoryCard category={mockCategory} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categories/details/1");
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
      type: TransactionOperation.Income,
    });

    render(<CategoryCard category={incomeCategory} />);

    const typeElement = screen.getByText(/income/i);
    expect(typeElement).toHaveClass("income");
  });
});
