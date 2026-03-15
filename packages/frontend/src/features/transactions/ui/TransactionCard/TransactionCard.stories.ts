import type { Meta, StoryObj } from "@storybook/react";
import {
  Category,
  Day,
  Id,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/shared";

import { TransactionCard } from "./TransactionCard";

const creditCard = new PaymentMethod({ icon: "💳", name: "Credit card" });
const cash = new PaymentMethod({ icon: "💶", name: "Cash" });

const meta = {
  title: "Transactions/TransactionCard",
  component: TransactionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TransactionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An outcome transaction (expense). */
export const OutTransaction: Story = {
  args: {
    transaction: new Transaction({
      id: new Id(),
      date: new Day("2024-09-01"),
      paymentMethod: creditCard,
      operation: OperationType.Outcome,
      amount: 18.75,
      description: "SPAR",
      category: new Category({
        icon: "🛒",
        name: "Groceries",
        type: OperationType.Outcome,
      }),
    }),
  },
};

/** An income transaction. */
export const InTransaction: Story = {
  args: {
    transaction: new Transaction({
      id: new Id(),
      date: new Day("2024-09-01"),
      paymentMethod: cash,
      operation: OperationType.Income,
      amount: 1809.75,
      description: "September salary",
      category: new Category({
        icon: "💰",
        name: "Salary",
        type: OperationType.Income,
      }),
    }),
  },
};
