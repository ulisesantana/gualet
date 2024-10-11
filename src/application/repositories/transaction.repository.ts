import { Transaction, UserSettings } from "@domain/models";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;

  findLast(limit: number): Promise<Transaction[]>;

  fetchTransactionConfig(): Promise<UserSettings>;
}
