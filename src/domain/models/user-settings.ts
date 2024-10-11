import { Category, PaymentMethod } from "@domain/models";

export interface UserSettings {
  paymentMethods: PaymentMethod[];
  incomeCategories: Category[];
  outcomeCategories: Category[];
}
