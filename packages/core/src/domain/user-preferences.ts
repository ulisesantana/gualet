import {PaymentMethod} from "./models/payment-method/payment-method";
import {generateDefaultPaymentMethods} from "./default-payment-methods";
import {Category} from "./models/category/category";
import {generateDefaultIncomeCategories, generateDefaultOutcomeCategories,} from "./default-categories";

export interface UserPreferences {
  defaultPaymentMethod: PaymentMethod;
}

export const defaultUserPreferences: UserPreferences = {
  defaultPaymentMethod: generateDefaultPaymentMethods()[0],
};

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

