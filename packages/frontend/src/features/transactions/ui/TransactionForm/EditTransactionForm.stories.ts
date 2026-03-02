import type { Meta, StoryObj } from "@storybook/react";
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

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Transactions/EditTransactionForm",
  component: EditTransactionForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof EditTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const EditForm: Story = {
  args: {
    transaction: new Transaction({
      amount: 100,
      category: settings.incomeCategories[0],
      date: new Day("2023-09-08"),
      description: "September salary",
      operation: OperationType.Income,
      paymentMethod: settings.paymentMethods[0],
    }),
    async onSubmit() {},
    settings,
  },
};
