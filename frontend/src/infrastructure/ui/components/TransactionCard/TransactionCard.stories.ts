import type { Meta, StoryObj } from "@storybook/react";
import { TransactionCard } from "@components";
import {
  Category,
  Day,
  Id,
  PaymentMethod,
  Transaction,
  TransactionOperation,
} from "@domain/models";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "TransactionCard",
  component: TransactionCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof TransactionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const OutTransaction: Story = {
  args: {
    transaction: new Transaction({
      id: new Id(),
      date: new Day("2024-09-01"),
      paymentMethod: new PaymentMethod({ icon: "💳", name: "Credit card" }),
      operation: TransactionOperation.Outcome,
      amount: 18.75,
      description: "SPAR",
      category: new Category({
        icon: "🛒",
        name: "Groceries",
        type: TransactionOperation.Outcome,
      }),
    }),
  },
};

export const InTransaction: Story = {
  args: {
    transaction: new Transaction({
      id: new Id(),
      date: new Day("2024-09-01"),
      paymentMethod: new PaymentMethod({ icon: "💳", name: "Credit card" }),
      operation: TransactionOperation.Income,
      amount: 1809.75,
      description: "SPAR",
      category: new Category({
        icon: "💰",
        name: "Salary",
        type: TransactionOperation.Income,
      }),
    }),
  },
};
