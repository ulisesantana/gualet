import {
  Day,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  Transaction,
} from "@domain/models";
import { TransactionBuilder } from "@test/builders";

import { Report } from "./report";

describe("Report", () => {
  const from = new Day("2023-01-01");
  const to = new Day("2023-01-31");

  it("calculates income and outcome totals correctly", () => {
    const transactions = [
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(defaultIncomeCategories[0])
        .build(),
      new TransactionBuilder()
        .withAmount(-50)
        .withCategory(defaultOutcomeCategories[1])
        .build(),
      new TransactionBuilder()
        .withAmount(-150)
        .withCategory(defaultOutcomeCategories[3])
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(defaultIncomeCategories[0])
        .build(),
    ];

    const report = new Report(from, to, transactions);

    expect(report.incomeReport.total).toBe(1500);
    expect(report.outcomeReport.total).toBe(-200);
    expect(report.total).toBe(1300);
  });

  it("groups transactions by category correctly", () => {
    const transactions = [
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(defaultIncomeCategories[0])
        .build(),
      new TransactionBuilder()
        .withAmount(50)
        .withCategory(defaultOutcomeCategories[1])
        .build(),
      new TransactionBuilder()
        .withAmount(100)
        .withCategory(defaultOutcomeCategories[1])
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(defaultIncomeCategories[0])
        .build(),
    ];

    const report = new Report(from, to, transactions);

    expect(report.incomeReport.totalByCategories).toEqual([
      [1500, defaultIncomeCategories[0]],
    ]);
    expect(report.outcomeReport.totalByCategories).toEqual([
      [150, defaultOutcomeCategories[1]],
    ]);
  });

  it("handles empty transactions list correctly", () => {
    const transactions = [] as Transaction[];
    const report = new Report(from, to, transactions);

    expect(report.incomeReport.total).toBe(0);
    expect(report.outcomeReport.total).toBe(0);
    expect(report.total).toBe(0);
  });

  it("handles transactions with multiple categories", () => {
    const transactions = [
      new TransactionBuilder()
        .withAmount(200)
        .withCategory(defaultOutcomeCategories[1])
        .build(),
      new TransactionBuilder()
        .withAmount(150)
        .withCategory(defaultOutcomeCategories[1])
        .build(),
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(defaultIncomeCategories[0])
        .build(),
      new TransactionBuilder()
        .withAmount(300)
        .withCategory(defaultOutcomeCategories[3])
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(defaultIncomeCategories[0])
        .build(),
    ];

    const report = new Report(from, to, transactions);

    expect(report.incomeReport.totalByCategories).toEqual([
      [1500, defaultIncomeCategories[0]],
    ]);
    expect(report.outcomeReport.totalByCategories).toEqual([
      [350, defaultOutcomeCategories[1]],
      [300, defaultOutcomeCategories[3]],
    ]);
  });
});
