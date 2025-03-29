import { Id } from '@src/common/domain';
import { Nullable } from '@src/common/types';

export interface PaymentMethodInput {
  id?: Id | string;
  name: string;
  icon?: Nullable<string>;
  color?: Nullable<string>;
}

export class PaymentMethod {
  readonly id: Id;
  readonly name: string;
  readonly icon: Nullable<string>;
  readonly color: Nullable<string>;

  constructor(input: PaymentMethodInput) {
    this.id = new Id(input.id);
    this.name = input.name;
    this.icon = input.icon || null;
    this.color = input.color || null;
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
