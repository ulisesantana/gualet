import { OperationType } from "@gualet/core";

import { Id } from "../id/id";

export interface CategoryParams {
  id?: Id;
  name: string;
  type: OperationType;
  icon?: string;
  color?: string;
}

export class Category {
  readonly id: Id;
  readonly name: string;
  readonly type: OperationType;
  readonly icon: string;
  readonly color: string;

  constructor(input: CategoryParams) {
    this.id = input.id || new Id();
    this.name = input.name.trim();
    this.type = input.type;
    this.icon = input.icon?.trim() || "";
    this.color = input.color?.trim() || "#545454";
  }

  get title() {
    return this.icon ? `${this.icon} ${this.name}` : this.name;
  }
}

export const defaultOutcomeCategories = [
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

export const defaultIncomeCategories = [
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
