import { Category } from "./category";

export interface TransactionConfig {
  types: string[];
  incomeCategories: Category[];
  outcomeCategories: Category[];
}
