import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { Router } from "wouter";

import { CategoryList } from "./CategoryList";

const incomeCategories = generateDefaultIncomeCategories();
const outcomeCategories = generateDefaultOutcomeCategories();
const allCategories = [...incomeCategories, ...outcomeCategories];

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/categories", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "Categories/CategoryList",
  component: CategoryList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCategories: Story = {
  args: {
    categories: allCategories,
  },
};

export const IncomeCategories: Story = {
  args: {
    categories: incomeCategories,
  },
};

export const OutcomeCategories: Story = {
  args: {
    categories: outcomeCategories,
  },
};

export const Empty: Story = {
  args: {
    categories: [],
  },
};

export const WithDeleteAction: Story = {
  args: {
    categories: allCategories,
    onDeleteCategory: fn(),
  },
};
