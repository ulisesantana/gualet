import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
} from "@gualet/shared";

import { AddTransactionForm } from "./AddTransactionForm";

const paymentMethods = generateDefaultPaymentMethods();
const settings = {
  incomeCategories: generateDefaultIncomeCategories(),
  outcomeCategories: generateDefaultOutcomeCategories(),
  paymentMethods,
};

const meta = {
  title: "Transactions/AddTransactionForm",
  component: AddTransactionForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AddTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form to create a new transaction with a default payment method pre-selected. */
export const Default: Story = {
  args: {
    defaultPaymentMethod: paymentMethods[0].toString(),
    onSubmit: fn().mockResolvedValue(undefined),
    settings,
  },
};

/** Form without a pre-selected payment method. */
export const WithoutDefaultPaymentMethod: Story = {
  args: {
    onSubmit: fn().mockResolvedValue(undefined),
    settings,
  },
};
