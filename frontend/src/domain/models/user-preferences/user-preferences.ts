import { generateDefaultPaymentMethods, PaymentMethod } from "@gualet/core";

export interface UserPreferences {
  defaultPaymentMethod: PaymentMethod;
}

export const defaultUserPreferences: UserPreferences = {
  defaultPaymentMethod: generateDefaultPaymentMethods()[0],
};
