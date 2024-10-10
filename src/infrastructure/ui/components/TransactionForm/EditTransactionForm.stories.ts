import type { Meta, StoryObj } from "@storybook/react";
import {
  Category,
  Day,
  Transaction,
  TransactionOperation,
} from "@domain/models";
import { EditTransactionForm } from "@components";

const settings = {
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
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "EditTransactionForm",
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
      operation: TransactionOperation.Income,
      paymentMethod: "Cash",
    }),
    async onSubmit() {},
    settings,
  },
};
