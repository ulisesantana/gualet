import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditTransactionForm, EditTransactionFormProps } from "@components";
import {
  Category,
  Day,
  Transaction,
  TransactionOperation,
} from "@domain/models";
import { Mock, vi } from "vitest";

describe("EditTransactionForm", () => {
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

  const mockTransaction = new Transaction({
    amount: 100,
    category: mockSettings.outcomeCategories[0],
    date: new Day("2023-09-08"),
    description: "",
    operation: TransactionOperation.Outcome,
    paymentMethod: mockSettings.types[0],
  });

  const setup = (overrides: Partial<EditTransactionFormProps> = {}) => {
    mockOnSubmit = vi.fn(async () => {});
    const props: EditTransactionFormProps = {
      transaction: mockTransaction,
      settings: mockSettings,
      onSubmit: mockOnSubmit,
      ...overrides,
    };

    const { container } = render(<EditTransactionForm {...props} />);

    element = container;
  };

  it("renders the form with given values", () => {
    setup();

    expect(screen.getByLabelText(/Operation:/i)).toHaveValue(
      mockTransaction.operation,
    );
    expect(
      screen.findByDisplayValue(mockTransaction.category.title),
    ).not.toBeUndefined();
    expect(screen.getByLabelText(/Amount:/i)).toHaveValue(
      mockTransaction.amount,
    );
    expect(screen.getByLabelText(/Date:/i)).toHaveValue(
      mockTransaction.date.toString("-"),
    );
    expect(screen.getByLabelText(/Description:/i)).toHaveValue(
      mockTransaction.description,
    );
    expect(screen.getByLabelText(/Payment method:/i)).toHaveValue(
      mockTransaction.paymentMethod,
    );
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
      mockSettings.outcomeCategories[0].title,
    );
    expect(initialCategories).toContain(
      mockSettings.outcomeCategories[1].title,
    );

    // Change operation to income
    fireEvent.change(screen.getByLabelText(/Operation:/i), {
      target: { value: TransactionOperation.Income },
    });

    const incomeCategories = getCategoryOptions();
    expect(incomeCategories).toHaveLength(mockSettings.incomeCategories.length);
    expect(incomeCategories).toContain(mockSettings.incomeCategories[0].title);
    expect(incomeCategories).toContain(mockSettings.incomeCategories[1].title);
  });

  it("calls onSubmit with correct transaction data on form submit", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount:/i), {
      target: { value: 10.5 },
    });
    fireEvent.change(screen.getByLabelText(/Category:/i), {
      target: { value: mockSettings.outcomeCategories[0].title },
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
      expect(mockOnSubmit.mock.lastCall![0].amount).toBe(10.5);
      expect(mockOnSubmit.mock.lastCall![0].category.name).toBe("Groceries");
      expect(mockOnSubmit.mock.lastCall![0].date.toString()).toBe("2023/09/08");
      expect(mockOnSubmit.mock.lastCall![0].description).toBe(
        "Test transaction",
      );
      expect(mockOnSubmit.mock.lastCall![0].paymentMethod).toBe("Cash");
      expect(mockOnSubmit.mock.lastCall![0].operation).toBe(
        TransactionOperation.Outcome,
      );
    });
  });
});
