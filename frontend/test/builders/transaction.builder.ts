import {
  Category,
  Day,
  generateDefaultOutcomeCategories,
  generateDefaultPaymentMethods,
  Id,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/core";

export class TransactionBuilder {
  private id: Id;
  private amount: number;
  private category: Category;
  private date: Day;
  private description: string;
  private operation: OperationType;
  private paymentMethod: PaymentMethod;

  constructor() {
    const [defaultCategory] = generateDefaultOutcomeCategories();
    const [defaultPaymentMethod] = generateDefaultPaymentMethods();
    this.id = new Id();
    this.amount = 100;
    this.category = new Category({
      ...defaultCategory,
    });
    this.date = new Day("2018-03-03");
    this.description = "Default Description";
    this.operation = OperationType.Outcome;
    this.paymentMethod = new PaymentMethod({
      ...defaultPaymentMethod,
    });
  }

  withId(id: Id | string): this {
    this.id = new Id(id);
    return this;
  }

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withCategory(category: Category): this {
    this.category = category;
    this.operation = category.type;
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

  withOperation(operation: OperationType): this {
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
