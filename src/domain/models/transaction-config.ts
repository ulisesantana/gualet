import {
  Category,
  defaultIncomeCategories,
  defaultOutcomeCategories,
  defaultPaymentMethods,
  PaymentMethod,
} from "@domain/models";

export interface TransactionConfig {
  paymentMethods: PaymentMethod[];
  incomeCategories: Category[];
  outcomeCategories: Category[];
}

export const defaultTransactionConfig: TransactionConfig = {
  incomeCategories: defaultIncomeCategories,
  outcomeCategories: defaultOutcomeCategories,
  paymentMethods: defaultPaymentMethods,
};
