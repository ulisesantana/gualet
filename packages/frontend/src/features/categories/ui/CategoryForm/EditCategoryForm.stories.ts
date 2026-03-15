import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultIncomeCategories } from "@gualet/shared";

import { EditCategoryForm } from "./EditCategoryForm";

const [category] = generateDefaultIncomeCategories();

const meta = {
  title: "Categories/EditCategoryForm",
  component: EditCategoryForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditCategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Form pre-filled with an existing category ready to edit. */
export const Default: Story = {
  args: {
    category,
    onSubmit: fn().mockResolvedValue(undefined),
    onSuccess: fn(),
    onError: fn(),
  },
};

/** Simulates a backend save error displayed inline. */
export const WithSaveError: Story = {
  name: "With Save Error",
  args: {
    category,
    onSubmit: fn().mockRejectedValue(new Error("Failed to save category")),
    onSuccess: fn(),
    onError: fn(),
  },
};
