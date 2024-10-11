import { Id } from "./id";

export interface PaymentMethodParams {
  id?: Id;
  name: string;
  icon?: string;
}

export class PaymentMethod {
  readonly id: Id;
  readonly name: string;
  readonly icon: string;

  constructor(input: PaymentMethodParams) {
    this.id = input.id || new Id();
    this.name = input.name;
    this.icon = input.icon || "";
  }

  get title() {
    return this.icon ? `${this.icon} ${this.name}` : this.name;
  }
}

export const defaultPaymentMethods = [
  new PaymentMethod({
    id: new Id("default-payment-method-1"),
    icon: "💳",
    name: "Credit card",
  }),
  new PaymentMethod({
    id: new Id("default-payment-method-2"),
    icon: "💶",
    name: "Cash",
  }),
  new PaymentMethod({
    id: new Id("default-payment-method-3"),
    icon: "📱",
    name: "Bizum",
  }),
  new PaymentMethod({
    id: new Id("default-payment-method-4"),
    icon: "🏦",
    name: "Bank transfer",
  }),
];
