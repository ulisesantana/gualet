import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  Id,
  OperationType,
  Transaction,
} from "@gualet/shared";
import { Router } from "wouter";

import { TransactionDetailsView } from "./TransactionDetailsView";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "../../application/cases";

const pm = generateDefaultPaymentMethods();
const ic = generateDefaultIncomeCategories();
const oc = generateDefaultOutcomeCategories();
const tid = new Id();
const tx = new Transaction({
  id: tid,
  date: new Day("2024-09-01"),
  paymentMethod: pm[0],
  operation: OperationType.Outcome,
  amount: 45.8,
  description: "SPAR Supermarket",
  category: oc[0],
});
const cfg = { incomeCategories: ic, outcomeCategories: oc, paymentMethods: pm };
const transactionRoute = `/transactions/${tid.toString()}`;

const getLastTransactionsUseCase = {
  exec: fn().mockResolvedValue([tx]),
} as unknown as GetLastTransactionsUseCase;

const getTransactionUseCase = {
  exec: fn().mockResolvedValue(tx),
} as unknown as GetTransactionUseCase;

const getTransactionConfigUseCase = {
  exec: fn().mockResolvedValue(cfg),
} as unknown as GetTransactionConfigUseCase;

const saveTransactionUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SaveTransactionUseCase;

const removeTransactionUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as RemoveTransactionUseCase;

const meta = {
  title: "Transactions/TransactionDetailsView",
  component: TransactionDetailsView,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story: React.ComponentType) => (
      <Router hook={() => [transactionRoute, () => {}] as any}>
        <Story />
      </Router>
    ),
  ],
} satisfies Meta<typeof TransactionDetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Transaction loaded and ready to edit or delete. */
export const WithTransaction: Story = {
  args: {
    getLastTransactionsUseCase,
    getTransactionUseCase,
    getTransactionConfigUseCase,
    saveTransactionUseCase,
    removeTransactionUseCase,
  },
};
