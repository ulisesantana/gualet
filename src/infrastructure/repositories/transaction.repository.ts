import { TransactionRepository } from "@application/repositories";
import { GoogleSheetsDataSource } from "@infrastructure/data-sources";
import {
  Category,
  Day,
  Id,
  PaymentMethod,
  Transaction,
  UserSettings,
  TransactionOperation,
} from "@domain/models";

export class TransactionRepositoryImplementation
  implements TransactionRepository
{
  constructor(private gs: GoogleSheetsDataSource) {}

  async save(transaction: Transaction): Promise<void> {
    const incomeCategory = transaction.isOutcome()
      ? ""
      : transaction.category.id.toString();
    const outcomeCategory = transaction.isOutcome()
      ? transaction.category.id.toString()
      : "";
    await this.gs.append("transactions!A1:J1", {
      values: [
        [
          transaction.id.toString(),
          transaction.date.toString(),
          transaction.paymentMethod,
          transaction.operation,
          outcomeCategory,
          incomeCategory,
          Number(transaction.amount),
          transaction.date.getFormatedMonth(),
          transaction.date.getFormatedDate(),
          transaction.description,
        ],
      ],
    });
  }

  async findLast(limit: number): Promise<Transaction[]> {
    const result = await this.gs.getValuesFromRange(
      `Movimientos!A2:J${1 + limit}`,
    );
    return result.map(
      ([
        id,
        timestamp,
        type,
        operation,
        category_out,
        category_in,
        amount,
        description,
      ]: string[]) =>
        new Transaction({
          id: new Id(id),
          date: new Day(timestamp),
          paymentMethod: new PaymentMethod({ name: type }),
          operation: operation as TransactionOperation,
          amount: Number(amount.replaceAll(".", "").replace(",", ".")),
          description,
          category:
            operation === TransactionOperation.Income
              ? new Category({
                  name: category_in,
                  type: TransactionOperation.Income,
                })
              : new Category({
                  name: category_out,
                  type: TransactionOperation.Outcome,
                }),
        }),
    );
  }

  async fetchTransactionConfig(): Promise<UserSettings> {
    const settings: UserSettings = {
      incomeCategories: [],
      outcomeCategories: [],
      paymentMethods: [],
    };
    const result = await this.gs.getValuesFromRange(`settings!A2:C100`);

    for (const [outcomeCategory, incomeCategory, type] of result) {
      outcomeCategory && settings.outcomeCategories.push(outcomeCategory);
      incomeCategory && settings.incomeCategories.push(incomeCategory);
      type && settings.paymentMethods.push(type);
    }

    return settings;
  }
}
