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
} satisfies Meta<typeof AddPaymentMethodForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: fn(),
    onSuccess: fn(),
    onError: fn(),
  },
};
