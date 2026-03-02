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
import { GetUserPreferencesUseCase } from "@settings";

import { LastTransactionsView } from "./LastTransactionsView";
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
const txns = [
  new Transaction({
    id: new Id(),
    date: new Day("2024-09-01"),
    paymentMethod: pm[0],
    operation: OperationType.Income,
    amount: 1850,
    description: "September salary",
    category: ic[0],
  }),
  new Transaction({
    id: new Id(),
    date: new Day("2024-09-02"),
    paymentMethod: pm[0],
    operation: OperationType.Outcome,
    amount: 45.8,
    description: "SPAR Supermarket",
    category: oc[0],
  }),
];
const cfg = { incomeCategories: ic, outcomeCategories: oc, paymentMethods: pm };

const baseArgs = {
  getTransactionUseCase: {
    exec: fn().mockResolvedValue(txns[0]),
  } as unknown as GetTransactionUseCase,
  getTransactionConfigUseCase: {
    exec: fn().mockResolvedValue(cfg),
  } as unknown as GetTransactionConfigUseCase,
  getUserPreferencesUseCase: {
    exec: fn().mockResolvedValue({
      defaultPaymentMethod: pm[0],
      language: "en",
    }),
  } as unknown as GetUserPreferencesUseCase,
  saveTransactionUseCase: {
    exec: fn().mockResolvedValue(undefined),
  } as unknown as SaveTransactionUseCase,
  removeTransactionUseCase: {
    exec: fn().mockResolvedValue(undefined),
  } as unknown as RemoveTransactionUseCase,
};

const meta = {
  title: "Transactions/LastTransactionsView",
  component: LastTransactionsView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LastTransactionsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home view loaded with recent transactions and the add form. */
export const WithTransactions: Story = {
  args: {
    ...baseArgs,
    getLastTransactionsUseCase: {
      exec: fn().mockResolvedValue(txns),
    } as unknown as GetLastTransactionsUseCase,
  },
};

/** Home view when no transactions have been created yet. */
export const Empty: Story = {
  args: {
    ...baseArgs,
    getLastTransactionsUseCase: {
      exec: fn().mockResolvedValue([]),
    } as unknown as GetLastTransactionsUseCase,
  },
};
