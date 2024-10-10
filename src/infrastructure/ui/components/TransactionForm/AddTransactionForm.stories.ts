import type { Meta, StoryObj } from "@storybook/react";
import { Category, TransactionOperation } from "@domain/models";
import { AddTransactionForm } from "@components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "AddTransactionForm",
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
    async onSubmit() {},
    settings: {
      incomeCategories: [
        new Category({
          icon: "💰",
          type: TransactionOperation.Income,
          name: "Salary",
        }),
        new Category({
          icon: "🏷️",
          type: TransactionOperation.Income,
          name: "Sales",
        }),
      ],
      outcomeCategories: [
        new Category({
          icon: "🚖",
          type: TransactionOperation.Outcome,
          name: "Taxi",
        }),
        new Category({
          icon: "👨🏻‍🍳",
          type: TransactionOperation.Outcome,
          name: "Restaurant",
        }),
      ],
      types: ["Credit card", "Cash", "Bizum", "Bank transfer"],
    },
  },
};
