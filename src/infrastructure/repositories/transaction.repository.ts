import { GoogleSheetsDataSource } from "../data-sources";
import { TransactionRepository } from "../../application/repositories";
import {
  Transaction,
  TransactionConfig,
  TransactionOperation,
} from "../../domain/models";

export class TransactionRepositoryImplementation
  implements TransactionRepository
{
  constructor(private gs: GoogleSheetsDataSource) {}

  async save(transaction: Transaction): Promise<void> {
    const incomeCategory = transaction.isOutcome() ? "" : transaction.category;
    const outcomeCategory = transaction.isOutcome() ? transaction.category : "";
    await this.gs.append("transactions!A1:J1", {
      values: [
        [
          transaction.id,
          transaction.timestamp,
          transaction.type,
          transaction.operation,
          outcomeCategory,
          incomeCategory,
          Number(transaction.amount),
          transaction.month,
          transaction.day,
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
        month,
        day,
        description,
      ]: string[]) =>
        new Transaction({
          id,
          timestamp,
          type,
          operation,
          amount: Number(amount.replaceAll(".", "").replace(",", ".")),
          month,
          day,
          description,
          category:
            operation === TransactionOperation.Income
              ? category_in
              : category_out,
        } as Transaction),
    );
  }

  async fetchTransactionConfig(): Promise<TransactionConfig> {
    const settings: TransactionConfig = {
      incomeCategories: [],
      outcomeCategories: [],
      types: [],
    };
    const result = await this.gs.getValuesFromRange(`settings!A2:C100`);

    for (const [outcomeCategory, incomeCategory, type] of result) {
      outcomeCategory && settings.outcomeCategories.push(outcomeCategory);
      incomeCategory && settings.incomeCategories.push(incomeCategory);
      type && settings.types.push(type);
    }

    return settings;
  }
}
