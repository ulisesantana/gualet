import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { AddPaymentMethodForm } from "./AddPaymentMethodForm";

const meta = {
  title: "PaymentMethods/AddPaymentMethodForm",
  component: AddPaymentMethodForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof AddPaymentMethodForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form ready to create a new payment method. */
export const Default: Story = {
  args: {
    onSubmit: fn().mockResolvedValue(undefined),
  },
};

/** Simulates a backend save error displayed inline. */
export const WithSaveError: Story = {
  name: "With Save Error",
  args: {
    onSubmit: fn().mockRejectedValue(
      new Error("Failed to save payment method"),
    ),
  },
};
