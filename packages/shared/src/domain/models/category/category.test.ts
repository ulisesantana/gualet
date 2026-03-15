import {Category} from "./category";
import {Id} from "../id";
import {OperationType} from "../../operation-type";


describe("Category", () => {
  it("should create a category with the correct properties", () => {
    const category = new Category({
      name: "Groceries",
      type: OperationType.Outcome,
      icon: "🛒",
    });

    expect(category.id).toBeInstanceOf(Id);
    expect(category.name).toBe("Groceries");
    expect(category.type).toBe(OperationType.Outcome);
    expect(category.icon).toBe("🛒");
    expect(category.title).toBe("🛒 Groceries");
  });

  it("should trim given name", () => {
    const category = new Category({
      name: " Groceries ",
      type: OperationType.Outcome,
      icon: "🛒",
    });

    expect(category.name).toBe("Groceries");
    expect(category.title).toBe("🛒 Groceries");
  });

  it("should trim given icon", () => {
    const category = new Category({
      name: " Groceries ",
      type: OperationType.Outcome,
      icon: "  🛒  ",
    });

    expect(category.icon).toBe("🛒");
    expect(category.title).toBe("🛒 Groceries");
  });

  it("should create a category without an icon", () => {
    const category = new Category({
      name: "Savings",
      type: OperationType.Income,
    });

    expect(category.icon).toBe("");
    expect(category.title).toBe("Savings");
  });
});
