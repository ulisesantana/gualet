import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PaymentMethod } from "@gualet/shared";
import { Router } from "wouter";

import { PaymentMethodCard } from "./PaymentMethodCard";

const creditCard = new PaymentMethod({ icon: "💳", name: "Credit card" });
const cash = new PaymentMethod({ icon: "💶", name: "Cash" });
const bizum = new PaymentMethod({
  icon: "📱",
  name: "Bizum",
  color: "#00BFFF",
});

const withRouter = (Story: React.ComponentType) => (
  <Router hook={() => ["/payment-methods", () => {}] as any}>
    <Story />
  </Router>
);

const meta = {
  title: "PaymentMethods/PaymentMethodCard",
  component: PaymentMethodCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} satisfies Meta<typeof PaymentMethodCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    paymentMethod: creditCard,
  },
};

export const WithColor: Story = {
  args: {
    paymentMethod: bizum,
  },
};

export const WithDeleteAction: Story = {
  args: {
    paymentMethod: cash,
    onDelete: fn(),
  },
};
