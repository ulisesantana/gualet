import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";

import { AddPaymentMethodView } from "./AddPaymentMethodView";
import { SavePaymentMethodUseCase } from "../../application/cases";

const savePaymentMethodUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SavePaymentMethodUseCase;

const failedUseCase = {
  exec: fn().mockRejectedValue(new Error("Failed to save payment method")),
} as unknown as SavePaymentMethodUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/payment-methods/add", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "PaymentMethods/AddPaymentMethodView",
  component: AddPaymentMethodView,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof AddPaymentMethodView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default form to create a payment method. */
export const Default: Story = {
  args: { savePaymentMethodUseCase },
};

/** Simulates a backend error displayed inline in the form. */
export const WithSaveError: Story = {
  name: "With Save Error",
  args: { savePaymentMethodUseCase: failedUseCase },
};
