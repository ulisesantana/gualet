import { Id } from "../id/id";
import { TransactionOperation } from "../transaction/transaction";

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
    icon: "🏠",
    name: "Rent",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    icon: "🛒",
    name: "Groceries",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    icon: "🚗",
    name: "Transportation",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    icon: "🎉",
    name: "Entertainment",
    type: TransactionOperation.Outcome,
  }),
  new Category({
    icon: "🎁",
    name: "Gifts",
    type: TransactionOperation.Outcome,
  }),
];

export const defaultIncomeCategories = [
  new Category({
    icon: "💼",
    name: "Salary",
    type: TransactionOperation.Income,
  }),
  new Category({
    icon: "🧑‍💻",
    name: "Freelancing",
    type: TransactionOperation.Income,
  }),
  new Category({
    icon: "📈",
    name: "Investments",
    type: TransactionOperation.Income,
  }),
  new Category({
    icon: "🎁",
    name: "Gifts",
    type: TransactionOperation.Income,
  }),
];
