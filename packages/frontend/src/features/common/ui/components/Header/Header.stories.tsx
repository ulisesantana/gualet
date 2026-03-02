import type { Meta, StoryObj } from "@storybook/react";
import { Router } from "wouter";

import { Header } from "./Header";

const meta = {
  title: "Common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnProtectedRoute: Story = {
  name: "On Protected Route (shows settings icon)",
  decorators: [
    (Story) => (
      <Router hook={() => ["/", () => {}] as any}>
        <Story />
      </Router>
    ),
  ],
};

export const OnLoginPage: Story = {
  name: "On Login Page (hides settings icon)",
  decorators: [
    (Story) => (
      <Router hook={() => ["/login", () => {}] as any}>
        <Story />
      </Router>
    ),
  ],
};
