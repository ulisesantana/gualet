import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";

import { SignUpUseCase } from "../../application/cases";
import { AuthProvider } from "../AuthContext";
import { RegisterForm } from "./RegisterView";

const successSignUpUseCase = {
  exec: fn().mockResolvedValue({ success: true }),
} as unknown as SignUpUseCase;

const failedSignUpUseCase = {
  exec: fn().mockResolvedValue({
    success: false,
    error: "Email already in use",
  }),
} as unknown as SignUpUseCase;

const withProviders = (Story: React.ComponentType) => (
  <Router hook={() => ["/register", () => {}] as any}>
    <AuthProvider>
      <Story />
    </AuthProvider>
  </Router>
);

const meta = {
  title: "Auth/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withProviders],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    signUpUseCase: successSignUpUseCase,
  },
};

export const WithError: Story = {
  name: "With Registration Error",
  args: {
    signUpUseCase: failedSignUpUseCase,
  },
};
