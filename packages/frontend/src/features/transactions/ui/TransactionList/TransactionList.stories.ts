import type { Meta, StoryObj } from "@storybook/react";
import {
  Category,
  Day,
  Id,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/shared";

import { TransactionList } from "./TransactionList";

const creditCard = new PaymentMethod({ icon: "💳", name: "Credit card" });
const cash = new PaymentMethod({ icon: "💶", name: "Cash" });

const groceries = new Category({
  icon: "🛒",
  name: "Groceries",
  type: OperationType.Outcome,
});
const salary = new Category({
  icon: "💰",
  name: "Salary",
  type: OperationType.Income,
});
const restaurant = new Category({
  icon: "👨🏻‍🍳",
  name: "Restaurant",
  type: OperationType.Outcome,
});

const sampleTransactions = [
  new Transaction({
    id: new Id(),
    date: new Day("2024-09-01"),
    paymentMethod: creditCard,
    operation: OperationType.Income,
    amount: 1850.0,
    description: "September salary",
    category: salary,
  }),
  new Transaction({
    id: new Id(),
    date: new Day("2024-09-02"),
    paymentMethod: creditCard,
    operation: OperationType.Outcome,
    amount: 45.8,
    description: "SPAR Supermarket",
    category: groceries,
  }),
  new Transaction({
    id: new Id(),
    date: new Day("2024-09-03"),
    paymentMethod: cash,
    operation: OperationType.Outcome,
    amount: 22.5,
    description: "La Tasca Restaurant",
    category: restaurant,
  }),
];

const meta = {
  title: "Transactions/TransactionList",
  component: TransactionList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TransactionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTransactions: Story = {
  args: {
    transactions: sampleTransactions,
  },
};

export const Empty: Story = {
  args: {
    transactions: [],
  },
};

export const SingleTransaction: Story = {
  args: {
    transactions: [sampleTransactions[0]],
  },
};
