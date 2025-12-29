import {Category, PaymentMethod} from "./models";
import {generateDefaultPaymentMethods} from "./default-payment-methods";
import {generateDefaultIncomeCategories, generateDefaultOutcomeCategories,} from "./default-categories";

export type Language = 'en' | 'es';

export interface UserPreferences {
  defaultPaymentMethod: PaymentMethod;
  language: Language;
}

export const defaultUserPreferences: UserPreferences = {
  defaultPaymentMethod: generateDefaultPaymentMethods()[0],
  language: 'en',
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

