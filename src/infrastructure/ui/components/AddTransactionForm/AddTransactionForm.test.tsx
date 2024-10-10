import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Category, TransactionOperation } from "domain/models";

import {
  AddTransactionForm,
  AddTransactionFormProps,
} from "./AddTransactionForm";
import Mock = jest.Mock;

describe("AddTransactionForm", () => {
  let mockOnSubmit: Mock;
  let element: HTMLElement;

  const mockSettings = {
    types: ["Cash", "Card"],
    incomeCategories: [
      new Category({ type: TransactionOperation.Income, name: "Salary" }),
      new Category({ type: TransactionOperation.Income, name: "Investments" }),
    ],
    outcomeCategories: [
      new Category({ type: TransactionOperation.Outcome, name: "Groceries" }),
      new Category({
        type: TransactionOperation.Outcome,
        name: "Entertainment",
      }),
    ],
  };

  const setup = (overrides: Partial<AddTransactionFormProps> = {}) => {
    mockOnSubmit = jest.fn(async () => {});
    const props: AddTransactionFormProps = {
      settings: mockSettings,
      onSubmit: mockOnSubmit,
      ...overrides,
    };

    const { container } = render(<AddTransactionForm {...props} />);

    element = container;
  };

  it("renders the form with initial values", () => {
    setup();

    expect(screen.getByLabelText(/Operation:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment method:/i)).toBeInTheDocument();
  });

  it("updates the datalist options when operation changes", () => {
    setup();

    function getCategoryOptions() {
      return Array.from(
        element.querySelectorAll(
          "#category-options option",
        ) as NodeListOf<HTMLOptionElement>,
        (option: HTMLOptionElement) => option.value,
      );
    }

    // Initially, it should show outcome categories in datalist
    const initialCategories = getCategoryOptions();
    expect(initialCategories).toHaveLength(
      mockSettings.outcomeCategories.length,
    );
    expect(initialCategories).toContain(
      mockSettings.outcomeCategories[0].id.toString(),
    );
    expect(initialCategories).toContain(
      mockSettings.outcomeCategories[1].id.toString(),
    );

    // Change operation to income
    fireEvent.change(screen.getByLabelText(/Operation:/i), {
      target: { value: TransactionOperation.Income },
    });

    const incomeCategories = getCategoryOptions();
    expect(incomeCategories).toHaveLength(mockSettings.incomeCategories.length);
    expect(incomeCategories).toContain(
      mockSettings.incomeCategories[0].id.toString(),
    );
    expect(incomeCategories).toContain(
      mockSettings.incomeCategories[1].id.toString(),
    );
  });

  it("calls onSubmit with correct transaction data on form submit", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount:/i), {
      target: { value: 10.5 },
    });
    fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: mockSettings.outcomeCategories[0].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Date:/i), {
      target: { value: "2023-09-08" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/Payment method:/i), {
      target: { value: "Cash" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit.mock.lastCall[0].amount).toBe(10.5);
      expect(mockOnSubmit.mock.lastCall[0].category.name).toBe("Groceries");
      expect(mockOnSubmit.mock.lastCall[0].date.toString()).toBe("2023/09/08");
      expect(mockOnSubmit.mock.lastCall[0].description).toBe(
        "Test transaction",
      );
      expect(mockOnSubmit.mock.lastCall[0].paymentMethod).toBe("Cash");
      expect(mockOnSubmit.mock.lastCall[0].operation).toBe(
        TransactionOperation.Outcome,
      );
    });
  });

  // TODO: Is not working for some reason
  it.skip("resets the form after successful submission", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount:/i), {
      target: { value: 42.5 },
    });
    fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: mockSettings.outcomeCategories[1].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Date:/i), {
      target: { value: "2024-01-06" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/Payment method:/i), {
      target: { value: "Cash" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: "+" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      // Check that the form resets after submission
      expect(element.querySelector('[name="operation"]')).toHaveValue(
        TransactionOperation.Outcome,
      );
      expect(element.querySelector('[name="description"]')).toHaveValue("");
      expect(element.querySelector('[name="amount"]')).toHaveValue(null);
      expect(element.querySelector('[name="category"]')).toHaveValue("");
      expect(element.querySelector('[name="date"]')).toHaveValue("2024-01-06");
    });
  });
});
