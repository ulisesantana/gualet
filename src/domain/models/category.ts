import { Id } from "./id";
import { TransactionOperation } from "./transaction";

export interface CategoryParams {
  id?: Id;
  name: string;
  type: TransactionOperation;
  icon?: string;
}

export class Category {
  readonly id: Id;
  readonly name: string;
  readonly type: TransactionOperation;
  readonly icon: string;

  constructor(input: CategoryParams) {
    this.id = input.id || new Id();
    this.name = input.name;
    this.type = input.type;
    this.icon = input.icon || "";
  }

  get title() {
    return this.icon ? `${this.icon} ${this.name}` : this.name;
  }
}

export const defaultOutcomeCategories = [
  new Category({
    id: new Id("default-category-1"),
    icon: "🏠",
    name: "Rent",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    id: new Id("default-category-2"),
    icon: "🛒",
    name: "Groceries",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    id: new Id("default-category-3"),
    icon: "🚗",
    name: "Transportation",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    id: new Id("default-category-4"),
    icon: "🎉",
    name: "Entertainment",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    id: new Id("default-category-5"),
    icon: "🎁",
    name: "Gifts",
    type: TransactionOperation.Outcome,
  }),
];

export const defaultIncomeCategories = [
  new Category({
    id: new Id("default-category-6"),
    icon: "💼",
    name: "Salary",
    type: TransactionOperation.Income,
  }),
  new Category({
    id: new Id("default-category-7"),
    icon: "🧑‍💻",
    name: "Freelancing",
    type: TransactionOperation.Income,
  }),
  new Category({
    id: new Id("default-category-8"),
    icon: "📈",
    name: "Investments",
    type: TransactionOperation.Income,
  }),
  new Category({
    id: new Id("default-category-9"),
    icon: "🎁",
    name: "Gifts",
    type: TransactionOperation.Income,
  }),
];
