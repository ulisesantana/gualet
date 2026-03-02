import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";
import { Router } from "wouter";
import { GetAllPaymentMethodsUseCase } from "@payment-methods";
import {
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
} from "@settings";
import { LogoutUseCase } from "@auth";
import { AuthContext } from "@features/auth/ui/AuthContext";

import { SettingsView } from "./SettingsView";

const paymentMethods = generateDefaultPaymentMethods();
const [defaultPaymentMethod] = paymentMethods;

const getAllPaymentMethodsUseCase = {
  exec: fn().mockResolvedValue(paymentMethods),
} as unknown as GetAllPaymentMethodsUseCase;

const getUserPreferencesUseCase = {
  exec: fn().mockResolvedValue({ defaultPaymentMethod, language: "en" }),
} as unknown as GetUserPreferencesUseCase;

const noPreferencesUseCase = {
  exec: fn().mockResolvedValue(null),
} as unknown as GetUserPreferencesUseCase;

const saveUserPreferencesUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SaveUserPreferencesUseCase;

const logoutUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as LogoutUseCase;

const withProviders = (Story: React.ComponentType) => (
  <Router hook={() => ["/settings", () => {}] as any}>
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        setIsAuthenticated: fn(),
        logout: fn(),
      }}
    >
      <Story />
    </AuthContext.Provider>
  </Router>
);

const meta = {
  title: "Settings/SettingsView",
  component: SettingsView,
  parameters: { layout: "fullscreen" },
  decorators: [withProviders],
} satisfies Meta<typeof SettingsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Settings page fully loaded with saved user preferences. */
export const WithPreferences: Story = {
  args: {
    getAllPaymentMethodsUseCase,
    getUserPreferencesUseCase,
    saveUserPreferencesUseCase,
    logoutUseCase,
  },
};

/** Settings page when no preferences have been saved yet. */
export const NoPreferences: Story = {
  args: {
    getAllPaymentMethodsUseCase,
    getUserPreferencesUseCase: noPreferencesUseCase,
    saveUserPreferencesUseCase,
    logoutUseCase,
  },
};
