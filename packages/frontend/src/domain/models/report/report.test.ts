import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  Transaction,
} from "@gualet/core";
import { TransactionBuilder } from "@test/builders";

import { Report } from "./report";

describe("Report", () => {
  const from = new Day("2023-01-01");
  const to = new Day("2023-01-31");

  it("calculates income and outcome totals correctly", () => {
    const transactions = [
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(generateDefaultIncomeCategories()[0])
        .build(),
      new TransactionBuilder()
        .withAmount(50)
        .withCategory(generateDefaultOutcomeCategories()[1])
        .build(),
      new TransactionBuilder()
        .withAmount(150)
        .withCategory(generateDefaultOutcomeCategories()[3])
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(generateDefaultIncomeCategories()[0])
        .build(),
    ];

    const report = new Report({ from, to, transactions });

    expect(report.incomeReport.total).toBe(1500);
    expect(report.outcomeReport.total).toBe(-200);
    expect(report.total).toBe(1300);
  });

  it("groups transactions by category correctly", () => {
    const incomeCategory = generateDefaultIncomeCategories()[0];
    const outcomeCategory = generateDefaultOutcomeCategories()[1];

    const transactions = [
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(incomeCategory)
        .build(),
      new TransactionBuilder()
        .withAmount(50)
        .withCategory(outcomeCategory)
        .build(),
      new TransactionBuilder()
        .withAmount(100)
        .withCategory(outcomeCategory)
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(incomeCategory)
        .build(),
    ];

    const report = new Report({ from, to, transactions });

    expect(report.incomeReport.totalByCategories).toHaveLength(1);
    expect(report.incomeReport.totalByCategories[0][0]).toBe(1500);
    expect(report.incomeReport.totalByCategories[0][1].id).toBe(
      incomeCategory.id,
    );

    expect(report.outcomeReport.totalByCategories).toHaveLength(1);
    expect(report.outcomeReport.totalByCategories[0][0]).toBe(-150);
    expect(report.outcomeReport.totalByCategories[0][1].id).toBe(
      outcomeCategory.id,
    );
  });

  it("handles empty transactions list correctly", () => {
    const transactions = [] as Transaction[];
    const report = new Report({ from, to, transactions });

    expect(report.incomeReport.total).toBe(0);
    expect(report.outcomeReport.total).toBe(0);
    expect(report.total).toBe(0);
  });

  it("handles transactions with multiple categories", () => {
    const incomeCategory = generateDefaultIncomeCategories()[0];
    const outcomeCategory1 = generateDefaultOutcomeCategories()[1];
    const outcomeCategory2 = generateDefaultOutcomeCategories()[3];

    const transactions = [
      new TransactionBuilder()
        .withAmount(200)
        .withCategory(outcomeCategory1)
        .build(),
      new TransactionBuilder()
        .withAmount(150)
        .withCategory(outcomeCategory1)
        .build(),
      new TransactionBuilder()
        .withAmount(1000)
        .withCategory(incomeCategory)
        .build(),
      new TransactionBuilder()
        .withAmount(300)
        .withCategory(outcomeCategory2)
        .build(),
      new TransactionBuilder()
        .withAmount(500)
        .withCategory(incomeCategory)
        .build(),
    ];

    const report = new Report({ from, to, transactions });

    expect(report.incomeReport.totalByCategories).toHaveLength(1);
    expect(report.incomeReport.totalByCategories[0][0]).toBe(1500);
    expect(report.incomeReport.totalByCategories[0][1].id).toBe(
      incomeCategory.id,
    );

    expect(report.outcomeReport.totalByCategories).toHaveLength(2);
    expect(report.outcomeReport.totalByCategories[0][0]).toBe(-350);
    expect(report.outcomeReport.totalByCategories[0][1].id).toBe(
      outcomeCategory1.id,
    );
    expect(report.outcomeReport.totalByCategories[1][0]).toBe(-300);
    expect(report.outcomeReport.totalByCategories[1][1].id).toBe(
      outcomeCategory2.id,
    );
  });
});
