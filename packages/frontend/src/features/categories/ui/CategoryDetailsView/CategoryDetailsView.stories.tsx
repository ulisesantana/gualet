import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultIncomeCategories } from "@gualet/shared";
import { Router } from "wouter";

import { CategoryDetailsView } from "./CategoryDetailsView";
import {
  GetCategoryUseCase,
  SaveCategoryUseCase,
} from "../../application/cases";

const [category] = generateDefaultIncomeCategories();

const getCategoryUseCase = {
  exec: fn().mockResolvedValue(category),
} as unknown as GetCategoryUseCase;

const notFoundUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as GetCategoryUseCase;

const saveCategoryUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SaveCategoryUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/categories/1", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "Categories/CategoryDetailsView",
  component: CategoryDetailsView,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof CategoryDetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Loaded category ready to be edited. */
export const WithCategory: Story = {
  args: { getCategoryUseCase, saveCategoryUseCase },
};

/** Category ID not found in the backend. */
export const NotFound: Story = {
  args: { getCategoryUseCase: notFoundUseCase, saveCategoryUseCase },
};
