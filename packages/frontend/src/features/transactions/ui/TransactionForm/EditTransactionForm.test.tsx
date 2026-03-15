import React from "react";
import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  OperationType,
  Transaction,
  TransactionConfig,
} from "@gualet/shared";
import { Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { EditTransactionForm } from "./EditTransactionForm";

interface EditTransactionFormProps {
  transaction: Transaction;
  settings: TransactionConfig;
  onSubmit: (transaction: Transaction) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

describe("EditTransactionForm", () => {
  let mockOnSubmit: Mock;
  let element: HTMLElement;

  const mockSettings: TransactionConfig = {
    paymentMethods: generateDefaultPaymentMethods(),
    incomeCategories: generateDefaultIncomeCategories(),
    outcomeCategories: generateDefaultOutcomeCategories(),
  };

  const mockTransaction = new Transaction({
    amount: 100,
    category: mockSettings.outcomeCategories[0],
    date: new Day("2023-09-08"),
    description: "",
    operation: OperationType.Outcome,
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

    const operationInput = element.querySelector(
      '[name="operation"]',
    ) as HTMLInputElement;
    expect(operationInput).toHaveValue(mockTransaction.operation);

    expect(
      screen.findByDisplayValue(mockTransaction.category.title),
    ).not.toBeUndefined();

    const amountInput = screen.getByPlaceholderText(
      /enter amount/i,
    ) as HTMLInputElement;
    expect(amountInput).toHaveValue(mockTransaction.amount);

    const dateInput = element.querySelector(
      '[name="date"]',
    ) as HTMLInputElement;
    expect(dateInput).toHaveValue(mockTransaction.date.toString("-"));

    const descriptionInput = screen.getByPlaceholderText(
      /enter description/i,
    ) as HTMLInputElement;
    expect(descriptionInput).toHaveValue(mockTransaction.description);

    const paymentSelect = element.querySelector(
      '[name="payment-method"]',
    ) as HTMLSelectElement;
    expect(paymentSelect).toHaveValue(mockTransaction.paymentMethod.title);
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
    const incomeButton = screen.getByText(OperationType.Income);
    fireEvent.click(incomeButton);

    const incomeCategories = getCategoryOptions();
    expect(incomeCategories).toHaveLength(mockSettings.incomeCategories.length);
    expect(incomeCategories).toContain(mockSettings.incomeCategories[0].title);
    expect(incomeCategories).toContain(mockSettings.incomeCategories[1].title);
  });

  it("calls onSubmit with correct transaction data on form submit", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: 10.5 },
    });
    fireEvent.change(element.querySelector('[name="category"]')!, {
      target: { value: mockSettings.outcomeCategories[0].title },
    });
    fireEvent.change(element.querySelector('[name="date"]')!, {
      target: { value: "2023-09-08" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(element.querySelector('[name="payment-method"]')!, {
      target: { value: mockSettings.paymentMethods[0].title },
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId("submit-transaction-button"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit.mock.lastCall![0].amount).toBe(10.5);
      expect(mockOnSubmit.mock.lastCall![0].category.name).toBe("Rent");
      expect(mockOnSubmit.mock.lastCall![0].date.toString()).toBe("2023-09-08");
      expect(mockOnSubmit.mock.lastCall![0].description).toBe(
        "Test transaction",
      );
      expect(mockOnSubmit.mock.lastCall![0].paymentMethod.name).toBe(
        "Credit card",
      );
      expect(mockOnSubmit.mock.lastCall![0].operation).toBe(
        OperationType.Outcome,
      );
    });
  });
});
