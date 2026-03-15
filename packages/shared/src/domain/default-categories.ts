import {Category} from "./models";
import {OperationType} from "./operation-type";

export function generateDefaultOutcomeCategories(): Category[] {
  return [
    new Category({
      icon: "🏠",
      name: "Rent",
      type: OperationType.Outcome,
    }),
    new Category({
      icon: "🛒",
      name: "Groceries",
      type: OperationType.Outcome,
    }),
    new Category({
      icon: "🚗",
      name: "Transportation",
      type: OperationType.Outcome,
    }),
    new Category({
      icon: "🎉",
      name: "Entertainment",
      type: OperationType.Outcome,
    }),
    new Category({
      icon: "🎁",
      name: "Gifts",
      type: OperationType.Outcome,
    }),
  ];
}

export function generateDefaultIncomeCategories(): Category[] {
  return [
    new Category({
      icon: "💼",
      name: "Salary",
      type: OperationType.Income,
    }),
    new Category({
      icon: "🧑‍💻",
      name: "Freelancing",
      type: OperationType.Income,
    }),
    new Category({
      icon: "📈",
      name: "Investments",
      type: OperationType.Income,
    }),
    new Category({
      icon: "🎁",
      name: "Gifts",
      type: OperationType.Income,
    }),
  ];
}

export function generateDefaultCategories(): Category[] {
  return [
    ...generateDefaultIncomeCategories(),
    ...generateDefaultOutcomeCategories(),
  ]
}
