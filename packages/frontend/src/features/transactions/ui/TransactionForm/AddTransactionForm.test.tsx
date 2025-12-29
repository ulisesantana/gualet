import React from "react";
import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  OperationType,
  TransactionConfig,
} from "@gualet/shared";
import { Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { AddTransactionForm } from "./AddTransactionForm";

interface AddTransactionFormProps {
  defaultPaymentMethod: string;
  settings: TransactionConfig;
  onSubmit: (transaction: any) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

let mockOnSubmit: Mock;
let element: HTMLElement;

const mockSettings: TransactionConfig = {
  paymentMethods: generateDefaultPaymentMethods(),
  incomeCategories: generateDefaultIncomeCategories(),
  outcomeCategories: generateDefaultOutcomeCategories(),
};

const setup = (overrides: Partial<AddTransactionFormProps> = {}) => {
  mockOnSubmit = vi.fn(async () => {});
  const props: AddTransactionFormProps = {
    defaultPaymentMethod: generateDefaultPaymentMethods()[0].title,
    settings: mockSettings,
    onSubmit: mockOnSubmit,
    ...overrides,
  };

  const { container } = render(<AddTransactionForm {...props} />);

  element = container;
};

describe("AddTransactionForm", () => {
  it("renders the form with initial values", () => {
    setup();

    expect(element.querySelector('[name="operation"]')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter amount/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter description/i),
    ).toBeInTheDocument();
    expect(element.querySelector('[name="date"]')).toBeInTheDocument();
    expect(
      element.querySelector('[name="payment-method"]'),
    ).toBeInTheDocument();
    expect(element.querySelector('[name="category"]')).toBeInTheDocument();
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
    const operationSelect = element.querySelector(
      '[name="operation"]',
    ) as HTMLSelectElement;
    fireEvent.change(operationSelect, {
      target: { value: OperationType.Income },
    });

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

  it("resets the form after successful submission", async () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: 42.5 },
    });
    fireEvent.change(element.querySelector('[name="category"]')!, {
      target: { value: mockSettings.outcomeCategories[1].title },
    });
    fireEvent.change(element.querySelector('[name="date"]')!, {
      target: { value: "2024-01-06" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "Test transaction" },
    });
    fireEvent.change(element.querySelector('[name="payment-method"]')!, {
      target: { value: mockSettings.paymentMethods[1].title },
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId("submit-transaction-button"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Check that the form resets after submission
      // Operation resets to OUTCOME (default)
      expect(element.querySelector('[name="operation"]')).toHaveValue(
        "OUTCOME",
      );
      expect(element.querySelector('[name="description"]')).toHaveValue("");
      expect(element.querySelector('[name="amount"]')).toHaveValue(null);
      expect(element.querySelector('[name="category"]')).toHaveValue("");
    });
  });
});
