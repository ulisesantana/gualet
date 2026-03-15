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

import { ReportView } from "./ReportView";
import { GetReportUseCase } from "../../application/cases";
import { Report } from "../../domain";

const pm = generateDefaultPaymentMethods();
const ic = generateDefaultIncomeCategories();
const oc = generateDefaultOutcomeCategories();

const reportWithData = new Report({
  from: new Day("2024-09-01"),
  to: new Day("2024-09-30"),
  transactions: [
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
    new Transaction({
      id: new Id(),
      date: new Day("2024-09-03"),
      paymentMethod: pm[1],
      operation: OperationType.Outcome,
      amount: 22.5,
      description: "La Tasca Restaurant",
      category: oc[1],
    }),
  ],
});

const emptyReport = new Report({
  from: new Day("2024-10-01"),
  to: new Day("2024-10-31"),
  transactions: [],
});

const meta = {
  title: "Reports/ReportView",
  component: ReportView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ReportView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Report with income and outcome data grouped by category for September 2024. */
export const WithData: Story = {
  args: {
    getReportUseCase: {
      exec: fn().mockResolvedValue(reportWithData),
    } as unknown as GetReportUseCase,
  },
};

/** Report for a period with no transactions — shows "No data". */
export const NoData: Story = {
  args: {
    getReportUseCase: {
      exec: fn().mockResolvedValue(emptyReport),
    } as unknown as GetReportUseCase,
  },
};
