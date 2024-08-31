import {GoogleSheetsDataSource} from "../data-sources";
import {TransactionRepository} from "../../application/repositories";
import {Transaction, TransactionOperation} from "../../domain/models";

export class TransactionRepositoryImplementation implements TransactionRepository {
  constructor(private gs: GoogleSheetsDataSource) {
  }

  async save(transaction: Transaction): Promise<void> {
    throw new Error('Missing implementation for GoogleSheetsTransactionRepository.save')
  }

  async findLast(limit: number): Promise<Transaction[]> {
    const result = await this.gs.getValuesFromRange(`transactions!A2:J${2 + limit}`)
    return result.map(([timestamp, type, operation, category_out, category_in, amount, month, day, description]: string[]) => ({
        timestamp,
        type,
        operation,
        amount,
        month,
        day,
        description,
        category: operation === TransactionOperation.In ? category_in : category_out
      } as Transaction))
  }
}
