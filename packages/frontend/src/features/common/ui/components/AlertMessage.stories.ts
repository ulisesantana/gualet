import type { Meta, StoryObj } from "@storybook/react";

import { AlertMessage } from "./Layout";

const meta = {
  title: "Common/AlertMessage",
  component: AlertMessage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["info", "warning", "success", "error"],
    },
  },
} satisfies Meta<typeof AlertMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    status: "info",
    children: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    status: "success",
    children: "Operation completed successfully!",
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    children: "Please review your data before proceeding.",
  },
};

export const Error: Story = {
  args: {
    status: "error",
    children: "Something went wrong. Please try again.",
  },
};

export const WithTitle: Story = {
  args: {
    status: "error",
    title: "Login failed",
    children: "Invalid email or password. Please check your credentials.",
  },
};
