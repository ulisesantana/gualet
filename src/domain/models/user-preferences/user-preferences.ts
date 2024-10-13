import { defaultPaymentMethods, PaymentMethod } from "@domain/models";

export interface UserPreferences {
  defaultPaymentMethod: PaymentMethod;
}

export const defaultUserPreferences: UserPreferences = {
  defaultPaymentMethod: defaultPaymentMethods[0],
};
