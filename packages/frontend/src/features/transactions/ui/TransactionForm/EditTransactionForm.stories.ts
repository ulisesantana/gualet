import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  OperationType,
  Transaction,
} from "@gualet/shared";

import { EditTransactionForm } from "./EditTransactionForm";

const settings = {
  incomeCategories: generateDefaultIncomeCategories(),
  outcomeCategories: generateDefaultOutcomeCategories(),
  paymentMethods: generateDefaultPaymentMethods(),
};

const meta = {
  title: "Transactions/EditTransactionForm",
  component: EditTransactionForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Form pre-filled with an income transaction ready to edit. */
export const IncomeTransaction: Story = {
  args: {
    transaction: new Transaction({
      amount: 1850,
      category: settings.incomeCategories[0],
      date: new Day("2024-09-01"),
      description: "September salary",
      operation: OperationType.Income,
      paymentMethod: settings.paymentMethods[0],
    }),
    onSubmit: fn().mockResolvedValue(undefined),
    settings,
  },
};

/** Form pre-filled with an outcome transaction ready to edit. */
export const OutcomeTransaction: Story = {
  args: {
    transaction: new Transaction({
      amount: 45.8,
      category: settings.outcomeCategories[0],
      date: new Day("2024-09-02"),
      description: "SPAR Supermarket",
      operation: OperationType.Outcome,
      paymentMethod: settings.paymentMethods[0],
    }),
    onSubmit: fn().mockResolvedValue(undefined),
    settings,
  },
};
