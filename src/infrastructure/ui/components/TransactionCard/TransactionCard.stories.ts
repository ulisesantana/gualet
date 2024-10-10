import type { Meta, StoryObj } from "@storybook/react";

import { TransactionCard } from "./TransactionCard";
import { Transaction, TransactionOperation } from "../../../../domain/models";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Organisms/TransactionCard",
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
      id: "irrelevant",
      timestamp: "2024-09-01T08:30:56.110Z",
      type: "Tarjeta",
      operation: TransactionOperation.Outcome,
      amount: 18.75,
      month: "07",
      day: "24",
      description: "SPAR",
      category: "🛒 Supermercado",
    }),
  },
};

export const InTransaction: Story = {
  args: {
    transaction: new Transaction({
      id: "irrelevant",
      timestamp: "2024-09-01T08:30:56.110Z",
      type: "Transferencia bancaria",
      operation: TransactionOperation.Income,
      amount: 1809.75,
      month: "07",
      day: "28",
      description: "",
      category: "💰 Nómina",
    }),
  },
};
