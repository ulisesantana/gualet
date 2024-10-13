import { Id, Category, Day, PaymentMethod } from "@domain/models";

export enum TransactionOperation {
  Income = "INCOME",
  Outcome = "OUTCOME",
}

export interface TransactionParams {
  id?: Id;
  amount: number;
  category: Category;
  date: Day;
  description: string;
  operation: TransactionOperation;
  paymentMethod: PaymentMethod;
}

export class Transaction {
  readonly id: Id;
  readonly amount: number;
  readonly category: Category;
  readonly date: Day;
  readonly description: string;
  readonly operation: TransactionOperation;
  readonly paymentMethod: PaymentMethod;

  constructor(input: TransactionParams) {
    this.id = input.id || new Id();
    this.amount = input.amount;
    this.category = input.category;
    this.date = input.date;
    this.description = input.description;
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

  static isOutcome(operation: TransactionOperation): boolean {
    return operation === TransactionOperation.Outcome;
  }

  static isIncome(operation: TransactionOperation): boolean {
    return operation === TransactionOperation.Income;
  }

  isOutcome(): boolean {
    return Transaction.isOutcome(this.operation);
  }

  isIncome(): boolean {
    return Transaction.isIncome(this.operation);
  }

  toString(): string {
    return `Transaction${this.description ? ` "${this.description}" ` : " "}in category ${this.category.title} with an amount of ${this.amountFormatted} on ${this.date.toString("/")}, via ${this.paymentMethod.title}`;
  }
}
