import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";

import { EditPaymentMethodForm } from "./EditPaymentMethodForm";

const paymentMethods = generateDefaultPaymentMethods();

const meta = {
  title: "PaymentMethods/EditPaymentMethodForm",
  component: EditPaymentMethodForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditPaymentMethodForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    paymentMethod: paymentMethods[0],
    onSubmit: fn(),
    onSuccess: fn(),
    onError: fn(),
  },
};

export const WithBizum: Story = {
  args: {
    paymentMethod: paymentMethods[2],
    onSubmit: fn(),
    onSuccess: fn(),
    onError: fn(),
  },
};
