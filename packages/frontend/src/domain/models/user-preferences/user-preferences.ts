import { generateDefaultPaymentMethods, PaymentMethod } from "@gualet/shared";

export interface UserPreferences {
  defaultPaymentMethod: PaymentMethod;
}

export const defaultUserPreferences: UserPreferences = {
  defaultPaymentMethod: generateDefaultPaymentMethods()[0],
};
