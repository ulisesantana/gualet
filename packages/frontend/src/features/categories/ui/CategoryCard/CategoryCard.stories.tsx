import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { Router } from "wouter";

import { CategoryCard } from "./CategoryCard";

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/categories", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "Categories/CategoryCard",
  component: CategoryCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OutCategory: Story = {
  args: {
    category: generateDefaultOutcomeCategories()[0],
  },
};

export const InCategory: Story = {
  args: {
    category: generateDefaultIncomeCategories()[0],
  },
};

export const WithDeleteAction: Story = {
  args: {
    category: generateDefaultOutcomeCategories()[0],
    onDelete: fn(),
  },
};
