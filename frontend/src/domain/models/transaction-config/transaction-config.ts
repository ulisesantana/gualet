import { Category, PaymentMethod } from "@gualet/core";

export interface TransactionConfig {
  paymentMethods: PaymentMethod[];
  incomeCategories: Category[];
  outcomeCategories: Category[];
}
