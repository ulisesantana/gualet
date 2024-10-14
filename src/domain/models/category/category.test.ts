import { describe, it, expect } from "vitest";
import {
  Id,
  TransactionOperation,
  Category,
  defaultOutcomeCategories,
  defaultIncomeCategories,
} from "@domain/models";

describe("Category", () => {
  it("should create a category with the correct properties", () => {
    const category = new Category({
      name: "Groceries",
      type: TransactionOperation.Outcome,
      icon: "🛒",
    });

    expect(category.id).toBeInstanceOf(Id);
    expect(category.name).toBe("Groceries");
    expect(category.type).toBe(TransactionOperation.Outcome);
    expect(category.icon).toBe("🛒");
    expect(category.title).toBe("🛒 Groceries");
  });

  it("should create a category without an icon", () => {
    const category = new Category({
      name: "Savings",
      type: TransactionOperation.Income,
    });

    expect(category.icon).toBe("");
    expect(category.title).toBe("Savings");
  });

  it("should return the correct default outcome categories", () => {
    expect(defaultOutcomeCategories).toHaveLength(5);
    expect(defaultOutcomeCategories[0].title).toBe("🏠 Rent");
    expect(defaultOutcomeCategories[1].title).toBe("🛒 Groceries");
  });

  it("should return the correct default income categories", () => {
    expect(defaultIncomeCategories).toHaveLength(4);
    expect(defaultIncomeCategories[0].title).toBe("💼 Salary");
    expect(defaultIncomeCategories[1].title).toBe("🧑‍💻 Freelancing");
  });
});
