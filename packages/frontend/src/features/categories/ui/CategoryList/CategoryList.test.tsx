import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Id, OperationType } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { CategoryList } from "./CategoryList";

vi.mock("wouter", () => ({
  useLocation: vi.fn(() => ["/categories", vi.fn()]),
}));

describe("CategoryList", () => {
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

  beforeEach(() => {
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();
    vi.clearAllMocks();
  });

  it("renders a list of CategoryCard components for each category", () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByText(/Food/)).toBeInTheDocument();
    expect(screen.getByText(/Salary/)).toBeInTheDocument();
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

  it("passes onDeleteCategory to each CategoryCard", async () => {
    const onDeleteCategory = vi.fn().mockResolvedValue(undefined);
    render(
      <CategoryList
        categories={mockCategories}
        onDeleteCategory={onDeleteCategory}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(mockCategories.length);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(onDeleteCategory).toHaveBeenCalledWith("1");
    });
  });

  it("renders without onDeleteCategory (no delete buttons shown)", () => {
    render(<CategoryList categories={mockCategories} />);

    const deleteButtons = screen.queryAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(0);
  });
});
