import {
  Id,
  Category,
  Day,
  PaymentMethod,
  TransactionOperation,
  Transaction,
  defaultPaymentMethods, defaultOutcomeCategories
} from "@domain/models";

export class TransactionBuilder {
  private id: Id;
  private amount: number;
  private category: Category;
  private date: Day;
  private description: string;
  private operation: TransactionOperation;
  private paymentMethod: PaymentMethod;

  constructor() {
    this.id = new Id();
    this.amount = 100;
    this.category = new Category({
      ...defaultOutcomeCategories[0],
      id: new Id(defaultOutcomeCategories[0].id.toString())
    });
    this.date = new Day("2018-03-03");
    this.description = "Default Description";
    this.operation = TransactionOperation.Outcome;
    this.paymentMethod = new PaymentMethod({
      ...defaultPaymentMethods[0],
      id: new Id(defaultPaymentMethods[0].id.toString())
    });
  }

  withId(id: Id): this {
    this.id = id;
    return this;
  }

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withCategory(category: Category): this {
    this.category = category;
    this.operation = category.type
    return this;
  }

  withDate(date: Day): this {
    this.date = date;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withOperation(operation: TransactionOperation): this {
    this.operation = operation;
    return this;
  }

  withPaymentMethod(paymentMethod: PaymentMethod): this {
    this.paymentMethod = paymentMethod;
    return this;
  }

  build(): Transaction {
    return new Transaction({
      id: this.id,
      amount: this.amount,
      category: this.category,
      date: this.date,
      description: this.description,
      operation: this.operation,
      paymentMethod: this.paymentMethod,
    });
  }
}
