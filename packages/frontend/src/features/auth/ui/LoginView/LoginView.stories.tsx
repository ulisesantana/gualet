import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";

import { LoginUseCase } from "../../application/cases";
import { LoginDemoUseCase } from "../../application/login-demo";
import { AuthProvider } from "../AuthContext";
import { LoginForm } from "./LoginView";

const successLoginUseCase = {
  exec: fn().mockResolvedValue({ success: true }),
} as unknown as LoginUseCase;

const failedLoginUseCase = {
  exec: fn().mockResolvedValue({
    success: false,
    error: "Invalid email or password",
  }),
} as unknown as LoginUseCase;

const successDemoUseCase = {
  exec: fn().mockResolvedValue({ success: true }),
} as unknown as LoginDemoUseCase;

const withProviders = (Story: React.ComponentType) => (
  <Router hook={() => ["/login", () => {}] as any}>
    <AuthProvider>
      <Story />
    </AuthProvider>
  </Router>
);

const meta = {
  title: "Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withProviders],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loginUseCase: successLoginUseCase,
    loginDemoUseCase: successDemoUseCase,
  },
};

export const WithError: Story = {
  name: "With Login Error",
  args: {
    loginUseCase: failedLoginUseCase,
    loginDemoUseCase: successDemoUseCase,
  },
};
