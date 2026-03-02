import type { Meta, StoryObj } from "@storybook/react";
import { Category, OperationType, PaymentMethod } from "@gualet/shared";

import { AddTransactionForm } from "./AddTransactionForm";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Transactions/AddTransactionForm",
  component: AddTransactionForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof AddTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AddForm: Story = {
  args: {
    defaultPaymentMethod: "💳 Credit card",
    async onSubmit() {},
    settings: {
      incomeCategories: [
        new Category({
          icon: "💰",
          type: OperationType.Income,
          name: "Salary",
        }),
        new Category({
          icon: "🏷️",
          type: OperationType.Income,
          name: "Sales",
        }),
      ],
      outcomeCategories: [
        new Category({
          icon: "🚖",
          type: OperationType.Outcome,
          name: "Taxi",
        }),
        new Category({
          icon: "👨🏻‍🍳",
          type: OperationType.Outcome,
          name: "Restaurant",
        }),
      ],
      paymentMethods: [
        new PaymentMethod({ icon: "💳", name: "Credit card" }),
        new PaymentMethod({ icon: "💶", name: "Cash" }),
        new PaymentMethod({ icon: "📱", name: "Bizum" }),
        new PaymentMethod({ icon: "🏦", name: "Bank transfer" }),
      ],
    },
  },
};
