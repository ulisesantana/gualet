import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";
import { Router } from "wouter";

import { PaymentMethodList } from "./PaymentMethodList";

const paymentMethods = generateDefaultPaymentMethods();

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/payment-methods", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "PaymentMethods/PaymentMethodList",
  component: PaymentMethodList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} satisfies Meta<typeof PaymentMethodList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPaymentMethods: Story = {
  args: {
    paymentMethods,
  },
};

export const Empty: Story = {
  args: {
    paymentMethods: [],
  },
};

export const WithDeleteAction: Story = {
  args: {
    paymentMethods,
    onDeletePaymentMethod: fn(),
  },
};
