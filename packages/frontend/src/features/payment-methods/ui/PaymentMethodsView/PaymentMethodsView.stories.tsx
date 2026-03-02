import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { generateDefaultPaymentMethods } from "@gualet/shared";
import { Router } from "wouter";

import { PaymentMethodsView } from "./PaymentMethodsView";
import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "../../application/cases";

const paymentMethods = generateDefaultPaymentMethods();

const getAllPaymentMethodsUseCase = {
  exec: fn().mockResolvedValue(paymentMethods),
} as unknown as GetAllPaymentMethodsUseCase;

const emptyUseCase = {
  exec: fn().mockResolvedValue([]),
} as unknown as GetAllPaymentMethodsUseCase;

const deletePaymentMethodUseCase = {
  exec: fn().mockResolvedValue(undefined),
} as unknown as DeletePaymentMethodUseCase;

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/payment-methods", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "PaymentMethods/PaymentMethodsView",
  component: PaymentMethodsView,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof PaymentMethodsView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** List with delete and edit actions. */
export const WithPaymentMethods: Story = {
  args: { getAllPaymentMethodsUseCase, deletePaymentMethodUseCase },
};

/** Empty state — no payment methods yet. */
export const Empty: Story = {
  args: {
    getAllPaymentMethodsUseCase: emptyUseCase,
    deletePaymentMethodUseCase,
  },
};
