import { Id } from "../id/id";

export interface PaymentMethodParams {
  id?: Id;
  name: string;
  icon?: string;
  color?: string;
}

export class PaymentMethod {
  readonly id: Id;
  readonly name: string;
  readonly icon: string;
  readonly color: string;

  constructor(input: PaymentMethodParams) {
    this.id = input.id || new Id();
    this.name = input.name;
    this.icon = input.icon || "";
    this.color = input.color || "#343434";
  }

  get title() {
    return this.icon ? `${this.icon} ${this.name}` : this.name;
  }
}

export const defaultPaymentMethods = [
  new PaymentMethod({
    icon: "💳",
    name: "Credit card",
  }),
  new PaymentMethod({
    icon: "💶",
    name: "Cash",
  }),
  new PaymentMethod({
    icon: "📱",
    name: "Bizum",
  }),
  new PaymentMethod({
    icon: "🏦",
    name: "Bank transfer",
  }),
];
