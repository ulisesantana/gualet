import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Id, OperationType } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { CategoryForm } from "./CategoryForm";

describe("CategoryForm", () => {
  const mockCategory = new Category({
    id: new Id("cat-1"),
    name: "Groceries",
    type: OperationType.Outcome,
    icon: "🛒",
    color: "#FF5733",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with operation selector", () => {
    const onSubmit = vi.fn();
    const { container } = render(<CategoryForm onSubmit={onSubmit} />);

    const operationSelect = container.querySelector('[name="type"]');
    expect(operationSelect).toBeInTheDocument();
  });

  it("should populate form with category data when provided", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <CategoryForm category={mockCategory} onSubmit={onSubmit} />,
    );

    const operationSelect = container.querySelector(
      '[name="type"]',
    ) as HTMLSelectElement;
    expect(operationSelect.value).toBe("OUTCOME");
  });

  it("should call onError when submission fails", async () => {
    const error = new Error("Submission failed");
    const onSubmit = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const { container } = render(
      <CategoryForm onSubmit={onSubmit} onError={onError} />,
    );

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Submission failed",
        );
      });
    }
  });

  it("should call onSuccess when submission succeeds", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();

    const { container } = render(
      <CategoryForm onSubmit={onSubmit} onSuccess={onSuccess} />,
    );

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    }
  });

  it("should clear error message after successful submission", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce(undefined);

    const { container } = render(<CategoryForm onSubmit={onSubmit} />);

    const form = container.querySelector("form");
    if (form) {
      // First submission - should fail
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Second submission - should succeed and clear error
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    }
  });

  it("should have name input field", () => {
    const onSubmit = vi.fn();
    render(<CategoryForm onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText(/enter category name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it("should have icon input field", () => {
    const onSubmit = vi.fn();
    render(<CategoryForm onSubmit={onSubmit} />);

    const iconInput = screen.getByPlaceholderText(/add an emoji as an icon/i);
    expect(iconInput).toBeInTheDocument();
  });

  it("should render without errors", () => {
    const onSubmit = vi.fn();
    expect(() => {
      render(<CategoryForm onSubmit={onSubmit} />);
    }).not.toThrow();
  });
});
