import type { Meta, StoryObj } from "@storybook/react";

import { CardWithHeader } from "./Card";

const meta = {
  title: "Common/CardWithHeader",
  component: CardWithHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CardWithHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {
  args: {
    title: "Monthly Summary",
    children: "Total expenses: €1,250.00",
  },
};

export const WithFooter: Story = {
  args: {
    title: "Transaction Details",
    children: "Supermarket purchase for €45.20",
    footer: "Last updated: today",
  },
};

export const WithCustomHeader: Story = {
  args: {
    header: "🗂️ Categories",
    children: "Manage your income and outcome categories here.",
  },
};
