import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";

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
    render(<CategoryForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
  });

  it("should populate form with category data when provided", () => {
    const onSubmit = vi.fn();
    render(<CategoryForm category={mockCategory} onSubmit={onSubmit} />);

    const operationSelect = screen.getByLabelText(
      /operation/i,
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
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByTestId("error-message")).toHaveTextContent(
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
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
      });

      // Second submission - should succeed and clear error
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
      });
    }
  });

  it("should have name input field", () => {
    const onSubmit = vi.fn();
    render(<CategoryForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it("should have icon input field", () => {
    const onSubmit = vi.fn();
    render(<CategoryForm onSubmit={onSubmit} />);

    const iconInput = screen.getByLabelText(/icon/i);
    expect(iconInput).toBeInTheDocument();
  });

  it("should render without errors", () => {
    const onSubmit = vi.fn();
    expect(() => {
      render(<CategoryForm onSubmit={onSubmit} />);
    }).not.toThrow();
  });
});
