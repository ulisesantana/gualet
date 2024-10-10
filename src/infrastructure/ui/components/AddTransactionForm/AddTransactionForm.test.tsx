import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TransactionOperation } from "domain/models";

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
    incomeCategories: ["Salary", "Investments"],
    outcomeCategories: ["Groceries", "Entertainment"],
  };

  const setup = (overrides: Partial<AddTransactionFormProps> = {}) => {
    mockOnSubmit = jest.fn(() => Promise.resolve());
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
    expect(screen.getByLabelText(/Day:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Month:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type:/i)).toBeInTheDocument();
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
    expect(initialCategories).toContain("Groceries");
    expect(initialCategories).toContain("Entertainment");

    // Change operation to income
    fireEvent.change(screen.getByLabelText(/Operation:/i), {
      target: { value: TransactionOperation.Income },
    });

    const incomeCategories = getCategoryOptions();
    expect(incomeCategories).toHaveLength(mockSettings.incomeCategories.length);
    expect(incomeCategories).toContain("Salary");
    expect(incomeCategories).toContain("Investments");
  });

  it("calls onSubmit with correct transaction data on form submit", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount:/i), {
      target: { value: 10.5 },
    });
    fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText(/Day:/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/Month:/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/Type:/i), {
      target: { value: "Cash" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: "+" }));

    await waitFor(() => {
      expect(mockOnSubmit.mock.lastCall[0].amount).toBe(10.5);
      expect(mockOnSubmit.mock.lastCall[0].category).toBe("Groceries");
      expect(mockOnSubmit.mock.lastCall[0].day).toBe("20");
      expect(mockOnSubmit.mock.lastCall[0].month).toBe("12");
      expect(mockOnSubmit.mock.lastCall[0].description).toBe(
        "Test transaction",
      );
      expect(mockOnSubmit.mock.lastCall[0].type).toBe("Cash");
      expect(mockOnSubmit.mock.lastCall[0].operation).toBe(
        TransactionOperation.Outcome,
      );
    });
  });

  // TODO: Is not working for some reason
  it("resets the form after successful submission", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount:/i), {
      target: { value: 42.5 },
    });
    fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText(/Day:/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/Month:/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(screen.getByLabelText(/Type:/i), {
      target: { value: "Cash" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: "+" }));

    await waitFor(() => {
      // Check that the form resets after submission
      expect(element.querySelector('[name="operation"]')).toHaveValue(
        TransactionOperation.Outcome,
      );
      expect(element.querySelector('[name="description"]')).toHaveValue("");
      expect(element.querySelector('[name="amount"]')).toHaveValue(null);
      expect(element.querySelector('[name="category"]')).toHaveValue("");
      expect(element.querySelector('[name="day"]')).toHaveValue("20");
      expect(element.querySelector('[name="month"]')).toHaveValue("12");
    });
  });
});
