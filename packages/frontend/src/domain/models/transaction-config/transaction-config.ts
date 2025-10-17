import {
  Category,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  PaymentMethod,
} from "@gualet/shared";

export interface TransactionConfig {
  paymentMethods: PaymentMethod[];
  incomeCategories: Category[];
  outcomeCategories: Category[];
}

export const defaultTransactionConfig: TransactionConfig = {
  paymentMethods: generateDefaultPaymentMethods(),
  incomeCategories: generateDefaultIncomeCategories(),
  outcomeCategories: generateDefaultOutcomeCategories(),
};
