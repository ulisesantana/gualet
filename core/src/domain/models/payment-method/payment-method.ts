import {Id} from "../id";

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

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
      icon: this.icon,
      color: this.color,
    };
  }
}
