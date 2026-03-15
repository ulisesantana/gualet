import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { AddCategoryForm } from "./AddCategoryForm";

const meta = {
  title: "Categories/AddCategoryForm",
  component: AddCategoryForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AddCategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form ready to create a new category. */
export const Default: Story = {
  args: {
    onSubmit: fn().mockResolvedValue(undefined),
  },
};

/** Simulates a backend save error displayed inline. */
export const WithSaveError: Story = {
  name: "With Save Error",
  args: {
    onSubmit: fn().mockRejectedValue(new Error("Failed to save category")),
    onError: fn(),
  },
};
