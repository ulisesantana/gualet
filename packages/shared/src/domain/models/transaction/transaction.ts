import {Id} from "../id";
import {Category} from "../category/category";
import {Day} from "../day/day";
import {OperationType} from "../../operation-type";
import {PaymentMethod} from "../payment-method/payment-method";

export interface TransactionParams {
  id?: Id;
  amount: number;
  category: Category;
  date: Day;
  description?: string;
  operation: OperationType;
  paymentMethod: PaymentMethod;
}

export class Transaction {
  readonly id: Id;
  readonly amount: number;
  readonly category: Category;
  readonly date: Day;
  readonly description: string;
  readonly operation: OperationType;
  readonly paymentMethod: PaymentMethod;

  constructor(input: TransactionParams) {
    this.id = input.id || new Id();
    this.amount = input.amount;
    this.category = input.category;
    this.date = input.date;
    this.description = input.description?.trim() || "";
    this.operation = input.operation;
    this.paymentMethod = input.paymentMethod;
  }

  get amountFormatted(): string {
    return (
      (this.isOutcome() ? "-" : "") +
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(this.amount)
    );
  }

  static isOutcome(operation: OperationType): boolean {
    return operation === OperationType.Outcome;
  }

  static isIncome(operation: OperationType): boolean {
    return operation === OperationType.Income;
  }

  isOutcome(): boolean {
    return Transaction.isOutcome(this.operation);
  }

  isIncome(): boolean {
    return Transaction.isIncome(this.operation);
  }

  isNew(): boolean {
    return false;
  }

  toString(): string {
    return `Transaction${this.description ? ` "${this.description}" ` : " "}in category ${this.category.title} with an amount of ${this.amountFormatted} on ${this.date.toString("/")}, via ${this.paymentMethod.title}`;
  }
}

export class NewTransaction extends Transaction {
  constructor(input: Omit<TransactionParams, "id">) {
    super(input);
  }

  isNew(): boolean {
    return true;
  }
}
