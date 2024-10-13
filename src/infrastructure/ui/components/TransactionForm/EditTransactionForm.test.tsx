import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditTransactionForm, EditTransactionFormProps } from "@components";
import {
  Day,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  defaultPaymentMethods,
  Transaction,
  TransactionOperation,
  TransactionConfig,
} from "@domain/models";
import { Mock, vi } from "vitest";

describe("EditTransactionForm", () => {
  let mockOnSubmit: Mock;
  let element: HTMLElement;

  const mockSettings: TransactionConfig = {
    paymentMethods: defaultPaymentMethods,
    incomeCategories: defaultIncomeCategories,
    outcomeCategories: defaultOutcomeCategories,
  };

  const mockTransaction = new Transaction({
    amount: 100,
    category: mockSettings.outcomeCategories[0],
    date: new Day("2023-09-08"),
    description: "",
    operation: TransactionOperation.Outcome,
    paymentMethod: mockSettings.paymentMethods[0],
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
      screen.findByDisplayValue(mockTransaction.category.id.toString()),
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
      mockTransaction.paymentMethod.id.toString(),
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
      target: { value: mockSettings.paymentMethods[1].id.toString() },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit.mock.lastCall![0].amount).toBe(10.5);
      expect(mockOnSubmit.mock.lastCall![0].category.name).toBe("Rent");
      expect(mockOnSubmit.mock.lastCall![0].date.toString()).toBe("2023-09-08");
      expect(mockOnSubmit.mock.lastCall![0].description).toBe(
        "Test transaction",
      );
      expect(mockOnSubmit.mock.lastCall![0].paymentMethod.name).toBe("Cash");
      expect(mockOnSubmit.mock.lastCall![0].operation).toBe(
        TransactionOperation.Outcome,
      );
    });
  });
});
