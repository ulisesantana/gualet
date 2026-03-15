import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { TransactionBuilder } from "@test/builders";
import { describe, expect, it } from "vitest";

import { CategoryReport } from "./category-report";

describe("CategoryReport", () => {
  const incomeCategory1 = generateDefaultIncomeCategories()[0];
  const incomeCategory2 = generateDefaultIncomeCategories()[1];
  const outcomeCategory1 = generateDefaultOutcomeCategories()[0];
  const outcomeCategory2 = generateDefaultOutcomeCategories()[1];

  describe("constructor", () => {
    it("should calculate total from empty transaction list", () => {
      const report = new CategoryReport([]);

      expect(report.total).toBe(0);
      expect(report.totalByCategories).toHaveLength(0);
    });

    it("should calculate total from single income transaction", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(incomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(100);
      expect(report.totalByCategories).toHaveLength(1);
      expect(report.totalByCategories[0][0]).toBe(100);
      expect(report.totalByCategories[0][1].id).toBe(incomeCategory1.id);
    });

    it("should calculate total from single outcome transaction", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(50)
          .withCategory(outcomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(-50);
      expect(report.totalByCategories).toHaveLength(1);
      expect(report.totalByCategories[0][0]).toBe(-50);
      expect(report.totalByCategories[0][1].id).toBe(outcomeCategory1.id);
    });

    it("should group multiple transactions by category", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(150)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(75)
          .withCategory(incomeCategory2)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(325);
      expect(report.totalByCategories).toHaveLength(2);

      // Should be sorted by amount (ascending)
      const [firstCat, secondCat] = report.totalByCategories;
      expect(firstCat[0]).toBe(75); // incomeCategory2
      expect(firstCat[1].id).toBe(incomeCategory2.id);
      expect(secondCat[0]).toBe(250); // incomeCategory1
      expect(secondCat[1].id).toBe(incomeCategory1.id);
    });

    it("should handle outcome transactions with negative totals", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(outcomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(50)
          .withCategory(outcomeCategory2)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(-150);
      expect(report.totalByCategories).toHaveLength(2);
      expect(report.totalByCategories[0][0]).toBe(-100);
      expect(report.totalByCategories[1][0]).toBe(-50);
    });

    it("should handle mixed income and outcome transactions", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(200)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(outcomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(50)
          .withCategory(incomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      // Total: 200 + 50 - 100 = 150
      expect(report.total).toBe(150);
      expect(report.totalByCategories).toHaveLength(2);

      // Sorted by amount (ascending): -100, 250
      expect(report.totalByCategories[0][0]).toBe(-100);
      expect(report.totalByCategories[0][1].id).toBe(outcomeCategory1.id);
      expect(report.totalByCategories[1][0]).toBe(250);
      expect(report.totalByCategories[1][1].id).toBe(incomeCategory1.id);
    });

    it("should maintain numerical precision with decimal amounts", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(10.55)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(20.33)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(5.12)
          .withCategory(incomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      // 10.55 + 20.33 + 5.12 = 36.00
      expect(report.total).toBe(36);
      expect(report.totalByCategories[0][0]).toBe(36);
    });

    it("should round totals to 2 decimal places", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(10.555)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(20.333)
          .withCategory(incomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      // Should round to 2 decimals
      expect(report.total).toBe(30.89);
      expect(report.totalByCategories[0][0]).toBe(30.89);
    });

    it("should sort categories by total amount (ascending)", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(500)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(incomeCategory2)
          .build(),
        new TransactionBuilder()
          .withAmount(300)
          .withCategory(outcomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      // Sorted: -300, 100, 500
      expect(report.totalByCategories).toHaveLength(3);
      expect(report.totalByCategories[0][0]).toBe(-300);
      expect(report.totalByCategories[1][0]).toBe(100);
      expect(report.totalByCategories[2][0]).toBe(500);
    });

    it("should handle large numbers correctly", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(1000000)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(500000)
          .withCategory(outcomeCategory1)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(500000);
      expect(report.totalByCategories).toHaveLength(2);
    });

    it("should handle zero amount transactions", () => {
      const transactions = [
        new TransactionBuilder()
          .withAmount(0)
          .withCategory(incomeCategory1)
          .build(),
        new TransactionBuilder()
          .withAmount(100)
          .withCategory(incomeCategory2)
          .build(),
      ];

      const report = new CategoryReport(transactions);

      expect(report.total).toBe(100);
      expect(report.totalByCategories).toHaveLength(2);
      expect(report.totalByCategories[0][0]).toBe(0);
      expect(report.totalByCategories[1][0]).toBe(100);
    });
  });
});
