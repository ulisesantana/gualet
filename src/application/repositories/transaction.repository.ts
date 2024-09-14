import {Transaction} from "../../domain/models";

export interface TransactionConfig {
  types: string[],
  incomeCategories: string[],
  outcomeCategories: string[]
}

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>

  findLast(limit: number): Promise<Transaction[]>

  fetchTransactionConfig(): Promise<TransactionConfig>
}
