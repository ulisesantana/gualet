import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Category, Id, TransactionOperation } from "@domain/models";

import { CategoryList } from "./CategoryList";

describe("CategoryList", () => {
  const mockCategories = [
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
  ];

  it("renders a list of CategoryCard components for each category", () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(mockCategories.length);
  });

  it("displays a message when there are no categories", () => {
    render(<CategoryList categories={[]} />);

    expect(screen.getByText("There are no categories")).toBeInTheDocument();
  });

  it("assigns correct data-id attribute to each list item", () => {
    render(<CategoryList categories={mockCategories} />);

    mockCategories.forEach((category) => {
      const listItem = screen.queryByTestId(`category-item-${category.id}`);
      expect(listItem).not.toBeNull();
    });
  });
});
