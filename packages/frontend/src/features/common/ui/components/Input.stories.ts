import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./Input";

const meta = {
  title: "Common/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    helperText: "Password must contain at least 6 characters",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address",
  },
};

export const Required: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    defaultValue: "john.doe",
    disabled: true,
  },
};
