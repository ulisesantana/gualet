import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";
import { Router } from "wouter";

import { PaymentMethodDetailsView } from "./PaymentMethodDetailsView";
import {
  GetPaymentMethodUseCase,
  SavePaymentMethodUseCase,
} from "../../application/cases";

const [paymentMethod] = generateDefaultPaymentMethods();

const getPaymentMethodUseCase = {
  exec: fn().mockResolvedValue(paymentMethod),
} as unknown as GetPaymentMethodUseCase;

const notFoundUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as GetPaymentMethodUseCase;

const savePaymentMethodUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as SavePaymentMethodUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/payment-methods/1", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "PaymentMethods/PaymentMethodDetailsView",
  component: PaymentMethodDetailsView,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof PaymentMethodDetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Loaded payment method ready to edit. */
export const WithPaymentMethod: Story = {
  args: { getPaymentMethodUseCase, savePaymentMethodUseCase },
};

/** Payment method ID not found in the backend. */
export const NotFound: Story = {
  args: { getPaymentMethodUseCase: notFoundUseCase, savePaymentMethodUseCase },
};
