import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { Router } from "wouter";

import { CategoriesView } from "./CategoriesView";
import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "../../application/cases";

const incomeCategories = generateDefaultIncomeCategories();
const outcomeCategories = generateDefaultOutcomeCategories();
const allCategories = [...incomeCategories, ...outcomeCategories];

const getAllCategoriesUseCase = {
  exec: fn().mockResolvedValue(allCategories),
} as unknown as GetAllCategoriesUseCase;

const emptyUseCase = {
  exec: fn().mockResolvedValue([]),
} as unknown as GetAllCategoriesUseCase;

const deleteCategoryUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as DeleteCategoryUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/categories", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "Categories/CategoriesView",
  component: CategoriesView,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof CategoriesView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full list of income and outcome categories. */
export const WithCategories: Story = {
  args: { getAllCategoriesUseCase, deleteCategoryUseCase },
};

/** Empty state — no categories created yet. */
export const Empty: Story = {
  args: { getAllCategoriesUseCase: emptyUseCase, deleteCategoryUseCase },
};
