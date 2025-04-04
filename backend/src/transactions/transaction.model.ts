import { Id, OperationType } from '@src/common/domain';
import { Category } from '@src/categories';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';
import { TimeString } from '@src/common/types';

interface Input {
  id?: Id | string;
  amount: number;
  category: Category;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethod: PaymentMethod;
}

export class Transaction {
  readonly id: Id;
  readonly amount: number;
  readonly category: Category;
  readonly date: TimeString;
  readonly description: string;
  readonly operation: OperationType;
  readonly paymentMethod: PaymentMethod;

  constructor(input: Input) {
    this.id = new Id(input.id);
    this.amount = input.amount;
    this.category = input.category;
    this.date = input.date;
    this.description = (input.description || '').trim();
    this.operation = input.operation;
    this.paymentMethod = input.paymentMethod;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      amount: this.amount,
      category: this.category.toJSON(),
      date: this.date,
      description: this.description,
      operation: this.operation,
      paymentMethod: this.paymentMethod.toJSON(),
    };
  }
}
