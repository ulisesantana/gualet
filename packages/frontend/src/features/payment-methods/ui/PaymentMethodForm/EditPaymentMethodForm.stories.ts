import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";

import { EditPaymentMethodForm } from "./EditPaymentMethodForm";

const paymentMethods = generateDefaultPaymentMethods();
const sharedArgs = {
  onSubmit: fn(),
  onSuccess: fn(),
  onError: fn(),
};

const meta = {
  title: "PaymentMethods/EditPaymentMethodForm",
  component: EditPaymentMethodForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: sharedArgs,
} satisfies Meta<typeof EditPaymentMethodForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Form pre-filled with the first default payment method. */
export const Default: Story = {
  args: {
    paymentMethod: paymentMethods[0],
  },
};

/** Form pre-filled with Bizum, which includes a custom color. */
export const WithColor: Story = {
  args: {
    paymentMethod: paymentMethods[2],
  },
};
