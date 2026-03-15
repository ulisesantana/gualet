import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/blocks";

import { AddCategoryView } from "./AddCategoryView";
import { SaveCategoryUseCase } from "../../application/cases";

const successSaveCategoryUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SaveCategoryUseCase;

const failedSaveCategoryUseCase = {
  exec: fn().mockRejectedValue(new Error("Failed to save category")),
} as unknown as SaveCategoryUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/categories/add", () => {}] as any}>
    <Story />
  </Router>
);

/**
 * `AddCategoryView` renders the full page view for creating a new category.
 *
 * It wraps `AddCategoryForm` and handles:
 * - Calling the `saveCategoryUseCase` on submit
 * - Refreshing the category store on success
 * - Redirecting to `/categories` after a successful save
 * - Displaying inline error messages via the form's `AlertMessage`
 */
const meta = {
  title: "Categories/AddCategoryView",
  component: AddCategoryView,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof AddCategoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default form ready to create a new category. */
export const Default: Story = {
  args: {
    saveCategoryUseCase: successSaveCategoryUseCase,
  },
};

/** Simulates a backend error when saving. The form will display an error message. */
export const WithSaveError: Story = {
  name: "With Save Error",
  args: {
    saveCategoryUseCase: failedSaveCategoryUseCase,
  },
};
