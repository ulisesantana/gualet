import { Id, Transaction, TransactionConfig } from "@domain/models";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;

  findById(id: Id): Promise<Transaction>;

  findLast(limit: number): Promise<Transaction[]>;

  fetchTransactionConfig(): Promise<TransactionConfig>;

  remove(id: Id): Promise<void>;
}
