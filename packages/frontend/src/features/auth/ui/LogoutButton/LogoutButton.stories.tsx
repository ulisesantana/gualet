import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";

import { AuthContext } from "../AuthContext";
import { LogoutUseCase } from "../../application/cases";
import { LogoutButton } from "./LogoutButton";

const successLogoutUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as LogoutUseCase;

const failedLogoutUseCase = {
  exec: fn().mockRejectedValue(new Error("Logout failed. Please try again.")),
} as unknown as LogoutUseCase;

const withProviders = (Story: React.ComponentType) => (
  <Router hook={() => ["/settings", () => {}] as any}>
    <AuthContext.Provider
      value={{ isAuthenticated: true, setIsAuthenticated: fn(), logout: fn() }}
    >
      <Story />
    </AuthContext.Provider>
  </Router>
);

const meta = {
  title: "Auth/LogoutButton",
  component: LogoutButton,
  parameters: {
    layout: "centered",
  },

  decorators: [withProviders],
} satisfies Meta<typeof LogoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard logout button. Clicking it executes the use case and redirects to /login. */
export const Default: Story = {
  args: {
    logoutUseCase: successLogoutUseCase,
  },
};

/** Simulates a failing logout request. The button renders normally; errors are handled internally. */
export const WithFailedLogout: Story = {
  name: "With Failed Logout",
  args: {
    logoutUseCase: failedLogoutUseCase,
  },
};
